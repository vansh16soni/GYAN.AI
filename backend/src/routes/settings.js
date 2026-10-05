import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Note } from '../models/Note.js';
import { PRESETS, DEFAULT_SETTINGS, PRESET_METADATA } from '../config/presets.js';

const router = Router();
router.use(auth);

const updateSettingsSchema = z.object({
  preset: z.enum(['quick', 'standard', 'exam', 'deep', 'custom']).optional(),
  style: z.enum(['detailed', 'concise', 'exam', 'beginner', 'technical', 'revision']).optional(),
  length: z.enum(['quick', 'medium', 'detailed', 'veryDetailed']).optional(),
  structure: z.enum(['bullets', 'paragraphs', 'steps', 'cornell']).optional(),
  difficulty: z.enum(['auto', 'beginner', 'intermediate', 'advanced']).optional(),
  language: z.enum(['english', 'hindi', 'hinglish', 'other']).optional(),
  preserveTechnicalTerms: z.boolean().optional(),
  extract: z
    .object({
      concepts: z.boolean().optional(),
      definitions: z.boolean().optional(),
      examples: z.boolean().optional(),
      formulas: z.boolean().optional(),
      code: z.boolean().optional(),
      steps: z.boolean().optional(),
      datesNames: z.boolean().optional(),
      statistics: z.boolean().optional(),
      qa: z.boolean().optional(),
      applications: z.boolean().optional(),
      quotes: z.boolean().optional(),
      timestamps: z.boolean().optional(),
    })
    .optional(),
  study: z
    .object({
      flashcards: z.boolean().optional(),
      mcqs: z.boolean().optional(),
      shortAnswers: z.boolean().optional(),
      longAnswers: z.boolean().optional(),
      revisionChecklist: z.boolean().optional(),
      examImportant: z.boolean().optional(),
      spacedRepetition: z.boolean().optional(),
      count: z.number().min(1).max(50).optional(),
    })
    .optional(),
  accuracy: z
    .object({
      mode: z.enum(['standard', 'strict']).optional(),
      sourcePreference: z.enum(['transcript', 'transcript+meta', 'transcript+web']).optional(),
      showTimestamps: z.boolean().optional(),
      markUncertainty: z.boolean().optional(),
      webVerification: z.boolean().optional(),
    })
    .optional(),
  ai: z
    .object({
      explanationStyle: z.enum(['simple', 'balanced', 'technical']).optional(),
      useExamples: z.enum(['always', 'whenUseful', 'never']).optional(),
      useAnalogies: z.boolean().optional(),
      explainTerms: z.boolean().optional(),
      avoidRepetition: z.boolean().optional(),
      autoCorrectTranscript: z.boolean().optional(),
    })
    .optional(),
  output: z
    .object({
      format: z.enum(['markdown', 'clipboard']).optional(),
    })
    .optional(),
  video: z
    .object({
      autoDetectLanguage: z.boolean().optional(),
      useCaptions: z.boolean().optional(),
      generateTranscript: z.boolean().optional(),
      processChapters: z.boolean().optional(),
      includeTimestamps: z.boolean().optional(),
      analyzeVisuals: z.boolean().optional(),
      maxLengthMinutes: z.number().optional(),
    })
    .optional(),
  history: z
    .object({
      saveNotes: z.boolean().optional(),
      saveTranscripts: z.boolean().optional(),
      autoSave: z.boolean().optional(),
      autoDeleteAfterDays: z.number().nullable().optional(),
    })
    .optional(),
  privacy: z
    .object({
      storeLinks: z.boolean().optional(),
      storeNotes: z.boolean().optional(),
    })
    .optional(),
  customInstruction: z.string().max(500).optional(),
});

// GET /api/settings - Fetch full settings object
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'USER_NOT_FOUND' });

    const settings = {
      ...DEFAULT_SETTINGS,
      ...(user.settings || {}),
    };
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'FETCH_SETTINGS_FAILED', message: err?.message });
  }
});

// PUT /api/settings - Update partial settings
router.put('/', async (req, res) => {
  const parsed = updateSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'INVALID_SETTINGS', details: parsed.error.flatten() });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'USER_NOT_FOUND' });

    const currentSettings = user.settings ? JSON.parse(JSON.stringify(user.settings)) : DEFAULT_SETTINGS;
    const incoming = parsed.data;

    // Deep merge nested sections
    const merged = {
      ...currentSettings,
      ...incoming,
      extract: { ...currentSettings.extract, ...(incoming.extract || {}) },
      study: { ...currentSettings.study, ...(incoming.study || {}) },
      accuracy: { ...currentSettings.accuracy, ...(incoming.accuracy || {}) },
      ai: { ...currentSettings.ai, ...(incoming.ai || {}) },
      output: { ...currentSettings.output, ...(incoming.output || {}) },
      video: { ...currentSettings.video, ...(incoming.video || {}) },
      history: { ...currentSettings.history, ...(incoming.history || {}) },
      privacy: { ...currentSettings.privacy, ...(incoming.privacy || {}) },
    };

    user.settings = merged;
    user.markModified('settings');
    await user.save();

    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'UPDATE_SETTINGS_FAILED', message: err?.message });
  }
});

// POST /api/settings/reset - Reset to standard preset
router.post('/reset', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'USER_NOT_FOUND' });

    user.settings = { ...DEFAULT_SETTINGS, preset: 'standard' };
    user.markModified('settings');
    await user.save();

    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'RESET_SETTINGS_FAILED', message: err?.message });
  }
});

// POST /api/settings/apply-preset - Apply specific preset
router.post('/apply-preset', async (req, res) => {
  const { preset } = req.body;
  if (!preset || !PRESETS[preset]) {
    return res.status(400).json({ error: 'INVALID_PRESET', message: 'Valid presets: quick, standard, exam, deep' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'USER_NOT_FOUND' });

    const presetValues = PRESETS[preset];
    user.settings = {
      ...DEFAULT_SETTINGS,
      ...presetValues,
      preset,
      customInstruction: user.settings?.customInstruction || '',
    };
    user.markModified('settings');
    await user.save();

    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'APPLY_PRESET_FAILED', message: err?.message });
  }
});

// GET /api/settings/presets - List preset metadata
router.get('/presets', (_req, res) => {
  res.json(PRESET_METADATA);
});

// GET /api/settings/export - Download settings JSON
router.get('/export', async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'USER_NOT_FOUND' });

    const exportData = {
      appName: 'gyan.ai',
      exportDate: new Date().toISOString(),
      user: {
        username: user.username,
        email: user.email,
      },
      settings: user.settings || DEFAULT_SETTINGS,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="gyanai-settings.json"');
    res.send(JSON.stringify(exportData, null, 2));
  } catch (err) {
    res.status(500).json({ error: 'EXPORT_FAILED', message: err?.message });
  }
});

// DELETE /api/settings/data - Delete all notes & reset settings
router.delete('/data', async (req, res) => {
  try {
    await Note.deleteMany({ userId: req.userId });
    const user = await User.findById(req.userId);
    if (user) {
      user.settings = { ...DEFAULT_SETTINGS, preset: 'standard' };
      await user.save();
    }

    res.json({ ok: true, message: 'All user notes deleted and settings reset to defaults.' });
  } catch (err) {
    res.status(500).json({ error: 'DELETE_DATA_FAILED', message: err?.message });
  }
});

export default router;
