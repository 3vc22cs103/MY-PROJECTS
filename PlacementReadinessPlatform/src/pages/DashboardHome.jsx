import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { PlayCircle, CheckCircle2, Circle, Plus, FileText, ArrowRight, Download, Copy, RefreshCw, Check, X, ShieldAlert, Building, Users, Target, Briefcase } from 'lucide-react';
import { useJobAnalysis } from '../hooks/useJobAnalysis';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
    const { latestAnalysis, updateAnalysis } = useJobAnalysis();
    const navigate = useNavigate();

    // Safe Destructuring with defaults for Hooks
    const {
        id,
        baseScore,
        finalScore,
        readinessScore,
        baseReadinessScore,
        extractedSkills = {},
        checklist = {},
        plan7Days = [], /* Standardized field name */
        plan = [], /* Legacy fallback */
        questions = [],
        company,
        role,
        skillConfidenceMap = {},
        createdAt,
        companyIntel,
        roundMapping
    } = latestAnalysis || {};

    // Standardize variables with fallbacks
    const effectiveBaseScore = baseScore || baseReadinessScore || readinessScore || 0;
    const effectiveFinalScore = finalScore !== undefined ? finalScore : (readinessScore || 0);
    const effectivePlan = (plan7Days && plan7Days.length > 0) ? plan7Days : plan;

    // Flatten skills used in useMemo
    const allSkills = useMemo(() => {
        const skills = [];
        if (extractedSkills) {
            Object.entries(extractedSkills).forEach(([cat, list]) => {
                list.forEach(skill => skills.push({ category: cat, name: skill }));
            });
        }
        return skills;
    }, [extractedSkills]);

    // Calculate Live Score
    const currentReadinessScore = useMemo(() => {
        if (!latestAnalysis) return 0;

        let adjustment = 0;
        allSkills.forEach(skill => {
            const status = skillConfidenceMap[skill.name] || 'practice';
            if (status === 'know') adjustment += 2;
            if (status === 'practice') adjustment -= 2;
        });

        let score = baseScore + adjustment;
        return Math.max(0, Math.min(100, score));
    }, [allSkills, skillConfidenceMap, baseScore, latestAnalysis]);

    // Effects
    useEffect(() => {
        if (latestAnalysis && !latestAnalysis.baseReadinessScore) {
            updateAnalysis(id, { baseReadinessScore: readinessScore });
        }
    }, [id, latestAnalysis, readinessScore, updateAnalysis]);

    useEffect(() => {
        if (latestAnalysis && currentReadinessScore !== readinessScore) {
            updateAnalysis(id, { readinessScore: currentReadinessScore });
        }
    }, [currentReadinessScore, id, updateAnalysis, latestAnalysis, readinessScore]);

    // -- Early Return AFTER Hooks --
    if (!latestAnalysis) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="text-primary w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Start Your Analysis</h1>
                <p className="text-lg text-gray-500 max-w-lg mx-auto">
                    Paste a job description to get a personalized preparation plan, skill breakdown, and mock interview questions.
                </p>
                <button
                    onClick={() => navigate('/dashboard/analyze')}
                    className="px-8 py-3 bg-primary text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 flex items-center gap-2"
                >
                    <Plus size={20} /> Analyze New Job
                </button>
            </div>
        );
    }

    const toggleSkill = (skillName) => {
        const currentStatus = skillConfidenceMap[skillName] || 'practice';
        const newStatus = currentStatus === 'know' ? 'practice' : 'know';

        const newMap = { ...skillConfidenceMap, [skillName]: newStatus };
        updateAnalysis(id, { skillConfidenceMap: newMap });
    };

    // Export Functions
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const generateTxtExport = () => {
        const content = `
PLACEMENT PREPARATION PLAN
Role: ${role} at ${company}
Date: ${new Date(createdAt).toLocaleDateString()}
Readiness Score: ${currentReadinessScore}/100

--- SKILLS ASSESSMENT ---
${allSkills.map(s => `[${skillConfidenceMap[s.name] === 'know' ? 'x' : ' '}] ${s.name} (${s.category})`).join('\n')}

--- 7-DAY PLAN ---
${effectivePlan.map(d => `${d.day}: ${d.focus}`).join('\n')}

--- ROUND CHECKLIST ---
${Object.entries(checklist).map(([r, items]) => `${r}:\n${items.map(i => `  - ${i}`).join('\n')}`).join('\n\n')}

--- INTERVIEW QUESTIONS ---
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
      `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Plan_${company}_${role}.txt`;
        a.click();
    };

    // Radar Data Logic
    const radarData = Object.keys(extractedSkills).map(cat => ({
        subject: cat,
        A: extractedSkills[cat].length * 20 > 100 ? 100 : extractedSkills[cat].length * 20,
        fullMark: 100
    })).filter(d => d.subject !== 'General');

    // Custom SVG Circle Logic
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (currentReadinessScore / 100) * circumference;

    // Weak Skills for Action Box (First 3 'practice' skills)
    const weakSkills = allSkills
        .filter(s => (skillConfidenceMap[s.name] || 'practice') === 'practice')
        .slice(0, 3);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {role || "Analysis Results"} <span className="text-gray-400 font-medium">at {company || "Unknown Company"}</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Generated on {new Date(latestAnalysis.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={generateTxtExport}
                        className="px-3 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                    >
                        <Download size={16} /> Export Plan
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/analyze')}
                        className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm"
                    >
                        <Plus size={16} /> New Analysis
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Overall Readiness (Takes 1 col) */}
                <Card className="col-span-1 flex flex-col items-center justify-center py-8">
                    <div className="relative flex items-center justify-center">
                        <svg
                            height={radius * 2}
                            width={radius * 2}
                            className="transform -rotate-90 origin-center"
                        >
                            <circle
                                stroke="#e5e7eb"
                                strokeWidth={stroke}
                                fill="transparent"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                            />
                            <circle
                                stroke={currentReadinessScore >= 70 ? "hsl(142, 76%, 36%)" : (currentReadinessScore >= 40 ? "hsl(32, 95%, 44%)" : "hsl(0, 84%, 60%)")}
                                strokeWidth={stroke}
                                strokeDasharray={circumference + ' ' + circumference}
                                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                                strokeLinecap="round"
                                fill="transparent"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-bold text-gray-900">{Math.round(currentReadinessScore)}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">/ 100</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center px-4">
                        <h3 className="text-lg font-semibold text-gray-700">Live Readiness</h3>
                        <p className="text-sm text-gray-500">
                            Adjusts as you mark skills as 'Known'. <br />
                            <span className="text-xs text-indigo-500 font-medium">Base: {Math.round(effectiveBaseScore)}</span>
                        </p>
                    </div>
                </Card>

                {/* 2. Skills Interaction (Takes 2 cols) */}
                <Card className="col-span-1 md:col-span-2 min-h-[320px]">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Skill Gap Analysis</CardTitle>
                            <CardDescription>Click tags to update your readiness score</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="h-full">
                        {Object.entries(extractedSkills).map(([category, skills]) => skills.length > 0 && (
                            <div key={category} className="mb-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => {
                                        const status = skillConfidenceMap[skill] || 'practice';
                                        const isKnow = status === 'know';
                                        return (
                                            <button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2 transition-all ${isKnow
                                                    ? 'bg-green-50 border-green-200 text-green-700'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {isKnow ? <Check size={14} /> : <Circle size={14} />}
                                                {skill}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 3. Action Next (Full Width) */}
                <Card className="col-span-1 md:col-span-3 bg-indigo-50 border-indigo-100">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-full text-indigo-600 shadow-sm mt-1">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Recommended Next Step</h3>
                                {weakSkills.length > 0 ? (
                                    <p className="text-gray-600">
                                        Focus on <strong>{weakSkills.map(s => s.name).join(', ')}</strong>.
                                        These are critical gaps in your profile.
                                    </p>
                                ) : (
                                    <p className="text-gray-600">You look well prepared! Start reviewing behaviorals.</p>
                                )}
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
                            Start Day 1 Plan Now
                        </button>
                    </CardContent>
                </Card>

                {/* Company Intel & Round Mapping */}
                {(latestAnalysis.companyIntel || latestAnalysis.roundMapping) && (
                    <>
                        {/* Company Intel */}
                        <Card className="col-span-1 md:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="text-primary" size={20} />
                                    Company Intel
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {latestAnalysis.companyIntel ? (
                                    <>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Predicted Type</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wide ${latestAnalysis.companyIntel.type === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {latestAnalysis.companyIntel.type}
                                                </span>
                                                <span className="text-xs text-gray-400">• {latestAnalysis.companyIntel.industry}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Hiring Focus</h4>
                                            <p className="text-sm text-gray-700 mt-1">{latestAnalysis.companyIntel.focus}</p>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-[10px] text-gray-400 italic">
                                                * Demo Mode: Intel generated heuristically based on company name/type.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400">No company details analyzed.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Round Mapping */}
                        <Card className="col-span-1 md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="text-primary" size={20} />
                                    Projected Interview Flow
                                </CardTitle>
                                <CardDescription>Typical rounds for this role & company size</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {latestAnalysis.roundMapping ? (
                                    <div className="space-y-6 relative pl-2">
                                        {/* Vertical Line */}
                                        <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-200"></div>

                                        {latestAnalysis.roundMapping.map((round, idx) => (
                                            <div key={idx} className="relative flex items-start gap-4">
                                                <div className="min-w-[40px] h-10 flex items-center justify-center bg-white z-10">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <h4 className="font-semibold text-gray-900 text-sm">{round.name}</h4>
                                                    <p className="text-sm text-gray-600">{round.desc}</p>
                                                    <div className="mt-1 flex items-start gap-1 p-2 bg-gray-50 rounded text-xs text-gray-500 border border-gray-100">
                                                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider min-w-fit mt-0.5">Why:</span>
                                                        <span>{round.why}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No round mapping available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* 4. Plan & Checklist (Exportable) */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>7-Day Plan</CardTitle>
                            <button onClick={() => copyToClipboard(effectivePlan.map(d => `${d.day}: ${d.focus}`).join('\n'))} title="Copy Plan">
                                <Copy size={16} className="text-gray-400 hover:text-gray-600" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {effectivePlan.map((day, idx) => (
                                    <div key={idx} className="flex gap-4 p-3 rounded bg-gray-50 border border-gray-100">
                                        <div className="font-bold text-xs text-primary bg-white px-2 py-1 rounded border h-fit whitespace-nowrap">
                                            {day.day}
                                        </div>
                                        <p className="text-sm text-gray-700">{day.focus}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Checklist</CardTitle>
                            <button onClick={() => copyToClipboard(JSON.stringify(checklist, null, 2))} title="Copy Checklist">
                                <Copy size={16} className="text-gray-400 hover:text-gray-600" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {Object.entries(checklist).map(([round, items], idx) => (
                                    <div key={idx}>
                                        <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-2 bg-gray-100 p-1 pl-2 rounded">{round}</h4>
                                        <ul className="space-y-2">
                                            {items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <div className="mt-0.5"><Circle size={12} className="text-gray-300" /></div>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 5. Questions */}
                <Card className="col-span-1 md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Interview Questions</CardTitle>
                            <CardDescription>Tailored to your skill stack</CardDescription>
                        </div>
                        <button onClick={() => copyToClipboard(questions.join('\n'))} title="Copy Questions">
                            <Copy size={16} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {questions.map((q, idx) => (
                                <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                                    <span className="text-primary font-bold text-sm min-w-[20px]">{idx + 1}.</span>
                                    <p className="text-gray-700 text-sm font-medium">{q}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
