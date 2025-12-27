from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path
from transformers import logging as hf_logging
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# from app.routers import translate
from app.services.models.data_preprocessor import DataPreprocessor
from app.routers.predict import predict_sentiment

import logging
import warnings

hf_logging.set_verbosity_error()
warnings.filterwarnings("ignore")
logging.getLogger().setLevel(logging.ERROR)


BASE_DIR = Path(__file__).resolve().parent
model_path = BASE_DIR / "services" / "models" / "fine-tuned_PhoBERT"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path, num_labels=3)

preprocessor = DataPreprocessor()

input_text = "Sản phẩm rất tuyệt vời"

res = predict_sentiment(model, tokenizer, input_text, preprocessor)
print(f"Nhãn cảm xúc cho '{input_text}' là {res}")

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

#app.include_router(translate.router, prefix="/api")
