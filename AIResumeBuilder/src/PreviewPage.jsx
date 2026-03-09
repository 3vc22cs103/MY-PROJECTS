import React from 'react';
import { useResume } from './ResumeContext';
import ResumePaper from './ResumePaper';
import { AlertCircle } from 'lucide-react';

const Preview = () => {
  const { resumeData, template, setTemplate, validateResume, getPlainText, atsAnalysis } = useResume();
  const [copyStatus, setCopyStatus] = React.useState('Copy as Text');
  const { isValid, missingFields } = validateResume();

  const handleCopy = () => {
    const text = getPlainText();
    navigator.clipboard.writeText(text);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy as Text'), 2000);
  };

  const handlePrint = () => {
    alert("PDF export ready! Check your downloads.");
    window.print();
  };

  const getScoreColor = (score) => {
    if (score <= 40) return '#ef4444'; // Red
    if (score <= 70) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  const getScoreLabel = (score) => {
    if (score <= 40) return 'Needs Work';
    if (score <= 70) return 'Getting There';
    return 'Strong Resume';
  };

  const scoreColor = getScoreColor(atsAnalysis.score);
  const strokeDash = (atsAnalysis.score / 100) * 251.2; // 2 * PI * R (R=40)

  return (
    <div className="preview-page">
      <div className="score-panel animate-fade-in">
        <div className="score-circle-container">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#eee" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray={`${strokeDash} 251.2`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
            <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#333">
              {atsAnalysis.score}
            </text>
          </svg>
          <div className="score-status" style={{ color: scoreColor }}>
            {getScoreLabel(atsAnalysis.score)}
          </div>
        </div>

        <div className="score-suggestions">
          <h4>Improvement Suggestions</h4>
          {atsAnalysis.suggestions.length > 0 ? (
            <ul>
              {atsAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : (
            <p className="success-msg">Your resume is ATS-ready! ✨</p>
          )}
        </div>
      </div>

      {!isValid && (
        <div className="validation-warning">
          <AlertCircle size={16} />
          <span>Your resume may look incomplete. Missing: {missingFields.join(', ')}.</span>
        </div>
      )}

      <div className="preview-actions">
        <div className="template-switcher-mini">
          {['Classic', 'Modern', 'Minimal'].map(t => (
            <button
              key={t}
              className={`t-btn ${template === t ? 'active' : ''}`}
              onClick={() => setTemplate(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={handleCopy}>
            {copyStatus}
          </button>
          <button className="btn btn-accent" onClick={handlePrint}>
            Print / Save as PDF
          </button>
        </div>
      </div>
      <div className="resume-canvas">
        <ResumePaper data={resumeData} minimal={true} />
      </div>

      <style jsx="true">{`
                .preview-page {
                    min-height: 100vh;
                    background: #fdfdfd;
                    padding: 40px 20px;
                }
                .score-panel {
                    max-width: 800px;
                    margin: 0 auto 20px;
                    padding: 24px;
                    background: white;
                    border: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    gap: 40px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .score-circle-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .score-status {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .score-suggestions {
                    flex: 1;
                }
                .score-suggestions h4 {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: #666;
                }
                .score-suggestions ul {
                    list-style: none;
                    padding: 0;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }
                .score-suggestions li {
                    font-size: 0.75rem;
                    color: #444;
                    padding-left: 16px;
                    position: relative;
                }
                .score-suggestions li::before {
                    content: '→';
                    position: absolute;
                    left: 0;
                    color: #999;
                }
                .success-msg {
                    font-size: 0.85rem;
                    color: #10b981;
                    font-weight: 500;
                }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .validation-warning {
                    max-width: 800px;
                    margin: 0 auto 20px;
                    padding: 12px 20px;
                    background: #fff5f5;
                    border: 1px solid #feb2b2;
                    color: #c53030;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 0.85rem;
                }
                .preview-actions {
                    max-width: 800px;
                    margin: 0 auto 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    background: white;
                    border: 1px solid #eee;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .btn-secondary {
                    padding: 10px 20px;
                    font-size: 0.8rem;
                    background: white;
                    border: 1px solid #ddd;
                    color: #444;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .btn-secondary:hover {
                    background: #f9f9f9;
                    border-color: #bbb;
                }
                .template-switcher-mini {
                    display: flex;
                    gap: 4px;
                    background: #f5f5f5;
                    padding: 4px;
                    border-radius: 4px;
                }
                .t-btn {
                    padding: 6px 12px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border: none;
                    background: transparent;
                    color: #888;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 2px;
                }
                .t-btn.active {
                    background: white;
                    color: black;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .resume-canvas {
                    max-width: 21cm;
                    margin: 0 auto;
                }
                @media print {
                    .preview-actions { display: none; }
                    .preview-page { padding: 0; background: white; }
                    .resume-canvas { max-width: none; width: 100%; margin: 0; }
                }
            `}</style>
    </div>
  );
};

export default Preview;
