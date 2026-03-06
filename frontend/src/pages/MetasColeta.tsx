import { useState, useEffect } from 'react';
import { Target, TrendingUp, Info, BadgeCheck, PlusCircle, LayoutDashboard, Trash2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { listarMetas, salvarMeta, editarMeta, deleteMeta } from '../services/metas';
import type { Meta } from '../services/metas';
<<<<<<< HEAD
=======
import { ClassificaçãoMateriais } from '../domain/materiais';
>>>>>>> 67748c1f5223b794bc71d6873e60be11a17a78f2

const MetasColeta = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [valores, setValores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'lista' | 'nova'>('lista');
  const [novaMeta, setNovaMeta] = useState({ tipo: '', quantidade: 0 });

  const fetchMetas = async () => {
    try {
      setLoading(true);
      const data = await listarMetas();
      setMetas(data);
      const iniciais = Object.fromEntries(data.map(m => [m.tipo, m.quantidade]));
      setValores(iniciais);
    } catch (err) {
      console.error("Erro ao carregar metas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const handleCriarMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await salvarMeta(novaMeta.tipo, novaMeta.quantidade);
      alert('Nova meta criada com sucesso!');
      setNovaMeta({ tipo: '', quantidade: 0 });
      setAbaAtiva('lista');
      fetchMetas();
    } catch (err) {
      alert('Erro ao criar nova meta.');
    }
  };

  const handleSalvarEdicao = async (id: string, tipo: string) => {
    const novaQuantidade = valores[tipo];

    try {
      setLoading(true);
      await editarMeta(id, tipo, novaQuantidade);
      await fetchMetas();
      alert('Meta atualizada com sucesso!');
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert('Erro ao persistir a mudança no banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarMeta = async (id: string) => {

    if (!confirm("Tem certeza que deseja excluir esta meta?")) return;

    try {
      setLoading(true);
      await deleteMeta(id);
      await fetchMetas();
      alert("Meta removida com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Não foi possível excluir a meta.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (tipo: string, valor: string) => {
    setValores(prev => ({ ...prev, [tipo]: Number(valor) || 0 }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-white font-black italic uppercase tracking-widest animate-pulse">
      Sincronizando com o estoque...
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* CABEÇALHO FIXO */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Gestão de Performance</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Metas de Coleta e Objetivos Mensais</p>
        </div>
        <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl w-fit backdrop-blur-sm">
          <button
            onClick={() => setAbaAtiva('lista')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase italic text-[10px] transition-all",
              abaAtiva === 'lista' ? "bg-white text-orange-600 shadow-xl" : "text-gray-400 hover:text-white"
            )}
          >
            <LayoutDashboard size={14} /> Painel de Metas
          </button>
          <button
            onClick={() => setAbaAtiva('nova')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase italic text-[10px] transition-all",
              abaAtiva === 'nova' ? "bg-white text-orange-600 shadow-xl" : "text-gray-400 hover:text-white"
            )}
          >
            <PlusCircle size={14} /> Configurar Nova Meta
          </button>
        </div>

      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ESQUERDA: Indicadores Fixos */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-[2rem] border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
              <Info size={14} /> Status da Operação
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                <div>
                  <p className="text-white font-black text-[11px] uppercase italic">Meta Atingida</p>
                  <p className="text-white/50 text-[10px]">Volume ideal para operação.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 animate-pulse" />
                <div>
                  <p className="text-white font-black text-[11px] uppercase italic">Atenção</p>
                  <p className="text-white/50 text-[10px]">Abaixo do esperado.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/20 p-6 rounded-[2rem] border border-orange-500/20 text-white relative overflow-hidden">
            <TrendingUp className="absolute -right-4 -bottom-4 h-24 w-24 text-white/5" />
            <h4 className="font-black uppercase italic text-xs mb-2 text-orange-400">Dica de Gestão</h4>
            <p className="text-white/80 text-[11px] leading-relaxed">
              Mantenha suas metas atualizadas conforme a demanda do pátio para evitar gargalos.
            </p>
          </div>
        </div>

        {/* DIREITA: Conteúdo com Abas */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* RENDERIZAÇÃO DAS ABAS */}
          {abaAtiva === 'lista' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
              {metas.map(meta => {
                const valorInput = valores[meta.tipo] ?? meta.quantidade;
                const porcentagem = meta.quantidade > 0
                  ? Math.min(Math.round((Number(meta.progresso) / meta.quantidade) * 100), 100)
                  : 0;

                const statusColor = porcentagem >= 80 ? "bg-green-500" : porcentagem >= 50 ? "bg-orange-400" : "bg-red-500";
                const textColor = porcentagem >= 80 ? "text-green-600" : porcentagem >= 50 ? "text-orange-500" : "text-red-600";

                return (
                  <div key={meta.id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white/10 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-3 rounded-2xl bg-gray-50 group-hover:bg-white transition-colors shadow-sm", textColor)}>
                          <Target size={20} />
                        </div>
                        <div>
                          <h3 className="font-black uppercase italic text-gray-800 text-sm">{meta.tipo}</h3>
                          <p className="text-[10px] text-gray-400 font-bold">Progresso: {meta.progresso}t / {meta.quantidade}t</p>
                        </div>
                      </div>
                      <div className={cn("text-xl font-black italic", textColor)}>{porcentagem}%</div>
                    </div>

                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", statusColor)}
                        style={{ width: `${porcentagem}%` }}
                      />
                    </div>


                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <label className="text-[10px] font-black uppercase text-gray-400">Ajustar Meta (Ton)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={valorInput}
                          onChange={e => handleChange(meta.tipo, e.target.value)}
                          onBlur={() => handleSalvarEdicao(meta.id, meta.tipo)}
                          className="w-24 text-right font-black text-gray-700 bg-gray-50 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                      <button
                        onClick={() => handleSalvarEdicao(meta.id, meta.tipo)}
                        className="p-1.5 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
                        title="Salvar alteração"
                      >
                        <BadgeCheck size={16} />
                      </button>
                      {/* BOTÃO DE DELETAR */}
                      <button
                        onClick={() => handleDeletarMeta(meta.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Excluir meta"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h3 className="font-black uppercase italic text-gray-800 text-xl">Cadastrar Objetivo</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Adicione um novo material ao monitoramento</p>
              </div>

              <form onSubmit={handleCriarMeta} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tipo de Material</label>
                    <input
                      required
                      placeholder="Ex: Cobre Mel"
                      value={novaMeta.tipo}
                      onChange={e => setNovaMeta({ ...novaMeta, tipo: e.target.value })}
                      className="w-full p-4 bg-[var(--bg-input)]  rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Meta (Toneladas)</label>
                    <input
                      required
                      type="number"
                      placeholder="0.00"
                      value={novaMeta.quantidade || ''}
                      onChange={e => setNovaMeta({ ...novaMeta, quantidade: Number(e.target.value) })}
                      className="w-full p-4 bg-[var(--bg-input)]  rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-16 !bg-orange-600 hover:bg-orange-700 text-white font-black uppercase italic rounded-2xl shadow-lg transition-all">
                  Salvar Nova Meta
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetasColeta;