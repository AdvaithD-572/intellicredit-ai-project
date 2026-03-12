import google.generativeai as genai
import sys

try:
    genai.configure(api_key='AIzaSyBzfxAT7VXoMDpdduYnZfYzcG-jjK9shKM')
    m = genai.GenerativeModel('gemini-pro')
    response = m.generate_content('Hello')
    print("SUCCESS:", response.text)
except Exception as e:
    print(f"FAILED WITH EXP: {type(e).__name__}")
    print(e)
