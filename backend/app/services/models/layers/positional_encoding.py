import math
import torch
import torch.nn as nn

class PositionalEncoding(nn.Module):
    def __init__(self, config):
        super().__init__()
        pos = torch.arange(config.block_size, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, config.n_embd, 2, dtype=torch.float) * -(math.log(10000.0) / config.n_embd))
        pe = torch.zeros(config.block_size, config.n_embd)
        pe[:, 0::2] = torch.sin(pos * div_term)
        pe[:, 1::2] = torch.cos(pos * div_term)
        self.register_buffer("pe", pe.unsqueeze(0))
    
    def forward(self, x):
        # x.size = batch, seq_length, d_model
        return x + self.pe[:, :x.size(1)]