import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  Share2, 
  Mail, 
  Megaphone, 
  Loader2, 
  Download,
  Fingerprint,
  AlertCircle,
  Twitter,
  X
} from 'lucide-react';
import { CampaignAsset, BrandDNA } from '../types';

interface CampaignBuilderViewProps {
  brandDna: BrandDNA;
  onCampaignGenerated: (campaign: CampaignAsset) => void;
  initialCampaign: CampaignAsset | null;
}

export const CampaignBuilderView: React.FC<CampaignBuilderViewProps> = ({
  brandDna,
  onCampaignGenerated,
  initialCampaign,
}) => {
  const [goal, setGoal] = useState('Launch the new enterprise AI Content Suite');
  const [productDesc, setProductDesc] = useState(
    'Quill AI is an enterprise AI marketing and copywriting platform. Features include calibrated Brand DNA voice tuning, automated 5-in-1 multi-channel campaigns, AI performance auditing, and dual payment support with Paddle Sandbox and Ethiopian Telebirr via Chapa.'
  );
  const [targetAudience, setTargetAudience] = useState(brandDna.targetAudience || 'B2B Marketing Leaders, Founders, and Growth Teams');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState<CampaignAsset | null>(initialCampaign);
  const [activeTab, setActiveTab] = useState<'blog' | 'linkedin' | 'twitter' | 'email' | 'ads'>('blog');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !productDesc.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ai/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          campaignGoal: goal,
          productDescription: productDesc,
          targetAudience,
          brandDna,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Campaign generation failed with status ${response.status}`);
      }
      const data: CampaignAsset = await response.json();
      setCampaign(data);
      onCampaignGenerated(data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setErrorMessage('Campaign generation was cancelled.');
      } else {
        console.error(err);
        setErrorMessage(err.message || 'Error generating campaign package. Please check server connection.');
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

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const exportAllCampaignMarkdown = () => {
    if (!campaign) return;
    const md = `# Multi-Channel Campaign: ${campaign.campaignName}
Summary: ${campaign.summary}

---
## 1. Long-Form Blog Post
Title: ${campaign.blogPost.title}
Meta Description: ${campaign.blogPost.metaDescription}
Estimated Reading Time: ${campaign.blogPost.readingTime}

${campaign.blogPost.content}

---
## 2. LinkedIn Thought Leadership Updates
${campaign.linkedInUpdates.map((item, idx) => `### Update ${idx + 1} (${item.type})\n${item.content}`).join('\n\n')}

---
## 3. Twitter / X Viral Thread
${campaign.twitterThread.map((tweet, idx) => `Tweet ${idx + 1}/5:\n${tweet}`).join('\n\n')}

---
## 4. Email Newsletter
Subject: ${campaign.emailNewsletter.subjectLine}
Preview: ${campaign.emailNewsletter.previewText}

${campaign.emailNewsletter.body}

CTA: ${campaign.emailNewsletter.callToAction}

---
## 5. Paid Ad Variants
${campaign.paidAdVariants.map((ad, idx) => `### Ad ${idx + 1} - ${ad.channel}\nHeadline: ${ad.headline}\n${ad.description ? `Description: ${ad.description}` : ''}\n${ad.primaryText ? `Primary Text: ${ad.primaryText}` : ''}`).join('\n\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.campaignName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-campaign.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Autonomous Multi-Channel Campaign Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campaign Builder
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Input a single product goal to automatically orchestrate a coordinated 5-part campaign across Blog, LinkedIn, Twitter, Email, and Paid Ads.
          </p>
        </div>

        {campaign && (
          <button
            onClick={exportAllCampaignMarkdown}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Full Campaign (.md)</span>
          </button>
        )}
      </div>

      {/* Brand DNA Injected Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Fingerprint className="w-4 h-4 text-emerald-400" />
          <span>Injecting Brand DNA:</span>
          <span className="font-semibold text-white">{brandDna.brandName || 'Default Brand'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-indigo-400">{brandDna.toneTag}</span>
        </div>
        <span className="text-emerald-400 flex items-center gap-1 font-medium">
          <Check className="w-3.5 h-3.5" /> Voice Synchronized
        </span>
      </div>

      {/* Campaign Configuration Form */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Campaign Goal or Initiative
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Q4 Product Launch, Cyber Monday Promotion, Webinar Registration"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Audience Persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. B2B SaaS Marketers, Seed Founders, VP of Sales"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Output Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              >
                <option value="English">English (US/UK)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Amharic">Amharic (አማርኛ)</option>
                <option value="Arabic">Arabic (العربية)</option>
                <option value="Portuguese">Portuguese (Português)</option>
                <option value="Japanese">Japanese (日本語)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Product Description & Core Differentiators
            </label>
            <textarea
              rows={3}
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              placeholder="Describe your product, offer, unique selling proposition, and what problem it solves..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            {isGenerating && (
              <button
                type="button"
                onClick={handleCancel}
                className="min-tap px-4 py-2.5 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 font-semibold text-xs transition-colors"
              >
                Cancel Generation
              </button>
            )}

            <button
              type="submit"
              disabled={isGenerating || !goal.trim() || !productDesc.trim()}
              className="min-tap px-6 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2 shadow-sm focus-visible:outline-teal-400"
              aria-label="Generate 5-in-1 Campaign Package"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0A0F1D]" />
                  <span>Synthesizing Package...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 5-in-1 Campaign</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Skeleton Shimmer Preview while Campaign synthesizes */}
        {isGenerating && (
          <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-teal-500/30 space-y-4 animate-fade-in mt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              <span>Synthesizing 5 multi-channel marketing assets in parallel...</span>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-2/3 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-5/6 rounded skeleton-shimmer" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="h-16 rounded-xl skeleton-shimmer" />
                <div className="h-16 rounded-xl skeleton-shimmer" />
                <div className="h-16 rounded-xl skeleton-shimmer" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Campaign Output Tabs */}
      {campaign ? (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden space-y-0">
          {/* Campaign Header banner */}
          <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Generated Package
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{campaign.campaignName}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">{campaign.summary}</p>
            </div>
            <button
              onClick={() => copyText(JSON.stringify(campaign, null, 2), 'full-json')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 self-start"
            >
              {copiedKey === 'full-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy JSON Payload</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('blog')}
              className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'blog'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>SEO Blog Post</span>
            </button>

            <button
              onClick={() => setActiveTab('linkedin')}
              className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'linkedin'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>3x LinkedIn Posts</span>
            </button>

            <button
              onClick={() => setActiveTab('twitter')}
              className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'twitter'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-bold text-xs">𝕏</span>
              <span>Twitter/X Thread (5 Tweets)</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'email'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Newsletter</span>
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'ads'
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Google & Meta Ads</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6">
            {activeTab === 'blog' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">{campaign.blogPost.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Meta Description: {campaign.blogPost.metaDescription} ({campaign.blogPost.readingTime})
                    </p>
                  </div>
                  <button
                    onClick={() => copyText(campaign.blogPost.content, 'blog-post')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
                  >
                    {copiedKey === 'blog-post' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Article</span>
                  </button>
                </div>
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {campaign.blogPost.content}
                </div>
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaign.linkedInUpdates.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                        <button
                          onClick={() => copyText(item.content, `li-${idx}`)}
                          className="text-slate-400 hover:text-white"
                        >
                          {copiedKey === `li-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'twitter' && (
              <div className="space-y-3 max-w-2xl mx-auto">
                <div className="flex justify-end">
                  <button
                    onClick={() => copyText(campaign.twitterThread.join('\n\n---\n\n'), 'thread-all')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    {copiedKey === 'thread-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Full Thread</span>
                  </button>
                </div>
                {campaign.twitterThread.map((tweet, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200 leading-relaxed">{tweet}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'email' && (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => copyText(`Subject: ${campaign.emailNewsletter.subjectLine}\n\n${campaign.emailNewsletter.body}`, 'email-all')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    {copiedKey === 'email-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Email</span>
                  </button>
                </div>
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="space-y-1 pb-3 border-b border-slate-800">
                    <div className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Subject:</span> {campaign.emailNewsletter.subjectLine}
                    </div>
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-400">Preview:</span> {campaign.emailNewsletter.previewText}
                    </div>
                  </div>
                  <div className="text-sm text-slate-200 whitespace-pre-line leading-relaxed pt-2">
                    {campaign.emailNewsletter.body}
                  </div>
                  <div className="pt-4 border-t border-slate-800">
                    <span className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs">
                      {campaign.emailNewsletter.callToAction}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ads' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaign.paidAdVariants.map((ad, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {ad.channel}
                      </span>
                      <button
                        onClick={() => copyText(`${ad.headline}\n${ad.description || ad.primaryText || ''}`, `ad-${idx}`)}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === `ad-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{ad.headline}</h4>
                    {ad.description && <p className="text-xs text-slate-300 leading-relaxed">{ad.description}</p>}
                    {ad.primaryText && <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{ad.primaryText}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State with One Clear Next Action */
        <div className="p-8 rounded-2xl bg-[#111A2E] border border-[#1E2A44] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">No campaign generated yet</h3>
            <p className="text-xs text-[#9AA9C2] leading-relaxed">
              Fill in your campaign goal and product description above, then click Generate to create 5 synchronized assets.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
