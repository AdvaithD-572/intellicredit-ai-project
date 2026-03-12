import google.generativeai as genai
import sys

try:
    genai.configure(api_key='AIzaSyBzfxAT7VXoMDpdduYnZfYzcG-jjK9shKM')
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"FAILED WITH EXP: {type(e).__name__}")
    print(e)
