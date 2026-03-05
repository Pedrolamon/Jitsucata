import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  criarMaterial,
  newMaterial,
  getTiposMateriais,
} from "../../services/materiais";
import { useAuth } from "../../contexts/AuthContext";
import {
  Weight,
  FileText,
  PlusCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  Scale,
  DollarSign,
  Calendar,
  MapPin,
  Factory,
  Layers,
  FlaskConical,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const RegistrarMaterial = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fornecedorId = user?.id;
  const [abaAtiva, setAbaAtiva] = useState("false");
  const [novoMaterial, setNovoMaterial] = useState<string>("");

  const [form, setForm] = useState({
    tipo: "",
    pesoBruto: "",
    pesoLiquido: "",
    contaminação: "",
    cambio: "",
    quantidade: "",
    unidade: "kg",
    preco: "",
    fornecedorId: "",
    patio: "",
    notaFiscal: "",
    placaVeiculo: "",
    Dataentrada: "",
    observacoes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMateriais = async () => {
    try {
      setLoading(true);
      const data = await getTiposMateriais();
      if (data.length > 0 && !form.tipo) {
        setForm((prev) => ({ ...prev, tipo: data[0].tipo }));
      }
      setNovoMaterial(data);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriais();
  }, []);

  const handlenovoMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMaterial) {
      setError("Digite um nome válido para o material.");
      return;
    }
    setLoading(true);
    try {
      await newMaterial(novoMaterial);

      setSuccess("Material criado com sucesso!");
      setNovoMaterial("");
      setAbaAtiva("false");
      window.location.reload();
    } catch (err) {
      setError("Erro ao criar novo material.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      });
      setSuccess("Material registrado e enviado ao estoque!");
      setTimeout(() => navigate("/inventory"), 1500);
    } catch (err: any) {
      setError("Erro ao processar entrada de material.");
    } finally {
      setLoading(false);
    }
  };
  if (abaAtiva === "true") {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-xl animate-in slide-in-from-bottom-4 duration-500">
          <form onSubmit={handlenovoMaterial}>
            <div className="flex justify-between items-center mb-5">
              <label className="text-[18px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                Material
              </label>
              <Button
                onClick={() => navigate(-1)}
                className="bg-white/10 hover:bg-white/20 text-[var(--color-primary)] border-none rounded-xl"
              >
                <ArrowLeft size={18} className="mr-2" /> Voltar
              </Button>
            </div>
            <div className="flex gap-5">
              <div>
                <Scale
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={20}
                />
                <input
                  name="Nome"
                  type="text"
                  placeholder="Nome do Material"
                  value={novoMaterial}
                  onChange={(e) => setNovoMaterial(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                  // required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-16 !bg-[var(--color-primary)] hover:bg-[#BF5A1B] text-white font-black uppercase italic rounded-2xl shadow-xl transition-all"
              >
                {loading ? (
                  "Processando..."
                ) : (
                  <>
                    <PlusCircle className="mr-2" /> Criar material
                  </>
                )}
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
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Entrada Manual
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Registro de novos lotes no sistema
          </p>
        </div>

        <div className=" flex items-center gap-8">
          <Button
            onClick={() => setAbaAtiva("true")}
            className="bg-white/10 hover:bg-white/20 text-[var(--color-primary)] border-none rounded-xl"
          >
            <Plus size={18} className="" /> Criar Material
          </Button>

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
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-[3rem] shadow-2xl space-y-8"
          >
            {/* Seletor de Tipo de Material (Visual) */}
            <section>
              <div className="flex justify-around items-center relative">
                <label className="text-[11px] font-black uppercase text-gray-400 mb-4 block tracking-widest">
                  1. Selecione o Tipo de Material
                </label>
                <div className="flex items-center">
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

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <p className="text-gray-400 text-xs italic">
                  Aguardando carregamento dos materiais.
                </p>
              </div>
            </section>

            {/* Quantidade e Unidade */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  2. Peso Bruto
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
                  <FlaskConical
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.contaminação}
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
                  <Truck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
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
                  <DollarSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="quantidade"
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
                  <RefreshCw
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="quantidade"
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
                  <Factory
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.fornecedorId}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                  10. Pátio estocado
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
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
                  <FileText
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
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
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    name="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.Dataentrada}
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
