import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Share2, 
  Send, 
  Layers, 
  Filter, 
  Globe2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { ScheduledPost } from '../types';

interface ContentCalendarViewProps {
  posts: ScheduledPost[];
  onAddPost: (post: ScheduledPost) => void;
  onDeletePost: (id: string) => void;
  onSelectPostContent: (content: string, title: string) => void;
}

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({
  posts,
  onAddPost,
  onDeletePost,
  onSelectPostContent,
}) => {
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState<'blog' | 'linkedin' | 'twitter' | 'newsletter' | 'ad'>('linkedin');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('10:00');
  const [newLanguage, setNewLanguage] = useState('English');
  const [newSnippet, setNewSnippet] = useState('');

  const channelIcons: Record<string, any> = {
    blog: FileText,
    linkedin: Share2,
    twitter: Share2,
    newsletter: Send,
    ad: Layers,
  };

  const channelColors: Record<string, string> = {
    blog: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    linkedin: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    twitter: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    newsletter: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    ad: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const filteredPosts = posts.filter(
    (p) => filterChannel === 'all' || p.channel === filterChannel
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSnippet.trim()) return;

    onAddPost({
      id: `SCHED-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      channel: newChannel,
      scheduledDate: newDate,
      scheduledTime: newTime,
      status: 'scheduled',
      contentSnippet: newSnippet,
      language: newLanguage,
    });

    setNewTitle('');
    setNewSnippet('');
    setShowAddModal(false);
  };

  // Group posts by date
  const groupedByDate: Record<string, ScheduledPost[]> = {};
  filteredPosts.forEach((post) => {
    if (!groupedByDate[post.scheduledDate]) {
      groupedByDate[post.scheduledDate] = [];
    }
    groupedByDate[post.scheduledDate].push(post);
  });

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-2 border border-teal-500/20">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Content Publishing Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Content Calendar & Schedule
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize and schedule your AI-generated campaigns and blog articles across dates and target languages.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-teal-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Content</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Filter Channel:</span>
          {['all', 'blog', 'linkedin', 'twitter', 'newsletter', 'ad'].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`capitalize px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterChannel === ch
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
        <span className="text-slate-400 text-[11px]">
          {filteredPosts.length} posts scheduled
        </span>
      </div>

      {/* Calendar List View */}
      {sortedDates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 space-y-3">
          <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No content scheduled yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Schedule a post from your Campaign Builder, Document Editor, or click the button below to add your first post.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Scheduled Post</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateStr) => {
            const dateObj = new Date(`${dateStr}T12:00:00`);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const items = groupedByDate[dateStr];

            return (
              <div key={dateStr} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className={`px-2.5 py-0.5 rounded-full ${isToday ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                    {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && <span className="text-teal-400 text-[11px] font-bold">TODAY</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {items.map((post) => {
                    const Icon = channelIcons[post.channel] || FileText;
                    return (
                      <div
                        key={post.id}
                        className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${channelColors[post.channel]}`}>
                              <Icon className="w-3 h-3 inline mr-1 -mt-0.5" />
                              {post.channel}
                            </span>
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.scheduledTime}
                              </span>
                              <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                <Globe2 className="w-2.5 h-2.5 text-teal-400" />
                                {post.language}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {post.contentSnippet}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                          <button
                            onClick={() => onSelectPostContent(post.contentSnippet, post.title)}
                            className="text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-1 text-[11px]"
                          >
                            <span>Open in Editor</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeletePost(post.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Remove from calendar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Scheduled Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-teal-400" />
                <span>Schedule New Content</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Post Title / Topic</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 5 AI workflows for content marketers"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="linkedin">LinkedIn Post</option>
                    <option value="blog">SEO Blog Post</option>
                    <option value="twitter">Twitter / 𝕏 Thread</option>
                    <option value="newsletter">Email Newsletter</option>
                    <option value="ad">Paid Ad Copy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Language</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Amharic">Amharic (አማርኛ)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="Portuguese">Portuguese (Português)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Content Draft / Notes</label>
                <textarea
                  rows={4}
                  required
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="Paste or write the text to be scheduled..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md shadow-teal-600/30"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
