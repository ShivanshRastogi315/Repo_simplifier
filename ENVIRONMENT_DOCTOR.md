# 🏥 Environment Doctor - Dynamic Repository Analysis

## Overview

The **Environment Doctor** is an intelligent DevOps assistant that automatically analyzes your repository and generates repository-specific setup instructions, troubleshooting guides, and quick-start scripts. It eliminates generic onboarding documentation by inspecting the actual codebase and detecting real configuration requirements.

## What It Does

### 1. **Automatic Stack Detection**

Scans your repository to identify:
- **Project Type**: Node.js, Python, Go, etc.
- **Frameworks**: React, Vue, Angular, Express, Django, Flask, FastAPI
- **Build Tools**: Create React App, Vite, Next.js, Webpack
- **Databases**: MongoDB, PostgreSQL, MySQL, Redis
- **Services**: Docker containers, microservices architecture

### 2. **Environment Analysis**

Inspects configuration files to detect:
- Required environment variables (from `.env.example`, code references)
- Port configurations (from scripts, Docker configs, API calls)
- Dependencies and their versions
- Docker/Docker Compose setup
- Database connections

### 3. **Issue Detection**

Identifies common onboarding problems:
- ✅ Missing `node_modules` (dependencies not installed)
- ✅ Missing `.env` file (environment variables not configured)
- ✅ Database not running (MongoDB, PostgreSQL, etc.)
- ✅ Port conflicts
- ✅ Incompatible Node.js/Python versions
- ✅ Missing Docker daemon

### 4. **Actionable Solutions**

Provides:
- **Fix Commands**: Exact terminal commands to resolve issues
- **Setup Steps**: Ordered list of installation/configuration steps
- **Quick-Start Script**: Auto-generated bash script for one-command setup
- **Startup Commands**: How to actually run the application

## How It Works

### Analysis Pipeline

```
Repository Files
      ↓
[Scan package.json, requirements.txt, docker-compose.yml, etc.]
      ↓
[Extract dependencies, scripts, environment variables]
      ↓
[Scan dummy-repo code for API URLs, ports, env vars]
      ↓
[Detect issues: missing files, uninstalled deps, etc.]
      ↓
[Generate setup steps, fix commands, quick-start script]
      ↓
doctorData.json
```

### Files Analyzed

1. **`package.json`** - Node.js dependencies, scripts, framework detection
2. **`requirements.txt`** - Python dependencies, framework detection
3. **`docker-compose.yml`** - Services, ports, container configuration
4. **`Dockerfile`** - Containerization setup
5. **`.env.example`** - Required environment variables
6. **`src/dummy-repo/*`** - API endpoints, environment variable usage

## Generated Output Structure

```json
{
  "status": "Setup Required",
  "detectedFiles": ["package.json", "docker-compose.yml"],
  "projectStack": "React, Create React App, Express.js",
  "detectedPorts": ["3000", "5000"],
  "requiredEnvVars": 3,
  "issuesFound": [
    {
      "type": "Dependencies Not Installed",
      "description": "The node_modules folder is missing...",
      "severity": "critical",
      "fixCommand": "npm install",
      "autoFixable": true
    }
  ],
  "setupSteps": [
    "Install Node.js (v16+ recommended)",
    "Run: npm install",
    "Run: npm start"
  ],
  "startupCommands": ["npm start"],
  "quickStartScript": "#!/bin/bash\n..."
}
```

## Usage

### For Repository Maintainers

1. Place your project files in `src/dummy-repo/`
2. Run the analyzer:
   ```bash
   cd Repo_simplifier
   node generateData.js
   ```
3. The system generates `doctorData.json` with repository-specific setup instructions

### For New Developers

1. Start the application:
   ```bash
   npm start
   ```
2. View the **Environment Doctor** panel in the left sidebar
3. See:
   - Detected project stack
   - Current setup status
   - Issues blocking development
   - Fix commands for each issue
   - Complete setup steps
   - Quick-start script

## Detection Logic

### Stack Detection

**React Detection:**
```javascript
if (dependencies['react'] || devDependencies['react']) {
  stack.push('React');
  if (dependencies['react-scripts']) stack.push('Create React App');
  if (dependencies['next']) stack.push('Next.js');
  if (dependencies['vite']) stack.push('Vite');
}
```

**Database Detection:**
```javascript
if (dependencies['mongoose']) {
  databases.push('MongoDB');
  envVars.push({ key: 'MONGODB_URI', purpose: 'MongoDB connection string' });
}
```

**Port Detection:**
```javascript
// From package.json scripts
const portMatch = script.match(/PORT[=\s]+(\d+)|port[=\s]+(\d+)|:(\d+)/);

// From code files
const apiMatches = content.match(/https?:\/\/[^\s"']+|localhost:\d+/g);
```

### Issue Priority

1. **Critical** (Red 🚨): Blocks application startup
   - Missing dependencies
   - Missing required files

