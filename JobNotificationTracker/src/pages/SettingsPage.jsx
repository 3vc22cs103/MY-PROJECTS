import { useState, useEffect } from 'react';

const SettingsPage = () => {
    const [prefs, setPrefs] = useState({
        roleKeywords: '',
        preferredLocations: [],
        preferredMode: [],
        experienceLevel: '',
        skills: '',
        minMatchScore: 40
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedPrefs = localStorage.getItem('jobTrackerPreferences');
        if (storedPrefs) {
            setPrefs(JSON.parse(storedPrefs));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('jobTrackerPreferences', JSON.stringify(prefs));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleLocationToggle = (loc) => {
        setPrefs(prev => ({
            ...prev,
            preferredLocations: prev.preferredLocations.includes(loc)
                ? prev.preferredLocations.filter(l => l !== loc)
                : [...prev.preferredLocations, loc]
        }));
    };

    const handleModeToggle = (mode) => {
        setPrefs(prev => ({
            ...prev,
            preferredMode: prev.preferredMode.includes(mode)
                ? prev.preferredMode.filter(m => m !== mode)
                : [...prev.preferredMode, mode]
        }));
    };

    const locations = ["Bangalore", "Mumbai", "Pune", "Hyderabad", "Noida", "Gurgaon", "Delhi", "Chennai", "Remote"];
    const modes = ["Remote", "Hybrid", "Onsite"];

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Preferences</h1>
                {saved && <span style={{ color: '#2E7D32', fontWeight: '600', animation: 'fadeIn 0.3s' }}>✓ Preferences Saved</span>}
            </div>

            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                {/* Role Keywords */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontWeight: '600', fontSize: '1rem' }}>Role Keywords</label>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>Comma-separated. e.g. Frontend, React, Engineer</p>
                    <input
                        type="text"
                        value={prefs.roleKeywords}
                        onChange={(e) => setPrefs({ ...prefs, roleKeywords: e.target.value })}
                        placeholder="e.g. Frontend Developer, UI Engineer"
                        style={{
                            padding: '1.2rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '1rem',
                            backgroundColor: 'var(--white)'
                        }}
                    />
                </div>

                {/* Preferred Locations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontWeight: '600', fontSize: '1rem' }}>Preferred Locations</label>
                    <div className="multi-select-grid">
                        {locations.map(loc => (
                            <label key={loc} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={prefs.preferredLocations.includes(loc)}
                                    onChange={() => handleLocationToggle(loc)}
                                />
                                {loc}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Mode */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontWeight: '600', fontSize: '1rem' }}>Preferred Mode</label>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {modes.map(mode => (
                            <label key={mode} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={prefs.preferredMode.includes(mode)}
                                    onChange={() => handleModeToggle(mode)}
                                />
                                {mode}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Experience Level */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ fontWeight: '600', fontSize: '1rem' }}>Experience Level</label>
                        <select
                            value={prefs.experienceLevel}
                            onChange={(e) => setPrefs({ ...prefs, experienceLevel: e.target.value })}
                            style={{
                                padding: '1.2rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '1rem',
                                backgroundColor: 'var(--white)'
                            }}
                        >
                            <option value="">Any Level</option>
                            <option value="entry">Entry Level</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid-Senior</option>
                            <option value="senior">Senior</option>
                            <option value="lead">Lead/Principal</option>
                        </select>
                    </div>

                    {/* Minimum Match Score */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={{ fontWeight: '600', fontSize: '1rem' }}>Min. Match Score</label>
                            <span style={{ fontWeight: '700', color: 'var(--accent-color)' }}>{prefs.minMatchScore}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={prefs.minMatchScore}
                            onChange={(e) => setPrefs({ ...prefs, minMatchScore: parseInt(e.target.value) })}
                            style={{ marginTop: '1rem' }}
                        />
                    </div>
                </div>

                {/* Skills Overlap */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontWeight: '600', fontSize: '1rem' }}>Target Skills</label>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>Comma-separated. We'll match these against job requirements.</p>
                    <input
                        type="text"
                        value={prefs.skills}
                        onChange={(e) => setPrefs({ ...prefs, skills: e.target.value })}
                        placeholder="e.g. React, Node.js, Python, Figma"
                        style={{
                            padding: '1.2rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '1rem',
                            backgroundColor: 'var(--white)'
                        }}
                    />
                </div>

                <button
                    className="btn-primary"
                    onClick={handleSave}
                    style={{ marginTop: '2rem', width: 'fit-content', padding: '1.2rem 4rem', fontSize: '1.1rem' }}
                >
                    Save My Preferences
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
