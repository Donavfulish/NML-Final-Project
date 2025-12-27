import os
import sentencepiece as spm
import torch

class Tokenizer(spm.SentencePieceProcessor):
    def __init__(self, src_tgt_lang):
        super(Tokenizer, self).__init__()
        if src_tgt_lang != "en-vi":
            raise NotImplementedError(
                f"Bộ mã hóa cho ngôn ngữ '{src_tgt_lang}' chưa được hỗ trợ."
            )
        base_dir = os.path.dirname(os.path.abspath(__file__))

        model_path = os.path.join(
            base_dir,
            src_tgt_lang,
            "spm.model"
        )
        self.load(model_path)
    
    def tokenize(self, subset, max_seq_length):
        enc_source = self.encode(subset["source"])
        enc_target = self.encode(subset["target"])
        
        return {
            "source": torch.tensor([
                row + [self.eos_id()] + [self.pad_id()] * (max_seq_length - len(row) - 1) 
                for row in enc_source
            ], dtype=torch.long),
            "target": torch.tensor([
                [self.bos_id()] + row + [self.eos_id()] + [self.pad_id()] * (max_seq_length - len(row) - 2) 
                for row in enc_target
            ], dtype=torch.long)
        }
            