const path = require('path');

module.exports = {
  // Server Configuration
  PORT: process.env.SERVER_PORT || process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Repository Analysis Configuration
  TEMP_DIR: process.env.TEMP_DIR || path.join(__dirname, '../../temp-repos'),
  MAX_REPO_SIZE_MB: parseInt(process.env.MAX_REPO_SIZE_MB) || 100,
  ANALYSIS_TIMEOUT_MS: parseInt(process.env.ANALYSIS_TIMEOUT_MS) || 300000, // 5 minutes
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000, // 1 hour
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5,
  
  // CORS Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Blacklisted directories and files (from generateData.js)
  BLACKLISTED_DIR_NAMES: ['node_modules', '.git', 'build', 'dist', 'public', '.vscode', 'venv', '__pycache__', 'coverage', '.next', 'out'],
  BLACKLISTED_FILE_NAMES: ['package-lock.json', 'package.json', '.gitignore', 'README.md', 'BOB_PROMPTS.md', 'yarn.lock'],
  
  // Supported file extensions
  SUPPORTED_EXTENSIONS: ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rb', '.php'],
  
  // Cache Configuration
  CACHE_ENABLED: process.env.CACHE_ENABLED === 'true',
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS) || 86400, // 24 hours
};

// Made with Bob
