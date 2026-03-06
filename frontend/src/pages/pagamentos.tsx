import { useState } from 'react';
import {
    DollarSign,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,

    Filter,
    FileSpreadsheet
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

// Mock de dados de pagamentos
const PAGAMENTOS_MOCK = [
    { id: 1, fornecedor: "Recicla Tech Ltda", material: "Sucata de Gusa", valor: 12500.00, data: "2024-05-20", status: "pago", metodo: "PIX" },
    { id: 2, fornecedor: "Metalúrgica Silva", material: "Chapa Recorte", valor: 8900.50, data: "2024-05-22", status: "agendado", metodo: "TED" },
    { id: 3, fornecedor: "Auto Desmonte", material: "Ferro Fundido", valor: 4200.00, data: "2024-05-18", status: "atrasado", metodo: "Boleto" },
    { id: 4, fornecedor: "Indústria Alfa", material: "Cavaco", valor: 15700.00, data: "2024-05-25", status: "agendado", metodo: "PIX" },
];

export default function Payments() {
    const [filter, setFilter] = useState('todos');

    return (
        <div className="w-full space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Fluxo Financeiro</h2>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Gestão de pagamentos e liquidações</p>
                </div>

                <div className="flex gap-3">
                    <Button className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl h-12">
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Relatório
                    </Button>
                    <Button className="h-12 px-8 bg-white text-[var(--color-primary)] hover:bg-gray-100 font-black uppercase italic shadow-2xl transition-all border-none">
                        <DollarSign className="mr-2 h-5 w-5" /> Novo Lançamento
                    </Button>
                </div>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-green-500">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pago (Mês)</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-800 tracking-tighter">R$ 45.300,00</h3>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ArrowUpRight size={20} /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-orange-400">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Agendado / Pendente</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-800 tracking-tighter">R$ 24.600,50</h3>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Clock size={20} /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-red-500">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Atrasos de Faturamento</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-800 tracking-tighter">R$ 4.200,00</h3>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ArrowDownLeft size={20} /></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Filtros Laterais */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
                        <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
                            <Filter size={14} /> Filtrar Status
                        </h4>
                        <div className="space-y-2">
                            {['todos', 'pago', 'agendado', 'atrasado'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase italic transition-all",
                                        filter === s ? "bg-white text-[var(--color-primary)]" : "text-white/60 hover:bg-white/5"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabela de Pagamentos */}
                <div className="col-span-12 lg:col-span-9">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedor / Material</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Recibo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {PAGAMENTOS_MOCK.filter(p => filter === 'todos' || p.status === filter).map((pag) => (
                                    <tr key={pag.id} className="hover:bg-orange-50/30 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-black text-gray-800 leading-none">{pag.fornecedor}</div>
                                            <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{pag.material} • {pag.metodo}</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-black text-gray-700">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pag.valor)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                <Calendar size={14} />
                                                {new Date(pag.data).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
                                                pag.status === 'pago' ? "bg-green-100 text-green-600" :
                                                    pag.status === 'agendado' ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                                            )}>
                                                {pag.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
    );
}
