const fs = require('fs-extra');
const path = require('path');
const logger = require('../utils/logger');
const {
  BLACKLISTED_DIR_NAMES,
  BLACKLISTED_FILE_NAMES,
  SUPPORTED_EXTENSIONS,
} = require('../config/constants');

class AnalysisService {
  /**
   * Analyze a repository and generate all visualization data
   */
  async analyzeRepository(repoPath, repoInfo) {
    try {
      logger.info('Starting repository analysis', { repoPath, repoInfo: repoInfo.fullName });

      const startTime = Date.now();

      // Scan all code files
      const allCodeFiles = this.getAllCodeFiles(repoPath);
      
      if (allCodeFiles.length === 0) {
        return {
          success: false,
          error: 'No supported code files found in repository',
        };
      }

      logger.info(`Found ${allCodeFiles.length} code files`);

      // Analyze each file
      const repositoryMap = {};
      allCodeFiles.forEach(fileMeta => {
        const fileText = fs.readFileSync(fileMeta.absolutePath, 'utf-8');
        repositoryMap[fileMeta.relativePath] = this.analyzeFileContent(
          fileMeta,
          fileText,
          allCodeFiles
        );
      });

      // Generate visualization data
      const graphData = this.generateGraphData(repositoryMap);
      const explainData = this.generateExplainData(repositoryMap);
      const roadmapData = this.generateRoadmapData(repositoryMap);
      const ticketData = this.generateTicketData(Object.keys(repositoryMap), explainData);
      const doctorData = this.generateDoctorData(repoPath, repoInfo);

      const analysisTime = ((Date.now() - startTime) / 1000).toFixed(2);
      logger.success(`Analysis completed in ${analysisTime}s`);

      return {
        success: true,
        data: {
          graphData,
          explainData,
          roadmapData,
          ticketData,
          doctorData,
        },
        metadata: {
          repoName: repoInfo.fullName,
          analyzedAt: new Date().toISOString(),
          fileCount: allCodeFiles.length,
          analysisTimeSeconds: parseFloat(analysisTime),
        },
      };
    } catch (error) {
      logger.error('Repository analysis failed', error);
      return {
        success: false,
        error: 'Failed to analyze repository',
      };
    }
  }

