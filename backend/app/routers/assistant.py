from fastapi import APIRouter
from typing import Dict, Any
from app.models.schemas import ChatRequest, ChatResponse
from app.services.assistant import get_assistant_response

router = APIRouter(prefix='/api/assistant', tags=['assistant'])

@router.post('/chat', response_model=Dict[str, Any])
def chat_assistant(req: ChatRequest):
    return get_assistant_response(req.message, req.employee_id or 1)
