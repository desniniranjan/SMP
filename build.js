import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';
import { Scanner } from '@tailwindcss/oxide';
import { compile } from '@tailwindcss/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildFrontend({ isDev = false } = {}) {
  const startTime = Date.now();
  const rootDir = __dirname;
  const distDir = path.join(rootDir, 'dist');
  const assetsDir = path.join(distDir, 'assets');

  // Ensure directories exist
  fs.mkdirSync(assetsDir, { recursive: true });

  // 1. Bundle React JSX with esbuild
  await esbuild.build({
    entryPoints: [path.join(rootDir, 'src/main.jsx')],
    bundle: true,
    outfile: path.join(assetsDir, 'index.js'),
    format: 'esm',
    target: ['es2020'],
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    define: {
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
    },
    plugins: [
      {
        name: 'ignore-css',
        setup(build) {
          // Prevent esbuild from emitting external CSS imports into the JS module bundle
          build.onResolve({ filter: /\.css$/ }, (args) => ({
            path: args.path,
            namespace: 'ignore-css',
          }));
          build.onLoad({ filter: /.*/, namespace: 'ignore-css' }, () => ({
            contents: '',
            loader: 'js',
          }));
        },
      },
    ],
    minify: !isDev,
    sourcemap: isDev,
  });

  // 2. Scan class candidates and compile Tailwind CSS
  const normalizedRootDir = rootDir.replace(/\\/g, '/');
  let candidates = [];

  try {
    const scanner = new Scanner({
      sources: [
        { base: '.', pattern: 'src/**/*.{js,jsx,html}', negated: false },
        { base: '.', pattern: 'index.html', negated: false },
        { base: normalizedRootDir, pattern: 'src/**/*.{js,jsx,html}', negated: false },
        { base: normalizedRootDir, pattern: 'index.html', negated: false },
      ],
    });
    candidates = scanner.scan();
  } catch (scanErr) {
    console.warn('[BUILD] Scanner warning:', scanErr.message);
  }

  // Robust fallback: if scanner returned 0 candidates (e.g. platform path issues), collect tokens directly
  if (!candidates || candidates.length === 0) {
    console.log('[BUILD] Collecting class tokens directly from source files...');
    const tokens = new Set();
    const collectFromDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
          collectFromDir(fullPath);
        } else if (/\.(jsx?|html|css)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const words = content.match(/[^\s"'`<>{}();]+/g) || [];
          for (const w of words) tokens.add(w);
        }
      }
    };
    collectFromDir(path.join(rootDir, 'src'));
    const indexHtmlPath = path.join(rootDir, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      const htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
      const htmlWords = htmlContent.match(/[^\s"'`<>{}();]+/g) || [];
      for (const w of htmlWords) tokens.add(w);
    }
    candidates = Array.from(tokens);
  }

  const inputCss = fs.readFileSync(path.join(rootDir, 'src/index.css'), 'utf-8');
  const compiler = await compile(inputCss, { base: rootDir, onDependency: () => {} });
  const compiledCss = compiler.build(candidates);
  fs.writeFileSync(path.join(assetsDir, 'index.css'), compiledCss, 'utf-8');

  // 3. Generate dist/index.html
  const templateHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  let distHtml = templateHtml;
  if (!distHtml.includes('/assets/index.css')) {
    distHtml = distHtml.replace(
      '</head>',
      '    <link rel="stylesheet" href="/assets/index.css">\n  </head>'
    );
  }
  distHtml = distHtml.replace(
    /<script\s+type="module"\s+src="\/src\/main\.jsx"><\/script>/,
    '<script type="module" src="/assets/index.js"></script>'
  );
  fs.writeFileSync(path.join(distDir, 'index.html'), distHtml, 'utf-8');

  // 4. Copy public assets if public directory exists
  const publicDir = path.join(rootDir, 'public');
  if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, distDir, { recursive: true, errorOnExist: false });
  }

  const duration = Date.now() - startTime;
  console.log(`[BUILD] React frontend built successfully in ${duration}ms (dist/)`);
}

// Allow direct CLI execution: `node build.js`
if (process.argv[1] === __filename) {
  buildFrontend().catch((err) => {
    console.error('[BUILD ERROR]', err);
    process.exit(1);
  });
}
