# app/services/sentiment_service.py
import torch

LABEL_MAP = {
    0: "negative",
    1: "positive",
    2: "neutral"
}

def predict_sentiment(model, tokenizer, text, preprocessor):
    preprocessed_text = preprocessor.preprocess(text)

    encoded = tokenizer(
        preprocessed_text,
        truncation=True,
        padding="max_length",
        max_length=256,
        return_tensors="pt"
    )

    model.eval()
    with torch.no_grad():
        logits = model(**encoded).logits
        label = torch.argmax(logits, dim=1).item()

    return {
        "label": label,
        "sentiment": LABEL_MAP[label],
        "clean_text": preprocessed_text
    }
