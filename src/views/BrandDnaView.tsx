import React, { useState } from 'react';
import { 
  Fingerprint, 
  Sparkles, 
  Save, 
  Check, 
  RefreshCw, 
  Sliders, 
  Ban, 
  BookOpen, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { BrandDNA } from '../types';

interface BrandDnaViewProps {
  brandDna: BrandDNA;
  onSaveBrandDna: (updated: BrandDNA) => void;
}

export const BrandDnaView: React.FC<BrandDnaViewProps> = ({
  brandDna,
  onSaveBrandDna,
}) => {
  const [formData, setFormData] = useState<BrandDNA>(brandDna);
  const [saved, setSaved] = useState(false);
  const [testTopic, setTestTopic] = useState('Announcing our new automated workflow feature');
  const [testResult, setTestResult] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const toneOptions = [
    'Executive & Authoritative',
    'Bold & Punchy',
    'Empathetic & Warm',
    'Witty & Playful',
    'Data-Driven & Analytical',
  ] as const;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBrandDna(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestVoice = async () => {
    if (!testTopic.trim() || isTesting) return;
    setIsTesting(true);
    setErrorMessage(null);
    setTestResult('');
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a short 80-word promotional paragraph demonstrating our exact brand voice for the topic: "${testTopic}".`,
          brandDna: formData,
          tone: formData.toneTag,
          maxWords: 100,
        }),
      });
      if (!response.ok) {
        throw new Error(`Generation failed with server status ${response.status}`);
      }
      const data = await response.json();
      setTestResult(data.text || '');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error previewing voice.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Enterprise Brand DNA Consistency</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Brand DNA & Voice Calibration
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Lock in your company's tone, messaging pillars, banned buzzwords, and product terminology. Injected automatically into all AI generations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition-all self-start sm:self-auto"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Brand DNA Saved!' : 'Save Brand DNA'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Pillars */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Core Brand Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Brand or Product Name
                </label>
                <span className="text-[11px] text-slate-400">Used as primary brand name</span>
              </div>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder="e.g. Quill AI"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Primary Voice Archetype
                </label>
                <span className="text-[11px] text-slate-400">Sets overall personality</span>
              </div>
              <select
                value={formData.toneTag}
                onChange={(e) => setFormData({ ...formData, toneTag: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              >
                {toneOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Core Value Proposition & What You Do
              </label>
              <span className="text-[11px] text-slate-400">Tells AI what makes your offering unique</span>
            </div>
            <input
              type="text"
              value={formData.valueProp}
              onChange={(e) => setFormData({ ...formData, valueProp: e.target.value })}
              placeholder="e.g. Empowering growth marketers to create coordinated multi-channel campaigns."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Target Audience (Who You Are Speaking To)
              </label>
              <span className="text-[11px] text-slate-400">Guides AI on vocabulary and perspective</span>
            </div>
            <textarea
              rows={2}
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="e.g. B2B marketing leaders, founders, and content creators looking for leverage."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Tone Guidelines & Guardrails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tone Rules */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Tone & Style Rules</h3>
            </div>
            <p className="text-xs text-slate-400">
              Specific stylistic instructions given to the LLM (sentence length, formatting, humor level).
            </p>
            <textarea
              rows={4}
              value={formData.toneRules}
              onChange={(e) => setFormData({ ...formData, toneRules: e.target.value })}
              placeholder="e.g. Use crisp active verbs. Avoid jargon. Keep sentences under 25 words. Lead with quantifiable impact."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Forbidden Vocabulary (Writer.com style) */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Ban className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Forbidden Vocabulary Blacklist</h3>
            </div>
            <p className="text-xs text-slate-400">
              Words or tired clichés the AI is strictly prohibited from generating.
            </p>
            <textarea
              rows={4}
              value={formData.forbiddenWords}
              onChange={(e) => setFormData({ ...formData, forbiddenWords: e.target.value })}
              placeholder="e.g. game-changer, revolutionary, leverage, synergy, delve, tapestry, unprecedented, robust"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Custom Terminology Bank */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white">Terminology Dictionary</h3>
          <p className="text-xs text-slate-400">
            Define approved internal nomenclature and preferred phrasing for products and technical architecture.
          </p>
          <input
            type="text"
            value={formData.customTerminology}
            onChange={(e) => setFormData({ ...formData, customTerminology: e.target.value })}
            placeholder="e.g. 'Brand DNA' not 'Voice Profile'; 'Autonomous Campaigns' not 'Automated Bot'; 'Multi-channel' not 'Cross-channel'"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </form>

      {/* Voice Simulator / Test Lab */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-teal-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Live Brand Voice Playground</h3>
          </div>
          <span className="text-[10px] bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded">
            Live Preview
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-semibold text-[10px]"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={testTopic}
            onChange={(e) => setTestTopic(e.target.value)}
            placeholder="Enter a topic to test how your Brand DNA performs..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={handleTestVoice}
            disabled={isTesting || !testTopic.trim()}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50 shadow-md shadow-teal-600/30"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Preview Tone</span>
          </button>
        </div>

        {/* Skeleton Shimmer While Testing */}
        {isTesting && (
          <div className="p-4 rounded-xl bg-[#0A0F1D] border border-teal-500/30 space-y-2 animate-fade-in">
            <div className="h-3 w-1/3 rounded skeleton-shimmer" />
            <div className="h-4 w-full rounded skeleton-shimmer" />
            <div className="h-4 w-2/3 rounded skeleton-shimmer" />
          </div>
        )}

        {testResult && !isTesting && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              Generated in {formData.toneTag} voice:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "{testResult}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
