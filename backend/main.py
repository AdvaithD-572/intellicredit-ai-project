import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="IntelliCredit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# We will import routers here later
from routers import ingest, research, analysis, chat, cam

app.include_router(ingest.router, prefix="/api/ingest", tags=["Ingestion"])
app.include_router(research.router, prefix="/api/research", tags=["Research"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(cam.router, prefix="/api/cam", tags=["CAM Generator"])

@app.get("/")
def read_root():
    return {"message": "Welcome to IntelliCredit API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
