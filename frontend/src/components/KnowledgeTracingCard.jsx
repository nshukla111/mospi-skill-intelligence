import React from 'react';
import { 
  BrainCircuit, 
  Activity, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Flame, 
  RotateCw,
  Database
} from 'lucide-react';

export default function KnowledgeTracingCard({ studentModel }) {
  if (!studentModel) return null;

  const skills = studentModel.skills || [];

  return (
    <div className="glass-card rounded-2xl p-5 border border-indigo-900/50 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              Live Knowledge Tracing & Student Model State
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Continuous Stream
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Telemetry from Student Data Lake: Performance, Behaviour & Decay Metrics
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Database className="w-3 h-3 text-cyan-400" /> Data Lake: Active
          </span>
        </div>
      </div>

      {/* 3 Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Tracked Nodes</span>
          <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">{studentModel.active_skills_tracked}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Avg Retention (Decay)</span>
          <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{studentModel.average_retention_pct}%</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Model Confidence</span>
          <p className="text-lg font-bold text-indigo-400 font-mono mt-0.5">{studentModel.average_confidence_pct}%</p>
        </div>
      </div>

      {/* Skill Decay & Verification Matrix */}
      <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-xs">
        {skills.map((s, idx) => (
          <div 
            key={idx}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
          >
            <div className="flex-1 min-w-0 pr-2">
              <p className="font-semibold text-slate-200 truncate">{s.skill_name}</p>
              <span className="text-[10px] text-slate-400">
                Verified via {s.source} · {s.days_since_practice}d elapsed
              </span>
            </div>

            <div className="flex items-center space-x-2 shrink-0 font-mono text-[10px]">
              <span className={`px-2 py-0.5 rounded ${
                s.forgetting_risk_pct > 50 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {s.forgetting_risk_pct}% Decay Risk
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                Lvl {s.current_level}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
