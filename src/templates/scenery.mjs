import { escapeHtml } from './context.mjs';

// Artwork is rendered at build time; the browser only handles animation/input.
export function renderScenery({ content, artwork }) {
  return content.chapters.map((chapter, index) => {
    const drawing = artwork[chapter.scene];
    if (!drawing) throw new Error(`Missing artwork: ${chapter.scene}`);

    const localizedDrawing = drawing.replace(/<text([^>]*)>[^<]*<\/text>/g, (_, attributes) =>
      `<text${attributes} direction="${content.dir}" style="font-family: Arial, sans-serif; letter-spacing: ${content.dir === 'rtl' ? '0' : '.8px'}">${escapeHtml(content.sceneLabels[index])}</text>`
    );

    return `<div class="world-zone">
      <span class="world-zone-label" dir="${content.dir}">${String(index + 1).padStart(2, '0')} / ${escapeHtml(chapter.label)}</span>
      ${localizedDrawing}
    </div>`;
  }).join('\n');
}
