import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PRESETS, DEFAULT_SETTINGS, PRESET_METADATA, SettingsType } from '../config/presets';
import { checkConflict } from '../config/conflicts';
import {
  fetchSettings,
  updateSettings,
  resetSettings,
  applyPreset,
  exportSettings,
  deleteUserData,
} from '../api';
import {
  User,
  Mail,
  Shield,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  CheckCircle2,
  Key,
  Cpu,
  Keyboard,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  SlidersHorizontal,
  GraduationCap,
  Download,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Save,
  Video,
  Database,
  Lock,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

type Props = {
  onBack: () => void;
  onLogout: () => void;
};

export default function SettingsView({ onBack, onLogout }: Props) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showTier2, setShowTier2] = useState(false);
  const [showTier3, setShowTier3] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingData, setDeletingData] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  let userName = 'Antigravity User';
  let userEmail = 'user@gyan.ai';
  let userId = 'gyan_user_' + Math.random().toString(36).substring(2, 9);

  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.username) userName = u.username;
      if (u.email) userEmail = u.email;
      if (u.id || u._id) userId = u.id || u._id;
    }
  } catch {}

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleFieldChange(path: string, value: any) {
    setSettings((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let curr = next;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!curr[parts[i]]) curr[parts[i]] = {};
        curr = curr[parts[i]];
      }
      curr[parts[parts.length - 1]] = value;

      // When manually changing fields, mark preset as custom unless it's preset apply
      next.preset = 'custom';
      return next;
    });
  }

  async function handleApplyPreset(presetKey: string) {
    try {
      setSaving(true);
      const updated = await applyPreset(presetKey);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to apply preset:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    try {
      setSaving(true);
      const updated = await resetSettings();
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to reset settings:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    try {
      await exportSettings();
    } catch (err) {
      console.error('Failed to export settings:', err);
    }
  }

  async function handleDeleteData() {
    if (deleteConfirmText.trim() !== 'DELETE') return;
    try {
      setDeletingData(true);
      await deleteUserData();
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      await loadSettings();
    } catch (err) {
      console.error('Failed to delete data:', err);
    } finally {
      setDeletingData(false);
    }
  }

  function handleCopyUserId() {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 relative z-10">
      {/* Top Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-sm ${
            isDark
              ? 'border-slate-800 bg-space-card/80 text-slate-300 hover:border-slate-700 hover:bg-space-cardHover hover:text-white'
              : 'border-slate-200 bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-indigo-600'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </button>

        <div className="flex items-center gap-2.5">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-medium text-emerald-400 animate-fade-in-up">
              <Check className="h-3.5 w-3.5" />
              Settings Saved
            </span>
          )}

          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium border ${
              isDark
                ? 'border-indigo-500/30 bg-indigo-950/40 text-cyan-300'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Note Generation Settings</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Presets Row */}
        <div
          className={`rounded-3xl p-6 shadow-3d transition-colors duration-300 ${
            isDark ? 'glass-panel-elevated' : 'glass-panel-elevated bg-white/95 border-slate-200 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-700/20">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
              <h3 className={`text-sm font-bold font-display uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Presets
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Active: <strong className="text-indigo-400 capitalize">{settings.preset}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_METADATA.map((p) => {
              const isSelected = settings.preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p.id)}
                  className={`flex flex-col items-start rounded-2xl p-3.5 text-left border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? isDark
                        ? 'border-indigo-500 bg-indigo-950/50 text-white ring-1 ring-indigo-500/40 shadow-md shadow-indigo-500/10'
                        : 'border-indigo-500 bg-indigo-50/90 text-indigo-950 ring-1 ring-indigo-500/30 shadow-sm'
                      : isDark
                      ? 'border-slate-800 bg-space-card/60 text-slate-300 hover:border-slate-700 hover:bg-space-card'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold font-display">{p.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                        isSelected
                          ? 'bg-indigo-500 text-white'
                          : isDark
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 1: Core Note Generation Settings (Always Visible) */}
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-3d transition-colors duration-300 ${
            isDark ? 'glass-panel-elevated' : 'glass-panel-elevated bg-white/95 border-slate-200 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-6 border-b pb-4 border-slate-700/20">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <div>
              <h2 className={`text-base font-bold font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Core Generation Options
              </h2>
              <p className="text-[11px] text-slate-400">Primary parameters used for generating AI synthesis notes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Style */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-400">Style</label>
              <select
                value={settings.style}
                onChange={(e) => handleFieldChange('style', e.target.value)}
                className={`w-full rounded-xl border py-2 px-3 text-xs outline-none transition ${
                  isDark
                    ? 'border-slate-800 bg-space-bg text-white focus:border-indigo-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-indigo-500'
                }`}
              >
                <option value="detailed">Detailed (Comprehensive)</option>
                <option value="concise">Concise (~300-500 words)</option>
                <option value="exam">Exam-Oriented</option>
                <option value="beginner">Beginner-Friendly</option>
                <option value="technical">Technical / Advanced</option>
                <option value="revision">Quick Revision Sheet</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-400">Difficulty Level</label>
              <select
                value={settings.difficulty}
                onChange={(e) => handleFieldChange('difficulty', e.target.value)}
                className={`w-full rounded-xl border py-2 px-3 text-xs outline-none transition ${
                  isDark
                    ? 'border-slate-800 bg-space-bg text-white focus:border-indigo-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-indigo-500'
                }`}
              >
                <option value="auto">Auto (Infer from source)</option>
                <option value="beginner">Beginner (No prior knowledge)</option>
                <option value="intermediate">Intermediate (Basic knowledge)</option>
                <option value="advanced">Advanced (Domain expert)</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-400">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleFieldChange('language', e.target.value)}
                className={`w-full rounded-xl border py-2 px-3 text-xs outline-none transition ${
                  isDark
                    ? 'border-slate-800 bg-space-bg text-white focus:border-indigo-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-indigo-500'
                }`}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish (Hindi + English)</option>
                <option value="other">Auto-detect Source Language</option>
              </select>
            </div>
          </div>

          {/* Preserve Technical Terms */}
          <div className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="preserveTech"
              checked={settings.preserveTechnicalTerms}
              onChange={(e) => handleFieldChange('preserveTechnicalTerms', e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="preserveTech" className={`text-xs select-none cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Preserve technical terms in English (Recommended for bilingual synthesis)
            </label>
          </div>

          {/* Focus / Extraction Checkboxes */}
          <div className="mb-6 border-t pt-4 border-slate-700/20">
            <h4 className={`text-xs font-bold font-display uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Content Focus & Extraction
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: 'concepts', label: 'Concepts' },
                { key: 'definitions', label: 'Definitions' },
                { key: 'examples', label: 'Examples' },
                { key: 'formulas', label: 'Formulas & Math' },
                { key: 'code', label: 'Code Blocks' },
                { key: 'steps', label: 'Step-by-step' },
                { key: 'datesNames', label: 'Dates & Names' },
                { key: 'statistics', label: 'Statistics' },
                { key: 'qa', label: 'Q&A' },
                { key: 'applications', label: 'Applications' },
                { key: 'quotes', label: 'Key Quotes' },
                { key: 'timestamps', label: 'Timestamps' },
              ].map(({ key, label }) => {
                const isChecked = settings.extract[key as keyof typeof settings.extract];
                const conflict = checkConflict(settings, `extract.${key}`, true);

                return (
                  <label
                    key={key}
                    title={conflict.reason}
                    className={`flex items-center gap-2 rounded-xl p-2 text-xs border select-none transition cursor-pointer ${
                      conflict.disabled ? 'opacity-40 cursor-not-allowed' : ''
                    } ${
                      isChecked
                        ? isDark
                          ? 'border-indigo-500/40 bg-indigo-950/30 text-white font-medium'
                          : 'border-indigo-200 bg-indigo-50 text-indigo-950 font-semibold'
                        : isDark
                        ? 'border-slate-800 bg-space-card/40 text-slate-400 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={conflict.disabled}
                      checked={isChecked}
                      onChange={(e) => handleFieldChange(`extract.${key}`, e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="truncate">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Custom Instruction */}
          <div className="border-t pt-4 border-slate-700/20">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-400">Custom System Instruction</label>
              <span className="text-[10px] font-mono text-slate-500">{settings.customInstruction?.length || 0}/500</span>
            </div>
            <textarea
              value={settings.customInstruction || ''}
              onChange={(e) => handleFieldChange('customInstruction', e.target.value)}
              placeholder="e.g. Always emphasize architectural design patterns and include practical takeaways..."
              maxLength={500}
              rows={2}
              className={`w-full rounded-xl border p-3 text-xs outline-none transition ${
                isDark
                  ? 'border-slate-800 bg-space-bg text-white placeholder:text-slate-600 focus:border-indigo-500'
                  : 'border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500'
              }`}
            />
          </div>

          {/* Save / Reset Actions */}
          <div className="mt-6 flex items-center justify-between border-t pt-4 border-slate-700/20">
            <button
              onClick={handleReset}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                isDark
                  ? 'border-slate-800 bg-space-card text-slate-400 hover:text-white hover:border-slate-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 px-5 py-2 text-xs font-bold text-white transition hover:shadow-lg hover:shadow-indigo-500/25 active:scale-98 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* Tier 2: More Options Accordion */}
        <div
          className={`rounded-3xl border shadow-3d overflow-hidden transition-colors duration-300 ${
            isDark ? 'border-slate-800/80 bg-space-sidebar' : 'border-slate-200 bg-white'
          }`}
        >
          <button
            onClick={() => setShowTier2((prev) => !prev)}
            className="w-full flex items-center justify-between p-5 text-left transition hover:bg-slate-500/5"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <div>
                <h3 className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  More Options (Formatting, Length & AI Preferences)
                </h3>
                <p className="text-[11px] text-slate-400">Length targets, note structures, accuracy modes, and AI tone.</p>
              </div>
            </div>
            {showTier2 ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {showTier2 && (
            <div className="p-6 pt-0 border-t border-slate-700/20 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {/* Length */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Target Length</label>
                  <select
                    value={settings.length}
                    onChange={(e) => handleFieldChange('length', e.target.value)}
                    className={`w-full rounded-xl border py-2 px-3 text-xs outline-none ${
                      isDark ? 'border-slate-800 bg-space-bg text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                    }`}
                  >
                    <option value="quick">Quick (~200-300 words)</option>
                    <option value="medium">Medium (Standard depth)</option>
                    <option value="detailed">Detailed (Thorough)</option>
                    <option value="veryDetailed">Very Detailed (1500+ words)</option>
                  </select>
                </div>

                {/* Structure */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Structure Layout</label>
                  <select
                    value={settings.structure}
                    onChange={(e) => handleFieldChange('structure', e.target.value)}
                    className={`w-full rounded-xl border py-2 px-3 text-xs outline-none ${
                      isDark ? 'border-slate-800 bg-space-bg text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                    }`}
                  >
                    <option value="bullets">Headings + Bullet Points</option>
                    <option value="paragraphs">Prose Paragraphs</option>
                    <option value="steps">Numbered Steps</option>
                    <option value="cornell">Cornell Note Format</option>
                  </select>
                </div>

                {/* Accuracy Mode */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Accuracy Strictness</label>
                  <select
                    value={settings.accuracy?.mode || 'standard'}
                    onChange={(e) => handleFieldChange('accuracy.mode', e.target.value)}
                    className={`w-full rounded-xl border py-2 px-3 text-xs outline-none ${
                      isDark ? 'border-slate-800 bg-space-bg text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                    }`}
                  >
                    <option value="standard">Standard Synthesis</option>
                    <option value="strict">Strict (Source-only verification)</option>
                  </select>
                </div>
              </div>

              {/* AI Preferences */}
              <div className="border-t pt-4 border-slate-700/20">
                <h4 className={`text-xs font-bold font-display uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  AI Tone & Explanation Preferences
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Explanation Style</label>
                    <select
                      value={settings.ai?.explanationStyle || 'balanced'}
                      onChange={(e) => handleFieldChange('ai.explanationStyle', e.target.value)}
                      className={`w-full rounded-xl border py-2 px-3 text-xs outline-none ${
                        isDark ? 'border-slate-800 bg-space-bg text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                      }`}
                    >
                      <option value="simple">Simple & Plain</option>
                      <option value="balanced">Balanced</option>
                      <option value="technical">Technical & Precise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Use Examples</label>
                    <select
                      value={settings.ai?.useExamples || 'whenUseful'}
                      onChange={(e) => handleFieldChange('ai.useExamples', e.target.value)}
                      className={`w-full rounded-xl border py-2 px-3 text-xs outline-none ${
                        isDark ? 'border-slate-800 bg-space-bg text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                      }`}
                    >
                      <option value="whenUseful">When Useful</option>
                      <option value="always">Always Include Examples</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { key: 'useAnalogies', label: 'Use Analogies' },
                    { key: 'explainTerms', label: 'Define Terms' },
                    { key: 'avoidRepetition', label: 'Avoid Repetition' },
                    { key: 'autoCorrectTranscript', label: 'Auto-fix Transcript' },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className={`flex items-center gap-2 rounded-xl p-2 text-xs border select-none transition cursor-pointer ${
                        settings.ai?.[key as keyof typeof settings.ai]
                          ? isDark
                            ? 'border-indigo-500/40 bg-indigo-950/30 text-white'
                            : 'border-indigo-200 bg-indigo-50 text-indigo-950'
                          : isDark
                          ? 'border-slate-800 bg-space-card/40 text-slate-400'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(settings.ai?.[key as keyof typeof settings.ai])}
                        onChange={(e) => handleFieldChange(`ai.${key}`, e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="truncate">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tier 3: Advanced Settings Accordion */}
        <div
          className={`rounded-3xl border shadow-3d overflow-hidden transition-colors duration-300 ${
            isDark ? 'border-slate-800/80 bg-space-sidebar' : 'border-slate-200 bg-white'
          }`}
        >
          <button
            onClick={() => setShowTier3((prev) => !prev)}
            className="w-full flex items-center justify-between p-5 text-left transition hover:bg-slate-500/5"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              <div>
                <h3 className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Advanced Settings (Study Mode, Video & Data Management)
                </h3>
                <p className="text-[11px] text-slate-400">Flashcards, MCQs, video processing constraints, and export/delete data.</p>
              </div>
            </div>
            {showTier3 ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {showTier3 && (
            <div className="p-6 pt-0 border-t border-slate-700/20 space-y-6">
              {/* Study Mode */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-xs font-bold font-display uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Study Mode & Testing Outputs
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">Count:</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={settings.study?.count || 10}
                      onChange={(e) => handleFieldChange('study.count', Number(e.target.value))}
                      className={`w-14 rounded-lg border py-1 px-2 text-xs font-mono outline-none ${
                        isDark ? 'border-slate-800 bg-space-bg text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { key: 'flashcards', label: 'Flashcards (Q/A)' },
                    { key: 'mcqs', label: 'MCQs' },
                    { key: 'shortAnswers', label: 'Short Answers' },
                    { key: 'longAnswers', label: 'Long Answers' },
                    { key: 'revisionChecklist', label: 'Revision Checklist' },
                    { key: 'examImportant', label: 'Exam-Important Topics' },
                    { key: 'spacedRepetition', label: 'Spaced Repetition' },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className={`flex items-center gap-2 rounded-xl p-2 text-xs border select-none transition cursor-pointer ${
                        settings.study?.[key as keyof typeof settings.study]
                          ? isDark
                            ? 'border-indigo-500/40 bg-indigo-950/30 text-white'
                            : 'border-indigo-200 bg-indigo-50 text-indigo-950'
                          : isDark
                          ? 'border-slate-800 bg-space-card/40 text-slate-400'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(settings.study?.[key as keyof typeof settings.study])}
                        onChange={(e) => handleFieldChange(`study.${key}`, e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="truncate">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Video Processing */}
              <div className="border-t pt-4 border-slate-700/20">
                <h4 className={`text-xs font-bold font-display uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Video Processing
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: 'useCaptions', label: 'Use Captions' },
                    { key: 'autoDetectLanguage', label: 'Auto Detect Language' },
                    { key: 'generateTranscript', label: 'Extract Transcript' },
                    { key: 'processChapters', label: 'Process Chapters' },
                    { key: 'includeTimestamps', label: 'Include Timestamps' },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className={`flex items-center gap-2 rounded-xl p-2 text-xs border select-none transition cursor-pointer ${
                        settings.video?.[key as keyof typeof settings.video]
                          ? isDark
                            ? 'border-indigo-500/40 bg-indigo-950/30 text-white'
                            : 'border-indigo-200 bg-indigo-50 text-indigo-950'
                          : isDark
                          ? 'border-slate-800 bg-space-card/40 text-slate-400'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(settings.video?.[key as keyof typeof settings.video])}
                        onChange={(e) => handleFieldChange(`video.${key}`, e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="truncate">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Data & Privacy Actions */}
              <div className="border-t pt-4 border-slate-700/20">
                <h4 className={`text-xs font-bold font-display uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Data Management & Privacy
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExport}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                      isDark
                        ? 'border-slate-700 bg-space-card text-slate-200 hover:bg-slate-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Download className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Download Settings JSON</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete All My Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Details & Theme Switcher Section */}
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-3d transition-colors duration-300 ${
            isDark ? 'glass-panel-elevated' : 'glass-panel-elevated bg-white/95 border-slate-200 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-6 border-b pb-4 border-slate-700/20">
            <User className="h-5 w-5 text-indigo-500" />
            <h2 className={`text-base font-bold font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              User Profile & Theme
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white text-xl font-black font-mono shadow-lg shadow-indigo-500/30">
                {userName.charAt(0).toUpperCase()}
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {userName}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-500 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                  <Mail className="h-3 w-3" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{userEmail}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/20 active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Theme Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-between rounded-2xl p-4 border-2 cursor-pointer transition ${
                isDark
                  ? 'border-indigo-500 bg-space-card shadow-md shadow-indigo-500/20'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white">Space Dark</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Deep Obsidian & Neon</p>
                </div>
              </div>
              {isDark && <Check className="h-4 w-4 text-indigo-400" />}
            </div>

            <div
              onClick={() => setTheme('light')}
              className={`flex items-center justify-between rounded-2xl p-4 border-2 cursor-pointer transition ${
                !isDark
                  ? 'border-indigo-500 bg-white shadow-md shadow-indigo-500/20'
                  : 'border-slate-800 bg-space-card/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 border border-amber-200">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white">Luminous Light</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Clean White & Slate</p>
                </div>
              </div>
              {!isDark && <Check className="h-4 w-4 text-indigo-600" />}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Data Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl animate-fade-in-up ${
              isDark ? 'bg-space-card border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 mb-4 text-rose-500">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold font-display">Delete All Notes & Reset</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This action will permanently delete all your generated notes and history, and reset settings to the standard preset. This action cannot be undone.
            </p>
            <p className="text-xs font-semibold mb-2 text-slate-300">
              Type <strong className="text-rose-500 font-mono">DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className={`w-full rounded-xl border p-2.5 text-xs font-mono outline-none mb-5 ${
                isDark ? 'border-slate-700 bg-space-bg text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
              }`}
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteData}
                disabled={deleteConfirmText !== 'DELETE' || deletingData}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-40"
              >
                {deletingData ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
