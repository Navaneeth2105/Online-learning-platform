import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogIn,
  UserPlus,
  User,
  Shield,
  GraduationCap,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { LogoMark } from '../components/LogoMark';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ initialTab = 'register' }) => {
  const [tab, setTab] = useState(initialTab);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, login, register, demoLogin } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from?.pathname || (user?.role === 'instructor' ? '/instructor' : '/dashboard');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  // Sync tab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedDemoRole, setSelectedDemoRole] = useState(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    try {
      setIsSubmitting(true);
      const res = await login(loginEmail, loginPassword);
      if (res?.user?.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      // Toast notification is handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;

    try {
      setIsSubmitting(true);
      const res = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });
      if (res?.user?.role === 'instructor' || regRole === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = (role) => {
    const demoCredentials = {
      student: { email: 'student@skillforge.com', password: 'password123' },
      instructor: { email: 'instructor@skillforge.com', password: 'password123' },
      admin: { email: 'admin@skillforge.com', password: 'password123' },
    };

    const creds = demoCredentials[role] || demoCredentials.student;
    setLoginEmail(creds.email);
    setLoginPassword(creds.password);
    setSelectedDemoRole(role);
  };

  return (
    <div
      style={{
        minHeight: '85vh',
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
          maxWidth: '500px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Brand & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 18px rgba(99, 102, 241, 0.45)',
              color: '#ffffff',
            }}
          >
            <LogoMark size={32} />
          </div>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '0.4rem', fontWeight: '800' }}>
            {tab === 'register' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            {tab === 'register'
              ? 'Join SkillForge to start your learning journey today.'
              : 'Sign in to access your courses, classroom notes, and certificates.'}
          </p>
        </div>

        {/* Tab Switcher: Sign Up vs Log In */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.8rem',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setTab('register')}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              fontSize: '0.92rem',
              border: 'none',
              cursor: 'pointer',
              background: tab === 'register' ? 'var(--brand-primary)' : 'transparent',
              color: tab === 'register' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <UserPlus size={16} /> Sign Up
          </button>
          <button
            type="button"
            onClick={() => setTab('login')}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              fontSize: '0.92rem',
              border: 'none',
              cursor: 'pointer',
              background: tab === 'login' ? 'var(--brand-primary)' : 'transparent',
              color: tab === 'login' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <LogIn size={16} /> Log In
          </button>
        </div>

        {/* =========================================================================
            SIGN UP FORM
            ========================================================================= */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                Password (min 6 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.4rem' }}>
              <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                I am joining as a
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => setRegRole('student')}
                  className={`btn btn-sm ${regRole === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <GraduationCap size={18} /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('instructor')}
                  className={`btn btn-sm ${regRole === 'instructor' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Sparkles size={18} /> Instructor
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account & Continue'} <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-primary)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 'inherit',
                }}
              >
                Log In here
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            LOG IN FORM
            ========================================================================= */}
        {tab === 'login' && (
          <div>
            {/* Quick Demo Accounts */}
            <div style={{ marginBottom: '1.6rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  marginBottom: '0.6rem',
                  textAlign: 'center',
                }}
              >
                ⚡ Quick Demo Accounts (Click to Fill)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => handleDemoClick('student')}
                  className={`btn btn-sm ${selectedDemoRole === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '0.6rem 0.4rem',
                    border: selectedDemoRole === 'student' ? '1px solid var(--brand-primary)' : '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <User size={16} color={selectedDemoRole === 'student' ? '#ffffff' : '#818cf8'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoClick('instructor')}
                  className={`btn btn-sm ${selectedDemoRole === 'instructor' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '0.6rem 0.4rem',
                    border: selectedDemoRole === 'instructor' ? '1px solid var(--brand-secondary)' : '1px solid rgba(168, 85, 247, 0.3)',
                  }}
                >
                  <Sparkles size={16} color={selectedDemoRole === 'instructor' ? '#ffffff' : '#c084fc'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Instructor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoClick('admin')}
                  className={`btn btn-sm ${selectedDemoRole === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '0.6rem 0.4rem',
                    border: selectedDemoRole === 'admin' ? '1px solid var(--brand-rose)' : '1px solid rgba(244, 63, 94, 0.3)',
                  }}
                >
                  <Shield size={16} color={selectedDemoRole === 'admin' ? '#ffffff' : '#fb7185'} />
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
                margin: '1.4rem 0',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.4rem' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In'} <LogIn size={18} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-primary)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 'inherit',
                }}
              >
                Sign Up now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

