import api from './api';
import type { Fornecedor } from '../types/fornecedor';


export const listarFornecedores = async (): Promise<Fornecedor[]> => {
  const res = await api.get('/fornecedores');
  return res.data;
};
export const criarFornecedor = async (dados: Omit<Fornecedor, 'id' | 'criadoEm'>): Promise<Fornecedor> => {
  const res = await api.post('/fornecedores', dados);
  return res.data;
};
export const editarFornecedor = async (id: string, dados: Partial<Omit<Fornecedor, 'id' | 'criadoEm'>>): Promise<Fornecedor> => {
  const res = await api.put(`/fornecedores/${id}`, dados);
  return res.data;
};
export const excluirFornecedor = async (id: string) => {
  await api.delete(`/fornecedores/${id}`);
}; 