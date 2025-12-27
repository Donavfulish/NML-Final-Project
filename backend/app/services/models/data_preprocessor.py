import emoji
import re
import pandas as pd
import py_vncorenlp
from pathlib import Path

class DataPreprocessor:
    def __init__(self):
        BASE_DIR = Path(__file__).resolve().parent.parent.parent
        abbr_path = BASE_DIR / "data" / "input" / "cleaned" / "abbreviation_dictionary_vn.csv"
        self.abbr_df = pd.read_csv(abbr_path)    
        path_to_VnCoreNLP = str(BASE_DIR / "services" / "VnCoreNLP")
        self.rdrword_segmenter = py_vncorenlp.VnCoreNLP(annotators=["wseg"], save_dir=path_to_VnCoreNLP)
    
    def standardize_word(self, text):
        # Lower text
        text = text.lower()
        # Remove extra spaces
        text = text.split()
        text = " ".join(text)
        return text.strip()
    
    def remove_special_characters(self, text):
        # Remove emoji
        text = emoji.replace_emoji(text, replace="")
        # Remove punctuation
        pattern = r"[^0-9a-zA-ZÀ-ỹ\s]"
        text = re.sub(pattern, " ", text)
        return text

    def remove_english_text(self, text):
        # Count vietnamese words
        vietnamese_chars = re.findall(r"[À-Ỹà-ỹ]", text)
        # If zero then it's english
        if len(vietnamese_chars) == 0:
            return ""
        
        return text

    def replace_abbreviation(self, text):
        abbr_map = dict(zip(self.abbr_df["abbreviation"], self.abbr_df["meaning"]))
        return " ".join([abbr_map.get(w, w) for w in text.split()])
    
    def preprocess(self, text):
        text = self.standardize_word(text)
        text = self.remove_special_characters(text)
        text = self.remove_english_text(text)
        text = self.replace_abbreviation(text)
        text = " ".join(self.rdrword_segmenter.word_segment(text))
            
        return text.strip()
    