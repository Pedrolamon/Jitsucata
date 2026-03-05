import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import { listarMateriais } from "../../services/materiais";
import { listarFornecedores } from "../../services/fornecedores";
import { Target, Trash2, Plus, Truck, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// --- Sub-componente para capturar cliques no mapa ---
function MapPicker({
  onLocationSelect,
  active,
}: {
  onLocationSelect: (coords: [number, number]) => void;
  active: boolean;
}) {
  useMapEvents({
    click(e) {
      if (active) onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const PlanejadorLogistico = () => {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [novaZona, setNovaZona] = useState<{ nome: string; raio: number }>({
    nome: "",
    raio: 5,
  });

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([listarMateriais(), listarFornecedores()]).then(
      ([mats, forns]) => {
        const fornsComCarga = forns.map((f) => ({
          ...f,
          cargaTotal: mats
            .filter((m) => m.fornecedorId === f.id)
            .reduce((acc, curr) => acc + Number(curr.quantidade), 0),
        }));
        setFornecedores(fornsComCarga);
      },
    );
  }, []);

  const adicionarZona = (coords: [number, number]) => {
    if (!novaZona.nome || !novaZona.raio) return;
    const zonaCompleta = {
      id: Date.now(),
      coords,
      nome: novaZona.nome,
      raio: novaZona.raio * 1000, // converte km para metros
      cor: "#f97316",
    };
    setZonas([...zonas, zonaCompleta]);
    setIsDrawing(false);
    setNovaZona({ nome: "", raio: 5 });
  };

  const gerirRotaDaZona = (zona: any) => {
    // Filtra apenas fornecedores que estão dentro do raio da zona
    const fornecedoresNaZona = fornecedores.filter((f) => {
      const distancia = L.latLng(zona.coords).distanceTo(
        L.latLng(f.latitude, f.longitude),
      );
      return distancia <= zona.raio;
    });

    if (fornecedoresNaZona.length === 0) {
      alert("Nenhum fornecedor encontrado nesta zona para criar rota.");
      return;
    }

    // Envia os dados via State do Router para a tela de Criar Rotas
    navigate("/rotas", {
      state: {
        origem: zona.coords,
        paradas: fornecedoresNaZona,
        nomeZona: zona.nome,
      },
    });
  };

  const removerZona = (id: number) =>
    setZonas(zonas.filter((z) => z.id !== id));

  // Função para calcular carga dentro de uma zona específica
  const calcularCargaNaZona = (
    zonaCoords: [number, number],
    raioMetros: number,
  ) => {
    return fornecedores.reduce((acc, f) => {
      const distancia = L.latLng(zonaCoords).distanceTo(
        L.latLng(f.latitude, f.longitude),
      );
      return distancia <= raioMetros ? acc + f.cargaTotal : acc;
    }, 0);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Zoneamento e Pátio
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Defina perímetros de coleta e análise de carga
          </p>
        </div>

        <div className="flex gap-3">
          {!isDrawing ? (
            <div className="flex gap-3">
              <div className="bg-orange-100 p-4 rounded-2xl">
                <label className="text-orange-800 text-xs font-bold uppercase block mb-2">
                  Nome da Zona
                </label>
                <input
                  type="text"
                  placeholder="Ex: Zona Norte"
                  value={novaZona?.nome || ""}
                  onChange={(e) =>
                    setNovaZona({ ...novaZona, nome: e.target.value })
                  }
                  className="w-full p-2 rounded-lg border border-orange-300 text-sm"
                />
              </div>
              <div className="bg-orange-100 p-4 rounded-2xl">
                <label className="text-orange-800 text-xs font-bold uppercase block mb-2">
                  Raio (km)
                </label>
                <input
                  type="number"
                  placeholder="5"
                  value={novaZona?.raio || ""}
                  onChange={(e) =>
                    setNovaZona({
                      ...novaZona,
                      raio: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-full p-2 rounded-lg border border-orange-300 text-sm"
                  min="1"
                  max="50"
                />
              </div>
              <Button
                onClick={() => setIsDrawing(true)}
                disabled={!novaZona?.nome || !novaZona?.raio}
                className="bg-white text-orange-600 font-black uppercase italic rounded-2xl h-14 px-8 border-none shadow-2xl disabled:opacity-50"
              >
                <Plus className="mr-2" /> Criar Zona
              </Button>
            </div>
          ) : (
            <div className="bg-orange-500 p-4 rounded-2xl flex items-center gap-4 animate-pulse shadow-xl">
              <span className="text-white font-black uppercase italic text-xs">
                Clique no mapa para posicionar a zona "{novaZona.nome}"
              </span>
              <Button
                onClick={() => {
                  setIsDrawing(false);
                  setNovaZona({ nome: "", raio: 5 });
                }}
                variant="ghost"
                className="text-white hover:bg-white/10 h-8 uppercase text-[9px]"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Painel de Gestão de Zonas */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20">
            <h4 className="text-white font-black uppercase italic text-xs mb-6 flex items-center gap-2 tracking-widest">
              <Target size={16} /> Setores de Atuação
            </h4>

            {zonas.length === 0 && (
              <p className="text-white/30 text-[10px] uppercase font-bold italic text-center py-8">
                Nenhuma zona definida no mapa
              </p>
            )}

            <div className="space-y-3">
              {zonas.map((z) => {
                const cargaZona = calcularCargaNaZona(z.coords, z.raio);
                return (
                  <div
                    key={z.id}
                    className="bg-white p-5 rounded-[2rem] shadow-lg group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-black uppercase italic text-gray-800 text-xs">
                        {z.nome}
                      </h5>
                      <button
                        onClick={() => removerZona(z.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            Alcance
                          </p>
                          <p className="text-sm font-black text-gray-700 italic">
                            {z.raio / 1000}km
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            Carga Total
                          </p>
                          <p className="text-sm font-black text-orange-600 italic">
                            {cargaZona.toFixed(1)}t
                          </p>
                        </div>
                      </div>
                      <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                        <Truck size={18} />
                      </div>
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-4 flex justify-end">
                      <Button
                        onClick={() => gerirRotaDaZona(z)}
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-10 text-[10px] font-black uppercase italic w-full"
                      >
                        Criar Rota desta Zona{" "}
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mapa Interativo de Zoneamento */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white p-2 rounded-[3rem] shadow-2xl h-[600px] border border-white/10 relative overflow-hidden">
            <MapContainer
              center={[-23.55, -46.63]}
              zoom={11}
              className="h-full w-full rounded-[2.8rem]"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <MapPicker active={isDrawing} onLocationSelect={adicionarZona} />

              {zonas.map((z) => (
                <Circle
                  key={z.id}
                  center={z.coords}
                  radius={z.raio}
                  pathOptions={{
                    color: "#f97316",
                    fillColor: "#f97316",
                    fillOpacity: 0.2,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="font-black uppercase italic text-xs text-orange-600">
                      {z.nome}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400">
                      RAIO DE {z.raio / 1000}KM
                    </div>
                  </Popup>
                </Circle>
              ))}

              {fornecedores.map((f) => (
                <Marker
                  key={f.id}
                  position={[f.latitude, f.longitude]}
                  icon={
                    new L.Icon({
                      iconUrl:
                        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
                      iconSize: [20, 32],
                    })
                  }
                >
                  <Popup>
                    <div className="font-bold text-xs uppercase">
                      {f.name || f.nome}
                    </div>
                    <div className="text-[10px] text-orange-500 font-black">
                      {f.cargaTotal}T DISPONÍVEIS
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanejadorLogistico;
