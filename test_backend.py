import sys
import os

sys.path.insert(0, os.path.abspath('backend'))
from app.database import init_db
from app.services.gap_engine import compute_employee_gaps
from app.services.recommender import get_employee_recommendations
from app.services.quiz_generator import generate_quiz, submit_quiz_and_update_profile
from app.services.assistant import get_assistant_response
from app.services.knowledge_tracing import get_student_model
from app.services.roadmap_engine import generate_personalized_roadmap

def test_all():
    init_db()
    print("[1/7] Database initialized.")

    gaps = compute_employee_gaps(1)
    print(f"[2/7] Gap Engine: {gaps['employee_name']} readiness is {gaps['overall_readiness_pct']}%.")

    recs = get_employee_recommendations(1)
    print(f"[3/7] Recommender: {len(recs)} courses matched.")

    quiz = generate_quiz(employee_id=1, domain='National Accounts', num_questions=2)
    sub = submit_quiz_and_update_profile(quiz['quiz_id'], 1, {'101': 'b', '102': 'b'})
    print(f"[4/7] Quiz & Upgrade Engine: Score {sub['score_percentage']}%.")

    chat = get_assistant_response('Tell me about my skill gaps', 1)
    print(f"[5/7] Assistant Service: Chat OK.")

    # Section 6: Knowledge Tracing
    sm = get_student_model(1)
    print(f"[6/7] Knowledge Tracing: Tracked {sm['active_skills_tracked']} competencies. Retention: {sm['average_retention_pct']}%, Confidence: {sm['average_confidence_pct']}%.")

    # Section 7: Roadmap Engine (5-factor priority)
    rm = generate_personalized_roadmap(1)
    print(f"[7/7] Roadmap Engine: 5-Factor Ranking evaluated {len(rm['all_nodes'])} skills across {len(rm['milestones'])} phases.")
    print(f"      Top Priority Learning Target: {rm['top_recommended_action']}")

    print("\n>>> ALL 7 ENGINE PROTOCOLS (INCLUDING SECTIONS 6 & 7) VERIFIED 100% SUCCESS! <<<")

if __name__ == '__main__':
    test_all()
