import React from 'react';

const ContextHeader = ({ title, description }) => {
    const style = {
        padding: 'var(--space-4) var(--space-4)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)'
    };

    return (
        <div style={style}>
            <h1 style={{ marginBottom: 'var(--space-1)' }}>{title}</h1>
            <p style={{ color: '#666', fontSize: 'var(--text-body)', margin: 0 }}>{description}</p>
        </div>
    );
};

export default ContextHeader;
