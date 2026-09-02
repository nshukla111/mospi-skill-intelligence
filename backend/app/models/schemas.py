from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class SkillItem(BaseModel):
    skill_id: int
    skill_name: Optional[str] = None
    domain: Optional[str] = None
    proficiency_level: int
    source: Optional[str] = 'self-report'
    last_assessed: Optional[str] = None

class EmployeeBase(BaseModel):
    name: str
    designation: str
    department: str
    cadre: Optional[str] = None
    qualifications: Optional[str] = None
    experience_years: Optional[int] = 0
    email: Optional[str] = None
    location: Optional[str] = None
    past_trainings: Optional[List[Dict[str, Any]]] = []

class EmployeeCreate(EmployeeBase):
    skills: Optional[List[SkillItem]] = []

class OnboardingRequest(BaseModel):
    name: str
    designation: str
    department: str
    cadre: Optional[str] = 'Indian Statistical Service'
    qualifications: Optional[str] = 'M.Sc. Statistics'
    experience_years: Optional[int] = 5
    email: Optional[str] = None
    location: Optional[str] = 'New Delhi'
    past_trainings: Optional[List[str]] = []
    self_reported_skills: Optional[Dict[str, int]] = {}  # skill_id -> level (1-5)

class EmployeeResponse(EmployeeBase):
    id: int
    skills: List[SkillItem] = []
    created_at: Optional[str] = None

class GapItem(BaseModel):
    skill_id: int
    skill_name: str
    domain: str
    expected_level: int
    actual_level: int
    gap_value: int
    severity: str
    priority: str
    status: str = 'open'

class DomainGapSummary(BaseModel):
    domain: str
    expected_avg: float
    actual_avg: float
    gap_score: float
    critical_skills_count: int
    skills: List[GapItem]

class EmployeeGapsResponse(BaseModel):
    employee_id: int
    employee_name: str
    designation: str
    department: str
    overall_readiness_pct: float
    total_gaps_count: int
    critical_gaps_count: int
    high_gaps_count: int
    domain_summaries: List[DomainGapSummary]
    radar_data: List[Dict[str, Any]]
    all_gaps: List[GapItem]

class RecommendationItem(BaseModel):
    id: int
    item_id: int
    item_type: str  # 'course' or 'programme'
    title: str
    source: str     # 'iGOT Karmayogi' or 'NSSTA / TPAC'
    domain: str
    level: str
    duration: str
    badge: Optional[str] = None
    mode: Optional[str] = None
    next_cohort: Optional[str] = None
    reason_text: str
    rank_score: float
    skills_addressed: List[str]
    skills_covered_ids: List[int]
    description: Optional[str] = ''

class QuestionOption(BaseModel):
    id: str
    text: str

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[QuestionOption]
    skill_id: int
    skill_name: str
    domain: str
    explanation: Optional[str] = None

class QuizGenerateRequest(BaseModel):
    employee_id: Optional[int] = 1
    domain: Optional[str] = 'National Accounts'
    skill_id: Optional[int] = None
    document_text: Optional[str] = None
    num_questions: Optional[int] = 5

class QuizResponse(BaseModel):
    quiz_id: int
    title: str
    domain: str
    source: str
    total_questions: int
    questions: List[Dict[str, Any]]

class QuizSubmitRequest(BaseModel):
    employee_id: int
    answers: Dict[str, str]  # question_id -> option_id

class QuizResultResponse(BaseModel):
    quiz_id: int
    employee_id: int
    score_percentage: float
    total_questions: int
    correct_count: int
    passed: bool
    skills_upgraded: List[Dict[str, Any]]
    detailed_feedback: List[Dict[str, Any]]
    message: str

class HeatmapCell(BaseModel):
    department: str
    domain: str
    average_proficiency: float
    benchmark_proficiency: float
    gap_score: float
    officer_count: int
    status: str

class HeatmapResponse(BaseModel):
    departments: List[str]
    domains: List[str]
    matrix: List[HeatmapCell]
    org_readiness_avg: float

class PredictiveShortageItem(BaseModel):
    domain: str
    skill_name: str
    current_capacity: int
    projected_demand_2027: int
    shortage_gap_pct: float
    urgency: str
    recommended_action: str

class PredictiveResponse(BaseModel):
    summary: str
    forecast_horizon: str
    shortages: List[PredictiveShortageItem]
    cadre_distribution: List[Dict[str, Any]]

class ChatRequest(BaseModel):
    message: str
    employee_id: Optional[int] = 1
    conversation_history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []
    related_links: List[Dict[str, str]] = []
