# 🔧 Port Clash Fix Guide

## Problem
The backend was starting on port 5000, but then the frontend (React) was also trying to use port 5000, causing a crash.

## Root Cause
The `.env` file had `PORT=5000`, which was being read by BOTH:
1. **Backend** (Node.js/Express) - correctly using it for the server
2. **Frontend** (react-scripts) - incorrectly inheriting it and trying to use port 5000

React's `react-scripts` reads the `PORT` environment variable and uses it for the development server, overriding the default port 3000.

## Solution Applied

### 1. Updated `.env` File
Changed from:
```bash
PORT=5000
```

To:
```bash
SERVER_PORT=5000  # Backend uses this
PORT=3000         # Frontend uses this
```

### 2. Updated `server/config/constants.js`
Changed from:
```javascript
PORT: process.env.PORT || 5000,
```

To:
```javascript
PORT: process.env.SERVER_PORT || process.env.PORT || 5000,
```

This allows the backend to:
- First try `SERVER_PORT` (explicit backend port)
- Fall back to `PORT` if `SERVER_PORT` not set
- Default to 5000 if neither is set

### 3. Updated `package.json` Scripts
Made ports explicit in npm scripts using `cross-env` for Windows compatibility:

```json
{
  "scripts": {
    "start": "cross-env PORT=3000 react-scripts start",
    "server": "cross-env SERVER_PORT=5000 node server/index.js",
    "server:dev": "cross-env SERVER_PORT=5000 nodemon server/index.js",
    "dev": "concurrently \"npm run server\" \"npm start\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "cross-env": "^7.0.3",
    "nodemon": "^3.1.14"
  }
}
```

**Install cross-env:**
```bash
npm install --save-dev cross-env
```

### 4. Updated `.env.development`
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_USE_MOCK_DATA=false
PORT=3000
```

### 5. Updated `.env.example`
```bash
SERVER_PORT=5000
PORT=3000
FRONTEND_URL=http://localhost:3000
```

## How It Works Now

### Backend (Port 5000)
1. Reads `SERVER_PORT=5000` from `.env`
2. Starts Express server on port 5000
3. Available at: `http://localhost:5000`

### Frontend (Port 3000)
1. Reads `PORT=3000` from `.env` or `.env.development`
2. Starts React dev server on port 3000
3. Available at: `http://localhost:3000`
4. Makes API calls to `http://localhost:5000` (via `REACT_APP_API_URL`)

## Testing the Fix

### 1. Clean Start
```bash
# Kill any existing processes on ports 3000 and 5000
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### 2. Start the Application
```bash
npm run dev
```

### 3. Verify
You should see:
```
[0] 🚀 Server running on port 5000
[0] Environment: development
[0] Frontend URL: http://localhost:3000
[0] API available at: http://localhost:5000/api
[1] Compiled successfully!
[1] You can now view repo_simplifier in the browser.
[1] Local: http://localhost:3000
```

### 4. Test Both Servers
- Backend: `curl http://localhost:5000/health`
- Frontend: Open `http://localhost:3000` in browser

## Environment Variables Reference

### `.env` (Root - Backend & Frontend)
```bash
# Backend Configuration
SERVER_PORT=5000
NODE_ENV=development

# Frontend Configuration (for react-scripts)
PORT=3000
FRONTEND_URL=http://localhost:3000

# Repository Analysis
TEMP_DIR=./temp-repos
MAX_REPO_SIZE_MB=100
ANALYSIS_TIMEOUT_MS=300000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5
SKIP_RATE_LIMIT=true
```

### `.env.development` (Frontend Only)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_USE_MOCK_DATA=false
PORT=3000
```

### `.env.production` (Frontend Only)
```bash
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_USE_MOCK_DATA=false
```

## Why This Approach?

### Separation of Concerns
- `SERVER_PORT` - Explicitly for backend
- `PORT` - Explicitly for frontend (react-scripts convention)

### Backward Compatibility
- Backend still checks `PORT` as fallback
- Works with existing deployment platforms

### Clear Intent
- Scripts explicitly set ports
- No ambiguity about which port is for what

## Common Issues & Solutions

### Issue: Frontend still tries to use port 5000
**Solution**: 
1. Check `.env.development` has `PORT=3000`
2. Restart the dev server
3. Clear any cached environment variables

### Issue: Backend uses wrong port
**Solution**:
1. Verify `SERVER_PORT=5000` in `.env`
2. Check `server/config/constants.js` reads `SERVER_PORT`
3. Restart the server

### Issue: CORS errors after port change
**Solution**:
1. Update `FRONTEND_URL` in `.env` to match frontend port
2. Restart backend server
3. Clear browser cache

### Issue: API calls fail
**Solution**:
1. Verify `REACT_APP_API_URL=http://localhost:5000` in `.env.development`
2. Check backend is running on port 5000
3. Test backend directly: `curl http://localhost:5000/health`

## Platform-Specific Notes

### Windows Fix (IMPORTANT!)
Windows doesn't support inline environment variables like `PORT=3000 command`.

**Solution: Use cross-env**

1. **Install cross-env:**
   ```bash
   npm install --save-dev cross-env
   ```

2. **Scripts automatically use cross-env** (already configured in package.json):
   ```json
   "start": "cross-env PORT=3000 react-scripts start"
   ```

3. **Just run:**
   ```bash
   npm run dev
   ```

### Mac/Linux
The cross-env package works on Mac/Linux too, so the same scripts work everywhere!

### Manual Commands (if needed)

**Windows:**
```cmd
set SERVER_PORT=5000 && node server/index.js
set PORT=3000 && npm start
```

**Mac/Linux:**
```bash
SERVER_PORT=5000 node server/index.js
PORT=3000 npm start
```

### Cross-Platform (Recommended)
Use the npm scripts which handle this automatically with cross-env:
```bash
npm run dev
```

## Production Deployment

### Railway/Render/Heroku
These platforms set `PORT` automatically. Our config handles this:

```javascript
PORT: process.env.SERVER_PORT || process.env.PORT || 5000
```

So in production:
- Platform sets `PORT` (e.g., 8080)
- Backend uses it automatically
- No `SERVER_PORT` needed

### Vercel (Frontend Only)
Frontend doesn't need port configuration in production.
Just set:
```bash
REACT_APP_API_URL=https://your-backend-url.com
```

## Summary

✅ **Backend**: Port 5000 (via `SERVER_PORT`)  
✅ **Frontend**: Port 3000 (via `PORT`)  
✅ **No Conflicts**: Each service has its own port  
✅ **Clear Configuration**: Explicit environment variables  
✅ **Production Ready**: Works with deployment platforms  

## Quick Reference

```bash
# Start everything
npm run dev

# Start backend only
npm run server

# Start frontend only
npm start

# Test integration
npm run test:integration
```

**Ports:**
- Backend API: http://localhost:5000
- Frontend UI: http://localhost:3000
- Health Check: http://localhost:5000/health
- API Endpoint: http://localhost:5000/api/analyze

---

**Fixed**: 2024-05-17  
**Issue**: Port clash between backend and frontend  
**Solution**: Separate `SERVER_PORT` and `PORT` environment variables