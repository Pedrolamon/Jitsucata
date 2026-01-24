import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { 
  Check, X, Loader2, ArrowLeft, ChevronDown, ChevronUp, 
  MapPin, ShieldCheck, User, Mail, Phone, Building2, Calendar, Hash, Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card'; 
import type { Fornecedor } from '../types/fornecedor';

const Aprovar = () => {
  const [pendentes, setPendentes] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPendentes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/fornecedores/pendentes");
      setPendentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar pendentes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendentes();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAprovar = async (id: string) => {
    try {
      setBtnLoading(id);
      await api.patch(`/fornecedores/aprovar/${id}`);
      setPendentes(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      alert("Erro ao aprovar fornecedor.");
    } finally {
      setBtnLoading(null);
    }
  };

  const handleRecusar = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja apagar permanentemente os dados deste fornecedor?")) return;
    try {
      setBtnLoading(id);
      await api.delete(`/admin/recusar/${id}`);
      setPendentes(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao recusar:", error);
    } finally {
      setBtnLoading(null);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-primary)]">
      <Loader2 className="animate-spin text-white" size={40} />
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="text-white hover:opacity-80 flex items-center gap-2 mb-4">
          <ArrowLeft size={20} /> Voltar
        </button>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Solicitações de Cadastro</h1>
        <p className="text-white/70">Revise todos os dados técnicos e legais antes da aprovação.</p>
      </div>

      <div className="grid gap-6">
        {pendentes.length === 0 ? (
          <p className="text-white/40 italic text-center py-20">Nenhuma solicitação pendente.</p>
        ) : (
          pendentes.map((f: any) => (
            <Card key={f.id} className="bg-white border-none shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* CABEÇALHO RESUMIDO */}
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-white">
                  <div className="flex items-center gap-4 w-full">
                    <button 
                      onClick={() => toggleExpand(f.id)}
                      className="p-3 bg-orange-50 text-[var(--color-primary)] rounded-xl hover:bg-orange-100 transition-colors"
                    >
                      {expandedId === f.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 uppercase italic leading-tight">{f.name}</h2>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">CNPJ: {f.cnpj}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleRecusar(f.id)}
                      disabled={btnLoading === f.id}
                    >
                      <X size={18} className="mr-2" /> Recusar
                    </Button>
                    <Button 
                      className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      onClick={() => handleAprovar(f.id)}
                      disabled={btnLoading === f.id}
                    >
                      {btnLoading === f.id ? <Loader2 className="animate-spin mr-2" size={18} /> : <Check size={18} className="mr-2" />}
                      Aprovar Cadastro
                    </Button>
                  </div>
                </div>

                {/* DETALHES COMPLETOS (EXPANDIDO) */}
                {expandedId === f.id && (
                  <div className="px-6 md:px-12 pb-10 pt-6 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      
                      {/* 1. DADOS DO NEGÓCIO */}
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-black text-[10px] text-orange-600 uppercase tracking-widest border-b pb-1">
                          <Building2 size={14}/> Dados do Negócio
                        </h4>
                        <div className="text-sm space-y-1">
                          <p><span className="text-gray-400 text-[10px] uppercase font-bold block">Natureza Jurídica:</span> <span className="font-semibold">{f.legalNature}</span></p>
                          <p><span className="text-gray-400 text-[10px] uppercase font-bold block">Inscrição Estadual:</span> <span className="font-semibold">{f.stateRegistration || 'Isento/Não inf.'}</span></p>
                          <p><span className="text-gray-400 text-[10px] uppercase font-bold block">Capacidade Logística:</span> <span className="font-semibold">{f.capacity}</span></p>
                        </div>
                      </div>

                      {/* 2. LOCALIZAÇÃO */}
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-black text-[10px] text-orange-600 uppercase tracking-widest border-b pb-1">
                          <MapPin size={14}/> Endereço Completo
                        </h4>
                        <div className="text-sm space-y-1">
                          <p className="font-semibold">{f.address?.street}, {f.address?.number}</p>
                          <p>{f.address?.neighborhood}</p>
                          <p>{f.address?.city} - {f.address?.state}</p>
                          <p className="text-gray-500">CEP: {f.address?.cep}</p>
                          {f.address?.complement && <p className="text-[11px] italic text-gray-400">Comp: {f.address.complement}</p>}
                        </div>
                      </div>

                      {/* 3. LICENÇA AMBIENTAL */}
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-black text-[10px] text-blue-600 uppercase tracking-widest border-b pb-1">
                          <ShieldCheck size={14}/> Licença Ambiental
                        </h4>
                        <div className="text-sm space-y-1 bg-blue-50 p-2 rounded-lg border border-blue-100">
                          <p><span className="text-blue-400 text-[9px] uppercase font-bold block">Número:</span> <span className="font-bold text-blue-900">{f.EnvironmentalLicense?.numero}</span></p>
                          <p><span className="text-blue-400 text-[9px] uppercase font-bold block">Órgão Emissor:</span> <span className="font-medium text-blue-800">{f.EnvironmentalLicense?.IssuingBody}</span></p>
                          <p><span className="text-blue-400 text-[9px] uppercase font-bold block">Vencimento:</span> <span className="font-bold text-red-600">{f.EnvironmentalLicense?.validity}</span></p>
                        </div>
                      </div>

                      {/* 4. REPRESENTANTE E CONTATO */}
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-black text-[10px] text-emerald-600 uppercase tracking-widest border-b pb-1">
                          <User size={14}/> Representante Legal
                        </h4>
                        <div className="text-sm space-y-1">
                          <p className="font-bold text-gray-900">{f.LegalRepresentative?.name}</p>
                          <p className="text-xs text-gray-500 uppercase font-bold italic">{f.LegalRepresentative?.position}</p>
                          <p className="flex items-center gap-2 pt-2"><Mail size={12} className="text-gray-400"/> {f.email}</p>
                          <p className="flex items-center gap-2"><Phone size={12} className="text-gray-400"/> {f.Phone || f.LegalRepresentative?.phone}</p>
                          <p className="flex items-center gap-2"><Hash size={12} className="text-gray-400"/> CPF: {f.LegalRepresentative?.cpf}</p>
                        </div>
                      </div>

                    </div>

                    {/* OBSERVAÇÕES E DATAS (RODAPÉ DO CARD) */}
                    <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between gap-4">
                      {f.observacoes && (
                        <div className="max-w-2xl">
                          <p className="text-[10px] font-black uppercase text-gray-400 mb-1 flex items-center gap-1"><Info size={12}/> Observações Adicionais</p>
                          <p className="text-xs text-gray-600 italic bg-white p-2 rounded border">{f.observacoes}</p>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center justify-end gap-1">
                          <Calendar size={12}/> Recebido em: {new Date(f.criadoEm).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Aprovar;