// API Client for MoSPI Skill Intelligence Platform
// Supports direct FastAPI backend with seamless local fallback

const API_BASE = '/api';

const fallbackEmployees = [
  {
    id: 1,
    name: 'Dr. Rajesh Sharma, ISS',
    designation: 'Director',
    department: 'National Accounts Division (NAD)',
    cadre: 'Indian Statistical Service (2012 Batch)',
    qualifications: 'Ph.D. in Econometrics (DSE), M.Sc. Statistics',
    experience_years: 14,
    email: 'rajesh.sharma.iss@nic.in',
    location: 'Sardar Patel Bhawan, New Delhi',
    past_trainings: [
      { title: 'Macroeconomic Accounting at IMF-STI Singapore', year: 2018 },
      { title: 'SNA Induction at NSSTA', year: 2012 },
      { title: 'Governance & CSA 2008 Compliance', year: 2021 }
    ],
    skills: [
      { skill_id: 1, skill_name: 'SNA 2008 Methodology & GDP Compilation', domain: 'National Accounts', proficiency_level: 5, source: 'self-report' },
      { skill_id: 2, skill_name: 'Quarterly & Annual GVA Estimation', domain: 'National Accounts', proficiency_level: 4, source: 'self-report' },
      { skill_id: 7, skill_name: 'Python & R for Official Statistics', domain: 'Data Science & AI', proficiency_level: 2, source: 'quiz' },
      { skill_id: 8, skill_name: 'Machine Learning & Big Data Analytics', domain: 'Data Science & AI', proficiency_level: 1, source: 'inferred' },
      { skill_id: 9, skill_name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality', proficiency_level: 4, source: 'self-report' },
      { skill_id: 10, skill_name: 'Official Statistics Acts & Legal Compliance', domain: 'Governance & Quality', proficiency_level: 4, source: 'self-report' }
    ]
  },
  {
    id: 2,
    name: 'Ananya Sen, SSS',
    designation: 'Senior Statistical Officer (SSO)',
    department: 'Field Operations Division (FOD)',
    cadre: 'Subordinate Statistical Service',
    qualifications: 'M.Sc. Applied Statistics (ISI Kolkata)',
    experience_years: 8,
    email: 'ananya.sen.sss@nic.in',
    location: 'FOD Regional Office, Kolkata',
    past_trainings: [
      { title: 'NSS 79th Round Survey Orientation', year: 2022 },
      { title: 'CAPI Tablet Operations & Security', year: 2020 }
    ],
    skills: [
      { skill_id: 5, skill_name: 'Large-Scale Sample Survey Design (PLFS/NSS)', domain: 'Survey Methodology', proficiency_level: 4, source: 'quiz' },
      { skill_id: 6, skill_name: 'CAPI Field Operations & Quality Auditing', domain: 'Survey Methodology', proficiency_level: 4, source: 'self-report' },
      { skill_id: 7, skill_name: 'Python & R for Official Statistics', domain: 'Data Science & AI', proficiency_level: 1, source: 'self-report' },
      { skill_id: 9, skill_name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality', proficiency_level: 3, source: 'inferred' },
      { skill_id: 10, skill_name: 'Official Statistics Acts & Legal Compliance', domain: 'Governance & Quality', proficiency_level: 3, source: 'self-report' }
    ]
  },
  {
    id: 3,
    name: 'Vikram Malhotra, ISS',
    designation: 'Joint Director',
    department: 'Central Price Division (CPD)',
    cadre: 'Indian Statistical Service (2016 Batch)',
    qualifications: 'M.Stat (ISI), B.Sc. Mathematics',
    experience_years: 10,
    email: 'vikram.m.iss@nic.in',
    location: 'Jeevan Prakash Building, New Delhi',
    past_trainings: [
      { title: 'Price Index Formulation & CPI Revision', year: 2019 },
      { title: 'Advanced R for Official Statistics', year: 2023 }
    ],
    skills: [
      { skill_id: 3, skill_name: 'Consumer Price Index (CPI) Formulation', domain: 'Price Statistics', proficiency_level: 5, source: 'self-report' },
      { skill_id: 4, skill_name: 'Index of Industrial Production (IIP)', domain: 'Price Statistics', proficiency_level: 4, source: 'quiz' },
      { skill_id: 7, skill_name: 'Python & R for Official Statistics', domain: 'Data Science & AI', proficiency_level: 4, source: 'quiz' },
      { skill_id: 8, skill_name: 'Machine Learning & Big Data Analytics', domain: 'Data Science & AI', proficiency_level: 2, source: 'self-report' },
      { skill_id: 9, skill_name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality', proficiency_level: 3, source: 'self-report' }
    ]
  },
  {
    id: 4,
    name: 'Priya Patel, ISS',
    designation: 'Assistant Director / Data Analyst',
    department: 'Economic Statistics Division (ESD)',
    cadre: 'Indian Statistical Service (2021 Batch)',
    qualifications: 'M.Tech Data Analytics, B.Tech Computer Science',
    experience_years: 5,
    email: 'priya.patel.iss@nic.in',
    location: 'Khurshid Lal Bhawan, New Delhi',
    past_trainings: [
      { title: 'Big Data Analytics in Government', year: 2023 },
      { title: 'Official Statistics & IIP Compilation', year: 2022 }
    ],
    skills: [
      { skill_id: 4, skill_name: 'Index of Industrial Production (IIP)', domain: 'Price Statistics', proficiency_level: 3, source: 'quiz' },
      { skill_id: 7, skill_name: 'Python & R for Official Statistics', domain: 'Data Science & AI', proficiency_level: 5, source: 'quiz' },
      { skill_id: 8, skill_name: 'Machine Learning & Big Data Analytics', domain: 'Data Science & AI', proficiency_level: 4, source: 'quiz' },
      { skill_id: 9, skill_name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality', proficiency_level: 2, source: 'self-report' },
      { skill_id: 11, skill_name: 'National Indicator Framework (NIF) Monitoring', domain: 'SDGs & Indicators', proficiency_level: 3, source: 'self-report' }
    ]
  }
];

export async function fetchEmployees() {
  try {
    const res = await fetch(`${API_BASE}/employees`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API backend not reached, using embedded data store:', e);
  }
  return fallbackEmployees;
}

export async function fetchEmployee(id) {
  try {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API backend not reached, using embedded fallback:', e);
  }
  return fallbackEmployees.find(e => e.id === Number(id)) || fallbackEmployees[0];
}

export async function fetchEmployeeGaps(id) {
  try {
    const res = await fetch(`${API_BASE}/employees/${id}/gaps`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API backend gaps not reached, generating computed gaps:', e);
  }
  
  const emp = fallbackEmployees.find(e => e.id === Number(id)) || fallbackEmployees[0];
  const skills = emp.skills || [];
  const skillMap = {};
  skills.forEach(s => { skillMap[s.skill_id] = s.proficiency_level; });
  
  const expectedMap = {
    1: [
      { skill_id: 1, name: 'SNA 2008 Methodology & GDP Compilation', domain: 'National Accounts', exp: 5, prio: 'Critical' },
      { skill_id: 2, name: 'Quarterly & Annual GVA Estimation', domain: 'National Accounts', exp: 5, prio: 'Critical' },
      { skill_id: 7, name: 'Python & R for Official Statistics', domain: 'Data Science & AI', exp: 4, prio: 'High' },
      { skill_id: 8, name: 'Machine Learning & Big Data Analytics', domain: 'Data Science & AI', exp: 3, prio: 'Medium' },
      { skill_id: 9, name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality', exp: 4, prio: 'High' },
      { skill_id: 10, name: 'Official Statistics Acts & Legal Compliance', domain: 'Governance & Quality', exp: 4, prio: 'High' },
    ],
    2: [
      { skill_id: 5, name: 'Large-Scale Sample Survey Design (PLFS/NSS)', domain: 'Survey Methodology', exp: 5, prio: 'Critical' },
      { skill_id: 6, name: 'CAPI Field Operations & Quality Auditing', domain: 'Survey Methodology', exp: 5, prio: 'Critical' },
      { skill_id: 7, name: 'Python & R for Official Statistics', domain: 'Data Science & AI', exp: 3, prio: 'High' },
      { skill_id: 9, name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality', exp: 4, prio: 'High' },
      { skill_id: 10, name: 'Official Statistics Acts & Legal Compliance', domain: 'Governance & Quality', exp: 4, prio: 'High' },
    ]
  }[emp.id] || [
    { skill_id: 3, name: 'Consumer Price Index (CPI) Formulation', domain: 'Price Statistics', exp: 5, prio: 'Critical' },
    { skill_id: 4, name: 'Index of Industrial Production (IIP)', domain: 'Price Statistics', exp: 5, prio: 'Critical' },
    { skill_id: 7, name: 'Python & R for Official Statistics', domain: 'Data Science & AI', exp: 4, prio: 'High' },
    { skill_id: 8, name: 'Machine Learning & Big Data Analytics', domain: 'Data Science & AI', exp: 4, prio: 'High' },
  ];
  
  let totalExp = 0;
  let totalAct = 0;
  let critCount = 0;
  let highCount = 0;
  const allGaps = [];
  const domGroups = {};
  
  expectedMap.forEach(item => {
    const act = skillMap[item.skill_id] || 0;
    const gap = Math.max(0, item.exp - act);
    let severity = 'Proficient';
    let status = 'closed';
    
    if (gap > 0) {
      status = 'open';
      if (gap >= 3 || (gap >= 2 && item.prio === 'Critical')) {
        severity = 'Critical';
        critCount++;
      } else if (gap === 2 || (gap === 1 && item.prio === 'High')) {
        severity = 'High';
        highCount++;
      } else {
        severity = 'Medium';
      }
    }
    
    const gapObj = {
      skill_id: item.skill_id,
      skill_name: item.name,
      domain: item.domain,
      expected_level: item.exp,
      actual_level: act,
      gap_value: gap,
      severity,
      priority: item.prio,
      status
    };
    allGaps.push(gapObj);
    totalExp += item.exp;
    totalAct += Math.min(act, item.exp);
    
    if (!domGroups[item.domain]) {
      domGroups[item.domain] = { exp: [], act: [], skills: [], critical: 0 };
    }
    domGroups[item.domain].exp.push(item.exp);
    domGroups[item.domain].act.push(act);
    domGroups[item.domain].skills.push(gapObj);
    if (severity === 'Critical' || severity === 'High') domGroups[item.domain].critical++;
  });
  
  const domainSummaries = Object.keys(domGroups).map(dom => {
    const d = domGroups[dom];
    const expAvg = +(d.exp.reduce((a,b)=>a+b,0) / d.exp.length).toFixed(1);
    const actAvg = +(d.act.reduce((a,b)=>a+b,0) / d.act.length).toFixed(1);
    return {
      domain: dom,
      expected_avg: expAvg,
      actual_avg: actAvg,
      gap_score: Math.max(0, +(expAvg - actAvg).toFixed(1)),
      critical_skills_count: d.critical,
      skills: d.skills
    };
  });
  
  const radarData = domainSummaries.map(d => ({
    subject: d.domain,
    Expected: d.expected_avg,
    Actual: d.actual_avg,
    fullMark: 5
  }));
  
  return {
    employee_id: emp.id,
    employee_name: emp.name,
    designation: emp.designation,
    department: emp.department,
    overall_readiness_pct: totalExp > 0 ? +((totalAct / totalExp) * 100).toFixed(1) : 100,
    total_gaps_count: allGaps.filter(g => g.status === 'open').length,
    critical_gaps_count: critCount,
    high_gaps_count: highCount,
    domain_summaries: domainSummaries,
    radar_data: radarData,
    all_gaps: allGaps
  };
}

export async function fetchEmployeeRoadmap(id) {
  try {
    const res = await fetch(`${API_BASE}/employees/${id}/roadmap`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend roadmap API not reached, using client engine fallback:', e);
  }

  // Client Fallback Roadmap Engine
  return {
    employee_id: id,
    roadmap_type: 'Prerequisite-Aware 5-Factor Knowledge Tracing Roadmap',
    top_recommended_action: 'Python & R for Official Statistics',
    milestones: [
      {
        phase: 'Phase 1: Foundational Prerequisites',
        objective: 'Master core survey methodology and statistical programming primitives',
        progress_pct: 66.7,
        skills: [
          { skill_id: 5, skill_name: 'Large-Scale Sample Survey Design (PLFS/NSS)', domain: 'Survey Methodology', current_level: 4, expected_level: 5, gap: 1, status: 'Ready to Learn', priority_score: 84.5, unmet_prerequisites: [], prerequisites: [], factor_breakdown: { knowledge_gap: 20, role_importance: 100, prerequisite_impact: 67, forgetting_risk: 15, confidence: 92 } },
          { skill_id: 7, skill_name: 'Python & R for Official Statistics', domain: 'Data Science & AI', current_level: 2, expected_level: 4, gap: 2, status: 'Ready to Learn', priority_score: 88.0, unmet_prerequisites: [], prerequisites: [], factor_breakdown: { knowledge_gap: 40, role_importance: 80, prerequisite_impact: 33, forgetting_risk: 30, confidence: 90 } },
          { skill_id: 9, skill_name: 'National Quality Assurance Framework (NQAF)', domain: 'Governance & Quality', current_level: 4, expected_level: 4, gap: 0, status: 'Mastered', priority_score: 42.0, unmet_prerequisites: [], prerequisites: [], factor_breakdown: { knowledge_gap: 0, role_importance: 80, prerequisite_impact: 33, forgetting_risk: 10, confidence: 65 } }
        ]
      },
      {
        phase: 'Phase 2: Core Divisional Competencies',
        objective: 'Advanced macro accounts, price indexing, and CAPI field validation',
        progress_pct: 82.5,
        skills: [
          { skill_id: 1, skill_name: 'SNA 2008 Methodology & GDP Compilation', domain: 'National Accounts', current_level: 5, expected_level: 5, gap: 0, status: 'Mastered', priority_score: 48.0, unmet_prerequisites: [], prerequisites: ['Sample Survey Design'], factor_breakdown: { knowledge_gap: 0, role_importance: 100, prerequisite_impact: 33, forgetting_risk: 5, confidence: 65 } },
          { skill_id: 2, skill_name: 'Quarterly & Annual GVA Estimation', domain: 'National Accounts', current_level: 4, expected_level: 5, gap: 1, status: 'Ready to Learn', priority_score: 76.5, unmet_prerequisites: [], prerequisites: ['SNA 2008 Methodology', 'CPI Formulation'], factor_breakdown: { knowledge_gap: 20, role_importance: 100, prerequisite_impact: 0, forgetting_risk: 15, confidence: 65 } },
          { skill_id: 3, skill_name: 'Consumer Price Index (CPI) Formulation', domain: 'Price Statistics', current_level: 3, expected_level: 4, gap: 1, status: 'Ready to Learn', priority_score: 68.0, unmet_prerequisites: [], prerequisites: [], factor_breakdown: { knowledge_gap: 20, role_importance: 50, prerequisite_impact: 67, forgetting_risk: 20, confidence: 50 } },
          { skill_id: 4, skill_name: 'Index of Industrial Production (IIP)', domain: 'Price Statistics', current_level: 3, expected_level: 4, gap: 1, status: 'Ready to Learn', priority_score: 62.0, unmet_prerequisites: [], prerequisites: ['CPI Formulation'], factor_breakdown: { knowledge_gap: 20, role_importance: 50, prerequisite_impact: 0, forgetting_risk: 15, confidence: 50 } },
          { skill_id: 6, skill_name: 'CAPI Field Operations & Quality Auditing', domain: 'Survey Methodology', current_level: 3, expected_level: 4, gap: 1, status: 'Ready to Learn', priority_score: 65.0, unmet_prerequisites: [], prerequisites: ['Sample Survey Design'], factor_breakdown: { knowledge_gap: 20, role_importance: 50, prerequisite_impact: 0, forgetting_risk: 10, confidence: 65 } }
        ]
      },
      {
        phase: 'Phase 3: AI & Statistical Modernization',
        objective: 'Machine learning, big data administrative linkage, and SDG NIF tracking',
        progress_pct: 45.0,
        skills: [
          { skill_id: 8, skill_name: 'Machine Learning & Big Data Analytics', domain: 'Data Science & AI', current_level: 1, expected_level: 3, gap: 2, status: 'Locked', priority_score: 79.0, unmet_prerequisites: ['Python & R for Official Statistics'], prerequisites: ['Python & R for Official Statistics'], factor_breakdown: { knowledge_gap: 40, role_importance: 50, prerequisite_impact: 0, forgetting_risk: 45, confidence: 50 } },
          { skill_id: 10, skill_name: 'Official Statistics Acts & Legal Compliance', domain: 'Governance & Quality', current_level: 4, expected_level: 4, gap: 0, status: 'Mastered', priority_score: 41.0, unmet_prerequisites: [], prerequisites: ['NQAF Quality Principles'], factor_breakdown: { knowledge_gap: 0, role_importance: 80, prerequisite_impact: 0, forgetting_risk: 10, confidence: 65 } },
          { skill_id: 11, skill_name: 'National Indicator Framework (NIF) Monitoring', domain: 'SDGs & Indicators', current_level: 2, expected_level: 3, gap: 1, status: 'Ready to Learn', priority_score: 58.0, unmet_prerequisites: [], prerequisites: [], factor_breakdown: { knowledge_gap: 20, role_importance: 50, prerequisite_impact: 33, forgetting_risk: 15, confidence: 50 } },
          { skill_id: 12, skill_name: 'Disaggregated Data Analysis & Inequality Metrics', domain: 'SDGs & Indicators', current_level: 1, expected_level: 3, gap: 2, status: 'Locked', priority_score: 64.0, unmet_prerequisites: ['National Indicator Framework (NIF) Monitoring'], prerequisites: ['National Indicator Framework (NIF) Monitoring'], factor_breakdown: { knowledge_gap: 40, role_importance: 50, prerequisite_impact: 0, forgetting_risk: 20, confidence: 50 } }
        ]
      }
    ]
  };
}

export async function fetchStudentModel(id) {
  try {
    const res = await fetch(`${API_BASE}/employees/${id}/student-model`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend student model API not reached, using fallback:', e);
  }

  return {
    employee_id: id,
    model_type: 'Dynamic Bayesian / Rule-Based Student Model',
    active_skills_tracked: 6,
    average_retention_pct: 86.4,
    average_confidence_pct: 78.5,
    skills: [
      { skill_id: 1, skill_name: 'SNA 2008 Methodology & GDP Compilation', current_level: 5, retention_pct: 95.0, forgetting_risk_pct: 5.0, confidence_pct: 92.0, days_since_practice: 2, source: 'quiz' },
      { skill_id: 2, skill_name: 'Quarterly & Annual GVA Estimation', current_level: 4, retention_pct: 90.0, forgetting_risk_pct: 10.0, confidence_pct: 90.0, days_since_practice: 4, source: 'quiz' },
      { skill_id: 7, skill_name: 'Python & R for Official Statistics', current_level: 2, retention_pct: 70.0, forgetting_risk_pct: 30.0, confidence_pct: 88.0, days_since_practice: 14, source: 'quiz' },
      { skill_id: 8, skill_name: 'Machine Learning & Big Data Analytics', current_level: 1, retention_pct: 55.0, forgetting_risk_pct: 45.0, confidence_pct: 50.0, days_since_practice: 35, source: 'inferred' },
      { skill_id: 9, skill_name: 'National Quality Assurance Framework (NQAF)', current_level: 4, retention_pct: 88.0, forgetting_risk_pct: 12.0, confidence_pct: 65.0, days_since_practice: 8, source: 'self-report' },
      { skill_id: 10, skill_name: 'Official Statistics Acts & Legal Compliance', current_level: 4, retention_pct: 90.0, forgetting_risk_pct: 10.0, confidence_pct: 65.0, days_since_practice: 6, source: 'self-report' }
    ]
  };
}

export async function fetchEmployeeRecommendations(id) {
  try {
    const res = await fetch(`${API_BASE}/employees/${id}/recommendations`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API backend recommendations not reached, generating fallback:', e);
  }
  
  return [
    {
      id: 1,
      item_id: 201,
      item_type: 'programme',
      title: 'NSSTA Executive Residential: Advanced National Accounting & Quarterly GVA',
      source: 'NSSTA / TPAC',
      domain: 'National Accounts',
      level: 'Level 4-5 Officers',
      duration: '2 Weeks (Residential Greater Noida)',
      badge: 'NSSTA Fellowship',
      mode: 'In-Person / Lab Workshops',
      next_cohort: '15 Oct 2026',
      reason_text: "High-impact in-service residency by NSSTA/TPAC to bridge Critical proficiency gaps in National Accounts Division.",
      rank_score: 95.0,
      skills_addressed: ['SNA 2008 Methodology & GDP Compilation', 'Quarterly & Annual GVA Estimation']
    },
    {
      id: 2,
      item_id: 102,
      item_type: 'course',
      title: 'Python & R Data Analytics for Official Statistics',
      source: 'iGOT Karmayogi',
      domain: 'Data Science & AI',
      level: 'Intermediate',
      duration: '24 Hours (Self-paced)',
      badge: 'Statistical Programmer',
      mode: 'Self-paced Online',
      next_cohort: 'Immediate Access',
      reason_text: "Directly closes Critical deficit in 'Python & R for Official Statistics' required for Director role in NAD.",
      rank_score: 88.5,
      skills_addressed: ['Python & R for Official Statistics']
    },
    {
      id: 3,
      item_id: 202,
      item_type: 'programme',
      title: 'NSSTA Hands-On Bootcamp: AI, NLP & Satellite Analytics for Official Surveys',
      source: 'NSSTA / TPAC',
      domain: 'Data Science & AI',
      level: 'All Cadres (ISS & SSS)',
      duration: '5 Days (Hybrid)',
      badge: 'NSSTA Fellowship',
      mode: 'Hybrid (3 Days Virtual + 2 Days Lab)',
      next_cohort: '02 Nov 2026',
      reason_text: "Targets Level 1 to Level 3 upgrade in Machine Learning and Administrative Data Integration.",
      rank_score: 82.0,
      skills_addressed: ['Machine Learning & Big Data Analytics', 'Python & R for Official Statistics']
    },
    {
      id: 4,
      item_id: 101,
      item_type: 'course',
      title: 'Advanced SNA 2008 & Supply-Use Tables Compilation',
      source: 'iGOT Karmayogi',
      domain: 'National Accounts',
      level: 'Advanced',
      duration: '18 Hours (Self-paced)',
      badge: 'Certified National Accountant',
      mode: 'Self-paced Online',
      next_cohort: 'Immediate Access',
      reason_text: "Refreshes SUT balancing, GFCF matrices, and financial sector accounts per UN SNA 2008.",
      rank_score: 79.0,
      skills_addressed: ['SNA 2008 Methodology & GDP Compilation']
    }
  ];
}

export async function fetchEmployeeProgress(id) {
  try {
    const res = await fetch(`${API_BASE}/employees/${id}/progress`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API backend progress not reached, using fallback:', e);
  }
  
  return [
    {
      id: 1,
      event_type: 'quiz_completed',
      title: 'Completed National Accounts Verification Quiz',
      description: 'Scored 100.0% (2/2 correct). Upgraded Quarterly & Annual GVA Estimation to Level 5.',
      timestamp: 'Today at 1:45 PM'
    },
    {
      id: 2,
      event_type: 'course_enrolled',
      title: 'Enrolled in Python for Official Statistics',
      description: 'iGOT Karmayogi module registered via Single Sign-On gateway.',
      timestamp: 'Yesterday'
    },
    {
      id: 3,
      event_type: 'profile_onboarded',
      title: 'Official Profile Initialized',
      description: 'Competency mapped against Indian Statistical Service (ISS) Director benchmarks.',
      timestamp: '15 Jan 2026'
    }
  ];
}

export async function generateQuizAPI(params) {
  try {
    const res = await fetch(`${API_BASE}/quizzes/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend quiz generate not reachable, returning client quiz:', e);
  }
  
  return {
    quiz_id: 101,
    title: `${params.domain || 'National Accounts'} - Competency Verification Assessment`,
    domain: params.domain || 'National Accounts',
    source: 'MoSPI AI Quiz Generator',
    total_questions: 2,
    questions: [
      {
        id: 101,
        question: 'Under UN SNA 2008 guidelines, how is Financial Intermediation Services Indirectly Measured (FISIM) allocated in GVA estimation?',
        options: [
          { id: 'a', text: 'Entirely treated as intermediate consumption of a nominal sector.' },
          { id: 'b', text: 'Allocated between intermediate consumption of user industries and final consumption of households/government.' },
          { id: 'c', text: 'Deducted directly from Gross Operating Surplus of commercial banks.' },
          { id: 'd', text: 'Classified strictly as Gross Fixed Capital Formation (GFCF).' }
        ],
        skill_id: 1,
        skill_name: 'SNA 2008 Methodology & GDP Compilation',
        domain: 'National Accounts'
      },
      {
        id: 102,
        question: 'Which method is internationally recommended by MoSPI for compiling real quarterly GVA when producer price indices are available?',
        options: [
          { id: 'a', text: 'Single Extrapolation using production volume index' },
          { id: 'b', text: 'Double Deflation method deflating both gross output and intermediate consumption separately' },
          { id: 'c', text: 'Linear Trend Extrapolation from previous decennial census' },
          { id: 'd', text: 'Single Deflation using the All-India Consumer Price Index' }
        ],
        skill_id: 2,
        skill_name: 'Quarterly & Annual GVA Estimation',
        domain: 'National Accounts'
      }
    ]
  };
}

export async function submitQuizAPI(quizId, payload) {
  try {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend quiz submit not reachable, grading locally:', e);
  }
  
  const answers = payload.answers || {};
  let correct = 0;
  if (answers['101'] === 'b') correct++;
  if (answers['102'] === 'b') correct++;
  
  const score = Math.round((correct / 2) * 100);
  return {
    quiz_id: quizId,
    employee_id: payload.employee_id,
    score_percentage: score,
    total_questions: 2,
    correct_count: correct,
    passed: score >= 60,
    skills_upgraded: score >= 60 ? [
      { skill_id: 2, skill_name: 'Quarterly & Annual GVA Estimation', old_level: 4, new_level: 5 }
    ] : [],
    detailed_feedback: [
      {
        question_id: 101,
        question: 'Under UN SNA 2008 guidelines, how is FISIM allocated?',
        user_answer: answers['101'] || 'none',
        correct_answer: 'b',
        is_correct: answers['101'] === 'b',
        explanation: 'SNA 2008 mandates that FISIM must be allocated across user sectors as intermediate consumption and final consumption.',
        skill_name: 'SNA 2008 Methodology'
      },
      {
        question_id: 102,
        question: 'Which method is recommended by MoSPI for compiling real quarterly GVA?',
        user_answer: answers['102'] || 'none',
        correct_answer: 'b',
        is_correct: answers['102'] === 'b',
        explanation: 'Double deflation eliminates price distortion by deflating output and inputs separately.',
        skill_name: 'Quarterly GVA Estimation'
      }
    ],
    message: `Assessment completed with ${score}%. Skill levels upgraded successfully!`
  };
}

export async function fetchAdminHeatmap() {
  try {
    const res = await fetch(`${API_BASE}/admin/heatmap`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Admin heatmap API not reached, using fallback matrix:', e);
  }
  
  const departments = [
    'National Accounts Division (NAD)',
    'Field Operations Division (FOD)',
    'Central Price Division (CPD)',
    'Economic Statistics Division (ESD)',
    'Social Statistics Division (SSD)'
  ];
  const domains = [
    'National Accounts',
    'Price Statistics',
    'Survey Methodology',
    'Data Science & AI',
    'Governance & Quality',
    'SDGs & Indicators'
  ];
  
  const matrix = [];
  departments.forEach(dept => {
    domains.forEach(dom => {
      let avg = 3.0;
      if (dept.includes('National Accounts') && dom === 'National Accounts') avg = 4.6;
      else if (dept.includes('Field Operations') && dom === 'Survey Methodology') avg = 4.4;
      else if (dept.includes('Price') && dom === 'Price Statistics') avg = 4.5;
      else if (dept.includes('Economic') && dom === 'Data Science & AI') avg = 4.2;
      else if (dept.includes('Social') && dom === 'SDGs & Indicators') avg = 4.3;
      else if (dom === 'Data Science & AI') avg = 2.1;
      else avg = 3.2;
      
      const bench = dom.split(' ')[0] === dept.split(' ')[0] ? 4.5 : 3.5;
      const gap = Math.max(0, +(bench - avg).toFixed(1));
      let status = 'Moderate';
      if (gap <= 0.5) status = 'Strong';
      else if (gap > 1.5) status = 'Severe';
      
      matrix.push({
        department: dept,
        domain: dom,
        average_proficiency: avg,
        benchmark_proficiency: bench,
        gap_score: gap,
        officer_count: 24,
        status
      });
    });
  });
  
  return {
    departments,
    domains,
    matrix,
    org_readiness_avg: 74.8
  };
}

export async function fetchAdminPredictive() {
  try {
    const res = await fetch(`${API_BASE}/admin/predictive`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Predictive API not reached, using strategic forecast fallback:', e);
  }
  
  return {
    summary: 'Predictive assessment based on upcoming 2027 Economic Census automation, Big Data integration, and ISS retirement projections.',
    forecast_horizon: '2026 - 2028 Strategic Horizon',
    shortages: [
      {
        domain: 'Data Science & AI',
        skill_name: 'Machine Learning & Big Data Analytics',
        current_capacity: 14,
        projected_demand_2027: 65,
        shortage_gap_pct: 78.5,
        urgency: 'Critical',
        recommended_action: 'Mandate NSSTA 5-Day HPC/AI Bootcamp and enroll 50 ISS officers in iGOT Python masterclass.'
      },
      {
        domain: 'Price Statistics',
        skill_name: 'Scanner & E-Commerce Data Price Indexing',
        current_capacity: 8,
        projected_demand_2027: 30,
        shortage_gap_pct: 73.3,
        urgency: 'High',
        recommended_action: 'Organize international joint workshop with UNESCAP on web scraping and hedonic pricing.'
      },
      {
        domain: 'Survey Methodology',
        skill_name: 'CAPI Automated Quality Auditing',
        current_capacity: 28,
        projected_demand_2027: 75,
        shortage_gap_pct: 62.7,
        urgency: 'High',
        recommended_action: 'Zonal training for SSS cadre supervisors on real-time anomaly detection scripts.'
      },
      {
        domain: 'National Accounts',
        skill_name: 'Supply-Use Tables & Double Deflation',
        current_capacity: 19,
        projected_demand_2027: 35,
        shortage_gap_pct: 45.7,
        urgency: 'Medium',
        recommended_action: 'Cadre nomination for 2-Week NSSTA Greater Noida residential workshop.'
      }
    ],
    cadre_distribution: [
      { cadre: 'Indian Statistical Service (HAG/SAG/JAG)', officers: 120, readiness_pct: 76.4 },
      { cadre: 'Indian Statistical Service (STS/JTS)', officers: 180, readiness_pct: 68.2 },
      { cadre: 'Subordinate Statistical Service (SSO/JSO)', officers: 450, readiness_pct: 61.8 }
    ]
  };
}

export async function sendChatMessage(message, employeeId = 1) {
  try {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, employee_id: employeeId })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Assistant API not reached, responding via client assistant engine:', e);
  }
  
  const m = message.toLowerCase();
  if (m.includes('gap') || m.includes('skill')) {
    return {
      reply: `Based on your profile, you currently have **3 open competency deficits**, with highest urgency in **Data Science & AI (Python/R)** and **Machine Learning for Administrative Data**. I recommend starting the *Python for Official Statistics* course on iGOT or taking a quick domain assessment.`,
      suggested_actions: ['Take Data Science Quiz', 'View iGOT Course', 'NSSTA Bootcamp'],
      related_links: [{ title: 'Skill Gap Radar', url: '#radar' }]
    };
  }
  
  return {
    reply: `Namaste! I am your **Karmayogi Statistical AI Assistant**. I am integrated with MoSPI's official competency taxonomy and NSSTA / iGOT training engines. How can I help boost your statistical proficiency today?`,
    suggested_actions: ['Analyze My Gaps', 'Take 5-Min Quiz', 'Explore Courses', 'NSSTA Calendar'],
    related_links: [{ title: 'My Dashboard', url: '/employee' }]
  };
}
