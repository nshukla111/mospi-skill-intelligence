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
        <BrainCircuit className="w-8 h-8 mx-auto text-cyan-400 animate-pulse mb-2" />
        <p>Computing Prerequisite Graph & 5-Factor Ranking...</p>
      </div>
    );
  }

  const milestones = roadmapData.milestones || [];
  const topAction = roadmapData.top_recommended_action;

  return (
    <div className="space-y-6">
      
      {/* Engine Overview Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              Knowledge Tracing & Prerequisite Roadmap Engine
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                5-Factor Formula Active
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Top Priority Next Action: <strong className="text-cyan-400">{topAction || 'Survey Sampling Design'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-400 font-mono">Topological Sorting:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-bold">
            Prerequisites Precedence Enforced
          </span>
        </div>
      </div>

      {/* 3 Structured Milestone Phases */}
      <div className="space-y-4">
        {milestones.map((phase, pidx) => (
          <div 
            key={pidx}
            className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4"
          >
            {/* Phase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                    {pidx + 1}
                  </span>
                  <h4 className="font-bold text-sm text-white">{phase.phase}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{phase.objective}</p>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-3 text-xs self-start sm:self-auto min-w-[140px]">
                <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${phase.progress_pct}%` }}
                  ></div>
                </div>
                <span className="font-mono text-cyan-400 font-bold">{phase.progress_pct}%</span>
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
                        ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-500/60'
                        : isLocked
                        ? 'bg-slate-900/40 border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
                        : 'bg-cyan-950/20 border-cyan-500/40 hover:border-cyan-400 shadow-md shadow-cyan-500/5'
                    }`}
                  >
                    <div>
                      {/* Status Pill & Priority Score */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          isMastered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isLocked
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {isMastered && <CheckCircle2 className="w-3 h-3" />}
                          {isLocked && <Lock className="w-3 h-3" />}
                          {isReady && <Unlock className="w-3 h-3" />}
                          {node.status}
                        </span>

                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/50">
                          Priority: {node.priority_score}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-white line-clamp-1">
                        {node.skill_name}
                      </h5>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Current: <strong className="text-cyan-400">Lvl {node.current_level}</strong> / Target: <strong className="text-amber-400">Lvl {node.expected_level}</strong>
                      </p>
                    </div>

                    {/* Prerequisite Footnote */}
                    <div className="pt-2 border-t border-slate-800/60 text-[10px]">
                      {isLocked ? (
                        <span className="text-rose-400 flex items-center gap-1">
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-card rounded-3xl border border-slate-700 shadow-2xl p-6 relative overflow-hidden space-y-4 animate-scaleUp">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  5-Factor Recommendation Inspector
                </span>
                <h4 className="font-bold text-base text-white mt-0.5">{selectedNode.skill_name}</h4>
                <p className="text-xs text-slate-400">{selectedNode.domain}</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            {/* Overall Composite Score */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-300 font-semibold">Total Composite Priority Score:</span>
                <p className="text-2xl font-mono font-extrabold text-amber-400 mt-0.5">
                  {selectedNode.priority_score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {selectedNode.status}
              </span>
            </div>

            {/* 5 Factors Table Breakdown */}
            <div className="space-y-2.5 text-xs">
              <h5 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider">
                Formula Factor Weights & Values (Page 7)
              </h5>

              <div className="space-y-2 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">1. Knowledge Gap ($w_1 = 0.30$)</span>
                  <span className="font-mono text-cyan-400 font-bold">{selectedNode.factor_breakdown.knowledge_gap}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">2. Role Importance ($w_2 = 0.25$)</span>
                  <span className="font-mono text-cyan-400 font-bold">{selectedNode.factor_breakdown.role_importance}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">3. Prerequisite Impact ($w_3 = 0.20$)</span>
                  <span className="font-mono text-cyan-400 font-bold">{selectedNode.factor_breakdown.prerequisite_impact}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">4. Forgetting Risk ($w_4 = 0.15$)</span>
                  <span className="font-mono text-rose-400 font-bold">{selectedNode.factor_breakdown.forgetting_risk}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">5. Confidence ($w_5 = 0.10$)</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedNode.factor_breakdown.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Prerequisites Info */}
            {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px] font-semibold">Required Prerequisites in DAG:</span>
                <p className="text-slate-200 mt-0.5">
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
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs hover:brightness-110 flex items-center gap-1.5"
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
