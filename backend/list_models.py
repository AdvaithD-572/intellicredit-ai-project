import google.generativeai as genai
import sys
import streamlit as st

GEMINI_API_KEY = st.secrets["API_KEY"]

try:
    genai.configure(api_key='GEMINI_API_KEY')
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"FAILED WITH EXP: {type(e).__name__}")
    print(e)
