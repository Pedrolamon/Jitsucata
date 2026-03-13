import api from './api';
import type {
    EstadoBrasil,
    ClassificacaoMaterial,
    CondicaoPagamento,
    TabelaPrecosAvancada,
    HistoricoPrecos,
    ResultadoCalculoPreco,
    RelatorioVariacaoPrecos,
    FiltroPrecos,
} from '../types/preco-avancado';

interface CreateTabelaPrecosInput {
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

export const advancedPricesService = {
    // ===== INICIALIZAÇÃO =====

    init: async (): Promise<void> => {
        await api.post('/prices/init');
    },

    // ===== ESTADOS DO BRASIL =====

    getAllEstados: async (): Promise<EstadoBrasil[]> => {
        const res = await api.get('/prices/estados');
        return res.data;
    },

    // ===== CLASSIFICAÇÕES DE MATERIAL =====

    getAllClassificacoes: async (): Promise<ClassificacaoMaterial[]> => {
        const res = await api.get('/prices/classificacoes');
        return res.data;
    },

    getClassificacaoById: async (id: string): Promise<ClassificacaoMaterial> => {
        const res = await api.get(`/prices/classificacoes/${id}`);
        return res.data;
    },

    createClassificacao: async (data: {
        nome: string;
        descricao?: string;
        categoria?: string;
    }): Promise<ClassificacaoMaterial> => {
        const res = await api.post('/prices/classificacoes', data);
        return res.data;
    },

    // ===== CONDIÇÕES DE PAGAMENTO =====

    getAllCondicoesPagamento: async (): Promise<CondicaoPagamento[]> => {
        const res = await api.get('/prices/condicoes-pagamento');
        return res.data;
    },

    createCondicaoPagamento: async (data: {
        nome: string;
        dias_prazo?: number;
        percentual_variacao?: number;
        descricao?: string;
    }): Promise<CondicaoPagamento> => {
        const res = await api.post('/prices/condicoes-pagamento', data);
        return res.data;
    },

    // ===== TABELA DE PREÇOS AVANÇADA =====

    listTabelaPrecos: async (filtros?: FiltroPrecos): Promise<TabelaPrecosAvancada[]> => {
        const params = new URLSearchParams();
        if (filtros?.classificacao_id) params.append('classificacao_id', filtros.classificacao_id);
        if (filtros?.estado_id) params.append('estado_id', filtros.estado_id);
        if (filtros?.status) params.append('status', filtros.status);

        const res = await api.get(`/prices/tabela?${params.toString()}`);
        return res.data;
    },

    getTabelaPrecosById: async (id: string): Promise<TabelaPrecosAvancada> => {
        const res = await api.get(`/prices/tabela/${id}`);
        return res.data;
    },

    createTabelaPrecos: async (data: {
        classificacao_id: string;
        estado_id?: string;
        preco_base?: number;
        data_inicio: string;
        data_fim?: string;
        observacoes?: string;
        faixas?: {
            peso_minimo: number;
            peso_maximo?: number;
            percentual_desconto?: number;
            preco_faixa?: number;
        }[];
    }): Promise<TabelaPrecosAvancada> => {
        const res = await api.post('/prices/tabela', data);
        return res.data;
    },

    updateTabelaPrecos: async (id: string, data: Partial<CreateTabelaPrecosInput>): Promise<TabelaPrecosAvancada> => {
        const res = await api.put(`/prices/tabela/${id}`, data);
        return res.data;
    },

    approveTabelaPrecos: async (id: string): Promise<TabelaPrecosAvancada> => {
        const res = await api.post(`/prices/tabela/${id}/approve`);
        return res.data;
    },

    deleteTabelaPrecos: async (id: string): Promise<void> => {
        await api.delete(`/prices/tabela/${id}`);
    },

    // ===== CÁLCULO DE PREÇO =====

    calcularPreco: async (dados: CalculoPrecoBuscador): Promise<ResultadoCalculoPreco> => {
        const res = await api.post('/prices/calcular', dados);
        return res.data;
    },

    // ===== HISTÓRICO E RELATÓRIOS =====

    getHistoricoPrecos: async (
        classificacao_id: string,
        estado_id?: string,
        dias?: number
    ): Promise<HistoricoPrecos[]> => {
        const params = new URLSearchParams();
        if (estado_id) params.append('estado_id', estado_id);
        if (dias) params.append('dias', dias.toString());

        const res = await api.get(`/prices/historico/${classificacao_id}?${params.toString()}`);
        return res.data;
    },

    getRelatorioVariacaoPrecos: async (
        classificacao_id: string,
        estado_id?: string
    ): Promise<RelatorioVariacaoPrecos> => {
        const params = new URLSearchParams();
        if (estado_id) params.append('estado_id', estado_id);

        const res = await api.get(`/prices/relatorio-variacao/${classificacao_id}?${params.toString()}`);
        return res.data;
    },

    // ===== BULK UPDATE =====

    bulkUpdateEstado: async (
        estado_id: string,
        percentualVariacao: number
    ): Promise<{ atualizados: number; ids: string[] }> => {
        const res = await api.post(`/prices/bulk/estado/${estado_id}`, { percentualVariacao });
        return res.data;
    },

    bulkUpdateClassificacao: async (
        classificacao_id: string,
        percentualVariacao: number
    ): Promise<{ atualizados: number; ids: string[] }> => {
        const res = await api.post(`/prices/bulk/classificacao/${classificacao_id}`, { percentualVariacao });
        return res.data;
    },

    bulkUpdateIndividual: async (
        atualizacoes: { id: string; preco_base: number }[]
    ): Promise<{ atualizados: number; ids: string[] }> => {
        const res = await api.post('/prices/bulk/update', { atualizacoes });
        return res.data;
    },

    // ===== UTILITÁRIOS =====

    exportToCSV: (precos: TabelaPrecosAvancada[]): string => {
        const headers = ['Classificação', 'Estado', 'Preço Base', 'Data Início', 'Data Fim', 'Status'];
        const rows = precos.map(p => [
            p.classificacao?.nome || '',
            p.estado?.nome || 'Nacional',
            p.preco_base.toFixed(2),
            p.data_inicio,
            p.data_fim || '',
            p.status
        ]);

        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        return csv;
    },

    downloadCSV: (precos: TabelaPrecosAvancada[], filename: string = 'tabela-precos.csv'): void => {
        const csv = advancedPricesService.exportToCSV(precos);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    getTendenciaIcon: (tendencia: 'subindo' | 'descendo' | 'estavel'): string => {
        switch (tendencia) {
            case 'subindo':
                return '📈';
            case 'descendo':
                return '📉';
            default:
                return '➡️';
        }
    },

    getTendenciaColor: (tendencia: 'subindo' | 'descendo' | 'estavel'): string => {
        switch (tendencia) {
            case 'subindo':
                return 'text-red-500';
            case 'descendo':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    },

    formatarMoeda: (valor: number, locale: string = 'pt-BR'): string => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
};

// Type para importação
export type CalculoPrecoBuscador = {
    classificacao_id: string;
    estado_id?: string;
    peso?: number;
    condicao_pagamento_id?: string;
    quantidade?: number;
};
