import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ResumeContext = createContext();

const STORAGE_KEY = 'resumeBuilderData';
const TEMPLATE_KEY = 'resumeTemplate';
const COLOR_KEY = 'resumeThemeColor';
const SUBMISSION_KEY = 'rb_final_submission';
const CHECKLIST_KEY = 'rb_checklist';

const THEME_COLORS = {
    teal: 'hsl(168, 60%, 40%)',
    navy: 'hsl(220, 60%, 35%)',
    burgundy: 'hsl(345, 60%, 35%)',
    forest: 'hsl(150, 50%, 30%)',
    charcoal: 'hsl(0, 0%, 25%)'
};

const initialData = {
    personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
    },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: {
        technical: [],
        soft: [],
        tools: []
    },
    links: {
        github: '',
        linkedin: '',
    },
};

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated'];

const SUGGESTED_SKILLS = {
    technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
    soft: ["Team Leadership", "Problem Solving"],
    tools: ["Git", "Docker", "AWS"]
};

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const data = saved ? JSON.parse(saved) : initialData;
        // Migrate skills if it's the old string format
        if (typeof data.skills === 'string') {
            data.skills = { technical: data.skills.split(',').map(s => s.trim()).filter(Boolean), soft: [], tools: [] };
        }
        return data;
    });

    const [template, setTemplate] = useState(() => {
        return localStorage.getItem(TEMPLATE_KEY) || 'Classic';
    });

    const [themeColor, setThemeColor] = useState(() => {
        return localStorage.getItem(COLOR_KEY) || THEME_COLORS.teal;
    });

    const [submission, setSubmission] = useState(() => {
        const saved = localStorage.getItem(SUBMISSION_KEY);
        return saved ? JSON.parse(saved) : { lovable: '', github: '', deploy: '' };
    });

    const [checklist, setChecklist] = useState(() => {
        const saved = localStorage.getItem(CHECKLIST_KEY);
        return saved ? JSON.parse(saved) : Array(10).fill(false);
    });

    // Autosave whenever resumeData changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    }, [resumeData]);

    // Persist choices
    useEffect(() => {
        localStorage.setItem(TEMPLATE_KEY, template);
    }, [template]);

    useEffect(() => {
        localStorage.setItem(COLOR_KEY, themeColor);
    }, [themeColor]);

    useEffect(() => {
        localStorage.setItem(SUBMISSION_KEY, JSON.stringify(submission));
    }, [submission]);

    useEffect(() => {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
    }, [checklist]);

    const updatePersonalInfo = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const updateSummary = (value) => {
        setResumeData(prev => ({ ...prev, summary: value }));
    };

    const addItem = (section) => {
        const newItem = section === 'projects' ? {
            name: '',
            description: '',
            techStack: [],
            liveUrl: '',
            githubUrl: '',
        } : { description: '', company: '', position: '', period: '', school: '', degree: '', year: '', location: '' };

        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    const updateItem = (section, index, field, value) => {
        setResumeData(prev => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [section]: newList };
        });
    };

    const removeItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    // Skill Chip Helpers
    const addSkillTag = (category, tag) => {
        setResumeData(prev => {
            const current = prev.skills[category] || [];
            if (current.includes(tag)) return prev;
            return {
                ...prev,
                skills: { ...prev.skills, [category]: [...current, tag] }
            };
        });
    };

    const removeSkillTag = (category, tag) => {
        setResumeData(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: prev.skills[category].filter(t => t !== tag) }
        }));
    };

    const suggestSkills = () => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                technical: Array.from(new Set([...prev.skills.technical, ...SUGGESTED_SKILLS.technical])),
                soft: Array.from(new Set([...prev.skills.soft, ...SUGGESTED_SKILLS.soft])),
                tools: Array.from(new Set([...prev.skills.tools, ...SUGGESTED_SKILLS.tools]))
            }
        }));
    };

    // Project Tag Helpers
    const addProjectTag = (index, tag) => {
        setResumeData(prev => {
            const newList = [...prev.projects];
            const project = newList[index];
            if (project.techStack.includes(tag)) return prev;
            newList[index] = { ...project, techStack: [...project.techStack, tag] };
            return { ...prev, projects: newList };
        });
    };

    const removeProjectTag = (index, tag) => {
        setResumeData(prev => {
            const newList = [...prev.projects];
            newList[index] = { ...newList[index], techStack: newList[index].techStack.filter(t => t !== tag) };
            return { ...prev, projects: newList };
        });
    };

    const updateLinks = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            links: { ...prev.links, [field]: value }
        }));
    };

    const loadSample = () => {
        const sampleData = {
            personalInfo: {
                name: 'Alexander Sterling',
                email: 'alex.sterling@example.com',
                phone: '+1 555-0123',
                location: 'San Francisco, CA',
            },
            summary: 'Product-focused Software Engineer with 5+ years of experience building scalable web applications. Passionate about minimalist design and high-performance frontend systems. Successfully reduced load times by 40% and improved user engagement across multiple high-traffic platforms.',
            education: [
                { school: 'Stanford University', degree: 'B.S. Computer Science', year: '2015 - 2019', location: 'Stanford, CA' }
            ],
            experience: [
                { company: 'Linear', position: 'Senior Frontend Engineer', period: '2021 - Present', description: 'Developed a performance-first issue tracking interface using React and Rust. Optimized 20+ core components.' },
                { company: 'Stripe', position: 'Software Engineer', period: '2019 - 2021', description: 'Implemented core dashboard components and internationalization framework. Integrated 500k+ merchant workflows.' }
            ],
            projects: [
                { name: 'Zenith Browser', githubUrl: 'github.com/alex/zenith', techStack: ['Rust', 'WebKit', 'C++'], description: 'Built a lightweight, privacy-focused browser built with Rust and WebKit. Gained 10k stars on GitHub.' }
            ],
            skills: {
                technical: ['React', 'TypeScript', 'Node.js', 'Rust', 'GraphQL'],
                soft: ['Team Leadership', 'Mentoring'],
                tools: ['Git', 'Docker', 'AWS']
            },
            links: {
                github: 'github.com/alexsterling',
                linkedin: 'linkedin.com/in/alexsterling',
            },
        };
        setResumeData(sampleData);
    };

    // Bullet Analysis Helper
    const analyzeBullet = (text) => {
        if (!text) return { hasVerb: false, hasNumeric: false };
        const firstWord = text.trim().split(/\s+/)[0];
        const hasVerb = ACTION_VERBS.some(v => v.toLowerCase() === firstWord?.replace(/[^a-zA-Z]/g, '').toLowerCase());
        const hasNumeric = /[\d]+[%k\+x]|\d+/.test(text);
        return { hasVerb, hasNumeric };
    };

    // ATS Scoring Logic (Deterministic 0-100)
    const atsAnalysis = useMemo(() => {
        let score = 0;
        let messages = [];

        const d = resumeData;

        // 1. Personal Info
        if (d.personalInfo.name.trim()) score += 10;
        else messages.push({ text: "Add your full name (+10 points)", points: 10 });

        if (d.personalInfo.email.trim()) score += 10;
        else messages.push({ text: "Add your email address (+10 points)", points: 10 });

        if (d.personalInfo.phone.trim()) score += 5;
        else messages.push({ text: "Add your phone number (+5 points)", points: 5 });

        // 2. Summary
        const summaryLen = d.summary.trim().length;
        if (summaryLen > 50) score += 10;
        else messages.push({ text: "Add a professional summary (>50 chars) (+10 points)", points: 10 });

        const summaryWords = d.summary.toLowerCase().split(/\s+/);
        const hasActionVerb = ACTION_VERBS.some(v => summaryWords.includes(v.toLowerCase()));
        if (hasActionVerb) score += 10;
        else if (summaryLen > 0) messages.push({ text: "Use action verbs in your summary (Led, Built, etc.) (+10 points)", points: 10 });

        // 3. Experience
        if (d.experience.length >= 1 && d.experience.some(exp => exp.description?.trim().length > 10)) score += 15;
        else messages.push({ text: "Add at least one experience entry with details (+15 points)", points: 15 });

        // 4. Education
        if (d.education.length >= 1) score += 10;
        else messages.push({ text: "Add your education details (+10 points)", points: 10 });

        // 5. Skills
        const totalSkills = Object.values(d.skills).flat().length;
        if (totalSkills >= 5) score += 10;
        else messages.push({ text: "Add at least 5 skills (+10 points)", points: 10 });

        // 6. Projects
        if (d.projects.length >= 1) score += 10;
        else messages.push({ text: "Add at least one project (+10 points)", points: 10 });

        // 7. Links
        if (d.links.linkedin.trim()) score += 5;
        else messages.push({ text: "Add your LinkedIn profile (+5 points)", points: 5 });

        if (d.links.github.trim()) score += 5;
        else messages.push({ text: "Add your GitHub profile (+5 points)", points: 5 });

        return {
            score: Math.min(100, score),
            suggestions: messages.sort((a, b) => b.points - a.points).map(m => m.text).slice(0, 4)
        };
    }, [resumeData]);

    const validateResume = () => {
        const missing = [];
        if (!resumeData.personalInfo.name.trim()) missing.push('Name');
        if (resumeData.experience.length === 0 && resumeData.projects.length === 0) {
            missing.push('Work or Project history');
        }
        return {
            isValid: missing.length === 0,
            missingFields: missing
        };
    };

    const getPlainText = () => {
        const d = resumeData;
        let text = `${d.personalInfo.name}\n`;
        text += `${d.personalInfo.email} | ${d.personalInfo.phone} | ${d.personalInfo.location}\n`;

        if (d.links.github || d.links.linkedin) {
            text += `${[d.links.github, d.links.linkedin].filter(Boolean).join(' | ')}\n`;
        }

        text += `\nSUMMARY\n${d.summary}\n`;

        if (d.experience.length > 0) {
            text += `\nEXPERIENCE\n`;
            d.experience.forEach(exp => {
                text += `${exp.company} - ${exp.position} (${exp.period})\n${exp.description}\n\n`;
            });
        }

        if (d.projects.length > 0) {
            text += `\nPROJECTS\n`;
            d.projects.forEach(proj => {
                text += `${proj.name}${proj.liveUrl ? ' (' + proj.liveUrl + ')' : ''}\n${proj.techStack.join(', ')}\n${proj.description}\n\n`;
            });
        }

        if (d.education.length > 0) {
            text += `\nEDUCATION\n`;
            d.education.forEach(edu => {
                text += `${edu.school} - ${edu.degree} (${edu.year})\n`;
            });
        }

        const allSkills = [...d.skills.technical, ...d.skills.soft, ...d.skills.tools];
        if (allSkills.length > 0) {
            text += `\nSKILLS\n${allSkills.join(', ')}\n`;
        }

        return text;
    };

    return (
        <ResumeContext.Provider value={{
            resumeData,
            template,
            setTemplate,
            themeColor,
            setThemeColor,
            THEME_COLORS,
            submission,
            setSubmission,
            checklist,
            setChecklist,
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
            analyzeBullet,
            validateResume,
            getPlainText
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => useContext(ResumeContext);
