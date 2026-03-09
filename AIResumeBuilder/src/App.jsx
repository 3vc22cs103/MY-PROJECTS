import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './ResumeContext';
import AppLayout from './AppLayout';
import Home from './Home';
import Builder from './Builder';
import PreviewPage from './PreviewPage';
import Proof from './Proof';
import Layout from './Layout'; // The legacy build-track layout

const StepContent = ({ title, description }) => (
  <div className="animate-fade-in">
    <h1>{title}</h1>
    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px' }}>
      {description}
    </p>
    <div style={{ marginTop: 'var(--s-40)', padding: 'var(--s-24)', border: '1px solid var(--border)', background: 'white' }}>
      <h3 style={{ marginBottom: 'var(--s-16)' }}>Instructions</h3>
      <ul style={{ marginLeft: 'var(--s-24)', color: 'var(--text-secondary)' }}>
        <li style={{ marginBottom: '8px' }}>Define the core artifact for this stage.</li>
        <li style={{ marginBottom: '8px' }}>Paste the generated prompt or logic into the side panel.</li>
        <li style={{ marginBottom: '8px' }}>Click "It Worked" to lock the artifact and proceed.</li>
      </ul>
    </div>
  </div>
);

function App() {
  return (
    <ResumeProvider>
      <Router>
        <Routes>
          {/* Main App Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/proof" element={
              <div style={{ padding: 'var(--s-64)', background: 'var(--c1-bg)', minHeight: '100vh' }}>
                <h1>Project Artifacts</h1>
                <p style={{ color: 'var(--text-muted)' }}>This section stores all your build track artifacts and final submission data.</p>
                <div style={{ marginTop: 'var(--s-40)', padding: 'var(--s-64)', border: '1px dashed var(--border)', textAlign: 'center' }}>
                  <p>Artifact panel placeholder. Detailed proofs available in the Build Track.</p>
                </div>
              </div>
            } />
          </Route>

          {/* Build Track Routes (Project 3 Rails) */}
          <Route path="/rb/01-problem" element={<Layout><StepContent title="Step 1: Problem Statement" description="Define the core value proposition." /></Layout>} />
          <Route path="/rb/02-market" element={<Layout><StepContent title="Step 2: Market Research" description="Analyze competitors." /></Layout>} />
          <Route path="/rb/03-architecture" element={<Layout><StepContent title="Step 3: Architecture" description="Decide on the tech stack." /></Layout>} />
          <Route path="/rb/04-hld" element={<Layout><StepContent title="Step 4: High Level Design" description="Create the system diagram." /></Layout>} />
          <Route path="/rb/05-lld" element={<Layout><StepContent title="Step 5: Low Level Design" description="Define schemas and interfaces." /></Layout>} />
          <Route path="/rb/06-build" element={<Layout><StepContent title="Step 6: Build Track" description="Execute the primary development." /></Layout>} />
          <Route path="/rb/07-test" element={<Layout><StepContent title="Step 7: Testing" description="Verify functionality." /></Layout>} />
          <Route path="/rb/08-ship" element={<Layout><StepContent title="Step 8: Shipping" description="Prepare for deployment." /></Layout>} />
          <Route path="/rb/proof" element={<Layout><Proof /></Layout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ResumeProvider>
  );
}

export default App;
