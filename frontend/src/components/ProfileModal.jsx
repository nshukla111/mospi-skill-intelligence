import React from 'react';
import { 
  X, 
  User, 
  Building2, 
  MapPin, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Award, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function ProfileModal({ employee, onClose }) {
  if (!employee) return null;

  const pastTrainings = employee.past_trainings || [];
  const skills = employee.skills || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-card rounded-3xl border border-slate-700 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-bold text-lg">
                {employee.name.split(' ')[0][0] || 'O'}
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {employee.name}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {employee.cadre || 'ISS Cadre'}
                </span>
              </h3>
              <p className="text-xs text-cyan-400 font-medium">{employee.designation} · {employee.department}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-5 py-4 text-xs pr-1">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2.5">
              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400">Qualifications:</span>
                <p className="font-semibold text-slate-200">{employee.qualifications || 'M.Sc. Statistics'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2.5">
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400">Experience:</span>
                <p className="font-semibold text-slate-200">{employee.experience_years || 10} Years in Civil Services</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400">Official Email:</span>
                <p className="font-semibold text-slate-200">{employee.email || 'officer.iss@nic.in'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400">Posting Location:</span>
                <p className="font-semibold text-slate-200">{employee.location || 'New Delhi'}</p>
              </div>
            </div>
          </div>

          {/* Past In-Service Trainings */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Completed In-Service Trainings & Certifications
            </h4>
            <div className="space-y-1.5">
              {pastTrainings.map((t, tidx) => (
                <div key={tidx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{t.title}</span>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {t.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Competency Profile */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Assessed Competency Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {skills.map((s, sidx) => (
                <div key={sidx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200 truncate max-w-[190px]">{s.skill_name || `Skill #${s.skill_id}`}</p>
                    <span className="text-[10px] text-slate-400">{s.domain} · Verified by {s.source}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Lvl {s.proficiency_level} / 5
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-800"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
