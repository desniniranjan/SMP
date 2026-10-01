import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { seedInitialData } from './seed/seed.js';
import authRoutes from './routes/authRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { getApprovedActivities } from './controllers/verificationController.js';
import { protect, optionalProtect } from './middleware/authMiddleware.js';
import { requireAdmin } from './middleware/roleMiddleware.js';
import { login, register, getMe } from './controllers/authController.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  await connectDB();
  await seedInitialData();

  const app = express();
  const PORT = process.env.PORT || 3000;
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. server-to-server, curl, same-origin)
        if (!origin) return callback(null, true);
        if (
          origin.startsWith('http://localhost') ||
          origin.startsWith('http://127.0.0.1')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Safe Server-Side Auth Logging Middleware
  const authTraceMiddleware = (req, res, next) => {
    console.log(`\n=================== [AUTH TRACE: LOGIN REQUEST] ===================`);
    console.log(`[AUTH TRACE] Timestamp: ${new Date().toISOString()}`);
    console.log(`[AUTH TRACE] Endpoint: ${req.method} ${req.originalUrl || req.url}`);

    const readyState = mongoose.connection.readyState;
    const isDbConnected = readyState === 1;
    console.log(`[AUTH TRACE] Database Connection Status: ${isDbConnected ? 'VERIFIED (READY)' : 'NOT READY'}`);
    if (isDbConnected && mongoose.connection.db) {
      console.log(`[AUTH TRACE] Target Database: ${mongoose.connection.db.databaseName}`);
    }

    const { email } = req.body || {};
    if (!email) {
      console.log(`[AUTH TRACE] Payload Warning: Missing 'email' in request body`);
    } else {
      const rawEmail = String(email);
      const normalizedEmail = rawEmail.trim().toLowerCase();
      console.log(`[AUTH TRACE] Target Email: "${normalizedEmail}"`);
    }
    console.log(`===================================================================\n`);
    next();
  };

  // Primary Auth Endpoints
  app.post('/api/login', authTraceMiddleware, login);
  app.post('/api/register', register);
  app.get('/api/me', protect, getMe);

  // Grouped Auth Routes
  app.use('/api/auth/login', authTraceMiddleware);
  app.use('/api/auth', authRoutes);

  // Core Activity & Administrative Verification Routes
  app.use('/api/activities', activityRoutes);
  app.use('/api/verification', verificationRoutes);
  app.use('/api/reports', reportRoutes);
  app.get('/api/approvedActivities', optionalProtect, getApprovedActivities);

  // Admin access to all registered students
  app.get('/api/students', protect, requireAdmin, async (req, res) => {
    try {
      const students = await User.find({ role: 'student' })
        .select('-password')
        .sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (err) {
      console.error('Error fetching students list:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Error fetching students list',
      });
    }
  });

  // Database Diagnostic Endpoint
  app.get('/api/debug/database', async (req, res) => {
    try {
      const isConnected = mongoose.connection.readyState === 1;
      let userCount = 0;
      if (isConnected) {
        userCount = await User.countDocuments();
      }
      return res.status(200).json({
        connected: isConnected,
        usersCollectionAccessible: isConnected,
        userCount,
      });
    } catch (err) {
      return res.status(500).json({
        connected: mongoose.connection.readyState === 1,
        usersCollectionAccessible: false,
        userCount: 0,
        error: 'Failed to access database',
      });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      portal: 'Student Activity Record Management Portal',
      timestamp: new Date().toISOString(),
    });
  });

  // Handle unmatched API routes with clean 404 JSON response
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Optional Frontend static serving if frontend/dist exists
  const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
  const indexHtmlPath = path.join(frontendDistPath, 'index.html');

  if (fs.existsSync(frontendDistPath) && fs.existsSync(indexHtmlPath)) {
    app.use(express.static(frontendDistPath));
    app.get('*', (req, res) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    app.get('/', (req, res) => {
      res.json({
        status: 'online',
        service: 'Student Activity Record Management Portal Backend API',
        endpoints: '/api/*'
      });
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Activity Portal backend running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[FATAL] Failed to start backend server:', err.message);
  process.exit(1);
});
