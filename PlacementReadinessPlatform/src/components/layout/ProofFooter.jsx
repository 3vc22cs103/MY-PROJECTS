import React from 'react';
import { Square, CheckSquare } from 'lucide-react';

const ProofItem = ({ label, checked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: checked ? 1 : 0.5 }}>
        {checked ? <CheckSquare size={18} /> : <Square size={18} />}
        <span style={{ fontSize: 'var(--text-small)', fontWeight: '500' }}>{label}</span>
    </div>
);

const ProofFooter = ({ items = [] }) => {
    const style = {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-3) var(--space-4)',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: '#FFFFFF',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    };

    const defaultItems = [
        { label: 'UI Built', checked: false },
        { label: 'Logic Working', checked: false },
        { label: 'Test Passed', checked: false },
        { label: 'Deployed', checked: false }
    ];

    const displayItems = items.length > 0 ? items : defaultItems;

    return (
        <div style={style}>
            <span style={{ fontSize: 'var(--text-small)', fontWeight: '700', marginRight: 'var(--space-2)' }}>PROOF OF WORK:</span>
            {displayItems.map((item, idx) => (
                <ProofItem key={idx} label={item.label} checked={item.checked} />
            ))}
        </div>
    );
};

export default ProofFooter;
