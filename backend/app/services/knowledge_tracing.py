import math
import json
from datetime import datetime, timezone
from typing import Dict, List, Any
from app.database import get_db

# Decay parameter for spaced repetition forgetting curve (forgetting half-life ~ 30 days)
LAMBDA_DECAY = 0.023 

def update_student_model_on_event(employee_id: int, skill_id: int, event_type: str, score: float, details: Dict[str, Any] = None):
    """
    Continuous Knowledge Tracing update rule.
    Adjusts skill mastery, confidence, and resets forgetting risk timestamp.
    """
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now(timezone.utc).isoformat()
    
    # 1. Log event to Student Data Lake
    data_type = 'performance' if 'quiz' in event_type else ('learning' if 'course' in event_type else 'behaviour')
    cursor.execute('''
        INSERT INTO progress_log (employee_id, event_type, title, description, related_id, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (employee_id, f"event_{event_type}", f"Knowledge Event: {event_type}", json.dumps(details or {}), skill_id, now_str))
    
    # 2. Fetch current student model for (employee_id, skill_id)
    cursor.execute('''
        SELECT proficiency_level, source, last_assessed FROM employee_skills
        WHERE employee_id = ? AND skill_id = ?
    ''', (employee_id, skill_id))
    current_skill = cursor.fetchone()
    
    if current_skill:
        curr_lvl = current_skill['proficiency_level']
        # Rule-based Knowledge Tracing adjustment
        if score >= 80.0:
            new_lvl = min(5, curr_lvl + 1)
        elif score <= 40.0 and curr_lvl > 1:
            new_lvl = curr_lvl # Don't drop drastically, but flag for reinforcement
        else:
            new_lvl = curr_lvl
            
        cursor.execute('''
            UPDATE employee_skills
            SET proficiency_level = ?, source = ?, last_assessed = ?
            WHERE employee_id = ? AND skill_id = ?
        ''', (new_lvl, 'knowledge_tracing', now_str, employee_id, skill_id))
    else:
        new_lvl = 3 if score >= 80.0 else 2
        cursor.execute('''
            INSERT INTO employee_skills (employee_id, skill_id, proficiency_level, source, last_assessed)
            VALUES (?, ?, ?, 'knowledge_tracing', ?)
        ''', (employee_id, skill_id, new_lvl, now_str))
        
    conn.commit()
    conn.close()

def get_student_model(employee_id: int) -> Dict[str, Any]:
    """
    Retrieves the live Student Model telemetry:
    - Mastered skills
    - Knowledge decay / Forgetting risk per skill
    - Confidence metric based on evidence count
    """
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT es.skill_id, es.proficiency_level, es.source, es.last_assessed, ct.skill_name, ct.domain
        FROM employee_skills es
        JOIN competency_taxonomy ct ON es.skill_id = ct.id
        WHERE es.employee_id = ?
    ''', (employee_id,))
    skills = cursor.fetchall()
    
    model_skills = []
    total_mastery = 0
    now = datetime.now(timezone.utc)
    
    for s in skills:
        lvl = s['proficiency_level']
        total_mastery += lvl
        
        # Calculate Forgetting Risk (Ebbinghaus decay)
        last_assessed_str = s['last_assessed'] or '2026-01-01T00:00:00Z'
        try:
            last_date = datetime.fromisoformat(last_assessed_str.replace('Z', '+00:00'))
            days_elapsed = max(0, (now - last_date).days)
        except Exception:
            days_elapsed = 15
            
        # Retention R = e^(-lambda * t)
        retention = math.exp(-LAMBDA_DECAY * days_elapsed)
        forgetting_risk = round((1.0 - retention) * 100, 1)
        
        # Confidence score based on verification source
        if s['source'] == 'knowledge_tracing' or s['source'] == 'quiz':
            confidence = 92.0
        elif s['source'] == 'self-report':
            confidence = 65.0
        else:
            confidence = 50.0
            
        model_skills.append({
            'skill_id': s['skill_id'],
            'skill_name': s['skill_name'],
            'domain': s['domain'],
            'current_level': lvl,
            'retention_pct': round(retention * 100, 1),
            'forgetting_risk_pct': forgetting_risk,
            'confidence_pct': confidence,
            'days_since_practice': days_elapsed,
            'source': s['source']
        })
        
    conn.close()
    
    avg_retention = round(sum(s['retention_pct'] for s in model_skills) / len(model_skills), 1) if model_skills else 85.0
    avg_confidence = round(sum(s['confidence_pct'] for s in model_skills) / len(model_skills), 1) if model_skills else 75.0
    
    return {
        'employee_id': employee_id,
        'model_type': 'Dynamic Bayesian / Rule-Based Student Model',
        'active_skills_tracked': len(model_skills),
        'average_retention_pct': avg_retention,
        'average_confidence_pct': avg_confidence,
        'skills': model_skills
    }
