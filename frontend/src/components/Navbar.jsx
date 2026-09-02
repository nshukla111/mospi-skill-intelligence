import React from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  ChevronDown, 
  Bell, 
  UserCircle2, 
  Building2,
  Cpu,
  GitBranch,
  LogOut
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  activeRole, 
  setActiveRole, 
  employees, 
  activeEmployee, 
  setActiveEmployee,
  onOpenProfileModal,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-xl">
      {/* Top Gov Tricolor Stripe */}
      <div className="tricolor-stripe"></div>

      {/* Top Gov Bar */}
      <div className="bg-slate-950/95 border-b border-slate-800 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-medium text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-amber-400">भारत सरकार</span>
            <span className="text-slate-600">|</span>
            <span>Government of India</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 hidden sm:inline">सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded border border-blue-800/50 font-mono font-bold">
            SIH2026 · PS 26101
          </span>
          <span className="text-emerald-400 flex items-center gap-1 font-mono hidden md:inline-flex font-bold">
            <Cpu className="w-3 h-3" /> NIC / MoSPI AI Core
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-500/20 to-amber-700/20 border border-amber-500/40 p-1 shadow-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  MoSPI <span className="text-amber-400">SkillIntel</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Official
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                National Statistical Competency & AI Gap Analytics Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Official Dashboard
            </button>

            <button
              onClick={() => setCurrentTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'roadmap'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              Learning Roadmap
            </button>

            <button
              onClick={() => setCurrentTab('quizzes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'quizzes'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Assessment Center
            </button>

            <button
              onClick={() => setCurrentTab('courses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'courses'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              iGOT & NSSTA
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Cadre Heatmap
            </button>
          </nav>

          {/* Right Action: Officer Selector, Profile, & Logout */}
          <div className="flex items-center space-x-2.5">
            
            {/* Officer Profile Selector */}
            <div className="relative group hidden sm:block">
              <select
                value={activeEmployee?.id || 1}
                onChange={(e) => {
                  const emp = employees.find(em => em.id === Number(e.target.value));
                  if (emp) setActiveEmployee(emp);
                }}
                className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none cursor-pointer max-w-[160px] truncate font-medium"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} className="bg-slate-900 text-white">
                    {emp.name} ({emp.designation.split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Profile Detail Button */}
            <button
              onClick={onOpenProfileModal}
              title="Official Profile & Credentials"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
            >
              <UserCircle2 className="w-4 h-4" />
            </button>

            {/* Log Out / Switch Onboarding Button */}
            <button
              onClick={onLogout}
              title="Re-run Diagnostic or Switch Official"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-rose-400 hover:bg-rose-950/40 hover:border-rose-500/50 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout / Re-Onboard</span>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/90 py-2 px-2 text-xs">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentTab('roadmap')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'roadmap' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          Roadmap
        </button>
        <button
          onClick={() => setCurrentTab('quizzes')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'quizzes' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          Assessments
        </button>
        <button
          onClick={() => setCurrentTab('courses')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'courses' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setCurrentTab('admin')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'admin' ? 'text-orange-400 font-bold' : 'text-slate-400'
          }`}
        >
          Heatmap
        </button>
      </div>
    </header>
  );
}
