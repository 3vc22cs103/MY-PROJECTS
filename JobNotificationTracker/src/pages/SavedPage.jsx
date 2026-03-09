const SavedPage = ({ savedJobs, onToggleSave, jobStatuses, onUpdateStatus }) => {

    const getStatus = (jobId) => jobStatuses[jobId]?.status || 'Not Applied';

    const getStatusClass = (status) => {
        const cls = status.toLowerCase().replace(' ', '-');
        return `status-${cls}`;
    };

    const statuses = ['Not Applied', 'Applied', 'Rejected', 'Selected'];

    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Saved Jobs</h1>

            {savedJobs.length === 0 ? (
                <div className="empty-state">
                    <h2>Your saved jobs will appear here.</h2>
                    <p>Start tracking and save jobs you're interested in.</p>
                </div>
            ) : (
                <div className="job-grid">
                    {savedJobs.map(job => (
                        <div key={job.id} className="job-card">
                            <div className="company" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {job.company}
                                <span className={`status-badge ${getStatusClass(getStatus(job.id))}`}>
                                    {getStatus(job.id)}
                                </span>
                            </div>
                            <h3>{job.title}</h3>
                            <div className="job-meta">
                                <span>📍 {job.location}</span>
                                <span>💻 {job.mode}</span>
                                <span>💰 {job.salary}</span>
                            </div>

                            <div className="status-select-group">
                                {statuses.map(s => (
                                    <button
                                        key={s}
                                        className={`status-btn ${getStatus(job.id) === s ? 'active' : ''}`}
                                        onClick={() => onUpdateStatus(job.id, s, job.title, job.company)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <div className="job-footer">
                                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ textDecoration: 'none' }}>Apply</a>
                                <button className="btn-primary" onClick={() => onToggleSave(job)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedPage;
