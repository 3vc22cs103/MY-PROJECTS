import React from 'react';
import { useResume } from './ResumeContext';
import { Globe, Github } from 'lucide-react';

const ResumePaper = ({ data, minimal = false }) => {
    const { template, themeColor } = useResume();
    if (!data) return null;

    // Helpers to check for content
    const hasPersonalInfo = data.personalInfo.name || data.personalInfo.email || data.personalInfo.phone || data.personalInfo.location;
    const hasLinks = data.links.github || data.links.linkedin;
    const hasSummary = data.summary && data.summary.trim().length > 0;
    const hasExperience = data.experience && data.experience.some(exp => exp.company || exp.position);
    const hasEducation = data.education && data.education.some(edu => edu.school || edu.degree);
    const hasProjects = data.projects && data.projects.some(proj => proj.name || proj.description);
    const hasSkills = Object.values(data.skills).some(cat => cat.length > 0);

    const ModernSidebar = () => (
        <aside className="modern-sidebar" style={{ backgroundColor: themeColor }}>
            <div className="sidebar-section">
                <h4 className="sidebar-title">Contact</h4>
                {data.personalInfo.email && <div className="contact-item">{data.personalInfo.email}</div>}
                {data.personalInfo.phone && <div className="contact-item">{data.personalInfo.phone}</div>}
                {data.personalInfo.location && <div className="contact-item">{data.personalInfo.location}</div>}
            </div>

            {hasLinks && (
                <div className="sidebar-section">
                    <h4 className="sidebar-title">Links</h4>
                    {data.links.github && <div className="contact-item">{data.links.github}</div>}
                    {data.links.linkedin && <div className="contact-item">{data.links.linkedin}</div>}
                </div>
            )}

            {hasSkills && (
                <div className="sidebar-section">
                    <h4 className="sidebar-title">Skills</h4>
                    {Object.entries(data.skills).map(([cat, list]) => (
                        list.length > 0 && (
                            <div key={cat} className="sidebar-skill-cat">
                                <div className="skill-cat-label">{cat}</div>
                                <div className="skill-list">{list.join(', ')}</div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </aside>
    );

    const renderContent = () => {
        const sections = [
            hasSummary && (
                <section key="summary" className="resume-section">
                    <h3 className="section-title" style={{ color: template !== 'Modern' ? themeColor : 'inherit' }}>Summary</h3>
                    <p className="summary-text">{data.summary}</p>
                </section>
            ),
            hasExperience && (
                <section key="exp" className="resume-section">
                    <h3 className="section-title" style={{ color: template !== 'Modern' ? themeColor : 'inherit' }}>Experience</h3>
                    {data.experience.map((exp, i) => (
                        (exp.company || exp.position) && (
                            <div key={i} className="resume-item">
                                <div className="item-header">
                                    <strong className="item-name">{exp.company}</strong>
                                    <span className="item-meta">{exp.period}</span>
                                </div>
                                <div className="item-subheader">{exp.position}</div>
                                <p className="item-description">{exp.description}</p>
                            </div>
                        )
                    ))}
                </section>
            ),
            hasProjects && (
                <section key="projects" className="resume-section">
                    <h3 className="section-title" style={{ color: template !== 'Modern' ? themeColor : 'inherit' }}>Projects</h3>
                    {data.projects.map((proj, i) => (
                        (proj.name || proj.description) && (
                            <div key={i} className="resume-item project-card">
                                <div className="item-header">
                                    <strong className="item-name">{proj.name}</strong>
                                    <div className="project-links">
                                        {proj.githubUrl && <a href={`https://${proj.githubUrl}`} target="_blank" rel="noreferrer"><Github size={12} /></a>}
                                        {proj.liveUrl && <a href={`https://${proj.liveUrl}`} target="_blank" rel="noreferrer"><Globe size={12} /></a>}
                                    </div>
                                </div>
                                <p className="item-description">{proj.description}</p>
                                <div className="tech-stack">
                                    {proj.techStack?.map((tech, ti) => (
                                        <span key={ti} className="tech-pill">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </section>
            ),
            template !== 'Modern' && hasSkills && (
                <section key="skills" className="resume-section">
                    <h3 className="section-title" style={{ color: themeColor }}>Skills</h3>
                    <div className="skills-container">
                        {Object.entries(data.skills).map(([cat, list]) => (
                            list.length > 0 && (
                                <div key={cat} className="skill-group">
                                    <span className="skill-label">{cat}: </span>
                                    <span className="skill-badge">{list.join(', ')}</span>
                                </div>
                            )
                        ))}
                    </div>
                </section>
            ),
            hasEducation && (
                <section key="edu" className="resume-section">
                    <h3 className="section-title" style={{ color: template !== 'Modern' ? themeColor : 'inherit' }}>Education</h3>
                    {data.education.map((edu, i) => (
                        (edu.school || edu.degree) && (
                            <div key={i} className="resume-item">
                                <div className="item-header">
                                    <strong className="item-name">{edu.school}</strong>
                                    <span className="item-meta">{edu.year}</span>
                                </div>
                                <div className="item-subheader">{edu.degree}</div>
                            </div>
                        )
                    ))}
                </section>
            )
        ];
        return sections;
    };

    return (
        <div className={`resume-paper template-${template.toLowerCase()} ${minimal ? 'is-preview' : ''}`}>
            {template === 'Modern' ? (
                <div className="modern-layout">
                    <ModernSidebar />
                    <main className="modern-main">
                        <header className="modern-header">
                            <h1 style={{ color: themeColor }}>{data.personalInfo.name || 'Your Name'}</h1>
                            <div className="title-divider" style={{ backgroundColor: themeColor }}></div>
                        </header>
                        {renderContent()}
                    </main>
                </div>
            ) : (
                <div className="standard-layout">
                    <header className="resume-header">
                        <h1 style={{ color: themeColor }}>{data.personalInfo.name || 'Your Name'}</h1>
                        {template === 'Classic' && (
                            <div className="contact-strip">
                                {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ')}
                            </div>
                        )}
                        {template === 'Minimal' && (
                            <div className="contact-strip" style={{ opacity: 0.6 }}>
                                {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' · ')}
                            </div>
                        )}
                    </header>
                    {renderContent()}
                </div>
            )}

            <style jsx="true">{`
        .resume-paper {
          background: white;
          color: black;
          padding: 0;
          min-height: 29.7cm;
          width: 21cm;
          border: 1px solid #eee;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Typography Templates */
        .template-classic { font-family: 'EB Garamond', serif; }
        .template-minimal { font-family: 'Outfit', 'Inter', sans-serif; font-weight: 300; }
        .template-modern { font-family: 'Inter', sans-serif; }

        /* Modern Layout */
        .modern-layout { display: flex; min-height: 29.7cm; }
        .modern-sidebar { width: 30%; color: white; padding: 40px 20px; word-break: break-word; }
        .modern-main { flex: 1; padding: 40px; background: white; }
        .modern-header h1 { font-size: 2.5rem; margin-bottom: 8px; font-weight: 800; text-transform: uppercase; line-height: 1; }
        .title-divider { height: 6px; width: 60px; margin-bottom: 30px; }
        .sidebar-section { margin-bottom: 30px; }
        .sidebar-title { text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px; }
        .contact-item { font-size: 0.8rem; margin-bottom: 8px; opacity: 0.9; }
        .sidebar-skill-cat { margin-bottom: 12px; }
        .skill-cat-label { font-size: 0.65rem; text-transform: uppercase; font-weight: 700; opacity: 0.7; margin-bottom: 2px; }
        .skill-list { font-size: 0.8rem; line-height: 1.4; }

        /* Standard (Classic/Minimal) Layout */
        .standard-layout { padding: 40px; }
        .template-classic .resume-header { text-align: center; border-bottom: 2px solid ${themeColor}; padding-bottom: 16px; margin-bottom: 32px; }
        .template-classic h1 { font-size: 2.8rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
        .template-classic .section-title { border-bottom: 1px solid ${themeColor}44; padding-bottom: 4px; border-left: none; padding-left: 0; }
        
        .template-minimal .resume-header { margin-bottom: 50px; }
        .template-minimal h1 { font-size: 3.5rem; font-weight: 200; margin-bottom: 0; }
        .template-minimal .section-title { border: none; font-weight: 300; opacity: 0.5; font-size: 1.5rem; margin-top: 40px; }

        /* Common Elements */
        .resume-section { margin-bottom: 24px; }
        .section-title { font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .resume-item { margin-bottom: 12px; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; }
        .item-name { font-size: 1rem; font-weight: 700; }
        .item-meta { font-size: 0.85rem; color: #666; }
        .item-subheader { font-size: 0.9rem; font-style: italic; color: #444; margin-bottom: 2px; }
        .item-description { font-size: 0.85rem; color: #333; margin: 4px 0; line-height: 1.4; }
        
        .tech-stack { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
        .tech-pill { font-size: 0.65rem; padding: 2px 6px; background: #f5f5f5; color: #555; border-radius: 2px; border: 1px solid #eee; }
        
        .contact-strip { font-size: 0.85rem; }

        @media print {
            .resume-paper { border: none; box-shadow: none; }
            .modern-sidebar { background-color: ${themeColor} !important; border-left: none; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
        </div>
    );
};

export default ResumePaper;
