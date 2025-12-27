"""Đây là đoạn mã dùng để huấn luyện bộ mã hóa

import sentencepiece as spm

data_input = "../../../data/input/raw/train/corpus.txt"
tok_output = "./en-vi/spm"

spm.SentencePieceTrainer.Train(
    input=data_input,
    model_prefix=tok_output,
    vocab_size=32000,
    model_type="bpe",       
    character_coverage=0.9995,
    pad_id=0, bos_id=1, eos_id=2, unk_id=3
)
"""