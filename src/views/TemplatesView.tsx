import React, { useState } from 'react';
import { 
  Grid, 
  Sparkles, 
  Search, 
  FileText, 
  Send, 
  Share2, 
  Megaphone, 
  Mail, 
  ShoppingBag, 
  Award, 
  Video, 
  ArrowRight, 
  Loader2, 
  Check, 
  Copy,
  AlertCircle
} from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { Template, BrandDNA, DocumentItem } from '../types';

interface TemplatesViewProps {
  brandDna: BrandDNA;
  onSendToEditor: (doc: DocumentItem) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  brandDna,
  onSendToEditor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [topicInput, setTopicInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const categories = ['All', 'SEO & Content', 'Sales & Outreach', 'Social & Viral', 'Ads & Conversion', 'Email'];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openTemplateModal = (tpl: Template) => {
    setActiveTemplate(tpl);
    setTopicInput(tpl.defaultInputs.topic);
    setContextInput(tpl.defaultInputs.context);
    setGeneratedResult('');
    setErrorMessage(null);
  };

  const handleGenerateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedResult('');
    abortControllerRef.current = new AbortController();

    const fullPrompt = activeTemplate.promptTemplate
      .replace('{topic}', topicInput)
      .replace('{context}', contextInput);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          prompt: fullPrompt,
          templateId: activeTemplate.id,
          brandDna,
          tone: brandDna.toneTag,
          maxWords: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with server status ${response.status}`);
      }

      const data = await response.json();
      setGeneratedResult(data.text || '');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setErrorMessage('Template generation was cancelled.');
      } else {
        setErrorMessage(err.message || 'Generation failed. Please try again.');
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
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transferToEditor = () => {
    if (!activeTemplate || !generatedResult) return;
    const newDoc: DocumentItem = {
      id: `DOC-${Date.now()}`,
      title: `${activeTemplate.title}: ${topicInput.slice(0, 30)}`,
      content: generatedResult,
      wordCount: generatedResult.trim().split(/\s+/).filter(Boolean).length,
      tone: brandDna.toneTag,
      updatedAt: new Date().toISOString(),
      tag: activeTemplate.category,
    };
    onSendToEditor(newDoc);
  };

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'Send': return <Send className="w-5 h-5 text-emerald-400" />;
      case 'Share2': return <Share2 className="w-5 h-5 text-cyan-400" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5 text-amber-400" />;
      case 'Mail': return <Mail className="w-5 h-5 text-purple-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-pink-400" />;
      case 'Award': return <Award className="w-5 h-5 text-rose-400" />;
      case 'Video': return <Video className="w-5 h-5 text-blue-400" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
          <Grid className="w-3.5 h-3.5" />
          <span>Curated AI Workflows</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Templates & Workflow Automations
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Specialized writing workflows engineered for high CTR, B2B sales outreach, brand voice coherence, and organic search ranking.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => openTemplateModal(tpl)}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between group shadow-sm hover:shadow-indigo-500/10"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {getTemplateIcon(tpl.iconName)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {tpl.category}
              </span>
              <h3 className="font-bold text-white text-sm mt-2 group-hover:text-indigo-300 transition-colors">
                {tpl.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
              <span>Use Template</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Template Execution Modal */}
      {activeTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  {getTemplateIcon(activeTemplate.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{activeTemplate.title}</h3>
                  <span className="text-[10px] text-slate-400">{activeTemplate.category}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTemplate(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close ✕
              </button>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2 animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-400 hover:text-white font-semibold text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleGenerateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Topic or Core Subject
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Context, Target Keywords or Details
                </label>
                <textarea
                  rows={3}
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Using Brand DNA: <strong className="text-white">{brandDna.brandName}</strong> ({brandDna.toneTag})
                </span>
                <div className="flex items-center gap-2">
                  {isGenerating && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="min-tap px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isGenerating || !topicInput.trim()}
                    className="min-tap px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0A0F1D]" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Output</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Skeleton Shimmer While Generating */}
            {isGenerating && (
              <div className="p-4 rounded-xl bg-[#0A0F1D] border border-teal-500/30 space-y-2 animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold mb-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Drafting copy according to template framework...</span>
                </div>
                <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                <div className="h-4 w-full rounded skeleton-shimmer" />
                <div className="h-4 w-5/6 rounded skeleton-shimmer" />
              </div>
            )}

            {/* Result Area */}
            {generatedResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="font-semibold text-indigo-400">Generated Output</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyResult}
                      className="flex items-center gap-1 text-slate-400 hover:text-white"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={transferToEditor}
                      className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                    >
                      Open in Document Editor &rarr;
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-2">
                  {generatedResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
