import { useEffect, useState } from "react";
import { portalService } from "../services/portal";
import {
  MapPin,
  Truck,
  Phone,
  Search,
  Building2,
  Globe,
  Filter,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

const MapaAbastecimento = () => {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [filtroRegiao, setFiltroRegiao] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [filtroVolume, setFiltroVolume] = useState("Todos");

  const fetchData = async () => {
    const params: any = {};
    if (filtroRegiao && filtroRegiao !== 'Todas') {
      // podemos tratar como estado ou cidade
      params.state = filtroRegiao;
      params.city = filtroRegiao;
    }
    const items = await portalService.materialMercado(params);
    // API já traz nome do fornecedor e endereço, montar estrutura similar
    const grouped: Record<string, any[]> = {};
    items.forEach((m: any) => {
      const supplierId = m.fornecedorId;
      if (!grouped[supplierId]) grouped[supplierId] = [];
      grouped[supplierId].push(m);
    });
    const fornecedoresList = Object.values(grouped).map(arr => {
      const first = arr[0];
      return {
        ...first,
        materiais: arr,
        quantidadeTotal: arr.reduce((acc: number, x: any) => acc + x.quantidade, 0),
      };
    });
    setFornecedores(fornecedoresList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Agrupar por região (usando cidade ou estado)
  const fornecedoresPorRegiao = fornecedores.reduce(
    (acc, f) => {
      const regiao = f.address?.city || f.address?.state || "Sem Região";
      if (!acc[regiao]) acc[regiao] = [];
      acc[regiao].push(f);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const regioes = ["Todas", ...Object.keys(fornecedoresPorRegiao)];

  // Quantidade por região
  const quantidadePorRegiao = Object.entries(fornecedoresPorRegiao).map(
    ([regiao, forn]) => ({
      regiao,
      quantidade: (forn as any[]).reduce(
        (acc: number, f: any) => acc + f.quantidadeTotal,
        0,
      ),
    }),
  );

  const handleGlobeClick = (fornecedor: any) => {
    navigate("/rotas", { state: { focusFornecedor: fornecedor.id } });
  };

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Mapa de Abastecimento
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Visualização de materiais por fornecedor e região
          </p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar fornecedor..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white text-xs outline-none focus:bg-white/20 transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LADO ESQUERDO: Filtros de Região */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
              <MapPin size={14} /> Filtrar por Região
            </h4>
            <div className="space-y-2">
              {regioes.map((r) => (
                <button
                  key={r}
                  onClick={() => setFiltroRegiao(r)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase italic transition-all",
                    filtroRegiao === r
                      ? "bg-white text-[var(--color-primary)] shadow-lg"
                      : "text-[var(--color-primary)] hover:bg-white/5",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros Adicionais */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
              <Filter size={14} /> Filtros Avançados
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-white text-[10px] font-bold uppercase">
                  Volume
                </label>
                <select
                  value={filtroVolume}
                  onChange={(e) => setFiltroVolume(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-white/20 text-white border border-white/30 text-xs"
                >
                  <option value="Todos">Todos</option>
                  <option value="Maior Volume">Maior Volume</option>
                  <option value="Menor Volume">Menor Volume</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card de Resumo Logístico */}
          <div className="bg-green-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <Truck className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
            <h4 className="font-black uppercase italic text-[10px] mb-2 tracking-widest">
              Logística
            </h4>
            <p className="text-2xl font-black italic tracking-tighter">
              {fornecedores
                .reduce((acc, f) => acc + f.quantidadeTotal, 0)
                .toFixed(1)}{" "}
              Ton
            </p>
            <p className="text-[10px] text-green-200 uppercase font-bold mt-1">
              Total disponível para coleta
            </p>
          </div>

          {/* Quantidade por Região */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20">
            <h4 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-4">
              Quantidade por Região
            </h4>
            <div className="space-y-2">
              {quantidadePorRegiao.map(({ regiao, quantidade }) => (
                <div key={regiao} className="flex justify-between text-xs">
                  <span className="text-white/70">{regiao}</span>
                  <span className="text-white font-bold">
                    {quantidade.toFixed(1)} Ton
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DIREITA: Lista de Fornecedores por Região */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {Object.entries(fornecedoresPorRegiao).map(([regiao, forn]) => {
            const regiao_forn = forn as any[];
            const fornecedoresFiltradosRegiao = regiao_forn.filter((f) => {
              const matchBusca =
                !busca ||
                f.name?.toLowerCase().includes(busca.toLowerCase()) ||
                f.cnpj?.includes(busca);
              const matchVolume =
                filtroVolume === "Todos" ||
                (filtroVolume === "Maior Volume" && f.quantidadeTotal > 10) ||
                (filtroVolume === "Menor Volume" && f.quantidadeTotal <= 10);
              return matchBusca && matchVolume;
            });

            if (filtroRegiao !== "Todas" && regiao !== filtroRegiao)
              return null;
            if (fornecedoresFiltradosRegiao.length === 0) return null;

            return (
              <div key={regiao} className="space-y-4">
                <h3 className="text-white font-black uppercase italic text-lg tracking-tighter">
                  {regiao}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {fornecedoresFiltradosRegiao.map((f) => (
                    <div
                      key={f.id}
                      className="bg-white p-6 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-stretch group hover:scale-[1.01] transition-all"
                    >
                      {/* Info do Fornecedor */}
                      <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-orange-100 text-[var(--color-primary)] rounded-xl font-black">
                            <Building2 size={20} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-black text-gray-800 uppercase italic">
                              {f.name || f.nome}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {f.address?.city || "Cidade não informada"} •{" "}
                              {f.address?.state || "Estado não informado"}
                            </p>
                          </div>
                          <button
                            onClick={() => handleGlobeClick(f)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Globe size={16} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-green-600 transition-colors">
                            <Phone size={14} />
                          </button>
                          <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-blue-600 transition-colors">
                            <MapPin size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Detalhes dos Materiais */}
                      <div className="md:w-2/3 p-6">
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-gray-800 tracking-tighter">
                              {f.quantidadeTotal.toFixed(1)}
                            </span>
                            <span className="text-xs font-bold text-gray-400 uppercase">
                              Toneladas Disponíveis
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {f.materiais.slice(0, 3).map((m: any) => (
                            <div
                              key={m.id}
                              className="flex justify-between items-center text-xs"
                            >
                              <span className="text-gray-600">{m.tipo}</span>
                              <span className="font-bold text-gray-800">
                                {m.quantidade} {m.unidade}
                              </span>
                            </div>
                          ))}
                          {f.materiais.length > 3 && (
                            <p className="text-[10px] text-gray-400">
                              +{f.materiais.length - 3} materiais
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapaAbastecimento;
