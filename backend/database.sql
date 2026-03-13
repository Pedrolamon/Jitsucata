-- USERS / AUTENTICAÇÃO
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL, -- admin, fornecedor, financeiro
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ENDEREÇOS (utilizado pelos fornecedores)
CREATE TABLE IF NOT EXISTS "Enderecos" (
    id UUID PRIMARY KEY,
    street VARCHAR(255),
    number VARCHAR(50),
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(100),
    cep VARCHAR(20),
    complement VARCHAR(255),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7)
);

-- LICENÇAS AMBIENTAIS
CREATE TABLE IF NOT EXISTS "LicencasAmbientais" (
    id UUID PRIMARY KEY,
    numero VARCHAR(100),
    "issuingBody" VARCHAR(100),
    validity DATE
);

-- REPRESENTANTES LEGAIS
CREATE TABLE IF NOT EXISTS "RepresentantesLegais" (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    cpf VARCHAR(20),
    rg VARCHAR(20),
    position VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255)
);

-- FORNECEDORES
CREATE TABLE IF NOT EXISTS "Fornecedores" (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(50),
    "stateRegistration" VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(100),
    capacity VARCHAR(100),
    "legalNature" VARCHAR(100),
    password VARCHAR(255),
    status BOOLEAN DEFAULT FALSE,
    observacoes TEXT,
    address_id UUID REFERENCES "Enderecos"(id) ON DELETE SET NULL,
    license_id UUID REFERENCES "LicencasAmbientais"(id) ON DELETE SET NULL,
    representative_id UUID REFERENCES "RepresentantesLegais"(id) ON DELETE SET NULL,
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- METAS
CREATE TABLE IF NOT EXISTS "Metas" (
    id UUID PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL, -- Ex: 'Alumínio', 'Cobre'
    quantidade DECIMAL(10,2) NOT NULL, -- Meta de peso
    progresso DECIMAL(10,2) DEFAULT 0, -- Quanto já foi coletado
    status VARCHAR(20) DEFAULT 'ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATÁLOGO DE TIPOS DE MATERIAL (para formulário de cadastro)
CREATE TABLE IF NOT EXISTS "TipoMaterial" (
    id UUID PRIMARY KEY,
    tipo VARCHAR(120) NOT NULL UNIQUE,
    "dataRegistro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tabela alternativa usada pelo endpoint /material
CREATE TABLE IF NOT EXISTS "Material" (
    id UUID PRIMARY KEY,
    tipo VARCHAR(120) NOT NULL,
    "dataRegistro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ESTOQUE DE MATERIAIS (lotes individuais)
CREATE TABLE IF NOT EXISTS "Materiais" (
    id UUID PRIMARY KEY,
    "fornecedorId" UUID REFERENCES "Fornecedores"(id),
    tipo VARCHAR(120) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    unidade VARCHAR(10) NOT NULL DEFAULT 'kg',
    observacoes TEXT,
    fotos TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'disponivel',
    "dataRegistro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pesoBruto" DECIMAL(10,2),
    "pesoLiquido" DECIMAL(10,2),
    "zona" VARCHAR(20),
    contaminacao DECIMAL(10,2),
    cambio DECIMAL(10,4),
    preco DECIMAL(10,2),
    patio VARCHAR(100),
    "notaFiscal" VARCHAR(80),
    "placaVeiculo" VARCHAR(20),
    "dataEntrada" TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- MOVIMENTAÇÃO DE ESTOQUE
CREATE TABLE IF NOT EXISTS "MovimentacaoEstoque" (
    id UUID PRIMARY KEY,
    "materialId" UUID NOT NULL REFERENCES "Materiais"(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    unidade VARCHAR(10) NOT NULL DEFAULT 'kg',
    origem VARCHAR(120),
    destino VARCHAR(120),
    observacao TEXT,
    "dataRegistro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE PREÇOS
CREATE TABLE IF NOT EXISTS "TabelaPrecos" (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(12,2) NOT NULL
);

-- RESUMO DE ESTOQUE POR FORNECEDOR (para cálculo de preço médio)
CREATE TABLE IF NOT EXISTS "EstoqueFornecedores" (
    id UUID PRIMARY KEY,
    "fornecedorId" UUID NOT NULL REFERENCES "Fornecedores"(id) ON DELETE CASCADE,
    tipo VARCHAR(120) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
    preco_medio DECIMAL(12,4) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("fornecedorId", tipo)
);

-- índice para acelerar consultas dos fornecedores
CREATE INDEX IF NOT EXISTS idx_materiais_fornecedor ON "Materiais" ("fornecedorId");

-- PAGAMENTOS
CREATE TABLE IF NOT EXISTS "Pagamentos" (
    id UUID PRIMARY KEY,
    fornecedor_id UUID NOT NULL REFERENCES "Fornecedores"(id),
    fornecedor_nome VARCHAR(255) NOT NULL,
    material VARCHAR(255) NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_pagamento DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado', -- agendado, pago, atrasado, cancelado
    metodo_pagamento VARCHAR(100) DEFAULT 'PIX', -- PIX, TED, Boleto, Dinheiro
    descricao TEXT,
    comprovante_url TEXT,
    numero_documento VARCHAR(100),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES PARA PAGAMENTOS
CREATE INDEX IF NOT EXISTS idx_pagamentos_fornecedor ON "Pagamentos"(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON "Pagamentos"(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data ON "Pagamentos"(data_pagamento);
CREATE INDEX IF NOT EXISTS idx_pagamentos_criado ON "Pagamentos"(created_at);

-- TABELA DE COMPROVANTES/EXTRATOS
CREATE TABLE IF NOT EXISTS "ComprovantePagamento" (
    id UUID PRIMARY KEY,
    pagamento_id UUID NOT NULL REFERENCES "Pagamentos"(id) ON DELETE CASCADE,
    arquivo_url TEXT NOT NULL,
    tipo VARCHAR(50), -- recibo, extrato, nota_fiscal
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE AUDITORIA DE PAGAMENTOS
CREATE TABLE IF NOT EXISTS "AuditoriaPagamentos" (
    id UUID PRIMARY KEY,
    pagamento_id UUID NOT NULL REFERENCES "Pagamentos"(id) ON DELETE CASCADE,
    acao VARCHAR(100), -- criado, atualizado, aprovado, rejeitado
    usuario_id UUID,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50),
    observacao TEXT,
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Precos" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL, -- Preço por kg ou unidade base
    unidade VARCHAR(50) DEFAULT 'kg',
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ESTADOS DO BRASIL
CREATE TABLE IF NOT EXISTS "EstadosBrasil" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sigla VARCHAR(2) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL UNIQUE,
    regiao VARCHAR(50),
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CLASSIFICAÇÕES DE MATERIAL
CREATE TABLE IF NOT EXISTS "ClassificacoesMaterial" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    categoria VARCHAR(100),
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONDIÇÕES DE PAGAMENTO
CREATE TABLE IF NOT EXISTS "CondicoesPagamento" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    dias_prazo INTEGER DEFAULT 0,
    percentual_variacao DECIMAL(5, 2) DEFAULT 0, -- Variação percentual (ex: 5.50)
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE PREÇOS AVANÇADA (Com Vigência, Estado, Classificação)
CREATE TABLE IF NOT EXISTS "TabelaPrecosAvancada" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classificacao_id UUID NOT NULL REFERENCES "ClassificacoesMaterial"(id) ON DELETE CASCADE,
    estado_id UUID REFERENCES "EstadosBrasil"(id) ON DELETE SET NULL,
    preco_base DECIMAL(12, 4) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status VARCHAR(50) DEFAULT 'ativo', -- ativo, pendente_aprovacao, inativo, expirado
    observacoes TEXT,
    criado_por_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    aprovado_por_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    data_aprovacao TIMESTAMP,
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(classificacao_id, estado_id, data_inicio, data_fim)
);

-- FAIXAS DE PREÇO (Tiered Pricing por Peso/Volume)
CREATE TABLE IF NOT EXISTS "FaixasPreco" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preco_id UUID NOT NULL REFERENCES "TabelaPrecosAvancada"(id) ON DELETE CASCADE,
    peso_minimo DECIMAL(10, 2) NOT NULL, -- kg
    peso_maximo DECIMAL(10, 2), -- NULL = sem limite máximo
    percentual_desconto DECIMAL(5, 2) DEFAULT 0, -- Desconto percentual (ex: 10.50)
    preco_faixa DECIMAL(12, 4), -- Se NULL, calcula dinamicamente baseado em preço_base
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VARIAÇÕES DE PAGAMENTO POR FAIXA DE PREÇO
CREATE TABLE IF NOT EXISTS "VariacoesPagamentoPreco" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preco_id UUID NOT NULL REFERENCES "TabelaPrecosAvancada"(id) ON DELETE CASCADE,
    faixa_id UUID REFERENCES "FaixasPreco"(id) ON DELETE CASCADE,
    condicao_nome VARCHAR(100) NOT NULL, -- Nome da condição de pagamento
    percentual_variacao DECIMAL(5, 2) DEFAULT 0, -- Ex: 5.50 = 5.5% de aumento
    preco_variado DECIMAL(12, 4) NOT NULL, -- Preço com variação aplicada
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HISTÓRICO DE PREÇOS
CREATE TABLE IF NOT EXISTS "HistoricoPrecos" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classificacao_id UUID NOT NULL REFERENCES "ClassificacoesMaterial"(id) ON DELETE CASCADE,
    estado_id UUID REFERENCES "EstadosBrasil"(id) ON DELETE SET NULL,
    preco_anterior DECIMAL(12, 4),
    preco_novo DECIMAL(12, 4) NOT NULL,
    percentual_variacao DECIMAL(5, 2), -- Calculado: ((preco_novo - preco_anterior) / preco_anterior) * 100
    quantidade_transacoes INTEGER DEFAULT 0, -- Para agregação
    preco_medio_periodo DECIMAL(12, 4), -- Média de preço do período
    motivo_alteracao VARCHAR(50), -- ajuste_inflacao, solicitacao_admin, reajuste_semanal, etc
    usuario_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUDITORIA DE PREÇOS
CREATE TABLE IF NOT EXISTS "AuditoriaPrecos" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preco_id UUID REFERENCES "TabelaPrecosAvancada"(id) ON DELETE SET NULL,
    acao VARCHAR(50) NOT NULL, -- criado, atualizado, aprovado, rejeitado, expirado
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50),
    usuario_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    observacao TEXT,
    "dataAcao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_tabela_precos_avancada_classificacao ON "TabelaPrecosAvancada"(classificacao_id);
CREATE INDEX IF NOT EXISTS idx_tabela_precos_avancada_estado ON "TabelaPrecosAvancada"(estado_id);
CREATE INDEX IF NOT EXISTS idx_tabela_precos_avancada_status ON "TabelaPrecosAvancada"(status);
CREATE INDEX IF NOT EXISTS idx_tabela_precos_avancada_datas ON "TabelaPrecosAvancada"(data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_faixas_preco_preco_id ON "FaixasPreco"(preco_id);
CREATE INDEX IF NOT EXISTS idx_variacoes_pagamento_preco_id ON "VariacoesPagamentoPreco"(preco_id);
CREATE INDEX IF NOT EXISTS idx_variacoes_pagamento_faixa_id ON "VariacoesPagamentoPreco"(faixa_id);
CREATE INDEX IF NOT EXISTS idx_historico_precos_classificacao ON "HistoricoPrecos"(classificacao_id);
CREATE INDEX IF NOT EXISTS idx_historico_precos_estado ON "HistoricoPrecos"(estado_id);
CREATE INDEX IF NOT EXISTS idx_historico_precos_data ON "HistoricoPrecos"("criadoEm");
CREATE INDEX IF NOT EXISTS idx_auditoria_precos_preco_id ON "AuditoriaPrecos"(preco_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_precos_usuario ON "AuditoriaPrecos"(usuario_id);
