import { useState } from "react";
import { ClassificaçãoMateriais, ClassificaçãoMateriaisNãoferrosos } from "../../domain/materiais";
import { Search, Info, AlertTriangle, X } from "lucide-react";
import { TabNavigation } from '../../components/TabNavigation';
import { LayoutDashboard, PlusCircle, Settings } from 'lucide-react';

export default function MaterialClassification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<typeof ClassificaçãoMateriais[0] | null>(null);
  const [abaAtiva, setAbaAtiva] = useState('ferrosa');

  const baseDeDados = abaAtiva === 'ferrosa' 
    ? ClassificaçãoMateriais 
    : ClassificaçãoMateriaisNãoferrosos;

  // Filtro para busca por título
  const filteredMaterials = baseDeDados.filter((m) =>
    m.Titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const minhasAbas = [
    { id: 'ferrosa', label: 'Sucata Ferrosa', icon: LayoutDashboard },
    { id: 'nao-ferrosa', label: 'Sucata Não Ferrosa', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-primary)' }}>

      {/* Cabeçalho e Busca */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Classificação de Materiais
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Padrões de Qualidade e Sucata</p>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            {abaAtiva === 'ferrosa' ? 'Metais de Base de Ferro' : 'Metais Nobres e Ligas'}
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar material..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-2xl outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TabNavigation 
          tabs={minhasAbas} 
          activeTab={abaAtiva} 
          onChange={setAbaAtiva} 
        />
      </div>

      

      {/* Grid de Materiais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMaterials.map((material, index) => (
          <div
            key={index}
            onClick={() => setSelectedMaterial(material)}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400 uppercase font-black text-[10px] p-4 text-center">
                <img
                  src={material.ImagemUrl}
                  alt={material.Titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Conteúdo do Card */}
            <div className="p-5">
              <h3 className="text-sm font-black text-gray-800 uppercase leading-tight h-10 line-clamp-2">
                {material.Titulo}
              </h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-3 italic">
                {material.Descrição}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-tighter flex items-center gap-1">
                  <Info size={12} /> Ver Detalhes
                </span>
                {material.Contaminações && (
                  <span title="Possui Contaminações">
                    <AlertTriangle size={14} className="text-orange-500" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes do Material */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

            {/* Imagem no Modal */}
            <div className="h-64 bg-gray-300 relative">
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase">
                <img
                  src={selectedMaterial.ImagemUrl}
                  alt={selectedMaterial.Titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
              >
                <X size={24} className="text-black" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto no-scrollbar">
              <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-4">
                {selectedMaterial.Titulo}
              </h3>

              <div className="space-y-6">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] mb-2">Descrição Técnica</h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {selectedMaterial.Descrição}
                  </p>
                </section>

                {selectedMaterial.Contaminações && (
                  <section className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2 flex items-center gap-2">
                      <AlertTriangle size={14} /> Contaminações / Alertas
                    </h4>
                    <p className="text-red-800 text-sm italic font-medium">
                      {selectedMaterial.Contaminações}
                    </p>
                  </section>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold uppercase text-xs hover:bg-black transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}