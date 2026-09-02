import React, { useState } from 'react';
import { 
  GitBranch, 
  Layers, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ArrowRight, 
  ChevronRight, 
  Info, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  BrainCircuit
} from 'lucide-react';

export default function PersonalizedRoadmap({ roadmapData, onStartPractice }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!roadmapData) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        <BrainCircuit className="w-8 h-8 mx-auto text-secondary animate-pulse mb-2" />
        <p>Computing Prerequisite Graph & 5-Factor Ranking...</p>
      </div>
    );
  }

  const milestones = roadmapData.milestones || [];
  const topAction = roadmapData.top_recommended_action;

  return (
    <div className="space-y-6">
      
      {/* Engine Overview Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-white to-secondary/10 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/30 flex items-center justify-center shrink-0">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              Knowledge Tracing & Prerequisite Roadmap Engine
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-mono font-bold">
                5-Factor Formula Active
              </span>
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Top Priority Next Action: <strong className="text-secondary">{topAction || 'Survey Sampling Design'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-400 font-mono">Topological Sorting:</span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-emerald-600 font-bold">
            Prerequisites Precedence Enforced
          </span>
        </div>
      </div>

      {/* 3 Structured Milestone Phases */}
      <div className="space-y-4">
        {milestones.map((phase, pidx) => (
          <div 
            key={pidx}
            className="glass-card rounded-2xl p-5 border border-slate-200 space-y-4"
          >
            {/* Phase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary font-mono font-bold text-xs flex items-center justify-center">
                    {pidx + 1}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{phase.phase}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{phase.objective}</p>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-3 text-xs self-start sm:self-auto min-w-[140px]">
                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-secondary to-primary h-full rounded-full transition-all"
                    style={{ width: `${phase.progress_pct}%` }}
                  ></div>
                </div>
                <span className="font-mono text-secondary font-bold">{phase.progress_pct}%</span>
              </div>
            </div>

            {/* Skills Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {phase.skills.map((node, nidx) => {
                const isMastered = node.status === 'Mastered';
                const isLocked = node.status === 'Locked';
                const isReady = node.status === 'Ready to Learn';

                return (
                  <div
                    key={nidx}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                      isMastered
                        ? 'bg-emerald-50 border-emerald-800/40 hover:border-emerald-500/60'
                        : isLocked
                        ? 'bg-slate-50 border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-200'
                        : 'bg-secondary/10 border-secondary/30 hover:border-secondary shadow-md shadow-secondary/10'
                    }`}
                  >
                    <div>
                      {/* Status Pill & Priority Score */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          isMastered
                            ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
                            : isLocked
                            ? 'bg-slate-100 text-slate-400 border border-slate-200'
                            : 'bg-secondary/15 text-secondary border border-secondary/30'
                        }`}>
                          {isMastered && <CheckCircle2 className="w-3 h-3" />}
                          {isLocked && <Lock className="w-3 h-3" />}
                          {isReady && <Unlock className="w-3 h-3" />}
                          {node.status}
                        </span>

                        <span className="text-[10px] font-mono font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/30">
                          Priority: {node.priority_score}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {node.skill_name}
                      </h5>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Current: <strong className="text-secondary">Lvl {node.current_level}</strong> / Target: <strong className="text-tertiary">Lvl {node.expected_level}</strong>
                      </p>
                    </div>

                    {/* Prerequisite Footnote */}
                    <div className="pt-2 border-t border-slate-200 text-[10px]">
                      {isLocked ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          Prereq Needed: {node.unmet_prerequisites[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center justify-between">
                          <span>Inspect 5-Factor Score</span>
                          <ChevronRight className="w-3 h-3 text-slate-500" />
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 5-Factor Formula Breakdown Inspector Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-card rounded-3xl border border-slate-200 shadow-2xl p-6 relative overflow-hidden space-y-4 animate-scaleUp">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-secondary font-bold uppercase tracking-wider">
                  5-Factor Recommendation Inspector
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-0.5">{selectedNode.skill_name}</h4>
                <p className="text-xs text-slate-400">{selectedNode.domain}</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-primary px-2.5 py-1 rounded-lg bg-slate-100"
              >
                Close
              </button>
            </div>

            {/* Overall Composite Score */}
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-primary font-semibold">Total Composite Priority Score:</span>
                <p className="text-2xl font-mono font-extrabold text-tertiary mt-0.5">
                  {selectedNode.priority_score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30">
                {selectedNode.status}
              </span>
            </div>

            {/* 5 Factors Table Breakdown */}
            <div className="space-y-2.5 text-xs">
              <h5 className="font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                Formula Factor Weights & Values (Page 7)
              </h5>

              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">1. Knowledge Gap ($w_1 = 0.30$)</span>
                  <span className="font-mono text-secondary font-bold">{selectedNode.factor_breakdown.knowledge_gap}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">2. Role Importance ($w_2 = 0.25$)</span>
                  <span className="font-mono text-secondary font-bold">{selectedNode.factor_breakdown.role_importance}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">3. Prerequisite Impact ($w_3 = 0.20$)</span>
                  <span className="font-mono text-secondary font-bold">{selectedNode.factor_breakdown.prerequisite_impact}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">4. Forgetting Risk ($w_4 = 0.15$)</span>
                  <span className="font-mono text-rose-600 font-bold">{selectedNode.factor_breakdown.forgetting_risk}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">5. Confidence ($w_5 = 0.10$)</span>
                  <span className="font-mono text-emerald-600 font-bold">{selectedNode.factor_breakdown.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Prerequisites Info */}
            {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                <span className="text-slate-400 text-[11px] font-semibold">Required Prerequisites in DAG:</span>
                <p className="text-slate-700 mt-0.5">
                  {selectedNode.prerequisites.join(' · ')}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedNode(null);
                  if (onStartPractice) onStartPractice(selectedNode);
                }}
                className="px-4 py-2 rounded-xl btn-primary text-white font-bold text-xs hover:brightness-110 flex items-center gap-1.5"
              >
                <span>Launch Targeted Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
