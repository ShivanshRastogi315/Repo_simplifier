# 🚀 Backend Server Setup Guide

## Phase 1 Implementation Complete ✅

We've successfully created a production-ready Express backend that can dynamically clone and analyze GitHub repositories!

## 📁 Project Structure

```
Repo_simplifier/
├── server/
│   ├── index.js                 # Main Express server
│   ├── config/
│   │   └── constants.js         # Configuration constants
│   ├── routes/
│   │   └── analyze.js           # API endpoints
│   ├── services/
│   │   ├── gitService.js        # Git cloning operations
│   │   └── analysisService.js   # Code analysis logic
│   ├── middleware/
│   │   ├── validator.js         # Input validation
│   │   └── rateLimiter.js       # Rate limiting
│   └── utils/
│       ├── logger.js            # Logging utility
│       └── cleanup.js           # Temp folder cleanup
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── package.json                 # Updated with new scripts
```

## 🎯 What We Built

### 1. **Express Server** (`server/index.js`)
- Production-ready HTTP server
- CORS and security middleware (Helmet)
- Graceful shutdown handling
- Global error handling
- Request logging

### 2. **Git Service** (`server/services/gitService.js`)
- Validates GitHub repository URLs
- Checks repository size before cloning
- Clones repositories to temporary folders
- Provides repository statistics
- Security checks for path traversal

### 3. **Analysis Service** (`server/services/analysisService.js`)
- Refactored from `generateData.js`
- Accepts any directory path (not hardcoded)
- Generates all visualization data:
  - Graph data (nodes & edges)
  - File explanations
  - Learning roadmap
  - Dynamic tickets
  - Environment doctor data
- Supports multiple file types (.js, .jsx, .ts, .tsx, .py, etc.)

### 4. **Cleanup Manager** (`server/utils/cleanup.js`)
- Automatic cleanup after analysis
- Scheduled cleanup of orphaned folders (every hour)
- Graceful cleanup on server shutdown
- Tracks active folders to prevent premature deletion
- Provides statistics on temp folder usage

### 5. **Security & Validation**
- **Rate Limiting**: 5 requests per IP per hour (configurable)
- **Input Validation**: Joi schema validation for GitHub URLs
- **Repository Size Limit**: Max 100MB (configurable)
- **Timeout Protection**: 5-minute analysis timeout
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers enabled

## 🔧 API Endpoints

### POST `/api/analyze`
Analyze a GitHub repository.

**Request:**
```json
{
  "repoUrl": "https://github.com/username/repository"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "graphData": { "nodes": [...], "edges": [...] },
    "explainData": [...],
    "roadmapData": { "roadmapTitle": "...", "steps": [...] },
    "ticketData": {...},
    "doctorData": {...}
  },
  "metadata": {
    "repoName": "username/repository",
    "analyzedAt": "2026-05-17T04:30:00Z",
    "fileCount": 42,
    "analysisTimeSeconds": 3.45,
    "repository": {
      "name": "repository",
      "fullName": "username/repository",
      "description": "...",
      "language": "JavaScript",
      "stars": 123
    },
    "stats": {
      "totalFiles": 42,
      "totalSize": 1234567,
      "totalSizeMB": "1.18",
      "fileTypes": { ".js": 20, ".jsx": 15, ".json": 7 }
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Repository not found or is private",
  "code": "INVALID_REPOSITORY"
}
```

### GET `/api/analyze/health`
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-05-17T04:30:00Z",
  "tempFolders": {
    "totalFolders": 0,
    "activeFolders": 0,
    "totalSizeMB": "0.00"
  }
}
```

### GET `/health`
Simple health check.

### GET `/`
API information.

## 🚀 How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your settings (optional, defaults work fine)
```

### 3. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run server:dev
```

**Production Mode:**
```bash
npm run server
```

**Run Both Frontend & Backend:**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🧪 Testing the API

### Using cURL:
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoUrl": "https://github.com/facebook/react"}'
```

### Using Postman/Thunder Client:
1. Create a POST request to `http://localhost:5000/api/analyze`
2. Set Content-Type to `application/json`
3. Body:
```json
{
  "repoUrl": "https://github.com/username/small-repo"
}
```

### Test with Small Repositories First:
- ✅ `https://github.com/sindresorhus/is-number`
- ✅ `https://github.com/chalk/chalk`
- ❌ Avoid large repos initially (>100MB)

## ⚙️ Configuration

Edit `.env` to customize:

```env
# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Repository Analysis
MAX_REPO_SIZE_MB=100          # Max repo size to clone
ANALYSIS_TIMEOUT_MS=300000    # 5 minutes

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=5     # Requests per window
RATE_LIMIT_WINDOW_MS=3600000  # 1 hour window
SKIP_RATE_LIMIT=true          # Skip in development

# Temp Directory
TEMP_DIR=./temp-repos
```

## 🔒 Security Features

1. **Rate Limiting**: Prevents abuse (5 req/hour per IP)
2. **Input Validation**: Strict GitHub URL validation
3. **Size Limits**: Rejects repositories >100MB
4. **Timeout Protection**: Kills long-running analysis
5. **Path Sanitization**: Prevents directory traversal
6. **CORS**: Restricts origins in production
7. **Helmet**: Security headers enabled

## 🧹 Cleanup Strategy

The cleanup manager handles temporary folders:

1. **Immediate Cleanup**: After successful/failed analysis
2. **Scheduled Cleanup**: Every hour for orphaned folders
3. **Shutdown Cleanup**: Optional full cleanup on server stop
4. **Active Tracking**: Prevents deletion of in-use folders

## 📊 Monitoring

Check server health:
```bash
curl http://localhost:5000/api/analyze/health
```

View temp folder statistics in the health response.

## 🐛 Troubleshooting

### Server won't start:
- Check if port 5000 is already in use
- Verify all dependencies are installed: `npm install`
- Check `.env` file exists

### Clone fails:
- Ensure repository is public
- Check repository size (<100MB)
- Verify GitHub URL format
- Check internet connection

### Analysis fails:
- Repository might have no supported files
- Check server logs for detailed errors
- Verify temp directory is writable

### Rate limit errors:
- Set `SKIP_RATE_LIMIT=true` in `.env` for development
- Wait for the rate limit window to reset (1 hour)

## 📝 Next Steps

Phase 1 is complete! Next phases:

- **Phase 2**: Create landing page with URL input
- **Phase 3**: Update React dashboard to fetch from API
- **Phase 4**: Add loading states and error handling
- **Phase 5**: Deploy to production

## 🎉 Success Criteria

✅ Express server running on port 5000
✅ Can clone public GitHub repositories
✅ Generates analysis data dynamically
✅ Cleans up temporary folders automatically
✅ Rate limiting and security in place
✅ Error handling and logging working
✅ Health check endpoint responding

## 📚 Key Files to Review

1. `server/index.js` - Main server setup
2. `server/routes/analyze.js` - API endpoint logic
3. `server/services/gitService.js` - Git operations
4. `server/services/analysisService.js` - Analysis logic
5. `server/utils/cleanup.js` - Cleanup management

---

**Status**: Phase 1 Complete ✅
**Next**: Build frontend landing page and integrate with API