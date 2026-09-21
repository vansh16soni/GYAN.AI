import { PRESETS, SettingsType, DEFAULT_SETTINGS } from '../config/presets';

function diffFromPreset(settings: any, presetName: string) {
  const base = (PRESETS[presetName] || PRESETS.standard) as any;
  const dirty: Record<string, any> = {};

  for (const key of Object.keys(settings)) {
    if (['preset', 'customInstruction'].includes(key)) continue;
    const val = settings[key];
    const baseVal = base[key];

    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      for (const sub of Object.keys(val)) {
        if (val[sub] !== baseVal?.[sub]) {
          dirty[`${key}.${sub}`] = val[sub];
        }
      }
    } else if (val !== baseVal) {
      dirty[key] = val;
    }
  }
  return dirty;
}

export function buildSystemPrompt(userSettings?: Partial<SettingsType> | null): string {
  const settings = {
    ...DEFAULT_SETTINGS,
    ...(userSettings || {}),
    extract: { ...DEFAULT_SETTINGS.extract, ...(userSettings?.extract || {}) },
    study: { ...DEFAULT_SETTINGS.study, ...(userSettings?.study || {}) },
    accuracy: { ...DEFAULT_SETTINGS.accuracy, ...(userSettings?.accuracy || {}) },
    ai: { ...DEFAULT_SETTINGS.ai, ...(userSettings?.ai || {}) },
    output: { ...DEFAULT_SETTINGS.output, ...(userSettings?.output || {}) },
    video: { ...DEFAULT_SETTINGS.video, ...(userSettings?.video || {}) },
    history: { ...DEFAULT_SETTINGS.history, ...(userSettings?.history || {}) },
    privacy: { ...DEFAULT_SETTINGS.privacy, ...(userSettings?.privacy || {}) },
  };

  const presetName = settings.preset || 'standard';
  const dirty = diffFromPreset(settings, presetName);

  const lines: string[] = [
    `You are a notes generator. Given a topic or transcript, produce clean, well-structured notes.`,
    ``,
    `Return valid JSON: { "title": string, "content": string }`,
    `\`content\` must be Markdown.`,
    ``,
    `Base rules:`,
    `- Use ## and ### headings. Choose headings that fit the material.`,
    `- Prefer bullets, short paragraphs, and clear definitions.`,
    `- Include code blocks (with language tags) only where the material involves code.`,
    `- Include a Mermaid diagram only when a process, flow, hierarchy, or architecture is described.`,
    `- Preserve facts, terms, and details from the source. Do not invent.`,
    `- No study tips, motivational lines, or commentary about the user or task.`,
    `- Output only the JSON. No text outside it.`,
  ];

  // Only add rules for settings the user actually changed or active style
  const style = dirty.style || (presetName === 'custom' ? settings.style : undefined);
  if (style === 'concise') lines.push(`- Keep the notes brief: aim for ~300–500 words.`);
  if (style === 'detailed') lines.push(`- Be thorough and comprehensive.`);
  if (style === 'exam') lines.push(`- Focus on exam-relevant facts, definitions, and likely questions.`);
  if (style === 'beginner') lines.push(`- Explain concepts as if to a beginner. Define all jargon.`);
  if (style === 'technical') lines.push(`- Use precise technical language. Assume domain expertise.`);
  if (style === 'revision') lines.push(`- Format as fast-revision notes: short bullets, bold key terms.`);

  const length = dirty.length || (presetName === 'custom' ? settings.length : undefined);
  if (length === 'quick') lines.push(`- Target a quick summary: ~200–300 words.`);
  if (length === 'veryDetailed') lines.push(`- Target a very detailed write-up: 1500+ words if the source supports it. Do not pad.`);

  const structure = dirty.structure || (presetName === 'custom' ? settings.structure : undefined);
  if (structure === 'bullets') lines.push(`- Structure content as headings + bullet points.`);
  if (structure === 'paragraphs') lines.push(`- Prefer prose paragraphs over bullets.`);
  if (structure === 'steps') lines.push(`- Where applicable, format as numbered steps.`);
  if (structure === 'cornell') lines.push(`- Use Cornell-style layout: cues column, notes column, summary at the end. Use Markdown tables.`);

  const difficulty = dirty.difficulty || (presetName === 'custom' ? settings.difficulty : undefined);
  if (difficulty === 'beginner') lines.push(`- Assume no prior knowledge.`);
  if (difficulty === 'intermediate') lines.push(`- Assume basic familiarity.`);
  if (difficulty === 'advanced') lines.push(`- Assume strong prior knowledge; skip basics.`);
  if (difficulty === 'auto') lines.push(`- Infer difficulty from the source and adapt.`);

  const language = dirty.language || (presetName === 'custom' ? settings.language : undefined);
  if (language === 'hindi') lines.push(`- Write in Hindi.`);
  if (language === 'hinglish') lines.push(`- Write in Hinglish (Hindi + English mix).`);
  if (language === 'other') lines.push(`- Detect the source language and write in it.`);
  if (settings.preserveTechnicalTerms && language && language !== 'english') {
    lines.push(`- Preserve technical terms in English. Do not translate them.`);
  }

  // Extraction
  const ex = settings.extract;
  const extractOn = Object.entries(ex).filter(([, v]) => v).map(([k]) => k);
  if (extractOn.length < 12) {
    lines.push(`- Extract specifically: ${extractOn.join(', ')}. Skip other content types.`);
  }
  if (ex.timestamps) {
    lines.push(`- Include video timestamps (mm:ss) alongside key points.`);
  }

  // Study mode — only if any enabled
  const st = settings.study;
  const studyOn = Object.entries(st).filter(([k, v]) => v && k !== 'count');
  if (studyOn.length) {
    lines.push(``, `Additional output sections:`);
    if (st.flashcards) lines.push(`- ## Flashcards: ${st.count} Q/A pairs.`);
    if (st.mcqs) lines.push(`- ## MCQs: ${st.count} multiple-choice questions with 4 options and answers.`);
    if (st.shortAnswers) lines.push(`- ## Short Answer Questions: ${st.count} questions with 2–3 line answers.`);
    if (st.longAnswers) lines.push(`- ## Long Answer Questions: ${st.count} questions with detailed model answers.`);
    if (st.revisionChecklist) lines.push(`- ## Revision Checklist: bullet list of items to verify before an exam.`);
    if (st.examImportant) lines.push(`- ## Exam-Important Topics: ranked list of the most testable subtopics.`);
    if (st.spacedRepetition) lines.push(`- ## Spaced Repetition Schedule: day-by-day review plan.`);
  }

  // Accuracy
  if (settings.accuracy.mode === 'strict') {
    lines.push(``, `Accuracy mode: STRICT`);
    lines.push(`- Do not state anything unsupported by the source.`);
    lines.push(`- If uncertain, mark with [uncertain].`);
    lines.push(`- Distinguish speaker claims from general knowledge.`);
    lines.push(`- Preserve all numbers and formulas exactly.`);
  }
  if (settings.accuracy.showTimestamps) lines.push(`- Show timestamps where possible.`);

  // AI preferences
  if (settings.ai.explanationStyle === 'simple') lines.push(`- Use simple, plain explanations.`);
  if (settings.ai.explanationStyle === 'technical') lines.push(`- Use technical, precise explanations.`);
  if (settings.ai.useExamples === 'always') lines.push(`- Always include concrete examples.`);
  if (settings.ai.useExamples === 'never') lines.push(`- Do not include examples.`);
  if (settings.ai.useAnalogies) lines.push(`- Use analogies where they aid understanding.`);
  if (settings.ai.explainTerms) lines.push(`- Define unfamiliar terms on first use.`);
  if (settings.ai.avoidRepetition) lines.push(`- Avoid repeating the same point in different words.`);
  if (settings.ai.autoCorrectTranscript) lines.push(`- Silently fix obvious transcript errors (typos, misheard words).`);

  // Custom instruction
  if (settings.customInstruction?.trim()) {
    lines.push(``, `User instruction: ${settings.customInstruction.trim()}`);
  }

  const prompt = lines.join('\n');

  // Estimate tokens (~4 chars per token)
  const estimatedTokens = Math.round(prompt.length / 4);
  if (estimatedTokens > 800) {
    console.warn(`[PromptBuilder Warning] System prompt is large (~${estimatedTokens} tokens).`);
  }

  // Dev mode logging
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n--- [PromptBuilder] Dynamic System Prompt (Preset: ' + presetName + ') ---');
    console.log(prompt);
    console.log('--- [PromptBuilder End] (~' + estimatedTokens + ' tokens) ---\n');
  }

  return prompt;
}
