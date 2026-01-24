import api from './api';

export interface PontoRota {
  id: string;
  rotaId: string;
  fornecedorId: string;
  ordem: number;
  status: string;
  quantidadeColetada?: number;
  observacoesColeta?: string;
  dataHoraColeta?: string;
}

export interface Rota {
  id: string;
  nome: string;
  status: string;
  dataCriacao: string;
  pontos: PontoRota[];
}

export const listarRotas = async (): Promise<Rota[]> => {
  const res = await api.get('/rotas');
  return res.data;
};
export const criarRota = async (nome: string, pontos: { fornecedorId: string }[]): Promise<Rota> => {
  const res = await api.post('/rotas', { nome, pontos });
  return res.data;
};
export const getRota = async (id: string): Promise<Rota> => {
  const res = await api.get(`/rotas/${id}`);
  return res.data;
};
export const editarRota = async (id: string, dados: Partial<Omit<Rota, 'id' | 'pontos'>>): Promise<Rota> => {
  const res = await api.put(`/rotas/${id}`, dados);
  return res.data;
};
export const excluirRota = async (id: string) => {
  await api.delete(`/rotas/${id}`);
};
export const atualizarPontoRota = async (id: string, dados: Partial<PontoRota>): Promise<PontoRota> => {
  const res = await api.put(`/pontos-rota/${id}`, dados);
  return res.data;
}; 