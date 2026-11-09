const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  lessonTitle: { type: String, default: '' },
  timestamp: { type: Number, default: 0 },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const quizScoreSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  lessonTitle: { type: String, default: '' },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  attemptedAt: { type: Date, default: Date.now },
});

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    completedLessons: [
      {
        lessonId: { type: String, required: true },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    lastAccessedLesson: {
      moduleId: { type: String, default: '' },
      lessonId: { type: String, default: '' },
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quizScores: [quizScoreSchema],
    notes: [noteSchema],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    certificateId: {
      type: String,
      unique: true,
      sparse: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    paymentProvider: {
      type: String,
      enum: ['paypal', 'sample'],
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['completed'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student can only enroll in a course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
