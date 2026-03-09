import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useJobAnalysis } from '../hooks/useJobAnalysis';
import { useNavigate } from 'react-router-dom';
import { Calendar, Briefcase, ChevronRight } from 'lucide-react';

const History = () => {
    const { history, selectAnalysis } = useJobAnalysis();
    const navigate = useNavigate();

    const handleSelect = (id) => {
        selectAnalysis(id);
        navigate('/dashboard');
    };

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Calendar size={48} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">No Analysis History</h2>
                <p className="text-gray-500 mt-2 mb-6">You haven't analyzed any job descriptions yet.</p>
                <button
                    onClick={() => navigate('/dashboard/analyze')}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90"
                >
                    Start New Analysis
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>

            <div className="grid gap-4">
                {history.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:border-primary transition-colors border-gray-200" onClick={() => handleSelect(item.id)}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-primary font-bold text-xl">
                                    {item.readinessScore}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {item.role || "Untitled Role"}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <Briefcase size={14} />
                                        <span>{item.company || "Unknown Company"}</span>
                                        <span className="text-gray-300">•</span>
                                        <Calendar size={14} />
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {Object.entries(item.extractedSkills).slice(0, 4).map(([category, skills]) => (
                                            skills.length > 0 && (
                                                <span key={category} className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-600">
                                                    {category} ({skills.length})
                                                </span>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-400" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default History;
