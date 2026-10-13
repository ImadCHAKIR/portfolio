export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// Keep dates and technical names readable inside Arabic paragraphs.
function isolateLatin(value) {
  return String(value).replace(/\(?[A-Za-z0-9.][A-Za-z0-9 .#/+*()–_-]*/g, match => {
    const token = match.replace(/[ .]+$/, '');
    return '\u2066' + token + '\u2069' + match.slice(token.length);
  });
}

export function createPageContext(data, lang, artwork = {}) {
  const content = data[lang];
  const esc = value => escapeHtml(content.dir === 'rtl' ? isolateLatin(value) : value);
  const tags = items => `<div class="tags">${items.map(item =>
    `<span><bdi>${esc(item)}</bdi></span>`
  ).join('')}</div>`;

  return { lang, content, ui: content.ui, contact: data.contact, artwork, esc, tags };
}
