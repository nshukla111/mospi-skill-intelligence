import React from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  ChevronDown, 
  UserCircle2, 
  Cpu,
  GitBranch,
  LogOut
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  employees, 
  activeEmployee, 
  setActiveEmployee,
  onOpenProfileModal,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 shadow-sm">
      <div className="tricolor-stripe"></div>

      <div className="bg-primary text-white px-4 py-1 text-[11px] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-tertiary">भारत सरकार</span>
            <span className="text-white/40">|</span>
            <span>Government of India</span>
            <span className="text-white/40">·</span>
            <span className="hidden sm:inline text-white/90">सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="bg-white/15 text-white px-2 py-0.5 rounded border border-white/20 font-mono font-bold">
            SIH2026 · PS 26101
          </span>
          <span className="text-secondary-light flex items-center gap-1 font-mono hidden md:inline-flex font-bold">
            <Cpu className="w-3 h-3" /> NIC / MoSPI AI Core
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.5rem]">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <BrandLogo size="md" />
          </div>

          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'nav-tab-active'
                  : 'text-slate-600 hover:text-primary hover:bg-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Official Dashboard
            </button>

            <button
              onClick={() => setCurrentTab('roadmap')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'roadmap'
                  ? 'nav-tab-active'
                  : 'text-slate-600 hover:text-primary hover:bg-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              Learning Roadmap
            </button>

            <button
              onClick={() => setCurrentTab('quizzes')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'quizzes'
                  ? 'nav-tab-active'
                  : 'text-slate-600 hover:text-primary hover:bg-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Assessment Center
            </button>

            <button
              onClick={() => setCurrentTab('courses')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'courses'
                  ? 'nav-tab-active'
                  : 'text-slate-600 hover:text-primary hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              iGOT & NSSTA
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'nav-tab-active'
                  : 'text-slate-600 hover:text-primary hover:bg-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Cadre Heatmap
            </button>
          </nav>

          <div className="flex items-center space-x-2.5">
            <div className="relative group hidden sm:block">
              <select
                value={activeEmployee?.id || 1}
                onChange={(e) => {
                  const emp = employees.find(em => em.id === Number(e.target.value));
                  if (emp) setActiveEmployee(emp);
                }}
                className="bg-white border border-slate-200 text-slate-700 text-xs rounded-full px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-secondary/40 appearance-none cursor-pointer max-w-[160px] truncate font-medium"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} className="bg-white text-slate-800">
                    {emp.name} ({emp.designation.split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={onOpenProfileModal}
              title="Official Profile & Credentials"
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/40 transition-colors"
            >
              <UserCircle2 className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              title="Re-run Diagnostic or Switch Official"
              className="px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout / Re-Onboard</span>
            </button>
          </div>

        </div>
      </div>

      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-2 text-xs">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'dashboard' ? 'text-primary font-bold' : 'text-slate-500'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentTab('roadmap')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'roadmap' ? 'text-primary font-bold' : 'text-slate-500'
          }`}
        >
          Roadmap
        </button>
        <button
          onClick={() => setCurrentTab('quizzes')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'quizzes' ? 'text-primary font-bold' : 'text-slate-500'
          }`}
        >
          Assessments
        </button>
        <button
          onClick={() => setCurrentTab('courses')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'courses' ? 'text-primary font-bold' : 'text-slate-500'
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setCurrentTab('admin')}
          className={`px-2 py-1 rounded-md font-medium ${
            currentTab === 'admin' ? 'text-tertiary font-bold' : 'text-slate-500'
          }`}
        >
          Heatmap
        </button>
      </div>
    </header>
  );
}
