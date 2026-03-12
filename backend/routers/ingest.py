from fastapi import APIRouter, File, UploadFile
from typing import List
from services.gemini import generate_response

router = APIRouter()

@router.post("/")
async def ingest_documents(files: List[UploadFile] = File(...)):
    """
    Mock endpoint for Data Ingestion Module
    In a real app, this would use PaddleOCR and Unstructured to parse the files.
    """
    filenames = [file.filename for file in files]
    
    # Simulate extraction using Gemini to generate a realistic summary
    prompt = f"Simulate a data extraction summary for the following uploaded corporate documents: {filenames}. Return JSON data outlining key extracted entities like revenue, profit, debt, and flag any immediate financial anomalies."
    ai_summary = await generate_response(prompt)
    
    return {
        "status": "success",
        "message": f"Successfully ingested {len(files)} documents.",
        "extracted_data": ai_summary
    }
