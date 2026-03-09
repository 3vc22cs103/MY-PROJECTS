import React, { useState, useEffect } from 'react';
import { Check, Link as LinkIcon, Github, Globe, Copyright, AlertCircle, ShieldCheck } from 'lucide-react';
import { useResume } from './ResumeContext';

const STEPS = ['01', '02', '03', '04', '05', '06', '07', '08'];

const CHECKLIST_ITEMS = [
    "All form sections save to localStorage",
    "Live preview updates in real-time",
    "Template switching preserves data",
    "Color theme persists after refresh",
    "ATS score calculates correctly",
    "Score updates live on edit",
    "Export buttons work (copy/download)",
    "Empty states handled gracefully",
    "Mobile responsive layout works",
    "No console errors on any page"
];

const Proof = () => {
    const { submission, setSubmission, checklist, setChecklist } = useResume();
    const [stepStatuses, setStepStatuses] = useState({});

    useEffect(() => {
        const s = {};
        STEPS.forEach(step => {
            s[step] = !!localStorage.getItem(`rb_step_${step}_artifact`);
        });
        setStepStatuses(s);
    }, []);

    const handleLinkChange = (e) => {
        setSubmission({ ...submission, [e.target.name]: e.target.value });
    };

    const toggleChecklist = (index) => {
        const newChecklist = [...checklist];
        newChecklist[index] = !newChecklist[index];
        setChecklist(newChecklist);
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const stepsDone = STEPS.every(step => stepStatuses[step]);
    const checklistDone = checklist.every(item => item === true);
    const linksDone = isValidUrl(submission.lovable) &&
        isValidUrl(submission.github) &&
        isValidUrl(submission.deploy);

    const isShipped = stepsDone && checklistDone && linksDone;

    const handleCopySubmission = () => {
        const text = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${submission.lovable}
GitHub Repository: ${submission.github}
Live Deployment: ${submission.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
        `.trim();
        navigator.clipboard.writeText(text);
        alert('Final submission copied to clipboard!');
    };

    return (
        <div className="proof-container animate-fade-in">
            <header style={{ marginBottom: 'var(--s-40)' }}>
                <h1 style={{ marginBottom: '8px' }}>Project Verification</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Finalize your Project 3 submission data below.
                </p>
            </header>

            <div className="proof-grid">
                {/* Column 1: Progress */}
                <div className="proof-section">
                    <h3 className="section-title-sm"><ShieldCheck size={16} /> Workflow Status</h3>
                    <div className="steps-mini-grid">
                        {STEPS.map(step => (
                            <div key={step} className={`step-mini-card ${stepStatuses[step] ? 'active' : ''}`}>
                                <span>Step {step}</span>
                                {stepStatuses[step] && <Check size={12} />}
                            </div>
                        ))}
                    </div>

                    <h3 className="section-title-sm" style={{ marginTop: '32px' }}>Verification Checklist</h3>
                    <div className="checklist-list">
                        {CHECKLIST_ITEMS.map((item, i) => (
                            <label key={i} className="checklist-item">
                                <input
                                    type="checkbox"
                                    checked={checklist[i]}
                                    onChange={() => toggleChecklist(i)}
                                />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Column 2: Assets */}
                <div className="proof-section">
                    <h3 className="section-title-sm">Artifact Collection</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="input-group">
                            <label className="input-label">Lovable Project Link</label>
                            <div className="input-with-icon">
                                <LinkIcon size={14} />
                                <input
                                    name="lovable"
                                    placeholder="https://lovable.dev/..."
                                    value={submission.lovable}
                                    onChange={handleLinkChange}
                                />
                            </div>
                            {submission.lovable && !isValidUrl(submission.lovable) && <span className="error-text">Invalid URL</span>}
                        </div>

                        <div className="input-group">
                            <label className="input-label">GitHub Repository Link</label>
                            <div className="input-with-icon">
                                <Github size={14} />
                                <input
                                    name="github"
                                    placeholder="https://github.com/..."
                                    value={submission.github}
                                    onChange={handleLinkChange}
                                />
                            </div>
                            {submission.github && !isValidUrl(submission.github) && <span className="error-text">Invalid URL</span>}
                        </div>

                        <div className="input-group">
                            <label className="input-label">Deployed URL</label>
                            <div className="input-with-icon">
                                <Globe size={14} />
                                <input
                                    name="deploy"
                                    placeholder="https://app.vercel.app"
                                    value={submission.deploy}
                                    onChange={handleLinkChange}
                                />
                            </div>
                            {submission.deploy && !isValidUrl(submission.deploy) && <span className="error-text">Invalid URL</span>}
                        </div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <button
                            className="btn btn-accent"
                            style={{ width: '100%', padding: '16px' }}
                            disabled={!isShipped}
                            onClick={handleCopySubmission}
                        >
                            <Copyright size={18} /> Copy Final Submission
                        </button>

                        {!isShipped && (
                            <div className="shipping-notice">
                                <AlertCircle size={14} />
                                <span>Submit after completing all steps, checklist items, and link artifacts.</span>
                            </div>
                        )}
                    </div>

                    {isShipped && (
                        <div className="shipped-message animate-fade-in">
                            <Check size={18} />
                            <span>Project 3 Shipped Successfully.</span>
                        </div>
                    )}
                </div>
            </div>

            <style jsx="true">{`
                .proof-container { max-width: 1000px; }
                .proof-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; }
                .section-title-sm { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 20px; }
                
                .steps-mini-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
                .step-mini-card { padding: 8px; background: #fff; border: 1px solid var(--border); font-size: 0.7rem; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
                .step-mini-card.active { border-color: var(--c4-accent); color: var(--c4-accent); background: #fff5f5; }
                
                .checklist-list { display: flex; flex-direction: column; gap: 8px; }
                .checklist-item { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; padding: 10px; border: 1px solid transparent; transition: all 0.2s; border-radius: 4px; }
                .checklist-item:hover { background: #fcfcfc; border-color: #eee; }
                .checklist-item input { margin-top: 4px; }
                .checklist-item span { font-size: 0.85rem; color: #444; }
                
                .input-with-icon { position: relative; }
                .input-with-icon :global(svg) { position: absolute; left: 12px; top: 12px; color: #999; }
                .input-with-icon input { width: 100%; padding: 10px 10px 10px 36px; border: 1px solid var(--border); font-family: inherit; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
                .input-with-icon input:focus { border-color: var(--c4-accent); }
                
                .error-text { font-size: 0.7rem; color: #ef4444; margin-top: 4px; display: block; }
                .shipping-notice { display: flex; align-items: center; gap: 8px; margin-top: 16px; color: #999; font-size: 0.75rem; line-height: 1.4; }
                
                .shipped-message { margin-top: 24px; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; border-radius: 4px; display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.9rem; }
            `}</style>
        </div>
    );
};

export default Proof;
