import React, { useState } from 'react';
import ArchitectureGraph from './ArchitectureGraph';
import FileSummaries from './FileSummaries';
import LearningRoadmap from './LearningRoadmap';
import { Home, RefreshCw } from 'lucide-react';

export default function Dashboard({ analysisData, onReset }) {
  const [selectedFile, setSelectedFile] = useState(null);

  // Safety check: Don't render if no data
  if (!analysisData) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontFamily: '"Inter", system-ui, sans-serif',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Loading Dashboard...</div>
        <div style={{ fontSize: '1rem' }}>Processing analysis results</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0f172a',
      fontFamily: '"Inter", system-ui, sans-serif',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{ 
        height: '60px',
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
          <h1 style={{ 
            color: '#fff', 
            fontSize: '1.4rem', 
            margin: 0, 
            fontWeight: '700', 
            letterSpacing: '0.5px', 
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            backgroundClip: 'text' 
          }}>
            FlowBase
          </h1>
          {analysisData?.repository && (
            <span style={{
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: '500',
              padding: '4px 12px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.2)'
            }}>
              {analysisData.repository}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '6px',
              color: '#38bdf8',
              fontSize: '0.85rem',
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
            <Home size={16} />
            New Analysis
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#4ade80', 
              borderRadius: '50%', 
              display: 'inline-block', 
              boxShadow: '0 0 10px #4ade80' 
            }}></span>
            <div style={{ 
              color: '#94a3b8', 
              fontSize: '0.8rem', 
              fontWeight: '500', 
              letterSpacing: '0.5px' 
            }}>
              ANALYSIS COMPLETE
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        height: 'calc(100vh - 60px)', 
        overflow: 'hidden', 
        boxSizing: 'border-box',
        paddingBottom: '10px'
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
          <LearningRoadmap
            onSelectFile={setSelectedFile}
            selectedFile={selectedFile}
            roadmapData={analysisData?.roadmap}
            doctorData={analysisData?.doctor}
          />
        </div>

        {/* Center Column: Interactive Graph */}
        <div style={{ 
          width: '52%', 
          height: '100%', 
          backgroundColor: '#0b0f19', 
          position: 'relative', 
          boxSizing: 'border-box' 
        }}>
          <ArchitectureGraph 
            onSelectFile={setSelectedFile}
            graphData={analysisData?.graph}
          />
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
          <FileSummaries
            selectedFile={selectedFile}
            summariesData={analysisData?.summaries}
            ticketData={analysisData?.ticket}
          />
        </div>

      </div>
    </div>
  );
}

// Made with Bob
