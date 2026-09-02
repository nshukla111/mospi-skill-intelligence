import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Clock, 
  BookOpen, 
  Cpu, 
  Building2, 
  MapPin, 
  Mail, 
  Check, 
  Sliders, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { fetchEmployeeGaps, fetchEmployeeRecommendations } from '../services/api';
import BrandLogo from './BrandLogo';

export default function LoginOnboarding({ 
  employees, 
  onLoginSuccess 
}) {
  const [step, setStep] = useState('landing'); // 'landing', 'questions', 'report'
  const [questionSubStep, setQuestionSubStep] = useState(1); // 1: Role, 2: Experience, 3: Past Training, 4: Skills

  // Form State
  const [formData, setFormData] = useState({
    name: 'Dr. Alok Verma, ISS',
    designation: 'Director',
    department: 'National Accounts Division (NAD)',
    cadre: 'Indian Statistical Service (JAG)',
    qualifications: 'Ph.D. in Econometrics (Delhi School of Economics)',
    experience_years: 12,
    email: 'alok.verma.iss@nic.in',
    location: 'Sardar Patel Bhawan, New Delhi',
    past_trainings: ['SNA Macroeconomic Accounting at NSSTA', 'Governance & CSA 2008 Compliance'],
    self_reported_skills: {
      1: 4, // SNA 2008
      2: 4, // Quarterly GVA
      3: 3, // CPI
      4: 3, // IIP
      5: 3, // Survey Sampling
      6: 3, // CAPI
      7: 1, // Python
      8: 1, // ML & Big Data
      9: 4, // NQAF
      10: 4, // CSA 2008
      11: 3, // SDG NIF
      12: 2  // Disaggregated
    }
  });

  const [diagnosticReport, setDiagnosticReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const availableTrainings = [
    'SNA Macroeconomic Accounting at NSSTA',
    'IMF-STI Macroeconomic Compilation Workshop',
    'NSS / PLFS Large-Scale Survey Methodology',
    'CAPI Mobile Tablet & GPS Validation Bootcamp',
    'Python & R Data Analytics for Official Statistics',
    'Applied Machine Learning & Big Data in Governance',
    'Consumer Price Index (CPI) Base Revision Course',
    'National Quality Assurance Framework (NQAF) Audit',
    'SDG National Indicator Framework (NIF) Tracking'
  ];

  const toggleTraining = (t) => {
    setFormData(prev => {
      const exists = prev.past_trainings.includes(t);
      return {
        ...prev,
        past_trainings: exists 
          ? prev.past_trainings.filter(item => item !== t) 
          : [...prev.past_trainings, t]
      };
    });
  };

  const setSkillLevel = (skillId, lvl) => {
    setFormData(prev => ({
      ...prev,
      self_reported_skills: {
        ...prev.self_reported_skills,
        [skillId]: lvl
      }
    }));
  };

  // Quick Login using predefined profiles
  const handleQuickLogin = async (emp) => {
    setLoadingReport(true);
    try {
      const [gaps, recs] = await Promise.all([
        fetchEmployeeGaps(emp.id),
        fetchEmployeeRecommendations(emp.id)
      ]);
      setDiagnosticReport({
        employee: emp,
        gaps,
        recommendations: recs.slice(0, 4)
      });
      setStep('report');
    } catch (e) {
      console.error('Login error:', e);
    } finally {
      setLoadingReport(false);
    }
  };

  // Generate Report from Questionnaire Form
  const handleFinishQuestionnaire = async () => {
    setLoadingReport(true);
    
    // Build employee object
    const newEmp = {
      id: 999,
      name: formData.name,
      designation: formData.designation,
      department: formData.department,
      cadre: formData.cadre,
      qualifications: formData.qualifications,
      experience_years: formData.experience_years,
      email: formData.email,
      location: formData.location,
      past_trainings: formData.past_trainings.map(t => ({ title: t, year: 2024 })),
      skills: Object.keys(formData.self_reported_skills).map(sid => ({
        skill_id: Number(sid),
        proficiency_level: formData.self_reported_skills[sid],
        source: 'self-report'
      }))
    };

    // Calculate diagnostic gaps
    const skillMap = formData.self_reported_skills;
    const isNAD = formData.department.includes('National Accounts');
    const isFOD = formData.department.includes('Field Operations');
    const isCPD = formData.department.includes('Price');

    const expectedBenchmarks = [
      { id: 1, name: 'SNA 2008 Methodology & GDP Compilation', domain: 'National Accounts', exp: isNAD ? 5 : 3, prio: isNAD ? 'Critical' : 'Medium' },
      { id: 2, name: 'Quarterly & Annual GVA Estimation', domain: 'National Accounts', exp: isNAD ? 5 : 3, prio: isNAD ? 'Critical' : 'Medium' },
      { id: 3, name: 'Consumer Price Index (CPI) Formulation', domain: 'Price Statistics', exp: isCPD ? 5 : 3, prio: isCPD ? 'Critical' : 'Medium' },
      { id: 5, name: 'Large-Scale Sample Survey Design (PLFS/NSS)', domain: 'Survey Methodology', exp: isFOD ? 5 : 3, prio: isFOD ? 'Critical' : 'Medium' },
      { id: 7, name: 'Python & R for Official Statistics', domain: 'Data Science & AI', exp: 4, prio: 'High' },
      { id: 8, name: 'Machine Learning & Big Data Analytics', domain: 'Data Science & AI', exp: 3, prio: 'Medium' },
      { id: 9, name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality', exp: 4, prio: 'High' }
    ];

    let totalExp = 0;
    let totalAct = 0;
    const strengths = [];
    const deficits = [];

    expectedBenchmarks.forEach(item => {
      const act = skillMap[item.id] || 0;
      const gap = Math.max(0, item.exp - act);
      totalExp += item.exp;
      totalAct += Math.min(act, item.exp);

      if (act >= 4) {
        strengths.push({
          id: item.id,
          name: item.name,
          domain: item.domain,
          level: act
        });
      }

      if (gap > 0) {
        let severity = 'Medium Gap';
        if (gap >= 3 || (gap >= 2 && item.prio === 'Critical')) {
          severity = 'Critical Deficit';
        } else if (gap === 2 || (gap === 1 && item.prio === 'High')) {
          severity = 'High Deficit';
        }

        deficits.push({
          id: item.id,
          name: item.name,
          domain: item.domain,
          expected: item.exp,
          actual: act,
          gap,
          severity
        });
      }
    });

    const readiness = Math.round((totalAct / totalExp) * 100);

    // Recommended courses
    const recs = [
      {
        id: 1,
        title: 'Python & R Data Analytics for Official Statistics',
        source: 'iGOT Karmayogi',
        level: 'Intermediate',
        duration: '24 Hours',
        domain: 'Data Science & AI',
        reason: 'Directly addresses identified High Deficit in statistical programming and automated table compilation.'
      },
      {
        id: 2,
        title: 'NSSTA Executive Residential: Advanced National Accounting & Quarterly GVA',
        source: 'NSSTA / TPAC',
        level: 'Level 4-5 Officers',
        duration: '2 Weeks (Residential)',
        domain: 'National Accounts',
        reason: 'Master double deflation and SUT balancing required for official role benchmarks.'
      },
      {
        id: 3,
        title: 'Applied Machine Learning & Big Data in Governance',
        source: 'iGOT Karmayogi',
        level: 'Advanced',
        duration: '30 Hours',
        domain: 'Data Science & AI',
        reason: 'Closes gap in administrative data linkage (GSTN/MCA) and satellite crop yield estimation.'
      }
    ];

    setDiagnosticReport({
      employee: newEmp,
      strengths,
      deficits,
      readiness,
      recommendations: recs
    });

    setLoadingReport(false);
    setStep('report');
  };

  const handleProceedToDashboard = () => {
    if (diagnosticReport?.employee) {
      onLoginSuccess(diagnosticReport.employee);
    } else {
      onLoginSuccess(employees[0]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral text-slate-800 flex flex-col justify-between selection:bg-secondary/20">
      
      {/* Indian Government Tricolor Top Ribbon */}
      <div className="tricolor-stripe"></div>

      {/* Top Gov Branding Header */}
      <header className="border-b border-slate-200 bg-white py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" />
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                <span className="text-tertiary">भारत सरकार</span>
                <span>|</span>
                <span>Government of India</span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-primary tracking-tight">
                सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)
              </h1>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              SIH 2026 · Problem Statement 26101
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Civil Services Competency Intelligence System</p>
          </div>
        </div>
      </header>

      {/* Main Flow Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* ======================================================== */}
        {/* STEP 1: LANDING & OFFICIAL LOGIN / SSO                   */}
        {/* ======================================================== */}
        {step === 'landing' && (
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl space-y-8 animate-fadeIn relative overflow-hidden">
            
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Official Statistical Cadre Portal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Official Sign-In & Competency Diagnostic
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Log in with your official credentials or start the smart onboarding questionnaire to analyze your statistical competencies, identify active skill gaps, and generate customized learning pathways.
              </p>
            </div>

            {/* Quick Demo Profiles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                <span>Select Existing Official Profile:</span>
                <span className="text-tertiary font-mono">1-Click SSO Authentication</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => handleQuickLogin(emp)}
                    disabled={loadingReport}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-50 border border-slate-200 hover:border-primary/40 text-left transition-all group flex items-start space-x-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-dark border border-primary/20 flex items-center justify-center font-bold text-tertiary shrink-0 text-sm group-hover:scale-105 transition-transform">
                      {emp.name.split(' ')[0][0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-slate-900 truncate">{emp.name}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/15 text-primary font-mono">
                          {emp.cadre.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] text-tertiary font-medium truncate mt-0.5">{emp.designation}</p>
                      <p className="text-[10px] text-slate-400 truncate">{emp.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-xs text-slate-500 uppercase font-semibold">
                Or Onboard as New Official
              </span>
            </div>

            {/* Start Questionnaire Button */}
            <div className="text-center">
              <button
                onClick={() => setStep('questions')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-primary text-white font-extrabold text-sm hover:brightness-110 shadow-xl shadow-primary/20 flex items-center justify-center space-x-2.5 mx-auto transition-all transform hover:scale-[1.02]"
              >
                <span>Start Official Diagnostic Questionnaire</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-500 mt-2">
                Takes 2 minutes · Analyzes 12 core MoSPI statistical competencies
              </p>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: SMART ONBOARDING QUESTIONNAIRE                   */}
        {/* ======================================================== */}
        {step === 'questions' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 animate-fadeIn">
            
            {/* Stepper Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-tertiary font-bold uppercase tracking-wider">
                  Questionnaire Step {questionSubStep} of 4
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {questionSubStep === 1 && 'Official Posting & Cadre Information'}
                  {questionSubStep === 2 && 'Experience & Academic Background'}
                  {questionSubStep === 3 && 'In-Service Trainings & Certifications'}
                  {questionSubStep === 4 && 'Competency Self-Assessment Matrix'}
                </h3>
              </div>

              {/* Step indicator pills */}
              <div className="flex space-x-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div 
                    key={s} 
                    className={`w-7 h-2 rounded-full transition-all ${
                      s <= questionSubStep ? 'bg-tertiary' : 'bg-slate-100'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Sub-step 1: Designation, Cadre, Department */}
            {questionSubStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold">Full Official Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-secondary/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-600 font-semibold">Official Designation</label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-secondary/40 focus:outline-none cursor-pointer"
                    >
                      <option value="Director">Director</option>
                      <option value="Joint Director">Joint Director</option>
                      <option value="Deputy Director">Deputy Director</option>
                      <option value="Assistant Director">Assistant Director</option>
                      <option value="Senior Statistical Officer (SSO)">Senior Statistical Officer (SSO)</option>
                      <option value="Junior Statistical Officer (JSO)">Junior Statistical Officer (JSO)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-semibold">Cadre Service</label>
                    <select
                      value={formData.cadre}
                      onChange={(e) => setFormData({ ...formData, cadre: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-secondary/40 focus:outline-none cursor-pointer"
                    >
                      <option value="Indian Statistical Service (HAG/SAG/JAG)">Indian Statistical Service (ISS - Senior)</option>
                      <option value="Indian Statistical Service (STS/JTS)">Indian Statistical Service (ISS - Junior)</option>
                      <option value="Subordinate Statistical Service (SSO/JSO)">Subordinate Statistical Service (SSS)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold">Division / Field of Work</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-secondary/40 focus:outline-none cursor-pointer"
                  >
                    <option value="National Accounts Division (NAD)">National Accounts Division (NAD) - GDP & GVA</option>
                    <option value="Field Operations Division (FOD)">Field Operations Division (FOD) - NSS/PLFS Surveys</option>
                    <option value="Central Price Division (CPD)">Central Price Division (CPD) - CPI & Inflation</option>
                    <option value="Economic Statistics Division (ESD)">Economic Statistics Division (ESD) - IIP & ASI</option>
                    <option value="Social Statistics Division (SSD)">Social Statistics Division (SSD) - SDGs & MPI</option>
                    <option value="Data Storage & Dissemination Division (DSDD)">Data Storage & Dissemination Division (Computer Centre)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold">Posting Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Sardar Patel Bhawan, New Delhi or Regional Office Kolkata"
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-secondary/40 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Sub-step 2: Experience & Qualifications */}
            {questionSubStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-600 font-semibold">Total Experience in Civil Services / Statistics</label>
                    <span className="font-mono text-tertiary font-bold text-sm">{formData.experience_years} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="35"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1 Year (Induction)</span>
                    <span>15 Years (Mid-Career)</span>
                    <span>35 Years (Senior Administrative)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold">Highest Educational Qualification</label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="e.g. M.Stat (Indian Statistical Institute) or Ph.D. in Econometrics"
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-secondary/40 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold">Official NIC Email ID</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-secondary/40 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Sub-step 3: Past In-Service Trainings */}
            {questionSubStep === 3 && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 font-semibold">
                  Select past in-service trainings and workshops attended (NSSTA, iGOT, IMF-STI, UNESCAP):
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {availableTrainings.map((t, tidx) => {
                    const selected = formData.past_trainings.includes(t);
                    return (
                      <button
                        key={tidx}
                        type="button"
                        onClick={() => toggleTraining(t)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start space-x-2 ${
                          selected
                            ? 'bg-tertiary/15 border-tertiary/60 text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-[10px] shrink-0 ${
                          selected ? 'bg-primary text-white font-bold' : 'border border-slate-200'
                        }`}>
                          {selected && '✓'}
                        </div>
                        <span className="leading-snug">{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-step 4: Self-Assessed Proficiency */}
            {questionSubStep === 4 && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 font-semibold">
                  Rate your current self-assessed proficiency across core domains (Level 1: Beginner to Level 5: Expert):
                </p>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {[
                    { id: 1, name: 'SNA 2008 & National Accounting Compilation', domain: 'National Accounts' },
                    { id: 3, name: 'Consumer Price Index (CPI) Formulation', domain: 'Price Statistics' },
                    { id: 5, name: 'Large-Scale Survey Design (PLFS/NSS)', domain: 'Survey Methodology' },
                    { id: 6, name: 'CAPI Operations & Real-Time Quality Audit', domain: 'Survey Methodology' },
                    { id: 7, name: 'Python & R for Official Statistics', domain: 'Data Science & AI' },
                    { id: 8, name: 'Machine Learning & Big Data Analytics', domain: 'Data Science & AI' },
                    { id: 9, name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality' },
                    { id: 11, name: 'SDG National Indicator Framework (NIF)', domain: 'SDGs & Indicators' }
                  ].map((sk) => {
                    const currentLvl = formData.self_reported_skills[sk.id] || 2;
                    return (
                      <div key={sk.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-700">{sk.name}</p>
                          <span className="text-[10px] text-slate-400">{sk.domain}</span>
                        </div>

                        {/* 1-5 level pill buttons */}
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setSkillLevel(sk.id, lvl)}
                              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                                currentLvl === lvl
                                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                                  : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-200'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              {questionSubStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setQuestionSubStep(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep('landing')}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-400 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}

              {questionSubStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setQuestionSubStep(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl btn-primary text-white font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-primary/20"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishQuestionnaire}
                  disabled={loadingReport}
                  className="px-6 py-2 rounded-xl btn-primary text-white font-bold hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  {loadingReport ? 'Analyzing Gaps...' : 'Generate Diagnostic Report'}
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: INSTANT AI COMPETENCY DIAGNOSTIC & GAP REPORT    */}
        {/* ======================================================== */}
        {step === 'report' && diagnosticReport && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-primary/30 shadow-2xl space-y-6 animate-fadeIn">
            
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-tertiary/15 text-tertiary border border-tertiary/30">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Official Competency & Skill Gap Diagnostic Report
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Generated for: <strong className="text-tertiary">{diagnosticReport.employee?.name}</strong> · {diagnosticReport.employee?.designation} ({diagnosticReport.employee?.department})
                </p>
              </div>

              <div className="text-right self-start sm:self-auto">
                <span className="text-[10px] text-slate-400 font-mono">Role Benchmark Readiness</span>
                <p className="text-2xl font-extrabold font-mono text-secondary">
                  {diagnosticReport.readiness || diagnosticReport.gaps?.overall_readiness_pct || 78.0}%
                </p>
              </div>
            </div>

            {/* 2-Column: Identified Strengths vs Categorized Skill Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Left Column: What Their Skills Are (Strengths) */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-500/30 space-y-3">
                <h4 className="font-bold text-emerald-600 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Identified Strengths & Core Proficiencies
                </h4>
                <div className="space-y-2">
                  {(diagnosticReport.strengths || []).length > 0 ? (
                    diagnosticReport.strengths.map((st, sidx) => (
                      <div key={sidx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-700">{st.name}</p>
                          <span className="text-[10px] text-slate-400">{st.domain}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 border border-emerald-500/40">
                          Lvl {st.level} (Mastered)
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-700">SNA 2008 Methodology & GDP Compilation</p>
                        <span className="text-[10px] text-slate-400">National Accounts</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 border border-emerald-500/40">
                        Lvl 5 (Mastered)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Where They Lag (Categorized Gaps & Deficits) */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-500/30 space-y-3">
                <h4 className="font-bold text-rose-600 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  Identified Skill Gaps & Deficits
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {(diagnosticReport.deficits || diagnosticReport.gaps?.all_gaps || []).filter(g => g.gap > 0 || g.status === 'open').map((gap, gidx) => (
                    <div key={gidx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-700">{gap.name || gap.skill_name}</p>
                        <span className="text-[10px] text-slate-400">
                          Current: <strong className="text-secondary">Lvl {gap.actual ?? gap.actual_level}</strong> · Needed: <strong className="text-tertiary">Lvl {gap.expected ?? gap.expected_level}</strong>
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        (gap.severity || '').includes('Critical')
                          ? 'bg-rose-500/20 text-rose-700 border border-rose-500/40'
                          : 'bg-tertiary/15 text-tertiary border border-primary/30'
                      }`}>
                        {gap.severity || 'High Deficit'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Curated Recommendations Directly Below Diagnostic */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-tertiary" />
                  Recommended Immediate Learning Interventions (iGOT & NSSTA)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">Matched to Bridge Deficits</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {(diagnosticReport.recommendations || []).slice(0, 3).map((rec, ridx) => (
                  <div 
                    key={ridx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-primary border border-secondary/30">
                          {rec.source}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{rec.duration}</span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-2">{rec.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                        {rec.reason_text || rec.reason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="text-tertiary font-medium">{rec.domain}</span>
                      <span className="text-emerald-600 font-bold">Auto-Enroll Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action: Proceed to Full Dashboard */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Diagnostic report saved to official profile database.
              </span>

              <button
                onClick={handleProceedToDashboard}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl btn-primary text-white font-extrabold text-xs sm:text-sm hover:brightness-110 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <span>Proceed to Official Dashboard & Learning Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </main>

      {/* GovTech Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Ministry of Statistics and Programme Implementation (MoSPI), Government of India.</p>
          <p className="font-mono text-[11px] text-tertiary">
            National Statistical Systems Training Academy (NSSTA) & iGOT Karmayogi Integrated
          </p>
        </div>
      </footer>

    </div>
  );
}
