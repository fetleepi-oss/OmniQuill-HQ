import React, { useState } from 'react';
import { 
  FileEdit, 
  Sparkles, 
  Wand2, 
  Scissors, 
  CheckCircle, 
  ListOrdered, 
  BarChart2, 
  Download, 
  Copy, 
  Check, 
  Loader2, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle,
  XCircle
} from 'lucide-react';
import { DocumentItem, BrandDNA, AuditReport } from '../types';

interface DocumentEditorViewProps {
  currentDoc: DocumentItem;
  onSaveDoc: (doc: DocumentItem) => void;
  brandDna: BrandDNA;
  onAuditCompleted?: () => void;
}

export const DocumentEditorView: React.FC<DocumentEditorViewProps> = ({
  currentDoc,
  onSaveDoc,
  brandDna,
  onAuditCompleted,
}) => {
  const [doc, setDoc] = useState<DocumentItem>(currentDoc);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSideTab, setActiveSideTab] = useState<'editor' | 'auditor'>('editor');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Stats
  const words = doc.content.trim().split(/\s+/).filter(Boolean).length;
  const chars = doc.content.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  const handleContentChange = (content: string) => {
    const updated = {
      ...doc,
      content,
      wordCount: content.trim().split(/\s+/).filter(Boolean).length,
      updatedAt: new Date().toISOString(),
    };
    setDoc(updated);
    onSaveDoc(updated);
  };

  const handleTitleChange = (title: string) => {
    const updated = { ...doc, title, updatedAt: new Date().toISOString() };
    setDoc(updated);
    onSaveDoc(updated);
  };

  const cancelAIGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessingAI(false);
  };

  // Inline AI Assistant commands
  const runInlineAI = async (action: 'continue' | 'expand' | 'concise' | 'grammar' | 'bullets' | 'tone') => {
    if (isProcessingAI) return;
    setIsProcessingAI(true);
    setErrorMessage(null);
    abortControllerRef.current = new AbortController();

    let instruction = '';
    switch (action) {
      case 'continue':
        instruction = `Continue writing smoothly from where this text leaves off, matching the voice and context seamlessly. Provide approx 150 words of next paragraphs.`;
        break;
      case 'expand':
        instruction = `Elaborate on the key arguments and data points in this text, adding depth and persuasive nuance.`;
        break;
      case 'concise':
        instruction = `Make this text punchy, crisp, and high-impact. Remove fluff, passive voice, and wordiness while preserving the core message.`;
        break;
      case 'grammar':
        instruction = `Polish this text to flawless executive standard. Correct any grammatical slips, punctuation, and elevate flow.`;
        break;
      case 'bullets':
        instruction = `Transform this text into clean, scannable bullet points with bold lead-ins for key insights.`;
        break;
      case 'tone':
        instruction = `Rewrite this text strictly in the Brand DNA tone: ${brandDna.toneTag}. Use custom rules: ${brandDna.toneRules}.`;
        break;
    }

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          prompt: `${instruction}\n\n[TEXT CONTENT]:\n${doc.content}`,
          brandDna,
          tone: brandDna.toneTag,
          maxWords: 350,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI generation failed (status ${response.status})`);
      }

      const data = await response.json();
      if (data.text) {
        if (action === 'continue') {
          handleContentChange(`${doc.content}\n\n${data.text}`);
        } else {
          handleContentChange(data.text);
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setErrorMessage('AI writing was cancelled.');
      } else {
        console.error(err);
        setErrorMessage(err.message || 'AI processing encountered a network issue.');
      }
    } finally {
      setIsProcessingAI(false);
      abortControllerRef.current = null;
    }
  };

  // Run Content Audit (Anyword / Surfer style)
  const runAudit = async () => {
    if (!doc.content.trim() || isAuditing) return;
    setIsAuditing(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: doc.content,
          targetKeyword,
        }),
      });
      if (!response.ok) {
        throw new Error(`Audit failed with status code ${response.status}`);
      }
      const data: AuditReport = await response.json();
      setAuditReport(data);
      setActiveSideTab('auditor');
      if (onAuditCompleted) {
        onAuditCompleted();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to complete SEO & readability audit.');
    } finally {
      setIsAuditing(false);
    }
  };

  const copyDoc = () => {
    navigator.clipboard.writeText(doc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportMarkdown = () => {
    const md = `# ${doc.title}\n\n${doc.content}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex-1">
          <input
            type="text"
            value={doc.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-xl sm:text-2xl font-extrabold text-white bg-transparent border-none focus:outline-none w-full placeholder-slate-500"
            placeholder="Document Title..."
          />
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
            <span>{words} words</span>
            <span>&bull;</span>
            <span>{chars} characters</span>
            <span>&bull;</span>
            <span>~{readingTimeMinutes} min read</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-medium">Auto-saved</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runAudit()}
            disabled={isAuditing || !doc.content.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold transition-colors"
          >
            {isAuditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BarChart2 className="w-3.5 h-3.5" />}
            <span>Audit & Score</span>
          </button>

          <button
            onClick={copyDoc}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            title="Copy Text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={exportMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export .md</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Editor Canvas & Side Auditor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Writing Canvas & Inline AI Bar */}
        <div className="lg:col-span-8 space-y-4">
          {/* AI Inline Quick Actions Bar */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 px-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              AI Tools:
            </span>

            <button
              onClick={() => runInlineAI('continue')}
              disabled={isProcessingAI}
              title="Continue writing the next logical sentences based on existing text"
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-teal-600/25 hover:text-teal-200 text-slate-300 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Wand2 className="w-3 h-3 text-teal-400" />
              <span>Continue Writing</span>
            </button>

            <button
              onClick={() => runInlineAI('expand')}
              disabled={isProcessingAI}
              title="Elaborate with deeper arguments, examples, and persuasive evidence"
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-teal-600/25 hover:text-teal-200 text-slate-300 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Expand & Elaborate</span>
            </button>

            <button
              onClick={() => runInlineAI('concise')}
              disabled={isProcessingAI}
              title="Remove fluff, passive phrasing, and shorten sentence length"
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-teal-600/25 hover:text-teal-200 text-slate-300 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Scissors className="w-3 h-3 text-cyan-400" />
              <span>Make Punchy</span>
            </button>

            <button
              onClick={() => runInlineAI('grammar')}
              disabled={isProcessingAI}
              title="Fix punctuation, spelling, and polish tone to executive standard"
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-teal-600/25 hover:text-teal-200 text-slate-300 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Fix Grammar & Polish</span>
            </button>

            <button
              onClick={() => runInlineAI('bullets')}
              disabled={isProcessingAI}
              title="Transform dense paragraphs into crisp, scannable bullet points"
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-teal-600/25 hover:text-teal-200 text-slate-300 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <ListOrdered className="w-3 h-3 text-amber-400" />
              <span>Turn into Bullets</span>
            </button>

            <button
              onClick={() => runInlineAI('tone')}
              disabled={isProcessingAI}
              title={`Recalibrate document to match ${brandDna.toneTag}`}
              className="px-2.5 py-1 rounded-md bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 border border-teal-500/30 transition-colors flex items-center gap-1 disabled:opacity-50 font-medium"
            >
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>Apply Brand Voice</span>
            </button>
          </div>

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

          {/* Text Area Canvas */}
          <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
            {isProcessingAI && (
              <div className="absolute inset-0 bg-[#0A0F1D]/85 backdrop-blur-sm z-10 p-6 flex flex-col justify-between">
                {/* Skeleton shimmer preview */}
                <div className="space-y-3.5 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                    <span>AI is crafting in {brandDna.toneTag} voice...</span>
                  </div>
                  <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
                  <div className="h-4 w-full rounded-md skeleton-shimmer" />
                  <div className="h-4 w-5/6 rounded-md skeleton-shimmer" />
                  <div className="h-4 w-2/3 rounded-md skeleton-shimmer" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#1E2A44]">
                  <p className="text-xs text-[#9AA9C2]">
                    Synthesizing brand terminology and tone rules...
                  </p>
                  <button
                    type="button"
                    onClick={cancelAIGeneration}
                    className="min-tap px-4 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Generation</span>
                  </button>
                </div>
              </div>
            )}
            <textarea
              rows={22}
              value={doc.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start drafting or run an AI prompt above to begin generating your article or sales copy..."
              className="w-full bg-slate-950/70 p-6 text-slate-100 placeholder-slate-600 focus:outline-none text-base leading-relaxed resize-none font-sans"
            />
          </div>
        </div>

        {/* Right: Anyword & Surfer style Content Auditor */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">AI Content Auditor</h3>
              </div>
              <span className="text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                Anyword / Surfer
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Target SEO Keyword (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="e.g. AI copywriting software"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={runAudit}
                  disabled={isAuditing || !doc.content.trim()}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium shrink-0 disabled:opacity-50 transition-colors shadow-sm shadow-teal-600/30"
                >
                  {isAuditing ? 'Analyzing...' : 'Run Audit'}
                </button>
              </div>
            </div>

            {/* Audit Results */}
            {auditReport ? (
              <div className="space-y-4 pt-2">
                {/* Score Dial */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Content Performance</span>
                    <div className="text-2xl font-black text-teal-400">
                      {auditReport.performanceScore}<span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Conversion Estimate:</span>
                    <div className={`text-sm font-bold ${
                      auditReport.conversionProbability === 'High' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {auditReport.conversionProbability}
                    </div>
                  </div>
                </div>

                {/* Metrics list */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px]">Flesch-Kincaid Level</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{auditReport.readabilityScore}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px]">Opening Hook</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{auditReport.emotionalHookScore}/100</p>
                  </div>
                </div>

                {/* Keyword Optimization */}
                {auditReport.seoKeywordOptimization && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-medium">
                      <span>Exact Keyword Density:</span>
                      <span className="text-teal-400 font-mono">{auditReport.seoKeywordOptimization.densityPercentage}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {auditReport.seoKeywordOptimization.recommendation}
                    </p>
                  </div>
                )}

                {/* Strengths */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Core Strengths
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {auditReport.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">&bull;</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Improvements */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Suggested Improvements
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {auditReport.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">&bull;</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Click <span className="text-indigo-400 font-medium">"Audit & Score"</span> to benchmark reading level, emotional appeal, and conversion potential with Gemini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
