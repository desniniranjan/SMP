import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { buildFrontend } from './build.js';
import { connectDB } from './backend/config/db.js';
import { seedInitialData } from './backend/seed/seed.js';
import authRoutes from './backend/routes/authRoutes.js';
import activityRoutes from './backend/routes/activityRoutes.js';
import verificationRoutes from './backend/routes/verificationRoutes.js';
import reportRoutes from './backend/routes/reportRoutes.js';
import { getApprovedActivities } from './backend/controllers/verificationController.js';
import { protect, optionalProtect } from './backend/middleware/authMiddleware.js';
import { requireAdmin } from './backend/middleware/roleMiddleware.js';
import { login, register, getMe } from './backend/controllers/authController.js';
import User from './backend/models/User.js';

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

  // Detailed & Safe Server-Side Auth Logging Middleware
  const authTraceMiddleware = (req, res, next) => {
    console.log(`\n=================== [AUTH TRACE: LOGIN REQUEST] ===================`);
    console.log(`[AUTH TRACE] Timestamp: ${new Date().toISOString()}`);
    console.log(`[AUTH TRACE] Endpoint: ${req.method} ${req.originalUrl || req.url}`);

    // 1. Explicitly verify Database Connection
    const dbStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    const readyState = mongoose.connection.readyState;
    const isDbConnected = readyState === 1;
    console.log(`[AUTH TRACE] Database Connection Status: ${isDbConnected ? 'VERIFIED (READY)' : 'NOT READY'} (readyState: ${readyState} - ${dbStateMap[readyState] || 'unknown'})`);
    if (isDbConnected && mongoose.connection.db) {
      console.log(`[AUTH TRACE] Target Database: ${mongoose.connection.db.databaseName}`);
    }

    // 2. Explicitly verify Email Normalization
    const { email } = req.body || {};
    if (!email) {
      console.log(`[AUTH TRACE] Payload Warning: Missing 'email' in request body`);
    } else {
      const rawEmail = String(email);
      const normalizedEmail = rawEmail.trim().toLowerCase();
      console.log(`[AUTH TRACE] Email Normalization Trace:`);
      console.log(`  - Raw length: ${rawEmail.length} chars`);
      console.log(`  - Normalized query target: "${normalizedEmail}"`);
      console.log(`  - Leading/trailing whitespace trimmed: ${rawEmail !== rawEmail.trim()}`);
      console.log(`  - Case normalization applied: ${rawEmail !== rawEmail.toLowerCase()}`);
    }
    console.log(`===================================================================\n`);
    next();
  };

  // Primary Auth Endpoints with Trace Middleware
  app.post('/api/login', authTraceMiddleware, login);
  app.post('/api/register', register);
  app.get('/api/me', protect, getMe);

  // Grouped Auth Routes (e.g., /api/auth/login, /api/auth/register, /api/auth/me)
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

  // Development Database Diagnostic Endpoint
  app.get('/api/debug/database', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'Diagnostic endpoint disabled in production',
      });
    }

    try {
      const isConnected = mongoose.connection.readyState === 1;
      let usersCollectionAccessible = false;
      let userCount = 0;

      if (isConnected) {
        userCount = await User.countDocuments();
        usersCollectionAccessible = true;
      }

      return res.status(200).json({
        connected: isConnected,
        usersCollectionAccessible,
        userCount,
      });
    } catch (err) {
      return res.status(500).json({
        connected: mongoose.connection.readyState === 1,
        usersCollectionAccessible: false,
        userCount: 0,
        error: 'Failed to access users collection',
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

  // Handle unmatched API routes with a clean 404 JSON response instead of HTML SPA fallback
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Serve static assets from the React build directory (dist)
  const distPath = path.join(__dirname, 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');

  // Ensure React build exists; in development, rebuild on startup to catch latest changes
  if (process.env.NODE_ENV !== 'production' || !fs.existsSync(indexHtmlPath)) {
    console.log('[SERVER] Ensuring latest React frontend build is ready...');
    await buildFrontend({ isDev: process.env.NODE_ENV !== 'production' });
  }

  app.use(express.static(distPath));

  // Client-side routing fallback for React Router SPA routes
  app.get('*', (req, res) => {
    if (fs.existsSync(indexHtmlPath)) {
      res.sendFile(indexHtmlPath);
    } else {
      res.status(500).send('Application build missing. Please run "npm run build".');
    }
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Activity Portal unified server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[FATAL] Failed to start server:', err.message);
  process.exit(1);
});
