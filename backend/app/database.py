import os
import json
import sqlite3
from typing import Dict, List, Any, Optional

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data'))
DB_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'skill_intel.db'))

def load_seed_json(filename: str) -> Any:
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def get_db():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        designation TEXT NOT NULL,
        department TEXT NOT NULL,
        cadre TEXT,
        qualifications TEXT,
        experience_years INTEGER,
        email TEXT,
        location TEXT,
        past_trainings TEXT,
        created_at TEXT
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS competency_taxonomy (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        description TEXT
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS job_role_reference (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        designation TEXT NOT NULL,
        department TEXT NOT NULL,
        cadre TEXT,
        expected_skills TEXT
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS employee_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        skill_id INTEGER NOT NULL,
        proficiency_level INTEGER NOT NULL,
        source TEXT,
        last_assessed TEXT,
        FOREIGN KEY (employee_id) REFERENCES employees(id),
        FOREIGN KEY (skill_id) REFERENCES competency_taxonomy(id)
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS gaps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        domain TEXT NOT NULL,
        skill_id INTEGER NOT NULL,
        expected_level INTEGER NOT NULL,
        actual_level INTEGER NOT NULL,
        severity TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        last_updated TEXT,
        FOREIGN KEY (employee_id) REFERENCES employees(id),
        FOREIGN KEY (skill_id) REFERENCES competency_taxonomy(id)
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        source TEXT DEFAULT 'iGOT Karmayogi',
        domain TEXT NOT NULL,
        skills_covered TEXT,
        level TEXT,
        duration TEXT,
        badge TEXT,
        description TEXT
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS tpac_programmes (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        source TEXT DEFAULT 'NSSTA / TPAC',
        domain TEXT NOT NULL,
        skills_covered TEXT,
        target_level TEXT,
        duration TEXT,
        mode TEXT,
        intake_capacity INTEGER,
        next_cohort TEXT,
        description TEXT
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        item_type TEXT NOT NULL,
        title TEXT,
        source TEXT,
        domain TEXT,
        level TEXT,
        duration TEXT,
        reason_text TEXT,
        rank_score REAL,
        skills_addressed TEXT,
        created_at TEXT,
        FOREIGN KEY (employee_id) REFERENCES employees(id)
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        domain TEXT,
        title TEXT,
        source_document TEXT,
        questions TEXT NOT NULL,
        created_at TEXT
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        score REAL NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_count INTEGER NOT NULL,
        answers TEXT,
        feedback TEXT,
        skills_upgraded TEXT,
        completed_at TEXT,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
        FOREIGN KEY (employee_id) REFERENCES employees(id)
    )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS progress_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        related_id INTEGER,
        timestamp TEXT,
        FOREIGN KEY (employee_id) REFERENCES employees(id)
    )''')
    
    conn.commit()
    
    cursor.execute('SELECT COUNT(*) FROM competency_taxonomy')
    if cursor.fetchone()[0] == 0:
        seed_database(conn)
        
    conn.close()

def seed_database(conn):
    cursor = conn.cursor()
    
    tax_data = load_seed_json('taxonomy.json')
    for item in tax_data:
        cursor.execute(
            'INSERT INTO competency_taxonomy (id, domain, skill_name, description) VALUES (?, ?, ?, ?)',
            (item['id'], item['domain'], item['skill_name'], item['description'])
        )
        
    role_data = load_seed_json('job_roles.json')
    for item in role_data:
        cursor.execute(
            'INSERT INTO job_role_reference (id, designation, department, cadre, expected_skills) VALUES (?, ?, ?, ?, ?)',
            (item['id'], item['designation'], item['department'], item.get('cadre', ''), json.dumps(item['expected_skills']))
        )
        
    course_data = load_seed_json('courses.json')
    for item in course_data:
        cursor.execute(
            'INSERT INTO courses (id, title, source, domain, skills_covered, level, duration, badge, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (item['id'], item['title'], item['source'], item['domain'], json.dumps(item['skills_covered']), item['level'], item['duration'], item.get('badge', ''), item.get('description', ''))
        )
        
    prog_data = load_seed_json('programmes.json')
    for item in prog_data:
        cursor.execute(
            'INSERT INTO tpac_programmes (id, title, source, domain, skills_covered, target_level, duration, mode, intake_capacity, next_cohort, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (item['id'], item['title'], item['source'], item['domain'], json.dumps(item['skills_covered']), item['target_level'], item['duration'], item['mode'], item.get('intake_capacity', 30), item.get('next_cohort', ''), item.get('description', ''))
        )
        
    emp_data = load_seed_json('employees.json')
    for item in emp_data:
        cursor.execute(
            'INSERT INTO employees (id, name, designation, department, cadre, qualifications, experience_years, email, location, past_trainings, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (item['id'], item['name'], item['designation'], item['department'], item.get('cadre', ''), item.get('qualifications', ''), item.get('experience_years', 0), item.get('email', ''), item.get('location', ''), json.dumps(item.get('past_trainings', [])), item.get('created_at', ''))
        )
        for s in item.get('skills', []):
            cursor.execute(
                'INSERT INTO employee_skills (employee_id, skill_id, proficiency_level, source, last_assessed) VALUES (?, ?, ?, ?, ?)',
                (item['id'], s['skill_id'], s['proficiency_level'], s.get('source', 'self-report'), item.get('created_at', ''))
            )
            
        cursor.execute(
            'INSERT INTO progress_log (employee_id, event_type, title, description, related_id, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
            (item['id'], 'profile_onboarded', 'Official Profile Initialized', f'Profile loaded for {item["name"]} ({item["designation"]})', item['id'], item.get('created_at', '2026-01-15T09:00:00Z'))
        )
        
    conn.commit()
