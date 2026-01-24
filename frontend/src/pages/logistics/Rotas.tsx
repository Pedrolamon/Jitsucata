import { useEffect, useState } from 'react';
import { listarMateriais } from '../../services/materiais';
import { listarFornecedores } from '../../services/fornecedores';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, Navigation, Save, Package, Earth } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { Link } from 'react-router-dom';

// Ícones personalizados
const iconFornecedor = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

// Zonas Definidas (Exemplo de áreas de atuação)
const ZONAS_CONFIG = [
  { nome: "Polo Industrial Norte", coords: [-23.45, -46.60], raio: 5000, cor: "#f97316" },
  { nome: "Centro Logístico Sul", coords: [-23.65, -46.70], raio: 4000, cor: "#3b82f6" }
];

const CriarRota = () => {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [nome, setNome] = useState('Rota ' + new Date().toLocaleDateString());
  const [loading, setLoading] = useState(true);
  const [exibirZonas, setExibirZonas] = useState(true);

  useEffect(() => {
    Promise.all([listarMateriais(), listarFornecedores()]).then(([mats, forns]) => {
      // Cruzando dados: Fornecedor + Quantidade de Material Pendente
      const fornsComCarga = forns.map(f => {
        const cargaTotal = mats
          .filter(m => m.fornecedorId === f.id && m.status === 'pendente')
          .reduce((acc, curr) => acc + Number(curr.quantidade), 0);
        return { ...f, cargaTotal };
      });
      setFornecedores(fornsComCarga);
      setLoading(false);
    });
  }, []);

  const handleSelecionar = (id: string) => {
    setSelecionados(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  };

  const pontosRota = fornecedores.filter(f => selecionados.includes(f.id));
  const coordsPolyline = pontosRota.map(f => [f.latitude, f.longitude]);

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Otimizador de Rotas</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Planejamento logístico e zoneamento</p>
        </div>
        <Button onClick={() => alert('Rota Salva!')} className="h-14 px-10 bg-white text-[var(--color-primary)] font-black uppercase italic shadow-2xl border-none">
          <Save className="mr-2 " /> Salvar Itinerário
        </Button>
        <Link
          to="/rotas/criarZonas"
          className="h-14 px-10 bg-white !text-[var(--color-primary)] font-black uppercase italic shadow-2xl rounded-md flex items-center justify-center gap-2 hover:border-black border-1 transition-all"
        >
          <Earth size={20} /> Criar zona
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA: LISTA DE CARGAS */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-[2.5rem] border border-white/20">
            <div className="flex flex-col justify-between items-center ">
              <h4 className="text-white font-black uppercase italic text-[15px] tracking-widest flex items-center gap-2">
                <Truck size={16} /> Zonas Disponiveis
              </h4>
              <button onClick={() => setExibirZonas(!exibirZonas)} className="text-[12px] font-black uppercase text-[var(--color-primary)] transition-colors">
                {exibirZonas ? 'Ocultar Zonas' : 'Ver Zonas'}
              </button>

            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {fornecedores.map(f => (
                <div
                  key={f.id}
                  onClick={() => handleSelecionar(f.id)}
                  className={cn(
                    "p-4 rounded-2xl cursor-pointer transition-all border-2",
                    selecionados.includes(f.id)
                      ? "bg-white border-[var(--color-primary)]"
                      : "bg-white/5 border-transparent hover:bg-white/10"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className={cn("font-black uppercase italic text-xs", selecionados.includes(f.id) ? "text-gray-800" : "text-white")}>
                        {f.name || f.nome}
                      </h5>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">
                        {f.cidade || 'Região Sul'}
                      </p>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-black",
                      f.cargaTotal > 0 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                    )}>
                      {f.cargaTotal}T
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD DE INFO DA ROTA */}
          <div className="bg-[var(--color-primary-dark)] p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <Navigation className="absolute -right-4 -bottom-4 h-24 w-24 text-black/10" />
            <h4 className="font-black uppercase italic text-xs mb-2 tracking-widest">Resumo da Rota</h4>
            <div className="flex gap-4 mt-4">
              <div>
                <p className="text-[9px] uppercase font-bold text-white/50">Paradas</p>
                <p className="text-xl font-black italic">{selecionados.length}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-white/50">Volume Estimado</p>
                <p className="text-xl font-black italic">
                  {pontosRota.reduce((acc, curr) => acc + curr.cargaTotal, 0)} Ton
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: MAPA */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white p-2 rounded-[3rem] shadow-2xl h-[650px] relative overflow-hidden border border-white/10">
            <MapContainer center={[-23.55, -46.63]} zoom={11} className="h-full w-full rounded-[2.8rem]">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Renderização das Zonas */}
              {exibirZonas && ZONAS_CONFIG.map((zona, i) => (
                <Circle
                  key={i}
                  center={zona.coords as any}
                  pathOptions={{ fillColor: zona.cor, color: zona.cor, fillOpacity: 0.15 }}
                  radius={zona.raio}
                >
                  <Popup>{zona.nome}</Popup>
                </Circle>
              ))}

              {/* Marcadores dos Fornecedores */}
              {fornecedores.map((f) => (
                <Marker key={f.id} position={[f.latitude, f.longitude]} icon={iconFornecedor}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-black text-[var(--color-primary)] uppercase italic leading-none mb-1">{f.name || f.nome}</h4>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-2">
                        <Package size={12} /> {f.cargaTotal} Toneladas Pendentes
                      </div>
                      <Button
                        onClick={() => handleSelecionar(f.id)}
                        className="w-full h-8 text-[9px] font-black uppercase italic"
                        variant={selecionados.includes(f.id) ? "destructive" : "default"}
                      >
                        {selecionados.includes(f.id) ? 'Remover' : 'Adicionar à Rota'}
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Linha da Rota */}
              {coordsPolyline.length > 1 && (
                <Polyline positions={coordsPolyline as any} color="#f97316" weight={4} dashArray="10, 10" />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriarRota;