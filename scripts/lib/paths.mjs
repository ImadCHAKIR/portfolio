import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const sourceDir = path.join(root, 'src');
export const publicDir = path.join(root, 'public');
export const distDir = path.join(root, 'dist');

export function isMain(moduleUrl) {
  return Boolean(process.argv[1]) && moduleUrl === pathToFileURL(path.resolve(process.argv[1])).href;
}
