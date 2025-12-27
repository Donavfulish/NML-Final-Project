import math
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, config):
        super().__init__()
        assert config.n_embd % config.n_head == 0
        self.q_proj = nn.Linear(config.n_embd, config.n_embd, bias=config.bias)
        self.k_proj = nn.Linear(config.n_embd, config.n_embd, bias=config.bias)
        self.v_proj = nn.Linear(config.n_embd, config.n_embd, bias=config.bias)
        self.proj_output = nn.Linear(config.n_embd, config.n_embd, bias=config.bias)
        self.attn_dropout = nn.Dropout(config.dropout)
        self.resid_dropout = nn.Dropout(config.dropout)
        self.n_head = config.n_head

    
    def scaled_dot_product_attention(self, q, k, v, mask=None):
        attn = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(k.size(-1)))
        if mask is not None:
            attn = attn.masked_fill(mask == 0, -1e-9)
        attn = F.softmax(attn, dim=-1)
        attn = self.attn_dropout(attn)
        output = attn @ v
        return output
    
    def forward(self, query, key, value, mask=None):
        B, T, C = query.size()
        q = self.q_proj(query).view(B, T, self.n_head, C // self.n_head).transpose(1, 2)
        k = self.k_proj(key).view(B, key.size(1), self.n_head, C // self.n_head).transpose(1, 2) 
        v = self.v_proj(value).view(B, value.size(1), self.n_head, C // self.n_head).transpose(1, 2) 
        
        attn_output = self.scaled_dot_product_attention(q, k, v, mask)
        y = attn_output.transpose(1, 2).contiguous().view(B, T, C)
        # Ma trận chiếu output
        y = self.resid_dropout(self.proj_output(y))
        return y