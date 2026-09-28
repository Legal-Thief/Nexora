

import { Link } from 'react-router-dom';
import { Kanban, Users, Bell, BarChart2, Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Kanban,
    title: 'Kanban Board',
    description: 'Visualize your workflow with drag-and-drop task management across customizable columns.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members, assign tasks, and track contributions in real time.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay updated with instant notifications when tasks are assigned or comments are added.',
  },
  {
    icon: BarChart2,
    title: 'Analytics Dashboard',
    description: 'Monitor progress with visual charts showing task completion and team performance.',
  },
  {
    icon: Zap,
    title: 'Activity Tracking',
    description: 'Keep a clear log of project actions, task updates, and team milestones.',
  },
  {
    icon: Shield,
    title: 'Secure Access',
    description: 'JWT-based authentication ensures only authorized team members can access your workspace.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create a Workspace', desc: 'Set up your team workspace and invite your colleagues.' },
  { step: '02', title: 'Add Projects', desc: 'Organize work into projects with deadlines and team members.' },
  { step: '03', title: 'Manage Tasks', desc: 'Create tasks, assign them, and move them through the Kanban board.' },
  { step: '04', title: 'Track Progress', desc: 'View analytics and stay on top of what needs to get done.' },
];

function LandingPage() {
  return (
    <div className="landing-page">
      
      <nav className="landing-nav">
        <div className="landing-logo">Nexora<span>.</span></div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How it works</a>
          <Link to="/login" className="landing-nav-link">Sign in</Link>
          <Link to="/register">
            <button className="hero-button-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      
      <section className="hero">
        <div className="hero-badge">
          <Zap size={12} />
          Open Source · Built with MERN Stack
        </div>

        <h1 className="hero-title">
          Project Management<br />
          <span>Made Simple</span>
        </h1>

        <p className="hero-subtitle">
          Nexora helps teams plan, track, and ship projects with a beautiful
          Kanban board and team collaboration.
        </p>

        <div className="hero-actions">
          <Link to="/register">
            <button className="hero-button-primary">
              Start for Free <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </button>
          </Link>
          <Link to="/login">
            <button className="hero-button-secondary">Sign In</button>
          </Link>
        </div>

        
        <div style={{
          marginTop: 60,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '24px',
          maxWidth: 800,
          margin: '60px auto 0',
        }}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {['TO DO', 'IN PROGRESS', 'REVIEW', 'DONE'].map((col, idx) => (
              <div key={col} style={{
                flexShrink: 0, width: 180,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: ['#94a3b8','#3b82f6','#f59e0b','#10b981'][idx], marginBottom: 10, letterSpacing: 1 }}>
                  {col}
                </div>
                {[1,2].map((i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 6, padding: '8px 10px',
                    marginBottom: 6, fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)',
                  }}>
                    {['Setup database', 'Design UI', 'Build API', 'Write tests', 'Code review', 'Deploy', 'Documentation', 'Bug fixes'][idx * 2 + i - 1]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="features-section" id="features">
        <h2 className="features-title">Everything you need</h2>
        <p className="features-subtitle">Built for teams who want simplicity without sacrificing power.</p>

        <div className="features-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="feature-card">
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      
      <section style={{ padding: '80px 60px', textAlign: 'center' }} id="how-it-works">
        <h2 className="features-title">How it works</h2>
        <p className="features-subtitle">Get your team up and running in minutes.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '24px 20px',
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1', marginBottom: 12 }}>{item.step}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section style={{ textAlign: 'center', padding: '80px 60px', background: 'rgba(99,102,241,0.08)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>Ready to get started?</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
          Join your team on Nexora and start managing projects the smart way.
        </p>
        <Link to="/register">
          <button className="hero-button-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            Create Free Account
          </button>
        </Link>
      </section>

      
      <footer className="landing-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span>Nexora © {new Date().getFullYear()}</span>
          <span>·</span>
          <span>Built with React, Node.js, Express & MongoDB</span>
          <span>·</span>
          <span>3rd Year CSE Project</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
