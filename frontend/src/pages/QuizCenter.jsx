import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  UploadCloud, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Zap,
  Clock,
  Layers
} from 'lucide-react';
import QuizWidget from '../components/QuizWidget';
import { generateQuizAPI } from '../services/api';

export default function QuizCenter({ activeEmployee, onOpenUploadModal, onQuizCompletedGlobal }) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loadingDomain, setLoadingDomain] = useState(null);

  const domains = [
    {
      id: 'National Accounts',
      name: 'National Accounts & SNA 2008',
      desc: 'GDP, GVA, Supply-Use Tables (SUT), double deflation, FISIM allocation & sequence of accounts.',
      badge: 'Core ISS Competency',
      skills: ['SNA 2008 Methodology', 'Quarterly GVA Estimation']
    },
    {
      id: 'Price Statistics',
      name: 'Price Statistics & Index Numbers',
      desc: 'Consumer Price Index (CPI), Index of Industrial Production (IIP), Jevons elementary aggregates.',
      badge: 'CPD / ESD Benchmark',
      skills: ['CPI Formulation', 'IIP Weighting Diagrams']
    },
    {
      id: 'Survey Methodology',
      name: 'Sample Survey Design & CAPI Operations',
      desc: 'PLFS/NSS multi-stage stratified sampling, rotational panels, CAPI validation scripts & field audits.',
      badge: 'FOD Core Fieldwork',
      skills: ['PLFS Rotational Panels', 'CAPI Logical Consistency']
    },
    {
      id: 'Data Science & AI',
      name: 'Data Science, Python & AI Analytics',
      desc: 'Microdata wrangling in Python/R, big data record linkage (GSTN/MCA), and machine learning in official stats.',
      badge: 'Modernization Priority',
      skills: ['Python / Polars Vectorization', 'Probabilistic Record Linkage']
    },
    {
      id: 'Governance & Quality',
      name: 'National Quality Assurance Framework (NQAF)',
      desc: 'UN/MoSPI NQAF quality dimensions, SDMX metadata registries, and Collection of Statistics Act 2008.',
      badge: 'Statutory Standard',
      skills: ['NQAF Quality Principles', 'CSA 2008 Compliance']
    },
    {
      id: 'SDGs & Indicators',
      name: 'SDG National Indicator Framework (NIF)',
      desc: 'UN Sustainable Development Goals localization, multi-dimensional inequality metrics & state monitoring.',
      badge: 'Policy Tracking',
      skills: ['NIF Metadata & Baselines', 'Disaggregated Inequality Metrics']
    }
  ];

  const handleLaunchDomainQuiz = async (dom) => {
    setLoadingDomain(dom.id);
    try {
      const quiz = await generateQuizAPI({
        employee_id: activeEmployee?.id || 1,
        domain: dom.id,
        num_questions: 5
      });
      setActiveQuiz(quiz);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (e) {
      console.error('Quiz start error:', e);
    } finally {
      setLoadingDomain(null);
    }
  };

  const handleQuizFinish = (result) => {
    if (onQuizCompletedGlobal) {
      onQuizCompletedGlobal(result);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Assessment Hero Card */}
      <div className="glass-card rounded-3xl p-6 border border-cyan-800/40 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-500 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Award className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  AI Assessment & Competency Verification Center
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Instant Profile Refresh
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Verify knowledge, close active competency gaps, and dynamically upgrade your MoSPI proficiency levels
              </p>
            </div>
          </div>

          <button
            onClick={onOpenUploadModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Generate from Document</span>
          </button>
        </div>
      </div>

      {/* Active Quiz Runner */}
      {activeQuiz && (
        <QuizWidget
          quizData={activeQuiz}
          employeeId={activeEmployee?.id || 1}
          onQuizCompleted={handleQuizFinish}
          onClose={() => setActiveQuiz(null)}
        />
      )}

      {/* Domain Assessment Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Select Statistical Domain Assessment
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Timed 5-question multiple choice evaluations based on MoSPI official competency standards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((dom, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {dom.badge}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 5 Mins
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {dom.name}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {dom.desc}
                </p>

                <div className="pt-2 flex flex-wrap gap-1">
                  {dom.skills.map((sk, sidx) => (
                    <span key={sidx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      • {sk}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleLaunchDomainQuiz(dom)}
                disabled={loadingDomain === dom.id}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-cyan-600 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                {loadingDomain === dom.id ? 'Generating Quiz...' : 'Start Assessment'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
