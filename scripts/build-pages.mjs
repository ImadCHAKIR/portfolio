import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { root, isMain } from './lib/paths.mjs';
import { loadContent, loadArtwork } from './lib/content.mjs';
import { locales, home, journey, authenticator } from '../src/config.mjs';
import { createPageContext } from '../src/templates/context.mjs';
import { renderPortfolio } from '../src/templates/portfolio.mjs';
import { renderJourney } from '../src/templates/journey.mjs';
import { renderAuthenticator } from '../src/templates/authenticator.mjs';

export async function renderPages() {
  const data = await loadContent();
  const artwork = await loadArtwork(data);
  const pages = new Map();
  for (const lang of locales) {
    const context = createPageContext(data, lang, artwork);
    pages.set(home(lang), renderPortfolio(context).replace(/[ \t]+$/gm, ''));
    pages.set(journey(lang), renderJourney(context).replace(/[ \t]+$/gm, ''));
    pages.set(authenticator(lang), renderAuthenticator(context).replace(/[ \t]+$/gm, ''));
  }
  return pages;
}

export async function buildPages() {
  for (const [filename, html] of await renderPages()) {
    await writeFile(path.join(root, filename), html);
  }
}

if (isMain(import.meta.url)) {
  await buildPages();
  console.log('Generated six pages from src/content and src/templates.');
}
