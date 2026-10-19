import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildSite } from './build.mjs';
import { root, isMain } from './lib/paths.mjs';
import { publicFiles } from './lib/public-files.mjs';

const allowedFiles = new Set(publicFiles);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
};

// basePath lets tests exercise the same /portfolio/ URLs used by GitHub Pages.
export function createServer({ directory = root, basePath = '' } = {}) {
  const prefix = basePath.replace(/\/$/, '');
  return http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(prefix + '/')) throw new Error('Unknown base path');
      const relative = pathname.slice(prefix.length + 1) || 'index.html';
      const file = path.resolve(directory, relative);
      if (!allowedFiles.has(relative) || !file.startsWith(path.resolve(directory) + path.sep)) {
        throw new Error('Not a public file');
      }
      const content = await readFile(file);
      response.writeHead(200, {
        'Content-Type': contentTypes[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
}

if (isMain(import.meta.url)) {
  await buildSite();
  const port = Number(process.env.PORT || 4173);
  const basePath = process.env.BASE_PATH || '';
  const server = createServer({ basePath });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Local: http://localhost:${port}${basePath}/`);
    console.log('After editing src/ or public/, run npm run build and refresh the browser.');
  });
}
