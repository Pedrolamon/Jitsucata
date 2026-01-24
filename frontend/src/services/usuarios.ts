import api from './api';

export type Perfil = 'admin' | 'fornecedor' | 'operador';
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  senha?: string;
}

export const listarUsuarios = async (): Promise<Usuario[]> => {
  const res = await api.get('/usuarios');
  return res.data;
};
export const criarUsuario = async (dados: Omit<Usuario, 'id'>): Promise<Usuario> => {
  const res = await api.post('/register', dados);
  return res.data.user;
};
export const editarUsuario = async (id: string, dados: Partial<Omit<Usuario, 'id'>>): Promise<Usuario | undefined> => {
  const res = await api.put(`/usuarios/${id}`, dados);
  return res.data;
};
export const excluirUsuario = async (id: string) => {
  await api.delete(`/usuarios/${id}`);
};
export const trocarSenha = async (id: string, novaSenha: string) => {
  await api.post('/trocar-senha', { id, novaSenha });
};
export const listarPerfis = async (): Promise<Perfil[]> => {
  const res = await api.get('/perfis');
  return res.data;
}; 