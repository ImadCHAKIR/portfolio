import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import './build-pages.mjs';
import { publicFiles } from './public-files.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = publicFiles;
for (const file of files) {
  const output = path.join(root, 'dist', file);
  await mkdir(path.dirname(output), { recursive: true });
  await copyFile(path.join(root, file), output);
}
console.log(`Built ${files.length} static files in dist/`);
