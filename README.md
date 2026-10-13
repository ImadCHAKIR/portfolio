# Imad Chakir — Portfolio

A simple, responsive portfolio in English, French, and Arabic, with downloadable two-page CVs and an optional illustrated journey on its own page. Built with semantic HTML, CSS, local SVG artwork, and vanilla JavaScript. Arabic includes right-to-left layouts and support for mixed Arabic and technical terminology.

## Run locally

Open `index.html` directly, or use Node.js 18 or newer:

```sh
npm run dev
```

Visit http://localhost:4173. The local server binds to localhost and serves only public website files. Set `PORT` to use a different port. No JavaScript dependencies need installing.

```sh
npm run check
npm run build
```

The build regenerates all six HTML pages and copies the 13 public files into `dist/`. That directory is ready for a static host. Asset paths also work under a repository subpath. Building does not publish the website.

## Editing and translation

- `content/portfolio.json`: shared English, French, and Arabic content for the website and CVs, including interface labels, experience, projects, skills, education, and journey chapters.
- `scripts/build-pages.mjs`: generates `index.html`, `fr.html`, `ar.html`, and the three `journey*.html` pages. Run `npm run pages` after editing content, or `npm run build` to prepare the complete site.
- `assets/css/styles.css`: professional layout, responsive styles, RTL support, original journey artwork styling, and print layout.
- `assets/js/main.js`: mobile navigation and language links that preserve the current section.
- `assets/js/journey.js`: original SVG scenes, chapter navigation, and keyboard, pointer, and scroll controls.

The language switch links to fully translated pages. Main content and CV downloads work without JavaScript. Each language downloads its matching CV from `assets/cv/`. Email links open the visitor's mail application; the site does not collect messages or personal data.

## Regenerate the CVs

The PDF generator uses Python, Arial fonts, and the packages listed in `scripts/requirements-cv.txt`:

```sh
python -m pip install -r scripts/requirements-cv.txt
python scripts/build-cv.py
npm run build
```

Windows fonts default to `C:/Windows/Fonts`. On another system, supply `--font-dir PATH` pointing to a directory containing `arial.ttf` and `arialbd.ttf`.

The generator creates `output/pdf/Imad-Chakir-CV-EN.pdf`, `-FR.pdf`, and `-AR.pdf`, then copies them into `assets/cv/` for downloading. It checks that each CV has two pages, readable text, and no page overflow. Arabic uses shaped glyphs with logical Unicode text embedded for compatible PDF readers. Rebuilding HTML alone does not regenerate the PDFs, so regenerate both after changing CV content. Review rendered pages after substantive edits.

## Interactive journey

Choose **Explore my journey** to open a separate page. Use arrow keys, Page Up/Page Down, scroll over the scene, swipe/drag horizontally, chapter selectors, or Previous/Next buttons. Home and End jump to the first and last chapters. **Back to portfolio** returns to the main page; chapter links open the relevant portfolio section.

The journey respects reduced motion, pauses when hidden, and stores the current chapter in the URL. Switching languages preserves that chapter. A text version of all six chapters is available below the interactive experience and remains available without JavaScript.

## Checks and content provenance

`npm run check` validates JavaScript syntax, translated content structure, EMI dates, page language and direction, PDF download targets, and local links including section anchors. The implementation was also checked in a browser at desktop and mobile widths, and all three PDFs were visually reviewed.

Content is based on the supplied two-page CV. EMI dates are 2021–2024, as clarified by Imad. Oracle roles remain undated because dates were not supplied. No performance metrics, project repository URLs, or proficiency percentages have been invented. The GitHub profile comes from the previous portfolio; personal email and LinkedIn come from the CV.

The optional exploration takes conceptual inspiration from [Robby Leonardi's interactive résumé](https://www.rleonardi.com/interactive-resume/). The implementation, scenes, and character artwork are original.

## Hosting

`.openai/hosting.json` records a private, unpublished Sites project and its static output directory. The existing GitHub remote is preserved. `.sites-publish/` is ignored staging material and is not needed for local development. Unreferenced original template photos are retained locally but excluded from the build.
