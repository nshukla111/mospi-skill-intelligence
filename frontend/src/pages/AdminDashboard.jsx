import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Download, 
  Building2, 
  GraduationCap, 
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import CompetencyHeatmap from '../components/CompetencyHeatmap';
import PredictiveAnalytics from '../components/PredictiveAnalytics';
import { fetchAdminHeatmap, fetchAdminPredictive } from '../services/api';

export default function AdminDashboard() {
  const [heatmapData, setHeatmapData] = useState(null);
  const [predictiveData, setPredictiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [hm, pred] = await Promise.all([
        fetchAdminHeatmap(),
        fetchAdminPredictive()
      ]);
      setHeatmapData(hm);
      setPredictiveData(pred);
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Division,Domain,Average_Proficiency,Benchmark,Gap,Status\n" +
      (heatmapData?.matrix || []).map(m => `"${m.department}","${m.domain}",${m.average_proficiency},${m.benchmark_proficiency},${m.gap_score},"${m.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "MoSPI_Competency_Heatmap_Report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Admin Executive Header */}
      <div className="glass-card rounded-3xl p-6 border border-primary/20 bg-gradient-to-br from-white via-neutral to-secondary/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-tertiary p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-tertiary">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Cadre & Executive Competency Center
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-tertiary/15 text-tertiary border border-tertiary/30">
                  MoSPI Training & HR
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Indian Statistical Service (ISS) & Subordinate Statistical Service (SSS) Capacity Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-tertiary" />
              <span>Export CSV Report</span>
            </button>
            <button
              onClick={loadAdminData}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-tertiary' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-200">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium">Total Statistical Cadre</span>
            <p className="text-2xl font-extrabold text-tertiary font-mono mt-1">750</p>
            <span className="text-[10px] text-slate-500">300 ISS · 450 SSS Officers</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium">Overall Org Readiness</span>
            <p className="text-2xl font-extrabold text-secondary font-mono mt-1">
              {heatmapData?.org_readiness_avg || 74.8}%
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold">+4.2% YoY Improvement</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium">Active NSSTA Cohorts</span>
            <p className="text-2xl font-extrabold text-primary font-mono mt-1">5</p>
            <span className="text-[10px] text-primary font-semibold">180 Officers Enrolled</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium">Critical Skill Alerts</span>
            <p className="text-2xl font-extrabold text-rose-700 font-mono mt-1">2</p>
            <span className="text-[10px] text-rose-600 font-semibold">ML & Scanner Pricing</span>
          </div>
        </div>

      </div>

      {/* Matrix Heatmap */}
      <CompetencyHeatmap heatmapData={heatmapData} />

      {/* Strategic Shortages Forecasting */}
      <PredictiveAnalytics predictiveData={predictiveData} />

    </div>
  );
}
