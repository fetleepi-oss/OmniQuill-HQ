import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Fingerprint, 
  Layers, 
  FileEdit, 
  Calendar,
  X
} from 'lucide-react';
import { OnboardingStep } from '../types';

interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  onNavigate: (view: string) => void;
  onDismiss: () => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  steps,
  onNavigate,
  onDismiss,
}) => {
  const completedCount = steps.filter((s) => s.completed).length;
  const percentComplete = Math.round((completedCount / steps.length) * 100);

  if (completedCount === steps.length) {
    return null; // All done
  }

  const iconMap: Record<string, any> = {
    'brand-dna': Fingerprint,
    'campaigns': Layers,
    'editor': FileEdit,
    'calendar': Calendar,
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 shadow-xl relative overflow-hidden animate-fade-in">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[11px] font-semibold mb-1 border border-teal-500/20">
            <Sparkles className="w-3 h-3" />
            <span>Getting Started Checklist</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Welcome to Quill AI — Complete Your Workspace Setup
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Follow these 4 simple steps to calibrate your brand voice and publish your first multi-channel content.
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg transition-colors"
          title="Dismiss for now"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Setup Progress:</span>
          <span className="text-teal-400 font-bold">{completedCount} of {steps.length} steps completed ({percentComplete}%)</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => {
          const Icon = iconMap[step.targetView] || Sparkles;
          return (
            <div
              key={step.id}
              onClick={() => onNavigate(step.targetView)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                step.completed
                  ? 'bg-slate-900/40 border-slate-800 opacity-75'
                  : 'bg-slate-950/80 border-slate-800 hover:border-teal-500/40 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <h4 className={`text-xs font-bold ${step.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-400 pt-1">
                <span>{step.completed ? 'Review' : step.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
