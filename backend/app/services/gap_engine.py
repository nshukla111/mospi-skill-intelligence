import json
import sqlite3
from typing import Dict, List, Any
from app.database import get_db

def compute_employee_gaps(employee_id: int) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Fetch employee
    cursor.execute('SELECT * FROM employees WHERE id = ?', (employee_id,))
    emp = cursor.fetchone()
    if not emp:
        conn.close()
        return {'error': 'Employee not found'}
        
    emp_dict = dict(emp)
    
    # 2. Fetch employee current skills
    cursor.execute('''
        SELECT es.skill_id, es.proficiency_level, es.source, ct.domain, ct.skill_name, ct.description
        FROM employee_skills es
        JOIN competency_taxonomy ct ON es.skill_id = ct.id
        WHERE es.employee_id = ?
    ''', (employee_id,))
    current_skills_rows = cursor.fetchall()
    current_skills = {row['skill_id']: dict(row) for row in current_skills_rows}
    
    # 3. Fetch Job Role Reference benchmark
    cursor.execute('SELECT * FROM job_role_reference WHERE designation = ? AND department = ?', 
                   (emp_dict['designation'], emp_dict['department']))
    role = cursor.fetchone()
    
    # If not exact match, fallback by designation or first role
    if not role:
        cursor.execute('SELECT * FROM job_role_reference WHERE designation = ?', (emp_dict['designation'],))
        role = cursor.fetchone()
    if not role:
        cursor.execute('SELECT * FROM job_role_reference LIMIT 1')
        role = cursor.fetchone()
        
    expected_skills_list = json.loads(role['expected_skills']) if role else []
    
    # 4. Fetch all taxonomy skills to fill missing
    cursor.execute('SELECT * FROM competency_taxonomy')
    taxonomy_rows = {row['id']: dict(row) for row in cursor.fetchall()}
    
    # 5. Compute gaps
    all_gaps = []
    domain_groups = {}
    total_expected = 0
    total_actual = 0
    critical_count = 0
    high_count = 0
    
    # Clear old gaps in DB for fresh calculation
    cursor.execute('DELETE FROM gaps WHERE employee_id = ?', (employee_id,))
    
    for exp in expected_skills_list:
        s_id = exp['skill_id']
        tax_info = taxonomy_rows.get(s_id, {'domain': 'General', 'skill_name': f'Skill #{s_id}'})
        expected_lvl = exp['expected_level']
        priority = exp.get('priority', 'Medium')
        
        curr_lvl = current_skills.get(s_id, {}).get('proficiency_level', 0)
        gap_val = max(0, expected_lvl - curr_lvl)
        
        # Severity calculation per framework
        if gap_val == 0:
            severity = 'Proficient'
            status = 'closed'
        elif gap_val >= 3 or (gap_val >= 2 and priority == 'Critical'):
            severity = 'Critical'
            status = 'open'
            critical_count += 1
        elif gap_val == 2 or (gap_val == 1 and priority == 'High'):
            severity = 'High'
            status = 'open'
            high_count += 1
        else:
            severity = 'Medium'
            status = 'open'
            
        gap_obj = {
            'skill_id': s_id,
            'skill_name': tax_info['skill_name'],
            'domain': tax_info['domain'],
            'expected_level': expected_lvl,
            'actual_level': curr_lvl,
            'gap_value': gap_val,
            'severity': severity,
            'priority': priority,
            'status': status
        }
        all_gaps.append(gap_obj)
        
        # Insert into DB
        cursor.execute('''
            INSERT INTO gaps (employee_id, domain, skill_id, expected_level, actual_level, severity, status, last_updated)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ''', (employee_id, tax_info['domain'], s_id, expected_lvl, curr_lvl, severity, status))
        
        total_expected += expected_lvl
        total_actual += min(curr_lvl, expected_lvl)
        
        domain = tax_info['domain']
        if domain not in domain_groups:
            domain_groups[domain] = {'expected': [], 'actual': [], 'skills': [], 'critical': 0}
        domain_groups[domain]['expected'].append(expected_lvl)
        domain_groups[domain]['actual'].append(curr_lvl)
        domain_groups[domain]['skills'].append(gap_obj)
        if severity in ['Critical', 'High']:
            domain_groups[domain]['critical'] += 1

    conn.commit()
    conn.close()
    
    # 6. Build Domain Summaries & Radar Data
    domain_summaries = []
    radar_data = []
    
    for dom, data in domain_groups.items():
        exp_avg = round(sum(data['expected']) / len(data['expected']), 2) if data['expected'] else 0
        act_avg = round(sum(data['actual']) / len(data['actual']), 2) if data['actual'] else 0
        gap_score = round(max(0, exp_avg - act_avg), 2)
        
        domain_summaries.append({
            'domain': dom,
            'expected_avg': exp_avg,
            'actual_avg': act_avg,
            'gap_score': gap_score,
            'critical_skills_count': data['critical'],
            'skills': data['skills']
        })
        
        radar_data.append({
            'subject': dom,
            'Expected': exp_avg,
            'Actual': act_avg,
            'fullMark': 5
        })
        
    readiness_pct = round((total_actual / total_expected * 100), 1) if total_expected > 0 else 100.0
    
    return {
        'employee_id': employee_id,
        'employee_name': emp_dict['name'],
        'designation': emp_dict['designation'],
        'department': emp_dict['department'],
        'overall_readiness_pct': readiness_pct,
        'total_gaps_count': sum(1 for g in all_gaps if g['status'] == 'open'),
        'critical_gaps_count': critical_count,
        'high_gaps_count': high_count,
        'domain_summaries': domain_summaries,
        'radar_data': radar_data,
        'all_gaps': all_gaps
    }
