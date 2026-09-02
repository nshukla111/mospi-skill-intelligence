import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Zap, 
  UploadCloud, 
  ShieldCheck, 
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import GapChart from '../components/GapChart';
import RecommendationList from '../components/RecommendationList';
import QuizWidget from '../components/QuizWidget';
import { 
  fetchEmployeeGaps, 
  fetchEmployeeRecommendations, 
  fetchEmployeeProgress, 
  generateQuizAPI 
} from '../services/api';

export default function EmployeeDashboard({ 
  activeEmployee, 
  onOpenUploadModal, 
  onOpenProfileModal,
  onNavigateTab
}) {
  const [gapsData, setGapsData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const loadDashboardData = async () => {
    if (!activeEmployee) return;
    setLoading(true);
    try {
      const [gaps, recs, logs] = await Promise.all([
        fetchEmployeeGaps(activeEmployee.id),
        fetchEmployeeRecommendations(activeEmployee.id),
        fetchEmployeeProgress(activeEmployee.id)
      ]);
      setGapsData(gaps);
      setRecommendations(recs);
      setProgressLogs(logs);
    } catch (e) {
      console.error('Error loading dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveQuiz(null);
    loadDashboardData();
  }, [activeEmployee]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartQuizForSkill = async (gapItem) => {
    try {
      const quiz = await generateQuizAPI({
        employee_id: activeEmployee.id,
        domain: gapItem.domain,
        skill_id: gapItem.skill_id,
        num_questions: 3
      });
      setActiveQuiz(quiz);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (e) {
      console.error('Quiz start error:', e);
    }
  };

  const handleQuizCompleted = async (result) => {
    showToast(`Assessment submitted! Score: ${result.score_percentage}%. Profile recalculated in real time.`);
    // Refresh gaps & recommendations in real-time
    await loadDashboardData();
  };

  const handleEnrollSuccess = (item) => {
    showToast(`Successfully registered for ${item.title} (${item.source})!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Official Header Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Officer Details */}
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-500 p-0.5 shadow-xl flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300 font-bold text-xl">
                {activeEmployee?.name?.split(' ')[0]?.[0] || 'O'}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {activeEmployee?.name}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeEmployee?.cadre}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <strong className="text-cyan-400 font-semibold">{activeEmployee?.designation}</strong>
                <span>·</span>
                <span>{activeEmployee?.department}</span>
                <span>·</span>
                <span className="text-slate-400">{activeEmployee?.location}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenUploadModal}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Upload Document Quiz</span>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('quizzes')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>Take Quick Assessment</span>
            </button>

            <button
              onClick={loadDashboardData}
              title="Refresh AI Gap Analysis"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* 4 Stat KPI Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Cadre Readiness</span>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-2xl font-extrabold text-cyan-300 font-mono">
                {gapsData?.overall_readiness_pct || 80.0}%
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Optimal</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Open Competency Gaps</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-2xl font-extrabold text-amber-300 font-mono">
                {gapsData?.total_gaps_count ?? 3}
              </span>
              <span className="text-[10px] text-rose-400 font-semibold">
                {gapsData?.critical_gaps_count || 1} Critical
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Ranked Courses Matched</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-2xl font-extrabold text-indigo-300 font-mono">
                {recommendations?.length || 4}
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold">iGOT + TPAC</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">In-Service Credentials</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-2xl font-extrabold text-emerald-300 font-mono">
                {activeEmployee?.past_trainings?.length || 3}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">NSSTA Certified</span>
            </div>
          </div>

        </div>
      </div>

      {/* Active Quiz Runner Widget (if launched) */}
      {activeQuiz && (
        <QuizWidget
          quizData={activeQuiz}
          employeeId={activeEmployee?.id || 1}
          onQuizCompleted={handleQuizCompleted}
          onClose={() => setActiveQuiz(null)}
        />
      )}

      {/* 2-Column: Left Gap Analysis Radar, Right Recommendations */}
      <div className="grid grid-cols-1 gap-6">
        {/* Gap Chart with Radar & Bar Switcher */}
        <GapChart 
          gapsData={gapsData} 
          onStartQuizForSkill={handleStartQuizForSkill} 
        />

        {/* Ranked Recommendations List */}
        <RecommendationList 
          recommendations={recommendations} 
          onEnrollSuccess={handleEnrollSuccess} 
        />
      </div>

      {/* Activity Timeline */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Competency Verification & Activity Log
          </h3>
          <span className="text-xs text-slate-500 font-mono">Real-time Data Layer</span>
        </div>

        <div className="space-y-3">
          {progressLogs.map((log, lidx) => (
            <div key={lidx} className="flex items-start space-x-3 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{log.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{log.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
