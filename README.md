# 🎯 FlowBase - AI-Powered Repository Analysis & Onboarding

FlowBase is an intelligent platform that analyzes GitHub repositories and generates interactive visualizations, learning roadmaps, and AI-powered insights to help developers understand and onboard to new codebases quickly.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎨 **Interactive Architecture Graph** - Visualize code dependencies and relationships
- 🗺️ **Learning Roadmap** - Step-by-step guide to understand the codebase
- 🤖 **AI-Powered Summaries** - Intelligent explanations of files and functions
- 🔍 **Code Analysis** - Automatic detection of patterns and best practices
- 🚀 **Quick Onboarding** - Get productive in minutes, not days
- 📊 **Visual Dashboard** - Beautiful, intuitive interface

## 🚀 Quick Start

Get started in 5 minutes! See [QUICK_START.md](QUICK_START.md) for detailed instructions.

```bash
# Install dependencies
npm install

# Start both backend and frontend
npm run dev

# Open http://localhost:3000
```

Enter a GitHub repository URL and click "Analyze Repository"!

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- **[Phase 2 & 3 Implementation](PHASE2_3_IMPLEMENTATION.md)** - Complete implementation details
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deploy to production (Railway, Render, Vercel)
- **[Server Setup](SERVER_SETUP.md)** - Backend configuration and API documentation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │  Dashboard   │  │  Components  │      │
│  │     Page     │→ │   (Graph,    │→ │   (Roadmap,  │      │
│  │              │  │   Roadmap,   │  │  Summaries)  │      │
│  └──────────────┘  │  Summaries)  │  └──────────────┘      │
│         ↓          └──────────────┘          ↑              │
│  ┌──────────────────────────────────────────┘               │
│  │           API Service Layer                               │
│  └──────────────────────────────────────────┐               │
└────────────────────────────────────────────│───────────────┘
                                              │
                                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Node.js/Express)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   REST API   │→ │ Git Service  │→ │  Analysis    │      │
│  │  Endpoints   │  │  (Clone &    │  │   Service    │      │
│  │              │  │   Analyze)   │  │  (AI Logic)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **ReactFlow** - Interactive graph visualization
- **Lucide React** - Beautiful icons
- **CSS-in-JS** - Styled components

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Simple-Git** - Git operations
- **Joi** - Input validation
- **Helmet** - Security middleware

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- Git installed
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flowbase.git
   cd flowbase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 🎮 Usage

### Development Mode

```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run server    # Backend only (port 3001)
npm start         # Frontend only (port 3000)
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm run server
```

### Testing

```bash
# Run integration tests
npm run test:integration

# Test API endpoints
npm run test:api
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/analyze` | Start repository analysis |
| GET | `/api/analyze/:id/status` | Check analysis status |
| GET | `/api/analyze/:id` | Get analysis results |

See [SERVER_SETUP.md](SERVER_SETUP.md) for detailed API documentation.

## 🚀 Deployment

FlowBase can be deployed to various platforms:

- **Railway** (Recommended) - Full-stack deployment
- **Render** - Free tier available
- **Vercel** - Frontend only (pair with Railway/Render backend)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

## 🎯 Project Structure

```
flowbase/
├── src/
│   ├── components/          # React components
│   │   ├── LandingPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ArchitectureGraph.jsx
│   │   ├── FileSummaries.jsx
│   │   └── LearningRoadmap.jsx
│   ├── services/            # API service layer
│   │   └── api.js
│   ├── mockData/            # Mock data for development
│   └── App.jsx              # Main app component
├── server/
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   └── index.js             # Server entry point
├── public/                  # Static assets
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md                # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

### Frontend (.env.development / .env.production)
```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_USE_MOCK_DATA=false
```

### Backend (.env)
```bash
NODE_ENV=development
PORT=3001
TEMP_DIR=./temp-repos
MAX_REPO_SIZE=104857600
CLONE_TIMEOUT=300000
```

## 🐛 Troubleshooting

### Common Issues

**"Cannot connect to server"**
- Ensure backend is running on port 3001
- Check `.env` configuration
- Verify firewall settings

**"Analysis timeout"**
- Try smaller repositories first
- Increase `CLONE_TIMEOUT` in `.env`
- Check internet connection

**"CORS errors"**
- Verify `REACT_APP_API_URL` is correct
- Check backend CORS configuration
- Ensure both servers are running

See [QUICK_START.md](QUICK_START.md) for more troubleshooting tips.

## 📊 Performance

- **Small repos** (< 50 files): ~30 seconds
- **Medium repos** (50-200 files): 1-2 minutes
- **Large repos** (200+ files): 2-5 minutes

Performance depends on:
- Repository size
- Network speed
- Server resources
- Git clone speed

## 🔒 Security

- Input validation with Joi
- Rate limiting enabled
- Helmet security headers
- CORS configuration
- Environment variable protection
- Temporary file cleanup

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- ReactFlow for graph visualization
- Express.js community
- All open-source contributors

## 📞 Support

- 📧 Email: support@flowbase.dev
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/flowbase/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/flowbase/discussions)

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Analysis history
- [ ] Repository comparison
- [ ] Export to PDF
- [ ] Custom analysis parameters
- [ ] Team collaboration features
- [ ] Private repository support
- [ ] Advanced AI insights

## ⭐ Star History

If you find FlowBase useful, please consider giving it a star on GitHub!

---

**Made with ❤️ by the FlowBase Team**

[Website](https://flowbase.dev) • [Documentation](https://docs.flowbase.dev) • [Twitter](https://twitter.com/flowbase)