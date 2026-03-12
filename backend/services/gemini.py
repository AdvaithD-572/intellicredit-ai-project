import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini with the provided API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

# Determine which model to use. 
MODEL_NAME = "gemini-2.5-flash"

def get_gemini_model():
    if not GEMINI_API_KEY:
        return None
    return genai.GenerativeModel(MODEL_NAME)

async def generate_response(prompt: str) -> str:
    """Helper to generate a response from Gemini"""
    model = get_gemini_model()
    if not model:
        return f"[MOCK AI RESPONSE]: {prompt}"
        
    try:
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating Gemini response: {e}")
        # Return empty JSON array on error to prevent frontend crash
        if "risk_score" in prompt:
            return '{"risk_score": 0, "fraud_probability_percent": 0, "simulated_default_prob_percent": 0.0, "risk_factors": []}'
        elif "promoter_flags" in prompt:
            return '{"promoter_flags": [], "news_items": []}'
        return f"[ERROR]: Failed to get response from Gemini ({str(e)})"
