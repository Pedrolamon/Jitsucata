import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { criarMaterial, newMaterial, getTiposMateriais } from '../../services/materiais';
import { ClassificaçãoMateriais } from '../../domain/materiais';
import {
  Weight, FileText, PlusCircle, ArrowLeft, CheckCircle2,
  AlertCircle, Truck, Scale, DollarSign, Calendar, MapPin,
  Factory, Layers, FlaskConical, RefreshCw, ChevronDown, Plus
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

interface MaterialData {
  id: string;
  tipo: string;
}

const RegistrarMaterial = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fornecedorId = user?.id;

  // Estados de Controle
  const [abaAtiva, setAbaAtiva] = useState("false");
  const [novoMaterialNome, setNovoMaterialNome] = useState("");
  const [listaDeMateriais, setListaDeMateriais] = useState<MaterialData[]>([]);
  const [mostrarListaTipos, setMostrarListaTipos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estado do Formulário Único
  const [form, setForm] = useState({
    tipo: "",
    pesoBruto: '',
    pesoLiquido: '',
    contaminacao: '',
    cambio: '',
    quantidade: '',
    unidade: 'kg',
    preco: '',
    patio: '',
    notaFiscal: '',
    placaVeiculo: '',
    dataEntrada: '',
    observacoes: '',
  });

  const fetchMateriais = async () => {
    const baseMateriais: MaterialData[] = ClassificaçãoMateriais.map((m) => ({
      id: m.Titulo,
      tipo: m.Titulo,
    }));

    setListaDeMateriais(baseMateriais);

    if (baseMateriais.length > 0 && !form.tipo) {
      setForm(prev => ({ ...prev, tipo: baseMateriais[0].tipo }));
    }

    try {
      setLoading(true);
      const data = await getTiposMateriais();
      const extras: MaterialData[] = data
        .filter((d: any) => !baseMateriais.some((b) => b.tipo === d.tipo))
        .map((d: any) => ({ id: d.id, tipo: d.tipo }));

      if (extras.length > 0) {
        setListaDeMateriais(prev => [...prev, ...extras]);
      }
    } catch (err) {
      console.error("Erro ao buscar materiais adicionais:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriais();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlenovoMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMaterialNome) {
      setError("Digite um nome válido para o material.");
      return;
    }
    setLoading(true);
    try {
      await newMaterial(novoMaterialNome);
      setSuccess('Material criado com sucesso!');
      setNovoMaterialNome('');
      setAbaAtiva("false");
      fetchMateriais(); // Atualiza a lista sem recarregar a página inteira
    } catch (err) {
      setError('Erro ao criar novo material.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.quantidade || isNaN(Number(form.quantidade))) {
      setError("Por favor, informe uma quantidade válida.");
      return;
    }

    if (!fornecedorId) {
      setError("Sessão expirada. Faça login novamente.");
      return;
    }

    setLoading(true);
    try {
      await criarMaterial({
        ...form,
        quantidade: Number(form.quantidade),
        fornecedorId: fornecedorId,
        pesoBruto: form.pesoBruto ? Number(form.pesoBruto) : undefined,
        pesoLiquido: form.pesoLiquido ? Number(form.pesoLiquido) : undefined,
        contaminacao: form.contaminacao ? Number(form.contaminacao) : undefined,
        cambio: form.cambio ? Number(form.cambio) : undefined,
        preco: form.preco ? Number(form.preco) : undefined,
      });
      setSuccess("Material registrado e enviado ao estoque!");
      setTimeout(() => navigate("/inventory"), 1500);
    } catch (err) {
      setError("Erro ao processar entrada de material.");
    } finally {
      setLoading(false);
    }
  };

  // Renderização da aba de novo material
  if (abaAtiva === "true") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-xl w-full mx-4">
          <form onSubmit={handlenovoMaterial}>
            <div className='flex justify-between items-center mb-5'>
              <h3 className="text-lg font-black uppercase text-gray-400 tracking-widest">Novo Tipo de Material</h3>
              <Button type="button" onClick={() => setAbaAtiva("false")} variant="ghost">
                <ArrowLeft size={18} className="mr-2" /> Cancelar
              </Button>
            </div>
            <div className='flex flex-col gap-4'>
              <div className="relative">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="text"
                  placeholder="Nome do Material (ex: Alumínio Fundido)"
                  value={novoMaterialNome}
                  onChange={(e) => setNovoMaterialNome(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none"
                />
              </div>
              <Button type="submit" disabled={loading} className="h-16 !bg-[var(--color-primary)] text-white font-black uppercase italic rounded-2xl">
                {loading ? "Criando..." : "Confirmar Cadastro"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Entrada Manual</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Registro de novos lotes no sistema</p>

        </div>

        <div className=' flex items-center gap-8'>

          <Button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 text-[var(--color-primary)] border-none rounded-xl"
          >
            <ArrowLeft size={18} className="mr-2" /> Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Esquerda: Instruções e Status */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 text-white">
            <h4 className="font-black uppercase italic text-sm mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-400" /> Atenção
              Operador
            </h4>
            <ul className="space-y-4 text-xs text-white/70">
              <li className="flex gap-3">
                <span className="font-bold text-orange-400">01.</span>
                Confira o tipo de sucata antes de confirmar.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-400">02.</span>
                Certifique-se que a unidade de medida (Kg/Ton) está correta.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-400">03.</span>
                Adicione observações em caso de contaminação no material.
              </li>
            </ul>
          </div>

          {/* Card de Mensagem de Sucesso/Erro */}
          {success && (
            <div className="bg-green-500 p-6 rounded-[2rem] text-white shadow-lg animate-bounce">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} />
                <span className="font-black uppercase italic text-sm">
                  {success}
                </span>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-500 p-6 rounded-[2rem] text-white shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle size={24} />
                <span className="font-black uppercase italic text-sm">
                  {error}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Direita: Formulário de Registro */}
        <div className="col-span-12 lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[3rem] shadow-2xl space-y-8">

            {/* Seletor de Tipo de Material (Dropdown) */}
            <section>
              <div className='flex justify-between items-center gap-4 relative'>
                <label className="text-[11px] font-black uppercase text-gray-400 mb-4 block tracking-widest">
                  1. Selecione o Tipo de Material
                </label>
                <div className='flex items-center'>
                  <select
                    name="unidade"
                    value={form.unidade}
                    onChange={handleChange}
                    className="p-5 border-none bg-[--bg-input] rounded-2xl text-[15px] font-bold outline-none text-gray-400 appearance-none cursor-pointer"
                  >
                    <option value="ton">Ton</option>
                    <option value="kg">Kg</option>
                  </select>
                </div>
              </div>

              <div className="mt-2 relative">
                <button
                  type="button"
                  onClick={() => setMostrarListaTipos((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-black uppercase italic text-gray-500 hover:border-orange-300 transition-all"
                >
                  <span className="truncate">
                    {form.tipo || 'Selecione um tipo de material'}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mostrarListaTipos && "rotate-180")} />
                </button>

                {mostrarListaTipos && (
                  <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto bg-white border border-gray-100 rounded-2xl shadow-xl">
                    {listaDeMateriais.length > 0 ? (
                      listaDeMateriais.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, tipo: t.tipo }));
                            setMostrarListaTipos(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-tight hover:bg-orange-50",
                            form.tipo === t.tipo
                              ? "text-[var(--color-primary)] bg-orange-50"
                              : "text-gray-500"
                          )}
                        >
                          {t.tipo}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-[11px] text-gray-400">
                        Nenhum material encontrado.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Quantidade e Unidade */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  2. Peso Bruto
                </label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="pesoBruto"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.pesoBruto}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  3. Peso líquido
                </label>
                <div className="relative">
                  <Scale
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="PesoBruto"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.pesoBruto}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  3. Peso líquido
                </label>
                <div className="relative">
                  <Weight
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.pesoLiquido}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  4. Quantidade do Lote
                </label>
                <div className="relative">
                  <Layers
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="pesoLiquido"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.pesoLiquido}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  4. Quantidade do Lote
                </label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.quantidade}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  5. Índice de contaminação
                </label>
                <div className="relative">
                  <FlaskConical className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="contaminacao"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.contaminacao}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  6. Placa do veículo
                </label>
                <div className="relative">
                  <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="placaVeiculo"
                    type="text"
                    placeholder="ABC-1234"
                    value={form.placaVeiculo}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  7. Preço
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="preco"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.preco}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  8. Câmbio
                </label>
                <div className="relative">
                  <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="cambio"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.cambio}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  9. Fornecedor
                </label>
                <div className="relative">
                  <Factory className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="fornecedor"
                    type="text"
                    value={user?.name || ''}
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-2xl text-lg font-bold outline-none text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  10. Pátio estocado
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="patio"
                    type="text"
                    placeholder="Pátio / Baia"
                    value={form.patio}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  11. Nota Fiscal
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="notaFiscal"
                    type="text"
                    placeholder="000.000.000"
                    value={form.notaFiscal}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  12. Data de entrada
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    name="dataEntrada"
                    type="date"
                    value={form.dataEntrada}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

            </section>

            {/* Observações */}
            <section>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                13. Informações Adicionais (Opcional)
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-4 top-4 text-gray-300"
                  size={20}
                />
                <textarea
                  name="observacoes"
                  placeholder="Ex: Material com alto teor de impureza, vindo da unidade B..."
                  value={form.observacoes}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </section>

            {/* Botões de Ação */}
            <div className="pt-4 flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-16 !bg-[var(--color-primary)] hover:bg-[#BF5A1B] text-white font-black uppercase italic rounded-2xl shadow-xl transition-all"
              >
                {loading ? (
                  "Processando..."
                ) : (
                  <>
                    <PlusCircle className="mr-2" /> Registrar Entrada
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarMaterial;
