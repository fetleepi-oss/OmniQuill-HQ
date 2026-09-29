import { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'seo-blog-writer',
    title: 'SEO Long-Form Article Generator',
    category: 'SEO & Content',
    description: 'Generates comprehensive, rank-ready long-form blog posts with H2/H3 subheads and key takeaways.',
    iconName: 'FileText',
    promptTemplate: 'Write an in-depth, authoritative SEO blog post on the topic: "{topic}". Target keywords/context: "{context}". Include an engaging introduction hook, 3 detailed core sections with subheadings, actionable steps, and a conclusive call to action.',
    defaultInputs: {
      topic: 'How Generative AI is Reshaping B2B Content Marketing',
      context: 'Keywords: AI copywriting, content marketing workflows, marketing ROI, modern B2B copy platform',
    },
  },
  {
    id: 'cold-outreach-email',
    title: 'High-Conversion Cold Email (Copy.ai style)',
    category: 'Sales & Outreach',
    description: 'Personalized B2B outbound email focused on pain points, quantifiable social proof, and a low-friction CTA.',
    iconName: 'Send',
    promptTemplate: 'Draft a 3-part personalized B2B cold outreach email sequence for a prospect interested in: "{topic}". Value proposition and context: "{context}". Keep it under 150 words per email, conversational, no generic fluff, with a single compelling call to action.',
    defaultInputs: {
      topic: 'AI Content Scaling for VP of Marketing',
      context: 'We cut content production time by 72% while doubling organic traffic for Series A startups.',
    },
  },
  {
    id: 'linkedin-viral-hook',
    title: 'LinkedIn Thought Leadership Post',
    category: 'Social & Viral',
    description: 'Story-driven LinkedIn post with a scroll-stopping first line hook, scannable formatting, and engagement questions.',
    iconName: 'Share2',
    promptTemplate: 'Write a viral LinkedIn thought leadership post about: "{topic}". Key insights/story context: "{context}". Use short 1-2 sentence paragraphs, relatable vulnerability or contrarian insight, and end with an open question to drive comments.',
    defaultInputs: {
      topic: 'The Biggest Mistake Founders Make When Hiring Their First Marketer',
      context: 'Hiring for output quantity instead of audience-problem fit. Lessons from scaling to $1M ARR.',
    },
  },
  {
    id: 'meta-ad-copy',
    title: 'High-CTR Meta & Instagram Ad (Anyword style)',
    category: 'Ads & Conversion',
    description: 'Scroll-stopping primary text, headline, and link description built for conversion on Facebook & Instagram.',
    iconName: 'Megaphone',
    promptTemplate: 'Write 3 variations of high-converting Meta/Instagram ad copy for: "{topic}". Core offer & audience context: "{context}". Format each with Primary Text (hook + problem + solution), Headline (< 40 chars), and CTA button recommendation.',
    defaultInputs: {
      topic: 'Quill AI 7-Day Free Trial',
      context: 'Save 20 hours a week on marketing copy with custom Brand DNA and multi-channel campaigns.',
    },
  },
  {
    id: 'executive-newsletter',
    title: 'Executive C-Suite Newsletter',
    category: 'Email',
    description: 'Insightful, high-signal weekly briefing for subscribers with 3 punchy takeaways and industry commentary.',
    iconName: 'Mail',
    promptTemplate: 'Write an executive weekly newsletter edition on: "{topic}". Context & talking points: "{context}". Include subject line, 1-paragraph market breakdown, 3 bulleted deep-dive takeaways, and a question of the week.',
    defaultInputs: {
      topic: 'State of AI Agents in Q4 2026',
      context: 'Shift from single prompt generation to autonomous multi-agent pipelines and unified brand knowledge graphs.',
    },
  },
  {
    id: 'ecommerce-product',
    title: 'E-Commerce High-Converting Product Copy',
    category: 'Sales & Outreach',
    description: 'Shopify & Amazon ready description turning features into emotional benefits with bulleted highlights.',
    iconName: 'ShoppingBag',
    promptTemplate: 'Write a persuasive, benefit-first e-commerce product description for: "{topic}". Key features and specifications: "{context}". Include a sensory hook, bullet points of emotional benefits, and an irresistible urgency CTA.',
    defaultInputs: {
      topic: 'Ergonomic Standing Desk Pro',
      context: 'Dual motor, whisper quiet, solid oak top, built-in cable management, 10-year warranty.',
    },
  },
  {
    id: 'case-study-creator',
    title: 'Customer Success Case Study',
    category: 'SEO & Content',
    description: 'Classic Problem-Solution-Result narrative showcasing ROI and customer triumph.',
    iconName: 'Award',
    promptTemplate: 'Create a compelling B2B Customer Case Study for: "{topic}". Metrics & background details: "{context}". Format into: The Challenge, The Solution, The Measurable Results, and an executive quote.',
    defaultInputs: {
      topic: 'Fintech Corp Scales Organic Search by 340%',
      context: 'Replaced manual freelance drafting with Quill Brand DNA workflows. Saved $48,000 annually.',
    },
  },
  {
    id: 'youtube-script-outline',
    title: 'YouTube Video Script & Hook Outline',
    category: 'Social & Viral',
    description: 'First 30 seconds retention hook, pacing cues, B-roll suggestions, and sponsor transition.',
    iconName: 'Video',
    promptTemplate: 'Write a 5-minute YouTube video script outline on: "{topic}". Key takeaways: "{context}". Include a high-retention 15-second visual hook, pattern interrupts, and smooth CTA to subscribe.',
    defaultInputs: {
      topic: 'How to Build an AI Content Engine from Scratch in 2026',
      context: 'Tool stack breakdown, prompt architecture, brand voice calibration, distribution automation.',
    },
  },
];
