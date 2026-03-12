import asyncio
import os
import sys

# ensure env vars
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()

from services import gemini

async def main():
    try:
        res = await gemini.generate_response("Testing risk_score output")
        print("Success!")
        print(res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
