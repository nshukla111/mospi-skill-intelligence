import json
from typing import Dict, List, Any
from app.database import get_db
from app.services.knowledge_tracing import get_student_model

# 1. Manually defined Prerequisite Graph DAG for Official Statistics (Page 6 & 7)
PREREQUISITE_GRAPH = {
    # target_skill_id: [prerequisite_skill_ids]
    1: [5],     # SNA 2008 & GDP depends on Survey Sampling Design (PLFS/NSS)
    2: [1, 3],  # Quarterly GVA Deflation depends on SNA 2008 and CPI Price Statistics
    4: [3],     # IIP Industrial Production depends on Price Index fundamentals
    6: [5],     # CAPI Operations depends on Survey Sampling Design
    8: [7],     # Machine Learning & Big Data depends on Python & R for Official Statistics
    10: [9],    # CSA 2008 Legal Compliance depends on NQAF Quality Assurance
    12: [11]    # Disaggregated Inequality Metrics depends on SDG NIF Monitoring
}

# Inverted graph: how many downstream skills depend on skill X (Prerequisite Impact)
DOWNSTREAM_IMPACT = {}
for target, prereqs in PREREQUISITE_GRAPH.items():
    for p in prereqs:
        DOWNSTREAM_IMPACT[p] = DOWNSTREAM_IMPACT.get(p, 0) + 1

# Fixed weights for the 5-Factor formula per technical framework (Page 7)
WEIGHTS = {
    'knowledge_gap': 0.30,
    'role_importance': 0.25,
    'prerequisite_impact': 0.20,
    'forgetting_risk': 0.15,
    'confidence_gap': 0.10
}

