import asyncio
import os
import sys

# ensure env vars
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()

from services import gemini
from routers.analysis import AnalysisRequest, analyze_risk

async def main():
    try:
        req = AnalysisRequest(company_data_summary="Acme Corp increased revenue by 20% but delayed vendor payments.")
        res = await analyze_risk(req)
        print("Success!")
        print(res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
