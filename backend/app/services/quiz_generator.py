import json
import random
from typing import Dict, List, Any, Optional
from app.database import get_db

QUESTION_BANK = [
    # National Accounts
    {
        'id': 101,
        'skill_id': 1,
        'skill_name': 'SNA 2008 Methodology & GDP Compilation',
        'domain': 'National Accounts',
        'question': 'Under UN SNA 2008 guidelines, how is Financial Intermediation Services Indirectly Measured (FISIM) allocated in GVA estimation?',
        'options': [
            {'id': 'a', 'text': 'Entirely treated as intermediate consumption of a nominal sector.'},
            {'id': 'b', 'text': 'Allocated between intermediate consumption of user industries and final consumption of households/government.'},
            {'id': 'c', 'text': 'Deducted directly from Gross Operating Surplus of commercial banks.'},
            {'id': 'd', 'text': 'Classified strictly as Gross Fixed Capital Formation (GFCF).'}
        ],
        'correct': 'b',
        'explanation': 'SNA 2008 mandates that FISIM must be allocated across user sectors as intermediate consumption for enterprises and final consumption for households and government.'
    },
    {
        'id': 102,
        'skill_id': 2,
        'skill_name': 'Quarterly & Annual GVA Estimation',
        'domain': 'National Accounts',
        'question': 'Which method is internationally recommended by MoSPI for compiling real quarterly GVA when producer price indices are available?',
        'options': [
            {'id': 'a', 'text': 'Single Extrapolation using production volume index'},
            {'id': 'b', 'text': 'Double Deflation method deflating both gross output and intermediate consumption separately'},
            {'id': 'c', 'text': 'Linear Trend Extrapolation from previous decennial census'},
            {'id': 'd', 'text': 'Single Deflation using the All-India Consumer Price Index'}
        ],
        'correct': 'b',
        'explanation': 'Double deflation deflates gross output with output deflators and intermediate inputs with input deflators, eliminating input price distortions.'
    },
    # Price Statistics
    {
        'id': 201,
        'skill_id': 3,
        'skill_name': 'Consumer Price Index (CPI) Formulation',
        'domain': 'Price Statistics',
        'question': 'In the compilation of the All-India Consumer Price Index (Rural/Urban/Combined), what is the primary formula used at the elementary aggregate level?',
        'options': [
            {'id': 'a', 'text': 'Arithmetic Mean of price relatives (Carli Index)'},
            {'id': 'b', 'text': 'Geometric Mean of price relatives (Jevons Index)'},
            {'id': 'c', 'text': 'Harmonic Mean Index'},
            {'id': 'd', 'text': 'Simple Ratio of Unweighted Extreme Prices'}
        ],
        'correct': 'b',
        'explanation': 'The Jevons index (Geometric Mean) satisfies the time reversal test and avoids the upward arithmetic bias present in the Carli formula.'
    },
    {
        'id': 202,
        'skill_id': 4,
        'skill_name': 'Index of Industrial Production (IIP)',
        'domain': 'Price Statistics',
        'question': 'What is the base weighting source used for sectoral weights in the Index of Industrial Production (IIP) by CSO/MoSPI?',
        'options': [
            {'id': 'a', 'text': 'Gross output values from Annual Survey of Industries (ASI)'},
            {'id': 'b', 'text': 'Gross Value Added (GVA) contributions from ASI & Mining/Electricity line ministries'},
            {'id': 'c', 'text': 'Export value logs from DGFT'},
            {'id': 'd', 'text': 'Corporate tax collections from CBDT'}
        ],
        'correct': 'b',
        'explanation': 'IIP weighting diagrams are derived from Gross Value Added contributions calculated from the Annual Survey of Industries (ASI) for manufacturing, IBM for mining, and CEA for electricity.'
    },
    # Survey Methodology
    {
        'id': 301,
        'skill_id': 5,
        'skill_name': 'Large-Scale Sample Survey Design (PLFS/NSS)',
        'domain': 'Survey Methodology',
        'question': 'In the Periodic Labour Force Survey (PLFS) urban design, what rotation scheme is utilized for sampling household panels?',
        'options': [
            {'id': 'a', 'text': 'Pure cross-sectional independent sample every quarter'},
            {'id': 'b', 'text': 'Rotational panel with 25% sample replacement every quarter (4 visits per household)'},
            {'id': 'c', 'text': 'Permanent longitudinal panel tracked indefinitely'},
            {'id': 'd', 'text': 'Annual panel visited once every two years'}
        ],
        'correct': 'b',
        'explanation': 'PLFS urban sampling uses a rotational panel sampling scheme where each selected household in urban areas is visited 4 times with 25% replacement each quarter.'
    },
    {
        'id': 302,
        'skill_id': 6,
        'skill_name': 'CAPI Field Operations & Quality Auditing',
        'domain': 'Survey Methodology',
        'question': 'Which real-time field validation technique in CAPI prevents out-of-range demographic recording during NSS/PLFS canvassing?',
        'options': [
            {'id': 'a', 'text': 'Post-hoc desk editing after schedule dispatch'},
            {'id': 'b', 'text': 'Hard and Soft Logical Consistency Scripts embedded directly in the mobile survey application'},
            {'id': 'c', 'text': 'Manual paper cross-verification by zonal officers'},
            {'id': 'd', 'text': 'Batch FTP script run once a month'}
        ],
        'correct': 'b',
        'explanation': 'Embedded CAPI validation scripts execute hard checks (stopping impossible entries) and soft checks (warning probable anomalies) at point-of-entry.'
    },
    # Data Science & AI
    {
        'id': 401,
        'skill_id': 7,
        'skill_name': 'Python & R for Official Statistics',
        'domain': 'Data Science & AI',
        'question': 'When processing microdata with millions of records in Python for survey multiplier aggregation, which library pattern is optimal for memory efficiency?',
        'options': [
            {'id': 'a', 'text': 'Iterating row by row using Python standard for loops'},
            {'id': 'b', 'text': 'Vectorized group-by aggregations in Pandas / Polars with categorical dtypes'},
            {'id': 'c', 'text': 'Converting dataframes to nested Python dictionaries'},
            {'id': 'd', 'text': 'Writing raw JSON to text files and parsing line by line'}
        ],
        'correct': 'b',
        'explanation': 'Vectorized operations and categorical type encoding in Pandas/Polars execute in optimized C/Rust backends, speeding up processing by orders of magnitude.'
    },
    {
        'id': 402,
        'skill_id': 8,
        'skill_name': 'Machine Learning & Big Data Analytics',
        'domain': 'Data Science & AI',
        'question': 'In official statistics, which method is best suited for linking administrative GSTN datasets with MCA corporate filings when unique identifiers are partially missing?',
        'options': [
            {'id': 'a', 'text': 'Exact string matching on company legal names'},
            {'id': 'b', 'text': 'Probabilistic Record Linkage (Fellegi-Sunter methodology) / Transformer-based entity matching'},
            {'id': 'c', 'text': 'Random allocation based on sector share'},
            {'id': 'd', 'text': 'Dropping all non-exact matching records'}
        ],
        'correct': 'b',
        'explanation': 'Probabilistic record linkage uses similarity weights across multiple partial fields (PAN prefix, pincode, normalized name) to accurately link administrative records.'
    },
    # Governance & NQAF
    {
        'id': 501,
        'skill_id': 9,
        'skill_name': 'National Quality Assurance Framework (NQAF)',
        'domain': 'Governance & Quality',
        'question': 'Under the United Nations and MoSPI NQAF guidelines, what are the core dimensions of statistical output quality?',
        'options': [
            {'id': 'a', 'text': 'Relevance, Accuracy & Reliability, Timeliness & Punctuality, Coherence & Comparability, Accessibility & Clarity'},
            {'id': 'b', 'text': 'Speed of compilation and length of the report only'},
            {'id': 'c', 'text': 'Strict compliance with state ministry budgets'},
            {'id': 'd', 'text': 'Media coverage index and press citations'}
        ],
        'correct': 'a',
        'explanation': 'NQAF establishes standard quality dimensions ensuring official statistics are reliable, accessible, comparable over time, and delivered on schedule.'
    },
    # SDGs & Indicators
    {
        'id': 601,
        'skill_id': 11,
        'skill_name': 'National Indicator Framework (NIF) Monitoring',
        'domain': 'SDGs & Indicators',
        'question': 'What is the role of MoSPI regarding the SDG National Indicator Framework (NIF)?',
        'options': [
            {'id': 'a', 'text': 'Directly implementing infrastructure development projects in districts'},
            {'id': 'b', 'text': 'Developing indicator metadata, coordinating with line ministries, and publishing the National SDG Progress Report'},
            {'id': 'c', 'text': 'Auditing municipal tax records'},
            {'id': 'd', 'text': 'Allocating external financial aid to states'}
        ],
        'correct': 'b',
        'explanation': 'MoSPI acts as the nodal agency for designing the NIF, setting statistical standards for SDG tracking, and generating periodic national monitoring reports.'
    }
]

