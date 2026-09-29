import React from 'react';
import { 
  Sparkles, 
  CreditCard, 
  LifeBuoy, 
  Zap,
  Globe2,
  Menu,
  X
} from 'lucide-react';
import { UserSubscription } from '../types';

interface NavbarProps {
  subscription: UserSubscription;
  onNavigate: (view: string) => void;
  currentView: string;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  subscription,
  onNavigate,
  currentView,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const percentUsed = Math.min(100, Math.round((subscription.wordsUsed / (subscription.wordsLimit || 1)) * 100));

  const handleNavClick = (view: string) => {
    onNavigate(view);
    if (mobileMenuOpen) {
      onToggleMobileMenu();
    }
  };

  return (
    <header className="h-16 border-b border-[#1E2A44] bg-[#0A0F1D]/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-4 lg:px-6 flex items-center justify-between">
      {/* Brand Logo & Mobile Toggle: Responsive and non-overlapping from 360px to 1440px */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden min-tap p-2 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-[#E6EDF7] hover:text-white focus-visible:outline-teal-400"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          title="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-teal-400" /> : <Menu className="w-5 h-5" />}
        </button>

        <button 
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group min-tap focus-visible:outline-teal-400 rounded-xl"
          aria-label="Quill AI Dashboard Home"
          title="Go to Dashboard"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-amber-400 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A0F1D]" />
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                Quill AI
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30 whitespace-nowrap">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#9AA9C2] hidden sm:block truncate">
              Content & Marketing Suite
            </p>
          </div>
        </button>
      </div>

      {/* Center real-time usage counter (Clean customer view) */}
      <div className="hidden lg:flex items-center gap-4">
        <div 
          className="flex items-center gap-2.5 text-xs bg-[#111A2E] border border-[#1E2A44] px-3.5 py-1.5 rounded-xl"
          title={`${subscription.wordsUsed.toLocaleString()} of ${subscription.wordsLimit.toLocaleString()} words utilized this cycle`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-[#9AA9C2]">Words Used:</span>
              <span className="font-semibold text-white">
                {subscription.wordsUsed.toLocaleString()} <span className="text-[#7C8BA6]">/ {subscription.wordsLimit.toLocaleString()}</span>
              </span>
            </div>
            <div className="w-32 h-1.5 bg-[#0A0F1D] rounded-full overflow-hidden mt-1 border border-[#1E2A44]">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  percentUsed > 85 ? 'bg-rose-500' : percentUsed > 60 ? 'bg-amber-400' : 'bg-teal-400'
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right actions: Clean, high contrast, 44px min tap targets */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => handleNavClick('free-tools')}
          className={`min-tap px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-teal-400 ${
            currentView === 'free-tools'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'text-[#E6EDF7] hover:text-white hover:bg-[#111A2E] border border-transparent'
          }`}
          aria-label="Navigate to Free Tools"
          title="Explore Free Viral Tools & Generators"
        >
          <Globe2 className="w-4 h-4 text-teal-400" />
          <span className="hidden sm:inline">Free Tools</span>
        </button>

        <button
          onClick={() => handleNavClick('help')}
          className={`min-tap p-2 rounded-xl text-xs font-medium transition-colors focus-visible:outline-teal-400 ${
            currentView === 'help'
              ? 'bg-[#111A2E] text-teal-300 border border-teal-500/40'
              : 'text-[#9AA9C2] hover:text-white hover:bg-[#111A2E]'
          }`}
          aria-label="Customer Help Desk & Support"
          title="Customer Help Center & Support"
        >
          <LifeBuoy className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleNavClick('billing')}
          className="min-tap flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold btn-primary shadow-sm hover:scale-[1.02] focus-visible:outline-teal-400"
          aria-label="Manage Billing and Subscription"
          title="Manage Subscription & Billing"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="capitalize">{subscription.plan === 'starter' ? 'Upgrade' : subscription.plan}</span>
        </button>
      </div>
    </header>
  );
};
