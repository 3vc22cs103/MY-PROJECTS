import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import SavedPage from './pages/SavedPage';
import DigestPage from './pages/DigestPage';
import ProofPage from './pages/ProofPage';
import TestChecklistPage from './pages/TestChecklistPage';
import ShipPage from './pages/ShipPage';
import './App.css';

function App() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobStatuses, setJobStatuses] = useState({});
  const [toasts, setToasts] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedSaved = localStorage.getItem('savedJobs');
    if (storedSaved) setSavedJobs(JSON.parse(storedSaved));

    const storedStatus = localStorage.getItem('jobTrackerStatus');
    if (storedStatus) setJobStatuses(JSON.parse(storedStatus));
  }, []);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const updateJobStatus = (jobId, status, jobTitle, company) => {
    const newStatuses = {
      ...jobStatuses,
      [jobId]: {
        status,
        timestamp: new Date().toISOString(),
        jobTitle,
        company
      }
    };
    setJobStatuses(newStatuses);
    localStorage.setItem('jobTrackerStatus', JSON.stringify(newStatuses));
    addToast(`Status updated: ${status}`);
  };

  const toggleSave = (job) => {
    const isSaved = savedJobs.some(sj => sj.id === job.id);
    let newSaved;
    if (isSaved) {
      newSaved = savedJobs.filter(sj => sj.id !== job.id);
    } else {
      newSaved = [...savedJobs, job];
    }
    setSavedJobs(newSaved);
    localStorage.setItem('savedJobs', JSON.stringify(newSaved));
  };

  return (
    <Router>
      <div className="app-shell">
        <Navbar savedCount={savedJobs.length} />

        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className="toast">
              <span>🔔</span> {toast.message}
            </div>
          ))}
        </div>

        <main className="page-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  onToggleSave={toggleSave}
                  savedJobs={savedJobs}
                  jobStatuses={jobStatuses}
                  onUpdateStatus={updateJobStatus}
                />
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/saved"
              element={
                <SavedPage
                  savedJobs={savedJobs}
                  onToggleSave={toggleSave}
                  jobStatuses={jobStatuses}
                  onUpdateStatus={updateJobStatus}
                />
              }
            />
            <Route path="/digest" element={<DigestPage jobStatuses={jobStatuses} />} />
            <Route path="/proof" element={<ProofPage />} />
            <Route path="/jt/proof" element={<ProofPage />} />
            <Route path="/jt/07-test" element={<TestChecklistPage />} />
            <Route path="/jt/08-ship" element={<ShipPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
