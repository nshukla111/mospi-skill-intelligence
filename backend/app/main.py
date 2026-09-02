from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import employees, quizzes, admin, assistant

app = FastAPI(
    title='MoSPI Skill Intelligence Platform API (SIH26101)',
    description='AI-powered competency mapping, gap analysis & course recommendation engine for Indian Statistical Service (ISS) & Subordinate Statistical Service (SSS) officials.',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.on_event('startup')
def startup_event():
    init_db()

app.include_router(employees.router)
app.include_router(quizzes.router)
app.include_router(admin.router)
app.include_router(assistant.router)

@app.get('/')
def root():
    return {
        'system': 'MoSPI Skill Intelligence Platform',
        'problem_statement': 'SIH2026 Problem Statement 26101',
        'sponsor': 'Ministry of Statistics and Programme Implementation (MoSPI)',
        'status': 'Operational',
        'docs_url': '/docs'
    }

@app.get('/api/health')
def health_check():
    return {'status': 'healthy', 'layer': 'AI Application Core'}
