import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  HelpCircle, 
  Search, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  CreditCard, 
  Layers, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { SupportTicket, AuditLogItem } from '../types';

export const HelpCenterView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New ticket state
  const [ticketEmail, setTicketEmail] = useState('user@marketingteam.com');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Brand DNA');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const faqs = [
    {
      q: "How do I set up my Brand DNA?",
      category: "brand",
      a: "Go to Brand DNA in the sidebar, paste a writing sample or a URL, and click Analyze — Quill extracts your tone, audience, and vocabulary automatically. You can also fill in fields manually, including banned/preferred words.",
    },
    {
      q: "Why isn't my document editor selection showing AI options?",
      category: "editor",
      a: "Highlight text first (click and drag, or double-click a word), then use the toolbar buttons — Improve, Shorten, Expand, Humanize, etc. only apply to a selection, not the whole document.",
    },
    {
      q: "How does the Knowledge Base affect my answers?",
      category: "brand",
      a: "Toggle 'Knowledge Base: on' in Chat to have Quill search your uploaded documents/URLs before answering. It's off by default so regular chats aren't slowed down by irrelevant retrieval.",
    },
    {
      q: "I canceled by accident — can I undo it?",
      category: "billing",
      a: "Yes. Go to Billing — if a cancellation is pending, you'll see a 'Restore subscription' button. No new charge, and nothing was lost in the meantime.",
    },
    {
      q: "What happens to my data if I cancel?",
      category: "billing",
      a: "Nothing changes until your current paid period ends. You keep full access — documents, Brand DNA, Knowledge Base — right up to that date.",
    },
    {
      q: "Does Quill support Ethiopian payment methods?",
      category: "billing",
      a: "Yes — Chapa support covers Telebirr, CBE Birr, and other local banks, alongside card payments via Paddle.",
    },
    {
      q: "How do I invite my team?",
      category: "brand",
      a: "Team Workspace → Invite a teammate. They'll get an email with a join link. You can set their role (Member or Admin) at invite time or change it later.",
    },
    {
      q: "Can I export my data?",
      category: "editor",
      a: "Yes — Settings → Export my data downloads everything (documents, chats, comments, consent history) as JSON.",
    },
  ];

  useEffect(() => {
    fetch('/api/support/tickets')
      .then((res) => res.json())
      .then((data) => {
        if (data.tickets) setTickets(data.tickets);
        if (data.auditTrail) setAuditLogs(data.auditTrail);
      })
      .catch((err) => console.warn('Could not load tickets:', err));
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ticketEmail,
          subject: ticketSubject,
          category: ticketCategory,
          message: ticketMessage,
          priority: ticketPriority,
        }),
      });

      if (!response.ok) throw new Error('Failed to create support ticket');
      const newTicket: SupportTicket = await response.json();
      setTickets([newTicket, ...tickets]);
      setShowNewTicketModal(false);
      setTicketSubject('');
      setTicketMessage('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error creating ticket. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesQuery = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 Customer Success & Help Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Help Center & Support Desk
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search our knowledge base or submit a support request. Tickets are dispatched to your team inbox while our automated AI Customer Success agent triages solutions instantly.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Submit Support Request</span>
        </button>
      </div>

      {/* Search & Knowledge Base Filter */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs, tutorials, billing with Telebirr/Paddle, Brand DNA..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setSelectedCategory('brand')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedCategory === 'brand' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Brand DNA & Voice
          </button>
          <button
            onClick={() => setSelectedCategory('campaigns')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedCategory === 'campaigns' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Campaign Builder
          </button>
          <button
            onClick={() => setSelectedCategory('billing')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedCategory === 'billing' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Billing & Gateways
          </button>
          <button
            onClick={() => setSelectedCategory('editor')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedCategory === 'editor' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Editor & Auditor
          </button>
        </div>

        {/* FAQs Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Tickets Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Support Tickets</h3>
          </div>
          <span className="text-xs text-slate-400">
            {tickets.length} tickets recorded
          </span>
        </div>

        {tickets.length > 0 ? (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">{t.id}</span>
                    <span className="text-xs font-semibold text-white">{t.subject}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {t.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      t.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                    <span className="text-slate-500 text-[11px]">{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{t.message}</p>

                {t.aiSuggestedResolution && (
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-200 mt-2 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Customer Success Agent Triage:
                    </span>
                    <p className="text-xs text-slate-300 italic">{t.aiSuggestedResolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">No support tickets currently open.</p>
        )}
      </div>

      {/* Live System & Audit Trail */}
      {auditLogs.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Customer Audit & Verification Log</h3>
          </div>
          <div className="space-y-2">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px] font-mono">{log.id}</span>
                  <span className="text-slate-200 font-medium">{log.action}</span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">- {log.details}</span>
                </div>
                <span className="text-slate-500 text-[10px] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-base text-white">Create Support Request</h3>
              </div>
              <button
                onClick={() => setShowNewTicketModal(false)}
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

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Brand DNA">Brand DNA Voice</option>
                    <option value="Campaign Builder">Campaign Builder</option>
                    <option value="Paddle Payment">Paddle Billing</option>
                    <option value="Chapa Telebirr">Chapa / Telebirr</option>
                    <option value="Document Editor">Document Editor</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Need assistance with Brand DNA tone calibration"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting to AI Agent...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
