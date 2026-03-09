import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-hero">
            <div className="content">
                <div className="badge animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--s-24)' }}>
                    <Sparkles size={16} /> <span>Powered by AI Analysis</span>
                </div>
                <h1 className="animate-fade-in" style={{ fontSize: '4.5rem', marginBottom: 'var(--s-24)', letterSpacing: '-0.02em' }}>
                    Build a Resume <br />
                    <span style={{ color: 'var(--c4-accent)' }}>That Gets Read.</span>
                </h1>
                <p className="animate-fade-in" style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: 'var(--s-40)', lineHeight: '1.7' }}>
                    Stop fighting with formatting. Focus on your story while our premium builder handles the aesthetics and layout. Clean, calm, and effective.
                </p>
                <button className="btn btn-accent animate-fade-in" style={{ padding: '16px 32px', fontSize: '1.1rem', gap: '12px' }} onClick={() => navigate('/builder')}>
                    Start Building <ArrowRight size={20} />
                </button>
            </div>

            <div className="abstract-bg">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
            </div>

            <style jsx="true">{`
        .home-hero {
          height: calc(100vh - var(--header-height));
          display: flex;
          align-items: center;
          padding: 0 var(--s-64);
          position: relative;
          overflow: hidden;
          background: var(--c1-bg);
        }
        .content {
          position: relative;
          z-index: 2;
        }
        .badge {
          padding: 6px 16px;
          background: white;
          border: 1px solid var(--border);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .abstract-bg {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          overflow: hidden;
          opacity: 0.5;
        }
        .circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        .circle-1 {
          width: 400px;
          height: 400px;
          background: var(--c4-accent);
          top: 20%;
          right: -100px;
          opacity: 0.1;
        }
        .circle-2 {
          width: 300px;
          height: 300px;
          background: #3b82f6;
          bottom: 10%;
          right: 10%;
          opacity: 0.05;
        }
      `}</style>
        </div>
    );
};

export default Home;
