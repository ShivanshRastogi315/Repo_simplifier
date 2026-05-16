import React, { useState } from 'react';
import { FileCode, Code, CheckSquare, Sparkles } from 'lucide-react';
import explainData from '../mockData/explainData.json';
import ticketData from '../mockData/ticketData.json';

export default function FileSummaries({ selectedFile }) {
  const [showTicket, setShowTicket] = useState(false);
  const fileInfo = explainData.find(item => item.filepath === selectedFile);

  return (
    <div style={{ 
    padding: '20px 20px 30px 20px', /* Added 30px padding to the bottom to push content up */
    color: '#fff', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    boxSizing: 'border-box' 
  }}>
      
      {/* File Inspector Segment */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
          <FileCode color="#38bdf8" /> File Inspector
        </h2>
        
        {fileInfo ? (
          <div>
            <div style={{ background: '#1e293b', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '15px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {fileInfo.filepath}
            </div>
            
            <h3 style={{ color: '#cbd5e0', fontSize: '0.9rem', marginBottom: '5px', fontWeight: '600' }}>Business Logic Summary</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.5', fontSize: '0.8rem', marginBottom: '20px' }}>
              {fileInfo.summary}
            </p>

            <h3 style={{ color: '#cbd5e0', fontSize: '0.9rem', marginBottom: '10px', fontWeight: '600' }}>Key Functions</h3>
            {fileInfo.keyFunctions.map((func, idx) => (
              <div key={idx} style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '10px', borderLeft: '3px solid #38bdf8' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
                  <Code size={14} color="#4ade80" /> {func.name}()
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', lineHeight: '1.3' }}>
                  {func.purpose}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#64748b', textAlign: 'center', marginTop: '30px', fontSize: '0.85rem' }}>
            💡 Click a node on the architecture map to inspect its codebase runtime details.
          </div>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />

      {/* First Ticket Simulator Segment */}
      <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '15px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.05rem', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: '700' }}>
          <CheckSquare size={18} color="#818cf8" /> "First Ticket" Simulator
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 12px 0', lineHeight: '1.3' }}>
          Transition from reading to coding with an AI-generated starter ticket sandbox.
        </p>

        {!showTicket ? (
          <button 
            onClick={() => setShowTicket(true)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            <Sparkles size={14} /> Synthesize Starter Ticket
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>
                <span style={{ color: '#818cf8' }}>{ticketData.ticketId}</span>
                <span style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '1px 6px', borderRadius: '4px' }}>{ticketData.difficulty}</span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#f1f5f9', marginBottom: '6px' }}>{ticketData.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.3' }}>{ticketData.instructions}</div>
            </div>
            <button 
              onClick={() => setShowTicket(false)}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.75rem', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Reset Simulation
            </button>
          </div>
        )}
      </div>

    </div>
  );
}