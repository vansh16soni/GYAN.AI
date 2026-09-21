export interface ConflictRule {
  if: Record<string, any>;
  disable?: Record<string, any[]>;
  force?: Record<string, any>;
  reason?: string;
}

export const CONFLICTS: ConflictRule[] = [
  // Style ↔ Length
  {
    if: { style: 'concise' },
    disable: { length: ['veryDetailed'] },
    reason: 'Not available with Concise style.',
  },
  {
    if: { style: 'revision' },
    disable: { length: ['veryDetailed'] },
    reason: 'Not available with Revision style.',
  },

  // Style ↔ Difficulty
  {
    if: { style: 'beginner' },
    disable: { difficulty: ['advanced'] },
    reason: 'Not available with Beginner style.',
  },
  {
    if: { style: 'technical' },
    disable: { difficulty: ['beginner'] },
    reason: 'Not available with Technical style.',
  },

  // Difficulty ↔ Explanation style
  {
    if: { difficulty: 'beginner' },
    disable: { 'ai.explanationStyle': ['technical'] },
    reason: 'Not available with Beginner difficulty.',
  },
  {
    if: { difficulty: 'advanced' },
    disable: { 'ai.explanationStyle': ['simple'] },
    reason: 'Not available with Advanced difficulty.',
  },

  // Source preference ↔ Web verification
  {
    if: { 'accuracy.sourcePreference': 'transcript' },
    disable: { 'accuracy.webVerification': [true] },
    reason: 'Web verification requires web source preference.',
  },

  // Extraction ↔ Use examples
  {
    if: { 'ai.useExamples': 'never' },
    disable: { 'extract.examples': [true] },
    reason: 'Examples are disabled in AI preferences.',
  },

  // Exam style needs Q&A
  {
    if: { style: 'exam' },
    force: { 'extract.qa': true },
  },
];

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function checkConflict(settings: any, targetPath: string, targetValue: any): { disabled: boolean; reason?: string } {
  for (const rule of CONFLICTS) {
    if (!rule.disable) continue;

    // Check if the "if" condition matches current settings
    const ifMatches = Object.entries(rule.if).every(([path, val]) => {
      return getNestedValue(settings, path) === val;
    });

    if (ifMatches) {
      for (const [disPath, disValues] of Object.entries(rule.disable)) {
        if (disPath === targetPath && disValues.includes(targetValue)) {
          return { disabled: true, reason: rule.reason || 'Option disabled by active settings.' };
        }
      }
    }
  }

  return { disabled: false };
}
