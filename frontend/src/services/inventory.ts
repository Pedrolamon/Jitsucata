import api from './api';

export interface ItemEstoque {
    id: string;
    material: string;
    quantidade: number;
    unidade: string;
    status: 'disponivel' | 'reservado' | 'aguardando_triagem';
    ultima_entrada: string;
}

export const listarEstoque = async (busca?: string) => {
    const response = await api.get('/estoque', { params: { busca } });
    return response.data;
};

export const ItemEstoque = async () => {

}