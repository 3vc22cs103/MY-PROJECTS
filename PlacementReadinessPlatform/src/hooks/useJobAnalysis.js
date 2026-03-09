import { useState, useEffect } from 'react';

const STORAGE_KEY = 'placement_readiness_history';

export const useJobAnalysis = () => {
    const [history, setHistory] = useState([]);
    const [latestAnalysis, setLatestAnalysis] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Filter out corrupted entries if necessary, or just load
                if (Array.isArray(parsed)) {
                    setHistory(parsed);
                    if (parsed.length > 0) {
                        setLatestAnalysis(parsed[0]);
                    }
                } else {
                    console.warn("History format invalid, resetting.");
                    setHistory([]);
                }
            }
        } catch (e) {
            console.error("Failed to parse history", e);
            // Optionally clear corrupted data
            // localStorage.removeItem(STORAGE_KEY); 
        }
    }, []);

    const saveAnalysis = (analysis) => {
        const newHistory = [analysis, ...history];
        setHistory(newHistory);
        setLatestAnalysis(analysis);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    };

    const getAnalysisById = (id) => {
        return history.find(item => item.id === id);
    };

    const clearHistory = () => {
        setHistory([]);
        setLatestAnalysis(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    const updateAnalysis = (id, updates) => {
        const newHistory = history.map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        setHistory(newHistory);

        // If we are updating the currently viewed analysis, update it too
        if (latestAnalysis && latestAnalysis.id === id) {
            setLatestAnalysis({ ...latestAnalysis, ...updates });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    };

    const selectAnalysis = (id) => {
        const found = getAnalysisById(id);
        if (found) setLatestAnalysis(found);
    }

    return {
        history,
        latestAnalysis,
        saveAnalysis,
        updateAnalysis,
        getAnalysisById,
        selectAnalysis,
        clearHistory
    };
};
