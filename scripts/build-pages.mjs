import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'content/portfolio.json'), 'utf8'));
const locales = ['en', 'fr', 'ar'];
const names = { en: 'English', fr: 'Français', ar: 'العربية' };
const shortNames = { en: 'EN', fr: 'FR', ar: 'العربية' };
let renderingRTL = false;
const isolateLatin = value => String(value).replace(/\(?[A-Za-z0-9.][A-Za-z0-9 .#/+*()–_-]*/g, match => {
  const token = match.replace(/[ .]+$/, '');
  return '\u2066' + token + '\u2069' + match.slice(token.length);
});
const esc = value => (renderingRTL ? isolateLatin(value) : String(value)).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const home = lang => lang === 'en' ? 'index.html' : `${lang}.html`;
const journey = lang => lang === 'en' ? 'journey.html' : `journey-${lang}.html`;
const cv = lang => `assets/cv/Imad-Chakir-CV-${lang.toUpperCase()}.pdf`;
const tags = items => `<div class="tags">${items.map(item => `<span><bdi>${esc(item)}</bdi></span>`).join('')}</div>`;

function header(lang, isJourney) {
  const u = data[lang].ui;
  const prefix = isJourney ? home(lang) : '';
  return `<a class="skip-link" href="#main">${esc(u.skip)}</a>
  <header class="site-header">
    <div class="shell header-inner">
      <a class="wordmark" href="${home(lang)}" aria-label="Imad Chakir"><span class="monogram" aria-hidden="true">ic.</span><bdi>Imad Chakir</bdi></a>
      <nav class="nav-links" id="nav-links" aria-label="${esc(u.nav)}">
        ${['experience', 'projects', 'skills', 'contact'].map(key => `<a href="${prefix}#${key}">${esc(u[key])}</a>`).join('\n        ')}
      </nav>
      <div class="header-controls">
        <nav class="language-switch" aria-label="${esc(u.language)}">${locales.map(code => `<a href="${isJourney ? journey(code) : home(code)}" lang="${code}" hreflang="${code}" aria-label="${names[code]}"${code === lang ? ' aria-current="page"' : ''}>${shortNames[code]}</a>`).join('')}</nav>
        <button class="menu-toggle" aria-expanded="false" aria-controls="nav-links" hidden><span>${esc(u.menu)}</span><span aria-hidden="true">☰</span></button>
      </div>
    </div>
  </header>`;
}

function head(lang, isJourney) {
  const c = data[lang];
  return `<!doctype html>
<html lang="${lang}" dir="${c.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#193348">
  <meta name="description" content="${esc(c.ui.siteDescription)}">
  <title>Imad Chakir — ${esc(isJourney ? c.ui.journey : c.title)}</title>
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/styles.css">
  ${locales.map(code => `<link rel="alternate" hreflang="${code}" href="${isJourney ? journey(code) : home(code)}">`).join('\n  ')}
  <script src="assets/js/main.js" defer></script>
  ${isJourney ? '<script src="assets/js/journey.js" defer></script>' : ''}
</head>`;
}

function footer(lang, isJourney = false) {
  const c = data[lang];
  return `<footer class="site-footer shell"><p><bdi>© ${data.contact.name}</bdi> · ${esc(c.location)}</p><a href="${isJourney ? home(lang) : '#home'}">${esc(isJourney ? c.ui.back : c.ui.top)} <span aria-hidden="true">${isJourney ? '↗' : '↑'}</span></a></footer>`;
}

function portfolio(lang) {
  const c = data[lang], u = c.ui, contact = data.contact;
  return `${head(lang, false)}
<body>
  ${header(lang, false)}
  <main id="main">
    <section class="hero shell" id="home" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">${esc(c.location)}</p>
        <h1 id="hero-title"><bdi>${contact.name}</bdi></h1>
        <p class="hero-role">${esc(c.title)}</p>
        <p class="hero-intro">${esc(c.intro)}</p>
        <div class="hero-actions"><a class="button primary" href="${cv(lang)}" download>${esc(u.download)} <span aria-hidden="true">↓</span></a><a class="button secondary" href="#projects">${esc(u.viewProjects)}</a></div>
        <p class="download-note">${esc(u.pdf)} · ${names[lang]}</p>
      </div>
      <aside class="focus-panel" aria-labelledby="focus-title">
        <h2 id="focus-title">${esc(u.focus)}</h2>
        <ul>${[u.focus1, u.focus2, u.focus3].map((item, i) => `<li><span class="focus-number" aria-hidden="true">0${i + 1}</span><span>${esc(item)}</span></li>`).join('')}</ul>
        <div class="profile-links"><a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${contact.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>
      </aside>
    </section>
    <aside class="journey-invite shell">
      <div><h2>${esc(u.journey)}</h2><p>${esc(u.journeyIntro)}</p></div>
      <a class="text-link" href="${journey(lang)}">${esc(u.openJourney)} <span aria-hidden="true">↗</span></a>
    </aside>
    <section class="section shell" id="experience" aria-labelledby="experience-title">
      <div class="section-heading"><p class="section-number" aria-hidden="true">01</p><div><h2 id="experience-title">${esc(u.experience)}</h2><p>${esc(u.experienceIntro)}</p></div></div>
      <div class="experience-list">${c.experience.map(item => `
        <article class="experience-row">
          <div class="experience-company"><h3><bdi>${esc(item.company)}</bdi></h3>${item.date ? `<p class="date">${esc(item.date)}</p>` : ''}</div>
          <div class="experience-body"><h4>${esc(item.role)}</h4><ul>${item.bullets.map(bullet => `<li>${esc(bullet)}</li>`).join('')}</ul>${tags(item.tags)}</div>
        </article>`).join('')}
      </div>
    </section>
    <section class="projects-section" id="projects" aria-labelledby="projects-title"><div class="section shell">
      <div class="section-heading"><p class="section-number" aria-hidden="true">02</p><div><h2 id="projects-title">${esc(u.projects)}</h2><p>${esc(u.projectsIntro)}</p></div></div>
      <div class="project-grid">${c.projects.map((item, i) => `
        <article class="project-card"><div class="project-top"><p class="eyebrow">${esc(item.type)}</p><span aria-hidden="true">0${i + 1}</span></div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p>${tags(item.tags)}</article>`).join('')}
      </div>
    </div></section>
    <section class="section shell" id="skills" aria-labelledby="skills-title">
      <div class="section-heading"><p class="section-number" aria-hidden="true">03</p><div><h2 id="skills-title">${esc(u.skills)}</h2><p>${esc(u.skillsIntro)}</p></div></div>
      <div class="skill-grid">${c.skills.map(item => `<article class="skill-group"><h3>${esc(item.label)}</h3><p dir="auto">${esc(item.items)}</p></article>`).join('')}</div>
    </section>
    <section class="about-section" id="about" aria-labelledby="about-title"><div class="section shell">
      <div class="section-heading"><p class="section-number" aria-hidden="true">04</p><div><h2 id="about-title">${esc(u.about)}</h2><p>${esc(u.aboutIntro)}</p></div></div>
      <div class="about-grid"><div class="education">${c.education.map(item => `<article><p class="date"><bdi>${esc(item.date)}</bdi></p><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><p class="muted">${esc(item.location)}</p></article>`).join('')}</div>
        <div class="languages"><h3>${esc(u.languages)}</h3><dl>${c.languages.map(item => `<div><dt>${esc(item.name)}</dt><dd>${esc(item.level)}</dd></div>`).join('')}</dl></div>
      </div>
    </div></section>
    <section class="contact-section shell" id="contact" aria-labelledby="contact-title">
      <div><p class="eyebrow">${esc(u.contact)}</p><h2 id="contact-title">${esc(u.contactTitle)}</h2><p>${esc(u.contactIntro)}</p><a class="email-link" href="mailto:${contact.email}"><bdi>${contact.email}</bdi> <span aria-hidden="true">↗</span></a></div>
      <div class="contact-actions"><a class="button primary" href="${cv(lang)}" download>${esc(u.download)} <span aria-hidden="true">↓</span></a><p>${esc(u.pdf)} · ${names[lang]}</p><div class="profile-links"><a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${contact.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div>
    </section>
  </main>
  ${footer(lang)}
</body>
</html>
`;
}

const avatar = `<svg viewBox="0 0 48 70"><path d="M14 6h20v5h5v19H10V11h4Z" fill="#d7a474"/><path d="M10 8h5V3h18v5h6v10h-7v-6H18v6h-8Z" fill="#29362f"/><path d="M29 19h4v4h-4" fill="#29362f"/><path d="M14 30h20v5h5v24H9V35h5Z" fill="#bada70"/><path d="M19 32v23m10-23v23" stroke="#859c4e" stroke-width="2"/><path d="M5 38h8v19H5m30-19h8v19h-8" fill="#d7a474"/><g class="avatar-leg-left"><path d="M12 56h10v12H9v-5h3Z" fill="#243b35"/></g><g class="avatar-leg-right"><path d="M26 56h10v7h4v5H26Z" fill="#243b35"/></g></svg>`;

function journeyPage(lang) {
  const c = data[lang], u = c.ui;
  const payload = JSON.stringify({ chapters: c.chapters, sceneLabels: c.sceneLabels, ui: u, home: home(lang), dir: c.dir }).replaceAll('<', '\\u003c');
  return `${head(lang, true)}
<body class="journey-page">
  ${header(lang, true)}
  <main class="shell journey-main" id="main">
    <a class="back-link" href="${home(lang)}">${esc(u.back)} <span aria-hidden="true">↗</span></a>
    <div class="journey-heading"><div><h1>${esc(u.journeyTitle)}</h1><p>${esc(u.journeySubtitle)}</p></div><a class="button secondary" href="${cv(lang)}" download>${esc(u.download)} <span aria-hidden="true">↓</span></a></div>
    <div class="journey-experience" id="journey" hidden>
      <div class="journey-stage" id="journey-stage" tabindex="0" dir="ltr" aria-label="${esc(u.stage)}" aria-describedby="journey-instructions">
        <div class="journey-sky" aria-hidden="true"><div class="journey-sun"></div><div class="cloud cloud-one"></div><div class="cloud cloud-two"></div><div class="mountain mountain-one"></div><div class="mountain mountain-two"></div></div>
        <div class="world-track" id="world-track" aria-hidden="true"></div><div class="journey-ground" aria-hidden="true"></div><div class="journey-avatar" id="journey-avatar" aria-hidden="true">${avatar}</div><div class="world-sign" id="world-sign" dir="${c.dir}" aria-hidden="true"></div>
      </div>
      <div class="journey-panel"><div class="chapter-copy" aria-live="polite" aria-atomic="true"><p class="eyebrow" id="chapter-kicker"></p><h2 id="chapter-title"></h2><p id="chapter-description"></p><div class="tags" id="chapter-tags"></div><a class="text-link" id="chapter-link" href="${home(lang)}#about"></a></div><div class="journey-progress"><span class="chapter-count" id="chapter-count" dir="ltr">01 / 06</span><nav id="chapter-nav" aria-label="${esc(u.chapters)}"></nav></div></div>
      <div class="journey-controls"><p id="journey-instructions">${esc(u.instructions)}</p><div dir="ltr"><button id="journey-prev" aria-label="${esc(u.previous)}">←</button><button id="journey-next" aria-label="${esc(u.next)}">→</button></div></div>
    </div>
    <noscript><p class="no-js">${esc(u.noJs)}</p></noscript>
    <details class="journey-transcript" open><summary>${esc(u.story)}</summary><div>${c.chapters.map((chapter, index) => `<article><p class="eyebrow">0${index + 1} / ${esc(chapter.kicker)}</p><h2>${esc(chapter.title)}</h2><p>${esc(chapter.description)}</p><a class="text-link" href="${home(lang)}${chapter.link}">${esc(u.readMore)} ↗</a></article>`).join('')}</div></details>
  </main>
  ${footer(lang, true)}
  <script type="application/json" id="journey-data">${payload}</script>
</body>
</html>
`;
}

for (const lang of locales) {
  renderingRTL = lang === 'ar';
  await writeFile(path.join(root, home(lang)), portfolio(lang));
  await writeFile(path.join(root, journey(lang)), journeyPage(lang));
}
console.log('Generated six static pages in English, French, and Arabic.');
