# 🚀 Easy Deployment Guide for FlowBase
**Repository**: https://github.com/ShivanshRastogi315/Repo_simplifier.git

This guide will walk you through deploying your FlowBase application using **Render (Backend)** and **Vercel (Frontend)** - both free!

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ GitHub repository: https://github.com/ShivanshRastogi315/Repo_simplifier.git
- ✅ Latest code pushed to GitHub
- ✅ Node.js installed locally (for testing)

---

## 🎯 STEP 1: Deploy Backend to Render (15 minutes)

### 1.1 Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with your **GitHub account** (easiest option)
4. Authorize Render to access your repositories

### 1.2 Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: **Repo_simplifier**
5. Click **"Connect"**

### 1.3 Configure Service Settings
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `flowbase-backend` (or any name you prefer) |
| **Region** | Choose closest to you |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | Leave empty |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server/index.js` |
| **Plan** | `Free` |

### 1.4 Add Environment Variables
Scroll down to **"Environment Variables"** section and add these:

Click **"Add Environment Variable"** for each:

```
NODE_ENV = production
PORT = 10000
TEMP_DIR = /tmp/repos
MAX_REPO_SIZE = 104857600
CLONE_TIMEOUT = 300000
RATE_LIMIT_WINDOW_MS = 3600000
RATE_LIMIT_MAX_REQUESTS = 10
SKIP_RATE_LIMIT = false
```

### 1.5 Deploy Backend
1. Click **"Create Web Service"** button at the bottom
2. Wait 5-10 minutes for deployment
3. Watch the logs - you should see "Server running on port 10000"
4. Once deployed, you'll see a URL like: `https://flowbase-backend.onrender.com`
5. **COPY THIS URL** - you'll need it for the frontend!

### 1.6 Test Backend
Open a new browser tab and test:
```
https://your-backend-url.onrender.com/health
```
You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-05-17T..."
}
```

✅ **Backend is now live!**

---

## 🎨 STEP 2: Prepare Frontend for Deployment (5 minutes)

### 2.1 Update Production Environment File

Open your `.env.production` file and update it with your Render backend URL:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_USE_MOCK_DATA=false
```

**Replace** `your-backend-url` with the actual URL from Step 1.5!

### 2.2 Commit and Push Changes

```bash
git add .env.production
git commit -m "Configure production API URL"
git push origin main
```

---

## 🌐 STEP 3: Deploy Frontend to Vercel (10 minutes)

### 3.1 Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find **"Repo_simplifier"** in the list
3. Click **"Import"**

### 3.3 Configure Project Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Create React App` (auto-detected) |
| **Root Directory** | `./` (leave as is) |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |

### 3.4 Add Environment Variables
Click **"Environment Variables"** and add:

```
REACT_APP_API_URL = https://your-backend-url.onrender.com
REACT_APP_USE_MOCK_DATA = false
```

**Important**: Use the same backend URL from Step 1.5!

### 3.5 Deploy Frontend
1. Click **"Deploy"** button
2. Wait 2-3 minutes for build and deployment
3. You'll get a URL like: `https://repo-simplifier.vercel.app`

✅ **Frontend is now live!**

---

## 🧪 STEP 4: Test Your Deployed Application

### 4.1 Open Your App
Visit your Vercel URL: `https://your-app.vercel.app`

### 4.2 Test Analysis Flow
1. Enter a GitHub repository URL (try: `https://github.com/facebook/react`)
2. Click **"Analyze Repository"**
3. Wait for analysis to complete
4. Verify all panels load:
   - ✅ Hierarchical Architecture Map (left, top)
   - ✅ Environment Doctor (left, bottom)
   - ✅ Architecture Graph (center)
   - ✅ File Inspector (right)

### 4.3 Check for Issues
Open browser console (F12) and check for:
- ❌ No CORS errors
- ❌ No 404 errors
- ❌ No network failures

---

## 🎉 SUCCESS! Your App is Live!

**Frontend URL**: `https://your-app.vercel.app`
**Backend URL**: `https://your-backend.onrender.com`

---

## 🔧 Common Issues & Solutions

### Issue 1: "Network Error" or CORS Error
**Solution**: Update CORS settings in `server/index.js`

Add your Vercel domain to the CORS whitelist:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',  // Add this
    'https://*.vercel.app'           // Allow all Vercel preview URLs
  ],
  credentials: true
};
```

Then commit and push - Render will auto-redeploy.

### Issue 2: Backend "Sleeping" (Free Tier)
**Problem**: Render free tier sleeps after 15 minutes of inactivity
**Solution**: 
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid tier ($7/month) for always-on
- Or use a service like UptimeRobot to ping your backend every 10 minutes

### Issue 3: Build Fails on Vercel
**Solution**: Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `.env.production` is committed
- Check for TypeScript/ESLint errors

### Issue 4: Analysis Takes Too Long
**Solution**: Increase timeout in backend
- Update `CLONE_TIMEOUT` to `600000` (10 minutes)
- Redeploy backend on Render

---

## 📊 Monitoring Your App

### Backend Monitoring (Render)
1. Go to Render dashboard
2. Click on your service
3. View **Logs** tab for real-time logs
4. Check **Metrics** for performance

### Frontend Monitoring (Vercel)
1. Go to Vercel dashboard
2. Click on your project
3. View **Analytics** for usage stats
4. Check **Deployments** for build history

---

## 🔄 Making Updates

### Update Backend
```bash
# Make changes to server code
git add .
git commit -m "Update backend"
git push origin main
```
Render will automatically redeploy (takes 2-3 minutes)

### Update Frontend
```bash
# Make changes to React code
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel will automatically redeploy (takes 1-2 minutes)

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **Render** | Free | $0/month | 750 hours/month, sleeps after 15min idle |
| **Vercel** | Hobby | $0/month | 100GB bandwidth, unlimited deployments |
| **Total** | | **$0/month** | Perfect for personal projects! |

### When to Upgrade?
- **Render Pro** ($7/month): Always-on, no sleep, better performance
- **Vercel Pro** ($20/month): More bandwidth, better analytics, team features

---

## 🎓 Next Steps

1. ✅ Share your app URL with friends/portfolio
2. ✅ Add custom domain (optional, available in both platforms)
3. ✅ Set up monitoring/alerts
4. ✅ Consider adding Google Analytics
5. ✅ Star your GitHub repo and add a nice README

---

## 📞 Need Help?

If something goes wrong:
1. Check the **Common Issues** section above
2. Review logs in Render/Vercel dashboards
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

---

## 🎊 Congratulations!

You've successfully deployed a full-stack application! 🚀

**Share your deployed app**:
- Add the URL to your GitHub README
- Share on LinkedIn/Twitter
- Add to your portfolio

---

**Created**: 2026-05-17
**Last Updated**: 2026-05-17
**Your Repo**: https://github.com/ShivanshRastogi315/Repo_simplifier.git