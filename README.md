# MoSPI Skill Intelligence Platform
### Smart India Hackathon 2026 · Problem Statement 26101 · Sponsor: MoSPI
**AI-Powered Competency Mapping, Dynamic Gap Analysis & Course Recommendation System for the Indian Statistical Service (ISS) & Subordinate Statistical Service (SSS)**

---

## 🏛️ Executive Summary

The **MoSPI Skill Intelligence Platform** is an enterprise-grade AI system engineered specifically for the **Ministry of Statistics and Programme Implementation (MoSPI)** to modernize civil servant competency frameworks. It maps official profiles against dynamic job benchmarks, identifies competency deficits with automated severity levels, and connects officials with **iGOT Karmayogi** online micro-credentials and **NSSTA / TPAC** in-service residential fellowships.

---

## 🏗️ 4-Layer System Architecture

```
+-----------------------------------------------------------------------------------+
| 1. FRONTEND LAYER (React 19 + Vite + Tailwind CSS + Recharts + Lucide Icons)       |
|    - Official/Employee Dashboard    - Competency Radar & Multi-Domain Gap Engine  |
|    - AI Assessment Center (MCQs)    - Admin Competency Heatmap Matrix             |
|    - Predictive Shortage Forecaster - Docked Karmayogi AI Assistant               |
+------------------------------------------+----------------------------------------+
                                           | REST APIs
                                           v
+-----------------------------------------------------------------------------------+
| 2. AI APPLICATION CORE (Python + FastAPI)                                         |
|    - Gap Analysis Engine (gap_engine.py)                                          |
|    - Semantic Recommendation Matcher & Ranker (recommender.py)                     |
|    - Document Text Extractor & MCQ Quiz Generator (quiz_generator.py)             |
|    - Karmayogi Statistical AI Assistant (assistant.py)                            |
+--------------------+-------------------------------------+------------------------+
                     |                                     |
                     v                                     v
+-----------------------------------+     +-----------------------------------------+
| 3. DATA LAYER                     |     | 4. EXTERNAL INTEGRATIONS                |
|    - SQLite / PostgreSQL DB       |     |    - iGOT Karmayogi API Adapter         |
|    - MoSPI Competency Taxonomy    |     |    - NSSTA / TPAC Calendar Sync         |
|    - ISS/SSS Job Benchmarks       |     |    - SSO / RBAC Gateway Simulation      |
|    - Progress & Assessment Logs   |     +-----------------------------------------+
+-----------------------------------+
```

---

## 🔄 End-to-End Data Flow

1. **Authentication & Profile Load**: Official logs in via SSO → System loads their current designations, qualifications, and past trainings.
2. **AI Gap Computation**: The AI Core compares known skills against the benchmark expected skills for their specific division (e.g. National Accounts Division Director vs Field Operations Division SSO).
3. **Automated Severity Categorization**: Calculates severity (`Critical`, `High`, `Medium`, `Proficient`) for each domain.
4. **Ranked Learning Pathways**: Ranks iGOT Karmayogi courses and NSSTA/TPAC training programs with natural language explanations ("*Directly closes Critical deficit in SNA 2008 & Quarterly GVA required for Director role*").
5. **Interactive AI Assessment**: Official takes a domain quiz or uploads a statistical guideline document → Instant grading & feedback.
6. **Real-time Closed-Loop Profile Refresh**: Scoring $\ge 60\%$ automatically upgrades proficiency levels in the database and recalculates the radar/gap matrix instantly!
7. **Cadre Analytics**: HR Admins and NSSTA Deans view division-wide heatmaps and forecast strategic skill shortages for 2026–2028.

---

## 📊 MoSPI Competency Domains Seeded

- **National Accounts**: SNA 2008 Methodology, GDP/GVA Compilation, Supply-Use Tables (SUT), Double Deflation, FISIM Allocation.
- **Price Statistics**: Consumer Price Index (CPI), Index of Industrial Production (IIP), Jevons Elementary Aggregates.
- **Survey Methodology**: PLFS/NSS Multi-Stage Stratified Sampling, Rotational Panel Design, CAPI Field Validations.
- **Data Science & AI**: Python & Polars Data Wrangling, Record Linkage (GSTN/MCA), Machine Learning for Official Statistics.
- **Governance & Quality**: National Quality Assurance Framework (NQAF), SDMX Metadata Registries, Collection of Statistics Act (CSA) 2008.
- **SDGs & Indicators**: National Indicator Framework (NIF) Tracking, Sub-National Localization, Alkire-Foster MPI.

---

## 🚀 How to Run the Platform

### 1. Start Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
Open: `http://localhost:5173`

### 2. (Optional) Run FastAPI Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
API Documentation & Swagger UI: `http://localhost:8000/docs`

*(Note: The Frontend includes a built-in seamless offline/embedded state engine, ensuring full functionality and interactive assessment features even before the backend server is launched).*

---

## 🧪 Verification & Testing

To run the backend test suite:
```bash
python test_backend.py
```
Outputs validation across Database, Gap Analysis Engine, Recommendation Matcher, Quiz Generator, and AI Assistant.
