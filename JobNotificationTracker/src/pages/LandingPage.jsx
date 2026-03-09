import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '75vh',
            textAlign: 'center',
            padding: '4rem 2rem',
            animation: 'fadeIn 1s ease-out'
        }}>
            <div style={{
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--accent-color)',
                marginBottom: '1.5rem',
                opacity: 0.8
            }}>
                For High-Performers
            </div>
            <h1 style={{
                fontSize: '4.5rem',
                lineHeight: '1.1',
                marginBottom: '2rem',
                color: 'var(--text-main)',
                maxWidth: '900px',
                letterSpacing: '-0.03em'
            }}>
                Stop Missing <br />The Right Jobs.
            </h1>
            <p style={{
                fontSize: '1.4rem',
                color: 'var(--text-muted)',
                marginBottom: '3.5rem',
                maxWidth: '650px',
                lineHeight: '1.5',
                fontWeight: '300'
            }}>
                Precision-matched job discovery delivered daily at 9AM. <br />
                The elite way to track your career trajectory.
            </p>
            <button
                className="btn-primary"
                onClick={() => navigate('/settings')}
                style={{
                    fontSize: '1.1rem',
                    padding: '1.2rem 3rem',
                    boxShadow: '0 10px 20px rgba(128, 0, 32, 0.15)'
                }}
            >
                Start Tracking
            </button>

            <div style={{ marginTop: 'auto', paddingTop: '4rem', opacity: 0.3, fontSize: '0.9rem' }}>
                ✦ PREVIOUSLY FEATURED ON UNSETTLED ✦
            </div>
        </div>
    );
};

export default LandingPage;
