import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Sparkles, User, Shield, Lock, Mail } from 'lucide-react';
import { LogoMark } from '../components/LogoMark';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      // Handled in context toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async (role) => {
    try {
      setIsSubmitting(true);
      await demoLogin(role);
      if (role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        className="glass-panel-heavy"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--text-primary)',
            }}
          >
            <LogoMark size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Log in to access your courses, classroom notes, and certificates.
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.6rem', textAlign: 'center' }}>
            ⚡ 1-Click Quick Demo Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => handleDemoClick('student')}
              disabled={isSubmitting}
              className="btn btn-secondary btn-sm"
              style={{ flexDirection: 'column', gap: '4px', padding: '0.6rem 0.4rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}
            >
              <User size={16} color="#818cf8" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('instructor')}
              disabled={isSubmitting}
              className="btn btn-secondary btn-sm"
              style={{ flexDirection: 'column', gap: '4px', padding: '0.6rem 0.4rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}
            >
              <Sparkles size={16} color="#c084fc" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Instructor</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              disabled={isSubmitting}
              className="btn btn-secondary btn-sm"
              style={{ flexDirection: 'column', gap: '4px', padding: '0.6rem 0.4rem', border: '1px solid rgba(244, 63, 94, 0.3)' }}
            >
              <Shield size={16} color="#fb7185" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Admin</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.5rem 0',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.8rem' }}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'} <LogIn size={18} />
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
