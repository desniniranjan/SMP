import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildFrontend } from './build.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.FRONTEND_PORT || '5173', 10);
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const distDir = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

async function start() {
  if (!fs.existsSync(indexHtmlPath)) {
    console.log('[FRONTEND] Building application bundle...');
    await buildFrontend({ isDev: true });
  }

  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // 1. Proxy /api requests to backend server
    if (pathname.startsWith('/api')) {
      const targetUrl = new URL(req.url, BACKEND_URL);
      const proxyReq = http.request(
        targetUrl,
        {
          method: req.method,
          headers: {
            ...req.headers,
            host: targetUrl.host,
          },
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        }
      );

      proxyReq.on('error', (err) => {
        console.error(`[FRONTEND PROXY ERROR] Failed to connect to backend at ${BACKEND_URL}:`, err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Bad Gateway: Backend server unreachable',
          backendUrl: BACKEND_URL,
          message: 'Ensure the backend is running via: cd backend && npm start'
        }));
      });

      req.pipe(proxyReq);
      return;
    }

    // 2. Serve static files from dist/
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(distDir, safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // 3. SPA Fallback: serve dist/index.html for any other route
    if (fs.existsSync(indexHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexHtmlPath).pipe(res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Application build missing. Please run "npm run build".');
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`[FRONTEND] Client running at http://localhost:${PORT}`);
    console.log(`[FRONTEND] Proxying /api requests to ${BACKEND_URL}`);
    console.log(`======================================================\n`);
  });
}

start().catch((err) => {
  console.error('[FRONTEND ERROR] Failed to start frontend dev server:', err);
  process.exit(1);
});
