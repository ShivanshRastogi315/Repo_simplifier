import React from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import graphData from '../mockData/graphData.json';

export default function ArchitectureGraph({ onSelectFile }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    graphData.nodes.map(node => ({
      ...node,
      // Apply sleek styling to the nodes
      style: { 
        background: '#1e293b', // Darker slate background
        color: '#f8fafc',      // Crisp off-white text
        border: '1px solid #38bdf8', // Neon cyan border
        borderRadius: '12px', 
        padding: '14px 20px',
        fontWeight: '600',
        fontSize: '14px',
        boxShadow: '0 4px 20px rgba(56, 189, 248, 0.15)', // Subtle cyan ambient glow
        fontFamily: 'JetBrains Mono, Fira Code, monospace', // Developer font feel
        minWidth: '150px',
        textAlign: 'center'
      },
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphData.edges);

  const onNodeClick = (event, node) => {
    onSelectFile(node.id);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <MiniMap nodeColor={() => '#4a5568'} maskColor="rgba(0, 0, 0, 0.3)" />
        <Background variant="dots" gap={16} size={1} color="#4a5568" />
      </ReactFlow>
    </div>
  );
}