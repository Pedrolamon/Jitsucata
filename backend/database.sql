CREATE TABLE "Metas" (
    id UUID PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL, -- Ex: 'Alumínio', 'Cobre'
    quantidade DECIMAL(10,2) NOT NULL, -- Meta de peso
    progresso DECIMAL(10,2) DEFAULT 0, -- Quanto já foi coletado
    status VARCHAR(20) DEFAULT 'ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<<<<<<< HEAD
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
=======
-- Catálogo de tipos de sucata (ex.: Ferro pesado, Alumínio perfil, Cobre)
CREATE TABLE IF NOT EXISTS "TipoMaterial" (
    id UUID PRIMARY KEY,
    tipo VARCHAR(120) NOT NULL UNIQUE,
    "dataRegistro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lotes de material em estoque (inventário por lote)
CREATE TABLE IF NOT EXISTS "Materiais" (
    id UUID PRIMARY KEY,
    "fornecedorId" UUID,
    tipo VARCHAR(120) NOT NULL, -- descrição legível do material (pode vir de TipoMaterial)
    quantidade DECIMAL(10,2) NOT NULL,
    unidade VARCHAR(10) NOT NULL DEFAULT 'kg',
    observacoes TEXT,
    fotos TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'disponivel', -- disponivel, reservado, aguardando_triagem, vendido, bloqueado
    "dataRegistro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Detalhes operacionais do lote
    "pesoBruto" DECIMAL(10,2),
    "pesoLiquido" DECIMAL(10,2),
    contaminacao DECIMAL(10,2),
    cambio DECIMAL(10,4),
    preco DECIMAL(10,2),
    patio VARCHAR(100),
    "notaFiscal" VARCHAR(80),
    "placaVeiculo" VARCHAR(20),
    "dataEntrada" TIMESTAMP,

    -- Controle de ciclo de vida
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Histórico de movimentações de estoque (entradas, saídas, ajustes, transferências)
CREATE TABLE IF NOT EXISTS "MovimentacaoEstoque" (
    id UUID PRIMARY KEY,
    "materialId" UUID NOT NULL REFERENCES "Materiais"(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- ENTRADA, SAIDA, AJUSTE, TRANSFERENCIA
    quantidade DECIMAL(10,2) NOT NULL,
    unidade VARCHAR(10) NOT NULL DEFAULT 'kg',
    origem VARCHAR(120),   -- pátio/baia origem ou motivo
    destino VARCHAR(120),  -- pátio/baia destino ou cliente
    observacao TEXT,
    "dataRegistro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
>>>>>>> 67748c1f5223b794bc71d6873e60be11a17a78f2
);