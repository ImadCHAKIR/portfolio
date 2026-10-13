import { head, header, footer } from './layout.mjs';
import { home, cv } from '../config.mjs';
import { renderScenery } from './scenery.mjs';

function renderTranscript({ lang, content, ui, esc }) {
  const chapters = content.chapters.map((chapter, index) => `
    <article>
      <p class="eyebrow">0${index + 1} / ${esc(chapter.kicker)}</p>
      <h2>${esc(chapter.title)}</h2>
      <p>${esc(chapter.description)}</p>
      <a class="text-link" href="${home(lang)}${chapter.link}">${esc(ui.readMore)} ↗</a>
    </article>`).join('');

  return `<details class="journey-transcript" open>
    <summary>${esc(ui.story)}</summary>
    <div>${chapters}</div>
  </details>`;
}

export function renderJourney(context) {
  const { lang, content, ui, esc, artwork } = context;
  // Escape '<' so translated content cannot close the JSON script element.
  const payload = JSON.stringify({
    chapters: content.chapters,
    ui: ui,
    home: home(lang),
    dir: content.dir
  }).replaceAll('<', '\\u003c');

  return `${head(context, true)}
<body class="journey-page">
  ${header(context, true)}
  <main class="shell journey-main" id="main">
    <a class="back-link" href="${home(lang)}">
      ${esc(ui.back)} <span aria-hidden="true">↗</span>
    </a>
    <div class="journey-heading">
      <div>
        <h1>${esc(ui.journeyTitle)}</h1>
        <p>${esc(ui.journeySubtitle)}</p>
      </div>
      <a class="button secondary" href="${cv(lang)}" download>
        ${esc(ui.download)} <span aria-hidden="true">↓</span>
      </a>
    </div>
    <div class="journey-experience" id="journey" hidden>
      <div class="journey-stage" id="journey-stage" tabindex="0" dir="ltr"
           aria-label="${esc(ui.stage)}" aria-describedby="journey-instructions">
        <div class="journey-sky" aria-hidden="true">
          <div class="journey-sun"></div>
          <div class="cloud cloud-one"></div>
          <div class="cloud cloud-two"></div>
          <div class="mountain mountain-one"></div>
          <div class="mountain mountain-two"></div>
        </div>
        <div class="world-track" id="world-track" aria-hidden="true">${renderScenery(context)}</div>
        <div class="journey-ground" aria-hidden="true"></div>
        <div class="journey-avatar" id="journey-avatar" aria-hidden="true">${artwork.avatar}</div>
        <div class="world-sign" id="world-sign" dir="${content.dir}" aria-hidden="true"></div>
      </div>
      <div class="journey-panel">
        <div class="chapter-copy" aria-live="polite" aria-atomic="true">
          <p class="eyebrow" id="chapter-kicker"></p>
          <h2 id="chapter-title"></h2>
          <p id="chapter-description"></p>
          <div class="tags" id="chapter-tags"></div>
          <a class="text-link" id="chapter-link" href="${home(lang)}#about"></a>
        </div>
        <div class="journey-progress">
          <span class="chapter-count" id="chapter-count" dir="ltr">01 / 06</span>
          <nav id="chapter-nav" aria-label="${esc(ui.chapters)}"></nav>
        </div>
      </div>
      <div class="journey-controls">
        <p id="journey-instructions">${esc(ui.instructions)}</p>
        <div dir="ltr">
          <button id="journey-prev" aria-label="${esc(ui.previous)}">←</button>
          <button id="journey-next" aria-label="${esc(ui.next)}">→</button>
        </div>
      </div>
    </div>
    <noscript><p class="no-js">${esc(ui.noJs)}</p></noscript>
    ${renderTranscript(context)}
  </main>
  ${footer(context, true)}
  <script type="application/json" id="journey-data">${payload}</script>
</body>
</html>
`;
}
