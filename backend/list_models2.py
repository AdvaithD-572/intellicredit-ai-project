import google.generativeai as genai
import sys
import streamlit as st

GEMINI_API_KEY = st.secrets["API_KEY"]

try:
    genai.configure(api_key='GEMINI_API_KEY')
    models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
    with open("models.txt", "w") as f:
        f.write("\n".join(models))
except Exception as e:
    print(e)
