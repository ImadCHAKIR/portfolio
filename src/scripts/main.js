'use strict';

// All content and language navigation remain usable without JavaScript.
document.documentElement.classList.add('js-ready');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
menuButton.hidden = false;
const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
};
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('is-open', expanded);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header-inner')) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

// Preserve the current résumé section when switching between static locales.
document.querySelectorAll('.language-switch a').forEach(link => {
  link.addEventListener('click', () => {
    if (location.hash) link.hash = location.hash;
  });
});

const projectRail = document.querySelector('#additional-projects-rail');
if (projectRail) {
  const projectControls = document.querySelector('.project-rail-controls');
  const previousButton = projectControls.querySelector('[data-project-scroll="previous"]');
  const nextButton = projectControls.querySelector('[data-project-scroll="next"]');

  const updateProjectControls = () => {
    const isRtl = getComputedStyle(projectRail).direction === 'rtl';
    const maxScroll = projectRail.scrollWidth - projectRail.clientWidth;
    const position = isRtl ? -projectRail.scrollLeft : projectRail.scrollLeft;
    projectControls.hidden = maxScroll <= 1;
    previousButton.disabled = position <= 1;
    nextButton.disabled = position >= maxScroll - 1;
  };

  projectControls.addEventListener('click', event => {
    const button = event.target.closest('[data-project-scroll]');
    if (!button) return;

    const isRtl = getComputedStyle(projectRail).direction === 'rtl';
    const direction = button.dataset.projectScroll === 'next' ? 1 : -1;
    const card = projectRail.querySelector('.project-card');
    const gap = parseFloat(getComputedStyle(projectRail).columnGap) || 0;
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    projectRail.scrollBy({ left: direction * (isRtl ? -1 : 1) * (card.offsetWidth + gap), behavior });
  });

  projectRail.addEventListener('scroll', updateProjectControls, { passive: true });
  window.addEventListener('resize', updateProjectControls);
  updateProjectControls();
}
