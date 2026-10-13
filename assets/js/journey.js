'use strict';

(() => {
  const experience = document.querySelector('#journey');
  if (!experience) return;
  const data = JSON.parse(document.querySelector('#journey-data').textContent);
  const chapters = data.chapters;
  const stage = document.querySelector('#journey-stage');
  const track = document.querySelector('#world-track');
  const avatar = document.querySelector('#journey-avatar');
  const previous = document.querySelector('#journey-prev');
  const next = document.querySelector('#journey-next');
  const chapterNav = document.querySelector('#chapter-nav');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const localize = value => data.dir === 'rtl' ? String(value).replace(/\(?[A-Za-z0-9.][A-Za-z0-9 .#/+*()–_-]*/g, match => {
    const token = match.replace(/[ .]+$/, '');
    return '\u2066' + token + '\u2069' + match.slice(token.length);
  }) : value;

  // Original vector scenery. No borrowed sprites or external game dependencies.
  const tree = (x, scale = 1) => `<g transform="translate(${x} 245) scale(${scale})"><path d="M-4 0v-70h8V0" fill="#718560"/><path d="m0-139-38 65h18l-27 33h94L20-74h18Z" fill="#839e75"/><path d="m0-139 0 98h47L20-74h18Z" fill="#759266"/></g>`;
  const pot = x => `<g transform="translate(${x} 245)"><path d="m-13-26 5 26H8l5-26Z" fill="#ba9873"/><path d="M0-26v-44m0 22c-22 0-22-26-22-26 22 0 22 26 22 26m0 13c20 0 22-23 22-23-22 0-22 23-22 23" fill="#769467" stroke="#69835b" stroke-width="2"/></g>`;
  const svg = content => `<svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  const scenes = {
    campus: svg(`${tree(52,.77)}<path d="M167 245V76h263v169" fill="#e5dac3" stroke="#9b9c7e" stroke-width="2"/><path d="M155 76h287V60H155Z" fill="#b5bd9c"/><path d="M194 61V44h210v17" fill="#d3c7ad"/><path d="M269 245v-61a30 30 0 0 1 60 0v61" fill="#879676"/><path d="M274 245v-60a25 25 0 0 1 50 0v60" fill="#344e44"/><g fill="#a5b598" stroke="#82977b" stroke-width="2"><path d="M197 132v-21a15 15 0 0 1 30 0v21Z"/><path d="M250 132v-21a15 15 0 0 1 30 0v21Z"/><path d="M317 132v-21a15 15 0 0 1 30 0v21Z"/><path d="M370 132v-21a15 15 0 0 1 30 0v21Z"/><path d="M197 204v-21a15 15 0 0 1 30 0v21Z"/><path d="M370 204v-21a15 15 0 0 1 30 0v21Z"/></g><path d="M159 245h280" stroke="#667858" stroke-width="6"/><text x="298" y="54" text-anchor="middle" fill="#4f624d" font-family="monospace" font-size="12" letter-spacing="4">EMI</text>${tree(497,.95)}`),
    workshop: svg(`${tree(53,.7)}<path d="M151 245V69h299v176" fill="#c3cfb6" stroke="#7e9575" stroke-width="2"/><path d="M134 69h331l-25-23H161Z" fill="#617d61"/><rect x="186" y="93" width="229" height="128" fill="#e6edda"/><path d="M171 180h260v12H171m17 0v53m226-53v53" fill="#728968" stroke="#728968" stroke-width="7"/><rect x="208" y="117" width="74" height="50" rx="3" fill="#2d4940"/><path d="M246 167v13m-16 0h32" stroke="#627d59" stroke-width="5"/><path d="m224 140 8-8m-8 8 8 8m34-8-8-8m8 8-8 8m-14 1 6-19" stroke="#c6df99" stroke-width="2" fill="none"/><rect x="316" y="118" width="37" height="62" rx="5" fill="#2d4940"/><rect x="320" y="126" width="29" height="40" fill="#9ab58b"/><circle cx="335" cy="173" r="2" fill="#c6df99"/><text x="300" y="61" text-anchor="middle" fill="#edf3e1" font-family="monospace" font-size="10" letter-spacing="2">BUILD / TEST / LEARN</text>${pot(485)}`),
    projects: svg(`<path d="M100 245V109h120v136" fill="#acbd98"/><path d="M235 245V57h130v188" fill="#eee5cc"/><path d="M380 245V95h121v150" fill="#a6bdad"/><path d="M95 109h130m5-52h140m5 38h131" stroke="#678268" stroke-width="8"/><rect x="111" y="132" width="95" height="54" fill="#eaf1df"/><path d="m120 174 16-16 13 5 17-22 15 7 16-13" stroke="#729154" stroke-width="3" fill="none"/><circle cx="278" cy="100" r="17" fill="#e5c76f"/><path d="M277 124h49a15 15 0 0 0-3-30 20 20 0 0 0-35 4 13 13 0 0 0-11 26" fill="#fafbf3"/><rect x="251" y="151" width="98" height="53" fill="#f9f8ed"/><path d="M261 165h62m-62 9h74m-74 10h55" stroke="#b3b99c" stroke-width="3"/><rect x="399" y="120" width="81" height="78" fill="#345549"/><circle cx="439" cy="158" r="24" fill="none" stroke="#c0d6ae" stroke-dasharray="3 4"/><circle cx="431" cy="153" r="2" fill="#c0d6ae"/><circle cx="447" cy="153" r="2" fill="#c0d6ae"/><path d="m429 168 10 4 10-4" fill="none" stroke="#c0d6ae"/><path d="M143 245v-36h33v36m107 0v-26h33v26m107 0v-29h33v29" fill="#6d8968"/>${pot(535)}`),
    payments: svg(`${tree(56,.75)}<path d="M200 245V66h187v179" fill="#c3cfb6" stroke="#6e8565" stroke-width="2"/><path d="M190 66h207V45H190Z" fill="#536f57"/><text x="294" y="59" text-anchor="middle" fill="#ecf4e3" font-family="monospace" font-size="9" letter-spacing="2">PAYMENT NETWORK</text><g fill="#2c463c"><rect x="222" y="88" width="143" height="38" rx="3"/><rect x="222" y="139" width="143" height="38" rx="3"/><rect x="222" y="190" width="143" height="38" rx="3"/></g><g fill="#c5dc93"><circle cx="343" cy="106" r="4"/><circle cx="343" cy="158" r="4"/><circle cx="343" cy="210" r="4"/></g><path d="M234 104h65m-65 10h45m-45 42h65m-65 10h45m-45 42h65m-65 10h45" stroke="#6e997d" stroke-width="3"/><path d="M142 166h55m191 0h54" stroke="#73965b" stroke-width="3" stroke-dasharray="5 5"/><rect x="90" y="132" width="62" height="43" rx="5" fill="#f3edd9" stroke="#78966c" stroke-width="2"/><path d="M96 144h49m-40 16h15" stroke="#97b079" stroke-width="4"/><rect x="438" y="133" width="52" height="45" rx="5" fill="#f3edd9" stroke="#78966c" stroke-width="2"/><path d="m450 154 9 9 17-20" stroke="#78966c" stroke-width="4" fill="none"/>${pot(531)}`),
    observatory: svg(`<path d="M126 245v-141h352v141" fill="#a8bda2" stroke="#6a8564" stroke-width="2"/><path d="M109 103h387V88H109Z" fill="#4c6d56"/><path d="M200 88V58m208 30V33" stroke="#66845d" stroke-width="5"/><circle cx="200" cy="51" r="9" fill="#d5e2ae" stroke="#66845d" stroke-width="3"/><circle cx="408" cy="26" r="9" fill="#d5e2ae" stroke="#66845d" stroke-width="3"/><path d="M186 28q-25 23 0 46m235-67q25 19 0 39" fill="none" stroke="#8faa7c" stroke-width="2"/><rect x="148" y="127" width="174" height="96" rx="3" fill="#263e36"/><path d="M160 202h150m-150-24h150m-150-24h150" stroke="#3c5c49"/><path d="m160 191 20-2 14-14 16 18 16-7 12-36 17 44 17-22 13 8 22-13" fill="none" stroke="#bad989" stroke-width="3"/><rect x="341" y="127" width="112" height="96" rx="3" fill="#263e36"/><path d="M358 200v-30m21 30v-45m21 45v-28m21 28v-55m20 55v-39" stroke="#9cbc77" stroke-width="10"/><text x="299" y="100" text-anchor="middle" fill="#e5eed7" font-family="monospace" font-size="9" letter-spacing="3">OBSERVE / UNDERSTAND</text>${tree(535,.82)}`),
    launch: svg(`${tree(77,.7)}<path d="M280 243V143h65v100" fill="#b9cba6"/><path d="m261 155 51-89 52 89Z" fill="#5e7b5e"/><rect x="294" y="160" width="36" height="27" rx="2" fill="#e9d395"/><path d="m308 60-5-21h18l-5 21" fill="#718763"/><path d="M246 244h134" stroke="#718763" stroke-width="5"/><path d="m293 173-94-25v51l94-26m38 0 105-30v60l-105-30" fill="#e8d8a1" opacity=".5"/><path d="M439 245V104" stroke="#799167" stroke-width="5"/><path d="M440 105h64l-12 16 12 17h-64" fill="#b5cf83"/><text x="474" y="125" text-anchor="middle" fill="#4b6644" font-size="9" font-family="monospace">HELLO</text><path d="M147 226h73v8h-73m6 0v11m60-11v11" fill="#9ca984" stroke="#9ca984" stroke-width="4"/>${pot(536)}`)
  };


  let position = 0;
  let target = 0;
  let activeChapter = -1;
  let frameId = 0;
  let lastTime = 0;
  let drag = null;
  let wheelTimer = 0;
  const clamp = value => Math.max(0, Math.min(chapters.length - 1, value));
  const escapeText = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

  track.innerHTML = chapters.map((chapter, index) => `<div class="world-zone"><span class="world-zone-label" dir="${data.dir}">${String(index + 1).padStart(2, '0')} / ${escapeText(chapter.label)}</span>${scenes[chapter.scene]}</div>`).join('');
  // Translate scenery labels too; proper names such as EMI stay unchanged.
  const sceneText = track.querySelectorAll('svg text');
  const sceneLabelIndices = [0, 1, 3, 4, 5];
  sceneText.forEach((text, index) => {
    text.textContent = data.sceneLabels[sceneLabelIndices[index]];
    text.style.fontFamily = 'Arial, sans-serif';
    text.style.letterSpacing = data.dir === 'rtl' ? '0' : '.8px';
    text.setAttribute('direction', data.dir);
  });
  chapters.forEach((chapter, index) => {
    const button = document.createElement('button');
    button.textContent = chapter.label;
    button.setAttribute('aria-label', `${data.ui.goChapter} ${index + 1}: ${chapter.label}`);
    button.addEventListener('click', () => moveTo(index));
    chapterNav.append(button);
  });

  function render() {
    track.style.transform = `translate3d(${-position * stage.clientWidth}px, 0, 0)`;
    stage.querySelector('.mountain-one').style.transform = `translateX(${-position * 28}px)`;
    stage.querySelector('.cloud-one').style.transform = `translateX(${-position * 12}px)`;
    const index = Math.round(position);
    if (index === activeChapter) return;
    activeChapter = index;
    const chapter = chapters[index];
    document.querySelector('#chapter-kicker').textContent = localize(`${String(index + 1).padStart(2, '0')} / ${chapter.kicker}`);
    document.querySelector('#chapter-title').textContent = localize(chapter.title);
    document.querySelector('#chapter-description').textContent = localize(chapter.description);
    document.querySelector('#world-sign').textContent = localize(chapter.sign);
    document.querySelector('#chapter-count').textContent = `${String(index + 1).padStart(2, '0')} / 06`;
    document.querySelector('#chapter-tags').replaceChildren(...chapter.tags.map(tag => {
      const span = document.createElement('span');
      const bdi = document.createElement('bdi');
      bdi.textContent = tag;
      span.append(bdi);
      return span;
    }));
    const link = document.querySelector('#chapter-link');
    link.href = data.home + chapter.link;
    link.textContent = `${index === 5 ? data.ui.email : data.ui.readMore} ↗`;
    chapterNav.querySelectorAll('button').forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    previous.disabled = index === 0;
    next.disabled = index === chapters.length - 1;
    try { history.replaceState(null, '', `#chapter-${index + 1}`); } catch { /* Some file viewers restrict history. */ }
  }

  function animate(time) {
    frameId = 0;
    if (document.hidden) { avatar.classList.remove('is-moving'); return; }
    const dt = Math.min(time - (lastTime || time - 16), 64);
    lastTime = time;
    const distance = target - position;
    position = reducedMotion.matches ? target : position + distance * (1 - Math.exp(-dt / 140));
    if (Math.abs(target - position) < .001) position = target;
    avatar.style.scale = distance < -.002 ? '-1 1' : distance > .002 ? '1 1' : avatar.style.scale;
    avatar.classList.toggle('is-moving', Math.abs(target - position) > .005 && !reducedMotion.matches);
    render();
    if (position !== target) frameId = requestAnimationFrame(animate);
    else { avatar.classList.remove('is-moving'); lastTime = 0; }
  }
  function moveTo(value) {
    clearTimeout(wheelTimer);
    target = clamp(value);
    if (!frameId) frameId = requestAnimationFrame(animate);
  }
  previous.addEventListener('click', () => moveTo(Math.round(target) - 1));
  next.addEventListener('click', () => moveTo(Math.round(target) + 1));
  experience.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const moves = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, ArrowLeft: -1, ArrowUp: -1, PageUp: -1 };
    if (Object.hasOwn(moves, event.key)) {
      event.preventDefault();
      if (!event.repeat) moveTo(Math.round(target) + moves[event.key]);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      moveTo(event.key === 'Home' ? 0 : chapters.length - 1);
    }
  });
  stage.addEventListener('wheel', event => {
    if (event.ctrlKey) return;
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientWidth : 1;
    const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * unit;
    if (!delta) return;
    moveTo(target + delta / 650);
    wheelTimer = setTimeout(() => moveTo(delta > 0 ? Math.ceil(target) : Math.floor(target)), 220);
  }, { passive: false });
  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    clearTimeout(wheelTimer);
    drag = { x: event.clientX, target, id: event.pointerId };
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (drag && event.pointerId === drag.id) moveTo(drag.target + (drag.x - event.clientX) / stage.clientWidth);
  });
  stage.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const distance = drag.x - event.clientX;
    moveTo(Math.abs(distance) > 35 ? Math.round(drag.target) + Math.sign(distance) : Math.round(target));
    drag = null;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  });
  stage.addEventListener('pointercancel', () => { drag = null; moveTo(Math.round(target)); });
  window.addEventListener('resize', render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; lastTime = 0; avatar.classList.remove('is-moving'); }
    else if (position !== target) moveTo(target);
  });
  reducedMotion.addEventListener('change', () => moveTo(target));
  const initialChapter = /^#chapter-([1-6])$/.exec(location.hash);
  position = target = initialChapter ? Number(initialChapter[1]) - 1 : 0;
  experience.hidden = false;
  document.querySelector('.journey-transcript').open = false;
  render();
  stage.focus({ preventScroll: true });
})();
