import google.generativeai as genai
import sys

try:
    genai.configure(api_key='AIzaSyBzfxAT7VXoMDpdduYnZfYzcG-jjK9shKM')
    models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
    with open("models.txt", "w") as f:
        f.write("\n".join(models))
except Exception as e:
    print(e)
