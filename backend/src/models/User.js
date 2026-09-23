import { Schema, model } from 'mongoose';
import { DEFAULT_SETTINGS } from '../config/presets.js';

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  settings: {
    // ── Preset ───────────────────────────────────────────
    preset: {
      type: String,
      enum: ['quick', 'standard', 'exam', 'deep', 'custom'],
      default: 'standard',
    },

    // ── Note Generation ──────────────────────────────────
    style: {
      type: String,
      enum: ['detailed', 'concise', 'exam', 'beginner', 'technical', 'revision'],
      default: 'detailed',
    },
    length: {
      type: String,
      enum: ['quick', 'medium', 'detailed', 'veryDetailed'],
      default: 'medium',
    },
    structure: {
      type: String,
      enum: ['bullets', 'paragraphs', 'steps', 'cornell'],
      default: 'bullets',
    },
    difficulty: {
      type: String,
      enum: ['auto', 'beginner', 'intermediate', 'advanced'],
      default: 'auto',
    },
    language: {
      type: String,
      enum: ['english', 'hindi', 'hinglish', 'other'],
      default: 'english',
    },
    preserveTechnicalTerms: { type: Boolean, default: true },

    // ── Content to Extract ───────────────────────────────
    extract: {
      concepts: { type: Boolean, default: true },
      definitions: { type: Boolean, default: true },
      examples: { type: Boolean, default: true },
      formulas: { type: Boolean, default: false },
      code: { type: Boolean, default: true },
      steps: { type: Boolean, default: false },
      datesNames: { type: Boolean, default: false },
      statistics: { type: Boolean, default: false },
      qa: { type: Boolean, default: false },
      applications: { type: Boolean, default: true },
      quotes: { type: Boolean, default: false },
      timestamps: { type: Boolean, default: true },
    },

    // ── Study Mode ───────────────────────────────────────
    study: {
      flashcards: { type: Boolean, default: false },
      mcqs: { type: Boolean, default: false },
      shortAnswers: { type: Boolean, default: false },
      longAnswers: { type: Boolean, default: false },
      revisionChecklist: { type: Boolean, default: false },
      examImportant: { type: Boolean, default: false },
      spacedRepetition: { type: Boolean, default: false },
      count: { type: Number, default: 10, min: 1, max: 50 },
    },

    // ── Accuracy ─────────────────────────────────────────
    accuracy: {
      mode: {
        type: String,
        enum: ['standard', 'strict'],
        default: 'standard',
      },
      sourcePreference: {
        type: String,
        enum: ['transcript', 'transcript+meta', 'transcript+web'],
        default: 'transcript',
      },
      showTimestamps: { type: Boolean, default: true },
      markUncertainty: { type: Boolean, default: false },
      webVerification: { type: Boolean, default: false },
    },

    // ── AI Response Preferences ──────────────────────────
    ai: {
      explanationStyle: {
        type: String,
        enum: ['simple', 'balanced', 'technical'],
        default: 'balanced',
      },
      useExamples: {
        type: String,
        enum: ['always', 'whenUseful', 'never'],
        default: 'whenUseful',
      },
      useAnalogies: { type: Boolean, default: true },
      explainTerms: { type: Boolean, default: true },
      avoidRepetition: { type: Boolean, default: true },
      autoCorrectTranscript: { type: Boolean, default: true },
    },

    // ── Output ───────────────────────────────────────────
    output: {
      format: {
        type: String,
        enum: ['markdown', 'clipboard'],
        default: 'markdown',
      },
    },

    // ── Video Processing ─────────────────────────────────
    video: {
      autoDetectLanguage: { type: Boolean, default: true },
      useCaptions: { type: Boolean, default: true },
      generateTranscript: { type: Boolean, default: true },
      processChapters: { type: Boolean, default: false },
      includeTimestamps: { type: Boolean, default: false },
      analyzeVisuals: { type: Boolean, default: false },
      maxLengthMinutes: { type: Number, default: 120 },
    },

    // ── History & Storage ────────────────────────────────
    history: {
      saveNotes: { type: Boolean, default: true },
      saveTranscripts: { type: Boolean, default: false },
      autoSave: { type: Boolean, default: true },
      autoDeleteAfterDays: { type: Number, default: null },
    },

    // ── Privacy ──────────────────────────────────────────
    privacy: {
      storeLinks: { type: Boolean, default: true },
      storeNotes: { type: Boolean, default: true },
    },

    // ── Free-text ────────────────────────────────────────
    customInstruction: { type: String, default: '', maxlength: 500 },
  },
});

// Auto-migrate on read if user document doesn't have settings
userSchema.post('init', function (doc) {
  if (!doc.settings || !doc.settings.preset) {
    doc.settings = { ...DEFAULT_SETTINGS, ...(doc.settings || {}) };
  }
});

export const User = model('User', userSchema);
