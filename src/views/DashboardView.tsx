import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  FileEdit, 
  Fingerprint, 
  Gift, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Copy, 
  Loader2,
  Calendar,
  Globe2,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  AlertCircle,
  X
} from 'lucide-react';
import { BrandDNA, UserSubscription, DocumentItem, CampaignAsset, OnboardingStep } from '../types';
import { OnboardingChecklist } from '../components/OnboardingChecklist';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  brandDna: BrandDNA;
  subscription: UserSubscription;
  documents: DocumentItem[];
  recentCampaign: CampaignAsset | null;
  onOpenDocument: (doc: DocumentItem) => void;
  onQuickGenerate: (prompt: string, tone: string) => Promise<string>;
  onboardingSteps: OnboardingStep[];
  showOnboarding: boolean;
  onDismissOnboarding: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  brandDna,
  subscription,
  documents,
  recentCampaign,
  onOpenDocument,
  onQuickGenerate,
  onboardingSteps,
  showOnboarding,
  onDismissOnboarding,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickTone, setQuickTone] = useState(brandDna.toneTag);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quickResult, setQuickResult] = useState('');
  const [copied, setCopied] = useState(false);
  const cancelRef = React.useRef<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setQuickResult('');
    cancelRef.current = false;

    try {
      const res = await onQuickGenerate(quickPrompt, quickTone);
      if (!cancelRef.current) {
        setQuickResult(res);
      }
    } catch (err: any) {
      if (!cancelRef.current) {
        setErrorMessage(err.message || 'Error generating content. Please verify your connection.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setIsGenerating(false);
    setErrorMessage('Generation was cancelled.');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quickResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Guided Onboarding Checklist for New Users */}
      {showOnboarding && (
        <OnboardingChecklist
          steps={onboardingSteps}
          onNavigate={onNavigate}
          onDismiss={onDismissOnboarding}
        />
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 lg:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/50 border border-teal-500/20 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Enterprise AI Marketing & Copywriting Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Craft high-impact copy in your <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-white bg-clip-text text-transparent">authentic brand voice</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Generate 5-part synchronized campaigns, write in the rich editor with live readability auditing, and schedule posts onto your content calendar.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('campaigns')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.02]"
            >
              <Layers className="w-4 h-4" />
              <span>Launch Campaign Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('calendar')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-all"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Open Content Calendar</span>
            </button>
            <button
              onClick={() => onNavigate('editor')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-all"
            >
              <FileEdit className="w-4 h-4 text-teal-400" />
              <span>Document Editor</span>
            </button>
            <button
              onClick={() => onNavigate('brand-dna')}
              className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium text-xs sm:text-sm flex items-center gap-2 border border-slate-800 transition-all"
            >
              <Fingerprint className="w-4 h-4 text-teal-400" />
              <span>Calibrate Brand Voice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompt Bar (Direct Command style) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Instant AI Generation Command</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Tone:</span>
            <select
              value={quickTone}
              onChange={(e) => setQuickTone(e.target.value as any)}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="Executive & Authoritative">Executive & Authoritative</option>
              <option value="Bold & Punchy">Bold & Punchy</option>
              <option value="Empathetic & Warm">Empathetic & Warm</option>
              <option value="Witty & Playful">Witty & Playful</option>
              <option value="Data-Driven & Analytical">Data-Driven & Analytical</option>
            </select>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
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

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="relative">
            <textarea
              rows={2}
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="e.g. Write a 3-bullet value proposition explaining why SaaS teams should switch from manual drafting to autonomous AI workflows..."
              className="w-full bg-[#0A0F1D] border border-[#1E2A44] rounded-xl px-4 py-3 text-sm text-[#E6EDF7] placeholder-[#7C8BA6] focus:outline-none focus:border-teal-500"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              {isGenerating ? (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold flex items-center gap-1 border border-rose-500/30 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!quickPrompt.trim()}
                  className="min-tap px-4 py-1.5 rounded-lg btn-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm focus-visible:outline-teal-400"
                  aria-label="Generate AI Copy"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Skeleton Shimmer While AI Writes */}
        {isGenerating && (
          <div className="p-4 rounded-xl bg-[#0A0F1D] border border-teal-500/30 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              <span>Generating copy in {quickTone} voice...</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-2/3 rounded skeleton-shimmer" />
            </div>
          </div>
        )}

        {/* Quick Result Preview */}
        {quickResult && !isGenerating && (
          <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-teal-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AI Generated Output ({quickTone})
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {quickResult}
            </p>
          </div>
        )}
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Monthly Usage</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {subscription.wordsUsed.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {subscription.wordsLimit.toLocaleString()} words</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {subscription.planName} active
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Brand DNA Status</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Fingerprint className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white truncate">
              {brandDna.brandName || 'Configured'}
            </div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Voice calibrated
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Gateways</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">
              Paddle & Chapa
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sandbox & Telebirr ready
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Viral Lead Magnets</span>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white">
              5 Free Tools
            </div>
            <p className="text-xs text-cyan-400 mt-1 cursor-pointer hover:underline" onClick={() => onNavigate('free-tools')}>
              View public tools &rarr;
            </p>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('campaigns')}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer group transition-all hover:-translate-y-1 shadow-md hover:shadow-indigo-500/10"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">Campaign Builder</h3>
            <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
              Quill Signature
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Turn a single product goal into a coordinated 5-part campaign: blog post, 3 LinkedIn updates, Twitter thread, newsletter, and paid ads.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
            <span>Open Builder</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('editor')}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer group transition-all hover:-translate-y-1 shadow-md hover:shadow-indigo-500/10"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
            <FileEdit className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">Document Editor & Auditor</h3>
            <span className="text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
              Anyword Style
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Rich writing canvas with inline AI expansion, tone switcher, and real-time content performance audit (readability & conversion prediction).
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
            <span>Start Writing</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('brand-dna')}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer group transition-all hover:-translate-y-1 shadow-md hover:shadow-indigo-500/10"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">Brand DNA & Tone</h3>
            <span className="text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
              Writer.com Rules
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Define your company's core messaging, audience personas, banned vocabulary, and custom terminology. Automatically injected into all generations.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-purple-300">
            <span>Configure Tone</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Recent Campaign or Documents Showcase */}
      {recentCampaign ? (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Latest Multi-Channel Campaign</h3>
            </div>
            <button
              onClick={() => onNavigate('campaigns')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View Full Campaign</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <h4 className="font-semibold text-slate-200 text-sm">{recentCampaign.campaignName}</h4>
            <p className="text-xs text-slate-400 mt-1">{recentCampaign.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                Blog: {recentCampaign.blogPost.title.slice(0, 30)}...
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                3 LinkedIn Posts
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                5-Tweet Thread
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                Email Newsletter
              </span>
            </div>
          </div>
        </div>
      ) : documents.length > 0 ? (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Documents</h3>
            <button
              onClick={() => onNavigate('editor')}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
            >
              <span>New Document</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocument(doc)}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-semibold text-slate-200 truncate">{doc.title}</h4>
                  <span className="text-[10px] text-slate-400">{doc.wordCount} words</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mt-1">{doc.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State with One Clear Next Action */
        <div className="p-8 rounded-2xl bg-[#111A2E] border border-[#1E2A44] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
            <FileEdit className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">No documents created yet</h3>
            <p className="text-xs text-[#9AA9C2] leading-relaxed">
              Your generated articles, marketing campaigns, and saved drafts will appear here. Launch your first project in seconds.
            </p>
          </div>
          <button
            onClick={() => onNavigate('campaigns')}
            className="min-tap px-5 py-2 rounded-xl btn-primary text-xs font-semibold inline-flex items-center gap-2 shadow-sm focus-visible:outline-teal-400"
            aria-label="Create your first campaign"
          >
            <Layers className="w-4 h-4" />
            <span>Launch Your First Campaign</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
