import React from 'react';
import TopBar from './TopBar';
import ContextHeader from './ContextHeader';
import ProofFooter from './ProofFooter';

const MainLayout = ({
    title,
    description,
    step = 1,
    totalSteps = 5,
    status = 'In Progress',
    workspace,
    panel
}) => {
    const layoutStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F9F9F9' // Slightly different bg? No, User said #F7F6F3.
    };

    const contentGridStyle = {
        display: 'flex',
        flex: 1,
        padding: 'var(--space-4)',
        gap: 'var(--space-4)',
        marginBottom: '60px' // Space for footer
    };

    const workspaceStyle = {
        flex: '0 0 70%',
        minWidth: 0 // Prevent overflow
    };

    const panelStyle = {
        flex: '0 0 30%',
        minWidth: 0
    };

    return (
        <div className="layout-root" style={layoutStyle}>
            <TopBar step={step} totalSteps={totalSteps} status={status} />
            <ContextHeader title={title} description={description} />

            <div style={contentGridStyle}>
                <main style={workspaceStyle}>
                    {workspace}
                </main>
                <aside style={panelStyle}>
                    {panel}
                </aside>
            </div>

            <ProofFooter />
        </div>
    );
};

export default MainLayout;
