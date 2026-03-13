import { useEffect, useState } from 'react';
import { portalService } from '../../services/portal';
import type { PagamentoResumo } from '../../services/portal';
import { CircleDollarSign, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SupplierCashflow() {
    const [pagamentos, setPagamentos] = useState<PagamentoResumo[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

    useEffect(() => {
        portalService
            .fluxoFinanceiro()
            .then(setPagamentos)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        recebido: pagamentos.reduce((a, b) => a + (b.status === 'pago' ? b.valor : 0), 0),
        pendente: pagamentos.reduce((a, b) => a + (b.status === 'agendado' ? b.valor : 0), 0),
        atrasado: pagamentos.reduce((a, b) => a + (b.status === 'atrasado' ? b.valor : 0), 0),
    };

    const pagsFiltered = filtroStatus === 'TODOS' ? pagamentos : pagamentos.filter(p => p.status === filtroStatus);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pago':
                return <CheckCircle2 size={16} className="text-green-600" />;
            case 'atrasado':
                return <XCircle size={16} className="text-red-600" />;
            default:
                return <Clock size={16} className="text-orange-600" />;
        }
    };

    const getStatusCor = (status: string) => {
        switch (status) {
            case 'pago':
                return 'bg-green-100 text-green-600';
            case 'atrasado':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-orange-100 text-orange-600';
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Fluxo de Caixa</h2>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Visualize seus pagamentos e saldos</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><CheckCircle2 size={24} /></div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recebido</p>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic">R$ {stats.recebido.toFixed(2)}</h3>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-b-4 border-orange-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Clock size={24} /></div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pendente</p>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic">R$ {stats.pendente.toFixed(2)}</h3>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><XCircle size={24} /></div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atrasado</p>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic">R$ {stats.atrasado.toFixed(2)}</h3>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
                {['TODOS', 'pago', 'agendado', 'atrasado'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFiltroStatus(status)}
                        className={cn(
                            "px-6 py-2 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all",
                            filtroStatus === status
                                ? "bg-white text-[var(--color-primary)] shadow-lg"
                                : "bg-white/20 text-gray-500 hover:bg-white/30"
                        )}
                    >
                        {status}
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
                                    <th className="text-left py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Data</th>
                                    <th className="text-left py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Material</th>
                                    <th className="text-right py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Valor</th>
                                    <th className="text-center py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagsFiltered.length > 0 ? (
                                    pagsFiltered.map((p) => (
                                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-bold text-gray-800 text-sm">
                                                {new Date(p.data_pagamento).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-gray-700">{p.material}</td>
                                            <td className="py-4 px-6 font-black text-[var(--color-primary)] italic text-right">R$ {p.valor.toFixed(2)}</td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={cn("inline-block p-2 rounded-lg", getStatusCor(p.status))}>
                                                    {getStatusIcon(p.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-400">
                                            <CircleDollarSign size={32} className="mx-auto mb-2 opacity-50" />
                                            <p>Nenhum pagamento encontrado</p>
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
