import React, { useRef, useEffect } from 'react';
import Tree from 'react-d3-tree';

// Convert the generated buffalo node structure to react-d3-tree format
function convert(node: any) {
  return {
    name: node.name,
    attributes: {
      born: node.born,
      milkStarts: node.milkStarts,
      totalChildren: node.totalChildren,
    },
    children: (node.children || []).map((c: any) => convert(c)),
  };
}

const BuffaloMindmap: React.FC<{ rootNode: any }> = ({ rootNode }) => {
  const treeData = [convert(rootNode)];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const translate = { x: 300, y: 100 }; // Better initial positioning

  useEffect(() => {
    // nothing for now
  }, []);

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }: any) => {
    const hasChildren = nodeDatum.attributes?.totalChildren > 0;
    const nodeColor = hasChildren ? '#10b981' : '#9ca3af'; // Green for parents, grey for childless
    const textColor = hasChildren ? '#065f46' : '#4b5563';
    
    return (
      <g>
        {/* Node circle */}
        <circle
          r={25}
          fill={nodeColor}
          stroke="#fff"
          strokeWidth={3}
          onClick={toggleNode}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Node label */}
        <text
          fill={textColor}
          strokeWidth="0"
          x={0}
          y={5}
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
        >
          {nodeDatum.name}
        </text>
        
        {/* Info box */}
        <foreignObject
          x={35}
          y={-40}
          width={200}
          height={80}
        >
          <div style={{
            background: 'white',
            border: `2px solid ${nodeColor}`,
            borderRadius: '8px',
            padding: '8px',
            fontSize: '11px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontWeight: 600, color: textColor, marginBottom: '4px' }}>
              {nodeDatum.name}
            </div>
            {nodeDatum.attributes && (
              <div style={{ color: '#6b7280', lineHeight: '1.3' }}>
                <div>born: {nodeDatum.attributes.born}</div>
                <div>milkStarts: {nodeDatum.attributes.milkStarts}</div>
                <div style={{ 
                  color: hasChildren ? '#10b981' : '#ef4444',
                  fontWeight: 600 
                }}>
                  totalChildren: {nodeDatum.attributes.totalChildren}
                </div>
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '700px', background: '#f8fafc', borderRadius: 12, padding: 16, overflow: 'hidden' }} ref={containerRef}>
      <Tree
        data={treeData}
        translate={translate}
        orientation="vertical"
        pathFunc="step"
        collapsible={true}
        renderCustomNodeElement={renderCustomNodeElement}
        separation={{ siblings: 2, nonSiblings: 2.5 }}
        nodeSize={{ x: 280, y: 150 }}
        styles={{
          links: { 
            stroke: '#64748b', 
            strokeWidth: 2,
            fill: 'none'
          }
        }}
        zoomable={true}
        draggable={true}
        scaleExtent={{ min: 0.3, max: 2 }}
      />
    </div>
  );
};

export default BuffaloMindmap;
