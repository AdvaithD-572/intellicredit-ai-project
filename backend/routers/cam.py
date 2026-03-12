from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini import generate_response

router = APIRouter()

class CAMRequest(BaseModel):
    company_name: str
    loan_amount: int
    data_summary: str

@router.post("/generate")
async def generate_cam(req: CAMRequest):
    """
    Mock endpoint for CAM Generator
    Generates a full Credit Appraisal Memo.
    """
    prompt = f"Generate a detailed Credit Appraisal Memo (CAM) for '{req.company_name}' requesting a loan of ₹{req.loan_amount} Lakhs. Base it on this summary: '{req.data_summary}'. Organize into clear sections: Company Overview, Promoter Profile, Financial Analysis, Risk Assessment, Key Findings, and a final Loan Recommendation."
    
    cam_report = await generate_response(prompt)
    
    return {
        "status": "success",
        "company": req.company_name,
        "cam_report": cam_report
    }
