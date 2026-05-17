# 🚀 FlowBase Quick Start Guide

Get FlowBase up and running in 5 minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A GitHub repository URL to analyze

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

The default settings work for local development!

### 3. Start the Application

**Option A: Full Stack (Recommended)**
```bash
npm run dev
```
This starts both backend (port 3001) and frontend (port 3000) simultaneously.

**Option B: Backend Only**
```bash
npm run server
```

**Option C: Frontend Only (with mock data)**
```bash
# Edit .env.development
REACT_APP_USE_MOCK_DATA=true

npm start
```

### 4. Open Your Browser

Navigate to: **http://localhost:3000**

### 5. Analyze a Repository

1. Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
2. Click "Analyze Repository"
3. Wait for analysis to complete (1-3 minutes)
4. Explore the interactive dashboard!

---

## 🎯 What You'll See

### Landing Page
- Clean input form for GitHub URLs
- Example repositories to try
- Real-time validation

### Dashboard (After Analysis)
- **Left Panel**: Learning roadmap with step-by-step guide
- **Center Panel**: Interactive architecture graph
- **Right Panel**: AI-generated file summaries

---

## 🧪 Test the Integration

Run the automated test suite:

```bash
# Make sure backend is running first
npm run server

# In another terminal
npm run test:integration
```

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure backend is running: `npm run server`
- Check if port 3001 is available
- Verify `.env` configuration

### "Analysis timeout"
- Try a smaller repository first
- Check your internet connection
- Increase timeout in `.env`: `CLONE_TIMEOUT=600000`

### "CORS error"
- Backend should handle CORS automatically
- Check if both frontend and backend are running
- Verify `REACT_APP_API_URL` in `.env.development`

### Components not loading
- Clear browser cache
- Check browser console for errors
- Verify all dependencies installed: `npm install`

---

## 📚 Next Steps

1. **Read Full Documentation**
   - `PHASE2_3_IMPLEMENTATION.md` - Implementation details
   - `DEPLOYMENT_GUIDE.md` - Production deployment
   - `SERVER_SETUP.md` - Backend configuration

2. **Try Different Repositories**
   - Start with small repos (< 100 files)
   - Try popular open-source projects
   - Analyze your own repositories

3. **Customize**
   - Adjust analysis parameters in `.env`
   - Modify UI components in `src/components/`
   - Add custom features

4. **Deploy to Production**
   - Follow `DEPLOYMENT_GUIDE.md`
   - Choose Railway, Render, or Vercel
   - Configure environment variables

---

## 🎨 Example Repositories to Try

**Small & Fast** (< 1 minute):
- `https://github.com/sindresorhus/is`
- `https://github.com/chalk/chalk`

**Medium** (1-2 minutes):
- `https://github.com/expressjs/express`
- `https://github.com/axios/axios`

**Large** (2-5 minutes):
- `https://github.com/facebook/react`
- `https://github.com/vercel/next.js`

---

## 💡 Pro Tips

1. **Development Mode**: Use `npm run dev` to auto-reload on changes
2. **Mock Data**: Set `REACT_APP_USE_MOCK_DATA=true` for instant testing
3. **Logs**: Check terminal for detailed backend logs
4. **Browser DevTools**: Use React DevTools for component inspection
5. **API Testing**: Use `npm run test:integration` before deploying

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review error messages in terminal/console
3. Read the full documentation
4. Check GitHub issues
5. Create a new issue with details

---

## 🎉 You're Ready!

Start analyzing repositories and exploring codebases with AI-powered insights!

```bash
npm run dev
```

Then open http://localhost:3000 and paste a GitHub URL!

---

**Happy Coding! 🚀**