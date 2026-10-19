# Imad Chakir — Portfolio

A portfolio in English, French, and Arabic, with downloadable CVs and an optional interactive journey. Plain HTML, CSS, and JavaScript; no framework or JavaScript dependencies.

## Start here

Requires Node.js 18 or newer.

```sh
npm run dev
```

Open http://localhost:4173. The command builds the site and starts a local server. After editing a source file, run `npm run build` in another terminal and refresh the browser. There is no automatic rebuild watcher.

Already-generated pages also work by opening `index.html` directly.

## Project structure

```text
src/                         Editable website source
  content/
    contact.json             Shared name, email, and profile links
    en.json                  English content and interface labels
    fr.json                  French content and interface labels
    ar.json                  Arabic content and interface labels
  templates/
    portfolio.mjs            Assembles the main portfolio page
    portfolio-sections.mjs   Introduction, experience, skills, education, and contact
    projects.mjs              Featured work case studies and additional projects
    journey.mjs              Journey page and accessible text transcript
    layout.mjs               Shared document head, navigation, and footer
    context.mjs              HTML escaping and Arabic text direction
    scenery.mjs              Inserts and translates the SVG illustrations
  styles/                    Base, navigation, portfolio, projects, journey, responsive, accessibility
  scripts/                   Mobile menu and interactive journey controls
  artwork/                   Original SVG scenes and avatar
  config.mjs                 Languages, public URLs, and stylesheet order
public/                      Original downloadable files and favicon
  cv/                        English, French, and Arabic PDFs
  img/                       Favicon
scripts/                     Build and local-server commands
  lib/                       Content loading, paths, and public-file manifest
  cv/                        Python CV generator and its requirements
tests/                      Automated content, build, and HTTP checks
docs/                       Architecture and CV editing guides
archive/original-template/  Unused images retained from the old portfolio
```

The six HTML files and `assets/` in the repository root are **generated deployment files**. Keep them committed because GitHub Pages currently serves the root of `main`. Edit `src/` or `public/`, then rebuild; direct edits to generated files will be overwritten. `dist/` is a clean copy containing only the 13 public website files.

## Where to make changes

| Change | Edit |
| --- | --- |
| Experience, featured work, projects, skills, education, or translations | `src/content/en.json`, `fr.json`, and `ar.json` |
| Email, name, LinkedIn, or GitHub | `src/content/contact.json` |
| Page layout or sections | `src/templates/` |
| Project cards and case-study layout | `src/templates/projects.mjs`, `src/styles/projects.css` |
| Colors, typography, or general spacing | `src/styles/` |
| Navigation or journey behavior | `src/scripts/` |
| Illustrated journey scenes | `src/artwork/` |
| CV layout or generation | `scripts/cv/build.py`; see [the CV guide](docs/cv.md) |

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Build and start the local server on port 4173 |
| `npm run build` | Regenerate root HTML/assets and rebuild `dist/` |
| `npm run check` | Check syntax, translations, links, generated output, PDFs, and HTTP paths |
| `npm test` | Alias for `npm run check` |
| `npm run pages` | Regenerate HTML only after a template or text change |
| `npm run cv` | Regenerate the three PDFs; requires Python dependencies |

Before pushing changes to GitHub:

```sh
npm run build
npm run check
```

Commit the source edits **and** updated root HTML/assets together. The current GitHub Pages branch/root setup and `/portfolio/` URLs do not need to change. Building does not push or publish anything. If a browser shows an older design after deployment, use Ctrl+Shift+R.

See [architecture and development](docs/architecture.md) for the build flow and [CV generation](docs/cv.md) for Python setup.

## Content and credits

The supplied CV is the content source. EMI dates are 2021–2024; Oracle roles remain undated because dates were not supplied. No performance metrics or project repository URLs have been invented.

The journey takes conceptual inspiration from [Robby Leonardi's interactive résumé](https://www.rleonardi.com/interactive-resume/). The implementation, SVG scenery, and character artwork are original. All six chapters have a text transcript, and animation respects reduced motion.
