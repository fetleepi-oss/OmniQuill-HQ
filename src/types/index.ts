export interface BrandDNA {
  brandName: string;
  valueProp: string;
  targetAudience: string;
  toneRules: string;
  forbiddenWords: string;
  customTerminology: string;
  toneTag: 'Executive & Authoritative' | 'Bold & Punchy' | 'Empathetic & Warm' | 'Witty & Playful' | 'Data-Driven & Analytical';
}

export interface CampaignAsset {
  campaignName: string;
  summary: string;
  blogPost: {
    title: string;
    metaDescription: string;
    readingTime: string;
    content: string;
  };
  linkedInUpdates: Array<{
    type: string;
    content: string;
  }>;
  twitterThread: string[];
  emailNewsletter: {
    subjectLine: string;
    previewText: string;
    body: string;
    callToAction: string;
  };
  paidAdVariants: Array<{
    channel: string;
    headline: string;
    description?: string;
    primaryText?: string;
  }>;
}

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  tone: string;
  updatedAt: string;
  tag: string;
}

export interface AuditReport {
  performanceScore: number;
  readabilityScore: string;
  emotionalHookScore: number;
  conversionProbability: 'High' | 'Medium' | 'Low';
  seoKeywordOptimization: {
    keywordFound: boolean;
    densityPercentage: string;
    recommendation: string;
  };
  strengths: string[];
  improvements: string[];
  predictedEngagement: string;
}

export interface SupportTicket {
  id: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  aiSuggestedResolution?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  type: 'billing' | 'content' | 'support' | 'security';
  timestamp: string;
  details: string;
}

export interface UserSubscription {
  plan: 'starter' | 'pro' | 'enterprise';
  planName: string;
  wordsUsed: number;
  wordsLimit: number;
  gateway: 'paddle' | 'chapa' | 'none';
  txRef?: string;
  paddleSubscriptionId?: string;
  cancelAtPeriodEnd?: boolean;
  billingCycle: 'monthly' | 'yearly';
  activeSince: string;
}

export interface ScheduledPost {
  id: string;
  title: string;
  channel: 'blog' | 'linkedin' | 'twitter' | 'newsletter' | 'ad';
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: 'scheduled' | 'published' | 'draft';
  contentSnippet: string;
  language: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetView: string;
  actionLabel: string;
  completed: boolean;
}

export interface Template {
  id: string;
  title: string;
  category: 'SEO & Content' | 'Sales & Outreach' | 'Social & Viral' | 'Ads & Conversion' | 'Email';
  description: string;
  iconName: string;
  promptTemplate: string;
  defaultInputs: {
    topic: string;
    context: string;
  };
}
