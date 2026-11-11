SkillForge — Modern Full-Stack MERN Online Learning Platform

SkillForge is an interactive, production-grade **Learning Management System (LMS)** built with modern web technologies: **React**, **Express**, **Node.js**, and **MongoDB**. Designed with contemporary aesthetics (glassmorphism, dark/light themes, sleek animations), it delivers an engaging classroom experience for learners, instructors, and administrators.

---

 Key Features

For Learners & Students
 **Smart Video Classroom**: Responsive video player with speed adjustments (0.75x–2x), continuous autoplay, and lecture progress tracking.
 **Interactive Graded Quizzes**: In-module assessments with instant scoring, passing threshold evaluations, and detailed answer explanations.
 **Timestamped Lecture Notes**: Write personal notes synchronized to the video playback time; click any note timestamp to jump to that moment in the video.
 **Verifiable Digital Certificates**: Automatically earned upon 100% course completion with unique credential IDs (e.g. `CERT-SKILLFORGE-2026-UX99`), printable canvas, PDF export, and shareable verification links.
 **Public Credential Ledger**: Dedicated `/verify` page where anyone can look up and authenticate completion certificates.
 **Course Discovery & Filtering**: Search by keyword, multi-category chips, difficulty level, price type (free/paid), and sorting options.
 **Student Dashboard & Profile**: Track active vs. completed courses, certificate collections, profile bios, and credentials.

👩‍🏫 For Instructors & Creators
 Creator Studio Analytics**: Monitor total enrolled students, estimated gross revenue, course counts, and average star ratings.
 Visual Course Editor**: Dynamic syllabus builder with multi-module structuring, video lectures, and quiz assessment question designer.
 Course Catalog Management**: Edit, publish, review, or delete courses.

System & Developer Experience
 Zero-Config Standalone Execution**: Auto-detects environment; seamlessly starts an in-memory MongoDB server if no external database URI is configured.
 Auto-Seeding Engine**: Initializes comprehensive demo courses, interactive quizzes, student enrollments, and reviews on first boot.
 1-Click Demo Login**: Quick-access buttons for Student, Instructor, and Admin roles.
 JWT & Role-Based Access Control**: Secure token authentication with student, instructor, and admin route protection.


Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router 6, Lucide React, Canvas Confetti |
| **Styling** | Vanilla CSS Design System with CSS variables, Glassmorphism & Micro-animations |
| **Backend** | Node.js, Express 4, Morgan logger, CORS, Dotenv |
| **Database** | MongoDB with Mongoose 8 & MongoDB Memory Server (zero-config fallback) |
| **Authentication** | JWT (JSON Web Tokens) & BcryptJS password hashing |

---

Project Structure

text
Online-Learning-Platform/
├── client/                      # Frontend Single Page App
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, Footer, VideoPlayer, QuizModal, etc.)
│   │   ├── context/             # React Context (Auth, Theme, Toast)
│   │   ├── pages/               # Views (Home, Courses, CourseDetails, CourseLearn, etc.)
│   │   ├── services/            # API Client wrapper
│   │   └── styles/              # Global CSS tokens and component stylesheets
│   ├── index.html               # Main HTML entry with typography
│   └── vite.config.js           # Vite configuration & proxy settings
│
├── server/                      # Backend API Server
│   ├── config/                  # Database connectivity & memory server
│   ├── controllers/             # Auth, Course, Enrollment, Instructor, Review handlers
│   ├── middleware/              # Auth protect, OptionalProtect, Role auth, Error handling
│   ├── models/                  # Mongoose schemas (User, Course, Enrollment, Review)
│   ├── routes/                  # Express RESTful endpoints
│   ├── seeders/                 # Realistic mock data and database seeder
│   └── server.js                # Server entry point with static client serving
│
├── package.json                 # Monorepo root scripts (dev, build, start)
└── README.md                    # Platform documentation

 Quick Start Guide
 
Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

1. Installation
Install dependencies for both server and client:
```bash
npm run install-all
```

2. Running in Development Mode
Start both backend API (`port 5000`) and Vite client (`port 3000`) concurrently:
```bash
npm run dev
```
Open your browser at `http://localhost:3000/`.

3. Production Build & Serving
Build the optimized frontend distribution and start the server:
```bash
npm run build
npm start
```
The full application will be accessible at `http://localhost:5000/`.



 Demo Credentials

| Role | Email | Password | Quick Action |
| :--- | :--- | :--- | :--- |
| **Student** | `student@skillforge.com` | `password123` | Click **Student** on the `/login` page |
| **Instructor** | `instructor@skillforge.com` | `password123` | Click **Instructor** on the `/login` page |
| **Admin** | `admin@skillforge.com` | `password123` | Click **Admin** on the `/login` page |
| **Certificate Verification** | N/A | N/A | Enter `CERT-SKILLFORGE-2026-UX99` on `/verify` |



API Endpoint Overview

Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Authenticate user and receive JWT
- `GET /api/auth/me` — Get current logged-in user profile
- `PUT /api/auth/profile` — Update name, avatar, bio, headline, skills
- `PUT /api/auth/change-password` — Update user password

 Courses (`/api/courses`)
- `GET /api/courses` — Search, filter, and sort published courses
- `GET /api/courses/featured` — Get featured and popular courses
- `GET /api/courses/categories` — Get category list and course counts
- `GET /api/courses/:idOrSlug` — Get single course details (with optional user enrollment status)
- `GET /api/courses/:id/learn` — Get full curriculum and progress (for enrolled students)

Enrollments & Learning (`/api/enrollments`)
- `POST /api/enrollments/enroll/:courseId` — Enroll in a course
- `GET /api/enrollments/my-learning` — Get all enrolled courses for current user
- `POST /api/enrollments/:courseId/progress` — Toggle lesson completion status
- `POST /api/enrollments/:courseId/quiz` — Submit quiz answers for instant grading
- `POST /api/enrollments/:courseId/notes` — Save timestamped lecture note
- `DELETE /api/enrollments/:courseId/notes/:noteId` — Delete lecture note
- `GET /api/enrollments/certificate/:certificateId` — Public verification lookup for certificate

Instructor Studio (`/api/instructor`)
- `GET /api/instructor/stats` — Revenue, students, course counts, average rating
- `GET /api/instructor/courses` — Get all courses created by instructor
- `POST /api/instructor/courses` — Create and publish a new course
- `PUT /api/instructor/courses/:id` — Update course content & syllabus
- `DELETE /api/instructor/courses/:id` — Delete course and associated records

---

## 📄 License
This project is licensed under the MIT License.
