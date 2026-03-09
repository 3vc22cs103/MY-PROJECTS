import React, { useMemo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FileText, Eye, ShieldCheck, Box } from 'lucide-react';
import { useResume } from './ResumeContext';

const AppLayout = () => {
  const { submission, checklist } = useResume();

  const isShipped = useMemo(() => {
    const stepsDone = ['01', '02', '03', '04', '05', '06', '07', '08'].every(id => !!localStorage.getItem(`rb_step_${id}_artifact`));
    const checklistDone = checklist.every(item => item === true);
    const linksDone = submission.lovable && submission.github && submission.deploy &&
      submission.lovable.startsWith('http') &&
      submission.github.startsWith('http') &&
      submission.deploy.startsWith('http');
    return stepsDone && checklistDone && linksDone;
  }, [submission, checklist]);

  return (
    <div className="layout-container">
      <header className="top-bar">
        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--c4-accent)', letterSpacing: '-0.02em' }}>
          AI RESUME
        </div>

        <nav className="main-nav">
          <NavLink to="/builder" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FileText size={16} /> Builder
          </NavLink>
          <NavLink to="/preview" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Eye size={16} /> Preview
          </NavLink>
          <NavLink to="/proof" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <ShieldCheck size={16} /> Proof
          </NavLink>
          <div className="nav-divider"></div>
          <NavLink to="/rb/01-problem" className="nav-link-secondary">
            <Box size={14} /> Build Track
          </NavLink>
        </nav>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className={`status-badge ${isShipped ? 'shipped' : ''}`}>
            {isShipped ? 'SHIPPED' : 'PREMIUM'}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'hidden' }}>
        <Outlet />
      </main>

      <style jsx="true">{`
        .status-badge.shipped {
          background-color: var(--c4-accent);
          color: white;
          border-color: var(--c4-accent);
        }
        .main-nav {
          display: flex;
          align-items: center;
          gap: var(--s-24);
        }
        .nav-link {
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          padding: 8px 12px;
          border-radius: 4px;
        }
        .nav-link:hover {
          color: var(--c3-text);
          background: var(--c1-bg);
        }
        .nav-link.active {
          color: var(--c4-accent);
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .nav-divider {
          width: 1px;
          height: 20px;
          background: var(--border);
        }
        .nav-link-secondary {
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link-secondary:hover {
          color: var(--c3-text);
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
