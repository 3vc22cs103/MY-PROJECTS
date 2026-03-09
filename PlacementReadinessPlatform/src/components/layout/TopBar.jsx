import React from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';

const TopBar = ({ step = 1, totalSteps = 5, status = 'In Progress' }) => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 var(--space-4)',
        height: '64px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: '#FFFFFF'
    };

    const brandStyle = {
        fontFamily: 'var(--font-serif)',
        fontWeight: '700',
        fontSize: 'var(--text-h2)', // Using h2 size for specific brand feel? or body? h2 is 24px.
        color: 'var(--color-text-primary)'
    };

    const statusBadgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '100px',
        backgroundColor: status === 'Shipped' ? '#EDF7ED' : '#FFF4E5',
        color: status === 'Shipped' ? 'var(--color-success)' : 'var(--color-warning)',
        fontSize: 'var(--text-small)',
        fontWeight: '500'
    };

    return (
        <div style={containerStyle}>
            <div style={brandStyle}>KodNest Premium</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-small)', color: '#666' }}>
                <span>Step {step}</span>
                <span style={{ color: '#ccc' }}>/</span>
                <span>{totalSteps}</span>
            </div>

            <div style={statusBadgeStyle}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                {status}
            </div>
        </div>
    );
};

export default TopBar;