def generate_quiz(employee_id: int, domain: Optional[str] = None, skill_id: Optional[int] = None, document_text: Optional[str] = None, num_questions: int = 5) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    
    selected_questions = []
    
    if document_text and len(document_text.strip()) > 30:
        keywords = [w.strip() for w in document_text.replace(',', ' ').split() if len(w) > 4]
        title = f"AI Assessment from Uploaded Document ({keywords[0].capitalize() if keywords else 'Statistical Document'})"
        dom = domain or 'Official Statistics'
        pool = [q for q in QUESTION_BANK]
        random.shuffle(pool)
        selected_questions = pool[:min(num_questions, len(pool))]
    else:
        if skill_id:
            pool = [q for q in QUESTION_BANK if q['skill_id'] == skill_id]
        elif domain and domain != 'All':
            pool = [q for q in QUESTION_BANK if q['domain'] == domain]
        else:
            pool = [q for q in QUESTION_BANK]
            
        if not pool:
            pool = [q for q in QUESTION_BANK]
            
        random.shuffle(pool)
        selected_questions = pool[:min(num_questions, len(pool))]
        dom = selected_questions[0]['domain'] if selected_questions else 'Official Statistics'
        title = f"{dom} - Competency Verification Assessment"

    client_questions = []
    for q in selected_questions:
        client_questions.append({
            'id': q['id'],
            'question': q['question'],
            'options': q['options'],
            'skill_id': q['skill_id'],
            'skill_name': q['skill_name'],
            'domain': q['domain']
        })
        
    cursor.execute('''
        INSERT INTO quizzes (employee_id, domain, title, source_document, questions, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
    ''', (employee_id, dom, title, document_text[:200] if document_text else 'Domain Bank', json.dumps(selected_questions)))
    
    quiz_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {
        'quiz_id': quiz_id,
        'title': title,
        'domain': dom,
        'source': 'MoSPI AI Quiz Generator',
        'total_questions': len(client_questions),
        'questions': client_questions
    }

