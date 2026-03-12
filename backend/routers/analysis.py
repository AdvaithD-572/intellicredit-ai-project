from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from services.gemini import generate_response

router = APIRouter()

class Evidence(BaseModel):
    source_document: str = Field(description="Name of the source document")
    page_number: Optional[int] = Field(description="Page number of the document if applicable", default=None)
    snippet: str = Field(description="Exact verbatim quote from the source document that supports this claim")

class RiskFactor(BaseModel):
    category: str = Field(description="e.g., 'Fraud Pattern', 'Loan Stress', 'Revenue Anomalies'")
    flag: str = Field(description="Short title of the risk")
    description: str = Field(description="Detailed explanation of the risk")
    severity: str = Field(description="'Low', 'Medium', 'High', 'Critical'")
    evidence: Evidence

class AnalysisRequest(BaseModel):
    company_data_summary: str

@router.post("/")
async def analyze_risk(req: AnalysisRequest):
    """
    Mock endpoint for Financial & Risk Analysis Engine
    """
    prompt = f"""
    Given this brief corporate data summary: '{req.company_data_summary}', simulate a Financial and Risk Analysis.
    You must return a valid JSON object matching this schema:
    {{
        "risk_score": <int 0-100>,
        "fraud_probability_percent": <int 0-100>,
        "simulated_default_prob_percent": <float>,
        "risk_factors": [
            {{
                "category": "string",
                "flag": "string",
                "description": "string",
                "severity": "High/Medium/Low/Critical",
                "evidence": {{
                    "source_document": "string simulated filename",
                    "page_number": <int or null>,
                    "snippet": "string exact verbatim quote"
                }}
            }}
        ]
    }}
    Ensure all risk factors are backed by a believable 'snippet' of evidence.
    """
    
    analysis_report = await generate_response(prompt)
    
    # In a real app we'd parse this json string into the Pydantic models.
    # We leave it as a string here for the frontend to parse or we can attempt to parse it.
    import json
    print(f"RAW GEMINI OUTPUT:\n{analysis_report}\n-------------------")
    try:
        # Strip potential markdown formatting from Gemini
        clean_json = analysis_report.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(clean_json)
    except Exception as e:
        print(f"JSON PARSE ERROR: {e}")
        parsed = {"error": "Failed to parse AI response", "raw": analysis_report}
    
    return {
        "status": "success",
        "risk_analysis": parsed
    }
