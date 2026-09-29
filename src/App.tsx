import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { CampaignBuilderView } from './views/CampaignBuilderView';
import { DocumentEditorView } from './views/DocumentEditorView';
import { BrandDnaView } from './views/BrandDnaView';
import { TemplatesView } from './views/TemplatesView';
import { FreeToolsView } from './views/FreeToolsView';
import { BillingView } from './views/BillingView';
import { HelpCenterView } from './views/HelpCenterView';
import { DeployHubView } from './views/DeployHubView';
import { ContentCalendarView } from './views/ContentCalendarView';
import { 
  BrandDNA, 
  UserSubscription, 
  DocumentItem, 
  CampaignAsset,
  ScheduledPost,
  OnboardingStep
} from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Auto-detect Chapa return_url parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('gateway') === 'chapa' || params.get('payment_success')) {
        setCurrentView('billing');
      }
    }
  }, []);

  // Real-time tracking of onboarding completions based on user action
  const [hasCalibratedBrand, setHasCalibratedBrand] = useState<boolean>(false);
  const [hasGeneratedCampaign, setHasGeneratedCampaign] = useState<boolean>(false);
  const [hasAuditedDocument, setHasAuditedDocument] = useState<boolean>(false);
  const [hasScheduledPost, setHasScheduledPost] = useState<boolean>(false);

  // Scheduled Content Calendar Items - Empty for new user initial state or filled on user addition
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Brand DNA State - clean initial setup state for new users
  const [brandDna, setBrandDna] = useState<BrandDNA>({
    brandName: '',
    valueProp: '',
    targetAudience: 'Growth Marketers & B2B Teams',
    toneRules: 'Punchy active voice, data-backed claims, zero buzzwords.',
    forbiddenWords: 'game-changer, revolutionary, synergy, leverage, delve',
    customTerminology: 'Brand DNA, Multi-Channel Suite',
    toneTag: 'Executive & Authoritative',
  });

  // Guided Onboarding Steps State - Strictly starts at 0 of 4 completed
  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'step-brand',
      title: '1. Set Your Brand Voice',
      description: 'Define your company brand name, value proposition, and tone rules.',
      targetView: 'brand-dna',
      actionLabel: 'Set Up Brand DNA',
      completed: hasCalibratedBrand || Boolean(brandDna.brandName.trim() && brandDna.valueProp.trim()),
    },
    {
      id: 'step-campaign',
      title: '2. Generate 5-in-1 Campaign',
      description: 'Synthesize blog, LinkedIn, twitter, email & ad variants at once.',
      targetView: 'campaigns',
      actionLabel: 'Build Campaign',
      completed: hasGeneratedCampaign,
    },
    {
      id: 'step-editor',
      title: '3. Audit Text Readability',
      description: 'Test genuine Flesch-Kincaid grade level and SEO keyword density.',
      targetView: 'editor',
      actionLabel: 'Open Editor',
      completed: hasAuditedDocument,
    },
    {
      id: 'step-calendar',
      title: '4. Schedule First Post',
      description: 'Add an article or social update to your content publishing timeline.',
      targetView: 'calendar',
      actionLabel: 'View Calendar',
      completed: hasScheduledPost || scheduledPosts.length > 0,
    },
  ];

  // User Subscription State: New users start strictly at 0 words used
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'pro',
    planName: 'Pro',
    wordsUsed: 0,
    wordsLimit: 200000,
    gateway: 'paddle',
    billingCycle: 'monthly',
    activeSince: new Date().toISOString(),
  });

  // Documents
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const [activeDoc, setActiveDoc] = useState<DocumentItem>({
    id: 'DOC-NEW',
    title: 'Untitled Document',
    content: '',
    wordCount: 0,
    tone: 'Executive & Authoritative',
    updatedAt: new Date().toISOString(),
    tag: 'Draft',
  });
  const [recentCampaign, setRecentCampaign] = useState<CampaignAsset | null>(null);

  // Quick generation from dashboard
  const handleQuickGenerate = async (prompt: string, tone: string) => {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        brandDna,
        tone,
        maxWords: 200,
      }),
    });
    if (!response.ok) {
      throw new Error(`Generation failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.wordCount) {
      setSubscription((prev) => ({
        ...prev,
        wordsUsed: Math.min(prev.wordsLimit, prev.wordsUsed + data.wordCount),
      }));
    }
    return data.text || '';
  };

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDoc(doc);
    setCurrentView('editor');
  };

  const handleSaveDoc = (updatedDoc: DocumentItem) => {
    setDocuments((prev) => {
      const exists = prev.some((d) => d.id === updatedDoc.id);
      return exists ? prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)) : [updatedDoc, ...prev];
    });
    setActiveDoc(updatedDoc);
  };

  const handleSendToEditorFromTemplate = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDoc(newDoc);
    setCurrentView('editor');
  };

  const handleUpdateSubscription = (partial: Partial<UserSubscription>) => {
    setSubscription((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Navbar
        subscription={subscription}
        onNavigate={setCurrentView}
        currentView={currentView}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          subscription={subscription}
          brandDna={brandDna}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentView}
              brandDna={brandDna}
              subscription={subscription}
              documents={documents}
              recentCampaign={recentCampaign}
              onOpenDocument={handleOpenDoc}
              onQuickGenerate={handleQuickGenerate}
              onboardingSteps={onboardingSteps}
              showOnboarding={showOnboarding}
              onDismissOnboarding={() => setShowOnboarding(false)}
            />
          )}

          {currentView === 'campaigns' && (
            <CampaignBuilderView
              brandDna={brandDna}
              onCampaignGenerated={(camp) => {
                setRecentCampaign(camp);
                setHasGeneratedCampaign(true);
              }}
              initialCampaign={recentCampaign}
            />
          )}

          {currentView === 'editor' && (
            <DocumentEditorView
              currentDoc={activeDoc}
              onSaveDoc={handleSaveDoc}
              brandDna={brandDna}
              onAuditCompleted={() => setHasAuditedDocument(true)}
            />
          )}

          {currentView === 'calendar' && (
            <ContentCalendarView
              posts={scheduledPosts}
              onAddPost={(newPost) => {
                setScheduledPosts([newPost, ...scheduledPosts]);
                setHasScheduledPost(true);
              }}
              onDeletePost={(id) => setScheduledPosts(scheduledPosts.filter((p) => p.id !== id))}
              onSelectPostContent={(content, title) => {
                const newDoc: DocumentItem = {
                  id: `DOC-${Date.now().toString().slice(-4)}`,
                  title,
                  content,
                  wordCount: content.trim().split(/\s+/).filter(Boolean).length,
                  tone: brandDna.toneTag,
                  updatedAt: new Date().toISOString(),
                  tag: 'Scheduled Post',
                };
                setDocuments([newDoc, ...documents]);
                setActiveDoc(newDoc);
                setCurrentView('editor');
              }}
            />
          )}

          {currentView === 'brand-dna' && (
            <BrandDnaView
              brandDna={brandDna}
              onSaveBrandDna={(updated) => {
                setBrandDna(updated);
                setHasCalibratedBrand(true);
              }}
            />
          )}

          {currentView === 'templates' && (
            <TemplatesView
              brandDna={brandDna}
              onSendToEditor={handleSendToEditorFromTemplate}
            />
          )}

          {currentView === 'free-tools' && (
            <FreeToolsView
              onUpgradePrompt={() => setCurrentView('billing')}
            />
          )}

          {currentView === 'billing' && (
            <BillingView
              subscription={subscription}
              onUpdateSubscription={handleUpdateSubscription}
            />
          )}

          {currentView === 'help' && (
            <HelpCenterView />
          )}

          {currentView === 'deploy' && (
            <DeployHubView />
          )}
        </main>
      </div>
    </div>
  );
}
