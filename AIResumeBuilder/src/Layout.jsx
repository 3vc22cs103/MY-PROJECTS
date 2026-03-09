import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Copy, ExternalLink, Camera } from 'lucide-react';
import { useResume } from './ResumeContext';

const STEPS = [
  { id: '01', path: '/rb/01-problem', name: 'Problem Statement' },
  { id: '02', path: '/rb/02-market', name: 'Market Research' },
  { id: '03', path: '/rb/03-architecture', name: 'Architecture' },
  { id: '04', path: '/rb/04-hld', name: 'High Level Design' },
  { id: '05', path: '/rb/05-lld', name: 'Low Level Design' },
  { id: '06', path: '/rb/06-build', name: 'Build Track' },
  { id: '07', path: '/rb/07-test', name: 'Testing' },
  { id: '08', path: '/rb/08-ship', name: 'Shipping' },
];

const Layout = ({ children }) => {
  const { submission, checklist } = useResume();
  const location = useLocation();
  const navigate = useNavigate();
  const [artifact, setArtifact] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);

  // Find current step
  const currentStepIndex = STEPS.findIndex(s => s.path === location.pathname);
  const currentStep = STEPS[currentStepIndex];
  const isProofPage = location.pathname === '/rb/proof';

  // Global Shipped Status
  const isShipped = useMemo(() => {
    const stepsDone = STEPS.every(s => !!localStorage.getItem(`rb_step_${s.id}_artifact`));
    const checklistDone = checklist.every(item => item === true);
    const linksDone = submission.lovable && submission.github && submission.deploy &&
      submission.lovable.startsWith('http') &&
      submission.github.startsWith('http') &&
      submission.deploy.startsWith('http');
    return stepsDone && checklistDone && linksDone;
  }, [submission, checklist]);

  // Artifact ID for localStorage
  const artifactId = currentStep ? `rb_step_${currentStep.id}_artifact` : null;

  useEffect(() => {
    if (artifactId) {
      const saved = localStorage.getItem(artifactId);
      setArtifact(saved || '');
      setIsUploaded(!!saved);
    }
  }, [location.pathname, artifactId]);

  const handleSaveArtifact = (e) => {
    const value = e.target.value;
    setArtifact(value);
  };

  const handleUpload = () => {
    if (artifact.trim()) {
      localStorage.setItem(artifactId, artifact);
      setIsUploaded(true);
      alert('Artifact uploaded successfully!');
    }
  };

  const nextStep = STEPS[currentStepIndex + 1];
  const canGoNext = (isUploaded || isProofPage) && nextStep;

  return (
    <div className="layout-container">
      {/* Top Bar */}
      <header className="top-bar">
        <div style={{ fontWeight: 600 }}>AI Resume Builder</div>
        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem' }}>
          {isProofPage ? 'Final Submission' : `Project 3 — Step ${currentStep?.id || 'X'} of 8`}
        </div>
        <div className={`status-badge ${isShipped ? 'shipped' : ''}`}>
          {isShipped ? 'Shipped' : isUploaded ? 'Complete' : 'In Progress'}
        </div>
      </header>

      <style jsx="true">{`
        .status-badge.shipped {
          background-color: var(--c4-accent);
          color: white;
          border-color: var(--c4-accent);
        }
      `}</style>

      {/* Context Header */}
      <div className="context-header">
        <h2 style={{ margin: 0 }}>{currentStep?.name || 'Project Overview'}</h2>
      </div>

      {/* Main Workspace */}
      <main className="main-content">
        <section className="workspace">
          {children}

          {!isProofPage && (
            <div style={{ marginTop: 'var(--s-40)', display: 'flex', gap: 'var(--s-16)' }}>
              <button
                className="btn btn-accent"
                disabled={!canGoNext}
                onClick={() => navigate(nextStep.path)}
              >
                Next Step
              </button>
              {currentStepIndex === STEPS.length - 1 && isUploaded && (
                <button
                  className="btn btn-accent"
                  onClick={() => navigate('/rb/proof')}
                >
                  Go to Proof
                </button>
              )}
            </div>
          )}
        </section>

        {/* Build Panel (30%) */}
        {!isProofPage && (
          <aside className="build-panel">
            <div>
              <label className="input-label" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                COPY THIS INTO LOVABLE
              </label>
              <textarea
                className="textarea-minimal"
                placeholder="Step instructions or artifact content..."
                value={artifact}
                onChange={handleSaveArtifact}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn" onClick={() => {
                navigator.clipboard.writeText(artifact);
                alert('Copied to clipboard');
              }}>
                <Copy size={16} /> Copy Prompt
              </button>

              <a href="https://lovable.dev" target="_blank" rel="noopener" className="btn" style={{ textDecoration: 'none' }}>
                <ExternalLink size={16} /> Build in Lovable
              </a>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <label className="input-label">STATUS</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button className={`btn ${isUploaded ? 'btn-accent' : ''}`} style={{ flex: 1 }} onClick={handleUpload}>
                  <CheckCircle size={14} /> It Worked
                </button>
                <button className="btn" style={{ flex: 1 }}>
                  <AlertCircle size={14} /> Error
                </button>
              </div>
              <button className="btn" style={{ width: '100%', marginTop: '8px' }}>
                <Camera size={14} /> Add Screenshot
              </button>
            </div>
          </aside>
        )}
      </main>

      {/* Proof Footer */}
      <footer className="proof-footer">
        <Link to="/rb/proof" style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 500 }}>
          Project Proof System &rarr;
        </Link>
      </footer>
    </div>
  );
};

export default Layout;
