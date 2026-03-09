import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, AlertTriangle, ShieldCheck, RotateCcw, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChecklistItem = ({ id, label, hint, checked, onToggle }) => (
    <div
        onClick={() => onToggle(id)}
        className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
    >
        <div className={`mt-0.5 ${checked ? 'text-green-600' : 'text-gray-400'}`}>
            {checked ? <CheckSquare size={20} /> : <Square size={20} />}
        </div>
        <div className="flex-1">
            <h3 className={`font-medium ${checked ? 'text-green-800' : 'text-gray-900'}`}>{label}</h3>
            {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
        </div>
    </div>
);

const TestChecklist = () => {
    const navigate = useNavigate();
    const STORAGE_KEY = 'prp_test_checklist';

    const INITIAL_TESTS = [
        { id: 'jd-required', label: 'JD required validation works', hint: 'Submit empty form -> Verify button disabled.' },
        { id: 'short-jd', label: 'Short JD warning shows for <200 chars', hint: 'Paste brief text -> Check orange warning.' },
        { id: 'skills-group', label: 'Skills extraction groups correctly', hint: 'Check result page uses correct categories.' },
        { id: 'round-mapping', label: 'Round mapping changes based on company + skills', hint: 'Compare Enterprise vs Startup mapping.' },
        { id: 'score-deterministic', label: 'Score calculation is deterministic', hint: 'Same input -> Same Initial Score.' },
        { id: 'skill-toggles', label: 'Skill toggles update score live', hint: 'Click skills -> Verify score changes.' },
        { id: 'persist-refresh', label: 'Changes persist after refresh', hint: 'Reload page -> Check toggles/score remain.' },
        { id: 'history-save', label: 'History saves and loads correctly', hint: 'Check History tab for recent analysis.' },
        { id: 'export-copy', label: 'Export buttons copy the correct content', hint: 'Click verify clipboard content.' },
        { id: 'no-console', label: 'No console errors on core pages', hint: 'Open F12 -> Check Console tab.' }
    ];

    const [tests, setTests] = useState({});

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setTests(JSON.parse(stored));
        } else {
            // Initialize empty
            const initial = {};
            INITIAL_TESTS.forEach(t => initial[t.id] = false);
            setTests(initial);
        }
    }, []);

    const toggleTest = (id) => {
        const newTests = { ...tests, [id]: !tests[id] };
        setTests(newTests);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTests));
    };

    const resetChecklist = () => {
        if (window.confirm("Reset all test progress?")) {
            const initial = {};
            INITIAL_TESTS.forEach(t => initial[t.id] = false);
            setTests(initial);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        }
    };

    const passedCount = INITIAL_TESTS.filter(t => tests[t.id]).length;
    const totalCount = INITIAL_TESTS.length;
    const isComplete = passedCount === totalCount;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pre-Ship Checklist</h1>
                            <p className="text-gray-500">Placement Readiness Platform v1.0</p>
                        </div>
                        <div className={`text-right ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
                            <span className="text-3xl font-bold">{passedCount}</span>
                            <span className="text-gray-400 text-lg"> / {totalCount}</span>
                        </div>
                    </div>

                    {!isComplete ? (
                        <div className="flex items-center gap-2 p-3 bg-orange-50 text-orange-700 rounded-lg border border-orange-100 mb-4">
                            <AlertTriangle size={20} />
                            <span className="font-medium">Fix issues before shipping.</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 mb-4">
                            <ShieldCheck size={20} />
                            <span className="font-medium">All systems go! Ready to ship.</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                            onClick={resetChecklist}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                        >
                            <RotateCcw size={14} /> Reset list
                        </button>

                        <button
                            disabled={!isComplete}
                            onClick={() => navigate('/prp/08-ship')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all ${isComplete
                                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md transform hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isComplete ? <><ShieldCheck size={18} /> Proceed to Ship</> : <><Lock size={18} /> Shipping Locked</>}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {INITIAL_TESTS.map(test => (
                        <ChecklistItem
                            key={test.id}
                            {...test}
                            checked={!!tests[test.id]}
                            onToggle={toggleTest}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TestChecklist;
