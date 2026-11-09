// Base API Client wrapper with token authentication and error handling

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('skillforge_token') || localStorage.getItem('edupulse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const responseText = await response.text();
  let data = {};

  if (responseText.trim()) {
    if (!contentType.includes('application/json')) {
      throw new Error(
        `API returned an unexpected response (${response.status} ${response.statusText}).`,
      );
    }

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`API returned invalid JSON (${response.status} ${response.statusText}).`);
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status} ${response.statusText}).`,
    );
  }

  return data;
};

export const api = {
  // Authentication
  register: (userData) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handleResponse),

  login: (credentials) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateProfile: (profileData) =>
    fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    }).then(handleResponse),

  changePassword: (passwordData) =>
    fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    }).then(handleResponse),

  // Courses
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/courses?${query}`).then(handleResponse);
  },

  getFeaturedCourses: () =>
    fetch(`${API_BASE}/courses/featured`).then(handleResponse),

  getCategories: () =>
    fetch(`${API_BASE}/courses/categories`).then(handleResponse),

  getCourseDetails: (idOrSlug) =>
    fetch(`${API_BASE}/courses/${idOrSlug}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getCourseCurriculum: (courseId) =>
    fetch(`${API_BASE}/courses/${courseId}/learn`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Enrollments & Progress
  enrollInCourse: (courseId) =>
    fetch(`${API_BASE}/enrollments/enroll/${courseId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  createPayPalOrder: (courseId) =>
    fetch(`${API_BASE}/enrollments/paypal/order/${courseId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  capturePayPalOrder: (orderId) =>
    fetch(`${API_BASE}/enrollments/paypal/capture`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId }),
    }).then(handleResponse),

  createSamplePayment: (courseId) =>
    fetch(`${API_BASE}/enrollments/sample-payment/${courseId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getMyEnrollments: () =>
    fetch(`${API_BASE}/enrollments/my-learning`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateProgress: (courseId, progressData) =>
    fetch(`${API_BASE}/enrollments/${courseId}/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(progressData),
    }).then(handleResponse),

  submitQuiz: (courseId, quizData) =>
    fetch(`${API_BASE}/enrollments/${courseId}/quiz`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(quizData),
    }).then(handleResponse),

  saveNote: (courseId, noteData) =>
    fetch(`${API_BASE}/enrollments/${courseId}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData),
    }).then(handleResponse),

  deleteNote: (courseId, noteId) =>
    fetch(`${API_BASE}/enrollments/${courseId}/notes/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getCertificate: (certificateId) =>
    fetch(`${API_BASE}/enrollments/certificate/${certificateId}`).then(handleResponse),

  // Reviews
  getCourseReviews: (courseId) =>
    fetch(`${API_BASE}/reviews/course/${courseId}`).then(handleResponse),

  addReview: (courseId, reviewData) =>
    fetch(`${API_BASE}/reviews/course/${courseId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    }).then(handleResponse),

  deleteReview: (reviewId) =>
    fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Instructor
  getInstructorStats: () =>
    fetch(`${API_BASE}/instructor/stats`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getInstructorCourses: () =>
    fetch(`${API_BASE}/instructor/courses`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getInstructorCourseById: (courseId) =>
    fetch(`${API_BASE}/instructor/courses/${courseId}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  createCourse: (courseData) =>
    fetch(`${API_BASE}/instructor/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    }).then(handleResponse),

  updateCourse: (courseId, courseData) =>
    fetch(`${API_BASE}/instructor/courses/${courseId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    }).then(handleResponse),

  deleteCourse: (courseId) =>
    fetch(`${API_BASE}/instructor/courses/${courseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // File & Media Uploads
  uploadDocument: (formData) => {
    const token = localStorage.getItem('skillforge_token') || localStorage.getItem('edupulse_token');
    return fetch(`${API_BASE}/upload/document`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(handleResponse);
  },

  uploadVideo: (formData) => {
    const token = localStorage.getItem('skillforge_token') || localStorage.getItem('edupulse_token');
    return fetch(`${API_BASE}/upload/video`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(handleResponse);
  },

  uploadImage: (formData) => {
    const token = localStorage.getItem('skillforge_token') || localStorage.getItem('edupulse_token');
    return fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(handleResponse);
  },
};
