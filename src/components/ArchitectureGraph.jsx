import React, { useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

export default function ArchitectureGraph({ onSelectFile, graphData }) {
  // Use empty arrays as fallback if no data provided
  const initialNodes = graphData?.nodes || [];
  const initialEdges = graphData?.edges || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map(node => ({
      ...node,
      style: {
        background: '#1e293b',
        color: '#f8fafc',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '14px 24px',
        fontWeight: '600',
        fontSize: '14px',
        fontFamily: '"JetBrains Mono", monospace',
        whiteSpace: 'nowrap',
        width: 'fit-content',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      },
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when graphData changes
  useEffect(() => {
    if (graphData?.nodes) {
      setNodes(graphData.nodes.map(node => ({
        ...node,
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '14px 24px',
          fontWeight: '600',
          fontSize: '14px',
          fontFamily: '"JetBrains Mono", monospace',
          whiteSpace: 'nowrap',
          width: 'fit-content',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        },
      })));
    }
    if (graphData?.edges) {
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  const onNodeClick = (event, node) => {
    // Trigger file selection which will cause auto-scroll in LearningRoadmap
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