import { locales, home, journey, authenticator, cv } from '../../src/config.mjs';

// An explicit publish list keeps source, tools, and archived images out of dist/.
export const staticAssets = [
  { source: 'img/favicon.svg', output: 'assets/img/favicon.svg' },
  { source: 'img/imad-chakir.png', output: 'assets/img/imad-chakir.png' },
  { source: 'img/work-observability-real.png', output: 'assets/img/work-observability-real.png' },
  { source: 'img/work-payments-real.png', output: 'assets/img/work-payments-real.png' },
  { source: 'img/work-anfcc-browser.png', output: 'assets/img/work-anfcc-browser.png' },
  { source: 'img/work-anfcc-android.jpg', output: 'assets/img/work-anfcc-android.jpg' },
  { source: 'img/work-applications.svg', output: 'assets/img/work-applications.svg' },
  { source: 'img/work-cheikh-zaid-real.png', output: 'assets/img/work-cheikh-zaid-real.png' },
  ...locales.map(lang => ({
    source: `cv/Imad-Chakir-CV-${lang.toUpperCase()}.pdf`,
    output: cv(lang)
  }))
];

export const publicFiles = [
  ...locales.map(home),
  ...locales.map(journey),
  ...locales.map(authenticator),
  'assets/css/styles.css',
  'assets/css/authenticator.css',
  'assets/js/main.js',
  'assets/js/journey.js',
  'assets/js/chatbot.mjs',
  'assets/js/authenticator.js',
  ...staticAssets.map(asset => asset.output)
];
