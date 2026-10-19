import { names, journey, cv } from '../config.mjs';

export function sectionHeading(number, key, title, description) {
  return `<div class="section-heading">
    <p class="section-number" aria-hidden="true">${number}</p>
    <div>
      <h2 id="${key}-title">${title}</h2>
      <p>${description}</p>
    </div>
  </div>`;
}

function profileLinks(contact) {
  return `<div class="profile-links">
    <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
    <a href="${contact.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
  </div>`;
}

export function renderIntroduction({ lang, content, ui, contact, esc }) {
  return `<section class="hero shell" id="home" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">${esc(content.location)}</p>
      <h1 id="hero-title"><bdi>${contact.name}</bdi></h1>
      <p class="hero-role">${esc(content.title)}</p>
      <p class="hero-intro">${esc(content.intro)}</p>
      <div class="hero-actions">
        <a class="button primary" href="${cv(lang)}" download>
          ${esc(ui.download)} <span aria-hidden="true">↓</span>
        </a>
        <a class="button secondary" href="#projects">${esc(ui.viewProjects)}</a>
      </div>
      <p class="download-note">${esc(ui.pdf)} · ${names[lang]}</p>
      ${profileLinks(contact)}
    </div>
    <figure class="hero-portrait">
      <img src="assets/img/imad-chakir.png" alt="${esc(ui.portraitAlt)}" width="800" height="800" fetchpriority="high" decoding="async">
    </figure>
  </section>
  <aside class="journey-invite shell">
    <div>
      <h2>${esc(ui.journey)}</h2>
      <p>${esc(ui.journeyIntro)}</p>
    </div>
    <a class="text-link" href="${journey(lang)}">
      ${esc(ui.openJourney)} <span aria-hidden="true">↗</span>
    </a>
  </aside>`;
}

export function renderExperience({ content, ui, esc, tags }) {
  const items = content.experience.map(item => `
    <article class="experience-row">
      <div class="experience-company">
        <h3><bdi>${esc(item.company)}</bdi></h3>
        ${item.date ? `<p class="date">${esc(item.date)}</p>` : ''}
      </div>
      <div class="experience-body">
        <h4>${esc(item.role)}</h4>
        <ul>${item.bullets.map(bullet => `<li>${esc(bullet)}</li>`).join('')}</ul>
        ${tags(item.tags)}
      </div>
    </article>`).join('');

  return `<section class="section shell" id="experience" aria-labelledby="experience-title">
    ${sectionHeading('01', 'experience', esc(ui.experience), esc(ui.experienceIntro))}
    <div class="experience-list">${items}</div>
  </section>`;
}

export function renderSkills({ content, ui, esc }) {
  const items = content.skills.map(item => `
    <article class="skill-group">
      <h3>${esc(item.label)}</h3>
      <p dir="auto">${esc(item.items)}</p>
    </article>`).join('');

  return `<section class="section shell" id="skills" aria-labelledby="skills-title">
    ${sectionHeading('03', 'skills', esc(ui.skills), esc(ui.skillsIntro))}
    <div class="skill-grid">${items}</div>
  </section>`;
}

export function renderEducation({ content, ui, esc }) {
  const education = content.education.map(item => `
    <article>
      <p class="date"><bdi>${esc(item.date)}</bdi></p>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.description)}</p>
      <p class="muted">${esc(item.location)}</p>
    </article>`).join('');
  const languages = content.languages.map(item => `
    <div>
      <dt>${esc(item.name)}</dt>
      <dd>${esc(item.level)}</dd>
    </div>`).join('');

  return `<section class="about-section" id="about" aria-labelledby="about-title">
    <div class="section shell">
      ${sectionHeading('04', 'about', esc(ui.about), esc(ui.aboutIntro))}
      <div class="about-grid">
        <div class="education">${education}</div>
        <div class="languages">
          <h3>${esc(ui.languages)}</h3>
          <dl>${languages}</dl>
        </div>
      </div>
    </div>
  </section>`;
}

export function renderContact({ lang, ui, contact, esc }) {
  return `<section class="contact-section shell" id="contact" aria-labelledby="contact-title">
    <div>
      <p class="eyebrow">${esc(ui.contact)}</p>
      <h2 id="contact-title">${esc(ui.contactTitle)}</h2>
      <p>${esc(ui.contactIntro)}</p>
      <a class="email-link" href="mailto:${contact.email}">
        <bdi>${contact.email}</bdi> <span aria-hidden="true">↗</span>
      </a>
    </div>
    <div class="contact-actions">
      <a class="button primary" href="${cv(lang)}" download>
        ${esc(ui.download)} <span aria-hidden="true">↓</span>
      </a>
      <p>${esc(ui.pdf)} · ${names[lang]}</p>
      ${profileLinks(contact)}
    </div>
  </section>`;
}
