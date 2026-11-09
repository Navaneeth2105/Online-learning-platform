const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Course = require('./models/Course');
const seedData = require('./seeders/seed');

const path = require('path');
const fs = require('fs');

// Load environment variables (from server/.env or root)
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Static Uploads
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/instructor', require('./routes/instructorRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SkillForge MERN LMS',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend build if dist directory exists
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root welcome message for API-only mode
  app.get('/', (req, res) => {
    res.send('SkillForge Online Learning Platform API is running smoothly.');
  });
}

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const DEFAULT_PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await connectDB();

    // Check if database has courses; if empty, auto-seed
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('Database empty! Auto-seeding initial courses, users and quizzes...');
      await seedData();
    }

    const listenOnPort = (port) => {
      const server = app.listen(port, () => {
        console.log(`====================================================`);
        console.log(` SkillForge API Server running on port ${port} `);
        console.log(` API Health Check: http://localhost:${port}/api/health `);
        console.log(`====================================================`);
      });

      server.on('error', (error) => {
        if (error && error.code === 'EADDRINUSE' && port < 5100) {
          console.warn(`Port ${port} is busy. Retrying on ${port + 1}...`);
          listenOnPort(port + 1);
          return;
        }

        console.error('Failed to start server:', error.message);
        process.exit(1);
      });
    };

    listenOnPort(DEFAULT_PORT);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
