import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ExternalLink, Copy, Award, Rocket, AlertCircle } from 'lucide-react';

const ProofPage = () => {
    // --- State ---
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deployed: ''
    });
    const [linkErrors, setLinkErrors] = useState({});
    const [checklistComplete, setChecklistComplete] = useState(false);
    const [isShipped, setIsShipped] = useState(false);

    // --- Constants ---
    const STEPS = [
        { id: 1, label: 'Project Setup & Config', status: 'Completed' },
        { id: 2, label: 'Analyzer Engine Core', status: 'Completed' },
        { id: 3, label: 'Dashboard UI & Layout', status: 'Completed' },
        { id: 4, label: 'Persistence & History', status: 'Completed' },
        { id: 5, label: 'Company Intel Engine', status: 'Completed' },
        { id: 6, label: 'Round Mapping Logic', status: 'Completed' },
        { id: 7, label: 'Testing & Verification', status: checklistComplete ? 'Completed' : 'Pending' },
        { id: 8, label: 'Final Proof & Artifacts', status: isShipped ? 'Completed' : 'Pending' }
    ];

    // --- Effects ---
    useEffect(() => {
        // 1. Load Checklist Status
        const checklist = JSON.parse(localStorage.getItem('prp_test_checklist') || '{}');
        const passedCount = Object.values(checklist).filter(Boolean).length;
        setChecklistComplete(passedCount === 10);

        // 2. Load Saved Links
        const savedLinks = JSON.parse(localStorage.getItem('prp_final_submission') || '{}');
        if (savedLinks.lovable || savedLinks.github || savedLinks.deployed) {
            setLinks(savedLinks);
        }
    }, []);

    useEffect(() => {
        // 3. Determine Shipped Status
        const validLinks = validateUrl(links.lovable) && validateUrl(links.github) && validateUrl(links.deployed);
        setIsShipped(checklistComplete && validLinks);
    }, [links, checklistComplete]);

    // --- Handlers ---
    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleLinkChange = (field, value) => {
        const newLinks = { ...links, [field]: value };
        setLinks(newLinks);

        // Validation
        if (value && !validateUrl(value)) {
            setLinkErrors(prev => ({ ...prev, [field]: 'Invalid URL' }));
        } else {
            setLinkErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }

        // Persist
        localStorage.setItem('prp_final_submission', JSON.stringify(newLinks));
    };

    const copyFinalSubmission = () => {
        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
`.trim();
        navigator.clipboard.writeText(text);
        alert("Submission text copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header & Status */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Rocket className="text-primary" /> Placement Readiness Platform
                        </h1>
                        <p className="text-gray-500 mt-1">Proof of Work & Submission</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide flex items-center gap-2 ${isShipped ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {isShipped ? <Award size={18} /> : <AlertCircle size={18} />}
                        {isShipped ? 'Shipped' : 'In Progress'}
                    </div>
                </div>

                {/* Completion Message (Only when Shipped) */}
                {isShipped && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 text-center animate-fade-in">
                        <Award size={48} className="mx-auto text-green-600 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">You built a real product.</h2>
                        <p className="text-xl text-gray-700 font-medium mb-4">Not a tutorial. Not a clone.</p>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A structured tool that solves a real problem.
                            <br />
                            <span className="font-bold text-primary mt-2 block">This is your proof of work.</span>
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* A) Step Overview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="text-primary" size={20} /> Build Steps
                        </h2>
                        <div className="space-y-4">
                            {STEPS.map((step, idx) => (
                                <div key={step.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <span className={`font-medium ${step.status === 'Completed' ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase ${step.status === 'Completed' ? 'text-green-600' : 'text-orange-500'
                                        }`}>
                                        {step.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B) Artifacts */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ExternalLink className="text-primary" size={20} /> Project Artifacts
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lovable Project Link <span className="text-red-500">*</span></label>
                                    <input
                                        type="url"
                                        value={links.lovable}
                                        onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                        placeholder="https://lovable.dev/..."
                                        className={`w-full p-2 border rounded transition-colors ${linkErrors.lovable ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository <span className="text-red-500">*</span></label>
                                    <input
                                        type="url"
                                        value={links.github}
                                        onChange={(e) => handleLinkChange('github', e.target.value)}
                                        placeholder="https://github.com/..."
                                        className={`w-full p-2 border rounded transition-colors ${linkErrors.github ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deployed URL <span className="text-red-500">*</span></label>
                                    <input
                                        type="url"
                                        value={links.deployed}
                                        onChange={(e) => handleLinkChange('deployed', e.target.value)}
                                        placeholder="https://my-app.vercel.app"
                                        className={`w-full p-2 border rounded transition-colors ${linkErrors.deployed ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* C) Final Submission */}
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                            <h3 className="font-bold text-indigo-900 mb-2">Ready to Submit?</h3>
                            <p className="text-sm text-indigo-700 mb-4">
                                Ensure all steps are completed and artifacts are linked.
                            </p>
                            <button
                                onClick={copyFinalSubmission}
                                disabled={!isShipped}
                                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isShipped
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:scale-105'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Copy size={18} /> Copy Final Submission
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProofPage;
