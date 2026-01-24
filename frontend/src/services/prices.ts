import api from './api';

export interface Material {
    id: string; 
    nome: string;
    preco: string;
    updated_at?: string;
  }
  
export type NovoMaterial = Omit<Material, 'id' | 'updated_at'>;

export const priceService = {
  listar: async (): Promise<Material[]> => {
    const res = await api.get('/prices');
    return res.data;
  },

  // Criar um novo material
  criar: async (data: NovoMaterial): Promise<Material> => {
    const res = await api.post('/prices', data);
    return res.data;
  },

  // Atualizar vários preços de uma vez (Bulk Update)
  atualizarTudo: async (materiais: Material[]): Promise<void> => {
    await api.put('/prices/bulk', { materiais });
  },

  // Deletar um material
  deletar: async (id: string): Promise<void> => {
    await api.delete(`/prices/${id}`);
  }
};