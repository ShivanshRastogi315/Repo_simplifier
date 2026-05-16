const fs = require('fs');
const path = require('path');

const DUMMY_REPO_DIR = path.join(__dirname, 'src', 'dummy-repo');
const MOCK_DATA_DIR = path.join(__dirname, 'src', 'mockData');
const ROOT_DIR = __dirname;

// Helper function to analyze the entire repository for Environment Doctor
function analyzeRepositoryEnvironment() {
  const analysis = {
    projectType: 'unknown',
    stack: [],
    dependencies: {},
    devDependencies: {},
    scripts: {},
    ports: [],
    envVars: [],
    databases: [],
    services: [],
    dockerized: false,
    setupSteps: [],
    commonIssues: [],
    startupCommands: []
  };

  // 1. Check for package.json (Node.js/React/Vue/Angular)
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    analysis.projectType = 'Node.js';
    analysis.dependencies = packageJson.dependencies || {};
    analysis.devDependencies = packageJson.devDependencies || {};
    analysis.scripts = packageJson.scripts || {};

    // Detect framework
    if (analysis.dependencies['react'] || analysis.devDependencies['react']) {
      analysis.stack.push('React');
      if (analysis.dependencies['react-scripts']) analysis.stack.push('Create React App');
      if (analysis.dependencies['next']) analysis.stack.push('Next.js');
      if (analysis.dependencies['vite']) analysis.stack.push('Vite');
    }
    if (analysis.dependencies['vue']) analysis.stack.push('Vue.js');
    if (analysis.dependencies['@angular/core']) analysis.stack.push('Angular');
    if (analysis.dependencies['express']) {
      analysis.stack.push('Express.js');
      analysis.services.push({ name: 'Backend API', type: 'express' });
    }
    if (analysis.dependencies['fastify']) {
      analysis.stack.push('Fastify');
      analysis.services.push({ name: 'Backend API', type: 'fastify' });
    }

    // Detect databases
    if (analysis.dependencies['mongoose']) {
      analysis.databases.push('MongoDB');
      analysis.envVars.push({ key: 'MONGODB_URI', purpose: 'MongoDB connection string' });
    }
    if (analysis.dependencies['pg'] || analysis.dependencies['postgres']) {
      analysis.databases.push('PostgreSQL');
      analysis.envVars.push({ key: 'DATABASE_URL', purpose: 'PostgreSQL connection string' });
    }
    if (analysis.dependencies['mysql'] || analysis.dependencies['mysql2']) {
      analysis.databases.push('MySQL');
      analysis.envVars.push({ key: 'MYSQL_HOST', purpose: 'MySQL host' });
    }
    if (analysis.dependencies['redis']) {
      analysis.databases.push('Redis');
      analysis.envVars.push({ key: 'REDIS_URL', purpose: 'Redis connection URL' });
    }

    // Extract port from scripts
    Object.entries(analysis.scripts).forEach(([name, script]) => {
      const portMatch = script.match(/PORT[=\s]+(\d+)|port[=\s]+(\d+)|:(\d+)/);
      if (portMatch) {
        const port = portMatch[1] || portMatch[2] || portMatch[3];
        if (!analysis.ports.includes(port)) analysis.ports.push(port);
      }
    });
  }

  // 2. Check for Python (requirements.txt, Pipfile, pyproject.toml)
  if (fs.existsSync(path.join(ROOT_DIR, 'requirements.txt'))) {
    analysis.projectType = 'Python';
    const requirements = fs.readFileSync(path.join(ROOT_DIR, 'requirements.txt'), 'utf-8');
    if (requirements.includes('django')) analysis.stack.push('Django');
    if (requirements.includes('flask')) analysis.stack.push('Flask');
    if (requirements.includes('fastapi')) analysis.stack.push('FastAPI');
  }

  // 3. Check for Docker
  if (fs.existsSync(path.join(ROOT_DIR, 'Dockerfile'))) {
    analysis.dockerized = true;
    analysis.setupSteps.push('Docker-based setup available');
  }
  if (fs.existsSync(path.join(ROOT_DIR, 'docker-compose.yml'))) {
    analysis.dockerized = true;
    const dockerCompose = fs.readFileSync(path.join(ROOT_DIR, 'docker-compose.yml'), 'utf-8');
    // Extract services from docker-compose
    const serviceMatches = dockerCompose.match(/^\s{2}[a-zA-Z0-9_-]+:/gm);
    if (serviceMatches) {
      serviceMatches.forEach(match => {
        const serviceName = match.trim().replace(':', '');
        if (!['version', 'services', 'volumes', 'networks'].includes(serviceName)) {
          analysis.services.push({ name: serviceName, type: 'docker-service' });
        }
      });
    }
  }

  // 4. Check for .env.example
  const envExamplePath = path.join(ROOT_DIR, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([A-Z_]+)=/);
      if (match && !analysis.envVars.find(v => v.key === match[1])) {
        analysis.envVars.push({ key: match[1], purpose: 'Required environment variable' });
      }
    });
  }

  // 5. Scan dummy-repo files for API endpoints and ports
  if (fs.existsSync(DUMMY_REPO_DIR)) {
    const dummyFiles = fs.readdirSync(DUMMY_REPO_DIR);
    dummyFiles.forEach(file => {
      const filePath = path.join(DUMMY_REPO_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Look for API URLs
      const apiMatches = content.match(/https?:\/\/[^\s"']+|localhost:\d+/g);
      if (apiMatches) {
        apiMatches.forEach(url => {
          const portMatch = url.match(/:(\d+)/);
          if (portMatch && !analysis.ports.includes(portMatch[1])) {
            analysis.ports.push(portMatch[1]);
          }
        });
      }

      // Look for environment variables
      const envMatches = content.match(/import\.meta\.env\.([A-Z_]+)|process\.env\.([A-Z_]+)/g);
      if (envMatches) {
        envMatches.forEach(match => {
          const varName = match.split('.').pop();
          if (!analysis.envVars.find(v => v.key === varName)) {
            analysis.envVars.push({ key: varName, purpose: 'Used in application code' });
          }
        });
      }
    });
  }

  // 6. Generate setup steps based on analysis
  if (analysis.dockerized) {
    analysis.setupSteps.push('Install Docker Desktop');
    analysis.setupSteps.push('Run: docker-compose up');
  } else if (analysis.projectType === 'Node.js') {
    analysis.setupSteps.push('Install Node.js (v16+ recommended)');
    analysis.setupSteps.push('Run: npm install');
    if (analysis.scripts.start) {
      analysis.setupSteps.push(`Run: npm start`);
      analysis.startupCommands.push('npm start');
    }
    if (analysis.scripts.dev) {
      analysis.setupSteps.push(`Run: npm run dev`);
      analysis.startupCommands.push('npm run dev');
    }
  } else if (analysis.projectType === 'Python') {
    analysis.setupSteps.push('Install Python 3.8+');
    analysis.setupSteps.push('Run: pip install -r requirements.txt');
    analysis.setupSteps.push('Run: python manage.py runserver (Django) or python app.py (Flask)');
  }

  // 7. Detect common issues
  if (analysis.envVars.length > 0 && !fs.existsSync(path.join(ROOT_DIR, '.env'))) {
    analysis.commonIssues.push({
      type: 'Missing .env file',
      description: `Create a .env file with ${analysis.envVars.length} required variables`,
      fix: 'Copy .env.example to .env and fill in the values'
    });
  }

  if (analysis.databases.length > 0) {
    analysis.databases.forEach(db => {
      analysis.commonIssues.push({
        type: `${db} not running`,
        description: `Application requires ${db} to be running`,
        fix: `Install and start ${db} locally or use Docker`
      });
    });
  }

  if (analysis.projectType === 'Node.js' && !fs.existsSync(path.join(ROOT_DIR, 'node_modules'))) {
    analysis.commonIssues.push({
      type: 'Dependencies not installed',
      description: 'node_modules folder is missing',
      fix: 'Run: npm install'
    });
  }

  // Default port if none detected
  if (analysis.ports.length === 0) {
    if (analysis.stack.includes('React')) analysis.ports.push('3000');
    if (analysis.stack.includes('Express.js')) analysis.ports.push('5000');
  }

  return analysis;
}

// Helper function to generate doctor data from repository analysis
function generateDoctorData(envAnalysis) {
  const issues = [];
  
  // Check for actual issues in the current repository
  if (!fs.existsSync(path.join(ROOT_DIR, 'node_modules')) && envAnalysis.projectType === 'Node.js') {
    issues.push({
      type: 'Dependencies Not Installed',
      description: 'The node_modules folder is missing. Dependencies must be installed before running the application.',
      severity: 'critical',
      fixCommand: 'npm install',
      autoFixable: true
    });
  }

  if (envAnalysis.envVars.length > 0 && !fs.existsSync(path.join(ROOT_DIR, '.env'))) {
    issues.push({
      type: 'Missing Environment Configuration',
      description: `The application requires ${envAnalysis.envVars.length} environment variables but no .env file exists.`,
      severity: 'high',
      fixCommand: fs.existsSync(path.join(ROOT_DIR, '.env.example')) 
        ? 'cp .env.example .env' 
        : 'Create a .env file manually',
      autoFixable: fs.existsSync(path.join(ROOT_DIR, '.env.example'))
    });
  }

  if (envAnalysis.databases.length > 0) {
    envAnalysis.databases.forEach(db => {
      issues.push({
        type: `${db} Connection Required`,
        description: `The application uses ${db}. Ensure it's running and accessible.`,
        severity: 'medium',
        fixCommand: `Start ${db} service or use Docker`,
        autoFixable: false
      });
    });
  }

  // If no critical issues, show success state
  if (issues.length === 0) {
    issues.push({
      type: 'Environment Ready',
      description: 'All dependencies installed and configuration looks good.',
      severity: 'success',
      fixCommand: null,
      autoFixable: false
    });
  }

  return {
    status: issues.some(i => i.severity === 'critical') ? 'Critical Issues Detected' : 
            issues.some(i => i.severity === 'high') ? 'Setup Required' : 
            'Ready to Run',
    detectedFiles: [
      envAnalysis.projectType === 'Node.js' ? 'package.json' : null,
      fs.existsSync(path.join(ROOT_DIR, 'docker-compose.yml')) ? 'docker-compose.yml' : null,
      fs.existsSync(path.join(ROOT_DIR, '.env.example')) ? '.env.example' : null
    ].filter(Boolean),
    projectStack: envAnalysis.stack.join(', ') || envAnalysis.projectType,
    detectedPorts: envAnalysis.ports,
    requiredEnvVars: envAnalysis.envVars.length,
    issuesFound: issues,
    setupSteps: envAnalysis.setupSteps,
    startupCommands: envAnalysis.startupCommands,
    quickStartScript: generateQuickStartScript(envAnalysis)
  };
}

// Helper function to generate a quick-start script
function generateQuickStartScript(envAnalysis) {
  const lines = ['#!/bin/bash', '# Auto-generated setup script', ''];
  
  if (envAnalysis.projectType === 'Node.js') {
    lines.push('echo "📦 Installing dependencies..."');
    lines.push('npm install');
    lines.push('');
    
    if (envAnalysis.envVars.length > 0 && fs.existsSync(path.join(ROOT_DIR, '.env.example'))) {
      lines.push('echo "⚙️ Setting up environment variables..."');
      lines.push('if [ ! -f .env ]; then');
      lines.push('  cp .env.example .env');
      lines.push('  echo "✅ Created .env file. Please fill in the values."');
      lines.push('fi');
      lines.push('');
    }
    
    if (envAnalysis.startupCommands.length > 0) {
      lines.push('echo "🚀 Starting application..."');
      lines.push(envAnalysis.startupCommands[0]);
    }
  }
  
  return lines.join('\n');
}


console.log("🔍 Running Dynamic Codebase Structural AST Parser...");

// Helper helper to generate custom dynamic summaries by analyzing keywords inside the actual file text
function analyzeFileContent(fileName, fileText) {
  const cleanName = fileName.split('.')[0];
  
  // Extract real functions using a structural regex pattern
  // Matches expressions like: function test() or const test = () =>
  const functionRegex = /(?:function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)/g;
  const discoveredFunctions = [];
  let match;
  
  while ((match = functionRegex.exec(fileText)) !== null) {
    const funcName = match[1] || match[2];
    if (funcName && !discoveredFunctions.includes(funcName)) {
      discoveredFunctions.push(funcName);
    }
  }

  // Scan code for architectural indicator keywords to determine intent
  const weightIndicators = [];
  if (fileText.includes('import') || fileText.includes('require')) weightIndicators.push('dependency management layers');
  if (fileText.includes('fetch') || fileText.includes('axios') || fileText.includes('http')) weightIndicators.push('external network I/O requests');
  if (fileText.includes('useState') || fileText.includes('useEffect') || fileText.includes('component')) weightIndicators.push('stateful UI component rendering rendering cascades');
  if (fileText.includes('localStorage') || fileText.includes('db') || fileText.includes('Schema')) weightIndicators.push('data layer persistence routines');
  if (fileText.includes('validate') || fileText.includes('jwt') || fileText.includes('encode')) weightIndicators.push('payload encryption verification protocols');

  // Dynamically build a custom business logic paragraph based on what was found inside the actual code
  let summary = `The \`${fileName}\` module encapsulates localized software rules handling the system's operational lifecycle. `;
  
  if (discoveredFunctions.length > 0) {
    summary += `Architecturally, it registers structural hooks for ${discoveredFunctions.length} unique execution routines. `;
  } else {
    summary += `Architecturally, this file functions primarily as an configuration baseline structure or an aggregate data definition script. `;
  }

  if (weightIndicators.length > 0) {
    summary += `Deep code scanning shows this module directly drives execution around ${weightIndicators.join(' as well as ')}.`;
  } else {
    summary += `Deep scanning indicates a low-overhead utility model designed to maintain clean separation of concerns within neighboring logical modules.`;
  }

  // Map discovered functions into keyFunctions specs array format
  let keyFunctions = discoveredFunctions.map(func => {
    // Generate a contextual purpose sentence based on the name of the actual function found in the code
    let purpose = `Coordinates the execution cycle for the local \`${func}\` workflow handle inside the runtime sequence.`;
    if (func.toLowerCase().includes('get') || func.toLowerCase().includes('fetch')) purpose = `Retrieves active records and parses transactional state payloads for \`${func}\`.`;
    if (func.toLowerCase().includes('set') || func.toLowerCase().includes('update')) purpose = `Mutates reactive state data boundaries dynamically, committing structural adjustments safely to the thread.`;
    if (func.toLowerCase().includes('handle') || func.toLowerCase().includes('on')) purpose = `Asynchronously intercepts and captures application event signals to sequence response loops.`;
    
    return { name: `${func}()`, purpose };
  });

  // Safe fallback if the code has no functions defined inside it
  if (keyFunctions.length === 0) {
    keyFunctions = [{ 
      name: "defaultExport", 
      purpose: `Exposes structural layout configuration mappings and raw metadata blocks for \`${cleanName}\`.` 
    }];
  }

  return { summary, keyFunctions };
}

// Helper function to generate a dynamic "Good First Issue" ticket based on actual code analysis
function generateTicketData(files, explainData) {
  // Analyze the codebase to find real issues
  const issues = [];
  
  // Check for duplicate files (same name with variations)
  const fileNames = files.map(f => f.replace(/\s*\(\d+\)/, '').toLowerCase());
  const duplicates = files.filter((file, index) => {
    const baseName = file.replace(/\s*\(\d+\)/, '').toLowerCase();
    return fileNames.indexOf(baseName) !== index;
  });
  
  if (duplicates.length > 0) {
    const duplicateFile = duplicates[0];
    const originalFile = files.find(f =>
      f.toLowerCase().replace(/\s*\(\d+\)/, '') === duplicateFile.toLowerCase().replace(/\s*\(\d+\)/, '') &&
      f !== duplicateFile
    );
    
    issues.push({
      type: 'duplicate_file',
      title: `Remove Duplicate ${originalFile.split('.')[0]} Component`,
      difficulty: 'Easy',
      context: `The dummy-repo contains a duplicate file "${duplicateFile}" that is identical to "${originalFile}". This creates redundant nodes in the architecture graph and confuses the visualization.`,
      instructions: `Delete the file "src/dummy-repo/${duplicateFile}", then run "node generateData.js" to regenerate the mock data. Verify that the graph now shows ${files.length - 1} nodes instead of ${files.length}.`,
      filesToCheck: [duplicateFile, originalFile, 'generateData.js', 'graphData.json'],
      acceptanceCriteria: [
        `The file "${duplicateFile}" has been deleted`,
        'Mock data has been regenerated',
        `Architecture graph shows ${files.length - 1} unique nodes`,
        'No duplicate entries in roadmap or file summaries'
      ]
    });
  }
  
  // Check for files with improper naming (spaces, special chars)
  const badlyNamedFiles = files.filter(f => /[\s\(\)]/.test(f));
  if (badlyNamedFiles.length > 0 && issues.length === 0) {
    const badFile = badlyNamedFiles[0];
    issues.push({
      type: 'naming_convention',
      title: `Fix File Naming Convention for ${badFile}`,
      difficulty: 'Easy',
      context: `The file "${badFile}" uses improper naming with spaces or special characters. JavaScript/React files should use camelCase or PascalCase without spaces.`,
      instructions: `Rename "${badFile}" to follow proper naming conventions, update any imports if needed, then regenerate mock data with "node generateData.js".`,
      filesToCheck: [badFile, 'generateData.js'],
      acceptanceCriteria: [
        'File has been renamed to follow naming conventions',
        'All imports updated if necessary',
        'Mock data regenerated successfully',
        'Application runs without errors'
      ]
    });
  }
  
  // Check for missing error handling in fetch calls
  const filesWithFetch = explainData.filter(data => {
    const filePath = path.join(DUMMY_REPO_DIR, data.filepath);
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes('fetch(') && !content.includes('catch');
  });
  
  if (filesWithFetch.length > 0 && issues.length === 0) {
    const targetFile = filesWithFetch[0].filepath;
    issues.push({
      type: 'error_handling',
      title: `Add Error Handling to API Calls in ${targetFile}`,
      difficulty: 'Medium',
      context: `The file "${targetFile}" makes API calls using fetch() but lacks proper error handling. This can lead to unhandled promise rejections.`,
      instructions: `Add try-catch blocks or .catch() handlers to all fetch calls in "${targetFile}". Display user-friendly error messages when requests fail.`,
      filesToCheck: [targetFile],
      acceptanceCriteria: [
        'All fetch calls have error handling',
        'User sees meaningful error messages on failure',
        'No unhandled promise rejections in console',
        'Application remains stable after failed requests'
      ]
    });
  }
  
  // Fallback: Generic code review task
  if (issues.length === 0) {
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const fileData = explainData.find(d => d.filepath === randomFile);
    
    issues.push({
      type: 'code_review',
      title: `Add JSDoc Comments to ${randomFile}`,
      difficulty: 'Easy',
      context: `The file "${randomFile}" contains ${fileData.keyFunctions.length} functions but lacks proper documentation. Adding JSDoc comments will improve code maintainability.`,
      instructions: `Add JSDoc comments to all functions in "${randomFile}". Include @param and @returns tags where applicable. Follow JSDoc standards.`,
      filesToCheck: [randomFile],
      acceptanceCriteria: [
        'All functions have JSDoc comments',
        'Parameters are documented with @param',
        'Return values documented with @returns',
        'Comments are clear and helpful'
      ]
    });
  }
  
  // Return the first (most important) issue as the ticket
  const ticket = issues[0];
  return {
    ticketId: `AEGIS-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    title: ticket.title,
    difficulty: ticket.difficulty,
    type: ticket.type,
    context: ticket.context,
    instructions: ticket.instructions,
    filesToInvestigate: ticket.filesToCheck,
    acceptanceCriteria: ticket.acceptanceCriteria,
    knowledgeCheck: generateKnowledgeQuestions(files, explainData, ticket.filesToCheck[0])
  };
}

// Helper function to generate repository-specific knowledge check questions
function generateKnowledgeQuestions(files, explainData, focusFile) {
  const questions = [];
  
  // Question about the focus file
  const focusData = explainData.find(d => d.filepath === focusFile);
  if (focusData && focusData.keyFunctions.length > 0) {
    questions.push({
      question: `What is the primary purpose of the "${focusData.keyFunctions[0].name}" function in ${focusFile}?`,
      hint: focusData.keyFunctions[0].purpose
    });
  }
  
  // Question about generateData.js
  questions.push({
    question: 'What regex pattern does generateData.js use to detect function declarations in the code?',
    hint: 'Check line 15 of generateData.js'
  });
  
  // Question about the architecture
  questions.push({
    question: `How many total files are currently in the dummy-repo directory?`,
    hint: `There are ${files.length} files`
  });
  
  // Question about data flow
  questions.push({
    question: 'Which three JSON files does generateData.js create in the mockData directory?',
    hint: 'graphData.json, explainData.json, and roadmapData.json'
  });
  
  // Question about React components
  questions.push({
    question: 'Which React component is responsible for rendering the interactive architecture graph?',
    hint: 'ArchitectureGraph.jsx uses ReactFlow'
  });
  
  return questions;
}

try {
  const files = fs.readdirSync(DUMMY_REPO_DIR).filter(file => file.endsWith('.js') || file.endsWith('.jsx'));

  if (files.length === 0) {
    console.log("⚠️ No files found in dummy-repo!");
    process.exit(0);
  }

  const nodes = [];
  const edges = [];
  const explainData = [];
  const roadmapSteps = [];

  // 1. Map through the repository files completely generically
  files.forEach((file, index) => {
    // Read the actual text content of the file from your computer!
    const filePath = path.join(DUMMY_REPO_DIR, file);
    const fileText = fs.readFileSync(filePath, 'utf-8');

    // Run structural code inspection
    const analysis = analyzeFileContent(file, fileText);

    // Build unique coordinates automatically so nodes never stack
    nodes.push({
      id: file,
      position: { x: 120 + index * 260, y: 220 },
      data: { label: file }
    });

    // Feed real extracted data into your business logic profile arrays
    explainData.push({
      filepath: file,
      summary: analysis.summary,
      keyFunctions: analysis.keyFunctions
    });

    // Build the interactive roadmap steps using real file context
    roadmapSteps.push({
      stepNumber: index + 1,
      title: `Evaluate ${file.split('.')[0]} Architecture`,
      targetFile: file,
      description: analysis.summary.split('.').slice(0, 2).join('.') + '.'
    });
  });

  // Create clean continuous dependency lines connecting file 1 -> file 2 -> file 3, etc.
  for (let i = 0; i < files.length - 1; i++) {
    edges.push({
      id: `e${i}`,
      source: files[i],
      target: files[i + 1],
      animated: true,
      style: { stroke: '#38bdf8' }
    });
  }

  // 2. Generate dynamic ticket data based on actual code analysis
  const ticketData = generateTicketData(files, explainData);

  // 3. Generate dynamic Environment Doctor data
  const envAnalysis = analyzeRepositoryEnvironment();
  const doctorData = generateDoctorData(envAnalysis);

  // 4. Output the dynamic sets directly into mockData
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'graphData.json'), JSON.stringify({ nodes, edges }, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'explainData.json'), JSON.stringify(explainData, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'roadmapData.json'), JSON.stringify({ roadmapTitle: "Automated Repository Onboarding Map", steps: roadmapSteps }, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'ticketData.json'), JSON.stringify(ticketData, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'doctorData.json'), JSON.stringify(doctorData, null, 2));

  console.log(`\n======================================================`);
  console.log(`🚀 GENERIC PARSER COMPLETE: Analyzed ${files.length} unique source files.`);
  console.log(`🎫 DYNAMIC TICKET GENERATED: ${ticketData.title}`);
  console.log(`🏥 ENVIRONMENT DOCTOR: ${doctorData.status}`);
  console.log(`📦 PROJECT STACK: ${doctorData.projectStack}`);
  console.log(`======================================================\n`);

} catch (error) {
  console.error("❌ Generic parsing compilation run crashed:", error);
}