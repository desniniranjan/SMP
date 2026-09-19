import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedInitialData } from './seed/adminSeeder.js';

import authRoutes from './routes/authRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { getApprovedActivities } from './controllers/verificationController.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    portal: 'Student Activity Record Management Portal',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/reports', reportRoutes);

// Exact required endpoint: GET /api/approvedActivities
app.get('/api/approvedActivities', protect, getApprovedActivities);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export const startBackend = async (port = 5000) => {
  await connectDB();
  await seedInitialData();

  return app.listen(port, '0.0.0.0', () => {
    console.log(`Backend Server active on port ${port}`);
  });
};

export default app;
