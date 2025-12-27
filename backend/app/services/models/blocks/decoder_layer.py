import torch.nn as nn

from ..layers.layer_norm import LayerNorm
from ..layers.feed_forward import FeedForward
from ..layers.multi_head_attention import MultiHeadAttention

class DecoderLayer(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.ln_1 = LayerNorm(config.n_embd, bias=config.bias)
        self.s_attn = MultiHeadAttention(config)
        self.ln_2 = LayerNorm(config.n_embd, bias=config.bias)
        self.c_attn = MultiHeadAttention(config)
        self.ln_3 = LayerNorm(config.n_embd, bias=config.bias)
        self.ffn = FeedForward(config)
        
    def forward(self, x, enc_output, src_mask, tgt_mask):
        x_norm = self.ln_1(x)
        x = x + self.s_attn(x_norm, x_norm, x_norm, tgt_mask)
        
        x_norm = self.ln_2(x)
        x = x + self.c_attn(x_norm, enc_output, enc_output, src_mask)
        
        x = x + self.ffn(self.ln_3(x))
        return x