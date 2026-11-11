import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Moon,
  Sun,
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogoMark } from './LogoMark';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileNavOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-glass-heavy)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '92px',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              flexShrink: 0,
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
            }}
          >
            <LogoMark size={56} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.4rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
              }}
              className="gradient-text"
            >
              SkillForge
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        {isAuthenticated && (
          <form
            onSubmit={handleSearchSubmit}
            style={{
              flex: '1',
              maxWidth: '380px',
              position: 'relative',
              display: 'none',
            }}
            className="desktop-search"
          >
            <Search
              size={18}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              placeholder="Search courses, skills, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.4rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </form>
        )}

        {/* Desktop Navigation Links */}
        {isAuthenticated && (
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
            className="desktop-nav"
          >
            <Link
              to="/courses"
              style={{
                fontSize: '0.925rem',
                fontWeight: '500',
                color: isActive('/courses') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <BookOpen size={16} /> Explore Courses
            </Link>

            <Link
              to="/dashboard"
              style={{
                fontSize: '0.925rem',
                fontWeight: '500',
                color: isActive('/dashboard') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <LayoutDashboard size={16} /> My Learning
            </Link>

            {(user?.role === 'instructor' || user?.role === 'admin') && (
              <Link
                to="/instructor"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: '600',
                  color: isActive('/instructor') ? 'var(--brand-secondary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Sparkles size={16} color="#a855f7" /> Instructor Studio
              </Link>
            )}

            <Link
              to="/verify"
              style={{
                fontSize: '0.925rem',
                fontWeight: '500',
                color: isActive('/verify') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <ShieldCheck size={16} /> Verify Certificate
            </Link>
          </nav>
        )}

        {/* Right Action Icons & Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={19} color="#fbbf24" /> : <Moon size={19} color="#6366f1" />}
          </button>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '4px 8px 4px 4px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user?.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    maxWidth: '110px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name}
                </span>
                <span
                  className={
                    user?.role === 'instructor'
                      ? 'badge badge-amber'
                      : user?.role === 'admin'
                      ? 'badge badge-rose'
                      : 'badge badge-indigo'
                  }
                  style={{ fontSize: '0.65rem', padding: '2px 6px' }}
                >
                  {user?.role}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '220px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 200,
                  }}
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                  <div style={{ padding: '0.4rem 0' }}>
                    <Link
                      to="/dashboard"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                      }}
                      className="dropdown-item"
                    >
                      <LayoutDashboard size={16} /> My Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                      }}
                      className="dropdown-item"
                    >
                      <User size={16} /> Profile & Settings
                    </Link>
                    {(user?.role === 'instructor' || user?.role === 'admin') && (
                      <Link
                        to="/instructor"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          borderRadius: 'var(--radius-sm)',
                          color: '#a855f7',
                          fontWeight: '600',
                        }}
                        className="dropdown-item"
                      >
                        <Sparkles size={16} /> Instructor Studio
                      </Link>
                    )}
                    <Link
                      to="/verify"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                      }}
                      className="dropdown-item"
                    >
                      <ShieldCheck size={16} /> Verify Certificate
                    </Link>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--brand-rose)',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Mobile Hamburger Button */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="btn-icon mobile-menu-btn"
              style={{ display: 'none' }}
            >
              {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isAuthenticated && mobileNavOpen && (
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-glass)',
            padding: '1.2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </form>
          <Link
            to="/courses"
            onClick={() => setMobileNavOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
          >
            <BookOpen size={18} /> Explore Courses
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileNavOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
          >
            <ShieldCheck size={18} /> Verify Certificate
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
            >
              <LayoutDashboard size={18} /> My Learning
            </Link>
          )}
          {isAuthenticated && (user?.role === 'instructor' || user?.role === 'admin') && (
            <Link
              to="/instructor"
              onClick={() => setMobileNavOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#a855f7' }}
            >
              <Sparkles size={18} /> Instructor Studio
            </Link>
          )}
        </div>
      )}

      {/* CSS Helper for responsive media queries */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-search { display: block !important; }
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-search { display: none !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
        .dropdown-item:hover {
          background: var(--bg-tertiary);
        }
      `}</style>
    </header>
  );
};
