import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { sourceDir } from '../scripts/lib/paths.mjs';
import { loadContent } from '../scripts/lib/content.mjs';
import { locales } from '../src/config.mjs';
import { matchChatIntent, normalizeChatText } from '../src/scripts/chatbot.mjs';

const content = await loadContent();

const typedQuestions = {
  en: [
    ['Could you summarize his profile?', 'overview'],
    ['Tell me what Imad did at Oracle.', 'experience'],
    ['Can you list his projects?', 'projects'],
    ['Does he know Docker and Terraform?', 'skills'],
    ['Where did he study?', 'education'],
    ['Is he suitable for a QA role?', 'fit'],
    ['Where is his résumé?', 'cv'],
    ['How do I reach Imad?', 'contact']
  ],
  fr: [
    ['Quel est son profil ?', 'overview'],
    ['Que faisait-il chez Oracle ?', 'experience'],
    ['Quels projets a-t-il réalisés ?', 'projects'],
    ['Est-ce qu’il connaît Docker ?', 'skills'],
    ['Quelles sont ses études ?', 'education'],
    ['Est-il adapté à un poste backend ?', 'fit'],
    ['Comment télécharger le CV ?', 'cv'],
    ['Quel est son e-mail ?', 'contact']
  ],
  ar: [
    ['من هو عماد؟', 'overview'],
    ['ما خبرته لدى Oracle؟', 'experience'],
    ['ما المشاريع التي أنجزها؟', 'projects'],
    ['ما التقنيات التي يستخدمها؟', 'skills'],
    ['ما اللغات التي يتحدث بها؟', 'education'],
    ['ما الأدوار المناسبة لخبرته؟', 'fit'],
    ['أين أجد السيرة الذاتية؟', 'cv'],
    ['البريد الإلكتروني', 'contact']
  ]
};

test('typed questions match the curated intent in each page language', () => {
  for (const lang of locales) {
    const intents = content[lang].chatbot.intents;
    for (const [question, expectedId] of typedQuestions[lang]) {
      const match = matchChatIntent(question, intents);
      assert.equal(match?.id, expectedId, `${lang}: ${question}`);
      assert.equal(match?.answer, intents.find(intent => intent.id === expectedId)?.answer);
    }
  }
});

test('prepared prompts point to localized, evidence-based replies', () => {
  for (const lang of locales) {
    const chatbot = content[lang].chatbot;
    assert.ok(chatbot.welcome.trim());
    assert.ok(chatbot.fallback.trim());
    assert.deepEqual(chatbot.suggestions, ['overview', 'experience', 'projects', 'skills']);
    for (const intent of chatbot.intents) {
      assert.ok(intent.prompt.trim(), `${lang}/${intent.id}: prompt`);
      assert.ok(intent.answer.trim(), `${lang}/${intent.id}: answer`);
      assert.ok(intent.terms.length, `${lang}/${intent.id}: matching terms`);
    }
    for (const suggestionId of chatbot.suggestions) {
      const intent = chatbot.intents.find(item => item.id === suggestionId);
      const match = matchChatIntent(intent.prompt, chatbot.intents);
      assert.equal(match?.id, suggestionId, `${lang}: ${intent.prompt}`);
      assert.equal(match.answer, intent.answer);
    }
    assert.equal(matchChatIntent('What is his favorite color?', chatbot.intents), null);
    assert.ok(chatbot.fallback.trim(), `${lang}: missing localized fallback`);
  }
});

test('unknown or ambiguous questions fall back instead of guessing', () => {
  const intents = content.en.chatbot.intents;
  assert.equal(matchChatIntent('What is his favorite color?', intents), null);
  assert.equal(matchChatIntent('projects and skills', intents), null);
  assert.equal(matchChatIntent('   ', intents), null);
  assert.ok(content.en.chatbot.fallback.includes('verified answer'));
  assert.equal(normalizeChatText('RÉSUMÉ'), 'resume');
  assert.equal(normalizeChatText('الأدوار المناسبة'), 'الادوار المناسبة');
});

test('greetings, thanks, help, and mixed conversational questions receive a useful reply', () => {
  const mixedQuestions = {
    en: 'Hi, what projects has Imad built?',
    fr: 'Salut, quels projets a-t-il réalisés ?',
    ar: 'مرحباً، ما المشاريع التي أنجزها؟'
  };
  for (const lang of locales) {
    const intents = content[lang].chatbot.intents;
    assert.equal(matchChatIntent('Hi', intents)?.id, 'greeting', `${lang}: greeting`);
    assert.equal(matchChatIntent('Thanks!', intents)?.id, 'thanks', `${lang}: thanks`);
    assert.equal(matchChatIntent('What can you help me with?', intents)?.id, 'help', `${lang}: help`);
    assert.equal(matchChatIntent(mixedQuestions[lang], intents)?.id, 'projects', `${lang}: greeting plus portfolio question`);
    const greeting = matchChatIntent('Hi', intents);
    assert.ok(greeting.answer.trim(), `${lang}: greeting needs a localized response`);
  }
  assert.equal(matchChatIntent('Hi, thanks!', content.en.chatbot.intents)?.id, 'greeting');
});

test('chat has no network or persistent visitor-message storage code', async () => {
  const source = await readFile(new URL('../src/scripts/chatbot.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon/);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /input\.focus\(\)/, 'Opening the panel should move focus to the input');
  assert.match(source, /launcher\.focus\(\)/, 'Closing the panel should return focus to its launcher');
  assert.match(source, /event\.preventDefault\(\)/, 'The chat form should handle keyboard submission locally');
});

test('chat layout supports small screens and safe-area insets', async () => {
  const css = await readFile(new URL('../src/styles/chatbot.css', import.meta.url), 'utf8');
  assert.match(css, /@media\s*\(max-width:\s*500px\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  const accessibilityCss = await readFile(new URL('../src/styles/base.css', import.meta.url), 'utf8');
  assert.match(accessibilityCss, /:focus-visible\s*\{[^}]*outline:/s, 'Keyboard focus must stay visible');
});
