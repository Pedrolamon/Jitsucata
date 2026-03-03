import api from './api'; // Sua instância do Axios

export interface Meta {
    id: string;
    tipo: string;
    quantidade: number;
    progresso: number;
    status: string;
}

export const listarMetas = async (): Promise<Meta[]> => {
    const response = await api.get('/metas'); // Rota que você criou: router.get("/")
    return response.data;
};

export const salvarMeta = async (tipo: string, quantidade: number) => {
    return await api.post('/metas', { tipo, quantidade });
};

export const editarMeta = async (id: string, tipo: string, quantidade: number) => {
    return await api.patch(`/metas/${id}`, { tipo, quantidade });
};

export const deleteMeta = async (id: string) => {
    return await api.delete(`/metas/${id}`)
}