2. **High** (Orange ⚠️): Prevents full functionality
   - Missing environment variables
   - Configuration errors

3. **Medium** (Blue ℹ️): May cause runtime issues
   - Database not running
   - External service unavailable

4. **Success** (Green ✅): Ready to run
   - All checks passed

## Example Outputs

### React + Express Full-Stack App

```json
{
  "status": "Setup Required",
  "projectStack": "React, Create React App, Express.js",
  "detectedPorts": ["3000", "5000"],
  "issuesFound": [
    {
      "type": "Dependencies Not Installed",
      "severity": "critical",
      "fixCommand": "npm install"
    },
    {
      "type": "Missing Environment Configuration",
      "severity": "high",
      "fixCommand": "cp .env.example .env"
    },
    {
      "type": "MongoDB Connection Required",
      "severity": "medium",
      "fixCommand": "Start MongoDB service or use Docker"
    }
  ],
  "setupSteps": [
    "Install Node.js (v16+ recommended)",
    "Run: npm install",
    "Copy .env.example to .env and configure",
    "Start MongoDB",
    "Run: npm run dev"
  ]
}
```

### Dockerized Microservices

```json
{
  "status": "Ready to Run",
  "projectStack": "Docker, Node.js, PostgreSQL",
  "detectedPorts": ["3000", "5432", "8080"],
  "issuesFound": [
    {
      "type": "Environment Ready",
      "severity": "success",
      "description": "Docker Compose detected. All services configured."
    }
  ],
  "setupSteps": [
    "Install Docker Desktop",
    "Run: docker-compose up"
  ],
  "quickStartScript": "#!/bin/bash\ndocker-compose up -d"
}
```

## Quick-Start Script Generation

The system auto-generates executable bash scripts:

```bash
#!/bin/bash
# Auto-generated setup script

echo "📦 Installing dependencies..."
npm install

echo "⚙️ Setting up environment variables..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env file. Please fill in the values."
fi

echo "🚀 Starting application..."
npm start
```

## Benefits

### For New Developers
- **Zero guesswork** - Exact commands to run
- **Instant feedback** - See what's blocking you
- **Learn by doing** - Understand the stack through setup
- **Confidence** - Know when environment is ready

### For Teams
- **Reduced onboarding time** - From hours to minutes
- **Consistent setup** - Everyone follows the same steps
- **Self-documenting** - Instructions update with code changes
- **Proactive troubleshooting** - Catch issues before they block work

### For Maintainers
- **Zero maintenance** - Auto-generates from codebase
- **Always accurate** - Reflects current repository state
- **Scalable** - Works for any project structure
- **Educational** - Helps developers understand architecture

## Advanced Features

### Multi-Service Detection

Automatically identifies service relationships:
```
Frontend (React:3000) → Backend API (Express:5000) → Database (MongoDB:27017)
```

### Environment Variable Tracking

Scans code for usage:
```javascript
// Detects from code
const apiUrl = import.meta.env.VITE_API_URL;
const dbUri = process.env.MONGODB_URI;

// Adds to required env vars
envVars: [
  { key: 'VITE_API_URL', purpose: 'Used in application code' },
  { key: 'MONGODB_URI', purpose: 'MongoDB connection string' }
]
```

### Docker Integration

Parses `docker-compose.yml` to extract:
- Service names
- Port mappings
- Volume mounts
- Environment variables
- Service dependencies

## Troubleshooting

**Issue**: Doctor shows "Unknown" project type
- **Solution**: Ensure `package.json` or `requirements.txt` exists in root directory

**Issue**: Ports not detected
- **Solution**: Add port configuration to package.json scripts or code

**Issue**: Environment variables not found
- **Solution**: Create `.env.example` file or use env vars in code

**Issue**: Setup steps seem incomplete
- **Solution**: The doctor only detects what exists in the repository. Add missing config files.

## Future Enhancements

Planned features:
- **Version compatibility checking** (Node.js, Python versions)
- **Dependency conflict detection**
- **Performance optimization suggestions**
- **Security vulnerability scanning**
- **CI/CD pipeline detection**
- **Cloud deployment readiness check**

## Contributing

To add new detection patterns:

1. Edit `analyzeRepositoryEnvironment()` in `generateData.js`
2. Add detection logic for your technology
3. Update `generateDoctorData()` to create appropriate issues
4. Test with a sample repository

Example - Adding Go detection:
```javascript
// In analyzeRepositoryEnvironment()
if (fs.existsSync(path.join(ROOT_DIR, 'go.mod'))) {
  analysis.projectType = 'Go';
  const goMod = fs.readFileSync(path.join(ROOT_DIR, 'go.mod'), 'utf-8');
  if (goMod.includes('gin-gonic/gin')) analysis.stack.push('Gin');
  if (goMod.includes('gorilla/mux')) analysis.stack.push('Gorilla Mux');
}
```

---

**Built to eliminate "works on my machine" problems** 🚀