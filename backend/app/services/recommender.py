import json
import sqlite3
from typing import Dict, List, Any
from app.database import get_db

def get_employee_recommendations(employee_id: int) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Fetch active gaps
    cursor.execute('''
        SELECT g.skill_id, g.domain, g.expected_level, g.actual_level, g.severity, ct.skill_name
        FROM gaps g
        JOIN competency_taxonomy ct ON g.skill_id = ct.id
        WHERE g.employee_id = ? AND g.status = 'open'
    ''', (employee_id,))
    gap_rows = cursor.fetchall()
    
    if not gap_rows:
        # Fallback to compute if empty
        from app.services.gap_engine import compute_employee_gaps
        compute_employee_gaps(employee_id)
        cursor.execute('''
            SELECT g.skill_id, g.domain, g.expected_level, g.actual_level, g.severity, ct.skill_name
            FROM gaps g
            JOIN competency_taxonomy ct ON g.skill_id = ct.id
            WHERE g.employee_id = ? AND g.status = 'open'
        ''', (employee_id,))
        gap_rows = cursor.fetchall()
        
    gap_map = {row['skill_id']: dict(row) for row in gap_rows}
    
    # 2. Fetch employee details
    cursor.execute('SELECT * FROM employees WHERE id = ?', (employee_id,))
    emp = cursor.fetchone()
    emp_role = emp['designation'] if emp else 'Officer'
    emp_dept = emp['department'] if emp else 'MoSPI'
    
    # 3. Fetch courses
    cursor.execute('SELECT * FROM courses')
    courses = [dict(c) for c in cursor.fetchall()]
    
    # 4. Fetch programmes
    cursor.execute('SELECT * FROM tpac_programmes')
    programmes = [dict(p) for p in cursor.fetchall()]
    
    recommendations = []
    
    severity_weights = {'Critical': 3.5, 'High': 2.5, 'Medium': 1.5, 'Low': 1.0}
    
    for c in courses:
        covered_ids = json.loads(c['skills_covered'])
        matched_gaps = [gap_map[sid] for sid in covered_ids if sid in gap_map]
        
        if matched_gaps:
            max_severity = max([g['severity'] for g in matched_gaps], key=lambda s: severity_weights.get(s, 1))
            weight = severity_weights.get(max_severity, 1.0)
            score = round(weight * len(matched_gaps) * 15.0 + 50.0, 1)
            
            matched_skill_names = [g['skill_name'] for g in matched_gaps]
            reason = f"Directly closes {max_severity} deficit in '{matched_skill_names[0]}' required for {emp_role} in {emp_dept}."
            
            recommendations.append({
                'id': len(recommendations) + 1,
                'item_id': c['id'],
                'item_type': 'course',
                'title': c['title'],
                'source': c['source'],
                'domain': c['domain'],
                'level': c['level'],
                'duration': c['duration'],
                'badge': c.get('badge', 'Certified'),
                'mode': 'Self-paced Online',
                'next_cohort': 'Immediate Access',
                'reason_text': reason,
                'rank_score': score,
                'skills_addressed': matched_skill_names,
                'skills_covered_ids': covered_ids,
                'description': c.get('description', '')
            })
            
    for p in programmes:
        covered_ids = json.loads(p['skills_covered'])
        matched_gaps = [gap_map[sid] for sid in covered_ids if sid in gap_map]
        
        if matched_gaps:
            max_severity = max([g['severity'] for g in matched_gaps], key=lambda s: severity_weights.get(s, 1))
            weight = severity_weights.get(max_severity, 1.0)
            score = round(weight * len(matched_gaps) * 18.0 + 55.0, 1)
            
            matched_skill_names = [g['skill_name'] for g in matched_gaps]
            reason = f"High-impact in-service residency by NSSTA/TPAC to bridge {max_severity} proficiency gaps in {emp_dept}."
            
            recommendations.append({
                'id': len(recommendations) + 1,
                'item_id': p['id'],
                'item_type': 'programme',
                'title': p['title'],
                'source': p['source'],
                'domain': p['domain'],
                'level': p['target_level'],
                'duration': p['duration'],
                'badge': 'NSSTA Fellowship',
                'mode': p['mode'],
                'next_cohort': p.get('next_cohort', 'Upcoming'),
                'reason_text': reason,
                'rank_score': score,
                'skills_addressed': matched_skill_names,
                'skills_covered_ids': covered_ids,
                'description': p.get('description', '')
            })
            
    # Sort descending by rank_score
    recommendations.sort(key=lambda x: x['rank_score'], reverse=True)
    
    # Store top recommendations in DB
    cursor.execute('DELETE FROM recommendations WHERE employee_id = ?', (employee_id,))
    for rec in recommendations[:10]:
        cursor.execute('''
            INSERT INTO recommendations (employee_id, item_id, item_type, title, source, domain, level, duration, reason_text, rank_score, skills_addressed, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ''', (employee_id, rec['item_id'], rec['item_type'], rec['title'], rec['source'], rec['domain'], rec['level'], rec['duration'], rec['reason_text'], rec['rank_score'], json.dumps(rec['skills_addressed'])))
        
    conn.commit()
    conn.close()
    
    return recommendations
