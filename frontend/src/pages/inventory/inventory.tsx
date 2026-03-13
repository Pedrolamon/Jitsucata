import { useState, useEffect } from 'react';
import {
  Box,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Scale,
  MoreHorizontal,
  Filter,
  FileText
} from 'lucide-react';
import { cn } from "../../lib/utils";
import { listarEstoque, type ItemEstoque } from "../../services/inventory";
import { Link } from 'react-router-dom';

const STATUS_OPCOES = [
  { label: 'Disponível', value: 'disponivel' },
  { label: 'Reservado', value: 'reservado' },
  { label: 'Em Triagem', value: 'aguardando_triagem' },
] as const;

export default function Inventory() {
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [busca, setBusca] = useState('');
  const [statusFiltros, setStatusFiltros] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [resumo, setResumo] = useState({
    volumeTotalTon: 0,
    entradasHojeTon: 0,
    saidasHojeTon: 0,
    emTriagem: 0,
  });

  const formatarIdCurto = (id: string) => {
    const apenasDigitos = id.replace(/\D/g, '');
    if (apenasDigitos.length > 0) {
      return apenasDigitos.slice(0, 5);
    }

    return id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase();
  };

  const formatarDataBR = (data: string) => {
    if (!data) return '-';

    const dataISO = data.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
      const [ano, mes, dia] = dataISO.split('-');
      return `${dia}/${mes}/${ano}`;
    }

    const parsed = new Date(data);
    if (Number.isNaN(parsed.getTime())) return '-';

    return parsed.toLocaleDateString('pt-BR');
  };

  const calcularResumo = (itens: ItemEstoque[]) => {
    const hoje = new Date();

    const isHoje = (dataStr: string) => {
      const data = new Date(dataStr);
      return (
        data.getFullYear() === hoje.getFullYear() &&
        data.getMonth() === hoje.getMonth() &&
        data.getDate() === hoje.getDate()
      );
    };

    const volumeTotalTon = itens.reduce((total, item) => {
      const quantidade = Number(item.quantidade) || 0;
      if (!quantidade) return total;
      if (item.unidade?.toLowerCase() === 'kg') {
        return total + quantidade / 1000;
      }
      return total + quantidade;
    }, 0);

    const entradasHojeTon = itens.reduce((total, item) => {
      if (!item.ultima_entrada || !isHoje(item.ultima_entrada)) return total;
      const quantidade = Number(item.quantidade) || 0;
      if (item.unidade?.toLowerCase() === 'kg') {
        return total + quantidade / 1000;
      }
      return total + quantidade;
    }, 0);

    const emTriagem = itens.filter((item) => item.status === 'aguardando_triagem').length;

    setResumo({
      volumeTotalTon,
      entradasHojeTon,
      // Saídas ainda não estão implementadas como movimento separado
      saidasHojeTon: 0,
      emTriagem,
    });
  };

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      setErro(null);
      const data = await listarEstoque({
        busca,
      });
      setEstoque(data);
      calcularResumo(data);
    } catch (err) {
      console.error("Erro ao carregar inventário", err);
      setErro("Não foi possível carregar o inventário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoque();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEstoque();
  };

  const toggleStatusFiltro = (value: string) => {
    setStatusFiltros((atual) =>
      atual.includes(value)
        ? atual.filter((s) => s !== value)
        : [...atual, value]
    );
  };

  const estoqueFiltrado = estoque.filter((item) => {
    if (statusFiltros.length === 0) return true;
    return statusFiltros.includes(item.status);
  });

  const handleBaixarRelatorio = () => {
    const header = [
      "ID",
      "Material",
      "Quantidade",
      "Unidade",
      "Status",
      "Entrada",
      "Patio",
      "NotaFiscal",
    ];

    const linhas = estoque.map((item) => [
      item.id,
      item.material,
      String(item.quantidade),
      item.unidade,
      item.status,
      item.ultima_entrada,
      item.patio ?? "",
      item.notaFiscal ?? "",
    ].join(";"));

    const conteudo = [header.join(";"), ...linhas].join("\n");
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inventario_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Controle de Inventário</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Gestão de volumes e lotes em pátio</p>
        </div>

        <div className="flex gap-3 ">
          <Link to="/registrar-material" className="h-14 rounded-2xl px-8 flex items-center bg-white !text-[var(--color-primary)] hover:bg-gray-100 font-black uppercase italic shadow-2xl transition-all border-none">
            <Box className="mr-2 h-5 w-5" /> Novo Lote Manual
          </Link>
        </div>
      </div>

      {/* Cards de Resumo de Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Volume Total", value: resumo.volumeTotalTon.toFixed(1), unit: "Ton", icon: Scale, color: "text-blue-500" },
          { label: "Entradas (Hoje)", value: `+${resumo.entradasHojeTon.toFixed(1)}`, unit: "Ton", icon: ArrowDownToLine, color: "text-green-500" },
          { label: "Saídas (Hoje)", value: `-${resumo.saidasHojeTon.toFixed(1)}`, unit: "Ton", icon: ArrowUpFromLine, color: "text-orange-500" },
          { label: "Itens em Triagem", value: resumo.emTriagem.toString().padStart(2, '0'), unit: "Lotes", icon: History, color: "text-purple-500" },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] shadow-xl flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl bg-gray-50", card.color)}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-xl font-black text-gray-800 tracking-tighter">
                {card.value} <span className="text-xs text-gray-400">{card.unit}</span>
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LADO ESQUERDO: Filtros e Categorias */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
              <Filter size={14} /> Filtros de Busca
            </h4>

            <form onSubmit={handleBusca} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
                <input
                  type="text"
                  placeholder="ID do Lote ou Material..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 text-xs outline-none focus:bg-white/10 transition-all"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Status do Lote</p>
                {STATUS_OPCOES.map((status) => (
                  <label
                    key={status.value}
                    className="flex items-center gap-3 text-white/80 text-xs cursor-pointer hover:text-white transition-colors p-1"
                  >
                    <input
                      type="checkbox"
                      checked={statusFiltros.includes(status.value)}
                      onChange={() => toggleStatusFiltro(status.value)}
                      className="rounded border-white/20 bg-transparent text-orange-500 focus:ring-orange-500"
                    />
                    {status.label}
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-gray-500 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Aplicar filtros
              </button>
            </form>
          </div>

          {/* Card Informativo */}
          <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <FileText className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
            <h4 className="font-black uppercase italic text-xs mb-2">Relatórios</h4>
            <p className="text-indigo-100 text-[10px] leading-relaxed mb-4">
              Gere o inventário consolidado para conferência de balança.
            </p>
            <button
              type="button"
              onClick={handleBaixarRelatorio}
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Baixar Relatório (CSV)
            </button>
          </div>
        </div>

        {/* DIREITA: Tabela de Inventário */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10">
            {erro && (
              <div className="px-8 py-4 bg-red-50 text-red-600 text-xs font-medium">
                {erro}
              </div>
            )}

            {loading ? (
              <div className="px-8 py-10 text-center text-xs text-gray-400">
                Carregando inventário...
              </div>
            ) : estoqueFiltrado.length === 0 ? (
              <div className="px-8 py-10 text-center text-xs text-gray-400">
                Nenhum lote encontrado com os filtros atuais.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identificação</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Material</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Qtd. Atual</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {estoqueFiltrado.map((item) => (
                    <tr key={item.id} className="group hover:bg-orange-50/30 transition-all">
                      <td className="px-8 py-6">
                        <div className="text-xs font-black text-gray-400 uppercase">#{formatarIdCurto(item.id)}</div>
                        <div className="text-[10px] text-gray-400">Entrada: {formatarDataBR(item.ultima_entrada)}</div>
                        {item.patio && (
                          <div className="text-[10px] text-gray-400 mt-1">Pátio: {item.patio}</div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-gray-800 uppercase italic tracking-tighter">{item.material}</div>
                        {item.notaFiscal && (
                          <div className="text-[10px] text-gray-400 mt-1">NF: {item.notaFiscal}</div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-gray-800">{item.quantidade}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{item.unidade}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          item.status === 'disponivel'
                            ? "bg-green-100 text-green-600"
                            : item.status === 'reservado'
                              ? "bg-blue-100 text-blue-600"
                              : item.status === 'aguardando_triagem'
                                ? "bg-orange-100 text-orange-600"
                                : "bg-gray-100 text-gray-600"
                        )}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
