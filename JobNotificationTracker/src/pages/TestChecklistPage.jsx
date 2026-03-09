import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestChecklistPage = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState({
        preferences: false,
        matchScore: false,
        toggleMatches: false,
        savePersist: false,
        applyNewTab: false,
        statusPersist: false,
        statusFilter: false,
        digestTop10: false,
        digestPersist: false,
        noConsoleErrors: false
    });

    useEffect(() => {
        const storedTests = localStorage.getItem('jobTrackerTests');
        if (storedTests) {
            setTests(JSON.parse(storedTests));
        }
    }, []);

    const toggleTest = (key) => {
        const newTests = { ...tests, [key]: !tests[key] };
        setTests(newTests);
        localStorage.setItem('jobTrackerTests', JSON.stringify(newTests));
    };

    const resetTests = () => {
        const reset = Object.keys(tests).reduce((acc, key) => ({ ...acc, [key]: false }), {});
        setTests(reset);
        localStorage.setItem('jobTrackerTests', JSON.stringify(reset));
    };

    const passedCount = Object.values(tests).filter(Boolean).length;
    const allPassed = passedCount === 10;

    const checklistItems = [
        { key: 'preferences', title: 'Preferences persist after refresh', tooltip: 'Set a role keyword, refresh page, check if still there.' },
        { key: 'matchScore', title: 'Match score calculates correctly', tooltip: 'Verify a Frontend role scores higher if "Frontend" is in your keywords.' },
        { key: 'toggleMatches', title: '"Show only matches" toggle works', tooltip: 'Enable toggle and confirm low-score jobs disappear.' },
        { key: 'savePersist', title: 'Save job persists after refresh', tooltip: 'Save a job, refresh, and check the /saved page.' },
        { key: 'applyNewTab', title: 'Apply opens in new tab', tooltip: 'Click Apply and ensure it does not replace the app.' },
        { key: 'statusPersist', title: 'Status update persists after refresh', tooltip: 'Change a job to "Applied", refresh, and check status badge.' },
        { key: 'statusFilter', title: 'Status filter works correctly', tooltip: 'Select "Applied" filter and verify only relevant jobs show.' },
        { key: 'digestTop10', title: 'Digest generates top 10 by score', tooltip: 'Confirm the daily digest picks the highest match scores.' },
        { key: 'digestPersist', title: 'Digest persists for the day', tooltip: 'Generate digest, refresh, and confirm it is still loaded.' },
        { key: 'noConsoleErrors', title: 'No console errors on main pages', tooltip: 'Open DevTools and browse Dashboard/Settings/Digest.' }
    ];

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Quality Assurance</h1>
                <button className="btn-ghost" onClick={resetTests} style={{ fontSize: '0.85rem' }}>Reset Test Status</button>
            </div>

            <div className="test-summary">
                <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-color)' }}>
                        Tests Passed: {passedCount} / 10
                    </span>
                </div>
                {allPassed ? (
                    <button className="btn-primary" onClick={() => navigate('/jt/08-ship')}>
                        Proceed to Ship →
                    </button>
                ) : (
                    <div className="warning-banner" style={{ marginBottom: 0 }}>
                        Resolve all issues before shipping.
                    </div>
                )}
            </div>

            <div className="checklist-container">
                {checklistItems.map(item => (
                    <div key={item.key} className="checklist-item" onClick={() => toggleTest(item.key)} style={{ cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            className="checklist-checkbox"
                            checked={tests[item.key]}
                            onChange={() => { }} // Handled by div onClick
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="checklist-text">
                            <span className="checklist-title">{item.title}</span>
                            <span className="checklist-tooltip">How to test: {item.tooltip}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestChecklistPage;