def generate_personalized_roadmap(employee_id: int) -> Dict[str, Any]:
    """
    Combines Student Model + Prerequisite Graph + 5-Factor Ranking Formula
    to output a milestone-based personalized learning path.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Fetch employee & role expectations
    cursor.execute('SELECT * FROM employees WHERE id = ?', (employee_id,))
    emp = cursor.fetchone()
    if not emp:
        conn.close()
        return {'error': 'Employee not found'}
        
    emp_dict = dict(emp)
    
    cursor.execute('SELECT * FROM job_role_reference WHERE designation = ? AND department = ?',
                   (emp_dict['designation'], emp_dict['department']))
    role = cursor.fetchone()
    if not role:
        cursor.execute('SELECT * FROM job_role_reference LIMIT 1')
        role = cursor.fetchone()
    expected_skills = json.loads(role['expected_skills']) if role else []
    expected_map = {item['skill_id']: item for item in expected_skills}
    
    # 2. Fetch live Student Model
    student_model = get_student_model(employee_id)
    student_skills_map = {s['skill_id']: s for s in student_model['skills']}
    
    # 3. Fetch all taxonomy skills
    cursor.execute('SELECT * FROM competency_taxonomy')
    taxonomy = {r['id']: dict(r) for r in cursor.fetchall()}
    conn.close()
    
    # 4. Evaluate each skill using the 5-Factor Formula
    roadmap_nodes = []
    
    for s_id, tax in taxonomy.items():
        curr_info = student_skills_map.get(s_id, {})
        curr_lvl = curr_info.get('current_level', 0)
        retention = curr_info.get('retention_pct', 100.0) / 100.0
        forgetting_risk = curr_info.get('forgetting_risk_pct', 0.0) / 100.0
        confidence = curr_info.get('confidence_pct', 50.0) / 100.0
        
        exp_info = expected_map.get(s_id, {'expected_level': 3, 'priority': 'Medium'})
        exp_lvl = exp_info['expected_level']
        priority_str = exp_info.get('priority', 'Medium')
        
        # Factors calculation (normalized 0.0 to 1.0)
        # Factor 1: Knowledge Gap
        raw_gap = max(0, exp_lvl - curr_lvl)
        f_gap = min(1.0, raw_gap / 5.0)
        
        # Factor 2: Role Importance
        importance_map = {'Critical': 1.0, 'High': 0.8, 'Medium': 0.5, 'Low': 0.2}
        f_importance = importance_map.get(priority_str, 0.5)
        
        # Factor 3: Prerequisite Impact
        downstream_count = DOWNSTREAM_IMPACT.get(s_id, 0)
        f_prereq_impact = min(1.0, downstream_count / 3.0)
        
        # Factor 4: Forgetting Risk
        f_forgetting = forgetting_risk
        
        # Factor 5: Confidence Gap (Higher priority if system is uncertain or data is low)
        f_conf_gap = 1.0 - confidence
        
        # Composite Priority Score (0 to 100)
        priority_score = round((
            WEIGHTS['knowledge_gap'] * f_gap +
            WEIGHTS['role_importance'] * f_importance +
            WEIGHTS['prerequisite_impact'] * f_prereq_impact +
            WEIGHTS['forgetting_risk'] * f_forgetting +
            WEIGHTS['confidence_gap'] * f_conf_gap
        ) * 100, 1)
        
        # Determine Prerequisite Readiness Status
        prereqs = PREREQUISITE_GRAPH.get(s_id, [])
        unmet_prereqs = []
        for p_id in prereqs:
            p_lvl = student_skills_map.get(p_id, {}).get('current_level', 0)
            if p_lvl < 3: # Must have at least Level 3 in prerequisite
                unmet_prereqs.append(taxonomy.get(p_id, {}).get('skill_name', f'Skill #{p_id}'))
                
        if curr_lvl >= exp_lvl:
            status = 'Mastered'
        elif len(unmet_prereqs) > 0:
            status = 'Locked'
        else:
            status = 'Ready to Learn'
            
        roadmap_nodes.append({
            'skill_id': s_id,
            'skill_name': tax['skill_name'],
            'domain': tax['domain'],
            'current_level': curr_lvl,
            'expected_level': exp_lvl,
            'gap': raw_gap,
            'status': status,
            'priority_score': priority_score,
            'prerequisites': [taxonomy.get(pid, {}).get('skill_name', f'Skill #{pid}') for pid in prereqs],
            'unmet_prerequisites': unmet_prereqs,
            'downstream_dependents_count': downstream_count,
            'factor_breakdown': {
                'knowledge_gap': round(f_gap * 100, 1),
                'role_importance': round(f_importance * 100, 1),
                'prerequisite_impact': round(f_prereq_impact * 100, 1),
                'forgetting_risk': round(f_forgetting * 100, 1),
                'confidence': round(confidence * 100, 1)
            }
        })
        
    # Sort roadmap nodes by Priority Score descending
    roadmap_nodes.sort(key=lambda x: x['priority_score'], reverse=True)
    
    # 5. Group into Structured Learning Milestones
    milestones = [
        {
            'phase': 'Phase 1: Foundational Prerequisites',
            'objective': 'Master core survey methodology and statistical programming primitives',
            'skills': [n for n in roadmap_nodes if n['skill_id'] in [5, 7, 9]],
            'progress_pct': round(sum(min(1.0, n['current_level']/n['expected_level']) for n in roadmap_nodes if n['skill_id'] in [5, 7, 9]) / 3 * 100, 1)
        },
        {
            'phase': 'Phase 2: Core Divisional Competencies',
            'objective': 'Advanced macro accounts, price indexing, and CAPI field validation',
            'skills': [n for n in roadmap_nodes if n['skill_id'] in [1, 2, 3, 4, 6]],
            'progress_pct': round(sum(min(1.0, n['current_level']/n['expected_level']) for n in roadmap_nodes if n['skill_id'] in [1, 2, 3, 4, 6]) / 5 * 100, 1)
        },
        {
            'phase': 'Phase 3: AI & Statistical Modernization',
            'objective': 'Machine learning, big data administrative linkage, and SDG NIF tracking',
            'skills': [n for n in roadmap_nodes if n['skill_id'] in [8, 10, 11, 12]],
            'progress_pct': round(sum(min(1.0, n['current_level']/n['expected_level']) for n in roadmap_nodes if n['skill_id'] in [8, 10, 11, 12]) / 4 * 100, 1)
        }
    ]
    
    return {
        'employee_id': employee_id,
        'employee_name': emp_dict['name'],
        'designation': emp_dict['designation'],
        'department': emp_dict['department'],
        'roadmap_type': 'Prerequisite-Aware 5-Factor Knowledge Tracing Roadmap',
        'top_recommended_action': roadmap_nodes[0]['skill_name'] if roadmap_nodes else None,
        'milestones': milestones,
        'all_nodes': roadmap_nodes,
        'prerequisite_edges': [
            {'from': p_id, 'to': t_id, 'from_name': taxonomy.get(p_id, {}).get('skill_name', ''), 'to_name': taxonomy.get(t_id, {}).get('skill_name', '')}
            for t_id, p_list in PREREQUISITE_GRAPH.items() for p_id in p_list
        ]
    }
