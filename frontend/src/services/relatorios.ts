import { listarRotas } from './rotas';
import { listarFornecedores } from './fornecedores';
import type {Fornecedor} from '../types/fornecedor';

export const relatorioPorFornecedor = async () => {
  const rotas = await listarRotas();
  const fornecedores = await listarFornecedores();
  const fornecedoresMap = new Map<string, Fornecedor>();
  fornecedores.forEach(f => fornecedoresMap.set(f.id, f));

  const dados: Record<string, { fornecedor: string; total: number }> = {};
  
 rotas.forEach(r => r.pontos.forEach(p => {
    if (p.status === 'coletado') {
      const fornecedor = fornecedoresMap.get(p.fornecedorId); // Obtém o objeto fornecedor
      if (fornecedor) { // Verifica se o fornecedor foi encontrado
        const nomeFornecedor = fornecedor.name; // Acessa o nome do fornecedor

        if (!dados[nomeFornecedor]) {
          dados[nomeFornecedor] = { fornecedor: nomeFornecedor, total: 0 };
        }
        dados[nomeFornecedor].total += p.quantidadeColetada || 0;
      }
    }
  }));
  return Object.values(dados);
};

export const relatorioPorTipo = async () => {
  // Como não temos tipo no ponto, simular agrupamento por nome
  return relatorioPorFornecedor();
};

export const relatorioPorPeriodo = async (inicio: Date, fim: Date) => {
  const rotas = await listarRotas();
  const dados: { data: string; total: number }[] = [];
  rotas.forEach(r => r.pontos.forEach(p => {
    if (p.status === 'coletado' && p.dataHoraColeta) {
      const data = new Date(p.dataHoraColeta);
      if (data >= inicio && data <= fim) {
        const dia = data.toISOString().slice(0, 10);
        let d = dados.find(x => x.data === dia);
        if (!d) { d = { data: dia, total: 0 }; dados.push(d); }
        d.total += p.quantidadeColetada || 0;
      }
    }
  }));
  return dados;
};

export const exportarCSV = (dados: any[], colunas: string[]) => {
  const csv = [colunas.join(',')].concat(
    dados.map(row => colunas.map(c => row[c]).join(','))
  ).join('\n');
  return csv;
}; 