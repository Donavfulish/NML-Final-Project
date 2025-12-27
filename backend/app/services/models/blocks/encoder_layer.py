import torch.nn as nn

from ..layers.layer_norm import LayerNorm
from ..layers.feed_forward import FeedForward
from ..layers.multi_head_attention import MultiHeadAttention

class EncoderLayer(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.ln_1 = LayerNorm(config.n_embd, bias=config.bias)
        self.attention = MultiHeadAttention(config)
        self.ln_2 = LayerNorm(config.n_embd, bias=config.bias)
        self.ffn = FeedForward(config)
        
    def forward(self, x, mask=None):
        x_norm = self.ln_1(x)
        x = x + self.attention(x_norm, x_norm, x_norm, mask)
        x = x + self.ffn(self.ln_2(x))
        return x