import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  Users,
  IndianRupee,
  Star,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalRevenue: 0, avgRating: '5.0' });
  const [courses, setCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, coursesRes] = await Promise.all([
          api.getInstructorStats(),
          api.getInstructorCourses(),
        ]);

        if (statsRes.success) {
          setStats(statsRes.stats);
          setRecentEnrollments(statsRes.recentEnrollments || []);
        }

        if (coursesRes.success) {
          setCourses(coursesRes.courses || []);
        }
      } catch (err) {
        console.error('Error loading instructor stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructorData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.deleteCourse(courseId);
      if (res.success) {
        addToast('Course deleted successfully', 'info');
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
        setStats((prev) => ({ ...prev, totalCourses: Math.max(0, prev.totalCourses - 1) }));
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete course', 'error');
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Header with CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-amber">Instructor Studio</span>
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Welcome to Your Creator Studio</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage your published courses, track student enrollment growth, and create new modules.
            </p>
          </div>

          <Link to="/instructor/courses/new" className="btn btn-primary btn-lg">
            <PlusCircle size={18} /> Create New Course
          </Link>
        </div>

        {/* Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated Revenue</span>
              <IndianRupee size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--brand-emerald)' }}>
              ₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : '0'}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Students</span>
              <Users size={20} color="#6366f1" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>
              {stats.totalStudents ? stats.totalStudents.toLocaleString() : '0'}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Courses</span>
              <BookOpen size={20} color="#a855f7" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.totalCourses || 0}</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instructor Rating</span>
              <Star size={20} color="#f59e0b" fill="#f59e0b" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
              {stats.avgRating || '5.0'} / 5.0
            </div>
          </div>
        </div>

        {/* Courses Management Table */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Your Course Catalog ({courses.length})</h2>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div
              className="glass-panel"
              style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}
            >
              <BookOpen size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.8rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>You haven't created any courses yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Use our visual course editor to design lessons, upload videos, and build interactive quizzes.
              </p>
              <Link to="/instructor/courses/new" className="btn btn-primary btn-sm">
                Create First Course
              </Link>
            </div>
          ) : (
            <div
              className="glass-panel"
              style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>Course</th>
                      <th style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>Category</th>
                      <th style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>Price</th>
                      <th style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>Students</th>
                      <th style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>Rating</th>
                      <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <img
                            src={c.thumbnail}
                            alt={c.title}
                            style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div style={{ maxWidth: '300px' }}>
                            <div style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {c.title}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {c.modules?.length || 0} modules • {c.totalLessons || 0} lessons{c.resources?.length ? ` • ${c.resources.length} documents` : ''}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.2rem' }}>
                          <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                            {c.category}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>
                          {c.isFree || c.price === 0 ? 'Free' : `₹${c.price.toLocaleString('en-IN')}`}
                        </td>
                        <td style={{ padding: '1rem 1.2rem' }}>{c.studentsCount || 0}</td>
                        <td style={{ padding: '1rem 1.2rem' }}>
                          <span style={{ color: '#f59e0b', fontWeight: '600' }}>⭐ {c.rating ? c.rating.toFixed(1) : '5.0'}</span>
                        </td>
                        <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <Link
                              to={`/courses/${c.slug || c._id}`}
                              className="btn-icon"
                              title="View Live in Catalog"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              to={`/instructor/courses/edit/${c._id}`}
                              className="btn-icon"
                              title="Edit Course & Syllabus"
                            >
                              <Edit size={16} color="#6366f1" />
                            </Link>
                            <button
                              onClick={() => handleDeleteCourse(c._id)}
                              className="btn-icon"
                              title="Delete Course"
                            >
                              <Trash2 size={16} color="#f43f5e" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Recent Enrollments Activity */}
        {recentEnrollments.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.2rem' }}>Recent Student Enrollments</h2>
            <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {recentEnrollments.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <img
                        src={item.student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={item.student?.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{item.student?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Enrolled in <strong>{item.course?.title}</strong>
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
