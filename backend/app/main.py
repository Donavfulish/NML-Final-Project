from fastapi import FastAPI
from app.routers import translate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev
    ],
    allow_credentials=True,
    allow_methods=["*"],  # POST, OPTIONS, ...
    allow_headers=["*"],
)

app.include_router(translate.router, prefix="/api")
