import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { CourseLearn } from './pages/CourseLearn';
import { Dashboard } from './pages/Dashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { CourseEditor } from './pages/CourseEditor';
import { AuthPage } from './pages/AuthPage';
import { Profile } from './pages/Profile';
import { CertificateVerify } from './pages/CertificateVerify';

const AppRoutes = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-subtle)',
              borderTopColor: 'var(--brand-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading SkillForge...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root Route: If NOT authenticated -> direct Sign Up & Log In portal. If authenticated -> Home / Dashboard */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === 'instructor' ? <InstructorDashboard /> : <Home />
          ) : (
            <AuthPage initialTab="register" />
          )
        }
      />

      {/* Explicit Login and Register Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage initialTab="login" />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage initialTab="register" />}
      />

      {/* Verification */}
      <Route path="/verify" element={<CertificateVerify />} />
      <Route path="/verify/:id" element={<CertificateVerify />} />

      {/* Courses: protected so unauthenticated users must sign up/log in first */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />

      {/* Student Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/:id"
        element={
          <ProtectedRoute>
            <CourseLearn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Instructor & Admin Studio Protected Routes */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/new"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseEditor />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
