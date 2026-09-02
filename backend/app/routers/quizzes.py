from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models.schemas import QuizGenerateRequest, QuizResponse, QuizSubmitRequest, QuizResultResponse
from app.services.quiz_generator import generate_quiz, submit_quiz_and_update_profile

router = APIRouter(prefix='/api/quizzes', tags=['quizzes'])

@router.post('/generate', response_model=Dict[str, Any])
def api_generate_quiz(req: QuizGenerateRequest):
    return generate_quiz(
        employee_id=req.employee_id or 1,
        domain=req.domain,
        skill_id=req.skill_id,
        document_text=req.document_text,
        num_questions=req.num_questions or 5
    )

@router.post('/{quiz_id}/submit', response_model=Dict[str, Any])
def api_submit_quiz(quiz_id: int, req: QuizSubmitRequest):
    result = submit_quiz_and_update_profile(quiz_id, req.employee_id, req.answers)
    if 'error' in result:
        raise HTTPException(status_code=404, detail=result['error'])
    return result
