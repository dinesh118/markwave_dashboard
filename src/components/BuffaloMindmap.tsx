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
  const translate = { x: 50, y: 50 };

  useEffect(() => {
    // nothing for now
  }, []);

  const nodeLabelRenderer = ({ nodeDatum }: any) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: 12 }}>
        <div style={{ fontWeight: 700 }}>{nodeDatum.name}</div>
        {nodeDatum.attributes && (
          <div style={{ color: '#6b7280' }}>
            <div>born: {nodeDatum.attributes.born}</div>
            <div>milk: {nodeDatum.attributes.milkStarts}</div>
            <div style={{ color: '#10b981' }}>children: {nodeDatum.attributes.totalChildren}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '600px', background: '#fff', borderRadius: 8, padding: 8 }} ref={containerRef}>
      <Tree
        data={treeData}
        translate={translate}
        orientation="vertical"
        pathFunc="elbow"
        collapsible={true}
        allowForeignObjects
        nodeLabelComponent={{
          render: nodeLabelRenderer,
          foreignObjectWrapper: {
            y: -20,
            x: -20,
          },
        }}
        styles={{ links: { stroke: '#cbd5e1', strokeWidth: 2 } }}
      />
    </div>
  );
};

export default BuffaloMindmap;
