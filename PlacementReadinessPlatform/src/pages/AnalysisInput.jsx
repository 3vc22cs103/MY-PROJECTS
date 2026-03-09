import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { analyzeJobDescription } from '../utils/analyzer';
import { useJobAnalysis } from '../hooks/useJobAnalysis';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

const AnalysisInput = () => {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jdText, setJdText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { saveAnalysis } = useJobAnalysis();
    const navigate = useNavigate();

    const handleAnalyze = () => {
        if (!jdText.trim()) return;

        setIsAnalyzing(true);

        // Simulate a small delay for "processing" feel
        setTimeout(() => {
            const result = analyzeJobDescription(company, role, jdText);
            saveAnalysis(result);
            setIsAnalyzing(false);
            navigate('/dashboard'); // Go to dashboard to show results
        }, 800);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">New Job Analysis</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Paste the job description to generate a tailored preparation plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="e.g. Google, Amazon, Startup..."
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Role / Title</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="e.g. SDE-1, Frontend Engineer..."
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Job Description (JD) <span className="text-red-500">*</span></label>
                        <textarea
                            className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                            placeholder="Paste the full job description here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                        <div className="flex justify-between items-start">
                            {jdText.length > 0 && jdText.length < 200 && (
                                <p className="text-xs text-orange-500 font-medium">
                                    This JD is too short to analyze deeply. Paste full JD for better output.
                                </p>
                            )}
                            <p className="text-xs text-gray-400 ml-auto">
                                {jdText.length} characters
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!jdText.trim() || isAnalyzing}
                        className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${!jdText.trim() || isAnalyzing ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90 shadow-lg'
                            }`}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Analyzing...
                            </>
                        ) : (
                            <>
                                Analyze & Generate Plan <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                </CardContent>
            </Card>
        </div>
    );
};

export default AnalysisInput;
