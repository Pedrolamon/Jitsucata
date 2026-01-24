import React, { useEffect, useState } from 'react';
import { listarMateriais, excluirMaterial } from '../services/materiais';
import type { Material } from '../services/materiais';
import { 
  MapPin, 
  Truck, 
  Phone, 
  Search, 
  Trash2,
  Building2,
  Calendar
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const MapaAbastecimento = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroRegiao, setFiltroRegiao] = useState('Todas');
  const [busca, setBusca] = useState('');

  const fetchMateriais = async () => {
    setLoading(true);
    setMateriais(await listarMateriais());
    setLoading(false);
  };

  useEffect(() => { fetchMateriais(); }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Remover este registro de material do mapa?')) {
      await excluirMaterial(id);
      fetchMateriais();
    }
  };

  // Exemplo de regiões (isso viria dos dados dos seus fornecedores)
  const regioes = ['Todas', 'Centro', 'Zona Norte', 'Zona Sul', 'Industrial'];

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Mapa de Abastecimento</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Visualização de materiais por fornecedor e região</p>
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
                    filtroRegiao === r ? "bg-white text-[var(--color-primary)] shadow-lg" : "text-[var(--color-primary)] hover:bg-white/5"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Card de Resumo Logístico */}
          <div className="bg-green-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
             <Truck className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
             <h4 className="font-black uppercase italic text-[10px] mb-2 tracking-widest">Logística</h4>
             <p className="text-2xl font-black italic tracking-tighter">142.5 Ton</p>
             <p className="text-[10px] text-green-200 uppercase font-bold mt-1">Total disponível para coleta</p>
          </div>
        </div>

        {/* DIREITA: Lista de Materiais Disponíveis */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
         
            <div className="grid grid-cols-1 gap-4">
              {materiais.map((m) => (
                <div key={m.id} className="bg-white p-2 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-stretch group hover:scale-[1.01] transition-all">
                  
                  {/* Info do Fornecedor */}
                  <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 text-[var(--color-primary)] rounded-xl font-black">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-gray-800 uppercase italic">Fornecedor Exemplo</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Zona Sul • SP</p>
                      </div>
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

                  {/* Detalhes do Material */}
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                          {m.tipo}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-gray-800 tracking-tighter">{m.quantidade}</span>
                          <span className="text-xs font-bold text-gray-400 uppercase">{m.unidade}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                          <Calendar size={12} /> {new Date(m.dataRegistro).toLocaleDateString()}
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase mt-2 inline-block",
                          m.status === 'pendente' ? "text-orange-400" : "text-green-500"
                        )}>
                          ● {m.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="p-6 md:w-48 bg-gray-50 md:rounded-r-[1.8rem] flex flex-col justify-center gap-2">
                    <Button className="w-full bg-[var(--color-primary)] hover:bg-[#BF5A1B] text-white text-[10px] font-black uppercase h-10 rounded-xl">
                      Agendar Coleta
                    </Button>
                    <button 
                      onClick={() => handleDelete(m.id)}
                      className="w-full flex items-center justify-center gap-2 text-gray-300 hover:text-red-500 text-[10px] font-black uppercase transition-colors"
                    >
                      <Trash2 size={12} /> Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapaAbastecimento;