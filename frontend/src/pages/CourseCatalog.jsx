import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  GraduationCap, 
  Clock, 
  Layers, 
  Calendar, 
  ExternalLink, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CourseCatalog({ onEnrollSuccess }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [enrolledMap, setEnrolledMap] = useState({});

  const allItems = [
    // Courses
    {
      id: 101,
      title: 'Advanced SNA 2008 & Supply-Use Tables Compilation',
      source: 'iGOT Karmayogi',
      domain: 'National Accounts',
      level: 'Advanced',
      duration: '18 Hours (Self-paced)',
      badge: 'Certified National Accountant',
      mode: 'Self-paced Online',
      next_cohort: 'Immediate Access',
      description: 'Comprehensive masterclass on SUT balancing, sequence of accounts, GFCF estimation, and FISIM allocation per UN SNA 2008 standards.',
      skills: ['SNA 2008 Methodology', 'GDP & GVA Formulation']
    },
    {
      id: 102,
      title: 'Python & R Data Analytics for Official Statistics',
      source: 'iGOT Karmayogi',
      domain: 'Data Science & AI',
      level: 'Intermediate',
      duration: '24 Hours (Self-paced)',
      badge: 'Statistical Programmer',
      mode: 'Self-paced Online',
      next_cohort: 'Immediate Access',
      description: 'Hands-on training using pandas, numpy, and R tidyverse for automated data validation, tabular compilation, and non-sampling outlier detection.',
      skills: ['Python Data Wrangling', 'Microdata Aggregation']
    },
    {
      id: 103,
      title: 'Applied Machine Learning & Big Data in Governance',
      source: 'iGOT Karmayogi',
      domain: 'Data Science & AI',
      level: 'Advanced',
      duration: '30 Hours (Self-paced)',
      badge: 'AI in Official Stats Specialist',
      mode: 'Self-paced Online',
      next_cohort: 'Immediate Access',
      description: 'Building predictive time-series models, geospatial satellite image processing for crop yield estimation, and GSTN administrative data linkage.',
      skills: ['Machine Learning', 'Record Linkage']
    },
    {
      id: 104,
      title: 'Consumer Price Index (CPI) Revision & Basket Methodology',
      source: 'iGOT Karmayogi',
      domain: 'Price Statistics',
      level: 'Intermediate',
      duration: '12 Hours (Self-paced)',
      badge: 'Price Index Specialist',
      mode: 'Self-paced Online',
      next_cohort: 'Immediate Access',
      description: 'Price index mathematics, elementary aggregate Jevons formulas, web scraping for digital marketplaces, and outlet sampling.',
      skills: ['CPI Weighting', 'Jevons Aggregate Formula']
    },
    {
      id: 105,
      title: 'National Quality Assurance Framework (NQAF) Implementation',
      source: 'iGOT Karmayogi',
      domain: 'Governance & Quality',
      level: 'Beginner to Intermediate',
      duration: '10 Hours (Self-paced)',
      badge: 'NQAF Quality Assessor',
      mode: 'Self-paced Online',
      next_cohort: 'Immediate Access',
      description: 'Standard operating procedures for official data quality audits, SDMX metadata registries, and Collection of Statistics Act 2008 rules.',
      skills: ['NQAF Principles', 'SDMX Registries']
    },
    {
      id: 106,
      title: 'SDG National Indicator Framework (NIF) & Dashboarding',
      source: 'iGOT Karmayogi',
      domain: 'SDGs & Indicators',
      level: 'Intermediate',
      duration: '14 Hours (Self-paced)',
      badge: 'SDG Metric Lead',
      mode: 'Self-paced Online',
      next_cohort: 'Immediate Access',
      description: 'UN SDG Goal-to-Indicator alignment, localization methodologies, multi-dimensional inequality tracking, and State ranking indexes.',
      skills: ['SDG Localization', 'Alkire-Foster MPI']
    },
    // Programmes
    {
      id: 201,
      title: 'NSSTA Executive Residential: Advanced National Accounting & Quarterly GVA',
      source: 'NSSTA / TPAC',
      domain: 'National Accounts',
      level: 'Level 4-5 Officers',
      duration: '2 Weeks (Residential)',
      badge: 'NSSTA Fellowship',
      mode: 'In-Person (Greater Noida Campus)',
      next_cohort: '15 Oct 2026',
      description: 'Intensive in-person residency covering double deflation, institutional sector accounts, informal sector GVA modeling, and live SUT balancing workshops.',
      skills: ['Double Deflation', 'Institutional Sector Accounts']
    },
    {
      id: 202,
      title: 'NSSTA Hands-On Bootcamp: AI, NLP & Satellite Analytics for Official Surveys',
      source: 'NSSTA / TPAC',
      domain: 'Data Science & AI',
      level: 'All Cadres (ISS & SSS)',
      duration: '5 Days (Hybrid)',
      badge: 'NSSTA Fellowship',
      mode: 'Hybrid (3 Days Virtual + 2 Days Lab)',
      next_cohort: '02 Nov 2026',
      description: 'High-impact lab working directly with High-Performance Computing (HPC) nodes on geospatial data processing, automated OCR for economic census, and ML imputation.',
      skills: ['HPC Analytics', 'Satellite Remote Sensing']
    },
    {
      id: 203,
      title: 'TPAC Field Leadership: CAPI Workflow Engineering & Real-Time Data Auditing',
      source: 'NSSTA / TPAC',
      domain: 'Survey Methodology',
      level: 'Field Supervisory Officers',
      duration: '1 Week (Zonal)',
      badge: 'Field Operations Specialist',
      mode: 'In-Person Field Simulation',
      next_cohort: '20 Nov 2026',
      description: 'Practical drill on CAPI validation scripts, GPS geofencing verification, supervisor dashboard telemetry, and field error resolution protocols.',
      skills: ['CAPI Operations', 'GPS Field Audit']
    }
  ];

  const filtered = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'All' || item.source.includes(selectedSource);
    const matchesDomain = selectedDomain === 'All' || item.domain === selectedDomain;
    return matchesSearch && matchesSource && matchesDomain;
  });

  const handleEnroll = (item) => {
    setEnrolledMap(prev => ({ ...prev, [item.id]: true }));
    if (onEnrollSuccess) onEnrollSuccess(item);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-500 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <BookOpen className="w-7 h-7" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                iGOT Karmayogi & NSSTA / TPAC Training Repository
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Official MoSPI capacity building catalog offering online micro-credentials and executive residential fellowships
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by keyword, methodology, or skill..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            >
              <option value="All">All Ingestion Sources</option>
              <option value="iGOT">iGOT Karmayogi (Online)</option>
              <option value="NSSTA">NSSTA / TPAC (Residency/Lab)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            >
              <option value="All">All MoSPI Domains</option>
              <option value="National Accounts">National Accounts</option>
              <option value="Price Statistics">Price Statistics</option>
              <option value="Survey Methodology">Survey Methodology</option>
              <option value="Data Science & AI">Data Science & AI</option>
              <option value="Governance & Quality">Governance & Quality</option>
              <option value="SDGs & Indicators">SDGs & Indicators</option>
            </select>
          </div>

        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => {
          const isEnrolled = !!enrolledMap[item.id];
          const isTPAC = item.source.includes('NSSTA') || item.source.includes('TPAC');

          return (
            <div
              key={idx}
              className={`glass-card rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-all duration-200 ${
                isTPAC
                  ? 'border-indigo-800/40 bg-gradient-to-br from-slate-900 to-indigo-950/30 hover:border-indigo-500/50'
                  : 'border-slate-800 hover:border-cyan-500/50'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isTPAC 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {item.source}
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono font-semibold">
                    {item.level}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white line-clamp-2">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.skills?.map((sk, sidx) => (
                    <span key={sidx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {item.duration}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Calendar className="w-3 h-3" /> Cohort: {item.next_cohort}
                  </p>
                </div>

                <button
                  onClick={() => handleEnroll(item)}
                  disabled={isEnrolled}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    isEnrolled
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : isTPAC
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      {isTPAC ? 'Nominated' : 'Enrolled'}
                    </>
                  ) : (
                    <>
                      {isTPAC ? 'Nominate' : 'Enroll'}
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
