import { locales, home, journey, cv } from '../../src/config.mjs';

// An explicit publish list keeps source, tools, and archived images out of dist/.
export const staticAssets = [
  { source: 'img/favicon.svg', output: 'assets/img/favicon.svg' },
  ...locales.map(lang => ({
    source: `cv/Imad-Chakir-CV-${lang.toUpperCase()}.pdf`,
    output: cv(lang)
  }))
];

export const publicFiles = [
  ...locales.map(home),
  ...locales.map(journey),
  'assets/css/styles.css',
  'assets/js/main.js',
  'assets/js/journey.js',
  ...staticAssets.map(asset => asset.output)
];
