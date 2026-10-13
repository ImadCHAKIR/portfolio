import { mkdir, copyFile, realpath, rm } from 'node:fs/promises';
import path from 'node:path';
import { buildAssets } from './build-assets.mjs';
import { buildPages } from './build-pages.mjs';
import { root, distDir, isMain } from './lib/paths.mjs';
import { publicFiles } from './lib/public-files.mjs';

export async function buildSite() {
  await buildAssets();
  await buildPages();

  // Remove only the generated output directory, never a redirected/junction path.
  const resolvedRoot = await realpath(root);
  const resolvedDist = await realpath(distDir).catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return path.join(resolvedRoot, 'dist');
  });
  if (resolvedDist !== path.join(resolvedRoot, 'dist')) {
    throw new Error('Refusing to clean a dist directory outside this project.');
  }
  await rm(distDir, { recursive: true, force: true });

  for (const filename of publicFiles) {
    const output = path.join(distDir, filename);
    await mkdir(path.dirname(output), { recursive: true });
    await copyFile(path.join(root, filename), output);
  }
  console.log(`Built ${publicFiles.length} public files in the repository root and dist/.`);
}

if (isMain(import.meta.url)) await buildSite();
