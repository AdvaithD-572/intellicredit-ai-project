from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini import generate_response

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    context: str = "Acme Corp Financial Documents FY22-FY23"

@router.post("/")
async def submit_query(req: ChatRequest):
    """
    Mock endpoint for Document Chat Interface
    In a real app, this would use LangChain + LLM + Vector DB for Retrieval-Augmented Generation.
    """
    prompt = f"Act as an AI Credit Analyst. Answer this professional user query: '{req.query}'. Use the simulated context: '{req.context}'. Be concise, analytical, and provide clear answers based on typical financial data."
    
    ai_answer = await generate_response(prompt)
    
    return {
        "status": "success",
        "answer": ai_answer
    }
