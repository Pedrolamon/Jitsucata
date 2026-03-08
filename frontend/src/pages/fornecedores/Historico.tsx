import { useEffect, useState } from 'react';
import { portalService } from '../../services/portal';
import type { HistoricoMovimentacao } from '../../services/portal';
import { History, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SupplierHistorico() {
    const [movs, setMovs] = useState<HistoricoMovimentacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState<'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'TRANSFERENCIA' | 'TODOS'>('TODOS');

    useEffect(() => {
        portalService
            .historicoEstoque()
            .then(setMovs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const movsFiltered = filtroTipo === 'TODOS' ? movs : movs.filter(m => m.tipo === filtroTipo);

    const getIcon = (tipo: string) => {
        return tipo === 'ENTRADA' ? <ArrowDown size={16} className="text-green-600" /> : <ArrowUp size={16} className="text-red-600" />;
    };

    const getCor = (tipo: string) => {
        return tipo === 'ENTRADA' ? 'bg-green-50' : 'bg-red-50';
    };

    return (
        <div className="w-full space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Histórico de Movimentações</h2>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Visualize todas as movimentações do seu estoque</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
                {(['TODOS', 'ENTRADA', 'SAIDA', 'AJUSTE'] as const).map((tipo) => (
                    <button
                        key={tipo}
                        onClick={() => setFiltroTipo(tipo)}
                        className={cn(
                            "px-6 py-2 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all",
                            filtroTipo === tipo
                                ? "bg-white text-[var(--color-primary)] shadow-lg"
                                : "bg-white/20 text-white hover:bg-white/30"
                        )}
                    >
                        {tipo}
                    </button>
                ))}
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
                {!loading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Data/Hora</th>
                                    <th className="text-left py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Material</th>
                                    <th className="text-center py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Tipo</th>
                                    <th className="text-right py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Quantidade</th>
                                    <th className="text-right py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Unidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movsFiltered.length > 0 ? (
                                    movsFiltered.map((m) => (
                                        <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-bold text-gray-800 text-sm">
                                                {new Date(m.dataRegistro).toLocaleString('pt-BR')}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-gray-700">{m.tipo_material || '-'}</td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={cn("inline-block p-2 rounded-lg", getCor(m.tipo))}>
                                                    {getIcon(m.tipo)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-black text-gray-800 italic text-right">{
                                                m.quantidade.toFixed(2)
                                            }</td>
                                            <td className="py-4 px-6 text-gray-600 text-right uppercase text-sm font-bold">{m.unidade}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">
                                            <History size={32} className="mx-auto mb-2 opacity-50" />
                                            <p>Nenhuma movimentação encontrada</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-400">Carregando...</div>
                )}
            </div>
        </div>
    );
}
