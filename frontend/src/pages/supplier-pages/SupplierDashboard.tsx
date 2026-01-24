
import { 
  Wallet, 
  Package, 
  Truck, 
  History, 
  TrendingUp, 
  Download,
  Clock,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

export default function SupplierDashboard() {
  return (
    <div className="w-full space-y-6">
      {/* Boas-vindas Personalizado */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Painel do Fornecedor</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Bem-vindo de volta, Recicla Tech Ltda</p>
        </div>
        <Button className="bg-white text-[var(--color-primary)] font-black uppercase italic rounded-2xl h-14 px-8 border-none shadow-2xl">
          <Plus className="mr-2 h-5 w-5" /> Notificar Nova Carga
        </Button>
      </div>

      {/* KPIs Financeiros e de Volume */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Wallet size={24}/></div>
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">DISPONÍVEL</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saldo a Receber</p>
            <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic">R$ 12.450,00</h3>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-b-4 border-orange-500">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Package size={24}/></div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Material Aguardando Coleta</p>
            <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic">18.5 <span className="text-sm">Ton</span></h3>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp size={24}/></div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">+12% ESTE MÊS</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Fornecido (Histórico)</p>
            <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic">142.0 <span className="text-sm">Ton</span></h3>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LADO ESQUERDO: Próximas Coletas */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white rounded-[3rem] shadow-2xl p-8 border border-white/10">
            <div className="flex justify-between items-center mb-8">
                <h4 className="font-black uppercase italic text-gray-800 flex items-center gap-2">
                    <Truck size={20} className="text-[var(--color-primary)]" /> Status de Coletas Agendadas
                </h4>
            </div>
            
            <div className="space-y-4">
                {[
                    { rota: "ROTA NORTE #102", status: "Em Trânsito", data: "Hoje", cor: "blue" },
                    { rota: "COLETA SEMANAL", status: "Confirmado", data: "Amanhã", cor: "green" },
                ].map((coleta, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:border-orange-200 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={cn("p-3 rounded-2xl bg-white shadow-sm", coleta.cor === 'blue' ? "text-blue-500" : "text-green-500")}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h5 className="font-black text-gray-800 uppercase italic text-xs">{coleta.rota}</h5>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{coleta.data}</p>
                            </div>
                        </div>
                        <span className={cn(
                            "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            coleta.cor === 'blue' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                        )}>
                            {coleta.status}
                        </span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* LADO DIREITO: Últimos Pagamentos */}
        <div className="col-span-12 lg:col-span-5">
            <div className="bg-[var(--color-primary-dark)] p-8 rounded-[3rem] text-white shadow-2xl h-full relative overflow-hidden">
                <History className="absolute -right-4 -top-4 h-32 w-32 text-black/10" />
                <h4 className="font-black uppercase italic text-sm mb-6 flex items-center gap-2 relative z-10">
                    <CheckCircle2 size={20} /> Pagamentos Recebidos
                </h4>
                
                <div className="space-y-6 relative z-10">
                    {[
                        { valor: "R$ 8.900,00", data: "12 Mai", ref: "Gusa" },
                        { valor: "R$ 4.200,50", data: "05 Mai", ref: "Ferro Fundido" },
                        { valor: "R$ 15.100,00", data: "28 Abr", ref: "Chapa" },
                    ].map((pag, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                            <div>
                                <p className="text-xl font-black italic tracking-tighter">{pag.valor}</p>
                                <p className="text-[10px] text-orange-200 font-bold uppercase">{pag.ref} • {pag.data}</p>
                            </div>
                            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                                <Download size={16} />
                            </button>
                        </div>
                    ))}
                    <Button variant="ghost" className="w-full text-white/50 hover:text-white text-[10px] font-black uppercase tracking-widest">
                        Ver histórico completo
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}