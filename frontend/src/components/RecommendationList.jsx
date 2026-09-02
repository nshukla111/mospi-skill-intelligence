import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  GraduationCap, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function RecommendationList({ recommendations, onEnrollSuccess }) {
  const [enrolledMap, setEnrolledMap] = useState({});

  const handleEnroll = (item) => {
    setEnrolledMap(prev => ({ ...prev, [item.id]: true }));
    if (onEnrollSuccess) {
      onEnrollSuccess(item);
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        <Sparkles className="w-8 h-8 mx-auto text-amber-400 mb-2" />
        <p className="font-medium text-slate-300">All Core Competencies Met!</p>
        <p className="text-xs mt-1">No critical skill gaps found for current job role benchmark.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            AI-Ranked Course & In-Service Programme Recommendations
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by gap severity matching algorithm linking iGOT Karmayogi & NSSTA/TPAC training calendars
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
          {recommendations.length} Matched
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((item, idx) => {
          const isEnrolled = !!enrolledMap[item.id];
          const isTPAC = item.source.includes('NSSTA') || item.source.includes('TPAC');

          return (
            <div
              key={idx}
              className={`glass-card rounded-2xl p-4.5 border transition-all duration-200 flex flex-col justify-between ${
                isTPAC 
                  ? 'border-indigo-800/40 bg-gradient-to-br from-slate-900/90 to-indigo-950/30 hover:border-indigo-500/40' 
                  : 'border-slate-800 bg-slate-900/60 hover:border-cyan-500/40'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    isTPAC 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    <GraduationCap className="w-3 h-3" />
                    {item.source}
                  </span>

                  {/* Match Rank Score */}
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                    Match: {item.rank_score}%
                  </span>
                </div>

                {/* Course Title */}
                <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                {/* AI Rationale Box */}
                <div className="mt-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    <strong className="text-cyan-300">Why Recommended:</strong> {item.reason_text}
                  </p>
                </div>

                {/* Skills Covered Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.skills_addressed?.map((sk, sidx) => (
                    <span 
                      key={sidx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Meta & Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-500" />
                    {item.level}
                  </span>
                </div>

                <button
                  onClick={() => handleEnroll(item)}
                  disabled={isEnrolled}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
                    isEnrolled
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : isTPAC
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      {isTPAC ? 'Nominated' : 'Enrolled'}
                    </>
                  ) : (
                    <>
                      {isTPAC ? 'Request Nomination' : 'Enroll on iGOT'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
