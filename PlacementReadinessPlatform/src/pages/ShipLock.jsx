import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Home, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShipLock = () => {
    const navigate = useNavigate();
    const STORAGE_KEY = 'prp_test_checklist';
    const TEST_COUNT = 10;

    // Check local storage for tests
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const passedCount = Object.values(stored).filter(Boolean).length;

    if (passedCount < TEST_COUNT) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center space-y-4">
                <div className="bg-red-50 p-6 rounded-full text-red-600 mb-4 animate-bounce">
                    <Lock size={64} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Shipment Locked!</h1>
                <p className="text-gray-600 max-w-md">
                    You have passed only <span className="text-red-600 font-bold">{passedCount} / {TEST_COUNT}</span> tests.
                    Please complete all items on the checklist before shipping.
                </p>
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => navigate('/prp/07-test')}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        <ShieldCheck size={20} /> Go to Checklist
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        <Home size={20} /> Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center space-y-6">
            <div className="bg-white p-8 rounded-full text-green-600 shadow-xl mb-4 transform hover:scale-110 transition-transform">
                <Package size={80} />
            </div>
            <h1 className="text-4xl font-extrabold text-green-800">Ready to Ship! 🚀</h1>
            <p className="text-green-700 text-lg max-w-lg">
                Congratulations! All systems are verified.
                The platform is stable, tested, and ready for deployment.
            </p>
            <div className="bg-white/50 p-4 rounded-lg border border-green-200 text-sm font-mono text-green-900 mt-4">
                Build ID: v1.0.0-{Date.now().toString().slice(-6)}
            </div>
            <button
                onClick={() => navigate('/dashboard')}
                className="mt-8 flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition"
            >
                Return to Dashboard
            </button>
        </div>
    );
};

export default ShipLock;
