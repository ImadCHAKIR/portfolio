import { sectionHeading } from './portfolio-sections.mjs';

const conceptScenes = {
  observability: `<div class="concept-observability">
    <aside><i></i><i></i><i></i><i></i></aside>
    <section>
      <header><i></i><b></b></header>
      <div class="concept-metrics"><i></i><i></i><i></i></div>
      <div class="concept-line-chart">
        <svg viewBox="0 0 340 96" preserveAspectRatio="none">
          <path d="M0 74 C28 61 45 72 68 49 S102 63 125 41 156 50 181 33 208 47 232 23 265 39 287 18 316 30 340 7"/>
          <path class="chart-fill" d="M0 74 C28 61 45 72 68 49 S102 63 125 41 156 50 181 33 208 47 232 23 265 39 287 18 316 30 340 7 V96 H0Z"/>
        </svg>
      </div>
      <div class="concept-alerts"><i></i><i></i><i></i></div>
    </section>
  </div>`,
  payments: `<div class="concept-payment">
    <div class="concept-payment-card"><i></i><b></b><span></span><span></span></div>
    <div class="concept-flow"><i></i><i></i><i></i></div>
    <div class="concept-payment-card gateway"><i></i><b></b><span></span><span></span></div>
    <div class="concept-check">✓</div>
  </div>`,
  applications: `<div class="concept-apps">
    <div class="concept-desktop">
      <div class="concept-window-bar"><i></i><i></i><i></i></div>
      <div class="concept-app-layout">
        <aside><i></i><i></i><i></i></aside>
        <section><b></b><i></i><i></i><i></i><div><i></i><i></i></div></section>
      </div>
    </div>
    <div class="concept-mobile"><i></i><b></b><span></span><span></span><span></span><div></div></div>
  </div>`,
  chatbot: `<div class="concept-chat">
    <div class="concept-chat-window">
      <header><i></i><b></b><span></span></header>
      <div class="concept-bubble left"><i></i><i></i></div>
      <div class="concept-bubble right"><i></i></div>
      <div class="concept-bubble left short"><i></i><i></i></div>
      <footer><i></i><b>↗</b></footer>
    </div>
  </div>`
};

function renderWorkVisual(work, ui, esc) {
  const visualAssets = {
    observability: {
      path: 'assets/img/work-observability-real.png',
      alt: 'Grafana dashboard screenshot showing website performance metrics',
      kind: 'real'
    },
    payments: {
      path: 'assets/img/work-payments-real.png',
      alt: 'Photo of a card payment terminal processing a transaction',
      kind: 'real'
    },
    applications: {
      path: 'assets/img/work-applications.svg',
      alt: 'Sanitized responsive web and mobile application mockup',
      kind: 'illustrative'
    },
    chatbot: {
      path: 'assets/img/work-cheikh-zaid-real.png',
      alt: 'Screenshot of the Cheikh Zaid Foundation web and mobile care portal',
      kind: 'real'
    }
  };
  const asset = visualAssets[work.visual];
  const scene = conceptScenes[work.visual] || conceptScenes.applications;
  return `<div class="project-visual">
    <div class="project-visual-window visual-${work.visual}${asset ? ' project-image-window' : ''}">${asset ? `<img class="project-visual-image" src="${asset.path}" alt="${esc(asset.alt)}" loading="lazy">` : scene}</div>
    <div class="project-visual-caption">
      <span>${esc(ui.visualPreview)}</span>
      <p>${esc(asset?.kind === 'real' ? ui.referenceHint : ui.screenshotHint)}</p>
    </div>
  </div>`;
}

function renderWorkCard(work, index, { ui, esc, tags }) {
  const date = work.date ? `<span> · ${esc(work.date)}</span>` : '';
  return `<article class="work-card">
    ${renderWorkVisual(work, ui, esc)}
    <div class="work-card-content">
      <div class="project-top">
        <p class="eyebrow">${esc(ui.caseStudyLabel)}</p>
        <span aria-hidden="true">0${index + 1}</span>
      </div>
      <p class="work-type">${esc(work.type)}</p>
      <h4>${esc(work.name)}</h4>
      <p class="work-role">${esc(work.role)}${date}</p>
      <p class="work-description">${esc(work.description)}</p>
      <div class="case-study-grid">
        <section><h5>${esc(ui.challenge)}</h5><p>${esc(work.challenge)}</p></section>
        <section><h5>${esc(ui.contribution)}</h5><p>${esc(work.contribution)}</p></section>
        <section><h5>${esc(ui.approach)}</h5><p>${esc(work.approach)}</p></section>
        <section><h5>${esc(ui.evidence)}</h5><p>${esc(work.evidence)}</p></section>
      </div>
      ${tags(work.tags)}
    </div>
  </article>`;
}

function renderAdditionalProjects(projects, { ui, esc, tags }) {
  return projects.map((project, index) => `
    <article class="project-card">
      <div class="project-top">
        <p class="eyebrow">${esc(project.type)}</p>
        <span aria-hidden="true">0${index + 1}</span>
      </div>
      <h4>${esc(project.name)}</h4>
      <p>${esc(project.description)}</p>
      ${tags(project.tags)}
    </article>`).join('');
}

export function renderProjects({ content, ui, esc, tags }) {
  const context = { ui, esc, tags };
  const featuredWork = content.featuredWork
    .map((work, index) => renderWorkCard(work, index, context))
    .join('');
  const additionalProjects = renderAdditionalProjects(content.projects, context);

  return `<section class="projects-section" id="projects" aria-labelledby="projects-title">
    <div class="section shell">
      ${sectionHeading('02', 'projects', esc(ui.projects), esc(ui.projectsIntro))}
      <p class="project-prototype-note">${esc(ui.evidenceHint)}</p>
      <h3 class="work-section-title">${esc(ui.featuredWork)}</h3>
      <div class="work-card-grid">${featuredWork}</div>
      <h3 class="work-section-title additional-projects-title" id="additional-projects-title">${esc(ui.additionalProjects)}</h3>
      <div class="project-rail-controls" hidden>
        <button class="project-rail-previous" type="button" data-project-scroll="previous" aria-label="${esc(ui.previousProjects)}" aria-controls="additional-projects-rail"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
        <button class="project-rail-next" type="button" data-project-scroll="next" aria-label="${esc(ui.nextProjects)}" aria-controls="additional-projects-rail"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
      </div>
      <div class="project-grid" id="additional-projects-rail" role="region" aria-labelledby="additional-projects-title" tabindex="0">${additionalProjects}</div>
    </div>
  </section>`;
}
