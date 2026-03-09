import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Practice from './pages/Practice';
import Assessments from './pages/Assessments';
import Resources from './pages/Resources';
import Profile from './pages/Profile';

import AnalysisInput from './pages/AnalysisInput';
import History from './pages/History';
import TestChecklist from './pages/TestChecklist';
import ShipLock from './pages/ShipLock';
import ProofPage from './pages/ProofPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="analyze" element={<AnalysisInput />} />
          <Route path="history" element={<History />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* PRB Test & Ship Routes */}
        <Route path="/prp/07-test" element={<TestChecklist />} />
        <Route path="/prp/08-ship" element={<ShipLock />} />
        <Route path="/prp/proof" element={<ProofPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
