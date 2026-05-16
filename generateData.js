const fs = require('fs');
const path = require('path');

const DUMMY_REPO_DIR = path.join(__dirname, 'src', 'dummy-repo');
const MOCK_DATA_DIR = path.join(__dirname, 'src', 'mockData');
const ROOT_DIR = __dirname;
// Helper function to recursively scan directories for all code files
function getAllCodeFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, dist, build folders
      if (!['node_modules', '.git', 'dist', 'build', 'public', 'assets'].includes(file)) {
        getAllCodeFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push({
        fullPath: filePath,
        relativePath: path.relative(DUMMY_REPO_DIR, filePath),
        fileName: file,
        content: fs.readFileSync(filePath, 'utf-8')
      });
    }
  });
  
  return fileList;
}


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

  // 1. Check for package.json - prioritize client/server structure in dummy-repo
  const clientPackageJsonPath = path.join(DUMMY_REPO_DIR, 'secure-event-platform/client/package.json');
  const serverPackageJsonPath = path.join(DUMMY_REPO_DIR, 'secure-event-platform/server/package.json');
  const rootPackageJsonPath = path.join(ROOT_DIR, 'package.json');

  let hasClientServer = false;
  let allDependencies = {};
  let allDevDependencies = {};
  let allScripts = {};

  // Check for client/server monorepo structure
  if (fs.existsSync(clientPackageJsonPath) && fs.existsSync(serverPackageJsonPath)) {
    hasClientServer = true;
    analysis.projectType = 'Full-Stack Monorepo';
    
    const clientPackage = JSON.parse(fs.readFileSync(clientPackageJsonPath, 'utf-8'));
    const serverPackage = JSON.parse(fs.readFileSync(serverPackageJsonPath, 'utf-8'));
    
    // Merge dependencies
    allDependencies = { ...clientPackage.dependencies, ...serverPackage.dependencies };
    allDevDependencies = { ...clientPackage.devDependencies, ...serverPackage.devDependencies };
    allScripts = {
      ...Object.fromEntries(Object.entries(clientPackage.scripts || {}).map(([k, v]) => [`client:${k}`, v])),
      ...Object.fromEntries(Object.entries(serverPackage.scripts || {}).map(([k, v]) => [`server:${k}`, v]))
    };
    
    analysis.dependencies = allDependencies;
    analysis.devDependencies = allDevDependencies;
    analysis.scripts = allScripts;
    analysis.services.push({ name: 'Frontend (Client)', type: 'react' });
    analysis.services.push({ name: 'Backend (Server)', type: 'express' });
  } else if (fs.existsSync(rootPackageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'));
    analysis.projectType = 'Node.js';
    analysis.dependencies = packageJson.dependencies || {};
    analysis.devDependencies = packageJson.devDependencies || {};
    analysis.scripts = packageJson.scripts || {};
    allDependencies = analysis.dependencies;
    allDevDependencies = analysis.devDependencies;
    allScripts = analysis.scripts;
  }

  if (Object.keys(allDependencies).length > 0 || Object.keys(allDevDependencies).length > 0) {

    // Detect framework
    if (allDependencies['react'] || allDevDependencies['react']) {
      analysis.stack.push('React');
      if (allDependencies['react-scripts']) analysis.stack.push('Create React App');
      if (allDependencies['next']) analysis.stack.push('Next.js');
      if (allDevDependencies['vite']) analysis.stack.push('Vite');
      if (allDevDependencies['@vitejs/plugin-react']) analysis.stack.push('Vite');
    }
    if (allDependencies['vue']) analysis.stack.push('Vue.js');
    if (allDependencies['@angular/core']) analysis.stack.push('Angular');
    if (allDependencies['express']) {
      analysis.stack.push('Express.js');
      if (!hasClientServer) {
        analysis.services.push({ name: 'Backend API', type: 'express' });
      }
    }
    if (allDependencies['fastify']) {
      analysis.stack.push('Fastify');
      if (!hasClientServer) {
        analysis.services.push({ name: 'Backend API', type: 'fastify' });
      }
    }

    // Detect authentication
    if (allDependencies['jsonwebtoken']) {
      analysis.stack.push('JWT Authentication');
    }
    if (allDependencies['bcryptjs'] || allDependencies['bcrypt']) {
      analysis.stack.push('Password Hashing (bcrypt)');
    }

    // Detect databases
    if (allDependencies['mongoose']) {
      analysis.databases.push('MongoDB');
      analysis.envVars.push({ key: 'MONGODB_URI', purpose: 'MongoDB connection string' });
    }
    if (allDependencies['pg'] || allDependencies['postgres']) {
      analysis.databases.push('PostgreSQL');
      analysis.envVars.push({ key: 'DATABASE_URL', purpose: 'PostgreSQL connection string' });
    }
    if (allDependencies['mysql'] || allDependencies['mysql2']) {
      analysis.databases.push('MySQL');
      analysis.envVars.push({ key: 'MYSQL_HOST', purpose: 'MySQL host' });
    }
    if (allDependencies['redis']) {
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

  // 5. Scan dummy-repo files for API endpoints and ports (use recursive scanner)
  if (fs.existsSync(DUMMY_REPO_DIR)) {
    const allCodeFiles = getAllCodeFiles(DUMMY_REPO_DIR);
    allCodeFiles.forEach(fileObj => {
      const content = fileObj.content;
      
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
  } else if (hasClientServer) {
    analysis.setupSteps.push('Install Node.js (v18+ recommended)');
    analysis.setupSteps.push('Navigate to client folder: cd client');
    analysis.setupSteps.push('Install client dependencies: npm install');
    analysis.setupSteps.push('Navigate to server folder: cd ../server');
    analysis.setupSteps.push('Install server dependencies: npm install');
    if (analysis.databases.length > 0) {
      analysis.databases.forEach(db => {
        analysis.setupSteps.push(`Set up ${db} database`);
      });
    }
    if (analysis.envVars.length > 0) {
      analysis.setupSteps.push('Create server/.env file with required variables');
    }
    analysis.setupSteps.push('Start server: npm run dev (in server folder)');
    analysis.setupSteps.push('Start client: npm run dev (in client folder, new terminal)');
    analysis.startupCommands.push('cd server && npm run dev');
    analysis.startupCommands.push('cd client && npm run dev');
  } else if (analysis.projectType === 'Node.js' || analysis.projectType === 'Full-Stack Monorepo') {
    analysis.setupSteps.push('Install Node.js (v16+ recommended)');
    analysis.setupSteps.push('Run: npm install');
    if (analysis.scripts.start) {
      analysis.setupSteps.push(`Run: npm start`);
      analysis.startupCommands.push('npm start');
    }
    if (analysis.scripts.dev || analysis.scripts['client:dev']) {
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


console.log("🚀 Launching Presentation-Optimized Hierarchical Layer Scanner...");

const BLACKLISTED_DIR_NAMES = new Set(['node_modules', '.git', 'build', 'dist', 'public', '.vscode', 'venv', '__pycache__']);
const BLACKLISTED_FILE_NAMES = new Set(['package-lock.json', 'package.json', '.gitignore', 'README.md', 'BOB_PROMPTS.md']);

function scanDirectoryRecursively(currentDirPath, accumulatedFiles = []) {
  const items = fs.readdirSync(currentDirPath);
  items.forEach(item => {
    const fullItemPath = path.join(currentDirPath, item);
    const itemStats = fs.statSync(fullItemPath);

    if (itemStats.isDirectory()) {
      if (!BLACKLISTED_DIR_NAMES.has(item)) {
        scanDirectoryRecursively(fullItemPath, accumulatedFiles);
      }
    } else if (itemStats.isFile()) {
      const fileExt = path.extname(item).toLowerCase();
      if ((fileExt === '.js' || fileExt === '.jsx') && !BLACKLISTED_FILE_NAMES.has(item)) {
        accumulatedFiles.push({
          absolutePath: fullItemPath,
          relativePath: path.relative(DUMMY_REPO_DIR, fullItemPath).replace(/\\/g, '/') 
        });
      }
    }
  });
  return accumulatedFiles;
}

function analyzeFileContent(fileMeta, fileText, allFilesList) {
  const fileName = path.basename(fileMeta.relativePath);
  const cleanName = fileName.split('.')[0];
  
  const functionRegex = /(?:function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)/g;
  const discoveredFunctions = [];
  let match;
  while ((match = functionRegex.exec(fileText)) !== null) {
    const funcName = match[1] || match[2];
    if (funcName && !discoveredFunctions.includes(funcName)) {
      discoveredFunctions.push(funcName);
    }
  }

  const dependencies = [];
  allFilesList.forEach(otherFile => {
    if (otherFile.relativePath === fileMeta.relativePath) return;
    const otherFileCleanName = path.basename(otherFile.relativePath).split('.')[0];
    const importPattern = new RegExp(`(?:import|from|require\\s*\\()\\s*['\"].*\\/${otherFileCleanName}(?:\\.[a-zA-Z0-9]+)?['\"]`, 'i');
    
    if (importPattern.test(fileText) || fileText.includes(otherFileCleanName)) {
      if (!dependencies.includes(otherFile.relativePath)) {
        dependencies.push(otherFile.relativePath);
      }
    }
  });

  let summary = `The \`${fileName}\` module encapsulates localized software operations. `;
  if (discoveredFunctions.length > 0) {
    summary += `It coordinates ${discoveredFunctions.length} behavioral systems handlers.`;
  }

  let keyFunctions = discoveredFunctions.map(func => {
    return { name: `${func}()`, purpose: `Executes operational processing for internal runtime sequences.` };
  });
  if (keyFunctions.length === 0) {
    keyFunctions = [{ name: "defaultConfig", purpose: `Exposes core layout constants or system assets.` }];
  }

  return { summary, keyFunctions, dependencies };
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
  
  // NEW: Check for missing return statement in middleware (common bug in Express middleware)
  const middlewareFiles = explainData.filter(data =>
    data.filepath.toLowerCase().includes('middleware')
  );
  
  middlewareFiles.forEach(data => {
    const filePath = path.join(DUMMY_REPO_DIR, data.filepath);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Detect pattern: res.status().json() without return, followed by another if (!token) check
      // This is a common bug where middleware sends response but doesn't stop execution
      const hasNoTokenCheck = content.includes('if (!token)');
      const hasStatusResponse = /res\.status\(\d+\)\.json\(/g.test(content);
      const missingReturn = hasNoTokenCheck && hasStatusResponse && !content.match(/return\s+res\.status\(\d+\)\.json\(/);
      
      if (missingReturn && issues.length === 0) {
        issues.push({
          type: 'middleware_bug',
          title: `Fix Missing Return Statement in ${path.basename(data.filepath)}`,
          difficulty: 'Easy',
          context: `The middleware file "${data.filepath}" contains a critical bug. After sending a 401 response for "No token", the function continues executing instead of returning. This causes the middleware to attempt sending multiple responses, leading to "Cannot set headers after they are sent" errors.`,
          instructions: `Open "${data.filepath}" and locate the section where it checks "if (!token)". Add a "return" statement before "res.status(401).json()" to prevent further execution after sending the error response. This is a common Express.js middleware pattern that new developers must understand.`,
          filesToCheck: [data.filepath, 'server/routes/authRoutes.js', 'server/routes/userRoutes.js'],
          acceptanceCriteria: [
            'Added return statement before res.status(401).json() in the "No token" check',
            'Middleware properly stops execution after sending error response',
            'No "headers already sent" errors in server logs',
            'Protected routes work correctly with and without tokens'
          ]
        });
        return;
      }
    }
  });
  
  // Check for missing error handling in fetch calls
  const filesWithFetch = explainData.filter(data => {
    const filePath = path.join(DUMMY_REPO_DIR, data.filepath);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content.includes('fetch(') && !content.includes('catch');
    }
    return false;
  });
  
  if (filesWithFetch.length > 0 && issues.length === 0) {
    const targetFile = filesWithFetch[0].filepath;
    issues.push({
      type: 'error_handling',
      title: `Add Error Handling to API Calls in ${path.basename(targetFile)}`,
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
  
  // Detect if this is a full-stack application
  const hasBackend = files.some(f => f.includes('server') || f.includes('backend'));
  const hasFrontend = files.some(f => f.includes('client') || f.includes('frontend'));
  const hasAuth = files.some(f => f.toLowerCase().includes('auth'));
  const hasMiddleware = files.some(f => f.toLowerCase().includes('middleware'));
  const hasModels = files.some(f => f.toLowerCase().includes('model'));
  
  // Question 1: About the specific file being fixed
  const focusData = explainData.find(d => d.filepath === focusFile);
  if (focusData && focusData.keyFunctions.length > 0) {
    if (focusFile.toLowerCase().includes('middleware')) {
      questions.push({
        question: `Why is it critical to add a "return" statement before sending error responses in Express middleware like ${path.basename(focusFile)}?`,
        hint: 'Without return, the middleware continues executing and may try to send multiple responses, causing "Cannot set headers after they are sent" errors.'
      });
    } else {
      questions.push({
        question: `What is the primary purpose of the "${focusData.keyFunctions[0].name}" function in ${path.basename(focusFile)}?`,
        hint: focusData.keyFunctions[0].purpose
      });
    }
  }
  
  // Question 2: Architecture-specific based on detected stack
  if (hasBackend && hasFrontend) {
    questions.push({
      question: 'How does the frontend communicate with the backend API in this full-stack application?',
      hint: 'Check the services/api.js or services/authService.js files for API base URL configuration and request methods.'
    });
  }
  
  // Question 3: Authentication flow (if auth exists)
  if (hasAuth && hasMiddleware) {
    const authMiddleware = files.find(f => f.toLowerCase().includes('authmiddleware'));
    if (authMiddleware) {
      questions.push({
        question: `Why is token validation handled in ${path.basename(authMiddleware)} middleware instead of directly in the route controllers?`,
        hint: 'Middleware allows reusable authentication logic across multiple routes without code duplication. It follows the separation of concerns principle.'
      });
    }
  }
  
  // Question 4: Database/Models (if models exist)
  if (hasModels) {
    const userModel = files.find(f => f.toLowerCase().includes('user') && f.toLowerCase().includes('model'));
    if (userModel) {
      questions.push({
        question: `What database schema fields are defined in the ${path.basename(userModel)} model, and why is the password field marked as "required"?`,
        hint: 'Check the User model schema. The password is required for authentication and is hashed before storage for security.'
      });
    }
  }
  
  // Question 5: Security/Best Practices
  if (hasAuth) {
    const authController = files.find(f => f.toLowerCase().includes('authcontroller'));
    if (authController) {
      questions.push({
        question: `In ${path.basename(authController)}, why is bcrypt used to hash passwords before storing them in the database?`,
        hint: 'Bcrypt provides one-way encryption. Even if the database is compromised, attackers cannot retrieve plain-text passwords.'
      });
    }
  }
  
  // Fallback questions if specific patterns not found
  if (questions.length < 3) {
    questions.push({
      question: `How many total files were analyzed in the dummy-repo directory?`,
      hint: `There are ${files.length} files`
    });
  }
  
  if (questions.length < 4) {
    questions.push({
      question: 'What is the purpose of the generateData.js script in this repository?',
      hint: 'It recursively scans the dummy-repo, analyzes code structure, and generates visualization data for the onboarding platform.'
    });
  }
  
  // Return only the first 5 questions
  return questions.slice(0, 5);
}

try {
  const discoveredSourceFiles = scanDirectoryRecursively(DUMMY_REPO_DIR);

  if (discoveredSourceFiles.length === 0) {
    console.log("⚠️ No source files found.");
    process.exit(0);
  }

  const repositoryMap = {};
  discoveredSourceFiles.forEach(fileMeta => {
    const fileText = fs.readFileSync(fileMeta.absolutePath, 'utf-8');
    repositoryMap[fileMeta.relativePath] = analyzeFileContent(fileMeta, fileText, discoveredSourceFiles);
  });

  const nodes = [];
  const edges = [];
  const explainData = [];
  const roadmapSteps = [];

  // Categorize files into layers dynamically to design a logical top-to-bottom pipeline
  const layers = { configs: [], system: [], pages: [], utilities: [] };
  
  Object.keys(repositoryMap).forEach(relPath => {
    const lowerPath = relPath.toLowerCase();
    if (lowerPath.includes('config') || lowerPath.includes('eslint')) {
      layers.configs.push(relPath);
    } else if (lowerPath.includes('server') || lowerPath.includes('model') || lowerPath.includes('main.jsx') || lowerPath.includes('app.jsx')) {
      layers.system.push(relPath);
    } else if (lowerPath.includes('page') || lowerPath.includes('dashboard') || lowerPath.includes('landing') || lowerPath.includes('login') || lowerPath.includes('register')) {
      layers.pages.push(relPath);
    } else {
      layers.utilities.push(relPath);
    }
  });

  // Tracking counters for step numbering order
  let sequentialStepCount = 1;

  // Process layer arrangements down the display canvas screen [Configs -> System Trunk -> Main Pages -> Sub-Utilities]
  // Process layer arrangements with distinct neon colors for tracing paths
  const renderOrderLayers = [
    { targetGroup: layers.configs, verticalY: 80, horizontalGap: 240, color: '#f59e0b' }, // Amber
    { targetGroup: layers.system, verticalY: 240, horizontalGap: 220, color: '#ec4899' },  // Pink
    { targetGroup: layers.pages, verticalY: 420, horizontalGap: 200, color: '#10b981' },   // Emerald
    { targetGroup: layers.utilities, verticalY: 600, horizontalGap: 240, color: '#a855f7' } // Purple
  ];

  renderOrderLayers.forEach(layerSpec => {
    layerSpec.targetGroup.forEach((relativePathKey, horizontalIdx) => {
      const analysis = repositoryMap[relativePathKey];
      const pureFileName = path.basename(relativePathKey); 

      const startXOffset = 400 - ((layerSpec.targetGroup.length - 1) * layerSpec.horizontalGap) / 2;

      nodes.push({
        id: relativePathKey, 
        position: { x: startXOffset + horizontalIdx * layerSpec.horizontalGap, y: layerSpec.verticalY },
        data: { label: pureFileName } 
      });

      analysis.dependencies.forEach((depRelativePath, dIdx) => {
        edges.push({
          id: `e-${relativePathKey}-${depRelativePath}-${dIdx}`,
          source: relativePathKey,
          target: depRelativePath,
          type: 'smoothstep', // FIX: Changes messy curves to clean right-angled circuit lines
          animated: true,
          style: { stroke: layerSpec.color, strokeWidth: 1.5 }, // FIX: Colors the line based on the source layer
          markerEnd: {
            type: 'arrowclosed', // FIX: Adds a directional arrowhead
            width: 15,
            height: 15,
            color: layerSpec.color,
          }
        });
      });

      explainData.push({
        filepath: relativePathKey,
        summary: analysis.summary,
        keyFunctions: analysis.keyFunctions
      });

      roadmapSteps.push({
        stepNumber: sequentialStepCount++,
        title: `Explore ${pureFileName.split('.')[0]}`,
        targetFile: relativePathKey,
        description: analysis.summary
      });
    });
  });

  if (edges.length === 0) {
    const keys = Object.keys(repositoryMap);
    for (let i = 0; i < keys.length - 1; i++) {
      edges.push({ id: `f-edge-${i}`, source: keys[i], target: keys[i+1], animated: false, style: { stroke: '#334155' } });
    }
  }

  // Generate dynamic ticket data based on actual code analysis
  const allFilePaths = Object.keys(repositoryMap);
  const ticketData = generateTicketData(allFilePaths, explainData);

  // Generate dynamic Environment Doctor data
  const envAnalysis = analyzeRepositoryEnvironment();
  const doctorData = generateDoctorData(envAnalysis);

  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'graphData.json'), JSON.stringify({ nodes, edges }, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'explainData.json'), JSON.stringify(explainData, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'roadmapData.json'), JSON.stringify({ roadmapTitle: "Hierarchical Architecture Map", steps: roadmapSteps }, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'ticketData.json'), JSON.stringify(ticketData, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'doctorData.json'), JSON.stringify(doctorData, null, 2));

  console.log(`\n======================================================`);
  console.log(`✅ VISUAL POLISH COMPLETE: Colored smoothstep arrows and auto-sized nodes added.`);
  console.log(`🎫 DYNAMIC TICKET GENERATED: ${ticketData.title}`);
  console.log(`🏥 ENVIRONMENT DOCTOR: ${doctorData.status}`);
  console.log(`======================================================\n`);

} catch (error) {
  console.error("❌ Presentation processing crashed:", error);
}