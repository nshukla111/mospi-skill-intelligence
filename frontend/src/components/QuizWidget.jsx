import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  RotateCcw,
  TrendingUp,
  FileText,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitQuizAPI } from '../services/api';

export default function QuizWidget({ 
  quizData, 
  employeeId, 
  onQuizCompleted, 
  onClose 
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const questions = quizData?.questions || [];
  const currentQ = questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (result || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleSelect = (optionId) => {
    if (result) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id.toString()]: optionId
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await submitQuizAPI(quizData.quiz_id, {
        employee_id: employeeId || 1,
        answers: selectedAnswers
      });
      setResult(res);

      if (res.passed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (onQuizCompleted) {
        onQuizCompleted(res);
      }
    } catch (e) {
      console.error('Quiz submit failed:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!quizData || questions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        <p>No active assessment questions found.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-700/80 shadow-2xl relative overflow-hidden">
      
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-white">{quizData.title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Domain: <strong className="text-slate-300">{quizData.domain}</strong> · Passing Grade: 60%
          </p>
        </div>

        {/* Timer & Question Counter */}
        <div className="flex items-center space-x-3 text-xs">
          {!result && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono font-bold">
            Q {currentIdx + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Assessment Body */}
      {!result ? (
        <div className="mt-6 space-y-6">
          
          {/* Question Stem */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-[11px] text-cyan-400 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Testing: {currentQ.skill_name}</span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id.toString()] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/80 text-white ring-1 ring-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs uppercase shrink-0 transition-colors ${
                    isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {opt.id}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Nav & Submit Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                Next Question <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                {submitting ? 'Evaluating via AI...' : 'Submit Assessment'}
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Result Scorecard & Upgrades */
        <div className="mt-6 space-y-6">
          
          {/* Score Header */}
          <div className={`p-5 rounded-2xl border text-center relative overflow-hidden ${
            result.passed
              ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/40'
              : 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-500/40'
          }`}>
            <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 bg-slate-900 border border-slate-700 shadow-xl">
              {result.passed ? (
                <Award className="w-8 h-8 text-emerald-400" />
              ) : (
                <HelpCircle className="w-8 h-8 text-amber-400" />
              )}
            </div>

            <h4 className="text-xl font-bold text-white">
              {result.passed ? 'Assessment Passed!' : 'Assessment Completed'}
            </h4>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <span className="text-3xl font-mono font-extrabold text-cyan-400">
                {result.score_percentage}%
              </span>
              <span className="text-xs text-slate-400">
                ({result.correct_count} of {result.total_questions} Correct)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
              {result.message}
            </p>
          </div>

          {/* Upgraded Competencies Box */}
          {result.skills_upgraded && result.skills_upgraded.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Competencies Upgraded in Official MoSPI Profile:</span>
              </div>
              <div className="space-y-2">
                {result.skills_upgraded.map((up, uidx) => (
                  <div key={uidx} className="flex items-center justify-between text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-200 font-medium">{up.skill_name}</span>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-slate-400 line-through">Lvl {up.old_level}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                        Lvl {up.new_level} (Mastered)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Detailed Question Explanations
            </h5>
            {result.detailed_feedback?.map((fb, fidx) => (
              <div 
                key={fidx}
                className={`p-3.5 rounded-xl border text-xs ${
                  fb.is_correct
                    ? 'bg-slate-900/50 border-emerald-800/40'
                    : 'bg-slate-900/50 border-rose-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-200">
                    {fidx + 1}. {fb.question}
                  </p>
                  {fb.is_correct ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-4">
                  <span>Your choice: <strong className="text-slate-200 uppercase">{fb.user_answer || 'None'}</strong></span>
                  <span>Correct: <strong className="text-emerald-400 uppercase">{fb.correct_answer}</strong></span>
                </div>

                <p className="mt-2 text-[11px] text-slate-300 p-2 rounded bg-slate-950 border border-slate-800/80 leading-relaxed">
                  <strong className="text-cyan-400">Explanation:</strong> {fb.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Action to Return / Retest */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              onClick={() => {
                setResult(null);
                setCurrentIdx(0);
                setSelectedAnswers({});
                setTimeLeft(300);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Test
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Back to Dashboard
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
