import React from 'react';
import BuffaloTree from '../BuffaloTree';

const BuffaloTreeTab: React.FC = () => {
    return (
        <div>
            {/* Buffalo Tree tab content */}
            <div style={{ padding: '1rem' }}>
                <h2>Buffalo Family Tree</h2>
                <div className="tree-wrapper">
                    {/* Render BuffaloTree component */}
                    <div id="buffalo-tree-root">
                        <BuffaloTree />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuffaloTreeTab;
