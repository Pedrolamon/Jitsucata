import { useEffect, useState, useMemo } from "react";
import {
    Plus,
    Save,
    X,
    TrendingUp,
    Download,
    Eye,
    Check,
    Search,
} from "lucide-react";
import { cn } from "../lib/utils";
import type {
    TabelaPrecosAvancada,
    ClassificacaoMaterial,
    EstadoBrasil,
    RelatorioVariacaoPrecos,
    HistoricoPrecos,
} from "../types/preco-avancado";
import { advancedPricesService } from "../services/advanced-prices";

export default function PrecosAvancados() {
    // Estados principais
    const [precos, setPrecos] = useState<TabelaPrecosAvancada[]>([]);
    const [classificacoes, setClassificacoes] = useState<ClassificacaoMaterial[]>([]);
    const [estados, setEstados] = useState<EstadoBrasil[]>([]);

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"tabela" | "criar" | "historico" | "relatorio">("tabela");

    // Filtros
    const [filtroClassificacao, setFiltroClassificacao] = useState<string>("");
    const [filtroEstado, setFiltroEstado] = useState<string>("");
    const [filtroStatus, setFiltroStatus] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");

    // Formulário
    const [formData, setFormData] = useState({
        classificacao_id: "",
        estado_id: "",
        preco_base: 0,
        data_inicio: new Date().toISOString().split("T")[0],
        data_fim: "",
        observacoes: "",
    });

    // Faixas de preço por quantidade
    const [faixasPreco, setFaixasPreco] = useState<Array<{
        id: string;
        peso_minimo: number;
        peso_maximo: number | null;
        preco: number;
    }>>([]);

    // Variações por condição de pagamento
    const [variacoesPagamento, setVariacoesPagamento] = useState<Array<{
        id: string;
        condicao_nome: string;
        dias_prazo: number;
        percentual_variacao: number;
        preco_variado: number;
    }>>([]);

    // Histórico e Relatórios
    const [historico, setHistorico] = useState<HistoricoPrecos[]>([]);
    const [relatorio, setRelatorio] = useState<RelatorioVariacaoPrecos | null>(null);

    // Carregar dados iniciais
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [precosData, classificacoesData, estadosData] = await Promise.all([
                advancedPricesService.listTabelaPrecos(),
                advancedPricesService.getAllClassificacoes(),
                advancedPricesService.getAllEstados(),
            ]);

            setPrecos(precosData);
            setClassificacoes(classificacoesData);
            setEstados(estadosData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar preços
    const precosFiltrados = useMemo(() => {
        let filtered = [...precos];

        if (filtroClassificacao) {
            filtered = filtered.filter((p) => p.classificacao_id === filtroClassificacao);
        }
        if (filtroEstado) {
            filtered = filtered.filter((p) => p.estado_id === filtroEstado);
        }
        if (filtroStatus) {
            filtered = filtered.filter((p) => p.status === filtroStatus);
        }
        if (searchText) {
            filtered = filtered.filter(
                (p) =>
                    p.classificacao?.nome.toLowerCase().includes(searchText.toLowerCase()) ||
                    p.estado?.nome.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return filtered;
    }, [precos, filtroClassificacao, filtroEstado, filtroStatus, searchText]);

    // Contar pendentes para aprovação
    const pendentesAcao = precos.filter((p) => p.status === "pendente_aprovacao").length;

    // Funções de ação
    const handleCriarPreco = async () => {
        try {
            if (!formData.classificacao_id || formData.preco_base <= 0) {
                alert("Preencha os campos obrigatórios");
                return;
            }

            // Preparar dados completos com faixas e variações
            const dadosCompletos = {
                ...formData,
                faixas: faixasPreco.map(f => ({
                    peso_minimo: f.peso_minimo,
                    peso_maximo: f.peso_maximo ?? undefined,
                    percentual_desconto: 0, // será ajustado se necessário
                    preco_faixa: f.preco,
                })),
                variacoes_pagamento: variacoesPagamento.map(v => ({
                    condicao_nome: v.condicao_nome,
                    dias_prazo: v.dias_prazo,
                    percentual_variacao: v.percentual_variacao,
                    preco_variado: v.preco_variado,
                }))
            };

            const novoPreco = await advancedPricesService.createTabelaPrecos(dadosCompletos);
            setPrecos([...precos, novoPreco]);
            resetForm();
            setActiveTab("tabela");
            alert("Preço criado com sucesso! Aguardando aprovação.");
        } catch (err) {
            alert("Erro ao criar preço");
            console.error(err);
        }
    };

    const handleAprovarPreco = async (id: string) => {
        try {
            const precoAtualizado = await advancedPricesService.approveTabelaPrecos(id);
            setPrecos(precos.map((p) => (p.id === id ? precoAtualizado : p)));
            alert("Preço aprovado com sucesso!");
        } catch (err) {
            alert("Erro ao aprovar preço");
            console.error(err);
        }
    };

    const handleVisualizarHistorico = async (classificacao_id: string) => {
        try {
            const hist = await advancedPricesService.getHistoricoPrecos(
                classificacao_id,
                filtroEstado
            );
            setHistorico(hist);
            setActiveTab("historico");
        } catch (err) {
            alert("Erro ao carregar histórico");
            console.error(err);
        }
    };

    const handleGerarRelatorio = async (classificacao_id: string) => {
        try {
            const rel = await advancedPricesService.getRelatorioVariacaoPrecos(
                classificacao_id,
                filtroEstado
            );
            setRelatorio(rel);
            setActiveTab("relatorio");
        } catch (err) {
            alert("Erro ao gerar relatório");
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({
            classificacao_id: "",
            estado_id: "",
            preco_base: 0,
            data_inicio: new Date().toISOString().split("T")[0],
            data_fim: "",
            observacoes: "",
        });
        setFaixasPreco([]);
        setVariacoesPagamento([]);
    };

    // Funções para Faixas de Preço
    const addFaixaPreco = () => {
        setFaixasPreco([
            ...faixasPreco,
            {
                id: Date.now().toString(),
                peso_minimo: 0,
                peso_maximo: null,
                preco: formData.preco_base || 0,
            }
        ]);
    };

    const updateFaixaPreco = (id: string, field: string, value: any) => {
        setFaixasPreco(faixasPreco.map(f =>
            f.id === id ? { ...f, [field]: value } : f
        ));
    };

    const removeFaixaPreco = (id: string) => {
        setFaixasPreco(faixasPreco.filter(f => f.id !== id));
    };

    // Funções para Variações de Pagamento
    const addVariacaoPagamento = () => {
        const precoComVariacao = formData.preco_base * 1.02; // 2% padrão
        setVariacoesPagamento([
            ...variacoesPagamento,
            {
                id: Date.now().toString(),
                condicao_nome: "Prazo Customizado",
                dias_prazo: 30,
                percentual_variacao: 0,
                preco_variado: precoComVariacao,
            }
        ]);
    };

    const updateVariacaoPagamento = (id: string, field: string, value: any) => {
        setVariacoesPagamento(variacoesPagamento.map(v => {
            if (v.id === id) {
                const updated = { ...v, [field]: value };
                // Se mudar percentual, recalcular preço
                if (field === "percentual_variacao") {
                    updated.preco_variado = formData.preco_base * (1 + (updated.percentual_variacao / 100));
                }
                return updated;
            }
            return v;
        }));
    };

    const removeVariacaoPagamento = (id: string) => {
        setVariacoesPagamento(variacoesPagamento.filter(v => v.id !== id));
    };

    const handleExportarCSV = () => {
        advancedPricesService.downloadCSV(precosFiltrados, "tabela-precos-jitsucata.csv");
    };

    // Componente de status badge
    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            ativo: "bg-green-100 text-green-800",
            pendente_aprovacao: "bg-yellow-100 text-yellow-800",
            inativo: "bg-gray-100 text-gray-800",
            expirado: "bg-red-100 text-red-800",
        };

        return (
            <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", styles[status as keyof typeof styles])}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                    <p className="text-gray-600">Carregando sistema de preços...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                        💰 Sistema de Preços Avançado
                    </h2>
                    <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
                        Gestão de Valores por Estado, Classificação e Volume
                    </p>
                </div>
                {pendentesAcao > 0 && (
                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg px-4 py-3">
                        <p className="text-yellow-300 font-bold">
                            ⚠️ {pendentesAcao} preço(s) aguardando aprovação
                        </p>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                {[
                    { id: "tabela", label: "📊 Tabela", icon: "table" },
                    { id: "criar", label: "➕ Criar", icon: "plus" },
                    { id: "historico", label: "📈 Histórico", icon: "history" },
                    { id: "relatorio", label: "📉 Relatório", icon: "chart" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "px-4 py-2 font-bold uppercase text-xs transition-all",
                            activeTab === tab.id
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-white/50 hover:text-white/70"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ABA: TABELA */}
            {activeTab === "tabela" && (
                <div className="space-y-4">
                    {/* Filtros */}
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <Search size={18} /> Filtros e Busca
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <input
                                type="text"
                                placeholder="🔍 Buscar por nome..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-orange-500"
                            />

                            <select
                                value={filtroClassificacao}
                                onChange={(e) => setFiltroClassificacao(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                                <option value="">Todas as Classificações</option>
                                {classificacoes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                                <option value="">Todos os Estados</option>
                                {estados.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.sigla} - {e.nome}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                                <option value="">Todos os Status</option>
                                <option value="ativo">Ativo</option>
                                <option value="pendente_aprovacao">Pendente de Aprovação</option>
                                <option value="inativo">Inativo</option>
                                <option value="expirado">Expirado</option>
                            </select>

                            <button
                                onClick={handleExportarCSV}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-white font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <Download size={16} /> Exportar
                            </button>
                        </div>
                    </div>

                    {/* Tabela */}
                    <div className="overflow-x-auto bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                        <table className="w-full text-white text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-4 py-3 text-left font-bold uppercase text-xs text-orange-400">
                                        Classificação
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold uppercase text-xs text-orange-400">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold uppercase text-xs text-orange-400">
                                        Preço Base (R$)
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold uppercase text-xs text-orange-400">
                                        Vigência
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold uppercase text-xs text-orange-400">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-center font-bold uppercase text-xs text-orange-400">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {precosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-white/50">
                                            Nenhum preço encontrado
                                        </td>
                                    </tr>
                                ) : (
                                    precosFiltrados.map((preco) => (
                                        <tr key={preco.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-semibold">{preco.classificacao?.nome}</td>
                                            <td className="px-4 py-3">
                                                {preco.estado?.sigla ? `${preco.estado.sigla} - ${preco.estado.nome}` : "Nacional"}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-green-400">
                                                {advancedPricesService.formatarMoeda(preco.preco_base)}
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                                <div>De: {preco.data_inicio}</div>
                                                {preco.data_fim && <div>Até: {preco.data_fim}</div>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={preco.status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2 justify-center">
                                                    {preco.status === "pendente_aprovacao" && (
                                                        <button
                                                            onClick={() => handleAprovarPreco(preco.id)}
                                                            className="p-1 bg-green-500/20 text-green-400 hover:bg-green-500/40 rounded transition-colors"
                                                            title="Aprovar"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleVisualizarHistorico(preco.classificacao_id)}
                                                        className="p-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded transition-colors"
                                                        title="Histórico"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleGerarRelatorio(preco.classificacao_id)}
                                                        className="p-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 rounded transition-colors"
                                                        title="Relatório"
                                                    >
                                                        <TrendingUp size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ABA: CRIAR */}
            {activeTab === "criar" && (
                <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md p-8 rounded-2xl border border-orange-500/20 shadow-2xl max-w-3xl">
                    <div className="mb-6 pb-6 border-b border-white/10">
                        <h3 className="text-white font-black text-2xl flex items-center gap-3">
                            <div className="bg-orange-500/20 p-2 rounded-lg">
                                <Plus size={24} className="text-orange-400" />
                            </div>
                            Criar Nova Tabela de Preços
                        </h3>
                        <p className="text-white/60 text-sm mt-2">
                            Configure um novo preço para gestão por estado, classificação e volume
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Classificação com descrição */}
                        <div className="group">
                            <label className="block text-white/90 font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-5 h-5 bg-orange-500/20 rounded text-center text-xs font-bold text-orange-400 flex items-center justify-center">1</span>
                                Classificação do Material *
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.classificacao_id}
                                    onChange={(e) => setFormData({ ...formData, classificacao_id: e.target.value })}
                                    className="w-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-orange-400/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30 cursor-pointer transition-all duration-200 appearance-none font-medium"
                                >
                                    <option value="">📦 Selecione um material...</option>
                                    {classificacoes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nome}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400/60 group-hover:text-orange-400">
                                    <svg className="h-5 w-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>
                            </div>
                            {formData.classificacao_id && classificacoes.find(c => c.id === formData.classificacao_id) && (
                                <div className="mt-3 p-4 bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <p className="text-orange-300 text-xs font-bold mb-2 uppercase tracking-wider">✓ Material Selecionado</p>
                                    <p className="text-white font-bold text-lg">{classificacoes.find(c => c.id === formData.classificacao_id)?.nome}</p>
                                    {classificacoes.find(c => c.id === formData.classificacao_id)?.descricao && (
                                        <p className="text-white/70 text-sm mt-3 leading-relaxed">{classificacoes.find(c => c.id === formData.classificacao_id)?.descricao}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Estado com melhor visual */}
                        <div className="group">
                            <label className="block text-white/90 font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-5 h-5 bg-orange-500/20 rounded text-center text-xs font-bold text-orange-400 flex items-center justify-center">2</span>
                                Estado (Deixe em branco para Nacional)
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.estado_id}
                                    onChange={(e) => setFormData({ ...formData, estado_id: e.target.value })}
                                    className="w-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-orange-400/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30 cursor-pointer transition-all duration-200 appearance-none font-medium"
                                >
                                    <option value="">🇧🇷 Nacional (Todos os estados)</option>
                                    {estados.map((e) => (
                                        <option key={e.id} value={e.id}>
                                            {e.sigla} - {e.nome}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400/60 group-hover:text-orange-400">
                                    <svg className="h-5 w-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>
                            </div>
                            {formData.estado_id && estados.find(e => e.id === formData.estado_id) && (
                                <div className="mt-3 text-sm text-amber-300/90 flex items-center gap-2">
                                    <span>📍</span>
                                    <span>{estados.find(e => e.id === formData.estado_id)?.sigla} - {estados.find(e => e.id === formData.estado_id)?.nome}</span>
                                </div>
                            )}
                        </div>

                        {/* Preço Base e Data Início em grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="group">
                                <label className="block text-white/90 font-semibold text-sm mb-3 flex items-center gap-2">
                                    <span className="w-5 h-5 bg-orange-500/20 rounded text-center text-xs font-bold text-orange-400 flex items-center justify-center">3</span>
                                    Preço Base (R$/kg) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.preco_base}
                                        onChange={(e) => setFormData({ ...formData, preco_base: parseFloat(e.target.value) })}
                                        className="w-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-green-400/50 rounded-xl px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-green-500/80 focus:ring-2 focus:ring-green-500/30 transition-all duration-200 font-medium"
                                        placeholder="0.00"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 font-bold">R$</span>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-white/90 font-semibold text-sm mb-3 flex items-center gap-2">
                                    <span className="w-5 h-5 bg-orange-500/20 rounded text-center text-xs font-bold text-orange-400 flex items-center justify-center">4</span>
                                    Data de Início *
                                </label>
                                <input
                                    type="date"
                                    value={formData.data_inicio}
                                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                                    className="w-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-blue-400/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 cursor-pointer font-medium"
                                />
                            </div>
                        </div>

                        {/* Data Fim */}
                        <div className="group">
                            <label className="block text-white/90 font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-5 h-5 bg-slate-600/40 rounded text-center text-xs font-bold text-white/40 flex items-center justify-center">5</span>
                                Data de Término (Opcional)
                            </label>
                            <input
                                type="date"
                                value={formData.data_fim}
                                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-red-400/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/30 transition-all duration-200 cursor-pointer font-medium"
                            />
                        </div>

                        {/* Observações */}
                        <div className="group">
                            <label className="block text-white/90 font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-5 h-5 bg-slate-600/40 rounded text-center text-xs font-bold text-white/40 flex items-center justify-center">6</span>
                                Observações
                            </label>
                            <textarea
                                value={formData.observacoes}
                                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-purple-400/50 rounded-xl px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 h-24 resize-none font-medium"
                                placeholder="Adicione observações importantes sobre este preço..."
                            />
                        </div>

                        {/* SEÇÃO: FAIXAS DE PREÇO POR QUANTIDADE */}
                        <div className="pt-6 border-t border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-white/90 font-semibold text-base flex items-center gap-2">
                                    <span className="text-xl">📊</span>
                                    Faixas de Preço por Quantidade
                                </label>
                                <button
                                    type="button"
                                    onClick={addFaixaPreco}
                                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-blue-200 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 transition-all"
                                >
                                    <Plus size={16} /> Adicionar Faixa
                                </button>
                            </div>
                            <p className="text-white/60 text-xs mb-4">
                                Defina preços diferentes conforme a quantidade/peso: Ex: 0-500kg = R$2,50 | 500-1200kg = R$2,80
                            </p>

                            {/* Card de Exemplo */}
                            <div className="bg-blue-500/5 border border-blue-400/30 rounded-lg p-3 mb-4">
                                <div className="flex gap-2 items-start mb-2">
                                    <span className="text-blue-300 font-bold text-sm">💡 Exemplo:</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-blue-500/10 p-2 rounded border border-blue-400/20">
                                        <p className="text-blue-200 font-semibold">0 - 500kg</p>
                                        <p className="text-blue-300">R$ 2,50/kg</p>
                                    </div>
                                    <div className="bg-blue-500/10 p-2 rounded border border-blue-400/20">
                                        <p className="text-blue-200 font-semibold">500 - 1200kg</p>
                                        <p className="text-blue-300">R$ 2,80/kg</p>
                                    </div>
                                    <div className="bg-blue-500/10 p-2 rounded border border-blue-400/20">
                                        <p className="text-blue-200 font-semibold">1200+kg</p>
                                        <p className="text-blue-300">R$ 3,00/kg</p>
                                    </div>
                                </div>
                            </div>

                            {faixasPreco.length === 0 ? (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                                    <p className="text-blue-300/70 text-sm">Nenhuma faixa de preço adicionada. Clique em "Adicionar Faixa" para começar.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {faixasPreco.map((faixa) => (
                                        <div key={faixa.id} className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                                <div>
                                                    <label className="text-white/70 text-xs font-semibold mb-2 block">De (kg)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={faixa.peso_minimo}
                                                        onChange={(e) => updateFaixaPreco(faixa.id, "peso_minimo", parseFloat(e.target.value))}
                                                        className="w-full bg-white/10 border border-blue-400/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/30"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/70 text-xs font-semibold mb-2 block">Até (kg)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={faixa.peso_maximo || ""}
                                                        onChange={(e) => updateFaixaPreco(faixa.id, "peso_maximo", e.target.value ? parseFloat(e.target.value) : null)}
                                                        placeholder="Ilimitado"
                                                        className="w-full bg-white/10 border border-blue-400/30 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/30"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/70 text-xs font-semibold mb-2 block">Preço (R$)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={faixa.preco}
                                                        onChange={(e) => updateFaixaPreco(faixa.id, "preco", parseFloat(e.target.value))}
                                                        className="w-full bg-white/10 border border-green-400/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500/80 focus:ring-2 focus:ring-green-500/30"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFaixaPreco(faixa.id)}
                                                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-all text-sm"
                                                >
                                                    <X size={16} /> Remover
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SEÇÃO: VARIAÇÕES POR CONDIÇÃO DE PAGAMENTO */}
                        <div className="pt-6 border-t border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-white/90 font-semibold text-base flex items-center gap-2">
                                    <span className="text-xl">💳</span>
                                    Variações por Prazo de Pagamento
                                </label>
                                <button
                                    type="button"
                                    onClick={addVariacaoPagamento}
                                    className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 hover:text-purple-200 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 transition-all"
                                >
                                    <Plus size={16} /> Adicionar Variação
                                </button>
                            </div>
                            <p className="text-white/60 text-xs mb-4">
                                Defina preços diferentes por prazo de pagamento: Ex: À vista = R$4,50 | 30 dias = R$4,75
                            </p>

                            {/* Card de Exemplo */}
                            <div className="bg-purple-500/5 border border-purple-400/30 rounded-lg p-3 mb-4">
                                <div className="flex gap-2 items-start mb-2">
                                    <span className="text-purple-300 font-bold text-sm">💡 Exemplo:</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-purple-500/10 p-2 rounded border border-purple-400/20">
                                        <p className="text-purple-200 font-semibold">À Vista</p>
                                        <p className="text-purple-300">R$ 4,50/kg</p>
                                        <p className="text-purple-400 text-xs">0% variação</p>
                                    </div>
                                    <div className="bg-purple-500/10 p-2 rounded border border-purple-400/20">
                                        <p className="text-purple-200 font-semibold">15 dias</p>
                                        <p className="text-purple-300">R$ 4,61/kg</p>
                                        <p className="text-purple-400 text-xs">+2.5% variação</p>
                                    </div>
                                    <div className="bg-purple-500/10 p-2 rounded border border-purple-400/20">
                                        <p className="text-purple-200 font-semibold">30 dias</p>
                                        <p className="text-purple-300">R$ 4,73/kg</p>
                                        <p className="text-purple-400 text-xs">+5% variação</p>
                                    </div>
                                </div>
                            </div>

                            {variacoesPagamento.length === 0 ? (
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                                    <p className="text-purple-300/70 text-sm">Nenhuma variação de pagamento adicionada. Clique em "Adicionar Variação" para começar.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {variacoesPagamento.map((variacao) => (
                                        <div key={variacao.id} className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                                <div>
                                                    <label className="text-white/70 text-xs font-semibold mb-2 block">Condição</label>
                                                    <input
                                                        type="text"
                                                        value={variacao.condicao_nome}
                                                        onChange={(e) => updateVariacaoPagamento(variacao.id, "condicao_nome", e.target.value)}
                                                        placeholder="Ex: 30 dias"
                                                        className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/70 text-xs font-semibold mb-2 block">Dias</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variacao.dias_prazo}
                                                        onChange={(e) => updateVariacaoPagamento(variacao.id, "dias_prazo", parseInt(e.target.value))}
                                                        className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/70 text-xs font-semibold mb-2 block">Variação (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={variacao.percentual_variacao}
                                                        onChange={(e) => updateVariacaoPagamento(variacao.id, "percentual_variacao", parseFloat(e.target.value))}
                                                        placeholder="Ex: 2.5"
                                                        className="w-full bg-white/10 border border-orange-400/30 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/70 text-xs font-semibold mb-2 block">Preço Final (R$)</label>
                                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 text-green-300 font-bold text-sm">
                                                        {variacao.preco_variado.toFixed(2)}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariacaoPagamento(variacao.id)}
                                                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-all text-sm"
                                                >
                                                    <X size={16} /> Remover
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Resumo das Variações */}
                        {(faixasPreco.length > 0 || variacoesPagamento.length > 0) && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-white/80 text-sm font-semibold mb-2">
                                    ✓ Resumo: {faixasPreco.length} faixa(s) de preço + {variacoesPagamento.length} variação(ões) de pagamento
                                </p>
                                <p className="text-white/60 text-xs">
                                    Essas informações serão enviadas junto com a tabela de preços para aprovação.
                                </p>
                            </div>
                        )}

                        {/* Botões com melhor visual */}
                        <div className="flex gap-3 pt-6">
                            <button
                                onClick={handleCriarPreco}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/50 hover:shadow-lg transform hover:scale-105"
                            >
                                <Save size={20} /> Criar e Enviar para Aprovação
                            </button>
                            <button
                                onClick={resetForm}
                                className="flex-1 bg-slate-600/40 hover:bg-slate-600/60 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/10 hover:border-white/20"
                            >
                                <X size={20} /> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ABA: HISTÓRICO */}
            {activeTab === "historico" && (
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                    <h3 className="text-white font-bold text-lg mb-4">📈 Histórico de Preços</h3>

                    {historico.length === 0 ? (
                        <p className="text-white/50 text-center py-8">Nenhum histórico disponível</p>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {historico.map((item) => (
                                <div key={item.id} className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-semibold">{new Date(item.criadoEm).toLocaleDateString("pt-BR")}</p>
                                        <p className="text-white/70 text-sm">
                                            {item.preco_anterior && `De R$ ${item.preco_anterior.toFixed(2)}`} → R$ {item.preco_novo.toFixed(2)}
                                        </p>
                                    </div>
                                    {item.percentual_variacao && (
                                        <div className={cn("text-right", item.percentual_variacao > 0 ? "text-red-400" : "text-green-400")}>
                                            <p className="font-bold">{item.percentual_variacao > 0 ? "+" : ""}{item.percentual_variacao.toFixed(2)}%</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ABA: RELATÓRIO */}
            {activeTab === "relatorio" && relatorio && (
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                    <h3 className="text-white font-bold text-lg mb-4">📊 Relatório de Variação</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Info Material */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="text-white/70 text-xs uppercase font-bold mb-3">Informações</h4>
                            <div className="space-y-2 text-white">
                                <p>
                                    <span className="opacity-70">Material:</span> {relatorio.classificacao.nome}
                                </p>
                                {relatorio.estado && (
                                    <p>
                                        <span className="opacity-70">Estado:</span> {relatorio.estado.sigla} - {relatorio.estado.nome}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tendência */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="text-white/70 text-xs uppercase font-bold mb-3">Tendência</h4>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">
                                    {relatorio.tendencia === "subindo" && "📈"}
                                    {relatorio.tendencia === "descendo" && "📉"}
                                    {relatorio.tendencia === "estavel" && "➡️"}
                                </span>
                                <div>
                                    <p className="text-white font-bold capitalize">{relatorio.tendencia}</p>
                                    {relatorio.percentual_variacao && (
                                        <p className={cn("text-sm", relatorio.percentual_variacao > 0 ? "text-red-400" : "text-green-400")}>
                                            {relatorio.percentual_variacao > 0 ? "+" : ""}{relatorio.percentual_variacao.toFixed(2)}%
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="text-white/70 text-xs uppercase font-bold mb-3">Preço Atual</h4>
                            <p className="text-3xl font-bold text-green-400">
                                R$ {relatorio.preco_atual.toFixed(2)}
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="text-white/70 text-xs uppercase font-bold mb-3">Preço Anterior</h4>
                            <p className="text-3xl font-bold text-orange-400">
                                {relatorio.preco_anterior ? `R$ ${relatorio.preco_anterior.toFixed(2)}` : "N/A"}
                            </p>
                        </div>

                        {/* Estatísticas 30 dias */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="text-white/70 text-xs uppercase font-bold mb-3">Média (30 dias)</h4>
                            <p className="text-2xl font-bold text-blue-400">
                                R${relatorio.preco_medio_30_dias?.toFixed(2) || "N/A"}
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="text-white/70 text-xs uppercase font-bold mb-3">Mín/Máx (30 dias)</h4>
                            <p className="text-sm text-white">
                                Min: <span className="font-bold text-green-400">R$ {relatorio.preco_minimo_30_dias?.toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-white">
                                Máx: <span className="font-bold text-red-400">R$ {relatorio.preco_maximo_30_dias?.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
