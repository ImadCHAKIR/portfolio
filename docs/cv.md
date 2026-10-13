# Editing and generating the CVs

## Sources

- Text and translations: `src/content/en.json`, `fr.json`, and `ar.json`.
- Shared contact details: `src/content/contact.json`.
- PDF layout: `scripts/cv/build.py`.
- Downloadable PDF originals: `public/cv/`.

The website and PDFs read the same content files. Regenerate the PDFs after changing résumé details; rebuilding HTML alone does not update them.

## Setup

Use Python with these dependencies:

```sh
python -m pip install -r scripts/cv/requirements.txt
```

The generator uses Arial and Arial Bold, normally found in `C:/Windows/Fonts`. On another system, provide a folder containing `arial.ttf` and `arialbd.ttf` with `--font-dir PATH`.

## Generate

```sh
npm run cv
npm run build
npm run check
```

Or run the generator directly:

```sh
python scripts/cv/build.py --font-dir C:/Windows/Fonts
```

It writes the English, French, and Arabic two-page PDFs to `output/pdf/`, then copies them to `public/cv/`. The website build copies those files to `assets/cv/` and `dist/assets/cv/`, preserving the existing download URLs.

The script validates page count, extracted text, and bottom margins. Arabic uses shaped glyphs with logical Unicode embedded for compatible readers. After substantive content or layout edits, visually inspect both pages of each PDF before committing. Keep `public/cv/` and generated `assets/cv/` copies together in the commit.
