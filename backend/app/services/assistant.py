from typing import Dict, List, Any
from app.database import get_db

KNOWLEDGE_BASE = {
    'sna': 'SNA 2008 (System of National Accounts) provides the global statistical standard for compiling GDP, GVA, Supply-Use Tables (SUT), and institutional sector accounts. In India, MoSPI\'s National Accounts Division publishes Quarterly and Annual Estimates.',
    'cpi': 'Consumer Price Index (CPI) measures retail inflation across Rural, Urban, and Combined baskets. Key methodologies include geometric mean elementary aggregation (Jevons formula) and Laspeyres weighting derived from Household Consumer Expenditure Surveys.',
    'plfs': 'The Periodic Labour Force Survey (PLFS) is designed to estimate key employment and unemployment indicators (UR, WPR, LFPR) with a quarterly urban rotational panel and annual rural sample.',
    'igot': 'iGOT Karmayogi is the National Programme for Civil Services Capacity Building (NPCSCB). MoSPI statistical officers can complete digital micro-credentials in Data Science, SNA, NQAF, and Legal frameworks.',
    'nssta': 'NSSTA (National Statistical Systems Training Academy) at Greater Noida is the apex training body under MoSPI conducting induction, mid-career training, and in-service workshops advised by TPAC.'
}

def get_assistant_response(message: str, employee_id: int = 1) -> Dict[str, Any]:
    msg = message.lower()
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM employees WHERE id = ?', (employee_id,))
    emp = cursor.fetchone()
    emp_name = emp['name'] if emp else 'Official'
    emp_role = emp['designation'] if emp else 'Statistical Officer'
    emp_dept = emp['department'] if emp else 'MoSPI'
    
    cursor.execute('SELECT * FROM gaps WHERE employee_id = ? AND status = "open"', (employee_id,))
    gaps = cursor.fetchall()
    gap_count = len(gaps)
    conn.close()
    
    suggested_actions = []
    related_links = []
    
    if 'gap' in msg or 'skill' in msg or 'deficit' in msg:
        reply = f"Hello {emp_name}. Based on your role as **{emp_role} in {emp_dept}**, the AI Gap Analysis engine has identified **{gap_count} active competency gaps**. Your highest priority focus areas are modern Data Science (Python/R) and advanced domain methodologies. Would you like me to launch a targeted quiz or recommend an iGOT course?"
        suggested_actions = ['Take a Domain Quiz', 'View iGOT Recommendations', 'Explore NSSTA Workshops']
        related_links = [{'title': 'Gap Analysis Radar', 'url': '#radar'}, {'title': 'Ranked Learning Paths', 'url': '#recommendations'}]
        
    elif 'quiz' in msg or 'test' in msg or 'assessment' in msg:
        reply = f"You can test your knowledge instantly! I can generate a 5-question MCQ assessment on National Accounts, Price Statistics, Survey Methodology, or any custom document you upload. Passing with >60% automatically upgrades your profile proficiency."
        suggested_actions = ['Start National Accounts Quiz', 'Start Survey Methodology Quiz', 'Upload Guideline PDF']
        related_links = [{'title': 'Assessment Center', 'url': '/quizzes'}]
        
    elif 'igot' in msg or 'course' in msg or 'karmayogi' in msg:
        reply = f"On iGOT Karmayogi, we have mapped courses specifically aligned to your competency deficits, including *Advanced SNA 2008 & SUT Compilation* (18 hrs) and *Python Data Analytics for Official Statistics* (24 hrs). You can enroll directly through the Recommendations tab."
        suggested_actions = ['View All iGOT Courses', 'Check NSSTA Calendar']
        related_links = [{'title': 'iGOT Course Catalog', 'url': '/courses'}]
        
    elif 'nssta' in msg or 'tpac' in msg or 'workshop' in msg:
        reply = f"NSSTA / TPAC has upcoming high-impact residential cohorts: *Advanced National Accounting Residency* (starting Oct 2026) and *AI & Satellite Analytics Bootcamp* (Nov 2026). Officers with Critical gaps in NAD/ESD receive priority nomination."
        suggested_actions = ['View NSSTA Calendar', 'Request Nomination']
        related_links = [{'title': 'TPAC Programmes', 'url': '/courses'}]
        
    elif 'sna' in msg or 'gdp' in msg or 'gva' in msg:
        reply = KNOWLEDGE_BASE['sna'] + " Let me know if you need assistance with Double Deflation, SUT balancing, or FISIM allocation formulas."
        suggested_actions = ['Take SNA 2008 Quiz', 'View National Accounts Modules']
        
    elif 'cpi' in msg or 'price' in msg or 'inflation' in msg:
        reply = KNOWLEDGE_BASE['cpi'] + " Would you like to review the index compilation equations or explore the base year revision modules?"
        suggested_actions = ['Take CPI Quiz', 'View Price Statistics Path']
        
    else:
        reply = f"Namaste {emp_name}. I am your **Karmayogi Statistical AI Assistant**, connected directly to MoSPI's Competency Taxonomy and NSSTA/iGOT training engines. You currently have **{gap_count} open skill areas** to reach full benchmark proficiency for your {emp_role} post. How may I assist your career progression today?"
        suggested_actions = ['Analyze My Skill Gaps', 'Generate Quick Quiz', 'Recommend Courses', 'NSSTA Calendar']
        related_links = [{'title': 'My Dashboard', 'url': '/employee'}, {'title': 'Assessment Center', 'url': '/quizzes'}]
        
    return {
        'reply': reply,
        'suggested_actions': suggested_actions,
        'related_links': related_links
    }
