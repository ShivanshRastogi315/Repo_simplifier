import React, { useState } from 'react';
import { FileCode, Code, CheckSquare, Sparkles } from 'lucide-react';

export default function FileSummaries({ selectedFile, summariesData, ticketData }) {
  const [showTicket, setShowTicket] = useState(false);
  
  // Use summariesData prop directly (it's already the explainData array from backend)
  const explainData = summariesData || [];
  const ticket = ticketData || {
    ticketId: 'N/A',
    title: 'No ticket available',
    difficulty: 'N/A',
    context: '',
    instructions: '',
    filesToInvestigate: [],
    acceptanceCriteria: [],
    knowledgeCheck: []
  };
  
  const fileInfo = explainData.find(item => item.filepath === selectedFile);

  return (
    <div style={{ 
      padding: '20px 20px 30px 20px', 
      color: '#fff', 
      height: 'calc(100vh - 65px)', /* Matches the left column baseline */
      display: 'flex', 
      flexDirection: 'column', 
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* Top Segment Header */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', flexShrink: 0 }}>
        <FileCode color="#38bdf8" /> File Inspector
      </h2>
      
      {/* Scrollable File Content Box */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',          /* FIX: Forces scrollbar when data overflows */
        maxHeight: 'calc(100vh - 340px)', /* FIX: Strictly limits height to preserve ticket panel spacing */
        marginBottom: '15px', 
        paddingRight: '6px' 
      }}>
        
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
            {fileInfo.keyFunctions?.map((func, idx) => (
              <div key={idx} style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '10px', borderLeft: '3px solid #38bdf8' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
                  <Code size={14} color="#4ade80" /> {func.name}
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

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 0 15px 0', flexShrink: 0 }} />

      {/* Bottom Segment: First Ticket Simulator */}
      <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '15px', borderRadius: '12px', flexShrink: 0 }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#818cf8' }}>{ticket.ticketId}</span>
                <span style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{ticket.difficulty}</span>
              </div>
              
              {/* Title */}
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f1f5f9', marginBottom: '10px' }}>{ticket.title}</div>
              
              {/* Context */}
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#cbd5e0' }}>Context:</strong> {ticket.context}
              </div>
              
              {/* Instructions */}
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#cbd5e0' }}>Instructions:</strong> {ticket.instructions}
              </div>
              
              {/* Files to Investigate */}
              {ticket.filesToInvestigate && ticket.filesToInvestigate.length > 0 && (
                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e0', fontWeight: 'bold', marginBottom: '6px' }}>Files to Investigate:</div>
                  {ticket.filesToInvestigate.map((file, idx) => (
                    <div key={idx} style={{ fontSize: '0.7rem', color: '#818cf8', fontFamily: 'monospace', marginBottom: '3px' }}>
                      • {file}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Acceptance Criteria */}
              {ticket.acceptanceCriteria && ticket.acceptanceCriteria.length > 0 && (
                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e0', fontWeight: 'bold', marginBottom: '6px' }}>Acceptance Criteria:</div>
                  {ticket.acceptanceCriteria.map((criteria, idx) => (
                    <div key={idx} style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '3px', display: 'flex', gap: '6px' }}>
                      <span style={{ color: '#4ade80' }}>✓</span> {criteria}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Knowledge Check */}
              {ticket.knowledgeCheck && ticket.knowledgeCheck.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e0', fontWeight: 'bold', marginBottom: '6px' }}>Knowledge Check:</div>
                  {ticket.knowledgeCheck.map((q, idx) => (
                    <div key={idx} style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '8px', paddingLeft: '8px', borderLeft: '2px solid #818cf8' }}>
                      <div style={{ marginBottom: '2px' }}><strong>Q{idx + 1}:</strong> {q.question}</div>
                      {q.hint && <div style={{ fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic' }}>Hint: {q.hint}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowTicket(false)}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.75rem', padding: '6px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.color = '#818cf8'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              Reset Simulation
            </button>
          </div>
        )}
      </div>

    </div>
  );
}