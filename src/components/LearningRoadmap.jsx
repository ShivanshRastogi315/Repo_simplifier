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

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '10px 0' }} />

      {/* Environment Doctor Segment */}
      <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', maxHeight: '500px', overflowY: 'auto' }}>
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
            {doctorData.projectStack}
          </div>
          {doctorData.detectedPorts && doctorData.detectedPorts.length > 0 && (
            <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
              Ports: {doctorData.detectedPorts.map(p => `localhost:${p}`).join(', ')}
            </div>
          )}
        </div>

        {/* Issues Found */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e0', fontWeight: 'bold', marginBottom: '6px' }}>
            STATUS: {doctorData.status}
          </div>
          {doctorData.issuesFound.map((issue, idx) => (
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
        {doctorData.setupSteps && doctorData.setupSteps.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e0', fontWeight: 'bold', marginBottom: '6px' }}>
              SETUP STEPS
            </div>
            {doctorData.setupSteps.map((step, idx) => (
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
        {doctorData.quickStartScript && (
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
              {doctorData.quickStartScript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}