import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    onClick,
    disabled,
    type = 'button',
    className = ''
}) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 24px',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-body)',
        fontWeight: '500',
        transition: 'opacity var(--transition-fast), transform var(--transition-fast)',
        opacity: disabled || isLoading ? 0.7 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        position: 'relative',
        gap: '8px',
        minWidth: '100px'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-accent)',
            color: '#ffffff',
            border: '1px solid var(--color-accent)'
        },
        secondary: {
            backgroundColor: 'transparent',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)'
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-text-primary)',
            border: 'none',
            padding: '8px 16px' // slightly smaller padding for ghost
        }
    };

    const mergedStyles = {
        ...baseStyles,
        ...variants[variant]
    };

    return (
        <button
            type={type}
            style={mergedStyles}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={className}
            onMouseEnter={(e) => {
                if (!disabled && !isLoading) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
                if (!disabled && !isLoading) e.currentTarget.style.opacity = '1';
            }}
        >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {!isLoading && children}
        </button>
    );
};

export default Button;
