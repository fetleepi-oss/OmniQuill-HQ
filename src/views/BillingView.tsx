import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Zap, 
  ExternalLink, 
  Sparkles, 
  Smartphone, 
  Globe, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { UserSubscription } from '../types';

interface BillingViewProps {
  subscription: UserSubscription;
  onUpdateSubscription: (updated: Partial<UserSubscription>) => void;
}

declare global {
  interface Window {
    Paddle?: any;
  }
}

export const BillingView: React.FC<BillingViewProps> = ({
  subscription,
  onUpdateSubscription,
}) => {
  const [currency, setCurrency] = useState<'USD' | 'ETB'>('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chapaModalOpen, setChapaModalOpen] = useState(false);
  const [paddleModalOpen, setPaddleModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<'pro' | 'enterprise'>('pro');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chapa Form State
  const [chapaPhone, setChapaPhone] = useState('0911223344');
  const [chapaMethod, setChapaMethod] = useState<'telebirr' | 'cbe' | 'card'>('telebirr');
  const [chapaSuccessRef, setChapaSuccessRef] = useState<string | null>(null);

  // Paddle Config State loaded securely from /api/payments/config
  const [isTestMode, setIsTestMode] = useState(true);
  const [paddleConfig, setPaddleConfig] = useState<{
    clientToken: string;
    productId: string;
    environment: string;
  }>({
    clientToken: '',
    productId: '',
    environment: 'sandbox',
  });

  // Chapa Config State loaded securely from /api/payments/config
  const [chapaConfig, setChapaConfig] = useState<{
    publicKey: string;
    isTest: boolean;
    supportedMethods: string[];
  }>({
    publicKey: '',
    isTest: true,
    supportedMethods: ['Telebirr', 'CBE Birr', 'Local Cards'],
  });

  const initPaddleJs = (token: string, env: string) => {
    if (typeof window === 'undefined') return;
    const paddle = window.Paddle;
    if (paddle && token) {
      try {
        paddle.Environment.set(env || 'sandbox');
        paddle.Initialize({
          token: token,
          eventCallback: (pEvent: any) => {
            console.log('Paddle Event:', pEvent);
            if (pEvent.name === 'checkout.completed' || pEvent.name === 'checkout.payment.successful') {
              onUpdateSubscription({
                plan: 'pro',
                planName: 'Pro',
                wordsLimit: 200000,
                gateway: 'paddle',
                txRef: pEvent.data?.transaction_id || `TX-PAD-${Date.now()}`,
              });
              setPaddleModalOpen(false);
            }
          }
        });
      } catch (e) {
        console.warn('Paddle initialization notice:', e);
      }
    }
  };

  useEffect(() => {
    // Fetch live backend payment keys from environment
    fetch('/api/payments/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.isTestMode !== undefined) {
          setIsTestMode(Boolean(data.isTestMode));
        }
        if (data.paddle) {
          setPaddleConfig(data.paddle);
          initPaddleJs(data.paddle.clientToken, data.paddle.environment);
        }
        if (data.chapa) {
          setChapaConfig(data.chapa);
        }
      })
      .catch((err) => console.warn('Payment config note:', err));

    // Fallback retry check in case Paddle CDN loads after initial render
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof window !== 'undefined' && window.Paddle) {
        initPaddleJs(paddleConfig.clientToken, paddleConfig.environment);
        clearInterval(interval);
      }
      if (attempts >= 10) clearInterval(interval);
    }, 400);

    // Check URL parameters for Chapa payment return callback
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isPaymentSuccess = urlParams.get('payment_success');
      const gateway = urlParams.get('gateway');
      const returnTxRef = urlParams.get('tx_ref');
      const returnPlan = (urlParams.get('plan') as 'starter' | 'pro' | 'enterprise') || 'pro';

      if (gateway === 'chapa' && returnTxRef) {
        setIsProcessing(true);
        fetch(`/api/payments/chapa/verify/${returnTxRef}?plan=${returnPlan}`)
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok || !data.verified) {
              throw new Error(data.error || 'Payment verification failed with Chapa');
            }
            onUpdateSubscription({
              plan: data.plan || returnPlan,
              planName: data.planName || (returnPlan === 'pro' ? 'Pro' : 'Business'),
              wordsLimit: data.wordsLimit || (returnPlan === 'pro' ? 200000 : 1000000),
              gateway: 'chapa',
              txRef: returnTxRef,
            });
            setChapaSuccessRef(returnTxRef);
            setChapaModalOpen(true);
            // Clean URL query parameters cleanly
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch((err: any) => {
            setErrorMessage(err.message || 'Payment verification with Chapa was unsuccessful.');
            setChapaModalOpen(true);
          })
          .finally(() => {
            setIsProcessing(false);
          });
      }
    }

    return () => clearInterval(interval);
  }, []);

  const openPaddleOverlay = (planId: 'pro' | 'enterprise') => {
    const targetPriceId = planId === 'enterprise' 
      ? (paddleConfig as any).priceIdEnterprise 
      : ((paddleConfig as any).priceIdPro || paddleConfig.productId);

    if (window.Paddle && window.Paddle.Checkout && targetPriceId) {
      try {
        window.Paddle.Checkout.open({
          settings: {
            displayMode: 'overlay',
            theme: 'dark',
            locale: 'en',
          },
          items: [
            {
              priceId: targetPriceId,
              quantity: 1,
            }
          ]
        });
      } catch (err) {
        console.log('Using integrated Paddle Sandbox Overlay modal:', err);
      }
    }
  };

  const handlePaddleCheckout = (planId: 'pro' | 'enterprise') => {
    setSelectedPlanForCheckout(planId);
    setPaddleModalOpen(true);
    openPaddleOverlay(planId);
  };

  const handleChapaCheckout = (planId: 'pro' | 'enterprise') => {
    setSelectedPlanForCheckout(planId);
    setChapaModalOpen(true);
    setChapaSuccessRef(null);
  };

  const [chapaEmail, setChapaEmail] = useState('dbiruk204@gmail.com');
  const [chapaName, setChapaName] = useState('Biruk');
  const [chapaPendingRef, setChapaPendingRef] = useState<string | null>(null);

  const executeChapaPayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    const amount = selectedPlanForCheckout === 'pro' ? 3800 : 7100;
    try {
      // 1. Call real backend initialize endpoint which calls api.chapa.co/v1/transaction/initialize with CHAPA_SECRET_KEY
      const response = await fetch('/api/payments/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'ETB',
          email: chapaEmail,
          firstName: chapaName,
          phone: chapaPhone,
          plan: selectedPlanForCheckout,
          planName: selectedPlanForCheckout === 'pro' ? 'Pro' : 'Business',
        }),
      });

      const data = await response.json();
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.error || 'Chapa payment initialization failed with real API');
      }

      if (data.checkoutUrl) {
        setChapaPendingRef(data.txRef);

        // If returned checkoutUrl is an external link (https://checkout.chapa.co/...), redirect user to complete payment
        if (data.checkoutUrl.startsWith('http://') || data.checkoutUrl.startsWith('https://')) {
          // Open or redirect to real Chapa hosted checkout page
          window.location.href = data.checkoutUrl;
          return;
        }

        // If demo mode was returned
        if (data.isDemoMode) {
          const verifyRes = await fetch(`/api/payments/chapa/verify/${data.txRef}?plan=${selectedPlanForCheckout}`);
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.verified) {
            onUpdateSubscription({
              plan: selectedPlanForCheckout,
              planName: selectedPlanForCheckout === 'pro' ? 'Pro' : 'Business',
              wordsLimit: selectedPlanForCheckout === 'pro' ? 200000 : 1000000,
              gateway: 'chapa',
              txRef: data.txRef,
            });
            setChapaSuccessRef(data.txRef);
          } else {
            throw new Error(verifyData.error || 'Verification check failed');
          }
        }
      }
    } catch (err: any) {
      console.error('Chapa checkout error:', err);
      setErrorMessage(err.message || 'Error communicating with Chapa API. Please verify network and secret key.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPendingChapa = async () => {
    if (!chapaPendingRef) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const verifyRes = await fetch(`/api/payments/chapa/verify/${chapaPendingRef}?plan=${selectedPlanForCheckout}`);
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.verified) {
        throw new Error(verifyData.error || 'Chapa has not confirmed payment for this reference yet.');
      }

      onUpdateSubscription({
        plan: verifyData.plan || selectedPlanForCheckout,
        planName: verifyData.planName || (selectedPlanForCheckout === 'pro' ? 'Pro' : 'Business'),
        wordsLimit: verifyData.wordsLimit || (selectedPlanForCheckout === 'pro' ? 200000 : 1000000),
        gateway: 'chapa',
        txRef: chapaPendingRef,
      });
      setChapaSuccessRef(chapaPendingRef);
      setChapaPendingRef(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment not yet confirmed by Chapa.');
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      desc: '1 workspace member with core AI creation.',
      priceUSD: 29,
      priceETB: 1600,
      words: '50,000 AI words / month',
      features: [
        '1 workspace member',
        'Unlimited chat & templates',
        'Document editor with AI edits',
        '1 Brand DNA profile',
      ],
      current: subscription.plan === 'starter',
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Most Popular',
      desc: 'Up to 5 members with full campaigns & knowledge base.',
      priceUSD: 69,
      priceETB: 3800,
      words: '200,000 AI words / month',
      features: [
        'Up to 5 members',
        'Everything in Starter',
        'Knowledge Base + Campaign Builder',
        'Version history & SEO Auditor',
        'Telebirr, CBE Birr & Card payments via Chapa',
        'Paddle Sandbox global billing overlay',
      ],
      current: subscription.plan === 'pro',
    },
    {
      id: 'enterprise',
      name: 'Business',
      badge: 'Enterprise Scale',
      desc: 'Unlimited members with autonomous workflows & priority SLA.',
      priceUSD: 129,
      priceETB: 7100,
      words: '1,000,000 AI words / month',
      features: [
        'Unlimited members',
        'Everything in Pro',
        'Workflow Automation & Scheduled Crons',
        'Priority 24/7 Support & Success Manager',
        'Audit Trail & Security log access',
        'Invoice billing & Ethiopian bank transfers',
      ],
      current: subscription.plan === 'enterprise',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Paddle & Chapa Gateways</span>
            </div>
            {isTestMode && (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold tracking-wide"
                title="Payments are executing against Paddle Sandbox & Chapa Test networks"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Test mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Plans & Subscriptions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Seamlessly pay with international cards via Paddle or Ethiopian Mobile Money (Telebirr / CBE Birr) via Chapa.
          </p>
        </div>

        {/* Currency & Billing Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                currency === 'USD' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>USD ($)</span>
            </button>
            <button
              onClick={() => setCurrency('ETB')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                currency === 'ETB' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3 text-emerald-400" />
              <span>ETB (ብር Telebirr)</span>
            </button>
          </div>

          {/* Billing Cycle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                billingCycle === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                billingCycle === 'yearly' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">-20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Gateway Verification Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Paddle Sandbox Active</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-medium">Ready</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Product ID: <code className="text-slate-300 font-mono text-[10px]">{paddleConfig.productId}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Chapa Telebirr & CBE Active</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-medium">Ready</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Public Key: <code className="text-slate-300 font-mono text-[10px]">{chapaConfig.publicKey ? `${chapaConfig.publicKey.slice(0, 14)}...` : 'Configured via Environment'}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isPro = plan.id === 'pro';
          const price = currency === 'USD' ? `$${plan.priceUSD}` : `${plan.priceETB.toLocaleString()} ብር`;

          return (
            <div
              key={plan.id}
              className={`p-6 sm:p-7 rounded-2xl flex flex-col justify-between relative transition-all ${
                isPro
                  ? 'bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-indigo-500/60 shadow-2xl shadow-indigo-500/10 scale-100 sm:scale-105 z-10'
                  : 'bg-slate-900/80 border border-slate-800'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  {plan.badge}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {plan.current && (
                    <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                      Current Plan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>

                <div className="mt-5 pb-5 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">{price}</span>
                    <span className="text-xs text-slate-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <span className="inline-block mt-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
                    {plan.words}
                  </span>
                </div>

                <div className="mt-5 space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Features Included:</p>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-800/80 space-y-2">
                {plan.current ? (
                  <div className="space-y-2">
                    <div className="w-full py-2.5 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      {subscription.cancelAtPeriodEnd ? 'Cancels at Period End' : 'Active Plan'}
                    </div>
                    {subscription.plan !== 'starter' && (
                      <div className="pt-1">
                        {subscription.cancelAtPeriodEnd ? (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await fetch('/api/payments/paddle/restore', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ subscriptionId: subscription.txRef }),
                                });
                                onUpdateSubscription({ cancelAtPeriodEnd: false });
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="w-full py-1.5 text-center text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/30 transition-colors"
                          >
                            Restore Active Subscription
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm('Cancel auto-renew? Your access will continue through the end of your billing cycle.')) {
                                try {
                                  await fetch('/api/payments/paddle/cancel', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ subscriptionId: subscription.txRef }),
                                  });
                                  onUpdateSubscription({ cancelAtPeriodEnd: true });
                                } catch (e) {
                                  console.error(e);
                                }
                              }
                            }}
                            className="w-full py-1.5 text-center text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            Cancel auto-renewal
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : plan.id === 'starter' ? (
                  <button
                    onClick={() => onUpdateSubscription({ plan: 'starter', planName: 'Starter Free', wordsLimit: 5000 })}
                    className="w-full py-2.5 text-center text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Switch to Free
                  </button>
                ) : (
                  <div className="space-y-2">
                    {/* Paddle International Card button */}
                    <button
                      onClick={() => handlePaddleCheckout(plan.id as any)}
                      className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay with Paddle (Cards/PayPal)</span>
                    </button>

                    {/* Chapa Ethiopian Mobile Money button */}
                    <button
                      onClick={() => handleChapaCheckout(plan.id as any)}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Pay via Telebirr / CBE (Chapa)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chapa Ethiopian Mobile Money Modal */}
      {chapaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  CH
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Chapa Mobile Money Checkout</h3>
                  <p className="text-[11px] text-slate-400">Telebirr / CBE Birr Test Gateway</p>
                </div>
              </div>
              <button
                onClick={() => setChapaModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
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

            {chapaSuccessRef ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Payment Verified via Chapa!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your {selectedPlanForCheckout === 'pro' ? 'Pro' : 'Enterprise'} plan is now active with 200,000 words.
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400 mt-2 bg-slate-950 p-2 rounded">
                    Ref: {chapaSuccessRef}
                  </p>
                </div>
                <button
                  onClick={() => setChapaModalOpen(false)}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Amount:</span>
                    <span className="text-base font-bold text-emerald-400">
                      {selectedPlanForCheckout === 'pro' ? '3,800 ETB' : '7,100 ETB'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Public Test Key:</span>
                    <code className="text-slate-300 font-mono text-[10px]">{chapaConfig.publicKey}</code>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Payment Method:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setChapaMethod('telebirr')}
                      className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition-all ${
                        chapaMethod === 'telebirr'
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Telebirr
                    </button>
                    <button
                      type="button"
                      onClick={() => setChapaMethod('cbe')}
                      className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition-all ${
                        chapaMethod === 'cbe'
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      CBE Birr
                    </button>
                    <button
                      type="button"
                      onClick={() => setChapaMethod('card')}
                      className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition-all ${
                        chapaMethod === 'card'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Local Cards
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Billing Email
                    </label>
                    <input
                      type="email"
                      value={chapaEmail}
                      onChange={(e) => setChapaEmail(e.target.value)}
                      placeholder="dbiruk204@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={chapaName}
                      onChange={(e) => setChapaName(e.target.value)}
                      placeholder="Biruk"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Phone Number (Ethiopian 09...)
                  </label>
                  <input
                    type="tel"
                    value={chapaPhone}
                    onChange={(e) => setChapaPhone(e.target.value)}
                    placeholder="0911223344"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Real Chapa API Connection: {chapaConfig.publicKey.slice(0, 18)}...</span>
                  </div>
                  <p>Calls Chapa's official API with your secret key to initiate your transaction.</p>
                </div>

                {chapaPendingRef && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Transaction Initiated:</span>
                      <code className="text-[10px] font-mono">{chapaPendingRef}</code>
                    </div>
                    <p className="text-[11px] text-amber-200/80">
                      If you have completed your payment in the Chapa portal, verify it below:
                    </p>
                    <button
                      type="button"
                      onClick={handleVerifyPendingChapa}
                      disabled={isProcessing}
                      className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Verify Payment with Chapa</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={executeChapaPayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Contacting Chapa API...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {selectedPlanForCheckout === 'pro' ? '3,800 ETB' : '7,100 ETB'} via Chapa Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paddle Sandbox Overlay Modal */}
      {paddleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                  PDL
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Paddle Sandbox Checkout</h3>
                  <p className="text-[11px] text-teal-400 font-medium">Sandbox Overlay Environment</p>
                </div>
              </div>
              <button
                onClick={() => setPaddleModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Plan:</span>
                  <span className="font-bold text-white uppercase">{selectedPlanForCheckout} PLAN</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Product ID:</span>
                  <code className="text-teal-400 font-mono text-[11px]">{paddleConfig.productId}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Client-Side Token:</span>
                  <code className="text-slate-300 font-mono text-[10px]">{paddleConfig.clientToken}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Environment:</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-semibold text-[10px] border border-teal-500/30">
                    Paddle Sandbox Overlay
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-300 font-semibold">Total Due:</span>
                  <span className="text-base font-bold text-white">
                    ${selectedPlanForCheckout === 'pro' ? 69 : 129}.00 USD
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/20 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Paddle Sandbox Overlay Active</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Paddle.js is initialized with client token <code className="text-slate-300">{paddleConfig.clientToken.slice(0, 12)}...</code>. You can open the native Paddle checkout overlay or simulate instant approval.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => openPaddleOverlay(selectedPlanForCheckout)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center justify-center gap-2 border border-teal-500/30 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Paddle Native Sandbox Overlay</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateSubscription({
                      plan: selectedPlanForCheckout,
                      planName: selectedPlanForCheckout === 'pro' ? 'Pro' : 'Business',
                      wordsLimit: selectedPlanForCheckout === 'pro' ? 200000 : 1000000,
                      gateway: 'paddle',
                      txRef: `TX-PDL-${Date.now()}`,
                    });
                    setPaddleModalOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Activate {selectedPlanForCheckout === 'pro' ? 'Pro' : 'Business'} Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
