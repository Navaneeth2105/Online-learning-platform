import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, Shield, Award, Sparkles } from 'lucide-react';
import { LogoMark } from './LogoMark';

export const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                }}
              >
                <LogoMark size={24} />
              </div>
              <span
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.3rem',
                  fontWeight: '800',
                }}
                className="gradient-text"
              >
                SkillForge
              </span>
            </Link>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                marginBottom: '1.2rem',
              }}
            >
              Empowering ambitious learners worldwide to master modern web technologies, AI engineering, cloud systems, and design.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-icon" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="btn-icon" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn-icon" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', fontWeight: '600' }}>Explore Tracks</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/courses?category=Web+Development" style={{ transition: 'color 0.2s' }}>Full-Stack Web Dev</Link></li>
              <li><Link to="/courses?category=AI+%26+Machine+Learning">AI & Large Language Models</Link></li>
              <li><Link to="/courses?category=Cloud+%26+DevOps">Cloud & Kubernetes DevOps</Link></li>
              <li><Link to="/courses?category=UI%2FUX+Design">UI/UX Design Systems</Link></li>
              <li><Link to="/courses?category=Cybersecurity">Cybersecurity & Hacking</Link></li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', fontWeight: '600' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/courses">Course Catalog</Link></li>
              <li><Link to="/instructor">Become an Instructor</Link></li>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
              <li><Link to="/verify" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={14} color="#10b981" /> Verify Certificate</Link></li>
              <li><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={14} color="#6366f1" /> Safe & Secure LMS</span></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.8rem', fontWeight: '600' }}>Stay Ahead</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Subscribe to get curated tech tutorials, course discounts, and career advice.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter email address"
                style={{
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  flex: 1,
                  outline: 'none',
                }}
              />
              <button className="btn btn-primary btn-sm">Join</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} SkillForge Inc. All rights reserved. Built with MERN Stack.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Crafted with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for lifelong learners.
          </div>
        </div>
      </div>
    </footer>
  );
};
