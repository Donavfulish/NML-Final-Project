import torch

def predict_sentiment(model, tokenizer, text, preprocessor):
    preprocessed_text = preprocessor.preprocess(text)
    encoded_text = tokenizer(
        preprocessed_text,
        add_special_tokens=True,
        truncation=True,
        padding="max_length",
        max_length=256,
        return_tensors="pt"
    ).to("cpu")
    
    model.eval()
    logits = model(**encoded_text).logits
    pred = torch.argmax(logits)
    
    return pred.item()