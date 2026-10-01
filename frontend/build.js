import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

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

  // 2. Compile Tailwind CSS via standard PostCSS (100% pure JS, zero native binaries)
  const inputCssPath = path.join(rootDir, 'src/index.css');
  const inputCss = fs.readFileSync(inputCssPath, 'utf-8');
  const tailwindConfigPath = path.join(rootDir, 'tailwind.config.js');

  const postcssResult = await postcss([
    tailwindcss({ config: tailwindConfigPath }),
    autoprefixer,
  ]).process(inputCss, {
    from: inputCssPath,
    to: path.join(assetsDir, 'index.css'),
  });

  fs.writeFileSync(path.join(assetsDir, 'index.css'), postcssResult.css, 'utf-8');

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
  console.log(`[BUILD] Frontend built successfully in ${duration}ms (frontend/dist/)`);
}

// Allow direct CLI execution: `node build.js`
if (process.argv[1] === __filename) {
  buildFrontend().catch((err) => {
    console.error('[BUILD ERROR]', err);
    process.exit(1);
  });
}
