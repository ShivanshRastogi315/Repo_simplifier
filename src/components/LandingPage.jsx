import React, { useState, useRef } from 'react';
import { 
  Github, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Zap,
  Code2,
  GitBranch,
  FileSearch,
  Map,
  CheckCircle2,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

export default function LandingPage({ onAnalysisComplete }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const inputSectionRef = useRef(null);

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
      const { analyzeRepository } = await import('../services/api');
      
      setProgress('Cloning repository...');
      const response = await analyzeRepository(trimmedUrl);
      
      if (!response || !response.success) {
        throw new Error(response?.error || 'Analysis failed - no valid response from server');
      }

      if (!response.data) {
        throw new Error('Analysis failed - no data returned from server');
      }
      
      setProgress('Processing results...');
      
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

  const scrollToInput = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const exampleRepos = [
    { url: 'https://github.com/expressjs/express', label: 'expressjs/express' },
    { url: 'https://github.com/facebook/react', label: 'facebook/react' },
    { url: 'https://github.com/vercel/next.js', label: 'vercel/next.js' },
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0a0e1a',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative'
      }}
    >
      {/* Animated Background Grid */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Gradient Orbs */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(129, 140, 248, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={28} color="#38bdf8" strokeWidth={2.5} />
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px'
            }}>
              FlowBase
            </span>
          </div>

          {/* Center Links */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {['Features', 'How it Works', 'Tech Stack'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >
                {item}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#94a3b8',
                fontSize: '0.95rem',
                fontWeight: '500',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              <Github size={18} />
              GitHub
            </a>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToInput}
            style={{
              padding: '10px 24px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#fff',
              background: 'linear-gradient(135deg, #38bdf8, #3b82f6)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 25px rgba(56, 189, 248, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(56, 189, 248, 0.3)';
            }}
          >
            Launch App
            <Zap size={16} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Hero Section */}
        <section style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '120px 40px 80px',
          textAlign: 'center'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '50px',
            marginBottom: '32px',
            fontSize: '0.85rem',
            color: '#38bdf8',
            fontWeight: '600'
          }}>
            <Zap size={14} />
            100% Local • Zero Cloud Costs
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: '900',
            lineHeight: '1.1',
            margin: '0 0 24px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-2px'
          }}>
            Deconstruct Any Codebase.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Instantly.
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: '1.35rem',
            color: '#94a3b8',
            maxWidth: '800px',
            margin: '0 auto 48px',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Master new repositories in 60 seconds with our local AST parsing engine.
            Automated dependency mapping, visual architecture graphs, and AI-powered learning paths.
          </p>

          {/* Scroll Indicator */}
          <button
            onClick={scrollToInput}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              marginBottom: '60px'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(4px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Started
            <ChevronDown size={24} style={{ animation: 'bounce 2s infinite' }} />
          </button>
        </section>

        {/* Value Metrics Banner */}
        <section style={{
          maxWidth: '1400px',
          margin: '0 auto 120px',
          padding: '0 40px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            padding: '48px',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(56, 189, 248, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {[
              { value: '95%', label: 'Onboarding Time Saved', icon: <Zap size={32} /> },
              { value: '<1s', label: 'Local Heuristic Analysis', icon: <Code2 size={32} /> },
              { value: '100%', label: 'Self-Contained Engine', icon: <CheckCircle2 size={32} /> },
              { value: '1 Click', label: 'Visual Dependency Map', icon: <GitBranch size={32} /> }
            ].map((metric, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ color: '#38bdf8', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                  {metric.icon}
                </div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '8px',
                  letterSpacing: '-1px'
                }}>
                  {metric.value}
                </div>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Input Section */}
        <section 
          ref={inputSectionRef}
          id="get-started"
          style={{
            maxWidth: '900px',
            margin: '0 auto 120px',
            padding: '0 40px'
          }}
        >
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              Analyze Your Repository
            </h2>
            <p style={{
              color: '#94a3b8',
              fontSize: '1rem',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              Enter any public GitHub repository URL to get started
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Github 
                    size={20} 
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                      pointerEvents: 'none'
                    }}
                  />
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      fontSize: '1rem',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: error ? '2px solid #ef4444' : '2px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '12px',
                      color: '#fff',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      if (!error) e.target.style.borderColor = '#38bdf8';
                    }}
                    onBlur={(e) => {
                      if (!error) e.target.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#fff',
                    background: isLoading 
                      ? 'rgba(71, 85, 105, 0.5)' 
                      : 'linear-gradient(135deg, #38bdf8, #3b82f6)',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: isLoading ? 'none' : '0 4px 20px rgba(56, 189, 248, 0.4)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 25px rgba(56, 189, 248, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 20px rgba(56, 189, 248, 0.4)';
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      Analyzing
                    </>
                  ) : (
                    <>
                      Analyze Now
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  color: '#fca5a5'
                }}>
                  <AlertCircle size={20} />
                  <span style={{ fontSize: '0.95rem' }}>{error}</span>
                </div>
              )}

              {/* Progress Message */}
              {isLoading && progress && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  color: '#7dd3fc'
                }}>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '0.95rem' }}>{progress}</span>
                </div>
              )}
            </form>

            {/* Example Repositories */}
            <div style={{ 
              paddingTop: '24px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <p style={{ 
                color: '#64748b', 
                fontSize: '0.9rem', 
                marginBottom: '12px',
                fontWeight: '500'
              }}>
                Try these examples:
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {exampleRepos.map((repo, index) => (
                  <button
                    key={index}
                    onClick={() => setRepoUrl(repo.url)}
                    disabled={isLoading}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(56, 189, 248, 0.15)',
                      borderRadius: '8px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                        e.target.style.color = '#38bdf8';
                        e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.target.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
                        e.target.style.color = '#94a3b8';
                        e.target.style.borderColor = 'rgba(56, 189, 248, 0.15)';
                      }
                    }}
                  >
                    {repo.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section 
          id="features"
          style={{
            maxWidth: '1400px',
            margin: '0 auto 120px',
            padding: '0 40px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              Architectural Depth
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#94a3b8',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Enterprise-grade analysis tools built for developers
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: <Code2 size={40} />,
                title: 'Dynamic AST Parser',
                description: 'Traces real imports, function calls, and relationships natively across multiple languages.',
                gradient: 'linear-gradient(135deg, #38bdf8, #3b82f6)'
              },
              {
                icon: <FileSearch size={40} />,
                title: 'Environment Doctor',
                description: 'Instantly scans configurations, detects tech stacks, and highlights missing .env parameters.',
                gradient: 'linear-gradient(135deg, #818cf8, #a78bfa)'
              },
              {
                icon: <Map size={40} />,
                title: 'Topological Roadmaps',
                description: 'Chronologically structures a developer\'s learning path step-by-step through the codebase.',
                gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
              },
              {
                icon: <GitBranch size={40} />,
                title: 'Interactive File Inspector',
                description: 'Inspect isolated modules by interacting directly with visual layout nodes in real-time.',
                gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  padding: '40px',
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(56, 189, 248, 0.1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: feature.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: '#fff'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '12px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '1rem',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section 
          id="how-it-works"
          style={{
            maxWidth: '1400px',
            margin: '0 auto 120px',
            padding: '0 40px'
          }}
        >
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '64px',
            border: '1px solid rgba(56, 189, 248, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '48px',
              letterSpacing: '-1px'
            }}>
              How It Works
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '40px',
              textAlign: 'left'
            }}>
              {[
                { step: '01', title: 'Submit URL', desc: 'Paste any public GitHub repository URL' },
                { step: '02', title: 'Local Analysis', desc: 'Our engine parses the codebase locally in <1 second' },
                { step: '03', title: 'Visual Mapping', desc: 'Generate interactive dependency graphs automatically' },
                { step: '04', title: 'Learn & Build', desc: 'Follow AI-generated roadmaps to master the code' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '16px',
                    opacity: 0.3
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '8px'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section 
          id="tech-stack"
          style={{
            maxWidth: '1400px',
            margin: '0 auto 120px',
            padding: '0 40px',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#fff',
            marginBottom: '16px'
          }}>
            Built with Modern Tech
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#94a3b8',
            marginBottom: '48px'
          }}>
            Powered by industry-leading tools and frameworks
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            {['React', 'Node.js', 'AST Parsing', 'D3.js', 'Express', 'Git'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '16px 32px',
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  color: '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                  e.target.style.color = '#38bdf8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.15)';
                  e.target.style.color = '#94a3b8';
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section style={{
          maxWidth: '1400px',
          margin: '0 auto 80px',
          padding: '0 40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1))',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '80px 40px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                color: '#fff',
                marginBottom: '24px',
                letterSpacing: '-1px'
              }}>
                Ready to experience deep
                <br />
                repository clarity?
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#94a3b8',
                marginBottom: '40px',
                maxWidth: '600px',
                margin: '0 auto 40px'
              }}>
                Join developers who are mastering codebases 10x faster
              </p>
              <button
                onClick={scrollToInput}
                style={{
                  padding: '18px 48px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #38bdf8, #3b82f6)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 8px 30px rgba(56, 189, 248, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(56, 189, 248, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 30px rgba(56, 189, 248, 0.4)';
                }}
              >
                Get Started Free
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(56, 189, 248, 0.1)',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={24} color="#38bdf8" />
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                FlowBase
              </span>
            </div>
            <div style={{
              color: '#64748b',
              fontSize: '0.9rem'
            }}>
              © 2026 FlowBase. Built with precision.
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                padding: '8px 20px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '8px',
                color: '#38bdf8',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
              }}
            >
              Back to Top ↑
            </button>
          </div>
        </footer>
      </main>

      {/* CSS Animations & Custom Scrollbar Styles */}
      <style>{`
        /* Animations */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Custom Premium Scrollbar - Chrome, Safari, Opera */
        .custom-scroll::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: padding-box;
          transition: background-color 0.3s ease;
        }

        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }

        /* Custom Premium Scrollbar - Firefox */
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }

        /* Utility: Minimalist scrollbar for nested sections */
        .minimal-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .minimal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .minimal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.2);
          border-radius: 3px;
          transition: background 0.3s ease;
        }

        .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.4);
        }

        .minimal-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(56, 189, 248, 0.2) transparent;
        }
      `}</style>
    </div>
  );
}

// Made with Bob
