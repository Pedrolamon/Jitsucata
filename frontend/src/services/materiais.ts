import api from './api';

export interface Material {
  id: string;
  fornecedorId: string;
  tipo: string;
  quantidade: number;
  unidade: string;
  observacoes?: string;
  fotos?: string;
  status: string;
  dataRegistro: string;

  // Campos adicionais do lote de estoque
  patio?: string;
  notaFiscal?: string;
  placaVeiculo?: string;
  pesoBruto?: number;
  pesoLiquido?: number;
  contaminacao?: number;
  cambio?: number;
  preco?: number;
  dataEntrada?: string;
}

export const listarMateriais = async (): Promise<Material[]> => {
  const res = await api.get('/materiais');
  return res.data;
};

export const getAllMateriais = async (status?: string): Promise<Material[]> => {
  const res = await api.get('/materiais', { params: { status } });
  return res.data;
};

export const getTiposMateriais = async () => {
  const res = await api.get('/material');
  return res.data;
};

export const criarMaterial = async (
  dados: Omit<Material, 'id' | 'status' | 'dataRegistro'>
): Promise<Material> => {
  const res = await api.post('/materiais', dados);
  return res.data;
};

export const newMaterial = async (nome: string) => {
  const res = await api.post('/material', { tipo: nome });
  return res.data;
};

export const editarMaterial = async (
  id: string,
  dados: Partial<Omit<Material, 'id' | 'dataRegistro'>>
): Promise<Material> => {
  const res = await api.put(`/materiais/${id}`, dados);
  return res.data;
};

export const excluirMaterial = async (id: string) => {
  await api.delete(`/materiais/${id}`);
};