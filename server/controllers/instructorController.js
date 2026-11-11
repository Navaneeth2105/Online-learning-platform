const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');

// @desc    Get instructor dashboard statistics
// @route   GET /api/instructor/stats
// @access  Private (Instructor/Admin)
const getInstructorStats = async (req, res, next) => {
  try {
    const courses = await Course.find();
    const courseIds = courses.map((c) => c._id);

    const totalCourses = courses.length;
    const totalStudents = courses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);

    // Calculate simulated earnings (students * price)
    const totalRevenue = courses.reduce(
      (acc, c) => acc + (c.studentsCount || 0) * (c.price || 0),
      0
    );

    // Calculate overall average rating
    const ratedCourses = courses.filter((c) => c.reviewsCount > 0);
    const avgRating =
      ratedCourses.length > 0
        ? (
            ratedCourses.reduce((acc, c) => acc + c.rating, 0) / ratedCourses.length
          ).toFixed(1)
        : '5.0';

    // Recent enrollments across courses
    const recentEnrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'name email avatar')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalRevenue,
        avgRating,
      },
      recentEnrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses for instructor studio
// @route   GET /api/instructor/courses
// @access  Private (Instructor/Admin)
const getInstructorCourses = async (req, res, next) => {
  try {
    // Return all courses so Explore Courses and Instructor Studio both match
    const courses = await Course.find().populate('instructor', 'name avatar').sort({ createdAt: -1 });

    const formatted = courses.map((c) => {
      let totalLessons = 0;
      if (c.modules) {
        c.modules.forEach((m) => {
          if (m.lessons) totalLessons += m.lessons.length;
        });
      }
      return {
        ...c.toObject(),
        totalLessons,
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      courses: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course for instructor editing
// @route   GET /api/instructor/courses/:id
// @access  Private (Instructor/Admin)
const getInstructorCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (String(course.instructor) !== String(req.user._id) && req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access or edit this course',
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/instructor/courses
// @access  Private (Instructor/Admin)
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level,
      price,
      originalPrice,
      thumbnail,
      previewVideo,
      modules,
      tags,
      whatYouWillLearn,
      requirements,
      targetAudience,
      isPublished,
    } = req.body;

    if (!title || !subtitle || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, subtitle, description, category',
      });
    }

    const course = await Course.create({
      title,
      subtitle,
      description,
      category,
      level: level || 'Beginner',
      price: price !== undefined ? Number(price) : 0,
      originalPrice: originalPrice ? Number(originalPrice) : (price ? Number(price) * 1.5 : 0),
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      previewVideo: previewVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      instructor: req.user._id,
      resources: req.body.resources || [],
      modules: modules && modules.length > 0 ? modules : [
        {
          title: 'Introduction to the Course',
          description: 'Getting started and environment setup',
          order: 1,
          lessons: [
            {
              title: 'Welcome & Course Overview',
              type: 'video',
              duration: '08:15',
              durationSeconds: 495,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              content: 'Welcome to this comprehensive course! Here is what we will cover.',
              isFreePreview: true,
            },
          ],
        },
      ],
      tags: tags || ['E-Learning', 'Full-Stack'],
      whatYouWillLearn: whatYouWillLearn || ['Master fundamental concepts', 'Build real-world projects'],
      requirements: requirements || ['Basic computer knowledge'],
      targetAudience: targetAudience || ['Anyone looking to level up their skills'],
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing course
// @route   PUT /api/instructor/courses/:id
// @access  Private (Instructor/Admin)
const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (String(course.instructor) !== String(req.user._id) && req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/instructor/courses/:id
// @access  Private (Instructor/Admin)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (String(course.instructor) !== String(req.user._id) && req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    await course.deleteOne();
    await Enrollment.deleteMany({ course: req.params.id });
    await Review.deleteMany({ course: req.params.id });

    res.json({
      success: true,
      message: 'Course and related data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstructorStats,
  getInstructorCourses,
  getInstructorCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
