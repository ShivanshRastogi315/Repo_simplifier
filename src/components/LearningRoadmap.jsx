import React, { useState } from 'react';
import { Compass, ShieldAlert, Terminal } from 'lucide-react';
import roadmapData from '../mockData/roadmapData.json';
import doctorData from '../mockData/doctorData.json';

export default function LearningRoadmap({ onSelectFile, selectedFile }) {
  const [runningFix, setRunningFix] = useState(false);
  const [fixed, setFixed] = useState(false);

  const triggerFix = () => {
    setRunningFix(true);
    setTimeout(() => {
      setRunningFix(false);
      setFixed(true);
    }, 2000);
  };

  return (
    <div style={{ 
      padding: '20px 20px 30px 20px', 
      color: '#fff', 
      height: 'calc(100vh - 65px)', /* FIX: Locks the sidebar exactly to the workspace viewport height */
      display: 'flex', 
      flexDirection: 'column', 
      boxSizing: 'border-box',
      overflow: 'hidden'            /* FIX: Prevents the parent container from stretching down */
    }}>
      {/* Learning Roadmap Segment */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',          /* Enforces the vertical scrollbar */
        marginBottom: '15px', 
        paddingRight: '6px' 
      }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
          <Compass color="#48bb78" /> {roadmapData.roadmapTitle}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '15px' }}>
          Follow this sequence to understand the codebase execution flow.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {roadmapData.steps.map((step) => {
            const isSelected = selectedFile === step.targetFile;
            return (
              <div 
                key={step.stepNumber}
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
                    {step.targetFile}
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

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '10px 0' }} />

      {/* Environment Doctor Segment */}
      <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.05rem', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9', fontWeight: '700' }}>
          <ShieldAlert size={18} color="#f59e0b" /> Environment Doctor
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 12px 0', lineHeight: '1.3' }}>
          Scans project configurations for build alignment bottlenecks.
        </p>
        
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '12px' }}>
          <div style={{ color: fixed ? '#4ade80' : '#f59e0b', fontWeight: '700', marginBottom: '4px' }}>
            STATUS: {fixed ? '✅ System Operational' : '⚠️ Issue Detected'}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
            {fixed ? 'All local modules synced.' : doctorData.issuesFound[0].description}
          </div>
        </div>

        {!fixed && (
          <button 
            onClick={triggerFix}
            disabled={runningFix}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              opacity: runningFix ? 0.7 : 1
            }}
          >
            <Terminal size={14} /> {runningFix ? 'Applying Target Fix...' : 'Run Auto-Setup Script'}
          </button>
        )}
      </div>
    </div>
  );
}