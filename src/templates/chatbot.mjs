import { cv } from '../config.mjs';
import { escapeHtml } from './context.mjs';

export function renderChatbot({ lang, content, ui, contact, esc }) {
  const suggestions = content.chatbot.intents.filter(intent =>
    content.chatbot.suggestions.includes(intent.id)
  );
  const payload = JSON.stringify(content.chatbot).replaceAll('<', '\\u003c');

  return `<aside class="portfolio-chat" data-portfolio-chat dir="${content.dir}" hidden>
    <section class="chatbot-panel" id="portfolio-chat-panel" role="region" aria-labelledby="chatbot-title" hidden>
      <header class="chatbot-header">
        <div>
          <h2 id="chatbot-title">${esc(ui.chatTitle)}</h2>
          <p class="chatbot-subtitle">${esc(ui.chatSubtitle)}</p>
        </div>
        <button class="chatbot-close" type="button" aria-label="${esc(ui.chatClose)}" aria-controls="portfolio-chat-panel">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </header>
      <div class="chatbot-messages" id="chatbot-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="${esc(ui.chatTranscript)}">
        <p class="chatbot-message chatbot-message-assistant" dir="auto">${esc(content.chatbot.welcome)}</p>
      </div>
      <div class="chatbot-suggestions" role="group" aria-label="${esc(ui.chatSuggestions)}">
        ${suggestions.map(intent => `<button type="button" data-chat-intent="${escapeHtml(intent.id)}">${esc(intent.prompt)}</button>`).join('\n        ')}
      </div>
      <form class="chatbot-form">
        <label class="chatbot-visually-hidden" for="chatbot-question">${esc(ui.chatInputLabel)}</label>
        <input id="chatbot-question" name="question" type="text" maxlength="300" autocomplete="off" placeholder="${esc(ui.chatPlaceholder)}" dir="auto">
        <button type="submit">${esc(ui.chatSend)}</button>
      </form>
      <nav class="chatbot-links" aria-label="${esc(ui.chatLinks)}">
        <a href="${cv(lang)}" download>${esc(ui.chatDownloadCv)}</a>
        <a href="mailto:${escapeHtml(contact.email)}">${esc(ui.chatEmail)}</a>
        <a href="${escapeHtml(contact.linkedin)}" target="_blank" rel="noopener noreferrer">${esc(ui.chatLinkedIn)} <span aria-hidden="true">↗</span></a>
      </nav>
    </section>
    <button class="chatbot-launcher" type="button" aria-expanded="false" aria-controls="portfolio-chat-panel">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.6-.8L4 20l1.5-3.7A7.2 7.2 0 0 1 4 11.5 7.7 7.7 0 0 1 12 4a7.7 7.7 0 0 1 8 7.5Z"/><path d="M8 11h8M8 14h5"/></svg>
      <span>${esc(ui.chatLauncher)}</span>
    </button>
  </aside>
  <script type="application/json" id="chatbot-data">${payload}</script>`;
}
