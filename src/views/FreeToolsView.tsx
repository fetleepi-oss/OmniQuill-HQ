import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Scissors, 
  Mail, 
  Globe, 
  Share2, 
  Zap, 
  Loader2,
  AlertCircle
} from 'lucide-react';

interface FreeToolsViewProps {
  onUpgradePrompt: () => void;
}

export const FreeToolsView: React.FC<FreeToolsViewProps> = ({ onUpgradePrompt }) => {
  const [activeTool, setActiveTool] = useState<
    'headline-generator' | 'paraphraser' | 'email-subject' | 'meta-description' | 'social-caption'
  >('headline-generator');
  const [inputVal, setInputVal] = useState('How B2B SaaS teams are adopting generative AI workflows');
  const [tone, setTone] = useState('Punchy & Viral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const tools = [
    {
      id: 'headline-generator',
      title: 'Free AI Headline Generator',
      desc: 'Viral headlines with high CTR rating',
      icon: FileText,
      placeholder: 'Enter your article topic or premise...',
      defaultInput: 'How B2B SaaS teams are adopting generative AI workflows',
    },
    {
      id: 'paraphraser',
      title: 'Free AI Text Paraphraser',
      desc: 'Rephrase in 3 distinct tones',
      icon: Scissors,
      placeholder: 'Paste the sentence or paragraph you want to rewrite...',
      defaultInput: 'Our software enables marketers to create content faster so they can achieve higher conversion rates without hiring extra staff.',
    },
    {
      id: 'email-subject',
      title: 'Email Subject Line Tester',
      desc: 'High-open subject lines with spam score',
      icon: Mail,
      placeholder: 'What is your email offering or announcing?',
      defaultInput: 'Inviting marketing leaders to our live demo on autonomous AI campaigns',
    },
    {
      id: 'meta-description',
      title: 'SEO Meta Description Maker',
      desc: 'Strictly 140-155 characters for Google SERP',
      icon: Globe,
      placeholder: 'Describe your web page or article content...',
      defaultInput: 'A complete guide to building Brand DNA voice guidelines for AI copywriting.',
    },
    {
      id: 'social-caption',
      title: 'Social & Instagram Captions',
      desc: 'Engaging copy with hashtags & question hooks',
      icon: Share2,
      placeholder: 'Topic or photo description...',
      defaultInput: 'Behind the scenes scaling our remote SaaS startup to first 1,000 customers',
    },
  ];

  const handleToolChange = (toolId: any) => {
    setActiveTool(toolId);
    setErrorMessage(null);
    const selected = tools.find((t) => t.id === toolId);
    if (selected) {
      setInputVal(selected.defaultInput);
      setOutput('');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setOutput('');
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ai/free-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          toolType: activeTool,
          input: inputVal,
          tone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with server status ${response.status}`);
      }

      const data = await response.json();
      setOutput(data.result || 'No output generated.');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setErrorMessage('Generation was cancelled.');
      } else {
        setErrorMessage(err.message || 'Generation failed. Please retry.');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
          <Gift className="w-3.5 h-3.5" />
          <span>100% Free Public Growth Tools</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Free AI Writing & SEO Tools
        </h1>
        <p className="text-sm text-slate-400">
          Instant, high-converting copy without requiring login or credit card. Used by 10,000+ creators and marketers every month.
        </p>
      </div>

      {/* Tool Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleToolChange(t.id)}
              className={`p-3 rounded-xl text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-teal-600/20 text-white border border-teal-500/50 shadow-md shadow-teal-500/10'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <div className={`p-2 rounded-lg w-fit mb-2 ${isActive ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">{t.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tool Canvas */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-semibold text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Input Your Content
            </label>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Tone:</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Punchy & Viral">Punchy & Viral</option>
                <option value="Professional & Authoritative">Professional & Authoritative</option>
                <option value="Casual & Friendly">Casual & Friendly</option>
                <option value="Curious & Intriguing">Curious & Intriguing</option>
              </select>
            </div>
          </div>

          <textarea
            rows={3}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={tools.find((t) => t.id === activeTool)?.placeholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex items-center justify-end gap-3">
            {isGenerating && (
              <button
                type="button"
                onClick={handleCancel}
                className="min-tap px-4 py-2.5 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isGenerating || !inputVal.trim()}
              className="min-tap px-6 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2 shadow-sm focus-visible:outline-teal-400"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0A0F1D]" />
                  <span>Processing Free Request...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Free Output</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Skeleton Shimmer While Generating */}
        {isGenerating && (
          <div className="p-5 rounded-2xl bg-[#0A0F1D] border border-teal-500/30 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              <span>AI is generating viral variants...</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-2/3 rounded skeleton-shimmer" />
            </div>
          </div>
        )}

        {/* Output Area */}
        {output && (
          <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Result
              </span>
              <button
                onClick={copyResult}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {output}
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Call To Action Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/60 border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 bg-teal-500/20 px-2.5 py-1 rounded">
            Scale Past Free Limits
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Need Custom Brand Voice & 5-in-1 Campaigns?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Upgrade to Quill Pro to calibrate your company's Brand DNA, schedule onto your Content Calendar, and publish multi-lingual copy.
          </p>
        </div>

        <button
          onClick={onUpgradePrompt}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/30 whitespace-nowrap transition-transform hover:scale-105"
        >
          <span>Upgrade to Pro ($69/mo or 3,800 ETB)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
