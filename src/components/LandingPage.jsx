import React, { useState, useRef, useEffect } from 'react';
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
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const inputSectionRef = useRef(null);
  const containerRef = useRef(null);

  // Dynamic gradient background effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

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
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(255, 182, 135, 0.5) 0%,
            transparent 50%),
          radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%,
            rgba(200, 200, 240, 0.45) 0%,
            transparent 50%),
          linear-gradient(135deg,
            #8FB4D9 0%,
            #D4C5F5 50%,
            #FFBE9D 100%)
        `,
        transition: 'background 0.3s ease-out'
      }}>
      {/* Dynamic Cursor Light Effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%,
          rgba(255, 255, 255, 0.25) 0%,
          rgba(143, 180, 217, 0.15) 25%,
          transparent 50%)`,
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'overlay',
        transition: 'background 0.2s ease-out'
      }} />

      {/* Subtle Background Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
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
            <Sparkles size={28} color="#4338CA" strokeWidth={2.5} />
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              fontFamily: '"Outfit", sans-serif',
              background: 'linear-gradient(135deg, #4338CA, #3730A3)',
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
                  color: '#64748B',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.color = '#B4C6EA'}
                onMouseLeave={(e) => e.target.style.color = '#64748B'}
              >
                {item}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#64748B',
                fontSize: '0.95rem',
                fontWeight: '500',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#B4C6EA'}
              onMouseLeave={(e) => e.target.style.color = '#64748B'}
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
              color: '#FFFFFF',
              background: '#6B7FBE',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(107, 127, 190, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(107, 127, 190, 0.4)';
              e.target.style.background = '#5A6DAD';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(107, 127, 190, 0.3)';
              e.target.style.background = '#6B7FBE';
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
            padding: '8px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '50px',
            marginBottom: '32px',
            fontSize: '0.85rem',
            color: '#3730A3',
            fontWeight: '600'
          }}>
            <Zap size={14} />
            100% Local • Zero Cloud Costs
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: '900',
            fontFamily: '"Outfit", sans-serif',
            lineHeight: '1.1',
            margin: '0 0 24px 0',
            color: '#1F2937',
            letterSpacing: '-2px'
          }}>
            Deconstruct Any Codebase.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #4F46E5, #2563EB)',
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
            color: '#64748B',
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
              color: '#4338CA',
              cursor: 'pointer',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: '700',
              transition: 'all 0.3s',
              marginBottom: '60px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(4px)';
              e.target.style.color = '#3730A3';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.color = '#4338CA';
            }}
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
            backgroundColor: '#F9FAFB',
            borderRadius: '32px',
            border: '2px solid #E8D5E8',
            boxShadow: '0 4px 20px rgba(180, 198, 234, 0.15)'
          }}>
            {[
              { value: '95%', label: 'Onboarding Time Saved', icon: <Zap size={32} />, color: '#B4C6EA' },
              { value: '<1s', label: 'Local Heuristic Analysis', icon: <Code2 size={32} />, color: '#F5D0C5' },
              { value: '100%', label: 'Self-Contained Engine', icon: <CheckCircle2 size={32} />, color: '#B4C6EA' },
              { value: '1 Click', label: 'Visual Dependency Map', icon: <GitBranch size={32} />, color: '#F5D0C5' }
            ].map((metric, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ color: metric.color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                  {metric.icon}
                </div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  fontFamily: '"Outfit", sans-serif',
                  color: '#2D3748',
                  marginBottom: '8px',
                  letterSpacing: '-1px'
                }}>
                  {metric.value}
                </div>
                <div style={{
                  color: '#64748B',
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
            backgroundColor: '#EDF2F7',
            borderRadius: '32px',
            padding: '48px',
            border: '2px solid #D4C5F5',
            boxShadow: '0 8px 30px rgba(159, 179, 219, 0.2)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              fontFamily: '"Outfit", sans-serif',
              color: '#1F2937',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              Analyze Your Repository
            </h2>
            <p style={{
              color: '#64748B',
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
                      color: '#94A3B8',
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
                      backgroundColor: '#F9FAFB',
                      border: error ? '2px solid #F87171' : '2px solid #D4C5F5',
                      borderRadius: '16px',
                      color: '#2D3748',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      if (!error) e.target.style.borderColor = '#B4C6EA';
                    }}
                    onBlur={(e) => {
                      if (!error) e.target.style.borderColor = '#E2E8F0';
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
                    color: '#2D3748',
                    background: isLoading ? '#CBD5E1' : '#B4C6EA',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: isLoading ? 'none' : '0 2px 8px rgba(180, 198, 234, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(180, 198, 234, 0.4)';
                      e.target.style.background = '#9FB3DB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(180, 198, 234, 0.3)';
                      e.target.style.background = '#B4C6EA';
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
                  backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  color: '#DC2626'
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
                  backgroundColor: 'rgba(180, 198, 234, 0.1)',
                  border: '1px solid rgba(180, 198, 234, 0.3)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  color: '#7B92C0'
                }}>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '0.95rem' }}>{progress}</span>
                </div>
              )}
            </form>

            {/* Example Repositories */}
            <div style={{ 
              paddingTop: '24px', 
              borderTop: '1px solid #E2E8F0'
            }}>
              <p style={{ 
                color: '#94A3B8', 
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
                      color: '#64748B',
                      backgroundColor: '#F9FAFB',
                      border: '2px solid #E8D5E8',
                      borderRadius: '12px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.backgroundColor = 'rgba(180, 198, 234, 0.1)';
                        e.target.style.color = '#B4C6EA';
                        e.target.style.borderColor = '#B4C6EA';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.target.style.backgroundColor = '#F8FAFC';
                        e.target.style.color = '#64748B';
                        e.target.style.borderColor = '#E2E8F0';
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
              fontFamily: '"Outfit", sans-serif',
              color: '#1F2937',
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              Architectural Depth
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#64748B',
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
                color: '#B4C6EA'
              },
              {
                icon: <FileSearch size={40} />,
                title: 'Environment Doctor',
                description: 'Instantly scans configurations, detects tech stacks, and highlights missing .env parameters.',
                color: '#F5D0C5'
              },
              {
                icon: <Map size={40} />,
                title: 'Topological Roadmaps',
                description: 'Chronologically structures a developer\'s learning path step-by-step through the codebase.',
                color: '#B4C6EA'
              },
              {
                icon: <GitBranch size={40} />,
                title: 'Interactive File Inspector',
                description: 'Inspect isolated modules by interacting directly with visual layout nodes in real-time.',
                color: '#F5D0C5'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  padding: '40px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '28px',
                  border: '2px solid #E8D5E8',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(180, 198, 234, 0.12)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = feature.color;
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: `${feature.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: feature.color
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  fontFamily: '"Outfit", sans-serif',
                  color: '#1F2937',
                  marginBottom: '12px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#64748B',
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
            backgroundColor: '#EDF2F7',
            borderRadius: '32px',
            padding: '64px',
            border: '2px solid #D4C5F5',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(159, 179, 219, 0.15)'
          }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              fontFamily: '"Outfit", sans-serif',
              color: '#1F2937',
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
                    fontFamily: '"Outfit", sans-serif',
                    color: '#818CF8',
                    marginBottom: '16px',
                    opacity: 1
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    fontFamily: '"Outfit", sans-serif',
                    color: '#1F2937',
                    marginBottom: '8px'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: '#64748B',
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
            fontFamily: '"Outfit", sans-serif',
            color: '#1F2937',
            marginBottom: '16px'
          }}>
            Built with Modern Tech
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748B',
            marginBottom: '48px'
          }}>
            Powered by industry-leading tools and frameworks
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {['React', 'Node.js', 'AST Parsing', 'D3.js', 'Express', 'Git'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '16px 32px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                  border: '2px solid #D4C5F5',
                  color: '#475569',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  cursor: 'default',
                  boxShadow: '0 2px 8px rgba(107, 127, 190, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#6B7FBE';
                  e.target.style.color = '#334155';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(107, 127, 190, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#D4C5F5';
                  e.target.style.color = '#475569';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(107, 127, 190, 0.15)';
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
            background: 'linear-gradient(135deg, rgba(180, 198, 234, 0.15), rgba(245, 208, 197, 0.15))',
            borderRadius: '24px',
            padding: '80px 40px',
            border: '1px solid #E2E8F0',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(180, 198, 234, 0.1) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                fontFamily: '"Outfit", sans-serif',
                color: '#1F2937',
                marginBottom: '24px',
                letterSpacing: '-1px'
              }}>
                Ready to experience deep
                <br />
                repository clarity?
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#64748B',
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
                  color: '#FFFFFF',
                  background: '#6B7FBE',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 16px rgba(107, 127, 190, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(107, 127, 190, 0.5)';
                  e.target.style.background = '#5A6DAD';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(107, 127, 190, 0.4)';
                  e.target.style.background = '#6B7FBE';
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
          borderTop: '1px solid #E2E8F0',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.5)'
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
              <Sparkles size={24} color="#4338CA" />
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                fontFamily: '"Outfit", sans-serif',
                color: '#1F2937'
              }}>
                FlowBase
              </span>
            </div>
            <div style={{
              color: '#94A3B8',
              fontSize: '0.9rem'
            }}>
              © 2026 FlowBase. Built with precision.
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                padding: '8px 20px',
                backgroundColor: 'rgba(180, 198, 234, 0.15)',
                border: '1px solid #B4C6EA',
                borderRadius: '8px',
                color: '#B4C6EA',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(180, 198, 234, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(180, 198, 234, 0.15)';
              }}
            >
              Back to Top ↑
            </button>
          </div>
        </footer>
      </main>

      {/* CSS Animations */}
      <style>{`
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
      `}</style>
    </div>
  );
}

// Made with Bob
