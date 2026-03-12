from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from services.gemini import generate_response

router = APIRouter()

class ResearchEvidence(BaseModel):
    source_name: str = Field(description="Name of the source (e.g., 'Economic Times', 'e-Courts')")
    url: Optional[str] = Field(description="Simulated URL to the source", default=None)
    snippet: str = Field(description="Exact verbatim quote from the article or filing")

class NewsItem(BaseModel):
    title: str = Field(description="Headline of the news or filing")
    date: str = Field(description="e.g., '2 weeks ago'")
    impact: str = Field(description="'Positive', 'Negative', 'Neutral'")
    relevance: str = Field(description="'Low', 'Medium', 'High', 'Critical'")
    evidence: ResearchEvidence

class ResearchRequest(BaseModel):
    company_name: str
    promoter_name: str = ""

@router.post("/")
async def perform_research(req: ResearchRequest):
    """
    Mock endpoint for Research Agent
    In a real app, this would use News APIs, scraping, and Neo4j for graphs.
    """
    prompt = f"""
    Simulate an AI research report for '{req.company_name}' and promoter '{req.promoter_name}'. Include simulated current news (positive and negative), legal disputes, and a brief promoter network risk analysis.
    You must return a valid JSON object matching this schema:
    {{
        "promoter_flags": ["string"],
        "news_items": [
            {{
                "title": "string",
                "date": "string",
                "impact": "Positive/Negative/Neutral",
                "relevance": "Low/Medium/High/Critical",
                "evidence": {{
                    "source_name": "string",
                    "url": "string valid URL or null",
                    "snippet": "string exact verbatim quote"
                }}
            }}
        ]
    }}
    """
    
    ai_report = await generate_response(prompt)
    
    import json
    try:
        clean_json = ai_report.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(clean_json)
    except Exception:
        # Fallback heavily requested structured mock data if Quota Exceeded
        parsed = {
            "promoter_flags": ["API Quota Exceeded: Could not run full scan. Displaying mock data.", "Requires manual verification."],
            "news_items": [
                {
                    "title": f"Strong Market Position maintained by {req.company_name} despite headwinds",
                    "date": "2 days ago",
                    "impact": "Positive",
                    "relevance": "High",
                    "evidence": {
                        "source_name": "Financial Times (Mock)",
                        "url": "https://example.com/news",
                        "snippet": "The company continues to demonstrate robust balance sheets..."
                    }
                }
            ]
        }
    
    return {
        "status": "success",
        "company": req.company_name,
        "research_findings": parsed
    }

@router.get("/search")
async def search_companies(q: str):
    """
    Mock endpoint for Autocomplete Search
    Uses Gemini to return a list of real companies matching the query.
    """
    if not q or len(q) < 2:
        return {"results": []}

    prompt = f"""
    You are a financial autocomplete engine. The user has typed: '{q}'.
    Return a valid JSON array of up to 5 real company names (strings only) that best match this query.
    For example, if they typed 'Tat', you might return ["Tata Motors", "Tata Consultancy Services", "Tata Steel", "Tata Power", "Tata Consumer Products"].
    Do not include any other text except the JSON array.
    """
    
    ai_response = await generate_response(prompt)
    with open("search_debug.txt", "w") as f:
        f.write(ai_response)
    
    import json
    import re
    try:
        # Try to find a JSON array within the response
        match = re.search(r'\[.*\]', ai_response, re.DOTALL)
        if match:
            clean_json = match.group(0)
            parsed_results = json.loads(clean_json)
        else:
            clean_json = ai_response.replace("```json", "").replace("```", "").strip()
            parsed_results = json.loads(clean_json)
            
        if not isinstance(parsed_results, list):
            parsed_results = [str(parsed_results)]
    except Exception as e:
        print(f"Search API Parsing Error: {e}")
        print(f"Raw ai_response: {ai_response}")
        # Graceful fallback if Gemini API throws Quota Exceeded or parsing fails
        import random
        suffixes = ["Corp", "Technologies", "Global", "Solutions", "Group"]
        parsed_results = [f"{q.capitalize()} {random.choice(suffixes)}"] + ["Tata Motors", "Reliance Industries", "Infosys", "HDFC Bank"]
        
    return {"results": parsed_results}
