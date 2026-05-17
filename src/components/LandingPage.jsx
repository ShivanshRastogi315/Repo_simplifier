import React, { useState } from 'react';
import { Github, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LandingPage({ onAnalysisComplete }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  const validateGitHubUrl = (url) => {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubPattern.test(url.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const trimmedUrl = repoUrl.trim();
    
    if (!trimmedUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    if (!validateGitHubUrl(trimmedUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    setIsLoading(true);
    setProgress('Initializing analysis...');

    try {
      // Dynamic import to avoid circular dependencies
      const { analyzeRepository } = await import('../services/api');
      
      setProgress('Cloning repository...');
      const response = await analyzeRepository(trimmedUrl);
      
      // Validate response
      if (!response || !response.success) {
        throw new Error(response?.error || 'Analysis failed - no valid response from server');
      }

      if (!response.data) {
        throw new Error('Analysis failed - no data returned from server');
      }
      
      setProgress('Processing results...');
      
      // Transform backend response to match expected format
      const results = {
        repository: response.metadata?.repository?.fullName || trimmedUrl.split('/').slice(-2).join('/'),
        graph: response.data.graphData || { nodes: [], edges: [] },
        roadmap: response.data.roadmapData || { roadmapTitle: 'Learning Roadmap', steps: [] },
        summaries: response.data.explainData || [],
        ticket: response.data.ticketData || null,
        doctor: response.data.doctorData || null,
        metadata: response.metadata
      };
      
      setProgress('Complete!');
      onAnalysisComplete(results);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze repository. Please try again.');
      setIsLoading(false);
      setProgress('');
    }
  };

  const exampleRepos = [
    'https://github.com/facebook/react',
    'https://github.com/vercel/next.js',
    'https://github.com/nodejs/node',
  ];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", system-ui, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(129, 140, 248, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Logo and Title */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <Sparkles size={40} color="#38bdf8" />
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              margin: 0,
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              FlowBase
            </h1>
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '1.2rem',
            margin: 0,
            fontWeight: '400'
          }}>
            AI-Powered Repository Analysis & Onboarding
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Input Group */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '12px',
                textAlign: 'left'
              }}>
                <Github size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                GitHub Repository URL
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: error ? '2px solid #ef4444' : '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!error) e.target.style.borderColor = '#38bdf8';
                }}
                onBlur={(e) => {
                  if (!error) e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                marginBottom: '20px',
                color: '#fca5a5'
              }}>
                <AlertCircle size={18} />
                <span style={{ fontSize: '0.9rem' }}>{error}</span>
              </div>
            )}

            {/* Progress Message */}
            {isLoading && progress && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                marginBottom: '20px',
                color: '#7dd3fc'
              }}>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.9rem' }}>{progress}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: isLoading ? '#475569' : '#38bdf8',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: isLoading ? 'none' : '0 4px 12px rgba(56, 189, 248, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.backgroundColor = '#0ea5e9';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.target.style.backgroundColor = '#38bdf8';
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Repository
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Example Repositories */}
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
              Try these examples:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {exampleRepos.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setRepoUrl(url)}
                  disabled={isLoading}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
                      e.target.style.color = '#38bdf8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
                      e.target.style.color = '#94a3b8';
                    }
                  }}
                >
                  {url}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          color: '#94a3b8',
          fontSize: '0.85rem'
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' }}>Smart Analysis</div>
            <div>AI-powered code understanding</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🗺️</div>
            <div style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' }}>Visual Maps</div>
            <div>Interactive architecture graphs</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📚</div>
            <div style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' }}>Learning Path</div>
            <div>Personalized onboarding</div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Made with Bob
