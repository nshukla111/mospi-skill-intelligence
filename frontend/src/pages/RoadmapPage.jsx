import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  BrainCircuit, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import PersonalizedRoadmap from '../components/PersonalizedRoadmap';
import KnowledgeTracingCard from '../components/KnowledgeTracingCard';
import QuizWidget from '../components/QuizWidget';
import { fetchEmployeeRoadmap, fetchStudentModel, generateQuizAPI } from '../services/api';

export default function RoadmapPage({ activeEmployee, onNavigateTab }) {
  const [roadmapData, setRoadmapData] = useState(null);
  const [studentModel, setStudentModel] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!activeEmployee) return;
    setLoading(true);
    try {
      const [rm, sm] = await Promise.all([
        fetchEmployeeRoadmap(activeEmployee.id),
        fetchStudentModel(activeEmployee.id)
      ]);
      setRoadmapData(rm);
      setStudentModel(sm);
    } catch (e) {
      console.error('Failed to load roadmap:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeEmployee]);

  const handleStartPractice = async (node) => {
    try {
      const quiz = await generateQuizAPI({
        employee_id: activeEmployee.id,
        domain: node.domain,
        skill_id: node.skill_id,
        num_questions: 3
      });
      setActiveQuiz(quiz);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (e) {
      console.error('Error starting roadmap quiz:', e);
    }
  };

  const handleQuizDone = async (result) => {
    await loadData();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-indigo-800/40 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-500 to-amber-500 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <GitBranch className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Knowledge Tracing & Prerequisite Roadmap
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Engine Protocol Section 6 & 7
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Event-driven Student Model & continuous 5-factor priority formula optimization
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Active Quiz Widget if started */}
      {activeQuiz && (
        <QuizWidget
          quizData={activeQuiz}
          employeeId={activeEmployee?.id || 1}
          onQuizCompleted={handleQuizDone}
          onClose={() => setActiveQuiz(null)}
        />
      )}

      {/* 2-Column: Left Visual Roadmap, Right Student Model Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Milestone Roadmap (8 cols) */}
        <div className="lg:col-span-8">
          <PersonalizedRoadmap 
            roadmapData={roadmapData} 
            onStartPractice={handleStartPractice} 
          />
        </div>

        {/* Right: Live Student Model Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <KnowledgeTracingCard studentModel={studentModel} />

          {/* Theoretical Model Reference Box (Built for Scale) */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Engine Architecture Notes
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Maintains the exact production pipeline: <strong>Event Collector → Student Data Lake → Knowledge Tracing → Prerequisite Graph → Roadmap Engine</strong>.
            </p>
            <div className="p-2 rounded-lg bg-slate-950 text-[10px] font-mono text-cyan-300 border border-slate-800">
              Priority = 0.3·Gap + 0.25·Imp + 0.2·Prereq + 0.15·Decay + 0.1·Conf
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
