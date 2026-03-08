// ===== TIPOS PARA O NOVO SISTEMA DE PREÇOS AVANÇADO =====

export interface EstadoBrasil {
    id: string;
    sigla: string;
    nome: string;
    regiao?: string;
    criadoEm: string;
}

export interface ClassificacaoMaterial {
    id: string;
    nome: string;
    descricao?: string;
    categoria?: string;
    criadoEm: string;
    atualizadoEm: string;
}

export interface CondicaoPagamento {
    id: string;
    nome: string;
    dias_prazo: number;
    percentual_variacao: number; // Ex: 5.50 = 5.5% de aumento
    descricao?: string;
    ativo: boolean;
    criadoEm: string;
}

export interface FaixaPreco {
    id: string;
    preco_id: string;
    peso_minimo: number; // kg
    peso_maximo?: number; // NULL = sem limite
    percentual_desconto: number; // Ex: 10.50 = 10.5% de desconto
    preco_faixa?: number;
    criadoEm: string;
    atualizadoEm: string;
}

export interface TabelaPrecosAvancada {
    id: string;
    classificacao_id: string;
    classificacao?: ClassificacaoMaterial; // Populated join
    estado_id?: string;
    estado?: EstadoBrasil; // Populated join
    preco_base: number;
    data_inicio: string;
    data_fim?: string;
    status: 'ativo' | 'pendente_aprovacao' | 'inativo' | 'expirado';
    observacoes?: string;
    criado_por_id?: string;
    aprovado_por_id?: string;
    data_aprovacao?: string;
    criadoEm: string;
    atualizadoEm: string;
    faixas?: FaixaPreco[]; // Populated
}

export interface HistoricoPrecos {
    id: string;
    classificacao_id: string;
    classificacao?: ClassificacaoMaterial;
    estado_id?: string;
    estado?: EstadoBrasil;
    preco_anterior?: number;
    preco_novo: number;
    percentual_variacao?: number;
    quantidade_transacoes: number;
    preco_medio_periodo?: number;
    motivo_alteracao?: string;
    usuario_id?: string;
    criadoEm: string;
}

export interface AuditoriaPrecos {
    id: string;
    preco_id?: string;
    acao: 'criado' | 'atualizado' | 'aprovado' | 'rejeitado' | 'expirado';
    status_anterior?: string;
    status_novo?: string;
    usuario_id?: string;
    observacao?: string;
    dataAcao: string;
}

// ===== TIPOS PARA REQUISIÇÕES =====

export interface CriarTabelaPrecosRequest {
    classificacao_id: string;
    estado_id?: string;
    preco_base: number;
    data_inicio: string;
    data_fim?: string;
    observacoes?: string;
    faixas?: {
        peso_minimo: number;
        peso_maximo?: number;
        percentual_desconto?: number;
        preco_faixa?: number;
    }[];
}

export interface AtualizarTabelaPrecosRequest extends Partial<CriarTabelaPrecosRequest> {
    status?: 'ativo' | 'pendente_aprovacao' | 'inativo' | 'expirado';
}

export interface FiltroPrecos {
    classificacao_id?: string;
    estado_id?: string;
    status?: string;
    data_inicio?: string;
    data_fim?: string;
}

export interface CalculoPrecoBuscador {
    classificacao_id: string;
    estado_id?: string;
    peso?: number; // Para faixa de preço
    condicao_pagamento_id?: string;
    quantidade?: number;
}

export interface ResultadoCalculoPreco {
    preco_base: number;
    desconto_faixa: number;
    preco_com_faixa: number;
    variacao_pagamento: number;
    preco_final: number;
    vigencia: {
        data_inicio: string;
        data_fim?: string;
    };
    faixa_aplicada?: FaixaPreco;
    condicao_pagamento?: CondicaoPagamento;
}

export interface RelatorioVariacaoPrecos {
    classificacao: ClassificacaoMaterial;
    estado?: EstadoBrasil;
    preco_anterior?: number;
    preco_atual: number;
    percentual_variacao?: number;
    preco_medio_30_dias?: number;
    preco_minimo_30_dias?: number;
    preco_maximo_30_dias?: number;
    tendencia: 'subindo' | 'descendo' | 'estavel';
    numero_transacoes: number;
    ultimas_datas_mudanca: string[];
}
