import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Calendar, 
  Download, 
  ChevronRight, 
  ExternalLink,
  Printer,
  FilterX
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

// Mock de dados históricos
const HISTORICO_MOCK = [
  { id: "PAY-9821", data: "2024-04-12", fornecedor: "Recicla Tech Ltda", volume: "12.5 Ton", valor: 15200.00, status: "concluido" },
  { id: "PAY-9815", data: "2024-04-10", fornecedor: "Metalúrgica Silva", volume: "8.2 Ton", valor: 9400.00, status: "concluido" },
  { id: "PAY-9790", data: "2024-03-28", fornecedor: "Auto Desmonte", volume: "5.0 Ton", valor: 5500.00, status: "concluido" },
  { id: "PAY-9750", data: "2024-03-15", fornecedor: "Indústria Alfa", volume: "20.1 Ton", valor: 22800.00, status: "estornado" },
  { id: "PAY-9710", data: "2024-03-05", fornecedor: "Sucata Express", volume: "15.0 Ton", valor: 17250.00, status: "concluido" },
];

export default function PaymentHistory() {
  const [busca, setBusca] = useState('');
  const [dateRange, setDateRange] = useState({
  start: '',
  end: ''
  });

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho com Busca Integrada */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Histórico de Transações</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Consulta de registros financeiros passados</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Buscar por ID ou Fornecedor..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white text-xs outline-none focus:bg-white/20 transition-all placeholder:text-white/30"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Button className="bg-white text-[var(--color-primary)] hover:bg-gray-100 rounded-2xl h-12 px-6">
            <Printer size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LADO ESQUERDO: Filtros Rápidos de Data */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
              <Calendar size={14} /> Período
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <button className="px-4 py-3 bg-white text-[var(--color-primary)] font-black text-[10px] uppercase italic rounded-xl shadow-lg">Últimos 30 dias</button>
              <button className="px-4 py-3 bg-white/5 text-[var(--color-primary)] hover:bg-white/10 font-black text-[10px] uppercase italic rounded-xl transition-all">Últimos 15 dias</button>
              <button className="px-4 py-3 bg-white/5 text-[var(--color-primary)] hover:bg-white/10 font-black text-[10px] uppercase italic rounded-xl transition-all">Última semana</button>
              <div className="grid grid-cols-1 gap-2">
  {/* Novo Container de Período Customizado */}
  <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
    <p className="text-white text-[13px] font-black uppercase italic mb-1">Período Customizado:</p>
    
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-white/50 uppercase">De:</label>
        <input 
          type="date" 
          value={dateRange.start}
          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          className="bg-white text-[var(--color-primary)] text-[10px] font-bold p-1 rounded-md outline-none"
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-white/50 uppercase">Até:</label>
        <input 
          type="date" 
          value={dateRange.end}
          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          className="bg-white text-[var(--color-primary)] text-[10px] font-bold p-1 rounded-md outline-none"
        />
      </div>
    </div>
  </div>
</div>
              <button className="mt-4 flex items-center justify-center gap-2 text-[var(--color-primary)] text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">
                <FilterX size={12} /> Limpar Filtros
              </button>
            </div>
          </div>

          
          <div className="bg-orange-600 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
             <History className="absolute -right-4 -bottom-4 h-24 w-24 text-black/10 group-hover:scale-110 transition-transform" />
             <h4 className="font-black uppercase italic text-xs mb-2">Total do Período</h4>
             <p className="text-3xl font-black tracking-tighter italic">R$ 70.150,50</p>
             <p className="text-[10px] text-orange-200 uppercase font-bold mt-2 tracking-widest">64 transações concluídas</p>
          </div>
        </div>

        {/* DIREITA: Lista do Histórico */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Data</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedor</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume / Valor</th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {HISTORICO_MOCK.map((item) => (
                    <tr key={item.id} className="group hover:bg-orange-50/30 transition-all cursor-default">
                      <td className="px-8 py-5">
                        <div className="text-xs font-black text-[var(--color-primary)]">#{item.id}</div>
                        <div className="text-[11px] text-gray-400 font-medium">{new Date(item.data).toLocaleDateString('pt-BR')}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-black text-gray-800">{item.fornecedor}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter italic">Pagamento Concluído</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-black text-gray-800">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{item.volume} Coletadas</div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                          item.status === 'concluido' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center gap-2">
                          <button title="Baixar Comprovante" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <Download size={16} />
                          </button>
                          <button title="Ver Detalhes" className="p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-orange-50 rounded-xl transition-all">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginação Simples */}
            <div className="p-6 bg-gray-50/50 flex justify-between items-center border-t border-gray-100">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Exibindo 5 de 142 registros</span>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-8 text-[10px] font-black uppercase rounded-lg">Anterior</Button>
                    <Button variant="outline" className="h-8 text-[10px] font-black uppercase rounded-lg bg-white">Próximo</Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}