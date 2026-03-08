import api from './api';

export interface Pagamento {
  id?: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  material: string;
  valor: number;
  data_pagamento: string;
  metodo_pagamento: 'PIX' | 'TED' | 'Boleto' | 'Dinheiro';
  status: 'pago' | 'agendado' | 'atrasado' | 'cancelado';
  descricao?: string;
  numero_documento?: string;
  comprovante_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResumoFinanceiro {
  total_pago: number;
  total_agendado: number;
  total_atrasado: number;
  total_cancelado: number;
  quantidade_pagamentos: number;
}

export async function listarPagamentos(): Promise<Pagamento[]> {
  try {
    const response = await api.get('/pagamentos');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    throw error;
  }
}

export async function listarPagamentosPorStatus(status: string): Promise<Pagamento[]> {
  try {
    const response = await api.get(`/pagamentos/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao listar pagamentos com status ${status}:`, error);
    throw error;
  }
}

export async function listarPagamentosPorFornecedor(fornecedor_id: string): Promise<Pagamento[]> {
  try {
    const response = await api.get(`/pagamentos/fornecedor/${fornecedor_id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar pagamentos do fornecedor:', error);
    throw error;
  }
}

export async function getPagamentoById(id: string): Promise<Pagamento> {
  try {
    const response = await api.get(`/pagamentos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    throw error;
  }
}

export async function getResumoFinanceiro() {
  try {
    const response = await api.get('/pagamentos/resumo/geral');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    throw error;
  }
}

export async function criarPagamento(dados: Omit<Pagamento, 'id' | 'created_at' | 'updated_at'>): Promise<Pagamento> {
  try {
    const response = await api.post('/pagamentos', dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
}

export async function atualizarPagamento(id: string, dados: Partial<Pagamento>): Promise<Pagamento> {
  try {
    const response = await api.patch(`/pagamentos/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    throw error;
  }
}

export async function deletarPagamento(id: string): Promise<void> {
  try {
    await api.delete(`/pagamentos/${id}`);
  } catch (error) {
    console.error('Erro ao deletar pagamento:', error);
    throw error;
  }
}

// Export para compatibilidade com código existente que importa listarFornecedores daqui
export async function listarFornecedores() {
  try {
    const response = await api.get('/fornecedores');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    throw error;
  }
}
