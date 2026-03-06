import api from './api';

export interface ItemEstoque {
    id: string;
    material: string;
    quantidade: number;
    unidade: string;
    status: 'disponivel' | 'reservado' | 'aguardando_triagem' | string;
    ultima_entrada: string;
    patio?: string;
    fornecedorId?: string;
    notaFiscal?: string;
}

export interface FiltrosEstoque {
    busca?: string;
    status?: string;
    material?: string;
    dataInicio?: string;
    dataFim?: string;
}

export const listarEstoque = async (filtros: FiltrosEstoque = {}): Promise<ItemEstoque[]> => {
    const response = await api.get('/materiais', { params: filtros });
    return response.data;
};