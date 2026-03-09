import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShipPage = () => {
    const navigate = useNavigate();
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const storedTests = localStorage.getItem('jobTrackerTests');
        if (storedTests) {
            const tests = JSON.parse(storedTests);
            const passedCount = Object.values(tests).filter(Boolean).length;
            if (passedCount === 10) {
                setIsLocked(false);
            }
        }
    }, []);

    if (isLocked) {
        return (
            <div className="container" style={{ paddingTop: '8rem' }}>
                <div className="locked-container">
                    <span className="lock-icon">🔒</span>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Shipment Locked</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 3rem auto', fontSize: '1.1rem' }}>
                        You must complete and verify all 10 quality assurance tests before you can ship the Job Notification Tracker.
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/jt/07-test')}>
                        Return to Checklist
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
            <div style={{ animation: 'fadeIn 1s ease-out' }}>
                <span style={{ fontSize: '5rem' }}>🚢</span>
                <h1 style={{ fontSize: '3.5rem', marginTop: '2rem', marginBottom: '1.5rem' }}>Ready for Launch</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem auto' }}>
                    All tests passed. The core intelligence, persistence engines, and premium UI are stable.
                </p>
                <div style={{ background: 'var(--white)', border: '1px solid var(--border-color)', padding: '3rem', borderRadius: '12px', display: 'inline-block' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Shipment Artifact</h3>
                    <code style={{ background: 'var(--bg-color)', padding: '1rem', display: 'block', borderRadius: '4px', fontSize: '0.9rem' }}>
                        JNT-V1-STABLE-{new Date().toISOString().split('T')[0]}
                    </code>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem', padding: '1rem 3rem' }}
                        onClick={() => alert('V1 Shipped Successfully!')}
                    >
                        Confirm Final Shipment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShipPage;
