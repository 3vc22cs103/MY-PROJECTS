import React from 'react';

const Input = ({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    error
}) => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: 'var(--space-2)',
        width: '100%'
    };

    const labelStyle = {
        fontSize: 'var(--text-small)',
        fontWeight: '500',
        color: 'var(--color-text-primary)'
    };

    const inputStyle = {
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${error ? 'var(--color-accent)' : 'var(--color-border)'}`,
        fontSize: 'var(--text-body)',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        transition: 'border-color var(--transition-fast)',
        width: '100%',
        backgroundColor: '#FFFFFF'
    };

    const errorStyle = {
        fontSize: 'var(--text-small)',
        color: 'var(--color-accent)',
        marginTop: '4px'
    };

    return (
        <div style={containerStyle}>
            {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-text-primary)'}
                onBlur={(e) => e.target.style.borderColor = error ? 'var(--color-accent)' : 'var(--color-border)'}
            />
            {error && <span style={errorStyle}>{error}</span>}
        </div>
    );
};

export default Input;
