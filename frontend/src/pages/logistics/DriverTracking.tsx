import { useState } from "react";
import {
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Navigation2,
  Phone,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

// Mock de dados de motoristas e suas rotas atuais
const TRACKING_MOCK = [
  {
    id: 1,
    motorista: "João Silva",
    veiculo: "Scania R450 - ABC-1234",
    status: "em_rota",
    progresso: 65,
    paradas: [
      { local: "Recicla Tech", status: "concluido", hora: "08:30" },
      { local: "Metalúrgica Silva", status: "em_transito", hora: "Est. 10:15" },
      { local: "Indústria Alfa", status: "pendente", hora: "Est. 14:00" },
    ],
  },
  {
    id: 2,
    motorista: "Ricardo Souza",
    veiculo: "Mercedes Axor - XYZ-5678",
    status: "atrasado",
    progresso: 30,
    paradas: [
      { local: "Auto Desmonte", status: "concluido", hora: "09:00" },
      { local: "Sucata Express", status: "atrasado", hora: "Era 10:00" },
    ],
  },
  {
    id: 3,
    motorista: "Marcos Oliveira",
    veiculo: "VW Constellation - KKK-9090",
    status: "disponivel",
    progresso: 0,
    paradas: [],
  },
];

export default function DriverTracking() {
  const [selectedDriver, setSelectedDriver] = useState(TRACKING_MOCK[0]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Live Tracking
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Monitoramento de frotas e coletas em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-[10px] font-black uppercase italic">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            8 Motoristas Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LADO ESQUERDO: LISTA DE MOTORISTAS */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          {TRACKING_MOCK.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedDriver(item)}
              className={cn(
                "p-5 rounded-[2.5rem] cursor-pointer transition-all border-2 relative overflow-hidden",
                selectedDriver.id === item.id
                  ? "bg-white border-[var(--color-primary)] shadow-2xl scale-[1.02]"
                  : "bg-white/10 border-transparent hover:bg-white/20",
              )}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-2xl",
                      item.status === "em_rota"
                        ? "bg-blue-100 text-blue-600"
                        : item.status === "atrasado"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-400",
                    )}
                  >
                    <User size={24} />
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "font-black uppercase italic text-sm",
                        selectedDriver.id === item.id
                          ? "text-gray-800"
                          : "text-white",
                      )}
                    >
                      {item.motorista}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {item.veiculo}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase px-2 py-1 rounded-md",
                      item.status === "em_rota"
                        ? "bg-blue-500 text-white"
                        : item.status === "atrasado"
                          ? "bg-red-500 text-white"
                          : "bg-gray-700 text-white",
                    )}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso */}
              {item.progresso > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-[9px] font-black uppercase mb-1">
                    <span
                      className={
                        selectedDriver.id === item.id
                          ? "text-gray-400"
                          : "text-white/40"
                      }
                    >
                      Progresso da Rota
                    </span>
                    <span
                      className={
                        selectedDriver.id === item.id
                          ? "text-orange-600"
                          : "text-orange-400"
                      }
                    >
                      {item.progresso}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--color-primary)] h-full transition-all duration-1000"
                      style={{ width: `${item.progresso}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* LADO DIREITO: DETALHES DA ROTA E TIMELINE */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white rounded-[3rem] shadow-2xl p-8 h-full border border-white/10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">
                  Status do Itinerário
                </h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <Navigation2
                    size={12}
                    className="text-[var(--color-primary)]"
                  />{" "}
                  Localização atual: Próximo à Rod. dos Bandeirantes
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-xl border-gray-100 text-gray-400 hover:text-[var(--color-primary)]"
              >
                <Phone size={18} className="mr-2" /> Contatar
              </Button>
            </div>

            {/* Timeline Estilizada */}
            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {selectedDriver.paradas.length > 0 ? (
                selectedDriver.paradas.map((parada, idx) => (
                  <div key={idx} className="relative pl-12">
                    {/* Indicador de Status na Timeline */}
                    <div
                      className={cn(
                        "absolute left-0 top-1 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm",
                        parada.status === "concluido"
                          ? "bg-green-500 text-white"
                          : parada.status === "em_transito"
                            ? "bg-blue-500 text-white animate-pulse"
                            : parada.status === "atrasado"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-400",
                      )}
                    >
                      {parada.status === "concluido" ? (
                        <CheckCircle2 size={16} />
                      ) : parada.status === "atrasado" ? (
                        <AlertTriangle size={16} />
                      ) : (
                        <Clock size={16} />
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-black text-gray-800 uppercase italic text-sm leading-none">
                          {parada.local}
                        </h5>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                          {parada.status.replace("_", " ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-gray-300 italic">
                          {parada.hora}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                  <Truck size={48} className="mb-4 opacity-20" />
                  <p className="font-black uppercase italic text-xs tracking-widest">
                    Aguardando atribuição de rota
                  </p>
                </div>
              )}
            </div>

            {/* Ações Rápidas */}
            {selectedDriver.paradas.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                <button className="bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all">
                  Reordenar Paradas
                </button>
                <button className="bg-orange-50 hover:bg-orange-100 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-orange-600 transition-all">
                  Ver no Mapa Real
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
