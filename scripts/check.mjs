import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles } from './public-files.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'content/portfolio.json'), 'utf8'));
const expectedKeys = Object.keys(data.en.ui).sort();
const pages = new Map();
for (const file of publicFiles.filter(file => file.endsWith('.html'))) {
  pages.set(file, await readFile(path.join(root, file), 'utf8'));
}
for (const lang of ['en', 'fr', 'ar']) {
  const c = data[lang];
  assert.deepEqual(Object.keys(c.ui).sort(), expectedKeys, `${lang}: missing UI translations`);
  assert.ok(Object.values(c.ui).every(value => typeof value === 'string' && value.trim()));
  assert.equal(c.experience.length, 4);
  assert.equal(c.projects.length, 4);
  assert.equal(c.chapters.length, 6);
  assert.equal(c.education[0].date, '2021–2024');
  const filename = lang === 'en' ? 'index.html' : `${lang}.html`;
  const journey = lang === 'en' ? 'journey.html' : `journey-${lang}.html`;
  for (const file of [filename, journey]) {
    const html = pages.get(file);
    assert.ok(html.includes(`<html lang="${lang}" dir="${c.dir}">`));
    assert.ok(!html.includes('<dialog'), `${file}: journey must be a separate page`);
    assert.ok(!html.includes('undefined'), `${file}: unfilled content`);
    assert.ok(html.includes(`href="assets/cv/Imad-Chakir-CV-${lang.toUpperCase()}.pdf" download`));
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  }
  assert.ok(pages.get(filename).includes(`href="${journey}"`));
  const pdf = await readFile(path.join(root, `assets/cv/Imad-Chakir-CV-${lang.toUpperCase()}.pdf`));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.ok(pdf.length > 20000);
}
let linksChecked = 0;
for (const [file, html] of pages) {
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(https?:|mailto:)/.test(value)) continue;
    assert.ok(value && value !== '#', `${file}: placeholder link`);
    const [relative, hash] = value.split('#');
    const target = relative || file;
    await access(path.join(root, target));
    if (hash && !/^chapter-[1-6]$/.test(hash)) {
      const targetHtml = pages.get(target);
      assert.ok(targetHtml?.includes(`id="${hash}"`), `${file}: broken link ${value}`);
    }
    linksChecked++;
  }
}
console.log(`Verified six pages, three CV PDFs, translation coverage, RTL metadata, and ${linksChecked} local links/assets.`);
