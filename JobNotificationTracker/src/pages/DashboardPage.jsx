import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { allJobs } from '../data/jobs';
import { calculateMatchScore } from '../utils/engine';

const DashboardPage = ({ onToggleSave, savedJobs, jobStatuses, onUpdateStatus }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [modeFilter, setModeFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [expFilter, setExpFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('match');
    const [showOnlyMatches, setShowOnlyMatches] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [userPrefs, setUserPrefs] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('jobTrackerPreferences');
        if (stored) {
            setUserPrefs(JSON.parse(stored));
        }
    }, []);

    const getStatus = (jobId) => jobStatuses[jobId]?.status || 'Not Applied';

    const processedJobs = useMemo(() => {
        return allJobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, userPrefs),
            status: getStatus(job.id)
        }));
    }, [userPrefs, jobStatuses]);

    const filteredJobs = useMemo(() => {
        let list = processedJobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = locationFilter === '' || job.location === locationFilter;
            const matchesMode = modeFilter === '' || job.mode === modeFilter;
            const matchesSource = sourceFilter === '' || job.source === sourceFilter;
            const matchesExp = expFilter === '' || job.experienceLevel === expFilter;
            const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

            const matchesThreshold = !showOnlyMatches || (userPrefs && job.matchScore >= userPrefs.minMatchScore);

            return matchesSearch && matchesLocation && matchesMode && matchesSource && matchesExp && matchesStatus && matchesThreshold;
        });

        // Sorting
        if (sortBy === 'match') {
            list.sort((a, b) => b.matchScore - a.matchScore);
        } else if (sortBy === 'latest') {
            list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        } else if (sortBy === 'salary') {
            list.sort((a, b) => b.numericSalary - a.numericSalary);
        }

        return list;
    }, [processedJobs, searchTerm, locationFilter, modeFilter, sourceFilter, expFilter, statusFilter, showOnlyMatches, sortBy, userPrefs]);

    const getScoreClass = (score) => {
        if (score >= 80) return 'score-80';
        if (score >= 60) return 'score-60';
        if (score >= 40) return 'score-40';
        return 'score-low';
    };

    const getStatusClass = (status) => {
        const cls = status.toLowerCase().replace(' ', '-');
        return `status-${cls}`;
    };

    const isJobSaved = (jobId) => savedJobs.some(sj => sj.id === jobId);

    const statuses = ['Not Applied', 'Applied', 'Rejected', 'Selected'];

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            {!userPrefs && (
                <div className="pref-banner">
                    <div>
                        <span style={{ marginRight: '1rem' }}>💡</span>
                        Set your preferences to activate intelligent matching.
                    </div>
                    <button
                        className="btn-primary"
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                        onClick={() => navigate('/settings')}
                    >
                        Set Now
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Job Dashboard</h1>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Showing {filteredJobs.length} opportunities
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Search roles or companies..."
                    className="filter-input"
                    style={{ flex: 2 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="filter-select" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                    <option value="">All Locations</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Remote">Remote</option>
                </select>
                <select className="filter-select" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
                    <option value="">All Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                </select>
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="filter-select" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                    <option value="">All Sources</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Wellfound">Wellfound</option>
                    <option value="Direct">Direct</option>
                    <option value="Naukri">Naukri</option>
                </select>
            </div>

            <div className="dashboard-controls">
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <label className="toggle-container">
                        <input
                            type="checkbox"
                            checked={showOnlyMatches}
                            onChange={(e) => setShowOnlyMatches(e.target.checked)}
                        />
                        Show only jobs above my threshold ({userPrefs?.minMatchScore || 40}%)
                    </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort by:</span>
                    <select
                        className="filter-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ minWidth: '120px', padding: '0.5rem' }}
                    >
                        <option value="match">Match Score</option>
                        <option value="latest">Latest First</option>
                        <option value="salary">Highest Salary</option>
                    </select>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="empty-state">
                    <h2>No matches found.</h2>
                    <p>No roles match your criteria. Adjust filters or lower threshold.</p>
                </div>
            ) : (
                <div className="job-grid">
                    {filteredJobs.map(job => (
                        <div key={job.id} className="job-card">
                            {userPrefs && (
                                <div className={`score-badge ${getScoreClass(job.matchScore)}`}>
                                    {job.matchScore}% MATCH
                                </div>
                            )}
                            <div className="company" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {job.company}
                                <span className={`status-badge ${getStatusClass(job.status)}`}>
                                    {job.status}
                                </span>
                            </div>
                            <h3 style={{ paddingRight: '4rem' }}>{job.title}</h3>
                            <div className="job-meta">
                                <span>📍 {job.location}</span>
                                <span>💻 {job.mode}</span>
                                <span>💰 {job.salary}</span>
                            </div>

                            {/* Status controls */}
                            <div className="status-select-group">
                                {statuses.map(s => (
                                    <button
                                        key={s}
                                        className={`status-btn ${job.status === s ? 'active' : ''}`}
                                        onClick={() => onUpdateStatus(job.id, s, job.title, job.company)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <div className="job-footer">
                                <button className="btn-ghost" onClick={() => setSelectedJob(job)}>Details</button>
                                <button
                                    className="btn-primary"
                                    style={{
                                        backgroundColor: isJobSaved(job.id) ? 'var(--text-muted)' : 'var(--accent-color)',
                                        padding: '0.5rem 1rem'
                                    }}
                                    onClick={() => onToggleSave(job)}
                                >
                                    {isJobSaved(job.id) ? 'Saved' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedJob && (
                <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="modal-close" onClick={() => setSelectedJob(null)}>&times;</span>
                        <div className="company">{selectedJob.company}</div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{selectedJob.title}</h2>
                        <div className="job-meta" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                            <span>📍 {selectedJob.location}</span>
                            <span>💻 {selectedJob.mode}</span>
                            <span>💰 {selectedJob.salary}</span>
                            <span>🔗 {selectedJob.source}</span>
                            <span className={`status-badge ${getStatusClass(getStatus(selectedJob.id))}`}>
                                {getStatus(selectedJob.id)}
                            </span>
                        </div>

                        <div className="serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Job Description</div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
                            {selectedJob.description}
                        </p>

                        <div className="serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Required Skills</div>
                        <div className="skills-tags">
                            {selectedJob.skills.map(skill => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>

                        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                            <a
                                href={selectedJob.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ display: 'inline-block', textDecoration: 'none' }}
                                onClick={() => onUpdateStatus(selectedJob.id, 'Applied', selectedJob.title, selectedJob.company)}
                            >
                                Apply Now
                            </a>
                            <button
                                className="btn-ghost"
                                style={{ border: '1px solid var(--border-color)' }}
                                onClick={() => onToggleSave(selectedJob)}
                            >
                                {isJobSaved(selectedJob.id) ? 'Unsave' : 'Save for Later'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
