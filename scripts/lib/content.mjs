import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { sourceDir } from './paths.mjs';
import { locales } from '../../src/config.mjs';

export async function loadContent() {
  const entries = await Promise.all(['contact', ...locales].map(async key => [
    key,
    JSON.parse(await readFile(path.join(sourceDir, 'content', `${key}.json`), 'utf8'))
  ]));
  return Object.fromEntries(entries);
}

export async function loadArtwork(data) {
  const names = new Set(['avatar', ...data.en.chapters.map(chapter => chapter.scene)]);
  const entries = await Promise.all([...names].map(async name => [
    name,
    (await readFile(path.join(sourceDir, 'artwork', `${name}.svg`), 'utf8')).trim()
  ]));
  return Object.fromEntries(entries);
}
