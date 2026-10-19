# Architecture and development

## Reading order

1. `src/config.mjs` defines the three languages and public page paths.
2. `src/content/en.json` shows the content schema; French and Arabic use the same keys.
3. `src/templates/portfolio.mjs` shows how a page is assembled. `portfolio-sections.mjs` contains the main CV sections, while `projects.mjs` renders featured case studies and additional projects.
4. `scripts/build.mjs` coordinates page rendering, asset preparation, and packaging.
5. `tests/` verifies the generated website and its behavior under a repository subpath.

## Build flow

```text
src/content/*.json ──┐
src/templates/*.mjs ─┼─ build-pages.mjs ── six root HTML files
src/artwork/*.svg ───┘

src/styles/*.css ────── build-assets.mjs ── assets/css/styles.css
src/scripts/*.js ────── build-assets.mjs ── assets/js/*.js
public/ ────────────── build-assets.mjs ── assets/cv/ and assets/img/

root HTML + assets/ ─── build.mjs ── dist/ (public files only)
```

`src/` and `public/` are the editable sources. Root HTML and `assets/` are committed outputs for the existing GitHub Pages configuration. This intentionally preserves the current deployment without adding a workflow or changing hosting settings. `dist/` is ignored and regenerated from an explicit allowlist.

The build cleans only the project's generated `dist/` directory and rejects redirected directories. The local server serves only the public-file allowlist. Private development files and Git metadata are not served by that server. A branch-root GitHub Pages deployment follows GitHub's own publishing rules; the allowlist applies to `dist/` and the local server.

## Translations

- Shared contact fields live in `src/content/contact.json`.
- Each locale has its own file, with matching interface-label keys.
- Templates render complete HTML, so translations do not require client-side fetching.
- Arabic uses `dir="rtl"`; Latin technical names and dates are isolated where needed.
- Language navigation preserves the current section or journey chapter in the URL.

When changing factual information, update all three locale files and regenerate the CVs if they contain that information.

## Styles and browser scripts

Stylesheets are concatenated in the order listed in `src/config.mjs`. Project-card styling lives in `src/styles/projects.css`; shared portfolio styles live in `portfolio.css`. Keep responsive and accessibility/print overrides last. The browser receives one stylesheet.

Browser scripts are copied without bundling or minification, keeping them easy to debug. They are classic deferred scripts so the built site can still be opened from disk. SVG scenes are inserted at build time; `src/scripts/journey.js` manages only navigation, animation, and input.

The main portfolio works without JavaScript. The journey reveals a sticky, scroll-driven scene when JavaScript runs: the page scroll position becomes a continuous position along the six-scene world, while arrow buttons, chapter links, and swipe input use the same navigation function. Without JavaScript, the scroll rail collapses and the full text transcript remains available.

## Local development

`npm run dev` builds once and starts the server. Run `npm run build` after edits, then refresh. Use the `PORT` environment variable if port 4173 is busy. To exercise the deployed subpath in PowerShell:

```powershell
$env:PORT = '4174'
$env:BASE_PATH = '/portfolio'
npm run dev
```

Open http://localhost:4174/portfolio/. The automated HTTP check also exercises this subpath using a temporary server and closes it afterward.

## Validation

Run `npm run build` followed by `npm run check`. Checks cover translated content, six page routes, standalone journeys, public links and anchors, CV file signatures, generated files matching their source, exact `dist/` contents, MIME types, subpath URLs, and rejection of non-public local-server paths.

No JavaScript dependencies need installing. The CV generator has separate Python dependencies. `.editorconfig` and `.gitattributes` keep indentation and line endings consistent across editors and systems.

`archive/original-template/` preserves unused artwork. `.openai/hosting.json` is metadata from an earlier unpublished Sites setup; GitHub Pages does not use it. `.sites-publish/`, `tmp/`, and `output/` are ignored local working material.
