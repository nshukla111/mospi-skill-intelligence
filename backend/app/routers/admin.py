from fastapi import APIRouter
from typing import Dict, Any, List
import json
from app.database import get_db

router = APIRouter(prefix='/api/admin', tags=['admin'])

@router.get('/heatmap', response_model=Dict[str, Any])
def get_org_heatmap():
    conn = get_db()
    cursor = conn.cursor()
    
    departments = [
        'National Accounts Division (NAD)',
        'Field Operations Division (FOD)',
        'Central Price Division (CPD)',
        'Economic Statistics Division (ESD)',
        'Social Statistics Division (SSD)'
    ]
    
    domains = [
        'National Accounts',
        'Price Statistics',
        'Survey Methodology',
        'Data Science & AI',
        'Governance & Quality',
        'SDGs & Indicators'
    ]
    
    matrix = []
    total_prof = 0
    total_cells = 0
    
    for dept in departments:
        cursor.execute('SELECT id FROM employees WHERE department = ?', (dept,))
        emp_ids = [r['id'] for r in cursor.fetchall()]
        emp_count = len(emp_ids) if emp_ids else 1
        
        for dom in domains:
            if emp_ids:
                q_marks = ','.join('?' for _ in emp_ids)
                cursor.execute(f'''
                    SELECT AVG(es.proficiency_level) as avg_p
                    FROM employee_skills es
                    JOIN competency_taxonomy ct ON es.skill_id = ct.id
                    WHERE es.employee_id IN ({q_marks}) AND ct.domain = ?
                ''', (*emp_ids, dom))
                row = cursor.fetchone()
                avg_val = round(row['avg_p'], 1) if row and row['avg_p'] is not None else 2.0
            else:
                avg_val = 2.0
                
            benchmark = 4.5 if dom.split()[0] in dept else 3.5
            gap = round(max(0, benchmark - avg_val), 1)
            
            if gap <= 0.5:
                status = 'Strong'
            elif gap <= 1.5:
                status = 'Moderate'
            else:
                status = 'Severe'
                
            matrix.append({
                'department': dept,
                'domain': dom,
                'average_proficiency': avg_val,
                'benchmark_proficiency': benchmark,
                'gap_score': gap,
                'officer_count': emp_count,
                'status': status
            })
            total_prof += avg_val
            total_cells += 1
            
    conn.close()
    
    org_readiness = round((total_prof / (total_cells * 5.0) * 100), 1) if total_cells > 0 else 74.2
    
    return {
        'departments': departments,
        'domains': domains,
        'matrix': matrix,
        'org_readiness_avg': org_readiness
    }

@router.get('/predictive', response_model=Dict[str, Any])
def get_predictive_analytics():
    return {
        'summary': 'Predictive assessment based on upcoming 2027 Economic Census automation, Big Data integration, and ISS retirement projections.',
        'forecast_horizon': '2026 - 2028 Strategic Horizon',
        'shortages': [
            {
                'domain': 'Data Science & AI',
                'skill_name': 'Machine Learning & Big Data Analytics',
                'current_capacity': 14,
                'projected_demand_2027': 65,
                'shortage_gap_pct': 78.5,
                'urgency': 'Critical',
                'recommended_action': 'Mandate NSSTA 5-Day HPC/AI Bootcamp and enroll 50 ISS officers in iGOT Python masterclass.'
            },
            {
                'domain': 'Price Statistics',
                'skill_name': 'Scanner & E-Commerce Data Price Indexing',
                'current_capacity': 8,
                'projected_demand_2027': 30,
                'shortage_gap_pct': 73.3,
                'urgency': 'High',
                'recommended_action': 'Organize international joint workshop with UNESCAP on web scraping and hedonic pricing.'
            },
            {
                'domain': 'Survey Methodology',
                'skill_name': 'CAPI Automated Quality Auditing',
                'current_capacity': 28,
                'projected_demand_2027': 75,
                'shortage_gap_pct': 62.7,
                'urgency': 'High',
                'recommended_action': 'Zonal training for SSS cadre supervisors on real-time anomaly detection scripts.'
            },
            {
                'domain': 'National Accounts',
                'skill_name': 'Supply-Use Tables & Double Deflation',
                'current_capacity': 19,
                'projected_demand_2027': 35,
                'shortage_gap_pct': 45.7,
                'urgency': 'Medium',
                'recommended_action': 'Cadre nomination for 2-Week NSSTA Greater Noida residential workshop.'
            }
        ],
        'cadre_distribution': [
            {'cadre': 'Indian Statistical Service (HAG/SAG/JAG)', 'officers': 120, 'readiness_pct': 76.4},
            {'cadre': 'Indian Statistical Service (STS/JTS)', 'officers': 180, 'readiness_pct': 68.2},
            {'cadre': 'Subordinate Statistical Service (SSO/JSO)', 'officers': 450, 'readiness_pct': 61.8}
        ]
    }
