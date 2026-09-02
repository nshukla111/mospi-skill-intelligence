import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Filter, 
  Layers, 
  TrendingDown, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Download
} from 'lucide-react';

export default function CompetencyHeatmap({ heatmapData }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('All');

  if (!heatmapData) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        <p>Loading Organization Competency Heatmap Matrix...</p>
      </div>
    );
  }

  const departments = heatmapData.departments || [];
  const domains = heatmapData.domains || [];
  const matrix = heatmapData.matrix || [];

  const filteredDomains = selectedDomainFilter === 'All' 
    ? domains 
    : domains.filter(d => d === selectedDomainFilter);

  const getCellData = (dept, dom) => {
    return matrix.find(m => m.department === dept && m.domain === dom) || {
      average_proficiency: 2.5,
      benchmark_proficiency: 4.0,
      gap_score: 1.5,
      officer_count: 18,
      status: 'Moderate'
    };
  };

  const getStatusColor = (status, prof) => {
    if (status === 'Strong' || prof >= 4.0) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
    }
    if (status === 'Moderate' || prof >= 3.0) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
    }
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-white">
              Organization-Wide Competency Heatmap Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Departmental proficiency benchmarks vs active field capabilities across ISS & SSS cadres
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDomainFilter}
              onChange={(e) => setSelectedDomainFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="All" className="bg-slate-900">All MoSPI Domains</option>
              {domains.map((dom, didx) => (
                <option key={didx} value={dom} className="bg-slate-900">{dom}</option>
              ))}
            </select>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-400 font-bold">
            Org Readiness: {heatmapData.org_readiness_avg}%
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-2 py-1 bg-slate-900/60 rounded-xl border border-slate-800/80 gap-2">
        <span className="font-medium text-slate-300">Competency Level Legend:</span>
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Strong (Proficiency ≥ 4.0)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Moderate Gap (3.0 - 3.9)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Severe Shortage (&lt; 3.0)
          </span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800">
              <th className="p-3 font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 min-w-[200px]">
                Division / Department
              </th>
              {filteredDomains.map((dom, didx) => (
                <th key={didx} className="p-3 font-bold text-slate-300 text-center min-w-[130px]">
                  {dom}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {departments.map((dept, deidx) => (
              <tr key={deidx} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 font-semibold text-slate-200 sticky left-0 bg-slate-950/90 z-10 border-r border-slate-800/60">
                  {dept}
                </td>
                {filteredDomains.map((dom, doidx) => {
                  const cell = getCellData(dept, dom);
                  return (
                    <td key={doidx} className="p-2 text-center">
                      <button
                        onClick={() => setSelectedCell(cell)}
                        className={`w-full py-2 px-2.5 rounded-xl border transition-all text-xs font-mono font-bold flex flex-col items-center justify-center ${getStatusColor(cell.status, cell.average_proficiency)}`}
                      >
                        <span className="text-sm font-extrabold">{cell.average_proficiency} / 5.0</span>
                        <span className="text-[10px] opacity-80 mt-0.5">
                          {cell.gap_score > 0 ? `-${cell.gap_score} gap` : 'Optimal'}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cell Drilldown Modal / Drawer */}
      {selectedCell && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">
                Matrix Cell Inspection: {selectedCell.department}
              </h4>
            </div>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Domain:</span>
              <p className="font-bold text-slate-200 mt-0.5">{selectedCell.domain}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Division Average:</span>
              <p className="font-bold text-cyan-400 mt-0.5">{selectedCell.average_proficiency} / 5.0</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Required Benchmark:</span>
              <p className="font-bold text-amber-400 mt-0.5">{selectedCell.benchmark_proficiency} / 5.0</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Active Officers:</span>
              <p className="font-bold text-slate-200 mt-0.5">{selectedCell.officer_count} Statistical Personnel</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300 flex items-center justify-between">
            <span>
              <strong>Training Intervention:</strong> Nominate division personnel for NSSTA cohort targeting {selectedCell.domain}.
            </span>
            <button 
              onClick={() => alert(`Nomination batch requested for ${selectedCell.department} in ${selectedCell.domain}`)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 ml-2"
            >
              Batch Nominate to NSSTA
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
