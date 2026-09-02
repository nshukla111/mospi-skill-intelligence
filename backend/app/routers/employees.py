import json
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.database import get_db
from app.models.schemas import EmployeeResponse, EmployeeGapsResponse, RecommendationItem, OnboardingRequest
from app.services.gap_engine import compute_employee_gaps
from app.services.recommender import get_employee_recommendations
from app.services.roadmap_engine import generate_personalized_roadmap
from app.services.knowledge_tracing import get_student_model

router = APIRouter(prefix='/api/employees', tags=['employees'])

@router.get('', response_model=List[Dict[str, Any]])
def list_employees():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM employees')
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@router.post('/onboard', response_model=Dict[str, Any])
def onboard_employee(req: OnboardingRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    # Insert new employee
    trainings = [{'title': t, 'year': 2024} for t in req.past_trainings]
    cursor.execute('''
        INSERT INTO employees (name, designation, department, cadre, qualifications, experience_years, email, location, past_trainings, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ''', (
        req.name, req.designation, req.department, req.cadre, 
        req.qualifications, req.experience_years, 
        req.email or f"{req.name.lower().replace(' ', '.')}.iss@nic.in", 
        req.location, json.dumps(trainings)
    ))
    new_id = cursor.lastrowid
    
    # Insert initial self-reported skills
    for s_id_str, level in req.self_reported_skills.items():
        try:
            s_id = int(s_id_str)
            cursor.execute('''
                INSERT INTO employee_skills (employee_id, skill_id, proficiency_level, source, last_assessed)
                VALUES (?, ?, ?, 'self-report', datetime('now'))
            ''', (new_id, s_id, level))
        except Exception:
            pass
            
    # Initial log
    cursor.execute('''
        INSERT INTO progress_log (employee_id, event_type, title, description, related_id, timestamp)
        VALUES (?, 'profile_onboarded', 'Official Onboarded via SSO', 'Diagnostic Questionnaire Completed', ?, datetime('now'))
    ''', (new_id, new_id))
    
    conn.commit()
    conn.close()
    
    # Compute initial gaps, recommendations, and roadmap
    gaps = compute_employee_gaps(new_id)
    recs = get_employee_recommendations(new_id)
    roadmap = generate_personalized_roadmap(new_id)
    
    return {
        'employee_id': new_id,
        'employee': {
            'id': new_id,
            'name': req.name,
            'designation': req.designation,
            'department': req.department,
            'cadre': req.cadre,
            'qualifications': req.qualifications,
            'experience_years': req.experience_years,
            'location': req.location,
            'past_trainings': trainings
        },
        'gaps': gaps,
        'recommendations': recs[:4],
        'roadmap': roadmap,
        'message': 'Official onboarded and initial competency diagnostic report generated.'
    }

@router.get('/{employee_id}', response_model=Dict[str, Any])
def get_employee(employee_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM employees WHERE id = ?', (employee_id,))
    emp = cursor.fetchone()
    if not emp:
        conn.close()
        raise HTTPException(status_code=404, detail='Employee not found')
        
    emp_dict = dict(emp)
    
    cursor.execute('''
        SELECT es.skill_id, es.proficiency_level, es.source, ct.domain, ct.skill_name
        FROM employee_skills es
        JOIN competency_taxonomy ct ON es.skill_id = ct.id
        WHERE es.employee_id = ?
    ''', (employee_id,))
    emp_dict['skills'] = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return emp_dict

@router.get('/{employee_id}/gaps', response_model=Dict[str, Any])
def get_gaps(employee_id: int):
    result = compute_employee_gaps(employee_id)
    if 'error' in result:
        raise HTTPException(status_code=404, detail=result['error'])
    return result

@router.get('/{employee_id}/recommendations', response_model=List[Dict[str, Any]])
def get_recommendations(employee_id: int):
    return get_employee_recommendations(employee_id)

@router.get('/{employee_id}/roadmap', response_model=Dict[str, Any])
def get_roadmap(employee_id: int):
    result = generate_personalized_roadmap(employee_id)
    if 'error' in result:
        raise HTTPException(status_code=404, detail=result['error'])
    return result

@router.get('/{employee_id}/student-model', response_model=Dict[str, Any])
def get_student_model_api(employee_id: int):
    return get_student_model(employee_id)

@router.get('/{employee_id}/progress', response_model=List[Dict[str, Any]])
def get_progress(employee_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM progress_log WHERE employee_id = ? ORDER BY timestamp DESC', (employee_id,))
    logs = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return logs
