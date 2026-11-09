import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, GraduationCap, Sparkles } from 'lucide-react';
import { LogoMark } from '../components/LogoMark';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setIsSubmitting(true);
      await register({ name, email, password, role });
      if (role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Handled in context toast
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
          maxWidth: '500px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
        }}
      >
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
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join SkillForge to access interactive courses and earn verified certificates.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                required
              />
            </div>
          </div>

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
            <label className="form-label">Password (min 6 characters)</label>
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
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.65rem' }}
              >
                <GraduationCap size={16} /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`btn btn-sm ${role === 'instructor' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.65rem' }}
              >
                <Sparkles size={16} /> Instructor
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isSubmitting ? 'Creating Account...' : 'Get Started'} <UserPlus size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
