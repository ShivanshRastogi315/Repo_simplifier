import React, { useState, useRef, useEffect } from 'react';
import { Compass, ShieldAlert, Terminal } from 'lucide-react';

export default function LearningRoadmap({ onSelectFile, selectedFile, roadmapData, doctorData }) {
  // Use roadmapData prop directly (it's already the roadmap object from backend)
  const roadmap = roadmapData || { roadmapTitle: 'Learning Roadmap', steps: [] };
  
  // Use doctorData from API response with fallback
  const doctor = doctorData || {
    detectedStack: 'Unknown',
    projectStack: 'Unknown',
    status: 'Analyzing...',
    issuesFound: [],
    setupSteps: [],
    ports: [],
    detectedPorts: [],
    quickStartScript: ''
  };
  
  // Early return if no data
  if (!roadmapData) {
    return (
      <div style={{
        padding: '20px',
        color: '#94a3b8',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>Loading roadmap...</div>
        <div style={{ fontSize: '0.9rem' }}>Analyzing repository structure</div>
      </div>
    );
  }
  const [runningFix, setRunningFix] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [topHeight, setTopHeight] = useState(50); // Percentage
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef(null);
  const architectureRef = useRef(null);
  const doctorRef = useRef(null);

  const triggerFix = () => {
    setRunningFix(true);
    setTimeout(() => {
      setRunningFix(false);
      setFixed(true);
    }, 2000);
  };

  // Handle mouse drag for resizing
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newTopHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
      
      // Constrain between 20% and 80%
      if (newTopHeight >= 20 && newTopHeight <= 80) {
        setTopHeight(newTopHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Auto-scroll to selected file when clicked from architecture graph
  useEffect(() => {
    if (selectedFile && architectureRef.current) {
      // Find the matching step element
      const stepElements = architectureRef.current.querySelectorAll('[data-file]');
      const targetElement = Array.from(stepElements).find(
        el => el.getAttribute('data-file') === selectedFile
      );
      
      if (targetElement) {
        // Smooth scroll with offset
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }
    }
  }, [selectedFile]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        padding: '0',
        color: '#fff', 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Section: Hierarchical Architecture Map */}
      <div
        ref={architectureRef}
        className="smooth-scroll bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 border-t-2 border-t-cyan-500/60"
        style={{
          height: `${topHeight}%`,
          overflowY: 'auto',
          padding: '20px',
          boxSizing: 'border-box',
          margin: '16px',
          boxShadow: '0 4px 20px rgba(6, 182, 212, 0.05)'
        }}
      >
        <h2 style={{ fontSize: '1.4rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
          <Compass color="#48bb78" /> {roadmap.roadmapTitle || 'Learning Roadmap'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '15px' }}>
          Follow this sequence to understand the codebase execution flow.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {roadmap.steps?.map((step) => {
            const isSelected = selectedFile === step.targetFile;
            return (
              <div 
                key={step.stepNumber}
                data-file={step.targetFile}
                onClick={() => onSelectFile(step.targetFile)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #1e3a8a, #1e40af)' : '#1f2937',
                  padding: '14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.03)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ background: isSelected ? '#38bdf8' : '#374151', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: '700', color: isSelected ? '#0f172a' : '#9ca3af' }}>
                    STEP {step.stepNumber}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#38bdf8', fontFamily: 'monospace' }}>
                    {step.targetFile.split('/').pop()}
                  </span>
                </div>
                <h4 style={{ fontWeight: '700', margin: '4px 0', color: '#fff', fontSize: '0.9rem' }}>{step.title}</h4>
                <p style={{ fontSize: '0.8rem', color: isSelected ? '#e2e8f0' : '#9ca3af', margin: 0, lineHeight: '1.4' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resizable Divider */}
      <div 
        className="resize-divider"
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'ns-resize' : 'ns-resize',
          userSelect: 'none'
        }}
      />

      {/* Bottom Section: Environment Doctor */}
      <div
        ref={doctorRef}
        className="smooth-scroll bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 border-t-2 border-t-emerald-500/60"
        style={{
          height: `${100 - topHeight}%`,
          overflowY: 'auto',
          padding: '20px',
          boxSizing: 'border-box',
          margin: '0 16px 16px 16px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.05)'
        }}
      >
        <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9', fontWeight: '700' }}>
            <ShieldAlert size={18} color="#f59e0b" /> Environment Doctor
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 12px 0', lineHeight: '1.3' }}>
            Analyzes your repository and generates setup instructions.
          </p>
          
          {/* Project Stack Info */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>DETECTED STACK</div>
            <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.85rem', fontFamily: 'monospace' }}>
              {doctor.detectedStack || doctor.projectStack || 'Unknown'}
            </div>
            {((doctor.ports && doctor.ports.length > 0) || (doctor.detectedPorts && doctor.detectedPorts.length > 0)) && (
              <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                Ports: {(doctor.ports || doctor.detectedPorts)?.map(p => `localhost:${p}`).join(', ')}
              </div>
            )}
          </div>

          {/* Issues Found */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e0', fontWeight: 'bold', marginBottom: '6px' }}>
              STATUS: {doctor.status || 'Unknown'}
            </div>
            {doctor.issuesFound?.map((issue, idx) => (
              <div key={idx} style={{
                background: '#0f172a',
                border: `1px solid ${issue.severity === 'critical' ? '#ff003c' : issue.severity === 'high' ? '#f59e0b' : issue.severity === 'success' ? '#4ade80' : '#64748b'}`,
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '8px',
                borderLeft: `3px solid ${issue.severity === 'critical' ? '#ff003c' : issue.severity === 'high' ? '#f59e0b' : issue.severity === 'success' ? '#4ade80' : '#64748b'}`
              }}>
                <div style={{
                  color: issue.severity === 'critical' ? '#ff003c' : issue.severity === 'high' ? '#f59e0b' : issue.severity === 'success' ? '#4ade80' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  marginBottom: '4px'
                }}>
                  {issue.severity === 'critical' ? '🚨' : issue.severity === 'high' ? '⚠️' : issue.severity === 'success' ? '✅' : 'ℹ️'} {issue.type}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: issue.fixCommand ? '6px' : '0' }}>
                  {issue.description}
                </div>
                {issue.fixCommand && (
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    color: '#4ade80'
                  }}>
                    $ {issue.fixCommand}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Setup Steps */}
          {doctor.setupSteps && doctor.setupSteps.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e0', fontWeight: 'bold', marginBottom: '6px' }}>
                SETUP STEPS
              </div>
              {doctor.setupSteps?.map((step, idx) => (
                <div key={idx} style={{
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  marginBottom: '4px',
                  paddingLeft: '12px',
                  borderLeft: '2px solid #38bdf8'
                }}>
                  {idx + 1}. {step}
                </div>
              ))}
            </div>
          )}

          {/* Quick Start Script */}
          {doctor.quickStartScript && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e0', fontWeight: 'bold', marginBottom: '6px' }}>
                QUICK START SCRIPT
              </div>
              <div style={{
                background: '#000',
                padding: '10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                color: '#4ade80',
                whiteSpace: 'pre-wrap',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {doctor.quickStartScript}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
