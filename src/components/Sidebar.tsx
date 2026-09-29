import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  FileEdit, 
  Fingerprint, 
  Grid, 
  Gift, 
  CreditCard, 
  Headphones, 
  Code,
  ShieldCheck, 
  ChevronRight,
  Calendar,
  X
} from 'lucide-react';
import { UserSubscription, BrandDNA } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  subscription: UserSubscription;
  brandDna: BrandDNA;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  subscription,
  brandDna,
  mobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Workspace overview',
      tooltip: 'Real-time metrics, active documents, and quick commands',
    },
    {
      id: 'campaigns',
      label: 'Campaign Builder',
      icon: Layers,
      desc: '5-in-1 multi-channel suite',
      badge: 'Pro',
      badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
      tooltip: 'Generate Blog, LinkedIn, X, Email & Ad variants simultaneously',
    },
    {
      id: 'editor',
      label: 'Document Editor',
      icon: FileEdit,
      desc: 'Writing canvas & live auditor',
      tooltip: 'Full document editor with readability grade and SEO auditor',
    },
    {
      id: 'calendar',
      label: 'Content Calendar',
      icon: Calendar,
      desc: 'Schedule posts & campaigns',
      badge: 'New',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      tooltip: 'Plan and organize publication timeline across channels',
    },
    {
      id: 'brand-dna',
      label: 'Brand Voice DNA',
      icon: Fingerprint,
      desc: 'Tone rules & custom terms',
      badge: brandDna.brandName ? 'Active' : 'Setup',
      badgeColor: brandDna.brandName ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400',
      tooltip: 'Calibrate your unique brand rules, banned words, and value prop',
    },
    {
      id: 'templates',
      label: 'AI Templates (50+)',
      icon: Grid,
      desc: 'Outbound, ads, SEO & social',
      tooltip: 'Pre-engineered frameworks for instant high-converting copy',
    },
    {
      id: 'free-tools',
      label: 'Free Viral Tools',
      icon: Gift,
      desc: 'Public tools & lead magnets',
      badge: 'Free',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
      tooltip: 'Quick headline analyzer, email subject lines, and viral hooks',
    },
    {
      id: 'billing',
      label: 'Billing & Payments',
      icon: CreditCard,
      desc: 'Paddle & Chapa Telebirr',
      tooltip: 'Manage subscriptions, invoices, and payment methods',
    },
    {
      id: 'help',
      label: 'Customer Help Desk',
      icon: Headphones,
      desc: 'Instant AI triage & tickets',
      tooltip: 'Submit support tickets and view documentation guides',
    },
  ];

  const devItem = {
    id: 'deploy',
    label: 'Developer & Deploy',
    icon: Code,
    desc: 'GitHub, Vercel & Gateways',
    tooltip: 'Sandbox credentials, gateway logs, and Vercel serverless deployment info',
  };

  const handleSelect = (id: string) => {
    onNavigate(id);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const content = (
    <div className="flex flex-col justify-between h-full p-4 space-y-6">
      <div className="space-y-5">
        {/* Mobile Header with close button */}
        {onCloseMobileMenu && (
          <div className="md:hidden flex items-center justify-between pb-3 border-b border-[#1E2A44]">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Navigation Menu</span>
            <button
              onClick={onCloseMobileMenu}
              className="min-tap p-1.5 rounded-lg bg-[#111A2E] text-[#9AA9C2] hover:text-white"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5 text-teal-400" />
            </button>
          </div>
        )}

        {/* Brand voice active pill */}
        <div 
          className="p-3 rounded-xl bg-[#111A2E] border border-[#1E2A44]"
          title="Active brand voice used across all generations"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#9AA9C2] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active Voice
            </span>
            <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
              {brandDna.brandName || 'Default'}
            </span>
          </div>
          <p className="text-xs text-[#E6EDF7] font-medium truncate">
            {brandDna.toneTag}
          </p>
        </div>

        {/* Main Navigation list */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-[#7C8BA6] uppercase tracking-wider px-3 mb-2">
            AI Content Suite
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                title={item.tooltip}
                aria-label={item.label}
                className={`min-tap w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all focus-visible:outline-teal-400 ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-[#9AA9C2] hover:text-[#E6EDF7] hover:bg-[#111A2E] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-teal-500 text-[#0A0F1D] shadow-sm'
                        : 'bg-[#111A2E] text-[#9AA9C2]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-[#E6EDF7]'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[#7C8BA6] truncate">{item.desc}</p>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ml-1.5 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Developer & Deploy Section (Moved from customer header) */}
        <div className="pt-2 border-t border-[#1E2A44] space-y-1">
          <p className="text-[11px] font-semibold text-[#7C8BA6] uppercase tracking-wider px-3 mb-1">
            Settings & Developer
          </p>
          <button
            onClick={() => handleSelect(devItem.id)}
            title={devItem.tooltip}
            aria-label={devItem.label}
            className={`min-tap w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all focus-visible:outline-teal-400 ${
              currentView === devItem.id
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-[#9AA9C2] hover:text-[#E6EDF7] hover:bg-[#111A2E] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  currentView === devItem.id
                    ? 'bg-teal-500 text-[#0A0F1D]'
                    : 'bg-[#111A2E] text-[#9AA9C2]'
                }`}
              >
                <Code className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${currentView === devItem.id ? 'text-white' : 'text-[#E6EDF7]'}`}>
                  {devItem.label}
                </p>
                <p className="text-[10px] text-[#7C8BA6] truncate">{devItem.desc}</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#111A2E] text-[#9AA9C2] border border-[#1E2A44]">
              Dev
            </span>
          </button>
        </div>
      </div>

      {/* Footer subscription card */}
      <div className="p-3.5 rounded-xl bg-[#111A2E] border border-[#1E2A44] space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E6EDF7]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="capitalize">{subscription.planName}</span>
          </div>
          <span className="text-[10px] bg-[#0A0F1D] text-[#9AA9C2] border border-[#1E2A44] px-2 py-0.5 rounded">
            {subscription.billingCycle}
          </span>
        </div>
        <p className="text-[11px] text-[#9AA9C2]">
          {(subscription.wordsLimit - subscription.wordsUsed).toLocaleString()} words remaining.
        </p>
        <button
          onClick={() => handleSelect('billing')}
          className="min-tap w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-[#0A0F1D] border border-[#1E2A44] hover:bg-[#1E2A44] text-teal-300 transition-colors focus-visible:outline-teal-400"
          aria-label="Manage Billing Plan"
        >
          <span>Manage Plan</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden under 768px) */}
      <aside className="w-64 border-r border-[#1E2A44] bg-[#0A0F1D] backdrop-blur-xl shrink-0 hidden md:flex flex-col">
        {content}
      </aside>

      {/* Mobile Drawer (under 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobileMenu}
            aria-hidden="true"
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-[#0A0F1D] border-r border-[#1E2A44] h-full overflow-y-auto shadow-2xl z-10 flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
