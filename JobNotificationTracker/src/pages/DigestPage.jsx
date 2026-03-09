import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { allJobs } from '../data/jobs';
import { calculateMatchScore } from '../utils/engine';

const DigestPage = ({ jobStatuses }) => {
    const navigate = useNavigate();
    const [digest, setDigest] = useState(null);
    const [userPrefs, setUserPrefs] = useState(null);
    const [copying, setCopying] = useState(false);

    const todayStr = new Date().toISOString().split('T')[0];
    const digestKey = `jobTrackerDigest_${todayStr}`;

    useEffect(() => {
        const storedPrefs = localStorage.getItem('jobTrackerPreferences');
        if (storedPrefs) {
            setUserPrefs(JSON.parse(storedPrefs));
        }

        const storedDigest = localStorage.getItem(digestKey);
        if (storedDigest) {
            setDigest(JSON.parse(storedDigest));
        }
    }, [digestKey]);

    const recentUpdates = useMemo(() => {
        if (!jobStatuses) return [];
        return Object.entries(jobStatuses)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);
    }, [jobStatuses]);

    const getStatusClass = (status) => {
        const cls = status.toLowerCase().replace(' ', '-');
        return `status-${cls}`;
    };

    const generateDigest = () => {
        if (!userPrefs) return;

        // Calculate scores for all jobs
        const scoredJobs = allJobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, userPrefs)
        }));

        // Sort by match score DESC, then recency ASC
        const topJobs = scoredJobs
            .sort((a, b) => {
                if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
                return a.postedDaysAgo - b.postedDaysAgo;
            })
            .slice(0, 10);

        localStorage.setItem(digestKey, JSON.stringify(topJobs));
        setDigest(topJobs);
    };

    const copyToClipboard = () => {
        if (!digest) return;

        const text = digest.map((job, i) =>
            `${i + 1}. ${job.title} | ${job.company}\n   Matching: ${job.matchScore}%\n   Location: ${job.location} | ${job.mode}\n   Apply: ${job.applyUrl}\n`
        ).join('\n---\n\n');

        const header = `Top 10 Jobs For You — 9AM Digest (${todayStr})\n\n`;
        const footer = `\nGenerated based on your Job Notification Tracker preferences.`;

        navigator.clipboard.writeText(header + text + footer);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
    };

    const createEmailDraft = () => {
        if (!digest) return;

        const subject = `My 9AM Job Digest - ${todayStr}`;
        const text = digest.map((job, i) =>
            `${i + 1}. ${job.title} at ${job.company} (${job.matchScore}% Match)`
        ).join('%0D%0A');

        const body = `Hello,%0D%0A%0D%0AHere is my top job digest for today (${todayStr}):%0D%0A%0D%0A${text}%0D%0A%0D%0ACheck them out in the app!`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    };

    if (!userPrefs) {
        return (
            <div className="container" style={{ paddingTop: '5rem' }}>
                <div className="empty-state">
                    <h2>Preferences Not Set</h2>
                    <p>Set your preferences to generate a personalized daily digest.</p>
                    <button className="btn-primary" onClick={() => navigate('/settings')} style={{ marginTop: '2rem' }}>
                        Go to Settings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Daily Digest</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Demo Mode: Daily 9AM trigger simulated manually.
                    </p>
                </div>
                {!digest && (
                    <button className="btn-primary" onClick={generateDigest}>
                        Generate Today's 9AM Digest
                    </button>
                )}
            </div>

            {digest ? (
                <>
                    <div className="digest-newsletter">
                        <div className="digest-header">
                            <h2>Top 10 Jobs For You</h2>
                            <p>9AM Digest — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>

                        {digest.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                No matching roles today. Check again tomorrow.
                            </p>
                        ) : (
                            <div className="digest-list">
                                {digest.map((job, idx) => (
                                    <div key={job.id} className="digest-item">
                                        <div>
                                            <div style={{ color: 'var(--accent-color)', fontWeight: '700', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                                                {job.matchScore}% MATCH
                                            </div>
                                            <h4>{job.title}</h4>
                                            <div className="digest-item-meta">
                                                <span><strong>{job.company}</strong></span>
                                                <span>{job.location}</span>
                                                <span>{job.experienceLevel}</span>
                                            </div>
                                        </div>
                                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                                            Apply
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="digest-footer">
                            This digest was generated based on your profile and career preferences.
                        </div>
                    </div>

                    <div className="digest-actions">
                        <button className="btn-ghost" onClick={copyToClipboard} style={{ border: '1px solid var(--border-color)', minWidth: '200px' }}>
                            {copying ? '✓ Copied' : 'Copy Digest to Clipboard'}
                        </button>
                        <button className="btn-ghost" onClick={createEmailDraft} style={{ border: '1px solid var(--border-color)', minWidth: '200px' }}>
                            Create Email Draft
                        </button>
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <h2>No digest generated yet.</h2>
                    <p>Click the button above to simulate your daily 9AM job delivery.</p>
                </div>
            )}

            {/* Recent Status Updates */}
            {recentUpdates.length > 0 && (
                <div className="updates-card">
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Recent Status Updates</h3>
                    <div className="update-table">
                        <div className="update-row" style={{ fontWeight: '600', color: 'var(--text-muted)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.8rem' }}>
                            <span>Job Role</span>
                            <span>Company</span>
                            <span>Status</span>
                            <span style={{ textAlign: 'right' }}>Date</span>
                        </div>
                        {recentUpdates.map(update => (
                            <div key={update.id} className="update-row">
                                <span style={{ fontWeight: '500' }}>{update.jobTitle}</span>
                                <span>{update.company}</span>
                                <span>
                                    <span className={`status-badge ${getStatusClass(update.status)}`}>
                                        {update.status}
                                    </span>
                                </span>
                                <span style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {new Date(update.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigestPage;
