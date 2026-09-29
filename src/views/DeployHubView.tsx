import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  FileCode, 
  Download,
  Key
} from 'lucide-react';

export const DeployHubView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const envVariables = [
    {
      key: 'GEMINI_API_KEY',
      value: 'Injected from environment / AI Studio Secrets',
      purpose: 'Server-side Gemini 3.8 Flash AI copywriting & campaigns',
    },
    {
      key: 'PADDLE_API_KEY',
      value: 'Injected from environment (PADDLE_API_KEY)',
      purpose: 'Paddle Sandbox API Key for cancel/restore calls',
    },
    {
      key: 'NEXT_PUBLIC_PADDLE_CLIENT_TOKEN / PADDLE_CLIENT_TOKEN',
      value: 'Injected from environment (PADDLE_CLIENT_TOKEN)',
      purpose: 'Client-side token safe to expose in browser for Paddle.js Sandbox Overlay',
    },
    {
      key: 'PADDLE_PRODUCT_ID',
      value: 'Injected from environment (PADDLE_PRODUCT_ID)',
      purpose: 'Pro tier subscription product in Paddle Catalog',
    },
    {
      key: 'PADDLE_PRICE_ID_PRO / NEXT_PUBLIC_PADDLE_PRICE_ID_PRO',
      value: 'Injected from environment (PADDLE_PRICE_ID_PRO)',
      purpose: 'Paddle Price ID (pri_ prefix from Catalog → Products in Paddle dashboard)',
    },
    {
      key: 'CHAPA_PUBLIC_KEY',
      value: 'Injected from environment (CHAPA_PUBLIC_KEY)',
      purpose: 'Chapa public test key for Telebirr / CBE payment initialization',
    },
    {
      key: 'CHAPA_SECRET_KEY',
      value: 'Injected from environment (CHAPA_SECRET_KEY)',
      purpose: 'Chapa secret test key for server-side verification',
    },
    {
      key: 'PADDLE_WEBHOOK_SECRET',
      value: 'pdl_whsec_YOUR_SIGNING_SECRET',
      purpose: 'Paddle Developer Tools → Notifications webhook signing secret',
    },
    {
      key: 'SUPPORT_INBOX_EMAIL',
      value: 'support@yourdomain.com',
      purpose: 'Destination email for Customer Help Center tickets',
    },
  ];

  const githubCommands = `# 1. Initialize local git repository
git init

# 2. Stage all project files
git add .

# 3. Create your first commit
git commit -m "Initial commit of Quill AI Enterprise SaaS"

# 4. Set main branch
git branch -M main

# 5. Connect to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/your-username/quill-ai-saas.git

# 6. Push code to GitHub
git push -u origin main`;

  const vercelCliCommands = `# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy to production
vercel --prod`;

  const downloadVercelJson = () => {
    const config = JSON.stringify({
      version: 2,
      builds: [
        {
          src: "package.json",
          use: "@vercel/static-build",
          config: {
            distDir: "dist"
          }
        }
      ],
      routes: [
        {
          src: "/(.*)",
          dest: "/index.html"
        }
      ],
      crons: [
        { "path": "/api/billing/chapa/renew", "schedule": "0 8 * * *" },
        { "path": "/api/cron/workflows", "schedule": "*/5 * * * *" }
      ]
    }, null, 2);

    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vercel.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold border border-teal-500/20">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Settings & Developer Hub</span>
          </div>
          {/* Moved from customer header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] text-slate-300 text-xs font-medium border border-[#1E2A44]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paddle Sandbox & Chapa Live</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Developer & Deployment Hub
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Everything is configured for zero-friction export. Follow this guide to manage environment secrets, test Paddle and Chapa gateways, and deploy your Vercel serverless functions in /api.
        </p>
      </div>

      {/* Step 1: Push to GitHub */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Push Repository to GitHub
            </h2>
          </div>
          <button
            onClick={() => copyToClipboard(githubCommands, 'git-all')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
          >
            {copiedIndex === 'git-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Git Commands</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Create a new repository on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a>, then run these commands in your project terminal:
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
          {githubCommands}
        </div>
      </div>

      {/* Step 2: Vercel Environment Variables */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Configure Vercel Environment Variables
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          In your Vercel Project Dashboard (<strong className="text-slate-200">Settings &rarr; Environment Variables</strong>), add the following keys. Your test keys are pre-filled below for easy 1-click copying:
        </p>

        <div className="space-y-2.5">
          {envVariables.map((env) => (
            <div
              key={env.key}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="font-mono font-bold text-white">{env.key}</span>
                </div>
                <p className="text-[11px] text-slate-400">{env.purpose}</p>
                <div className="font-mono text-slate-300 text-[10px] truncate max-w-md bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {env.value}
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(env.value, env.key)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 shrink-0"
              >
                {copiedIndex === env.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Value</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Deploy to Vercel */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Deploy to Production via Vercel CLI or Web
            </h2>
          </div>
          <button
            onClick={downloadVercelJson}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download vercel.json</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" /> Method A: Vercel CLI (Fastest)
            </h3>
            <p className="text-xs text-slate-400">
              Run in your terminal to deploy your live build instantly:
            </p>
            <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-slate-200 whitespace-pre">
              {vercelCliCommands}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-cyan-400" /> Method B: Vercel Web Dashboard
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1. Visit <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">vercel.com/new</a>.<br />
              2. Select your imported GitHub repository.<br />
              3. Framework Preset will auto-detect as <strong className="text-white">Vite</strong>.<br />
              4. Paste the environment variables above.<br />
              5. Click <strong className="text-white">Deploy</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
