# Quill AI — Enterprise AI Copywriting & Marketing Platform

Quill AI is an enterprise SaaS platform powered by Google Gemini 3.8 Flash, featuring multi-channel marketing generation, Brand DNA intelligence, cross-border payments with Paddle and Chapa (Telebirr / CBE Birr), automated scheduling, and serverless deployment on Vercel.

---

## 🚀 Key Features

- **Google Gemini 3.8 Flash AI Engine**: High-converting marketing copy, email sequences, SEO landing pages, social threads, and ad variations.
- **Brand DNA Memory**: Enforce consistent tone, brand value propositions, voice rules, and custom industry terminology across all campaigns.
- **Multi-Gateway Billing**:
  - **Paddle Billing**: Global cards, PayPal, subscription management, webhooks, and sandbox testing.
  - **Chapa Payments**: Ethiopian local currency payments via Telebirr, CBE Birr, and mobile money.
- **Enterprise Persistence**: Integrated with Vercel KV / Upstash Redis for serverless state persistence, with zero-config local memory fallback.
- **Full-Stack Architecture**: React 19 SPA with Tailwind CSS on Vite, backed by Express serverless API routes (`/api/*`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: Node.js, Express, Google Gen AI SDK (`@google/genai`).
- **Database / Cache**: Vercel KV / Upstash Redis (with seamless local dev fallback).
- **Deployment**: Vercel Serverless Functions (`api/index.ts` + `vercel.json`).

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd quill-ai-saas
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your API keys in `.env`:
- `GEMINI_API_KEY`: Your Google AI Studio Gemini API key.
- `CHAPA_SECRET_KEY`: Chapa secret key for Ethiopian payments.
- `PADDLE_API_KEY`: Paddle API key for global payments.

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New → Project** and import this repository.
3. Framework Preset: **Vite**.
4. Add your environment variables in Vercel Project Settings:
   - `GEMINI_API_KEY`
   - `CHAPA_SECRET_KEY`
   - `PADDLE_API_KEY`
   - `CHAPA_PUBLIC_KEY`
   - `PADDLE_CLIENT_TOKEN`
   - `PADDLE_PRODUCT_ID`
   - `PADDLE_PRICE_ID_PRO`
   - `SUPPORT_INBOX_EMAIL`
5. (Optional) Connect **Upstash Redis** from the Vercel Marketplace to enable persistent transaction logs, tickets, and audit trails.
6. Click **Deploy**.

---

## 📜 License

MIT License. Built with Quill AI.
