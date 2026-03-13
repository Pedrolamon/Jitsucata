// ===== TIPOS PARA O NOVO SISTEMA DE PREÇOS AVANÇADO - FRONTEND =====

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
    percentual_variacao: number;
    descricao?: string;
    ativo: boolean;
    criadoEm: string;
}

export interface FaixaPreco {
    id: string;
    preco_id: string;
    peso_minimo: number;
    peso_maximo?: number;
    percentual_desconto: number;
    preco_faixa?: number;
    criadoEm: string;
    atualizadoEm: string;
}

export interface TabelaPrecosAvancada {
    id: string;
    classificacao_id: string;
    classificacao?: ClassificacaoMaterial;
    estado_id?: string;
    estado?: EstadoBrasil;
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
    faixas?: FaixaPreco[];
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

export interface FiltroPrecos {
    classificacao_id?: string;
    estado_id?: string;
    status?: string;
    data_inicio?: string;
    data_fim?: string;
    texto?: string;
}

export type SortField = 'preco_base' | 'data_inicio' | 'status' | 'classificacao' | 'estado';
export type SortOrder = 'asc' | 'desc';

export interface TabelaPrecosState {
    filtro: FiltroPrecos;
    sortField: SortField;
    sortOrder: SortOrder;
    page: number;
    pageSize: number;
    total?: number;
}

export const estadosBrasil = [
        { sigla: 'AC', nome: 'Acre', regiao: 'Norte' },
        { sigla: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
        { sigla: 'AP', nome: 'Amapá', regiao: 'Norte' },
        { sigla: 'AM', nome: 'Amazonas', regiao: 'Norte' },
        { sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
        { sigla: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
        { sigla: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
        { sigla: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
        { sigla: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
        { sigla: 'MA', nome: 'Maranhão', regiao: 'Nordeste' },
        { sigla: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
        { sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
        { sigla: 'PA', nome: 'Pará', regiao: 'Norte' },
        { sigla: 'PB', nome: 'Paraíba', regiao: 'Nordeste' },
        { sigla: 'PR', nome: 'Paraná', regiao: 'Sul' },
        { sigla: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
        { sigla: 'PI', nome: 'Piauí', regiao: 'Nordeste' },
        { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
        { sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
        { sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
        { sigla: 'RO', nome: 'Rondônia', regiao: 'Norte' },
        { sigla: 'RR', nome: 'Roraima', regiao: 'Norte' },
        { sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
        { sigla: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },
        { sigla: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
        { sigla: 'TO', nome: 'Tocantins', regiao: 'Norte' },
    ];