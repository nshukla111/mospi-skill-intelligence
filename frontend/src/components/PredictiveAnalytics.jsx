import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function PredictiveAnalytics({ predictiveData }) {
  if (!predictiveData) return null;

  const shortages = predictiveData.shortages || [];
  const cadreDist = predictiveData.cadre_distribution || [];

  const chartData = shortages.map(s => ({
    name: s.skill_name.length > 20 ? s.skill_name.substring(0, 20) + '...' : s.skill_name,
    'Current Capacity': s.current_capacity,
    'Projected 2027 Demand': s.projected_demand_2027
  }));

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-white">
              Strategic Predictive Skill-Shortage Forecasting (2026 - 2028)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine Learning forecasted capacity deficits driven by AI statistical modernisation, census digitisation, and cadre transitions
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
          Horizon: 2026 - 2028
        </span>
      </div>

      {/* Chart Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Current Capacity" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Projected 2027 Demand" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cadre Readiness Progress */}
        <div className="lg:col-span-5 space-y-3.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Cadre Capacity Distribution
          </h4>
          {cadreDist.map((c, cidx) => (
            <div key={cidx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{c.cadre}</span>
                <span className="font-mono text-cyan-400 font-bold">{c.readiness_pct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                  style={{ width: `${c.readiness_pct}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400">{c.officers} Active Officers</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shortages Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {shortages.map((item, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{item.skill_name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                item.urgency === 'Critical' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {item.urgency} ({item.shortage_gap_pct}% Deficit)
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-cyan-400">Action Plan:</strong> {item.recommended_action}
            </p>

            <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
              <span>Current Trained: <strong className="text-cyan-300">{item.current_capacity}</strong></span>
              <span>·</span>
              <span>2027 Need: <strong className="text-rose-400">{item.projected_demand_2027}</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
