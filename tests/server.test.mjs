import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { createServer } from '../scripts/serve.mjs';
import { distDir } from '../scripts/lib/paths.mjs';

test('the built site serves pages, scripts, and PDFs beneath /portfolio/', async () => {
  const server = createServer({ directory: distDir, basePath: '/portfolio' });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const [route, type, text] of [
      ['/portfolio/', 'text/html', '<html lang="en"'],
      ['/portfolio/ar.html', 'text/html', 'dir="rtl"'],
      ['/portfolio/journey-fr.html', 'text/html', 'world-track'],
      ['/portfolio/assets/css/styles.css', 'text/css', '.hero'],
      ['/portfolio/assets/js/journey.js', 'text/javascript', 'requestAnimationFrame'],
      ['/portfolio/assets/cv/Imad-Chakir-CV-EN.pdf', 'application/pdf', '%PDF-']
    ]) {
      const response = await fetch(origin + route);
      assert.equal(response.status, 200, route);
      assert.ok(response.headers.get('content-type').startsWith(type));
      assert.ok((await response.text()).includes(text));
    }
    for (const route of ['/portfolio/src/content/contact.json', '/portfolio/.git/config', '/portfolio/../README.md', '/ar.html']) {
      assert.equal((await fetch(origin + route)).status, 404, route);
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
