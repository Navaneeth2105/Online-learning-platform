const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['pdf', 'document', 'slides', 'code', 'link', 'video', 'archive', 'other'],
    default: 'pdf',
  },
  size: {
    type: String,
    default: '',
  },
  filename: {
    type: String,
    default: '',
  },
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['video', 'reading', 'quiz'],
    default: 'video',
  },
  duration: {
    type: String,
    default: '10:00',
  },
  durationSeconds: {
    type: Number,
    default: 600,
  },
  videoUrl: {
    type: String,
    default: '',
  },
  videoType: {
    type: String,
    enum: ['upload', 'url', 'youtube', 'vimeo'],
    default: 'url',
  },
  content: {
    type: String,
    default: '',
  },
  resources: [resourceSchema],
  quiz: {
    title: { type: String, default: '' },
    passingScore: { type: Number, default: 70 },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true }, // Index of correct option
        explanation: { type: String, default: '' },
      },
    ],
  },
  isFreePreview: {
    type: Boolean,
    default: false,
  },
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 1,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Please provide a course subtitle'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a full course description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a course category'],
      enum: [
        'Web Development',
        'AI & Machine Learning',
        'Data Science',
        'Cloud & DevOps',
        'Cybersecurity',
        'UI/UX Design',
        'Mobile Development',
        'Software Engineering',
      ],
    },
    level: {
      type: String,
      enum: ['All Levels', 'Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    language: {
      type: String,
      default: 'English',
    },
    price: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    previewVideo: {
      type: String,
      default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    modules: [moduleSchema],
    resources: [resourceSchema],
    tags: [{ type: String }],
    whatYouWillLearn: [{ type: String }],
    requirements: [{ type: String }],
    targetAudience: [{ type: String }],
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    certificateAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before save
courseSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
  }
  this.isFree = this.price === 0;
  next();
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
