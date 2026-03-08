import api from './api';

export interface EstoqueItem {
  id: string;
  tipo: string;
  quantidade: number;
  unidade: string;
  status: string;
  dataRegistro: string;
  patio?: string;
  fornecedorId?: string;
  notaFiscal?: string;
  preco?: number;
}

export interface HistoricoMovimentacao {
  id: string;
  materialId: string;
  tipo: string;
  quantidade: number;
  unidade: string;
  origem?: string;
  destino?: string;
  observacao?: string;
  dataRegistro: string;
  // extras
  tipo_material?: string;
}

export interface PagamentoResumo {
  id: string;
  fornecedor_id: string;
  material: string;
  valor: number;
  data_pagamento: string;
  status: string;
  metodo_pagamento: string;
  descricao?: string;
}

export const portalService = {
  listarPrecos: async () => {
    const res = await api.get('/fornecedores/precos');
    return res.data as { nome: string; preco: number }[];
  },

  listarEstoque: async (): Promise<EstoqueItem[]> => {
    const res = await api.get('/fornecedores/estoque');
    return res.data;
  },

  registrarEntrada: async (payload: any) => {
    const res = await api.post('/fornecedores/estoque/entrada', payload);
    return res.data;
  },

  registrarSaida: async (payload: any) => {
    const res = await api.post('/fornecedores/estoque/saida', payload);
    return res.data;
  },

  historicoEstoque: async (): Promise<HistoricoMovimentacao[]> => {
    const res = await api.get('/fornecedores/estoque/historico');
    return res.data;
  },

  fluxoFinanceiro: async (): Promise<PagamentoResumo[]> => {
    const res = await api.get('/fornecedores/financeiro');
    return res.data;
  },

  materialMercado: async (filters?: { state?: string; city?: string }) => {
    const res = await api.get('/materialMercado', { params: filters });
    return res.data;
  },
};
