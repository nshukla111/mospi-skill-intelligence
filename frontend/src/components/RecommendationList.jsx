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
        <Sparkles className="w-8 h-8 mx-auto text-tertiary mb-2" />
        <p className="font-medium text-slate-600">All Core Competencies Met!</p>
        <p className="text-xs mt-1">No critical skill gaps found for current job role benchmark.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
              <Sparkles className="w-4 h-4" />
            </span>
            AI-Ranked Course & In-Service Programme Recommendations
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by gap severity matching algorithm linking iGOT Karmayogi & NSSTA/TPAC training calendars
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
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
                  ? 'border-primary/20 bg-gradient-to-br from-white to-primary/10 hover:border-primary/30' 
                  : 'border-slate-200 bg-slate-50 hover:border-secondary/40'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    isTPAC 
                      ? 'bg-primary/10 text-primary border border-primary/30' 
                      : 'bg-secondary/15 text-secondary border border-secondary/30'
                  }`}>
                    <GraduationCap className="w-3 h-3" />
                    {item.source}
                  </span>

                  {/* Match Rank Score */}
                  <span className="text-[11px] font-mono font-bold text-tertiary bg-tertiary/15 px-2 py-0.5 rounded border border-tertiary/30">
                    Match: {item.rank_score}%
                  </span>
                </div>

                {/* Course Title */}
                <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                {/* AI Rationale Box */}
                <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    <strong className="text-secondary">Why Recommended:</strong> {item.reason_text}
                  </p>
                </div>

                {/* Skills Covered Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.skills_addressed?.map((sk, sidx) => (
                    <span 
                      key={sidx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Meta & Action */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
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
                      ? 'bg-emerald-600/30 text-emerald-700 border border-emerald-500/40 cursor-default'
                      : isTPAC
                      ? 'bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20'
                      : 'bg-secondary hover:bg-primary-dark text-white shadow-md shadow-secondary/20'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
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
