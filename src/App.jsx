import React, { useState } from 'react';
import ArchitectureGraph from './components/ArchitectureGraph';
import FileSummaries from './components/FileSummaries';
import LearningRoadmap from './components/LearningRoadmap';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%',            /* Changed from 100vw to eliminate horizontal scrollbar */
      height: '100vh', 
      backgroundColor: '#0f172a', 
      fontFamily: '"Inter", system-ui, sans-serif',
      overflow: 'hidden',       /* Strictly locks any full-page scrolling */
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Balanced Header */}
      <header style={{ 
        height: '60px',         /* Slightly reduced height to save vertical pixel space */
        backgroundColor: 'rgba(30, 41, 59, 0.7)', 
        backdropFilter: 'blur(12px)', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 30px', 
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        justifyContent: 'space-between',
        zIndex: 10,
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', padding: '5px 10px', borderRadius: '8px', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
            🛡️ AEGIS
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.15rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>
            AI Codebase Navigator
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #4ade80' }}></span>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', letterSpacing: '0.5px' }}>
            AGENT ACTIVE
          </div>
        </div>
      </header>

      {/* Main Grid Workspace - Accounts exactly for the 60px header */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        height: 'calc(100vh - 60px)', 
        overflow: 'hidden', 
        boxSizing: 'border-box',
        paddingBottom: '10px'   /* Gives a safe, intentional gap from the absolute bottom window border */
      }}>
        
        {/* Left Column: Interactive Roadmap */}
        <div style={{ 
          width: '24%', 
          backgroundColor: '#111827', 
          borderRight: '1px solid rgba(255,255,255,0.05)', 
          height: '100%',
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
          boxSizing: 'border-box'
        }}>
          <LearningRoadmap onSelectFile={setSelectedFile} selectedFile={selectedFile} />
        </div>

        {/* Center Column: Interactive Graph */}
        <div style={{ width: '52%', height: '100%', backgroundColor: '#0b0f19', position: 'relative', boxSizing: 'border-box' }}>
          <ArchitectureGraph onSelectFile={setSelectedFile} />
        </div>

        {/* Right Column: Code AI File Summaries */}
        <div style={{ 
          width: '24%', 
          backgroundColor: '#111827', 
          borderLeft: '1px solid rgba(255,255,255,0.05)', 
          height: '100%',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
          boxSizing: 'border-box'
        }}>
          <FileSummaries selectedFile={selectedFile} />
        </div>

      </div>
    </div>
  );
}