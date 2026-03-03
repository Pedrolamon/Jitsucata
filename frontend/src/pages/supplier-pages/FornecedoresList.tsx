import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarFornecedores, excluirFornecedor } from '../../services/fornecedores';
import type { Fornecedor } from '../../types/fornecedor';
import { Search, Plus, Trash2, Edit3, Eye, X, MapPin, ShieldCheck, User, Info } from 'lucide-react';


const FornecedoresList = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para controlar o Fornecedor selecionado para o "Veja Mais"
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);

  const navigate = useNavigate();

  const fetchFornecedores = async () => {
    setLoading(true);
    try {
      const data = await listarFornecedores();
      setFornecedores(data);
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFornecedores(); }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este fornecedor?')) {
      await excluirFornecedor(id);
      fetchFornecedores();
    }
  };

  const filteredFornecedores = fornecedores.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cnpj.includes(searchTerm) ||
    f.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" w-full" style={{ backgroundColor: 'var(--color-primary)' }}>

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Fornecedores</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Painel de Controle de Logística</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CNPJ ou cidade..."
              className="pl-10 pr-4 py-2 w-full md:w-80 rounded-md border-none shadow-lg text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="bg-white text-[var(--color-primary)] px-6 py-2 rounded-md font-bold shadow-md hover:bg-gray-100 transition-all uppercase text-sm flex items-center justify-center gap-2"
            onClick={() => navigate('/fornecedores/aprovar')}
          >
            <Plus size={18} /> Aceitar Fornecedor
          </button>
          <button
            className="bg-white text-[var(--color-primary)] px-6 py-2 rounded-md font-bold shadow-md hover:bg-gray-100 transition-all uppercase text-sm flex items-center justify-center gap-2"
            onClick={() => navigate('/fornecedores/novo')}
          >
            <Plus size={18} /> Novo Fornecedor
          </button>
        </div>
      </div>

      {/* Tabela Principal */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-white/20">
        <div className="overflow-x-auto no-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Fornecedor</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Localização</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredFornecedores.map((f) => (
                <tr key={f.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{f.name}</div>
                    <div className="text-[11px] text-gray-500">{f.cnpj}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{f.address.city} / {f.address.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${f.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {f.status ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      {/* BOTÃO VEJA MAIS */}
                      <button
                        onClick={() => setSelectedFornecedor(f)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ver Detalhes Completos"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/fornecedores/${f.id}`)}
                        className="p-2 text-gray-400 hover:text-[var(--color-primary)] rounded-lg"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE DETALHES (VEJA MAIS) --- */}
      {selectedFornecedor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* Header do Modal */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase italic leading-none">{selectedFornecedor.name}</h3>
                <p className="text-sm text-gray-500 mt-1">CNPJ: {selectedFornecedor.cnpj}</p>
              </div>
              <button
                onClick={() => setSelectedFornecedor(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Conteúdo do Modal (Scrollable) */}
            <div className="p-6 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Seção 1: Dados Gerais */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[var(--color-primary)] font-bold uppercase text-xs tracking-widest border-b pb-2">
                  <Info size={16} /> Informações Gerais
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-400 text-[10px] uppercase font-bold">Natureza Jurídica</p><p className="font-medium">{selectedFornecedor.legalNature}</p></div>
                  <div><p className="text-gray-400 text-[10px] uppercase font-bold">Capacidade</p><p className="font-medium">{selectedFornecedor.capacity}</p></div>
                  <div><p className="text-gray-400 text-[10px] uppercase font-bold">Insc. Estadual</p><p className="font-medium">{selectedFornecedor.stateRegistration || 'Não informado'}</p></div>
                  <div><p className="text-gray-400 text-[10px] uppercase font-bold">Telefone</p><p className="font-medium">{selectedFornecedor.Phone}</p></div>
                </div>
              </div>

              {/* Seção 2: Endereço */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[var(--color-primary)] font-bold uppercase text-xs tracking-widest border-b pb-2">
                  <MapPin size={16} /> Localização Completa
                </h4>
                <div className="text-sm space-y-1 text-gray-700">
                  <p><strong>Rua:</strong> {selectedFornecedor.address.street}, {selectedFornecedor.address.number}</p>
                  <p><strong>Bairro:</strong> {selectedFornecedor.address.neighborhood}</p>
                  <p><strong>Cidade/UF:</strong> {selectedFornecedor.address.city} - {selectedFornecedor.address.state}</p>
                  <p><strong>CEP:</strong> {selectedFornecedor.address.cep}</p>
                  {selectedFornecedor.address.complement && <p className="text-gray-500 italic text-xs">Obs: {selectedFornecedor.address.complement}</p>}
                </div>
              </div>

              {/* Seção 3: Licença Ambiental */}
              <div className="space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <h4 className="flex items-center gap-2 text-blue-700 font-bold uppercase text-xs tracking-widest">
                  <ShieldCheck size={16} /> Licença Ambiental
                </h4>
                <div className="text-sm space-y-2">
                  <div><p className="text-blue-400 text-[10px] uppercase font-bold">Número da Licença</p><p className="font-bold text-blue-900">{selectedFornecedor.EnvironmentalLicense.numero}</p></div>
                  <div className="flex justify-between">
                    <div><p className="text-blue-400 text-[10px] uppercase font-bold">Órgão Emissor</p><p className="font-medium">{selectedFornecedor.EnvironmentalLicense.IssuingBody}</p></div>
                    <div><p className="text-blue-400 text-[10px] uppercase font-bold">Validade</p><p className="font-bold text-red-600">{selectedFornecedor.EnvironmentalLicense.validity}</p></div>
                  </div>
                </div>
              </div>

              {/* Seção 4: Representante Legal */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="flex items-center gap-2 text-gray-700 font-bold uppercase text-xs tracking-widest">
                  <User size={16} /> Representante Legal
                </h4>
                <div className="text-sm space-y-2">
                  <p className="font-bold text-gray-900 leading-none">{selectedFornecedor.LegalRepresentative.name}</p>
                  <p className="text-xs text-gray-500 italic">{selectedFornecedor.LegalRepresentative.position}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-200">
                    <div><p className="text-gray-400 text-[10px] uppercase font-bold">CPF</p><p className="text-xs">{selectedFornecedor.LegalRepresentative.cpf}</p></div>
                    <div><p className="text-gray-400 text-[10px] uppercase font-bold">Contato</p><p className="text-xs">{selectedFornecedor.LegalRepresentative.phone}</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            {selectedFornecedor.observacoes && (
              <div className="p-6 bg-orange-50 border-t border-orange-100">
                <p className="text-[10px] uppercase font-black text-orange-800 mb-1">Observações Internas</p>
                <p className="text-sm text-orange-900 italic">{selectedFornecedor.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FornecedoresList;