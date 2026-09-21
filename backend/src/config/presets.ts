export interface SettingsType {
  preset: 'quick' | 'standard' | 'exam' | 'deep' | 'custom';
  style: 'detailed' | 'concise' | 'exam' | 'beginner' | 'technical' | 'revision';
  length: 'quick' | 'medium' | 'detailed' | 'veryDetailed';
  structure: 'bullets' | 'paragraphs' | 'steps' | 'cornell';
  difficulty: 'auto' | 'beginner' | 'intermediate' | 'advanced';
  language: 'english' | 'hindi' | 'hinglish' | 'other';
  preserveTechnicalTerms: boolean;
  extract: {
    concepts: boolean;
    definitions: boolean;
    examples: boolean;
    formulas: boolean;
    code: boolean;
    steps: boolean;
    datesNames: boolean;
    statistics: boolean;
    qa: boolean;
    applications: boolean;
    quotes: boolean;
    timestamps: boolean;
  };
  study: {
    flashcards: boolean;
    mcqs: boolean;
    shortAnswers: boolean;
    longAnswers: boolean;
    revisionChecklist: boolean;
    examImportant: boolean;
    spacedRepetition: boolean;
    count: number;
  };
  accuracy: {
    mode: 'standard' | 'strict';
    sourcePreference: 'transcript' | 'transcript+meta' | 'transcript+web';
    showTimestamps: boolean;
    markUncertainty: boolean;
    webVerification: boolean;
  };
  ai: {
    explanationStyle: 'simple' | 'balanced' | 'technical';
    useExamples: 'always' | 'whenUseful' | 'never';
    useAnalogies: boolean;
    explainTerms: boolean;
    avoidRepetition: boolean;
    autoCorrectTranscript: boolean;
  };
  output: {
    format: 'markdown' | 'clipboard';
  };
  video: {
    autoDetectLanguage: boolean;
    useCaptions: boolean;
    generateTranscript: boolean;
    processChapters: boolean;
    includeTimestamps: boolean;
    analyzeVisuals: boolean;
    maxLengthMinutes: number;
  };
  history: {
    saveNotes: boolean;
    saveTranscripts: boolean;
    autoSave: boolean;
    autoDeleteAfterDays: number | null;
  };
  privacy: {
    storeLinks: boolean;
    storeNotes: boolean;
  };
  customInstruction: string;
}

export const PRESETS: Record<string, Partial<SettingsType>> = {
  quick: {
    style: 'concise',
    length: 'quick',
    structure: 'bullets',
    difficulty: 'auto',
    language: 'english',
    preserveTechnicalTerms: true,
    extract: {
      concepts: true,
      definitions: true,
      examples: false,
      formulas: false,
      code: false,
      steps: false,
      datesNames: false,
      statistics: false,
      qa: false,
      applications: false,
      quotes: false,
      timestamps: false,
    },
    study: {
      flashcards: false,
      mcqs: false,
      shortAnswers: false,
      longAnswers: false,
      revisionChecklist: false,
      examImportant: false,
      spacedRepetition: false,
      count: 10,
    },
    accuracy: {
      mode: 'standard',
      sourcePreference: 'transcript',
      showTimestamps: false,
      markUncertainty: false,
      webVerification: false,
    },
    ai: {
      explanationStyle: 'simple',
      useExamples: 'whenUseful',
      useAnalogies: false,
      explainTerms: false,
      avoidRepetition: true,
      autoCorrectTranscript: true,
    },
  },

  standard: {
    style: 'detailed',
    length: 'medium',
    structure: 'bullets',
    difficulty: 'auto',
    language: 'english',
    preserveTechnicalTerms: true,
    extract: {
      concepts: true,
      definitions: true,
      examples: true,
      formulas: false,
      code: true,
      steps: false,
      datesNames: false,
      statistics: false,
      qa: false,
      applications: true,
      quotes: false,
      timestamps: true,
    },
    study: {
      flashcards: false,
      mcqs: false,
      shortAnswers: false,
      longAnswers: false,
      revisionChecklist: false,
      examImportant: false,
      spacedRepetition: false,
      count: 10,
    },
    accuracy: {
      mode: 'standard',
      sourcePreference: 'transcript',
      showTimestamps: true,
      markUncertainty: false,
      webVerification: false,
    },
    ai: {
      explanationStyle: 'balanced',
      useExamples: 'whenUseful',
      useAnalogies: true,
      explainTerms: true,
      avoidRepetition: true,
      autoCorrectTranscript: true,
    },
  },

  exam: {
    style: 'exam',
    length: 'detailed',
    structure: 'bullets',
    difficulty: 'intermediate',
    language: 'english',
    preserveTechnicalTerms: true,
    extract: {
      concepts: true,
      definitions: true,
      examples: true,
      formulas: true,
      code: true,
      steps: true,
      datesNames: true,
      statistics: true,
      qa: true,
      applications: true,
      quotes: true,
      timestamps: false,
    },
    study: {
      flashcards: true,
      mcqs: true,
      shortAnswers: true,
      longAnswers: true,
      revisionChecklist: true,
      examImportant: true,
      spacedRepetition: false,
      count: 20,
    },
    accuracy: {
      mode: 'strict',
      sourcePreference: 'transcript+meta',
      showTimestamps: false,
      markUncertainty: true,
      webVerification: false,
    },
    ai: {
      explanationStyle: 'balanced',
      useExamples: 'always',
      useAnalogies: true,
      explainTerms: true,
      avoidRepetition: true,
      autoCorrectTranscript: true,
    },
  },

  deep: {
    style: 'technical',
    length: 'veryDetailed',
    structure: 'paragraphs',
    difficulty: 'advanced',
    language: 'english',
    preserveTechnicalTerms: true,
    extract: {
      concepts: true,
      definitions: true,
      examples: true,
      formulas: true,
      code: true,
      steps: true,
      datesNames: true,
      statistics: true,
      qa: true,
      applications: true,
      quotes: true,
      timestamps: true,
    },
    study: {
      flashcards: false,
      mcqs: false,
      shortAnswers: false,
      longAnswers: false,
      revisionChecklist: false,
      examImportant: false,
      spacedRepetition: false,
      count: 10,
    },
    accuracy: {
      mode: 'strict',
      sourcePreference: 'transcript+meta',
      showTimestamps: true,
      markUncertainty: true,
      webVerification: false,
    },
    ai: {
      explanationStyle: 'technical',
      useExamples: 'whenUseful',
      useAnalogies: false,
      explainTerms: false,
      avoidRepetition: true,
      autoCorrectTranscript: true,
    },
  },
};

export const DEFAULT_SETTINGS: SettingsType = {
  preset: 'standard',
  style: 'detailed',
  length: 'medium',
  structure: 'bullets',
  difficulty: 'auto',
  language: 'english',
  preserveTechnicalTerms: true,
  extract: {
    concepts: true,
    definitions: true,
    examples: true,
    formulas: false,
    code: true,
    steps: false,
    datesNames: false,
    statistics: false,
    qa: false,
    applications: true,
    quotes: false,
    timestamps: true,
  },
  study: {
    flashcards: false,
    mcqs: false,
    shortAnswers: false,
    longAnswers: false,
    revisionChecklist: false,
    examImportant: false,
    spacedRepetition: false,
    count: 10,
  },
  accuracy: {
    mode: 'standard',
    sourcePreference: 'transcript',
    showTimestamps: true,
    markUncertainty: false,
    webVerification: false,
  },
  ai: {
    explanationStyle: 'balanced',
    useExamples: 'whenUseful',
    useAnalogies: true,
    explainTerms: true,
    avoidRepetition: true,
    autoCorrectTranscript: true,
  },
  output: {
    format: 'markdown',
  },
  video: {
    autoDetectLanguage: true,
    useCaptions: true,
    generateTranscript: true,
    processChapters: false,
    includeTimestamps: false,
    analyzeVisuals: false,
    maxLengthMinutes: 120,
  },
  history: {
    saveNotes: true,
    saveTranscripts: false,
    autoSave: true,
    autoDeleteAfterDays: null,
  },
  privacy: {
    storeLinks: true,
    storeNotes: true,
  },
  customInstruction: '',
};

export const PRESET_METADATA = [
  {
    id: 'quick',
    name: 'Quick',
    desc: 'Concise summary focusing on core concepts and definitions.',
    badge: 'Fast',
  },
  {
    id: 'standard',
    name: 'Standard',
    desc: 'Balanced depth with concepts, examples, code, and key takeaways.',
    badge: 'Popular',
  },
  {
    id: 'exam',
    name: 'Exam Prep',
    desc: 'Test-focused notes with flashcards, MCQs, Q&As, and revision checklist.',
    badge: 'Study',
  },
  {
    id: 'deep',
    name: 'Deep Dive',
    desc: 'Comprehensive technical exploration with in-depth explanations.',
    badge: 'Advanced',
  },
];