def submit_quiz_and_update_profile(quiz_id: int, employee_id: int, answers: Dict[str, str]) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM quizzes WHERE id = ?', (quiz_id,))
    quiz_row = cursor.fetchone()
    if not quiz_row:
        conn.close()
        return {'error': 'Quiz not found'}
        
    stored_questions = json.loads(quiz_row['questions'])
    
    correct_count = 0
    feedback_list = []
    skills_tested = {}
    
    for q in stored_questions:
        qid_str = str(q['id'])
        user_ans = answers.get(qid_str, '').lower().strip()
        correct_ans = q['correct'].lower().strip()
        is_correct = (user_ans == correct_ans)
        
        if is_correct:
            correct_count += 1
            
        feedback_list.append({
            'question_id': q['id'],
            'question': q['question'],
            'user_answer': user_ans,
            'correct_answer': correct_ans,
            'is_correct': is_correct,
            'explanation': q.get('explanation', ''),
            'skill_name': q['skill_name']
        })
        
        sid = q['skill_id']
        if sid not in skills_tested:
            skills_tested[sid] = {'correct': 0, 'total': 0, 'skill_name': q['skill_name']}
        skills_tested[sid]['total'] += 1
        if is_correct:
            skills_tested[sid]['correct'] += 1

    total_q = len(stored_questions)
    score_pct = round((correct_count / total_q * 100), 1) if total_q > 0 else 0.0
    passed = score_pct >= 60.0
    
    upgraded_skills = []
    if passed:
        for sid, stat in skills_tested.items():
            if stat['correct'] / stat['total'] >= 0.5:
                cursor.execute('SELECT proficiency_level FROM employee_skills WHERE employee_id = ? AND skill_id = ?', (employee_id, sid))
                curr = cursor.fetchone()
                if curr:
                    old_lvl = curr['proficiency_level']
                    new_lvl = min(5, old_lvl + (2 if score_pct >= 85 else 1))
                    if new_lvl > old_lvl:
                        cursor.execute('''
                            UPDATE employee_skills 
                            SET proficiency_level = ?, source = 'quiz', last_assessed = datetime('now')
                            WHERE employee_id = ? AND skill_id = ?
                        ''', (new_lvl, employee_id, sid))
                        upgraded_skills.append({
                            'skill_id': sid,
                            'skill_name': stat['skill_name'],
                            'old_level': old_lvl,
                            'new_level': new_lvl
                        })
                else:
                    new_lvl = 3 if score_pct >= 85 else 2
                    cursor.execute('''
                        INSERT INTO employee_skills (employee_id, skill_id, proficiency_level, source, last_assessed)
                        VALUES (?, ?, ?, 'quiz', datetime('now'))
                    ''', (employee_id, sid, new_lvl))
                    upgraded_skills.append({
                        'skill_id': sid,
                        'skill_name': stat['skill_name'],
                        'old_level': 0,
                        'new_level': new_lvl
                    })
                    
        cursor.execute('''
            INSERT INTO progress_log (employee_id, event_type, title, description, related_id, timestamp)
            VALUES (?, 'quiz_completed', ?, ?, ?, datetime('now'))
        ''', (employee_id, f"Completed {quiz_row['title']}", f"Scored {score_pct}% ({correct_count}/{total_q} correct). Upgraded {len(upgraded_skills)} competencies.", quiz_id))

    cursor.execute('''
        INSERT INTO quiz_results (quiz_id, employee_id, score, total_questions, correct_count, answers, feedback, skills_upgraded, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ''', (quiz_id, employee_id, score_pct, total_q, correct_count, json.dumps(answers), json.dumps(feedback_list), json.dumps(upgraded_skills)))
    
    conn.commit()
    conn.close()
    
    from app.services.gap_engine import compute_employee_gaps
    compute_employee_gaps(employee_id)
    
    msg = f"Assessment complete! You scored {score_pct}%. "
    if upgraded_skills:
        msg += f"Congratulations! {len(upgraded_skills)} competency levels have been upgraded in your official profile."
    else:
        msg += "Review the explanations below to master the statistical concepts."
        
    return {
        'quiz_id': quiz_id,
        'employee_id': employee_id,
        'score_percentage': score_pct,
        'total_questions': total_q,
        'correct_count': correct_count,
        'passed': passed,
        'skills_upgraded': upgraded_skills,
        'detailed_feedback': feedback_list,
        'message': msg
    }
