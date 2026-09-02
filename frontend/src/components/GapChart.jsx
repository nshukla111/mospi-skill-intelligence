import React, { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  SlidersHorizontal,
  Zap
} from 'lucide-react';

export default function GapChart({ gapsData, onStartQuizForSkill }) {
  const [viewType, setViewType] = useState('radar'); // 'radar' or 'bar'

  if (!gapsData) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        <Activity className="w-8 h-8 mx-auto text-secondary animate-spin mb-2" />
        <p>Loading AI Gap Analysis Engine...</p>
      </div>
    );
  }

  const radarData = gapsData.radar_data || [];
  const domainSummaries = gapsData.domain_summaries || [];
  const allGaps = gapsData.all_gaps || [];

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-slate-900">Competency Radar & Domain Gap Engine</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time comparison of known vs benchmark skill levels across MoSPI statistical domains
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs">
          <button
            onClick={() => setViewType('radar')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewType === 'radar'
                ? 'bg-secondary/15 text-secondary border border-secondary/30'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Radar Matrix
          </button>
          <button
            onClick={() => setViewType('bar')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewType === 'bar'
                ? 'bg-secondary/15 text-secondary border border-secondary/30'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Domain Comparison
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
        
        {/* Left: Recharts Visualizer */}
        <div className="lg:col-span-6 h-72 sm:h-80 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'radar' ? (
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#1F4E78', fontSize: 11 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 5]} 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                />
                <Radar
                  name="Benchmark Expected (1-5)"
                  dataKey="Expected"
                  stroke="#F2994A"
                  fill="#F2994A"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Known Proficiency (1-5)"
                  dataKey="Actual"
                  stroke="#209CD8"
                  fill="#209CD8"
                  fillOpacity={0.5}
                  strokeWidth={2.5}
                />
                <Legend 
                  verticalAlign="bottom" 
                  wrapperStyle={{ paddingTop: 10, fontSize: '11px' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#1E293B' }} 
                />
              </RadarChart>
            ) : (
              <BarChart data={radarData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                <XAxis dataKey="subject" tick={{ fill: '#1F4E78', fontSize: 10 }} />
                <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#1E293B' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Expected" name="Benchmark Expected" fill="#F2994A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" name="Known Proficiency" fill="#209CD8" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Right: Gaps Breakdown Cards */}
        <div className="lg:col-span-6 space-y-3 max-h-80 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1 pb-1">
            <span>Critical Deficits & Required Proficiencies</span>
            <span className="text-secondary font-mono">{gapsData.total_gaps_count} Open Gaps</span>
          </div>

          {allGaps.map((gap, idx) => {
            const isProficient = gap.status === 'closed' || gap.gap_value === 0;
            return (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border transition-all ${
                  gap.severity === 'Critical' 
                    ? 'bg-rose-50 border-rose-800/40 hover:border-rose-700/60' 
                    : gap.severity === 'High' 
                    ? 'bg-tertiary/10 border-primary/20 hover:border-tertiary/40' 
                    : isProficient
                    ? 'bg-emerald-50 border-emerald-800/40'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-700">
                        {gap.skill_name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        gap.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-700 border border-rose-500/40'
                          : gap.severity === 'High'
                          ? 'bg-tertiary/15 text-tertiary border border-primary/30'
                          : isProficient
                          ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
                          : 'bg-secondary/15 text-primary border border-secondary/30'
                      }`}>
                        {gap.severity}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                      <span>Domain: <strong className="text-slate-600">{gap.domain}</strong></span>
                      <span>·</span>
                      <span>Expected: <strong className="text-tertiary">Lvl {gap.expected_level}</strong></span>
                      <span>·</span>
                      <span>Current: <strong className="text-secondary">Lvl {gap.actual_level}</strong></span>
                    </div>

                    {/* Level Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isProficient ? 'bg-emerald-500' : 'bg-secondary'
                        }`}
                        style={{ width: `${(gap.actual_level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action: Quick Test Button */}
                  {!isProficient && (
                    <button
                      onClick={() => onStartQuizForSkill && onStartQuizForSkill(gap)}
                      className="text-[11px] px-2.5 py-1.5 rounded-lg bg-primary/30 text-primary border border-primary/30 hover:bg-primary hover:text-primary transition-all font-medium whitespace-nowrap self-center"
                    >
                      Test & Upgrade
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
