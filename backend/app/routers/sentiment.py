# app/routers/sentiment.py
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import pandas as pd
import io

from app.core.ml import model, tokenizer, preprocessor
from app.services.sentiment_service import predict_sentiment

router = APIRouter(prefix="/api", tags=["Sentiment"])

class TextRequest(BaseModel):
    text: str

insight = {
    'positive': 'tích cực',
    'negative': 'tiêu cực',
    'neutral': 'trung tính'
}

@router.post("/sentiment/text")
def analyze_text(req: TextRequest):
    result = predict_sentiment(
        model, tokenizer, req.text, preprocessor
    )
    return {
        "input_text": req.text,
        "clean_text": result["clean_text"],
        "label": result["label"],
        "sentiment": result["sentiment"],
        "insight": f"Câu này thể hiện cảm xúc {insight[result['sentiment']]}"
    }

@router.post("/sentiment/csv")

async def analyze_csv(file: UploadFile = File(...)):
    content = await file.read()

    for enc in ["utf-8-sig", "utf-8", "cp1258", "latin1"]:
        try:
            df = pd.read_csv(io.StringIO(content.decode(enc)))
            break
        except UnicodeDecodeError:
            df = None

    if df is None:
        raise HTTPException(400, "Không đọc được file CSV (encoding không hỗ trợ)")

    if "comment" not in df.columns:
        raise HTTPException(400, "CSV phải có cột 'comment'")

    labels, sentiments, clean_texts = [], [], []

    for text in df["comment"].astype(str):
        res = predict_sentiment(model, tokenizer, text, preprocessor)
        labels.append(res["label"])
        sentiments.append(res["sentiment"])
        clean_texts.append(res["clean_text"])

    df["clean_text"] = clean_texts
    df["label"] = labels
    df["sentiment"] = sentiments

    output = io.StringIO()
    df.to_csv(output, index=False, encoding="utf-8-sig")
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": "attachment; filename=sentiment_result.csv"
        }
    )
