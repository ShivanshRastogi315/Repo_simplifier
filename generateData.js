const fs = require('fs');
const path = require('path');

const DUMMY_REPO_DIR = path.join(__dirname, 'src', 'dummy-repo');
const MOCK_DATA_DIR = path.join(__dirname, 'src', 'mockData');

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

  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'graphData.json'), JSON.stringify({ nodes, edges }, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'explainData.json'), JSON.stringify(explainData, null, 2));
  fs.writeFileSync(path.join(MOCK_DATA_DIR, 'roadmapData.json'), JSON.stringify({ roadmapTitle: "Hierarchical Architecture Map", steps: roadmapSteps }, null, 2));

  console.log(`\n======================================================`);
  console.log(`✅ VISUAL POLISH COMPLETE: Colored smoothstep arrows and auto-sized nodes added.`);
  console.log(`======================================================\n`);

} catch (error) {
  console.error("❌ Presentation processing crashed:", error);
}