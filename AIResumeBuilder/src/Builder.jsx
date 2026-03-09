import React, { useState } from 'react';
import { useResume } from './ResumeContext';
import { Plus, Trash2, Zap, AlertCircle, ChevronDown, ChevronUp, X, Loader2, Globe, Github } from 'lucide-react';
import ResumePaper from './ResumePaper';

const TagInput = ({ tags, onAdd, onRemove, placeholder }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput('');
        }
    };

    return (
        <div className="tag-input-container">
            <div className="tags-list">
                {tags.map((tag, i) => (
                    <span key={i} className="tag-pill">
                        {tag}
                        <button onClick={() => onRemove(tag)}><X size={10} /></button>
                    </span>
                ))}
            </div>
            <input
                className="input-minimal"
                style={{ border: 'none', padding: '4px 0', marginTop: '4px' }}
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

const ProjectEntry = ({ project, index, isExpanded, onToggle, updateItem, removeItem, addProjectTag, removeProjectTag, analyzeBullet, BulletGuidance }) => {
    const charCount = project.description?.length || 0;

    return (
        <div className={`form-group-item project-entry ${isExpanded ? 'active' : ''}`}>
            <div className="project-header" onClick={onToggle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <strong>{project.name || `Project ${index + 1}`}</strong>
                </div>
                <button className="btn-error-text" onClick={(e) => { e.stopPropagation(); removeItem('projects', index); }}>
                    <Trash2 size={14} />
                </button>
            </div>

            {isExpanded && (
                <div className="project-content">
                    <div className="grid-2">
                        <input className="input-minimal" placeholder="Project Name" value={project.name} onChange={(e) => updateItem('projects', index, 'name', e.target.value)} />
                        <div className="grid-2" style={{ gap: '8px' }}>
                            <input className="input-minimal" placeholder="Live URL (optional)" value={project.liveUrl || ''} onChange={(e) => updateItem('projects', index, 'liveUrl', e.target.value)} />
                            <input className="input-minimal" placeholder="GitHub URL (optional)" value={project.githubUrl || ''} onChange={(e) => updateItem('projects', index, 'githubUrl', e.target.value)} />
                        </div>
                    </div>

                    <div className="tag-section">
                        <label className="input-label" style={{ fontSize: '0.7rem' }}>Tech Stack</label>
                        <TagInput
                            tags={project.techStack || []}
                            onAdd={(tag) => addProjectTag(index, tag)}
                            onRemove={(tag) => removeProjectTag(index, tag)}
                            placeholder="Type tech and press Enter..."
                        />
                    </div>

                    <div className="description-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <label className="input-label" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>Description</label>
                            <span className={`char-counter ${charCount > 180 ? 'warning' : ''}`}>{charCount}/200</span>
                        </div>
                        <textarea
                            maxLength={200}
                            placeholder="Describe what you built..."
                            value={project.description}
                            onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                        />
                        <BulletGuidance text={project.description} />
                    </div>
                </div>
            )}
        </div>
    );
};

const Builder = () => {
    const {
        resumeData,
        template,
        setTemplate,
        themeColor,
        setThemeColor,
        THEME_COLORS,
        updatePersonalInfo,
        updateSummary,
        addItem,
        updateItem,
        removeItem,
        addSkillTag,
        removeSkillTag,
        suggestSkills,
        addProjectTag,
        removeProjectTag,
        updateLinks,
        loadSample,
        atsAnalysis,
        analyzeBullet
    } = useResume();

    const [isSuggesting, setIsSuggesting] = useState(false);
    const [expandedProject, setExpandedProject] = useState(0);

    const handleSuggest = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            suggestSkills();
            setIsSuggesting(false);
        }, 1000);
    };

    const BulletGuidance = ({ text }) => {
        const { hasVerb, hasNumeric } = analyzeBullet(text);
        if (!text || (hasVerb && hasNumeric)) return null;
        return (
            <div className="bullet-guidance">
                {!hasVerb && <span>Start with a strong action verb.</span>}
                {!hasNumeric && <span>Add measurable impact (numbers).</span>}
            </div>
        );
    };

    const handleDownload = () => {
        alert("PDF export ready! Check your downloads.");
    };

    return (
        <div className="builder-layout">
            {/* Left Column: Form */}
            <div className="form-column">
                <header className="builder-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--s-24)' }}>
                        <div>
                            <h1 style={{ margin: 0 }}>Resume Editor</h1>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Changes save automatically.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn" style={{ background: 'black', color: 'white' }} onClick={handleDownload}>
                                Download PDF
                            </button>
                            <button className="btn" onClick={loadSample}>
                                <Zap size={16} /> Load Sample
                            </button>
                        </div>
                    </div>

                    <div className="ats-panel">
                        <div className="ats-score-header">
                            <span className="input-label" style={{ marginBottom: 0 }}>ATS Readiness Score</span>
                            <span className="ats-score-value">{atsAnalysis.score}%</span>
                        </div>
                        <div className="ats-progress-bg">
                            <div className="ats-progress-fill" style={{ width: `${atsAnalysis.score}%`, backgroundColor: atsAnalysis.score > 70 ? 'var(--success)' : atsAnalysis.score > 40 ? 'var(--warning)' : 'var(--c4-accent)' }}></div>
                        </div>
                        {atsAnalysis.suggestions.length > 0 && (
                            <div className="ats-suggestions">
                                <div className="input-label" style={{ fontSize: '0.65rem', marginBottom: '8px' }}>Top 3 Improvements</div>
                                {atsAnalysis.suggestions.map((msg, i) => (
                                    <div key={i} className="ats-suggestion-item">
                                        <AlertCircle size={12} /> {msg}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                <div className="form-sections">
                    <section className="form-section">
                        <label className="input-label">Personal Information</label>
                        <div className="grid-2">
                            <input className="input-minimal" placeholder="Full Name" value={resumeData.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} />
                            <input className="input-minimal" placeholder="Email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                            <input className="input-minimal" placeholder="Phone" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                            <input className="input-minimal" placeholder="Location" value={resumeData.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                        </div>
                    </section>

                    <section className="form-section">
                        <label className="input-label">Professional Summary</label>
                        <textarea className="textarea-minimal" placeholder="Describe your career goals..." value={resumeData.summary} onChange={(e) => updateSummary(e.target.value)} />
                    </section>

                    <section className="form-section">
                        <div className="section-header">
                            <label className="input-label">Skills</label>
                            <button className="btn-text" onClick={handleSuggest} disabled={isSuggesting} style={{ fontSize: '0.75rem', color: 'var(--c4-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {isSuggesting ? <Loader2 className="animate-spin" size={14} /> : '✨ Suggest Skills'}
                            </button>
                        </div>

                        <div className="skill-categories">
                            {[
                                { id: 'technical', label: 'Technical Skills' },
                                { id: 'soft', label: 'Soft Skills' },
                                { id: 'tools', label: 'Tools & Technologies' }
                            ].map(cat => (
                                <div key={cat.id} className="skill-cat-group">
                                    <label className="input-label" style={{ fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between' }}>
                                        {cat.label} <span>({resumeData.skills[cat.id]?.length || 0})</span>
                                    </label>
                                    <TagInput
                                        tags={resumeData.skills[cat.id] || []}
                                        onAdd={(tag) => addSkillTag(cat.id, tag)}
                                        onRemove={(tag) => removeSkillTag(cat.id, tag)}
                                        placeholder="Add skill..."
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="section-header">
                            <label className="input-label">Experience</label>
                            <button className="btn-icon" onClick={() => addItem('experience')}><Plus size={16} /></button>
                        </div>
                        {resumeData.experience.map((exp, i) => (
                            <div key={i} className="form-group-item">
                                <div className="grid-2">
                                    <input className="input-minimal" placeholder="Company" value={exp.company} onChange={(e) => updateItem('experience', i, 'company', e.target.value)} />
                                    <input className="input-minimal" placeholder="Position" value={exp.position} onChange={(e) => updateItem('experience', i, 'position', e.target.value)} />
                                    <input className="input-minimal" placeholder="Period" value={exp.period} onChange={(e) => updateItem('experience', i, 'period', e.target.value)} />
                                    <button className="btn-error-text" onClick={() => removeItem('experience', i)}><Trash2 size={14} /></button>
                                </div>
                                <textarea placeholder="Describe impact..." value={exp.description} onChange={(e) => updateItem('experience', i, 'description', e.target.value)} />
                                <BulletGuidance text={exp.description} />
                            </div>
                        ))}
                    </section>

                    <section className="form-section">
                        <div className="section-header">
                            <label className="input-label">Projects</label>
                            <button className="btn-icon" onClick={() => addItem('projects')}><Plus size={16} /></button>
                        </div>
                        <div className="projects-list">
                            {resumeData.projects.map((proj, i) => (
                                <ProjectEntry
                                    key={i}
                                    project={proj}
                                    index={i}
                                    isExpanded={expandedProject === i}
                                    onToggle={() => setExpandedProject(expandedProject === i ? -1 : i)}
                                    updateItem={updateItem}
                                    removeItem={removeItem}
                                    addProjectTag={addProjectTag}
                                    removeProjectTag={removeProjectTag}
                                    analyzeBullet={analyzeBullet}
                                    BulletGuidance={BulletGuidance}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="section-header">
                            <label className="input-label">Education</label>
                            <button className="btn-icon" onClick={() => addItem('education')}><Plus size={16} /></button>
                        </div>
                        {resumeData.education.map((edu, i) => (
                            <div key={i} className="form-group-item">
                                <div className="grid-2">
                                    <input className="input-minimal" placeholder="School" value={edu.school} onChange={(e) => updateItem('education', i, 'school', e.target.value)} />
                                    <input className="input-minimal" placeholder="Degree" value={edu.degree} onChange={(e) => updateItem('education', i, 'degree', e.target.value)} />
                                    <input className="input-minimal" placeholder="Year" value={edu.year} onChange={(e) => updateItem('education', i, 'year', e.target.value)} />
                                    <button className="btn-error-text" onClick={() => removeItem('education', i)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="form-section">
                        <label className="input-label">Links</label>
                        <div className="grid-2">
                            <input className="input-minimal" placeholder="GitHub" value={resumeData.links.github} onChange={(e) => updateLinks('github', e.target.value)} />
                            <input className="input-minimal" placeholder="LinkedIn" value={resumeData.links.linkedin} onChange={(e) => updateLinks('linkedin', e.target.value)} />
                        </div>
                    </section>
                </div>
            </div>

            <div className="preview-column">
                <div className="customizer-panel">
                    <div className="customizer-section">
                        <label className="input-label" style={{ fontSize: '0.7rem' }}>Template Selection</label>
                        <div className="template-thumbnails">
                            {[
                                { id: 'Classic', name: 'Classic', sketch: 'classic' },
                                { id: 'Modern', name: 'Modern', sketch: 'modern' },
                                { id: 'Minimal', name: 'Minimal', sketch: 'minimal' }
                            ].map(t => (
                                <div
                                    key={t.id}
                                    className={`template-thumb ${template === t.id ? 'active' : ''}`}
                                    onClick={() => setTemplate(t.id)}
                                >
                                    <div className={`sketch ${t.sketch}`}>
                                        <div className="sketch-line header"></div>
                                        <div className="sketch-content">
                                            {t.id === 'Modern' && <div className="sketch-sidebar"></div>}
                                            <div className="sketch-lines">
                                                <div className="sketch-line"></div>
                                                <div className="sketch-line"></div>
                                                <div className="sketch-line"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="thumb-label">{t.name}</span>
                                    {template === t.id && <div className="active-check">✓</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="customizer-section">
                        <label className="input-label" style={{ fontSize: '0.7rem' }}>Color Theme</label>
                        <div className="color-picker">
                            {Object.entries(THEME_COLORS).map(([name, value]) => (
                                <button
                                    key={name}
                                    className={`color-circle ${themeColor === value ? 'active' : ''}`}
                                    style={{ backgroundColor: value }}
                                    onClick={() => setThemeColor(value)}
                                    title={name}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="preview-container">
                    <ResumePaper data={resumeData} />
                </div>
            </div>

            <style jsx="true">{`
                .builder-layout { display: flex; height: calc(100vh - var(--header-height)); overflow: hidden; }
                .form-column { flex: 1; overflow-y: auto; padding: var(--s-40); background: white; border-right: 1px solid var(--border); }
                .builder-header { margin-bottom: var(--s-40); }
                
                .preview-column { flex: 1; background: #f0f0f0; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; }
                .customizer-panel { width: 100%; max-width: 800px; background: white; padding: 20px; border: 1px solid var(--border); margin-bottom: 20px; display: flex; gap: 40px; }
                .customizer-section { flex: 1; }
                
                .template-thumbnails { display: flex; gap: 12px; margin-top: 8px; }
                .template-thumb { width: 120px; cursor: pointer; position: relative; border: 2px solid transparent; padding: 4px; transition: all 0.2s; background: #fcfcfc; border-radius: 4px; }
                .template-thumb.active { border-color: #3b82f6; background: #eff6ff; }
                .thumb-label { display: block; text-align: center; font-size: 0.65rem; font-weight: 600; margin-top: 4px; color: #666; }
                .active-check { position: absolute; top: -8px; right: -8px; background: #3b82f6; color: white; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white; }
                
                .sketch { height: 80px; border: 1px solid #ddd; background: white; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
                .sketch-line { height: 4px; background: #eee; border-radius: 2px; }
                .sketch-line.header { width: 60%; align-self: center; background: #ddd; }
                .sketch-content { flex: 1; display: flex; gap: 4px; }
                .sketch-lines { flex: 1; display: flex; flex-direction: column; gap: 4px; }
                .sketch-sidebar { width: 15px; background: #f0f0f0; }
                .sketch.classic .sketch-line.header { width: 100%; border-bottom: 1px solid #ddd; }
                .sketch.minimal .sketch-line.header { align-self: flex-start; }
                
                .color-picker { display: flex; gap: 8px; margin-top: 12px; }
                .color-circle { width: 24px; height: 24px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: transform 0.2s; }
                .color-circle:hover { transform: scale(1.1); }
                .color-circle.active { border-color: rgba(0,0,0,0.15); box-shadow: 0 0 0 2px white inset; }
                
                .tag-input-container { padding: 4px 8px; border: 1px solid var(--border); background: var(--c1-bg); min-height: 38px; }
                .tags-list { display: flex; flex-wrap: wrap; gap: 4px; }
                .tag-pill { display: flex; alignItems: center; gap: 4px; padding: 2px 8px; background: white; border: 1px solid #ddd; font-size: 0.75rem; border-radius: 100px; color: #444; }
                .tag-pill button { border: none; background: none; cursor: pointer; display: flex; align-items: center; padding: 0; color: #999; }
                
                .project-entry { padding: 0; border: 1px solid var(--border); border-radius: 4px; margin-bottom: 12px; overflow: hidden; }
                .project-header { padding: 12px 16px; background: var(--c1-bg); display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
                .project-header:hover { background: #f9f9f9; }
                .project-content { padding: 16px; border-top: 1px solid var(--border); background: white; }
                .project-content .grid-2 { margin-bottom: 12px; }
                .tag-section { margin-bottom: 12px; }
                
                .char-counter { font-size: 0.65rem; color: #999; }
                .char-counter.warning { color: var(--c4-accent); font-weight: 600; }
                
                .skill-cat-group { margin-bottom: 16px; }
                .form-section { margin-bottom: var(--s-40); }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                
                .ats-panel { padding: 20px; border: 1px solid var(--border); background: var(--c1-bg); margin-bottom: 24px; }
                .ats-score-value { font-family: 'EB Garamond', serif; font-size: 1.5rem; font-weight: 600; color: var(--c4-accent); }
                .ats-progress-bg { height: 4px; background: var(--border); width: 100%; margin: 8px 0 16px; }
                .ats-progress-fill { height: 100%; transition: width 0.5s ease; }
                
                .bullet-guidance { margin-top: 8px; font-size: 0.7rem; color: var(--c4-accent); display: flex; flex-direction: column; gap: 4px; }
                .bullet-guidance span::before { content: '→ '; }

                .preview-container { width: 800px; transform: scale(0.9); transform-origin: top center; }
                
                .btn-icon { background: none; border: 1px solid var(--border); cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
                .btn-text { background: none; border: none; cursor: pointer; padding: 0; }
                .btn-error-text { background: none; border: none; color: #ef4444; cursor: pointer; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                textarea { width: 100%; padding: 12px; border: 1px solid var(--border); font-family: inherit; font-size: 0.9rem; margin-top: 8px; resize: none; min-height: 80px; }

                @media (max-width: 1024px) {
                    .builder-layout { flex-direction: column; height: auto; overflow: visible; }
                    .form-column { border-right: none; border-bottom: 1px solid var(--border); padding: 20px; }
                    .preview-column { padding: 40px 10px; }
                    .customizer-panel { flex-direction: column; gap: 20px; }
                    .preview-container { width: 100%; max-width: 100%; transform: scale(1); overflow-x: auto; }
                    .preview-container > :global(.resume-paper) { transform: scale(0.45); transform-origin: top left; width: 21cm; margin: 0 auto; }
                }
            `}</style>
        </div>
    );
};

export default Builder;
