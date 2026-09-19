import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './backend/config/db.js';
import { seedInitialData } from './backend/seed/adminSeeder.js';
import authRoutes from './backend/routes/authRoutes.js';
import activityRoutes from './backend/routes/activityRoutes.js';
import verificationRoutes from './backend/routes/verificationRoutes.js';
import reportRoutes from './backend/routes/reportRoutes.js';
import { getApprovedActivities } from './backend/controllers/verificationController.js';
import { protect } from './backend/middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  await connectDB();
  await seedInitialData();

  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/activities', activityRoutes);
  app.use('/api/verification', verificationRoutes);
  app.use('/api/reports', reportRoutes);
  app.get('/api/approvedActivities', protect, getApprovedActivities);

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      portal: 'Student Activity Record Management Portal',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware in development or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Activity Portal unified server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
