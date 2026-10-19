// Public URLs stay relative so the site works at /portfolio/ and from index.html.
export const locales = ['en', 'fr', 'ar'];
export const names = { en: 'English', fr: 'Français', ar: 'العربية' };
export const shortNames = { en: 'EN', fr: 'FR', ar: 'العربية' };

export const home = lang => lang === 'en' ? 'index.html' : `${lang}.html`;
export const journey = lang => lang === 'en' ? 'journey.html' : `journey-${lang}.html`;
export const authenticator = lang => lang === 'en' ? 'authenticator.html' : `authenticator-${lang}.html`;
export const cv = lang => `assets/cv/Imad-Chakir-CV-${lang.toUpperCase()}.pdf`;

// Concatenation preserves the CSS cascade and avoids extra browser requests.
export const stylesheets = [
  'base',
  'navigation',
  'portfolio',
  'projects',
  'chatbot',
  'journey',
  'responsive',
  'accessibility'
];
