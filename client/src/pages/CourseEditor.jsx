import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Video,
  HelpCircle,
  Sparkles,
  Layers,
  CheckCircle,
  Award,
  UploadCloud,
  FileText,
  File,
  Download,
  ExternalLink,
  Play,
  X,
  Eye,
  Film,
  FolderPlus,
  RefreshCw,
  Clock,
  Link as LinkIcon,
  Code,
  FileCode,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { VideoPlayer } from '../components/VideoPlayer';

// Preset sample videos for fast testing
const PRESET_VIDEOS = [
  { label: 'Web Development Course (YouTube)', url: 'https://youtu.be/F4zr1aMevB4?si=qrzjj_8kejRUd20W', duration: '18:40' },
  { label: 'Platform Demo Lesson (Local MP4)', url: '/videos/lesson-demo.mp4', duration: '08:30' },
  { label: 'Google Cloud Sample (ForBiggerBlazes)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '15:00' },
  { label: 'Big Buck Bunny (HD MP4)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '09:56' },
  { label: 'YouTube Web Dev Tutorial', url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', duration: '12:45' },
  // AI Course Presets
  { label: 'Transformer Foundations (YouTube)', url: 'https://www.youtube.com/watch?v=aircAruvnKk', duration: '27:10' },
  { label: 'Advanced Prompt Engineering (YouTube)', url: 'https://youtu.be/zjkBMFhNj_g', duration: '59:45' },
  { label: 'RAG Vector DB Overview (YouTube)', url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc', duration: '34:20' },
  { label: 'Autonomous Agents Deep Dive (YouTube)', url: 'https://www.youtube.com/watch?v=aywZrzNaKjs', duration: '45:00' },
];


// Preset sample documents for fast testing
const PRESET_DOCUMENTS = [
  { title: 'Lecture 1: Architecture & Cheatsheet (PDF)', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '1.2 MB' },
  { title: 'Full Stack Starter Code (ZIP)', url: 'https://github.com/facebook/react/archive/refs/tags/v18.3.1.zip', type: 'archive', size: '2.8 MB' },
  { title: 'Curriculum Syllabus & Study Plan (PDF)', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '850 KB' },
  { title: 'Official Documentation & API Guide (Link)', url: 'https://react.dev', type: 'link', size: 'External' },
  { title: 'Course Practice Exercises & Solutions (Doc)', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'document', size: '1.5 MB' },
];

export const CourseEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  // Course Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80');
  const [previewVideo, setPreviewVideo] = useState('https://youtu.be/F4zr1aMevB4?si=qrzjj_8kejRUd20W');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(['Master core concepts', 'Build full-stack applications']);
  const [requirements, setRequirements] = useState(['Basic computer knowledge']);
  const [courseResources, setCourseResources] = useState([]);

  // Syllabus Modules & Lessons
  const [modules, setModules] = useState([
    {
      title: 'Module 1: Introduction & Setup',
      description: 'Getting started and environment configuration',
      order: 1,
      lessons: [
        {
          title: 'Course Overview & Tools',
          type: 'video',
          duration: '10:00',
          durationSeconds: 600,
          videoUrl: 'https://youtu.be/F4zr1aMevB4?si=qrzjj_8kejRUd20W',
          videoType: 'youtube',
          content: 'Overview of the tools, environment and packages needed for this course.',
          isFreePreview: true,
          resources: [
            {
              title: 'Module 1 Architecture & Cheatsheet (PDF)',
              url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              type: 'pdf',
              size: '1.2 MB',
            },
          ],
        },
      ],
    },
  ]);

  // Video Preview Modal / Inline State
  const [activePreviewVideo, setActivePreviewVideo] = useState(null); // { url, title }

  // Document Upload / Add Modal State
  // target: { type: 'course' } or { type: 'lesson', mIdx, lIdx }
  const [documentModalTarget, setDocumentModalTarget] = useState(null);
  const [docModalTab, setDocModalTab] = useState('upload'); // 'upload' | 'link' | 'presets'
  const [docFormTitle, setDocFormTitle] = useState('');
  const [docFormUrl, setDocFormUrl] = useState('');
  const [docFormType, setDocFormType] = useState('pdf');
  const [docFormSize, setDocFormSize] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const docFileInputRef = useRef(null);

  // Video Upload State
  // { type: 'course' } or { type: 'lesson', mIdx, lIdx }
  const [videoUploadTarget, setVideoUploadTarget] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const videoFileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      const loadCourse = async () => {
        try {
          const res = await api.getInstructorCourseById(id);
          if (res.success && res.course) {
            const c = res.course;
            setTitle(c.title || '');
            setSubtitle(c.subtitle || '');
            setDescription(c.description || '');
            setCategory(c.category || 'Web Development');
            setLevel(c.level || 'Beginner');
            setPrice(c.price || 0);
            setThumbnail(c.thumbnail || '');
            setPreviewVideo(c.previewVideo || '');
            setWhatYouWillLearn(c.whatYouWillLearn?.length ? c.whatYouWillLearn : ['Master core concepts']);
            setRequirements(c.requirements?.length ? c.requirements : ['Basic computer knowledge']);
            setCourseResources(c.resources || []);
            if (c.modules?.length) {
              // Ensure lessons have resources array
              const sanitizedModules = c.modules.map((m) => ({
                ...m,
                lessons: (m.lessons || []).map((l) => ({
                  ...l,
                  resources: l.resources || [],
                })),
              }));
              setModules(sanitizedModules);
            }
          }
        } catch (err) {
          addToast(err.message || 'Failed to load course', 'error');
        } finally {
          setIsLoading(false);
        }
      };

      loadCourse();
    }
  }, [id, isEditing, addToast]);

  // ================= MODULE & LESSON HANDLERS =================
  const handleAddModule = () => {
    setModules((prev) => [
      ...prev,
      {
        title: `Module ${prev.length + 1}: New Topic`,
        description: '',
        order: prev.length + 1,
        lessons: [
          {
            title: 'New Video Lecture',
            type: 'video',
            duration: '10:00',
            durationSeconds: 600,
            videoUrl: '/videos/lesson-demo.mp4',
            videoType: 'upload',
            content: '',
            isFreePreview: false,
            resources: [],
          },
        ],
      },
    ]);
  };

  const handleRemoveModule = (mIdx) => {
    setModules((prev) => prev.filter((_, i) => i !== mIdx));
  };

  const handleModuleTitleChange = (mIdx, val) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[mIdx].title = val;
      return copy;
    });
  };

  const handleAddLesson = (mIdx, type = 'video') => {
    setModules((prev) => {
      const copy = [...prev];
      let newLesson = {
        title:
          type === 'quiz'
            ? 'Module Assessment Quiz'
            : type === 'reading'
            ? 'Lecture Reading & Study Material'
            : 'New Video Lecture',
        type,
        duration: type === 'quiz' ? '10:00' : type === 'reading' ? '08:00' : '12:00',
        durationSeconds: type === 'quiz' ? 600 : type === 'reading' ? 480 : 720,
        videoUrl: type === 'video' ? '/videos/lesson-demo.mp4' : '',
        videoType: 'url',
        content: '',
        isFreePreview: false,
        resources: [],
      };

      if (type === 'quiz') {
        newLesson.quiz = {
          title: 'Assessment Quiz',
          passingScore: 70,
          questions: [
            {
              question: 'What is the primary concept covered here?',
              options: ['High scalability', 'Lower latency', 'Type safety', 'All of the above'],
              correctAnswer: 3,
              explanation: 'All options are valid benefits of this architecture.',
            },
          ],
        };
      }

      copy[mIdx].lessons.push(newLesson);
      return copy;
    });
  };

  const handleRemoveLesson = (mIdx, lIdx) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[mIdx].lessons = copy[mIdx].lessons.filter((_, i) => i !== lIdx);
      return copy;
    });
  };

  const handleLessonFieldChange = (mIdx, lIdx, field, val) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[mIdx].lessons[lIdx][field] = val;
      return copy;
    });
  };

  // ================= DOCUMENT MANAGEMENT =================
  const openDocumentModal = (target) => {
    setDocumentModalTarget(target);
    setDocModalTab('upload');
    setDocFormTitle('');
    setDocFormUrl('');
    setDocFormType('pdf');
    setDocFormSize('');
  };

  const closeDocumentModal = () => {
    setDocumentModalTarget(null);
  };

  // Upload a real document file via /api/upload/document
  const handleUploadDocumentFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingDoc(true);
      const formData = new FormData();
      formData.append('file', file);
      if (docFormTitle.trim()) {
        formData.append('title', docFormTitle.trim());
      }

      const res = await api.uploadDocument(formData);
      if (res.success && res.file) {
        addToast(`Document "${res.file.originalname}" uploaded successfully!`, 'success');

        const newDoc = {
          title: docFormTitle.trim() || res.file.originalname,
          url: res.file.url,
          type: res.file.type || 'document',
          size: res.file.size,
          filename: res.file.filename,
        };

        attachDocumentToTarget(newDoc);
        closeDocumentModal();
      }
    } catch (err) {
      addToast(err.message || 'Failed to upload document file', 'error');
    } finally {
      setIsUploadingDoc(false);
      if (docFileInputRef.current) docFileInputRef.current.value = '';
    }
  };

  // Save manual external document URL or preset
  const handleSaveDocumentLink = (e) => {
    e.preventDefault();
    if (!docFormTitle.trim() || !docFormUrl.trim()) {
      addToast('Please provide both document title and link URL', 'error');
      return;
    }

    const newDoc = {
      title: docFormTitle.trim(),
      url: docFormUrl.trim(),
      type: docFormType,
      size: docFormSize.trim() || 'External',
    };

    attachDocumentToTarget(newDoc);
    closeDocumentModal();
    addToast('Document resource attached!', 'success');
  };

  const handlePickPresetDocument = (preset) => {
    attachDocumentToTarget({ ...preset });
    closeDocumentModal();
    addToast(`Attached sample document "${preset.title}"`, 'success');
  };

  // Attach the document to either course or lesson
  const attachDocumentToTarget = (doc) => {
    if (!documentModalTarget) return;

    if (documentModalTarget.type === 'course') {
      setCourseResources((prev) => [...prev, doc]);
    } else if (documentModalTarget.type === 'lesson') {
      const { mIdx, lIdx } = documentModalTarget;
      setModules((prev) => {
        const copy = [...prev];
        const lesson = copy[mIdx].lessons[lIdx];
        if (!lesson.resources) lesson.resources = [];
        lesson.resources.push(doc);
        return copy;
      });
    }
  };

  const handleRemoveCourseDocument = (idx) => {
    setCourseResources((prev) => prev.filter((_, i) => i !== idx));
    addToast('Course document removed', 'info');
  };

  const handleRemoveLessonDocument = (mIdx, lIdx, rIdx) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[mIdx].lessons[lIdx].resources = copy[mIdx].lessons[lIdx].resources.filter((_, i) => i !== rIdx);
      return copy;
    });
    addToast('Lesson document removed', 'info');
  };

  // ================= VIDEO UPLOAD & MANAGEMENT =================
  const triggerVideoUpload = (target) => {
    setVideoUploadTarget(target);
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
      videoFileInputRef.current.click();
    }
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !videoUploadTarget) return;

    try {
      setIsUploadingVideo(true);
      addToast(`Uploading video "${file.name}"... This may take a moment.`, 'info');

      const formData = new FormData();
      formData.append('file', file);

      const res = await api.uploadVideo(formData);
      if (res.success && res.file) {
        addToast(`Video "${file.name}" uploaded successfully!`, 'success');

        if (videoUploadTarget.type === 'course') {
          setPreviewVideo(res.file.url);
        } else if (videoUploadTarget.type === 'lesson') {
          const { mIdx, lIdx } = videoUploadTarget;
          setModules((prev) => {
            const copy = [...prev];
            copy[mIdx].lessons[lIdx].videoUrl = res.file.url;
            copy[mIdx].lessons[lIdx].videoType = 'upload';
            return copy;
          });
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to upload video file', 'error');
    } finally {
      setIsUploadingVideo(false);
      setVideoUploadTarget(null);
    }
  };

  const handlePickPresetVideo = (target, presetUrl) => {
    if (target.type === 'course') {
      setPreviewVideo(presetUrl);
    } else if (target.type === 'lesson') {
      const { mIdx, lIdx } = target;
      setModules((prev) => {
        const copy = [...prev];
        copy[mIdx].lessons[lIdx].videoUrl = presetUrl;
        return copy;
      });
    }
    addToast('Video preset selected!', 'success');
  };

  // Helper badge color for document types
  const getDocBadgeClass = (type) => {
    switch (type) {
      case 'pdf':
        return 'badge-purple';
      case 'archive':
        return 'badge-amber';
      case 'code':
        return 'badge-emerald';
      case 'slides':
        return 'badge-cyan';
      default:
        return 'badge-indigo';
    }
  };

  // ================= SAVE COURSE =================
  const handleSaveCourse = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!title.trim() || !subtitle.trim() || !description.trim()) {
      addToast('Please fill in title, subtitle, and description', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      category,
      level,
      price: Number(price),
      thumbnail,
      previewVideo,
      resources: courseResources,
      modules,
      whatYouWillLearn: whatYouWillLearn.filter((i) => i.trim() !== ''),
      requirements: requirements.filter((i) => i.trim() !== ''),
    };

    try {
      setIsSaving(true);
      if (isEditing) {
        const res = await api.updateCourse(id, payload);
        if (res.success) {
          addToast('Course and materials updated successfully!', 'success');
          navigate('/instructor');
        }
      } else {
        const res = await api.createCourse(payload);
        if (res.success) {
          addToast('Course created and published with all materials!', 'success');
          navigate('/instructor');
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to save course', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-secondary)' }}>
        <RefreshCw size={36} className="spinning" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <p>Loading course creator studio...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      {/* Hidden file input for video uploads */}
      <input
        type="file"
        ref={videoFileInputRef}
        onChange={handleVideoFileChange}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska"
        style={{ display: 'none' }}
      />

      <div className="container">
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/instructor" className="btn-icon">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-amber">Instructor Studio</span>
                <span className="badge badge-indigo">Videos & Documents Supported</span>
              </div>
              <h1 style={{ fontSize: '2rem', marginTop: '4px' }}>
                {isEditing ? 'Course Editor Studio' : 'Create a New Course'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Add video lectures, upload PDF documents, starter code, and create interactive assessments.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveCourse}
            disabled={isSaving || isUploadingVideo || isUploadingDoc}
            className="btn btn-primary btn-lg"
          >
            <Save size={18} /> {isSaving ? 'Saving Course...' : 'Save & Publish Course'}
          </button>
        </div>

        <form onSubmit={handleSaveCourse}>
          {/* ================= SECTION 1: COURSE METADATA & PREVIEW VIDEO ================= */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} color="var(--brand-primary)" /> 1. Course Overview & Metadata
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="form-two-col">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Course Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Modern Full-Stack Web Development Bootcamp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Subtitle / Hook *</label>
                <input
                  type="text"
                  placeholder="e.g. Master React, Node.js, Express, and MongoDB by building 10 production projects."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="form-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹ INR, 0 for Free)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Course Description *</label>
                <textarea
                  placeholder="Write a thorough summary of what students will achieve in this course..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  style={{ minHeight: '110px' }}
                  required
                />
              </div>
            </div>

            {/* Course Preview Video Configurator */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Film size={18} color="var(--brand-primary)" />
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Course Preview Trailer Video</span>
                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>MP4 / YouTube / Vimeo</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => triggerVideoUpload({ type: 'course' })}
                    disabled={isUploadingVideo}
                    className="btn btn-secondary btn-sm"
                  >
                    <UploadCloud size={14} /> {isUploadingVideo ? 'Uploading...' : 'Upload Video File'}
                  </button>

                  {previewVideo && (
                    <button
                      type="button"
                      onClick={() => setActivePreviewVideo({ url: previewVideo, title: `${title || 'Course'} Preview Trailer` })}
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={14} /> Preview Video
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Direct MP4 URL, YouTube link (e.g. https://www.youtube.com/watch?v=...), or uploaded path"
                  value={previewVideo}
                  onChange={(e) => setPreviewVideo(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, minWidth: '260px' }}
                />

                {/* Preset dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) setPreviewVideo(e.target.value);
                  }}
                  className="form-select"
                  style={{ width: 'auto', minWidth: '160px', fontSize: '0.825rem' }}
                  defaultValue=""
                >
                  <option value="" disabled>Quick Preset Video...</option>
                  {PRESET_VIDEOS.map((pv, idx) => (
                    <option key={idx} value={pv.url}>{pv.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course-Wide Documents & Syllabus Materials */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="#a855f7" />
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Course-Wide Downloadable Documents & Resources</span>
                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    {courseResources.length} {courseResources.length === 1 ? 'file' : 'files'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openDocumentModal({ type: 'course' })}
                  className="btn btn-secondary btn-sm"
                >
                  <FolderPlus size={14} /> Add Course Document
                </button>
              </div>

              {courseResources.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  No course-wide documents attached yet. Add Master Syllabus PDFs, starter code archives, or cheatsheets for your students.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {courseResources.map((res, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.8rem',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <File size={16} color="var(--brand-primary)" />
                        <span style={{ fontWeight: '600' }}>{res.title}</span>
                        <span className={`badge ${getDocBadgeClass(res.type)}`} style={{ fontSize: '0.65rem' }}>
                          {res.type?.toUpperCase()}
                        </span>
                        {res.size && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({res.size})</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon"
                          title="Open / Download Document"
                        >
                          <ExternalLink size={14} color="var(--brand-primary)" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveCourseDocument(rIdx)}
                          className="btn-icon"
                          title="Delete Document"
                        >
                          <Trash2 size={14} color="#f43f5e" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= SECTION 2: SYLLABUS, LESSONS, VIDEOS & DOCUMENTS ================= */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} color="var(--brand-primary)" /> 2. Curriculum, Video Lessons & Materials
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                  Organize modules, upload lecture videos, attach lesson study documents (PDFs, Code), and configure quizzes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddModule}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={15} /> Add New Module
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              {modules.map((mod, mIdx) => (
                <div
                  key={mIdx}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  {/* Module Title Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--brand-primary)' }}>
                      Module {mIdx + 1}:
                    </span>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => handleModuleTitleChange(mIdx, e.target.value)}
                      className="form-input"
                      style={{ flex: 1, fontWeight: '600' }}
                    />
                    {modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(mIdx)}
                        className="btn-icon"
                        title="Delete Module"
                      >
                        <Trash2 size={16} color="#f43f5e" />
                      </button>
                    )}
                  </div>

                  {/* Lessons list inside module */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginLeft: '0.5rem' }}>
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        style={{
                          padding: '1.2rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {/* Lesson Top Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                          {lesson.type === 'quiz' ? (
                            <HelpCircle size={18} color="#a855f7" />
                          ) : lesson.type === 'reading' ? (
                            <FileText size={18} color="#10b981" />
                          ) : (
                            <Video size={18} color="#6366f1" />
                          )}

                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                            Lesson {lIdx + 1}:
                          </span>

                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'title', e.target.value)}
                            className="form-input"
                            style={{ flex: 1, minWidth: '220px', fontWeight: '600' }}
                            placeholder="Lesson Title"
                          />

                          <select
                            value={lesson.type || 'video'}
                            onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'type', e.target.value)}
                            className="form-select"
                            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                          >
                            <option value="video">Video Lecture</option>
                            <option value="reading">Reading / Document</option>
                            <option value="quiz">Quiz Assessment</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(mIdx, lIdx)}
                            className="btn-icon"
                            title="Delete Lesson"
                          >
                            <Trash2 size={15} color="#f43f5e" />
                          </button>
                        </div>

                        {/* ============ LESSON TYPE: VIDEO ============ */}
                        {lesson.type === 'video' && (
                          <div
                            style={{
                              padding: '1rem',
                              background: 'var(--bg-tertiary)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              marginBottom: '1rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                              <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Film size={14} /> Lecture Video Source & Duration:
                              </span>

                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button
                                  type="button"
                                  onClick={() => triggerVideoUpload({ type: 'lesson', mIdx, lIdx })}
                                  disabled={isUploadingVideo}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                                >
                                  <UploadCloud size={13} /> {isUploadingVideo ? 'Uploading...' : 'Upload Video File'}
                                </button>

                                {lesson.videoUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setActivePreviewVideo({ url: lesson.videoUrl, title: lesson.title })}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                                  >
                                    <Eye size={13} /> Preview Video
                                  </button>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: '0.8rem', alignItems: 'center' }} className="form-two-col">
                              <input
                                type="text"
                                placeholder="Video URL (MP4, WebM, YouTube, Vimeo, or /uploads/...)"
                                value={lesson.videoUrl}
                                onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'videoUrl', e.target.value)}
                                className="form-input"
                                style={{ fontSize: '0.85rem' }}
                              />

                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={14} color="var(--text-muted)" />
                                <input
                                  type="text"
                                  placeholder="12:30"
                                  value={lesson.duration}
                                  onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'duration', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '0.85rem' }}
                                  title="Video Duration (MM:SS)"
                                />
                              </div>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                <input
                                  type="checkbox"
                                  checked={lesson.isFreePreview}
                                  onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'isFreePreview', e.target.checked)}
                                />
                                Free Preview
                              </label>
                            </div>

                            {/* Preset Quick-Pills for Video */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sample Videos:</span>
                              {PRESET_VIDEOS.map((pv, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => handlePickPresetVideo({ type: 'lesson', mIdx, lIdx }, pv.url)}
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    background: lesson.videoUrl === pv.url ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-card)',
                                    border: lesson.videoUrl === pv.url ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                                    color: lesson.videoUrl === pv.url ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {pv.label.split('(')[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ============ LESSON TYPE: READING ============ */}
                        {lesson.type === 'reading' && (
                          <div
                            style={{
                              padding: '1rem',
                              background: 'var(--bg-tertiary)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              marginBottom: '1rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                              <span style={{ fontSize: '0.825rem', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FileText size={14} /> Reading Material & Document Article:
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={14} color="var(--text-muted)" />
                                <input
                                  type="text"
                                  placeholder="08:00 (Est. Read Time)"
                                  value={lesson.duration}
                                  onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'duration', e.target.value)}
                                  className="form-input"
                                  style={{ width: '130px', fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                                />
                              </div>
                            </div>

                            <textarea
                              placeholder="Write lecture notes, formatted article explanations, code snippets, or reference guide..."
                              value={lesson.content || ''}
                              onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'content', e.target.value)}
                              className="form-textarea"
                              style={{ minHeight: '100px', fontSize: '0.85rem' }}
                            />
                          </div>
                        )}

                        {/* ============ LESSON TYPE: QUIZ ============ */}
                        {lesson.type === 'quiz' && (
                          <div
                            style={{
                              padding: '1rem',
                              background: 'var(--bg-tertiary)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              marginBottom: '1rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                                <Award size={12} style={{ marginRight: '4px' }} /> Assessment Quiz ({lesson.quiz?.questions?.length || 0} Questions)
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Passing Score (%):</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={lesson.quiz?.passingScore ?? 70}
                                  onChange={(e) => {
                                    const copy = [...modules];
                                    if (!copy[mIdx].lessons[lIdx].quiz) {
                                      copy[mIdx].lessons[lIdx].quiz = { title: lesson.title, passingScore: 70, questions: [] };
                                    }
                                    copy[mIdx].lessons[lIdx].quiz.passingScore = Number(e.target.value);
                                    setModules(copy);
                                  }}
                                  className="form-input"
                                  style={{ width: '65px', padding: '0.3rem', fontSize: '0.85rem' }}
                                />

                                <button
                                  type="button"
                                  onClick={() => {
                                    const copy = [...modules];
                                    if (!copy[mIdx].lessons[lIdx].quiz) {
                                      copy[mIdx].lessons[lIdx].quiz = { title: lesson.title, passingScore: 70, questions: [] };
                                    }
                                    if (!copy[mIdx].lessons[lIdx].quiz.questions) copy[mIdx].lessons[lIdx].quiz.questions = [];
                                    copy[mIdx].lessons[lIdx].quiz.questions.push({
                                      question: `Question ${copy[mIdx].lessons[lIdx].quiz.questions.length + 1}: What is the expected behavior?`,
                                      options: ['Option A', 'Option B', 'Option C', 'Option D'],
                                      correctAnswer: 0,
                                      explanation: 'Option A is the correct answer.',
                                    });
                                    setModules(copy);
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                                >
                                  <Plus size={12} /> Add Question
                                </button>
                              </div>
                            </div>

                            {/* Questions list */}
                            {(lesson.quiz?.questions || []).map((q, qIdx) => (
                              <div
                                key={qIdx}
                                style={{
                                  padding: '0.8rem',
                                  background: 'var(--bg-card)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--border-glass)',
                                  marginBottom: '0.6rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.6rem',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Question {qIdx + 1}</span>
                                  {lesson.quiz.questions.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const copy = [...modules];
                                        copy[mIdx].lessons[lIdx].quiz.questions = copy[mIdx].lessons[lIdx].quiz.questions.filter((_, i) => i !== qIdx);
                                        setModules(copy);
                                      }}
                                      className="btn-icon"
                                    >
                                      <Trash2 size={13} color="#f43f5e" />
                                    </button>
                                  )}
                                </div>

                                <input
                                  type="text"
                                  value={q.question}
                                  onChange={(e) => {
                                    const copy = [...modules];
                                    copy[mIdx].lessons[lIdx].quiz.questions[qIdx].question = e.target.value;
                                    setModules(copy);
                                  }}
                                  className="form-input"
                                  style={{ fontSize: '0.85rem' }}
                                  placeholder="Enter question prompt..."
                                />

                                {/* 4 options */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                  {(q.options || ['A', 'B', 'C', 'D']).map((opt, optIdx) => {
                                    const isCorrect = q.correctAnswer === optIdx;
                                    return (
                                      <div
                                        key={optIdx}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.4rem',
                                          background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                                          padding: '0.3rem 0.5rem',
                                          borderRadius: '4px',
                                          border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                                        }}
                                      >
                                        <input
                                          type="radio"
                                          name={`q-${mIdx}-${lIdx}-${qIdx}`}
                                          checked={isCorrect}
                                          onChange={() => {
                                            const copy = [...modules];
                                            copy[mIdx].lessons[lIdx].quiz.questions[qIdx].correctAnswer = optIdx;
                                            setModules(copy);
                                          }}
                                        />
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const copy = [...modules];
                                            copy[mIdx].lessons[lIdx].quiz.questions[qIdx].options[optIdx] = e.target.value;
                                            setModules(copy);
                                          }}
                                          className="form-input"
                                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.4rem' }}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ============ LESSON ATTACHED DOCUMENTS & MATERIALS ============ */}
                        <div
                          style={{
                            padding: '0.9rem',
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-glass)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <FileText size={15} color="var(--brand-primary)" />
                              <span style={{ fontSize: '0.825rem', fontWeight: '600' }}>
                                Lesson Documents & Materials ({lesson.resources?.length || 0})
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => openDocumentModal({ type: 'lesson', mIdx, lIdx })}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                            >
                              <Plus size={13} /> Add Document / File
                            </button>
                          </div>

                          {(!lesson.resources || lesson.resources.length === 0) ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                              No documents attached to this lesson. You can attach PDFs, code snippets, exercise sheets, or slide decks.
                            </p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {lesson.resources.map((res, rIdx) => (
                                <div
                                  key={rIdx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.45rem 0.7rem',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-subtle)',
                                    fontSize: '0.8rem',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <File size={14} color="var(--brand-primary)" />
                                    <span style={{ fontWeight: '500' }}>{res.title}</span>
                                    <span className={`badge ${getDocBadgeClass(res.type)}`} style={{ fontSize: '0.65rem' }}>
                                      {res.type?.toUpperCase()}
                                    </span>
                                    {res.size && (
                                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({res.size})</span>
                                    )}
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <a
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-icon"
                                      title="Open Document"
                                    >
                                      <ExternalLink size={13} color="var(--brand-primary)" />
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveLessonDocument(mIdx, lIdx, rIdx)}
                                      className="btn-icon"
                                      title="Delete Document"
                                    >
                                      <Trash2 size={13} color="#f43f5e" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add Lesson Buttons */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => handleAddLesson(mIdx, 'video')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Plus size={14} /> Add Video Lesson
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddLesson(mIdx, 'reading')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Plus size={14} /> Add Reading / Document
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddLesson(mIdx, 'quiz')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Plus size={14} /> Add Quiz Lesson
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= SECTION 3: LEARNING OUTCOMES ================= */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} color="#10b981" /> 3. What Students Will Learn
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {whatYouWillLearn.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const copy = [...whatYouWillLearn];
                      copy[idx] = e.target.value;
                      setWhatYouWillLearn(copy);
                    }}
                    className="form-input"
                    placeholder="e.g. Build responsive React web apps"
                  />
                  {whatYouWillLearn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setWhatYouWillLearn((p) => p.filter((_, i) => i !== idx))}
                      className="btn-icon"
                    >
                      <Trash2 size={16} color="#f43f5e" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setWhatYouWillLearn((p) => [...p, ''])}
                className="btn btn-secondary btn-sm"
                style={{ alignSelf: 'flex-start', marginTop: '0.4rem' }}
              >
                <Plus size={14} /> Add Learning Outcome
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/instructor" className="btn btn-secondary btn-lg">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving || isUploadingVideo || isUploadingDoc}
              className="btn btn-primary btn-lg"
            >
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save & Publish Course'}
            </button>
          </div>
        </form>
      </div>

      {/* ================= MODAL: ADD / UPLOAD DOCUMENT ================= */}
      {documentModalTarget && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={closeDocumentModal}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FolderPlus size={22} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.3rem' }}>
                  {documentModalTarget.type === 'course' ? 'Attach Course Document' : 'Attach Lesson Document'}
                </h3>
              </div>
              <button onClick={closeDocumentModal} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs: Upload File / External Link / Preset Samples */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setDocModalTab('upload')}
                className={`btn btn-sm ${docModalTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <UploadCloud size={14} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setDocModalTab('link')}
                className={`btn btn-sm ${docModalTab === 'link' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <LinkIcon size={14} /> External Link / URL
              </button>
              <button
                type="button"
                onClick={() => setDocModalTab('presets')}
                className={`btn btn-sm ${docModalTab === 'presets' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Sparkles size={14} /> Sample Templates
              </button>
            </div>

            {/* Tab 1: Upload Real File */}
            {docModalTab === 'upload' && (
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Upload a PDF, presentation slides, source code ZIP, or document file (up to 50 MB).
                </p>

                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                  <label className="form-label">Custom Display Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Complete JavaScript Cheatsheet (PDF)"
                    value={docFormTitle}
                    onChange={(e) => setDocFormTitle(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div
                  style={{
                    border: '2px dashed var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    background: 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => docFileInputRef.current?.click()}
                >
                  <UploadCloud size={36} color="var(--brand-primary)" style={{ margin: '0 auto 0.8rem', display: 'block' }} />
                  <p style={{ fontWeight: '600', marginBottom: '0.3rem' }}>
                    {isUploadingDoc ? 'Uploading document...' : 'Click to browse or drop file here'}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Supported: PDF, DOCX, PPTX, ZIP, TXT, MD, Code files
                  </span>
                </div>

                <input
                  type="file"
                  ref={docFileInputRef}
                  onChange={handleUploadDocumentFile}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {/* Tab 2: Manual External Link */}
            {docModalTab === 'link' && (
              <form onSubmit={handleSaveDocumentLink}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Document Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Official React Documentation & Cheatsheet"
                    value={docFormTitle}
                    onChange={(e) => setDocFormTitle(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Document or Resource URL *</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or https://github.com/..."
                    value={docFormUrl}
                    onChange={(e) => setDocFormUrl(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Document Type</label>
                    <select
                      value={docFormType}
                      onChange={(e) => setDocFormType(e.target.value)}
                      className="form-select"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="document">Word / Text Doc</option>
                      <option value="slides">Presentation Slides</option>
                      <option value="archive">ZIP / Code Archive</option>
                      <option value="code">Source Code File</option>
                      <option value="link">Web Link / Resource</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Size / Info (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 2.4 MB or 15 pages"
                      value={docFormSize}
                      onChange={(e) => setDocFormSize(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Attach Document Resource
                </button>
              </form>
            )}

            {/* Tab 3: Presets */}
            {docModalTab === 'presets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Select from ready-to-use sample documents to quickly populate your curriculum:
                </p>

                {PRESET_DOCUMENTS.map((preset, pIdx) => (
                  <div
                    key={pIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.8rem',
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                    onClick={() => handlePickPresetDocument(preset)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <File size={16} color="var(--brand-primary)" />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{preset.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {preset.type.toUpperCase()} • {preset.size}
                        </div>
                      </div>
                    </div>

                    <span className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                      Attach
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: VIDEO TEST PLAYER PREVIEW ================= */}
      {activePreviewVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
          }}
          onClick={() => setActivePreviewVideo(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '850px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Film size={18} color="var(--brand-primary)" />
                <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                  {activePreviewVideo.title || 'Video Player Preview'}
                </span>
              </div>
              <button onClick={() => setActivePreviewVideo(null)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1rem', background: '#000' }}>
              <VideoPlayer
                videoUrl={activePreviewVideo.url}
                title={activePreviewVideo.title}
              />
            </div>

            <div style={{ padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Source URL: <code style={{ color: 'var(--brand-primary)' }}>{activePreviewVideo.url}</code></span>
              <button onClick={() => setActivePreviewVideo(null)} className="btn btn-secondary btn-sm">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .form-two-col {
            grid-template-columns: 1fr !important;
          }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
