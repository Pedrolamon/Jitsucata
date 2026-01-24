import { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertTriangle, Save, Info, ArrowUpRight, BadgeCheck } from 'lucide-react';
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { listarMetas, definirMeta } from '../services/alertas';
import { getTiposMateriais } from '../services/materiais';

// Simulação de dados coletados no mês (Em um cenário real, viria do seu banco de dados/estoque)
const PROGRESSO_ATUAL_MOCK: Record<string, number> = {
  "Sucata de Gusa": 320,
  "Sucata Ferro Fundido": 150,
  "Sucata de Aço": 480,
  "Estamparia": 45,
};

const MetasColeta = () => {
  const tipos = getTiposMateriais();
  const [metas, setMetas] = useState(() => listarMetas());
  const [valores, setValores] = useState<Record<string, number>>(() =>
    Object.fromEntries(metas.map(m => [m.tipo, m.quantidade]))
  );

  const handleChange = (tipo: string, valor: string) => {
    const valorNumerico = Number(valor) || 0;
    setValores(prev => ({ ...prev, [tipo]: valorNumerico }));
  };

  const handleSalvar = () => {
    tipos.forEach(tipo => {
      definirMeta(tipo, valores[tipo] || 0);
    });
    setMetas(listarMetas());
    alert('Metas de coleta atualizadas com sucesso!');
  };

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Gestão de Performance</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Metas de Coleta e Objetivos Mensais</p>
        </div>

        <Button
          onClick={handleSalvar}
          className="h-16 px-12 bg-white text-[var(--color-primary)] hover:bg-gray-100 font-black uppercase italic shadow-2xl transition-all border-none ring-offset-[var(--color-primary)]"
        >
          <BadgeCheck className="mr-2 !h-6 !w-6" /> Atualizar Objetivos
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ESQUERDA: Legenda e Resumo */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-[2rem] border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
              <Info size={14} /> Indicadores de Status
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
                  <p className="text-white font-black text-[11px] uppercase italic">Abaixo do Esperado</p>
                  <p className="text-white/50 text-[10px]">Requer atenção comercial.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500" />
                <div>
                  <p className="text-white font-black text-[11px] uppercase italic">Crítico</p>
                  <p className="text-white/50 text-[10px]">Risco de desabastecimento.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Insight */}
          <div className="bg-[var(--color-primary-dark)] p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
            <TrendingUp className="absolute -right-4 -bottom-4 h-24 w-24 text-black/10" />
            <h4 className="font-black uppercase italic text-xs mb-2">Insight do Mês</h4>
            <p className="text-white/60 text-[11px] leading-relaxed">
              O material <b>Sucata de Aço</b> teve um aumento de 15% na coleta em relação à semana passada.
            </p>
          </div>
        </div>

        {/* DIREITA: Grid de Metas (Cards) */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tipos.map(tipo => {
              const metaDefinida = valores[tipo] || 0;
              const progresso = PROGRESSO_ATUAL_MOCK[tipo] || 0;
              const porcentagem = metaDefinida > 0 ? Math.min(Math.round((progresso / metaDefinida) * 100), 100) : 0;

              // Define a cor baseada no progresso
              const statusColor = porcentagem >= 80 ? "bg-green-500" : porcentagem >= 50 ? "bg-orange-400" : "bg-red-500";
              const textColor = porcentagem >= 80 ? "text-green-600" : porcentagem >= 50 ? "text-orange-500" : "text-red-600";

              return (
                <div key={tipo} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white/10 group hover:translate-y-[-4px] transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-3 rounded-2xl bg-gray-50 group-hover:bg-white transition-colors shadow-sm", textColor)}>
                        <Target size={20} />
                      </div>
                      <div>
                        <h3 className="font-black uppercase italic text-gray-800 text-sm">{tipo}</h3>
                        <p className="text-[10px] text-gray-400 font-bold">Progresso: {progresso}t / {metaDefinida}t</p>
                      </div>
                    </div>
                    <div className={cn("text-xl font-black italic", textColor)}>
                      {porcentagem}%
                    </div>
                  </div>

                  {/* Barra de Progresso Customizada */}
                  <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000 ease-out", statusColor)}
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>

                  {/* Input de Edição da Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <label className="text-[10px] font-black uppercase text-gray-400">Ajustar Meta (Ton)</label>
                    <input
                      type="number"
                      min="0"
                      value={valores[tipo] ?? ''}
                      onChange={e => handleChange(tipo, e.target.value)}
                      className="w-24 text-right font-black text-gray-700 bg-gray-50 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetasColeta;