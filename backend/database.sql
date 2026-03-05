CREATE TABLE "Metas" (
    id UUID PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL, -- Ex: 'Alumínio', 'Cobre'
    quantidade DECIMAL(10,2) NOT NULL, -- Meta de peso
    progresso DECIMAL(10,2) DEFAULT 0, -- Quanto já foi coletado
    status VARCHAR(20) DEFAULT 'ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Pagamentos" (
    id UUID PRIMARY KEY,
    fornecedor_id UUID NOT NULL,
    fornecedor_nome VARCHAR(255) NOT NULL,
    material VARCHAR(255) NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_pagamento DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado', -- 'pago', 'agendado', 'atrasado', 'cancelado'
    metodo_pagamento VARCHAR(100) DEFAULT 'PIX', -- 'PIX', 'TED', 'Boleto', 'Cheque'
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES "Fornecedores"(id)
);