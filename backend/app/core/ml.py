# app/core/ml.py
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel
from app.services.data_preprocessor import DataPreprocessor

BASE_DIR = Path(__file__).resolve().parent.parent

BASE_MODEL = "vinai/phobert-base"
LORA_PATH = BASE_DIR / "services" / "models" / "fine-tuned_PhoBERT"

tokenizer = AutoTokenizer.from_pretrained(
    BASE_MODEL,
    use_fast=False
)

base_model = AutoModelForSequenceClassification.from_pretrained(
    BASE_MODEL,
    num_labels=3
)

model = PeftModel.from_pretrained(
    base_model,
    LORA_PATH
)

model.eval()

preprocessor = DataPreprocessor()
