import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Video, TrendingUp } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
            {/* Hero Section */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="text-xl font-bold text-primary">Placement Prep</div>
                    <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary">
                        Sign In
                    </Link>
                </div>
            </header>

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Ace Your <span className="text-primary">Placement</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Practice, assess, and prepare for your dream job with our comprehensive readiness platform.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/dashboard"
                            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-opacity-90 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <Code size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Practice Problems</h3>
                                <p className="text-gray-600">Solve coding challenges tailored to company patterns.</p>
                            </div>
                            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <Video size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Mock Interviews</h3>
                                <p className="text-gray-600">Prepare with AI-driven or peer-to-peer mock sessions.</p>
                            </div>
                            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                                <p className="text-gray-600">Visualize your improvement with detailed analytics.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    <p>&copy; 2026 Placement Readiness Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
