import { useState, useEffect, useMemo } from 'react';

const ProofPage = () => {
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deployed: ''
    });
    const [testResults, setTestResults] = useState({});
    const [copying, setCopying] = useState(false);

    useEffect(() => {
        const storedLinks = localStorage.getItem('jobTrackerProofLinks');
        if (storedLinks) setLinks(JSON.parse(storedLinks));

        const storedTests = localStorage.getItem('jobTrackerTests');
        if (storedTests) setTestResults(JSON.parse(storedTests));
    }, []);

    const handleLinkChange = (key, value) => {
        const newLinks = { ...links, [key]: value };
        setLinks(newLinks);
        localStorage.setItem('jobTrackerProofLinks', JSON.stringify(newLinks));
    };

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const testsPassedCount = Object.values(testResults).filter(Boolean).length;
    const allTestsPassed = testsPassedCount === 10;
    const allLinksProvided = validateUrl(links.lovable) && validateUrl(links.github) && validateUrl(links.deployed);

    const isShipped = allTestsPassed && allLinksProvided;
    const isStarted = Object.values(links).some(l => l) || testsPassedCount > 0;

    const steps = [
        { id: 1, title: 'App Skeleton & Routing', status: 'Completed' },
        { id: 2, title: 'KodNest Design System', status: 'Completed' },
        { id: 3, title: 'Job Dashboard & Dataset', status: 'Completed' },
        { id: 4, title: 'Preference Logic Implementation', status: 'Completed' },
        { id: 5, title: 'Match Scoring Engine logic', status: 'Completed' },
        { id: 6, title: 'Daily Digest Engine', status: 'Completed' },
        { id: 7, title: 'Job Status Tracking system', status: 'Completed' },
        { id: 8, title: 'Quality Assurance (10/10 Tests)', status: allTestsPassed ? 'Completed' : 'Pending' }
    ];

    const copySubmission = () => {
        const text = `Job Notification Tracker — Final Submission\n\nLovable Project:\n${links.lovable}\n\nGitHub Repository:\n${links.github}\n\nLive Deployment:\n${links.deployed}\n\nCore Features:\n- Intelligent match scoring\n- Daily digest simulation\n- Status tracking\n- Test checklist enforced`;
        navigator.clipboard.writeText(text);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Project Proof</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Project 1 — Job Notification Tracker</p>
                </div>
                <div>
                    {isShipped ? (
                        <span className="project-status-badge badge-shipped">Shipped</span>
                    ) : isStarted ? (
                        <span className="project-status-badge badge-progress">In Progress</span>
                    ) : (
                        <span className="project-status-badge badge-started">Not Started</span>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>

                {/* Step Summary */}
                <div className="proof-card">
                    <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-serif)', fontSize: '1.6rem' }}>Step Completion Summary</h3>
                    {steps.map(step => (
                        <div key={step.id} className="step-row">
                            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{step.id}. {step.title}</span>
                            <span className={`step-status ${step.status === 'Completed' ? 'status-valid' : 'status-pending'}`}>
                                {step.status}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Artifact Collection */}
                <div className="proof-card">
                    <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-serif)', fontSize: '1.6rem' }}>Artifact Collection</h3>

                    <div className="input-group">
                        <label>Lovable Project Link</label>
                        <input
                            type="text"
                            placeholder="https://lovable.dev/projects/..."
                            value={links.lovable}
                            onChange={(e) => handleLinkChange('lovable', e.target.value)}
                        />
                        {!validateUrl(links.lovable) && links.lovable && <small style={{ color: 'var(--accent-color)' }}>Invalid URL format</small>}
                    </div>

                    <div className="input-group">
                        <label>GitHub Repository Link</label>
                        <input
                            type="text"
                            placeholder="https://github.com/user/repo"
                            value={links.github}
                            onChange={(e) => handleLinkChange('github', e.target.value)}
                        />
                        {!validateUrl(links.github) && links.github && <small style={{ color: 'var(--accent-color)' }}>Invalid URL format</small>}
                    </div>

                    <div className="input-group">
                        <label>Deployed URL (Vercel or equivalent)</label>
                        <input
                            type="text"
                            placeholder="https://my-job-tracker.vercel.app"
                            value={links.deployed}
                            onChange={(e) => handleLinkChange('deployed', e.target.value)}
                        />
                        {!validateUrl(links.deployed) && links.deployed && <small style={{ color: 'var(--accent-color)' }}>Invalid URL format</small>}
                    </div>

                    <button
                        className="btn-primary"
                        onClick={copySubmission}
                        disabled={!allLinksProvided}
                        style={{ width: '100%', padding: '1.2rem', opacity: allLinksProvided ? 1 : 0.5 }}
                    >
                        {copying ? '✓ Copied' : 'Copy Final Submission'}
                    </button>
                </div>
            </div>

            {isShipped && (
                <div className="shipment-message">
                    Project 1 Shipped Successfully.
                </div>
            )}

            {!isShipped && isStarted && (
                <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Conditions to ship: All 8 development steps completed and all 3 artifact links verified.
                </p>
            )}
        </div>
    );
};

export default ProofPage;
