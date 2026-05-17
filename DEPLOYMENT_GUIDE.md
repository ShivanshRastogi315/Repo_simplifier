# 🚀 FlowBase Deployment Guide

This guide covers deploying FlowBase to production using various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository hosted on GitHub
- Backend and frontend code ready
- Environment variables configured

## 🎯 Deployment Options

### Option 1: Railway (Recommended for Full-Stack)

Railway provides easy deployment for both backend and frontend with automatic HTTPS.

#### Backend Deployment

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   railway init
   
   # Deploy
   railway up
   ```

3. **Configure Environment Variables**
   - Go to Railway dashboard
   - Select your project
   - Add variables:
     ```
     NODE_ENV=production
     PORT=3001
     TEMP_DIR=/tmp/repos
     MAX_REPO_SIZE=104857600
     CLONE_TIMEOUT=300000
     ```

4. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Note this URL for frontend configuration

#### Frontend Deployment

1. **Update Environment Variables**
   - Edit `.env.production`:
     ```
     REACT_APP_API_URL=https://your-backend.railway.app
     REACT_APP_USE_MOCK_DATA=false
     ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Deploy to Railway**
   ```bash
   railway init
   railway up
   ```

---

### Option 2: Render

Render offers free tier for both backend and frontend.

#### Backend Deployment

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: flowbase-api
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm run server`
     - **Plan**: Free

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   TEMP_DIR=/tmp/repos
   MAX_REPO_SIZE=104857600
   CLONE_TIMEOUT=300000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note the URL: `https://flowbase-api.onrender.com`

#### Frontend Deployment

1. **Update Environment**
   - Edit `.env.production`:
     ```
     REACT_APP_API_URL=https://flowbase-api.onrender.com
     REACT_APP_USE_MOCK_DATA=false
     ```

2. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect repository
   - Configure:
     - **Name**: flowbase
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`

3. **Deploy**
   - Click "Create Static Site"
   - Your app will be live at: `https://flowbase.onrender.com`

---

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

Best for React apps with separate backend.

#### Backend: Use Railway or Render (see above)

#### Frontend: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Configure Environment**
   - Create `vercel.json`:
     ```json
     {
       "env": {
         "REACT_APP_API_URL": "https://your-backend-url.com",
         "REACT_APP_USE_MOCK_DATA": "false"
       },
       "build": {
         "env": {
           "REACT_APP_API_URL": "https://your-backend-url.com",
           "REACT_APP_USE_MOCK_DATA": "false"
         }
       }
     }
     ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

---

## 🔧 Configuration Checklist

### Backend Configuration

- [ ] Environment variables set
- [ ] CORS configured for frontend domain
- [ ] Rate limiting enabled
- [ ] Temp directory configured
- [ ] Git installed on server
- [ ] Sufficient disk space for cloning repos

### Frontend Configuration

- [ ] API URL points to backend
- [ ] Mock data disabled in production
- [ ] Build optimized for production
- [ ] HTTPS enabled
- [ ] Error tracking configured (optional)

---

## 🧪 Testing Deployment

### 1. Test Backend Health

```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Analysis Endpoint

```bash
curl -X POST https://your-backend-url.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoUrl": "https://github.com/facebook/react"}'
```

### 3. Test Frontend

1. Open your frontend URL
2. Enter a GitHub repository URL
3. Click "Analyze Repository"
4. Verify:
   - Loading states appear
   - Analysis completes
   - Dashboard displays correctly
   - All components load data

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Cannot clone repository"
- **Solution**: Ensure Git is installed on server
- Check temp directory permissions
- Verify repository URL is public

**Problem**: "Analysis timeout"
- **Solution**: Increase `CLONE_TIMEOUT` value
- Check server resources
- Try smaller repositories first

**Problem**: "CORS errors"
- **Solution**: Add frontend domain to CORS whitelist in `server/index.js`

### Frontend Issues

**Problem**: "Network error"
- **Solution**: Verify `REACT_APP_API_URL` is correct
- Check backend is running
- Verify CORS configuration

**Problem**: "Blank dashboard"
- **Solution**: Check browser console for errors
- Verify API response format matches expected structure
- Check component props are passed correctly

---

## 📊 Monitoring

### Backend Monitoring

1. **Logs**
   - Railway: Dashboard → Logs tab
   - Render: Dashboard → Logs tab

2. **Metrics**
   - Monitor response times
   - Track error rates
   - Watch disk usage

### Frontend Monitoring

1. **Analytics** (Optional)
   - Add Google Analytics
   - Track user interactions
   - Monitor page load times

2. **Error Tracking** (Optional)
   - Integrate Sentry
   - Track JavaScript errors
   - Monitor API failures

---

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform-specific secret management
   - Rotate secrets regularly

2. **Rate Limiting**
   - Already configured in backend
   - Adjust limits based on usage

3. **Input Validation**
   - Already implemented
   - Monitor for abuse

4. **HTTPS**
   - Enforced by all platforms
   - Verify SSL certificates

---

## 📈 Scaling

### When to Scale

- Response times > 2 seconds
- Error rate > 1%
- CPU usage > 80%
- Memory usage > 80%

### How to Scale

**Railway**:
- Upgrade to Pro plan
- Increase resources in dashboard

**Render**:
- Upgrade to paid tier
- Add more instances

**Vercel**:
- Automatically scales
- Upgrade for more bandwidth

---

## 🎉 Post-Deployment

1. **Test thoroughly**
   - Try multiple repositories
   - Test error scenarios
   - Verify all features work

2. **Monitor for 24 hours**
   - Watch logs for errors
   - Check performance metrics
   - Gather user feedback

3. **Document**
   - Note any issues
   - Update this guide
   - Share with team

---

## 📞 Support

If you encounter issues:

1. Check logs first
2. Review this guide
3. Search GitHub issues
4. Create new issue with:
   - Platform used
   - Error messages
   - Steps to reproduce

---

## 🔄 Updates

To update deployed application:

**Railway/Render**:
- Push to GitHub
- Automatic deployment triggers

**Vercel**:
```bash
vercel --prod
```

---

## 📝 Notes

- Free tiers have limitations (sleep after inactivity, limited resources)
- Consider paid plans for production use
- Monitor costs as usage grows
- Keep dependencies updated
- Regular security audits recommended

---

**Last Updated**: 2024
**Version**: 1.0.0