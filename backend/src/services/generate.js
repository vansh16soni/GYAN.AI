import OpenAI from 'openai';
import { buildUserPrompt } from '../prompts.js';
import { buildSystemPrompt } from './promptBuilder.js';

function normalizeContent(content) {
  if (!content) return '';
  let str = content.trim();

  // If the content is double-escaped JSON string (contains literal \n or \" or \t)
  if (str.includes('\\n') || str.includes('\\t') || str.includes('\\"')) {
    str = str
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
  }

  return str;
}

function parseJsonFromText(raw) {
  if (!raw) return null;

  function tryExtract(obj) {
    if (!obj || typeof obj !== 'object') return null;

    // Direct { title, content }
    if (typeof obj.title === 'string' && typeof obj.content === 'string') {
      // Check if inner content is stringified JSON
      const inner = parseJsonFromText(obj.content);
      if (inner?.title && inner?.content) {
        return {
          title: inner.title.trim(),
          content: normalizeContent(inner.content),
        };
      }
      return {
        title: obj.title.trim(),
        content: normalizeContent(obj.content),
      };
    }

    // OpenAI/Pollinations wrapper { role: 'assistant', content: '...' }
    if (typeof obj.content === 'string') {
      const inner = parseJsonFromText(obj.content);
      if (inner?.title && inner?.content) {
        return inner;
      }
    }

    // Choices array format
    if (Array.isArray(obj.choices) && obj.choices[0]?.message?.content) {
      return parseJsonFromText(obj.choices[0].message.content);
    }

    return null;
  }

  // 1. Direct JSON parse
  try {
    const parsed = JSON.parse(raw);
    const extracted = tryExtract(parsed);
    if (extracted) return extracted;
  } catch {}

  // 2. Markdown json codeblock ```json ... ```
  const codeBlockMatch = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1]);
      const extracted = tryExtract(parsed);
      if (extracted) return extracted;
    } catch {}
  }

  // 3. Regex match { "title": ... , "content": ... }
  const jsonObjectMatch = raw.match(/\{[\s\S]*?"title"[\s\S]*?"content"[\s\S]*?\}/);
  if (jsonObjectMatch) {
    try {
      const parsed = JSON.parse(jsonObjectMatch[0]);
      const extracted = tryExtract(parsed);
      if (extracted) return extracted;
    } catch {}
  }

  return null;
}

async function generateWithOpenGPT(type, input, text, systemPrompt) {
  const userPrompt = buildUserPrompt(type, input, text);

  const res = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'openai',
      jsonMode: true,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    throw new Error(`Open GPT request failed with status ${res.status}`);
  }

  const rawText = await res.text();
  const parsed = parseJsonFromText(rawText);

  if (parsed?.title && parsed?.content) {
    return {
      title: parsed.title,
      content: normalizeContent(parsed.content),
    };
  }

  // Fallback: derive title & clean markdown
  const fallbackTitle =
    input.replace(/^https?:\/\/[^\s]+/, '').trim() ||
    (type === 'url' ? 'YouTube Study Notes' : 'Study Notes');

  return {
    title: parsed?.title || fallbackTitle,
    content: normalizeContent(parsed?.content || rawText),
  };
}

export async function generateNotes(type, input, text, settings = null) {
  const systemPrompt = buildSystemPrompt(settings);
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  // If official OpenAI key is provided, use official OpenAI SDK
  if (apiKey && apiKey !== 'sk-...' && !apiKey.startsWith('sk-dummy')) {
    try {
      const openai = new OpenAI({ apiKey });
      const userPrompt = buildUserPrompt(type, input, text);

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      });

      const raw = response.choices[0]?.message?.content;
      if (raw) {
        const parsed = parseJsonFromText(raw);
        if (parsed?.title && parsed?.content) {
          return { title: parsed.title, content: normalizeContent(parsed.content) };
        }
      }
    } catch (err) {
      console.warn('OpenAI SDK call failed, falling back to open GPT model:', err);
    }
  }

  // Use open GPT model with custom dynamic system prompt
  return await generateWithOpenGPT(type, input, text, systemPrompt);
}
