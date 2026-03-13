import { useState, useEffect } from 'react';
import {
  History,
  Search,
  Calendar,
  Download,
  ExternalLink,
  Printer,
  FilterX,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { listarPagamentos } from "@/services/pagamentos";
import type { Pagamento } from "@/services/pagamentos";

export default function PaymentHistory() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [filtroRapido, setFiltroRapido] = useState('todos');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const pags = await listarPagamentos();
      // Filtrar apenas pagamentos concluídos (status = 'pago')
      const concluidos = (pags || []).filter(p => p.status === 'pago');
      setPagamentos(concluidos.reverse()); // Mais recentes primeiro
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filtros
  const filtrados = pagamentos.filter(p => {
    // Filtro por busca
    if (busca && !p.fornecedor_nome.toLowerCase().includes(busca.toLowerCase()) && !p.id?.includes(busca)) {
      return false;
    }

    // Filtro por período customizado
    if (dateRange.start || dateRange.end) {
      const pDate = new Date(p.data_pagamento);
      if (dateRange.start && pDate < new Date(dateRange.start)) return false;
      if (dateRange.end && pDate > new Date(dateRange.end)) return false;
    }

    // Filtro rápido
    if (filtroRapido !== 'todos') {
      const agora = new Date();
      const dataP = new Date(p.data_pagamento);

      if (filtroRapido === '30') {
        const treintaDias = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (dataP < treintaDias) return false;
      } else if (filtroRapido === '15') {
        const quinzeDias = new Date(agora.getTime() - 15 * 24 * 60 * 60 * 1000);
        if (dataP < quinzeDias) return false;
      } else if (filtroRapido === '7') {
        const umaSemana = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (dataP < umaSemana) return false;
      }
    }

    return true;
  });

  // Cálculos
  const totalPeriodo = filtrados.reduce((a, p) => a + (p.valor || 0), 0);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-lg font-black text-gray-800">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Cabeçalho com Busca */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tight">
              Histórico de Transações
            </h2>
            <p className="text-gray-600 font-medium mt-1">Consulta de registros financeiros passados</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por ID ou Fornecedor..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-gray-400"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-lg h-12 font-black uppercase italic shadow-md transition-all inline-flex items-center gap-2">
              <Printer size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">

          {/* LADO ESQUERDO: Filtros */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="pb-0 border-b border-gray-100">
                <CardTitle className="text-gray-900 font-black uppercase italic flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Período
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-2">
                {[
                  { value: 'todos', label: 'Todos' },
                  { value: '30', label: 'Últimos 30 dias' },
                  { value: '15', label: 'Últimos 15 dias' },
                  { value: '7', label: 'Última semana' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFiltroRapido(opt.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase italic transition-all ${filtroRapido === opt.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}

                {/* Período Customizado */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <p className="text-gray-900 text-sm font-black uppercase italic">Período Customizado:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-600 uppercase">De:</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="bg-white text-gray-900 text-sm font-bold p-2 rounded border border-gray-200 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-600 uppercase">Até:</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="bg-white text-gray-900 text-sm font-bold p-2 rounded border border-gray-200 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDateRange({ start: '', end: '' });
                      setFiltroRapido('todos');
                      setBusca('');
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-black uppercase transition-colors py-2 hover:bg-gray-100 rounded"
                  >
                    <FilterX size={16} /> Limpar Filtros
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Totalizador */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg rounded-2xl overflow-hidden text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <History className="w-12 h-12 text-blue-200 opacity-50" />
                </div>
                <h4 className="font-black uppercase italic text-xs mb-2">Total do Período</h4>
                <p className="text-3xl font-black tracking-tighter italic">
                  R$ {totalPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-100 uppercase font-bold mt-3">
                  {filtrados.length} transações concluídas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* DIREITA: Tabela de Histórico */}
          <div className="col-span-12 lg:col-span-9">
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left font-black text-gray-600 uppercase italic text-xs">
                          ID / Data
                        </th>
                        <th className="px-6 py-4 text-left font-black text-gray-600 uppercase italic text-xs">
                          Fornecedor
                        </th>
                        <th className="px-6 py-4 text-left font-black text-gray-600 uppercase italic text-xs">
                          Material / Valor
                        </th>
                        <th className="px-6 py-4 text-center font-black text-gray-600 uppercase italic text-xs">
                          Método
                        </th>
                        <th className="px-6 py-4 text-center font-black text-gray-600 uppercase italic text-xs">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtrados.length > 0 ? (
                        filtrados.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="text-xs font-black text-blue-600">#{item.id?.slice(0, 8)}</div>
                              <div className="text-xs text-gray-500 font-medium mt-1">
                                {new Date(item.data_pagamento).toLocaleDateString('pt-BR')}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-black text-gray-900 uppercase italic">
                                {item.fornecedor_nome}
                              </div>
                              <div className="text-xs text-gray-400 uppercase font-bold mt-1">Pagamento Concluído</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-black text-gray-900">
                                R$ {item.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                              <div className="text-xs text-gray-500 font-bold uppercase mt-1">
                                {item.material}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase bg-green-100 text-green-700">
                                {item.metodo_pagamento}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  title="Baixar Comprovante"
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Download size={16} />
                                </button>
                                <button
                                  title="Ver Detalhes"
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <ExternalLink size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-semibold">
                            Nenhuma transação encontrada
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-100 text-xs text-gray-500 font-medium flex justify-between">
                <p>Exibindo {filtrados.length} de {pagamentos.length} registros</p>
              </CardFooter>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}