  /**
   * Recursively scan directories for all code files
   */
  getAllCodeFiles(dir, fileList = [], baseDir = dir) {
    try {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Skip blacklisted directories
          if (!BLACKLISTED_DIR_NAMES.includes(file)) {
            this.getAllCodeFiles(filePath, fileList, baseDir);
          }
        } else {
          const fileExt = path.extname(file).toLowerCase();
          
          // Check if file extension is supported and not blacklisted
          if (
            SUPPORTED_EXTENSIONS.includes(fileExt) &&
            !BLACKLISTED_FILE_NAMES.includes(file)
          ) {
            fileList.push({
              absolutePath: filePath,
              relativePath: path.relative(baseDir, filePath).replace(/\\/g, '/'),
              fileName: file,
            });
          }
        }
      });

      return fileList;
    } catch (error) {
      logger.error(`Error scanning directory: ${dir}`, error);
      return fileList;
    }
  }

  /**
   * Analyze individual file content
   */
  analyzeFileContent(fileMeta, fileText, allFilesList) {
    const fileName = path.basename(fileMeta.relativePath);
    const cleanName = fileName.split('.')[0];

    // Extract functions/methods
    const functionRegex = /(?:function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|def\s+([a-zA-Z0-9_]+)|class\s+([a-zA-Z0-9_]+))/g;
    const discoveredFunctions = [];
    let match;
    
    while ((match = functionRegex.exec(fileText)) !== null) {
      const funcName = match[1] || match[2] || match[3] || match[4];
      if (funcName && !discoveredFunctions.includes(funcName)) {
        discoveredFunctions.push(funcName);
      }
    }

    // Find dependencies (imports/requires)
    const dependencies = [];
    allFilesList.forEach(otherFile => {
      if (otherFile.relativePath === fileMeta.relativePath) return;
      
      const otherFileCleanName = path.basename(otherFile.relativePath).split('.')[0];
      const importPattern = new RegExp(
        `(?:import|from|require\\s*\\()\\s*['\"].*\\/${otherFileCleanName}(?:\\.[a-zA-Z0-9]+)?['\"]`,
        'i'
      );

      if (importPattern.test(fileText) || fileText.includes(otherFileCleanName)) {
        if (!dependencies.includes(otherFile.relativePath)) {
          dependencies.push(otherFile.relativePath);
        }
      }
    });

    // Generate summary
    let summary = `The \`${fileName}\` module encapsulates localized software operations. `;
    if (discoveredFunctions.length > 0) {
      summary += `It coordinates ${discoveredFunctions.length} behavioral systems handlers.`;
    }

    // Generate key functions list
    let keyFunctions = discoveredFunctions.slice(0, 5).map(func => ({
      name: `${func}()`,
      purpose: `Executes operational processing for internal runtime sequences.`,
    }));

    if (keyFunctions.length === 0) {
      keyFunctions = [
        { name: 'defaultConfig', purpose: `Exposes core layout constants or system assets.` },
      ];
    }

    return { summary, keyFunctions, dependencies };
  }

  /**
   * Generate graph visualization data
   */
  generateGraphData(repositoryMap) {
    const nodes = [];
    const edges = [];

    // Categorize files into layers
    const layers = { configs: [], system: [], pages: [], utilities: [] };

    Object.keys(repositoryMap).forEach(relPath => {
      const lowerPath = relPath.toLowerCase();
      if (lowerPath.includes('config') || lowerPath.includes('eslint')) {
        layers.configs.push(relPath);
      } else if (
        lowerPath.includes('server') ||
        lowerPath.includes('model') ||
        lowerPath.includes('main.') ||
        lowerPath.includes('app.')
      ) {
        layers.system.push(relPath);
      } else if (
        lowerPath.includes('page') ||
        lowerPath.includes('dashboard') ||
        lowerPath.includes('landing') ||
        lowerPath.includes('login') ||
        lowerPath.includes('register')
      ) {
        layers.pages.push(relPath);
      } else {
        layers.utilities.push(relPath);
      }
    });

    // Define layer rendering specifications
    const renderOrderLayers = [
      { targetGroup: layers.configs, verticalY: 80, horizontalGap: 240, color: '#f59e0b' },
      { targetGroup: layers.system, verticalY: 240, horizontalGap: 220, color: '#ec4899' },
      { targetGroup: layers.pages, verticalY: 420, horizontalGap: 200, color: '#10b981' },
      { targetGroup: layers.utilities, verticalY: 600, horizontalGap: 240, color: '#a855f7' },
    ];

    renderOrderLayers.forEach(layerSpec => {
      layerSpec.targetGroup.forEach((relativePathKey, horizontalIdx) => {
        const analysis = repositoryMap[relativePathKey];
        const pureFileName = path.basename(relativePathKey);

        const startXOffset = 400 - ((layerSpec.targetGroup.length - 1) * layerSpec.horizontalGap) / 2;

        nodes.push({
          id: relativePathKey,
          position: {
            x: startXOffset + horizontalIdx * layerSpec.horizontalGap,
            y: layerSpec.verticalY,
          },
          data: { label: pureFileName },
        });

        analysis.dependencies.forEach((depRelativePath, dIdx) => {
          edges.push({
            id: `e-${relativePathKey}-${depRelativePath}-${dIdx}`,
            source: relativePathKey,
            target: depRelativePath,
            type: 'smoothstep',
            animated: true,
            style: { stroke: layerSpec.color, strokeWidth: 1.5 },
            markerEnd: {
              type: 'arrowclosed',
              width: 15,
              height: 15,
              color: layerSpec.color,
            },
          });
        });
      });
    });

    // Add fallback edges if no dependencies found
    if (edges.length === 0) {
      const keys = Object.keys(repositoryMap);
      for (let i = 0; i < keys.length - 1; i++) {
        edges.push({
          id: `f-edge-${i}`,
          source: keys[i],
          target: keys[i + 1],
          animated: false,
          style: { stroke: '#334155' },
        });
      }
    }

    return { nodes, edges };
  }

  /**
   * Generate file explanations data
   */
  generateExplainData(repositoryMap) {
    return Object.keys(repositoryMap).map(filepath => ({
      filepath,
      summary: repositoryMap[filepath].summary,
      keyFunctions: repositoryMap[filepath].keyFunctions,
    }));
  }

  /**
   * Generate learning roadmap data
   */
  generateRoadmapData(repositoryMap) {
    const steps = Object.keys(repositoryMap).map((filepath, index) => {
      const fileName = path.basename(filepath);
      const analysis = repositoryMap[filepath];

      return {
        stepNumber: index + 1,
        title: `Explore ${fileName.split('.')[0]}`,
        targetFile: filepath,
        description: analysis.summary,
      };
    });

    return {
      roadmapTitle: 'Hierarchical Architecture Map',
      steps,
    };
  }

  /**
   * Generate dynamic ticket data
   */
  generateTicketData(files, explainData) {
    // Simple ticket generation - can be enhanced
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const fileData = explainData.find(d => d.filepath === randomFile);

    return {
      ticketId: `REPO-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
      title: `Add Documentation to ${path.basename(randomFile)}`,
      difficulty: 'Easy',
      type: 'documentation',
      context: `The file "${randomFile}" contains ${fileData?.keyFunctions.length || 0} functions but lacks proper documentation.`,
      instructions: `Add JSDoc comments to all functions in "${randomFile}". Include @param and @returns tags where applicable.`,
      filesToInvestigate: [randomFile],
      acceptanceCriteria: [
        'All functions have JSDoc comments',
        'Parameters are documented with @param',
        'Return values documented with @returns',
        'Comments are clear and helpful',
      ],
      knowledgeCheck: [
        {
          question: `What is the primary purpose of ${path.basename(randomFile)}?`,
          hint: fileData?.summary || 'Check the file content',
        },
      ],
    };
  }

  /**
   * Generate environment doctor data
   */
  generateDoctorData(repoPath, repoInfo) {
    const issues = [];
    const setupSteps = [];
    const stack = [];
    let quickStartScript = '';

    // Check for package.json
    const packageJsonPath = path.join(repoPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      if (packageJson.dependencies?.react) stack.push('React');
      if (packageJson.dependencies?.express) stack.push('Express.js');
      if (packageJson.dependencies?.vue) stack.push('Vue.js');
      
      setupSteps.push('Install Node.js (v16+ recommended)');
      setupSteps.push('Run: npm install');
      setupSteps.push('Run: npm start');

      // Generate quick start script for Node.js projects
      quickStartScript = `#!/bin/bash
# Auto-generated setup script

echo "📦 Installing dependencies..."
npm install

echo "⚙️ Setting up environment variables..."
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Created .env file. Please fill in the values."
  fi
fi

echo "🚀 Starting application..."
npm start`;
    }

    // Check for requirements.txt (Python)
    if (fs.existsSync(path.join(repoPath, 'requirements.txt'))) {
      stack.push('Python');
      setupSteps.push('Install Python 3.8+');
      setupSteps.push('Run: pip install -r requirements.txt');

      // Generate quick start script for Python projects
      if (!quickStartScript) {
        quickStartScript = `#!/bin/bash
# Auto-generated setup script

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🚀 Starting application..."
python main.py`;
      }
    }

    return {
      status: 'Analysis Complete',
      detectedStack: stack.join(', ') || 'Unknown',
      projectStack: stack.join(', ') || 'Unknown', // Keep for backward compatibility
      ports: ['3000', '5000'],
      detectedPorts: ['3000', '5000'], // Keep for backward compatibility
      issuesFound: issues.length > 0 ? issues : [
        {
          type: 'Ready',
          description: 'Repository structure analyzed successfully',
          severity: 'success',
        },
      ],
      setupSteps,
      quickStartScript,
    };
  }
}

module.exports = new AnalysisService();

// Made with Bob
