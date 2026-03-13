import { useEffect, useState, useMemo } from "react";
import { Plus, Save, X, TrendingUp, Download, Eye, Check, Search, ChevronDown, Trash } from "lucide-react";
import { cn } from "../lib/utils";
import { ClassificaçãoMateriais, ClassificaçãoMateriaisNãoferrosos } from "../domain/materiais";
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
    const [mostrarListaClassificacoes, setMostrarListaClassificacoes] = useState(false);
    const [mostrarListaEstados, setMostrarListaEstados] = useState(false);
    const [searchClassificacao, setSearchClassificacao] = useState("");

    // Filtros
    const [filtroClassificacao, setFiltroClassificacao] = useState<string>("");
    const [filtroEstado, setFiltroEstado] = useState<string>("");
    const [filtroStatus, setFiltroStatus] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");

    // Formulário
    const [formData, setFormData] = useState({
        classificacao_id: "",
        estado_id: "",
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

    // Combina listas locais (domain) com as classificações vindas da API
    const combinedClassificacoes = useMemo(() => {
        const fromDomain = (ClassificaçãoMateriais || []).map((d: any) => ({
            id: d.Titulo,
            nome: d.Titulo,
            descricao: d.Descrição || d.Descricao || "",
            source: "domain",
        }));

        const fromDomainNaoFerro = (ClassificaçãoMateriaisNãoferrosos || []).map((d: any) => ({
            id: d.Titulo,
            nome: d.Titulo,
            descricao: d.Descrição || d.Descricao || "",
            source: "domain",
        }));

        const fromApi = (classificacoes || []).map((c: any) => ({
            id: c.id,
            nome: c.nome,
            descricao: c.descricao || c.descricao || "",
            source: "api",
        }));

        // Agrupa, removendo duplicatas por nome (mantém os da API se houver conflito)
        const map = new Map<string, any>();
        [...fromDomain, ...fromDomainNaoFerro].forEach((it) => map.set(it.nome, it));
        fromApi.forEach((it) => map.set(it.nome, it));

        return Array.from(map.values());
    }, [classificacoes]);

    // Lista estática de estados do Brasil (id = sigla)
    const estadosBrasil = useMemo(() => [
        { id: "AC", sigla: "AC", nome: "Acre" },
        { id: "AL", sigla: "AL", nome: "Alagoas" },
        { id: "AP", sigla: "AP", nome: "Amapá" },
        { id: "AM", sigla: "AM", nome: "Amazonas" },
        { id: "BA", sigla: "BA", nome: "Bahia" },
        { id: "CE", sigla: "CE", nome: "Ceará" },
        { id: "DF", sigla: "DF", nome: "Distrito Federal" },
        { id: "ES", sigla: "ES", nome: "Espírito Santo" },
        { id: "GO", sigla: "GO", nome: "Goiás" },
        { id: "MA", sigla: "MA", nome: "Maranhão" },
        { id: "MT", sigla: "MT", nome: "Mato Grosso" },
        { id: "MS", sigla: "MS", nome: "Mato Grosso do Sul" },
        { id: "MG", sigla: "MG", nome: "Minas Gerais" },
        { id: "PA", sigla: "PA", nome: "Pará" },
        { id: "PB", sigla: "PB", nome: "Paraíba" },
        { id: "PR", sigla: "PR", nome: "Paraná" },
        { id: "PE", sigla: "PE", nome: "Pernambuco" },
        { id: "PI", sigla: "PI", nome: "Piauí" },
        { id: "RJ", sigla: "RJ", nome: "Rio de Janeiro" },
        { id: "RN", sigla: "RN", nome: "Rio Grande do Norte" },
        { id: "RS", sigla: "RS", nome: "Rio Grande do Sul" },
        { id: "RO", sigla: "RO", nome: "Rondônia" },
        { id: "RR", sigla: "RR", nome: "Roraima" },
        { id: "SC", sigla: "SC", nome: "Santa Catarina" },
        { id: "SP", sigla: "SP", nome: "São Paulo" },
        { id: "SE", sigla: "SE", nome: "Sergipe" },
        { id: "TO", sigla: "TO", nome: "Tocantins" },
    ], []);

    const estadosLista = estadosBrasil; // atualmente usamos a lista local fixa

    // Contar pendentes para aprovação
    const pendentesAcao = precos.filter((p) => p.status === "pendente_aprovacao").length;

    // Funções de ação
    const handleCriarPreco = async () => {
        try {
            if (!formData.classificacao_id || faixasPreco.length === 0) {
                alert("Preencha os campos obrigatórios: classificação e ao menos uma faixa de preço");
                return;
            }

            // Calcular preco_base como a primeira faixa de preço
            const precoBase = faixasPreco.length > 0 ? faixasPreco[0].preco : 0;

            // Preparar dados completos com faixas e variações
            const dadosCompletos = {
                ...formData,
                preco_base: precoBase, // Adicionar preco_base
                faixas: faixasPreco.map(f => ({
                    id: f.id, // Incluir o id da faixa para correlação
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

    const handleDeletarPreco = async (id: string) => {
        if (!confirm("Tem certeza que deseja apagar este preço? Esta ação não pode ser desfeita.")) return;
        try {
            await advancedPricesService.deleteTabelaPrecos(id);
            setPrecos((prev) => prev.filter((p) => p.id !== id));
            alert("Preço removido com sucesso.");
        } catch (err) {
            console.error(err);
            alert("Erro ao remover preço. Tente novamente.");
        }
    };

    const resetForm = () => {
        setFormData({
            classificacao_id: "",
            estado_id: "",
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
                preco: 0,
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
        setVariacoesPagamento([
            ...variacoesPagamento,
            {
                id: Date.now().toString(),
                condicao_nome: "Prazo Customizado",
                dias_prazo: 30,
                percentual_variacao: 0,
                preco_variado: 0, // será atualizado quando mudar o percentual
            }
        ]);
    };

    const updateVariacaoPagamento = (id: string, field: string, value: any) => {
        setVariacoesPagamento(variacoesPagamento.map(v => {
            if (v.id === id) {
                const updated = { ...v, [field]: value };
                // Se mudar percentual, recalcular preço para TODAS as faixas
                if (field === "percentual_variacao") {
                    // O preco_variado aqui é apenas um preço de referência
                    // O sistema aplicará a variação a cada faixa individualmente
                    const basePrice = faixasPreco.length > 0 ? faixasPreco[0].preco : 0;
                    updated.preco_variado = basePrice * (1 + (updated.percentual_variacao / 100));
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
            ativo: "bg-green-500/20 text-green-300 border border-green-500/50 font-semibold",
            pendente_aprovacao: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 font-semibold",
            inativo: "bg-slate-600/30 text-slate-300 border border-slate-600/50 font-semibold",
            expirado: "bg-red-500/20 text-red-300 border border-red-500/50 font-semibold",
        };

        const labels = {
            ativo: "✓ Ativo",
            pendente_aprovacao: "⏳ Pendente",
            inativo: "∅ Inativo",
            expirado: "✕ Expirado",
        };

        return (
            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", styles[status as keyof typeof styles])}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    // Formata datas para dd/mm/aaaa
    const formatarDataBR = (data: string | undefined | null) => {
        if (!data) return "-";

        const dataISO = String(data).split("T")[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
            const [ano, mes, dia] = dataISO.split("-");
            return `${dia}/${mes}/${ano}`;
        }

        const parsed = new Date(String(data));
        if (Number.isNaN(parsed.getTime())) return "-";

        return parsed.toLocaleDateString("pt-BR");
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[var(--color-bg)]">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] mx-auto"></div>
                    <p className="text-[var(--color-text)] text-lg font-medium">Carregando sistema de preços...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[var(--color-bg)]">
            <div className="w-full space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start md:items-center">
                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-4xl font-black text-[var(--color-text)] uppercase italic tracking-tighter">
                            💰 Sistema de Preços Avançado
                        </h2>
                        <p className="text-[var(--color-primary)] text-sm font-medium uppercase tracking-widest">
                            Gestão de Valores por Estado, Classificação e Volume
                        </p>
                    </div>
                    {pendentesAcao > 0 && (
                        <div className="bg-gradient-to-r from-yellow-500/30 to-yellow-600/20 border-l-4 border-yellow-500 rounded-lg px-4 py-3 md:col-span-1 col-span-1">
                            <p className="text-yellow-200 font-bold text-sm md:text-base">
                                ⚠️ {pendentesAcao} preço(s) aguardando aprovação
                            </p>
                        </div>
                    )}
                </div>

                {/* Tabs com melhor visual */}
                <div className="flex flex-wrap space-between gap-2 bg-[var(--color-surface)]/10 p-1 rounded-lg border border-[var(--color-border)] backdrop-blur-sm">
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
                                "flex-1 px-3 md:px-4 py-2 font-bold uppercase text-xs md:text-sm transition-all duration-200 justify-center rounded-lg ",
                                activeTab === tab.id
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                                    : "text-slate-500 hover:text-white hover:bg-slate-600/40"
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
                        <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-md p-4 md:p-6 rounded-xl border border-slate-600/50 space-y-4 shadow-lg">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <Search size={20} className="text-orange-400" /> Filtros e Busca
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                <input
                                    type="text"
                                    placeholder="🔍 Buscar por nome..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 md:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
                                />

                                <select
                                    value={filtroClassificacao}
                                    onChange={(e) => setFiltroClassificacao(e.target.value)}
                                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 md:py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 cursor-pointer transition-all appearance-none"
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
                                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 md:py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 cursor-pointer transition-all appearance-none"
                                >
                                    <option value="">Todos os Estados</option>
                                    {estadosLista.map((e) => (
                                        <option key={e.id} value={e.id}>
                                            {e.sigla} - {e.nome}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value)}
                                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 md:py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 cursor-pointer transition-all appearance-none"
                                >
                                    <option value="">Todos os Status</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="pendente_aprovacao">Pendente de Aprovação</option>
                                    <option value="inativo">Inativo</option>
                                    <option value="expirado">Expirado</option>
                                </select>

                                <button
                                    onClick={handleExportarCSV}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-500/50 rounded-lg px-3 py-2 md:py-3 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30"
                                >
                                    <Download size={16} /> Exportar
                                </button>
                            </div>
                        </div>

                        {/* Tabela */}
                        <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-md rounded-xl border border-slate-600/50 shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-slate-100 text-sm">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-700/60 to-slate-800/60 border-b border-slate-600/50">
                                            <th className="px-4 py-4 text-left font-bold uppercase text-xs text-orange-400">
                                                Classificação
                                            </th>
                                            <th className="px-4 py-4 text-left font-bold uppercase text-xs text-orange-400">
                                                Estado
                                            </th>
                                            <th className="px-4 py-4 text-right font-bold uppercase text-xs text-orange-400">
                                                Preço (R$)
                                            </th>
                                            <th className="px-4 py-4 text-left font-bold uppercase text-xs text-orange-400">
                                                Vigência
                                            </th>
                                            <th className="px-4 py-4 text-left font-bold uppercase text-xs text-orange-400">
                                                Status
                                            </th>
                                            <th className="px-4 py-4 text-center font-bold uppercase text-xs text-orange-400">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {precosFiltrados.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                                    Nenhum preço encontrado
                                                </td>
                                            </tr>
                                        ) : (
                                            precosFiltrados.map((preco) => (
                                                <tr key={preco.id} className="border-b border-slate-600/30 hover:bg-slate-700/40 transition-colors">
                                                    <td className="px-4 py-4 font-semibold text-orange-300">{preco.classificacao?.nome}</td>
                                                    <td className="px-4 py-4 text-slate-100">
                                                        {preco.estado?.sigla ? `${preco.estado.sigla} - ${preco.estado.nome}` : "Nacional"}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-bold text-green-400">
                                                        {preco.faixas && preco.faixas.length > 0 ? advancedPricesService.formatarMoeda(Math.min(...preco.faixas.map((f: any) => f.preco))) : "-"}
                                                    </td>
                                                    <td className="px-4 py-4 text-xs text-slate-300">
                                                        <div>De: {formatarDataBR(preco.data_inicio)}</div>
                                                        {preco.data_fim && <div>Até: {formatarDataBR(preco.data_fim)}</div>}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <StatusBadge status={preco.status} />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex gap-2 justify-center">
                                                            {preco.status === "pendente_aprovacao" && (
                                                                <button
                                                                    onClick={() => handleAprovarPreco(preco.id)}
                                                                    className="h-10 w-10 flex items-center justify-center p-2 bg-green-500/10 border border-green-500/30 text-green-300 hover:bg-green-500/20 hover:text-green-200 rounded-lg transition-all shadow-sm"
                                                                    title="Aprovar"
                                                                >
                                                                    <Check size={18} />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeletarPreco(preco.id)}
                                                                className="h-10 w-10 flex items-center justify-center p-2 bg-slate-800/40 border border-slate-700/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all shadow-sm"
                                                                title="Excluir"
                                                            >
                                                                <Trash size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleVisualizarHistorico(preco.classificacao_id)}
                                                                className="h-10 w-10 flex items-center justify-center p-2 bg-slate-800/40 border border-slate-700/50 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 rounded-lg transition-all shadow-sm"
                                                                title="Histórico"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleGerarRelatorio(preco.classificacao_id)}
                                                                className="h-10 w-10 flex items-center justify-center p-2 bg-slate-800/40 border border-slate-700/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 rounded-lg transition-all shadow-sm"
                                                                title="Relatório"
                                                            >
                                                                <TrendingUp size={18} />
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
                    </div>
                )}

                {/* ABA: CRIAR */}
                {activeTab === "criar" && (
                    <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                        <div className="mb-8 pb-8 border-b border-slate-600/50">
                            <h3 className="text-white font-black text-2xl md:text-3xl flex items-center gap-3 mb-2">
                                <div className="bg-orange-500/20 p-3 rounded-lg">
                                    <Plus size={28} className="text-orange-400" />
                                </div>
                                Criar Nova Tabela de Preços
                            </h3>
                            <p className="text-slate-300 text-sm">
                                Configure um novo preço para gestão por estado, classificação e volume
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Classificação */}
                            <div className="group">
                                <label className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded text-center text-xs font-bold text-white flex items-center justify-center">1</span>
                                    Classificação do Material <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchClassificacao || (formData.classificacao_id ? (combinedClassificacoes.find((c: any) => c.id === formData.classificacao_id)?.nome || '') : '')}
                                        onChange={(e) => {
                                            setSearchClassificacao(e.target.value);
                                            setMostrarListaClassificacoes(true);
                                        }}
                                        onFocus={() => setMostrarListaClassificacoes(true)}
                                        placeholder="📦 Selecione um material..."
                                        className="w-full px-4 py-3 bg-[var(--color-bg)] border border-orange-600 rounded-2xl text-slate-700 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all duration-200 font-medium"
                                    />

                                    {mostrarListaClassificacoes && (
                                        <div className="absolute z-20 mt-2 w-full max-h-72 overflow-auto bg-[var(--color-bg)] border border-orange-600 rounded-2xl shadow-xl p-2 backdrop-blur-md">
                                            <div className="flex flex-col gap-2">
                                                {combinedClassificacoes.filter(c => c.nome.toLowerCase().includes((searchClassificacao || '').toLowerCase())).length > 0 ? (
                                                    combinedClassificacoes.filter(c => c.nome.toLowerCase().includes((searchClassificacao || '').toLowerCase())).map((c) => (
                                                        <button
                                                            key={c.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData((prev) => ({ ...prev, classificacao_id: c.id }));
                                                                setMostrarListaClassificacoes(false);
                                                                setSearchClassificacao(c.nome);
                                                            }}
                                                            className={cn(
                                                                "w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-lg border hover:bg-orange-600/5",
                                                                formData.classificacao_id === c.id
                                                                    ? "border-orange-600 text-orange-300 bg-[var(--color-bg)]"
                                                                    : "border-orange-600 text-slate-700 bg-[var(--color-bg)]"
                                                            )}
                                                        >
                                                            {c.nome}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-slate-400 text-sm">
                                                        Nenhuma classificação encontrada.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {formData.classificacao_id && combinedClassificacoes.find((c: any) => c.id === formData.classificacao_id) && (
                                    (() => {
                                        const sel = combinedClassificacoes.find((c: any) => c.id === formData.classificacao_id);
                                        return (
                                            <div className="mt-3 p-4 bg-gradient-to-r from-orange-500/15 to-orange-500/5 border border-orange-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                                                <p className="text-orange-300 text-xs font-bold mb-2 uppercase tracking-wider">✓ Material Selecionado</p>
                                                <p className="text-white font-bold text-lg">{sel?.nome}</p>
                                                {sel?.descricao && (
                                                    <p className="text-slate-300 text-sm mt-3 leading-relaxed">{sel?.descricao}</p>
                                                )}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>

                            {/* Estado */}
                            <div className="group">
                                <label className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded text-center text-xs font-bold text-white flex items-center justify-center">2</span>
                                    Estado (Deixe em branco para Nacional)
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setMostrarListaEstados((prev) => !prev)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-bg)] border border-orange-600 rounded-2xl text-slate-700 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 cursor-pointer transition-all duration-200 font-medium"
                                    >
                                        <span className="truncate">
                                            {formData.estado_id && estadosLista.find((e: any) => e.id === formData.estado_id)
                                                ? `${estadosLista.find((e: any) => e.id === formData.estado_id)?.sigla} - ${estadosLista.find((e: any) => e.id === formData.estado_id)?.nome}`
                                                : '🇧🇷 Nacional (Todos os estados)'}
                                        </span>
                                        <ChevronDown className={cn("h-5 w-5 transition-transform flex-shrink-0", mostrarListaEstados && "rotate-180")} />
                                    </button>

                                    {mostrarListaEstados && (
                                        <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto bg-[var(--color-bg)] border border-orange-600 rounded-2xl shadow-xl p-2 backdrop-blur-md">
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, estado_id: "" }));
                                                        setMostrarListaEstados(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-lg border hover:bg-orange-600/5",
                                                        formData.estado_id === ""
                                                            ? "border-orange-600 text-orange-300 bg-[var(--color-bg)]"
                                                            : "border-orange-600 text-slate-700 bg-[var(--color-bg)]"
                                                    )}
                                                >
                                                    🇧🇷 Nacional (Todos os estados)
                                                </button>
                                                {estadosLista.length > 0 ? (
                                                    estadosLista.map((e) => (
                                                        <button
                                                            key={e.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData((prev) => ({ ...prev, estado_id: e.id }));
                                                                setMostrarListaEstados(false);
                                                            }}
                                                            className={cn(
                                                                "w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-lg border hover:bg-orange-600/5",
                                                                formData.estado_id === e.id
                                                                    ? "border-orange-600 text-orange-300 bg-[var(--color-bg)]"
                                                                    : "border-orange-600 text-slate-700 bg-[var(--color-bg)]"
                                                            )}
                                                        >
                                                            {e.sigla} - {e.nome}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-slate-400 text-sm">
                                                        Nenhum estado encontrado.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {formData.estado_id && estados.find(e => e.id === formData.estado_id) && (
                                    <div className="mt-3 text-sm text-amber-300 flex items-center gap-2">
                                        <span>📍</span>
                                        <span>{estados.find(e => e.id === formData.estado_id)?.sigla} - {estados.find(e => e.id === formData.estado_id)?.nome}</span>
                                    </div>
                                )}
                            </div>

                            {/* Data Início */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="group">
                                    <label className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded text-center text-xs font-bold text-white flex items-center justify-center">3</span>
                                        Data de Início <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.data_inicio}
                                        onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                                        className="w-full bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-blue-400/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 cursor-pointer font-medium"
                                    />
                                </div>
                            </div>

                            {/* Data Fim */}
                            <div className="group">
                                <label className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-slate-600 rounded text-center text-xs font-bold text-slate-300 flex items-center justify-center">5</span>
                                    Data de Término (Opcional)
                                </label>
                                <input
                                    type="date"
                                    value={formData.data_fim}
                                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                                    className="w-full bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-red-400/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all duration-200 cursor-pointer font-medium"
                                />
                            </div>

                            {/* Observações */}
                            <div className="group">
                                <label className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-slate-600 rounded text-center text-xs font-bold text-slate-300 flex items-center justify-center">6</span>
                                    Observações (Opcional)
                                </label>
                                <textarea
                                    value={formData.observacoes}
                                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                    className="w-full bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-purple-400/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 h-24 resize-none font-medium"
                                    placeholder="Adicione observações importantes sobre este preço..."
                                />
                            </div>

                            {/* SEÇÃO: FAIXAS DE PREÇO POR QUANTIDADE */}
                            <div className="pt-8 border-t border-slate-600/50">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-white font-semibold text-lg flex items-center gap-3">
                                        <span className="text-2xl">📊</span>
                                        Faixas de Preço por Quantidade
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addFaixaPreco}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-md"
                                    >
                                        <Plus size={18} /> Adicionar Faixa
                                    </button>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">
                                    Defina preços diferentes conforme a quantidade/peso: Ex: 0-500kg = R$2,50 | 500-1200kg = R$2,80
                                </p>

                                {/* Card de Exemplo */}
                                <div className="bg-slate-50/5 border border-white/6 rounded-lg p-4 mb-6">
                                    <div className="flex gap-2 items-start mb-3">
                                        <span className="text-sky-300 font-bold text-sm">💡 Exemplo:</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                        <div className="bg-slate-800/60 p-3 rounded border border-slate-700/30">
                                            <p className="text-white font-semibold">0 - 500kg</p>
                                            <p className="text-sky-300 text-lg font-bold">R$ 2,50/kg</p>
                                        </div>
                                        <div className="bg-slate-800/60 p-3 rounded border border-slate-700/30">
                                            <p className="text-white font-semibold">500 - 1200kg</p>
                                            <p className="text-sky-300 text-lg font-bold">R$ 2,80/kg</p>
                                        </div>
                                        <div className="bg-slate-800/60 p-3 rounded border border-slate-700/30">
                                            <p className="text-white font-semibold">1200+kg</p>
                                            <p className="text-sky-300 text-lg font-bold">R$ 3,00/kg</p>
                                        </div>
                                    </div>
                                </div>

                                {faixasPreco.length === 0 ? (
                                    <div className="bg-slate-50/5 border border-white/6 rounded-lg p-6 text-center">
                                        <p className="text-sky-300 text-sm">Nenhuma faixa de preço adicionada. Clique em "Adicionar Faixa" para começar.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {faixasPreco.map((faixa, idx) => (
                                            <div key={faixa.id} className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                                    <div>
                                                        <label className="text-slate-300 text-xs font-semibold mb-2 block">De (kg)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={faixa.peso_minimo}
                                                            onChange={(e) => updateFaixaPreco(faixa.id, "peso_minimo", parseFloat(e.target.value))}
                                                            className="w-full bg-slate-700/50 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 text-xs font-semibold mb-2 block">Até (kg)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={faixa.peso_maximo || ""}
                                                            onChange={(e) => updateFaixaPreco(faixa.id, "peso_maximo", e.target.value ? parseFloat(e.target.value) : null)}
                                                            placeholder="Ilimitado"
                                                            className="w-full bg-slate-700/50 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 text-xs font-semibold mb-2 block">Preço (R$)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={faixa.preco}
                                                            onChange={(e) => updateFaixaPreco(faixa.id, "preco", parseFloat(e.target.value))}
                                                            className="w-full bg-slate-700/50 border border-green-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
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
                            <div className="pt-8 border-t border-slate-600/50">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-white font-semibold text-lg flex items-center gap-3">
                                        <span className="text-2xl">💳</span>
                                        Variações por Prazo de Pagamento
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addVariacaoPagamento}
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-md"
                                    >
                                        <Plus size={18} /> Adicionar Variação
                                    </button>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">
                                    Defina preços diferentes por prazo de pagamento: Ex: À vista = R$4,50 | 30 dias = R$4,75
                                </p>

                                {/* Card de Exemplo */}
                                <div className="bg-slate-50/5 border border-white/6 rounded-lg p-4 mb-6">
                                    <div className="flex gap-2 items-start mb-3">
                                        <span className="text-violet-300 font-bold text-sm">💡 Exemplo:</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                        <div className="bg-slate-800/60 p-3 rounded border border-slate-700/30">
                                            <p className="text-white font-semibold">À Vista</p>
                                            <p className="text-violet-300 text-lg font-bold">R$ 4,50/kg</p>
                                            <p className="text-slate-400 text-xs">0% variação</p>
                                        </div>
                                        <div className="bg-slate-800/60 p-3 rounded border border-slate-700/30">
                                            <p className="text-white font-semibold">15 dias</p>
                                            <p className="text-violet-300 text-lg font-bold">R$ 4,61/kg</p>
                                            <p className="text-slate-400 text-xs">+2.5% variação</p>
                                        </div>
                                        <div className="bg-slate-800/60 p-3 rounded border border-slate-700/30">
                                            <p className="text-white font-semibold">30 dias</p>
                                            <p className="text-violet-300 text-lg font-bold">R$ 4,73/kg</p>
                                            <p className="text-slate-400 text-xs">+5% variação</p>
                                        </div>
                                    </div>
                                </div>

                                {variacoesPagamento.length === 0 ? (
                                    <div className="bg-slate-50/5 border border-white/6 rounded-lg p-6 text-center">
                                        <p className="text-violet-300 text-sm">Nenhuma variação de pagamento adicionada. Clique em "Adicionar Variação" para começar.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {variacoesPagamento.map((variacao) => (
                                            <div key={variacao.id} className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                                    <div>
                                                        <label className="text-slate-300 text-xs font-semibold mb-2 block">Condição</label>
                                                        <input
                                                            type="text"
                                                            value={variacao.condicao_nome}
                                                            onChange={(e) => updateVariacaoPagamento(variacao.id, "condicao_nome", e.target.value)}
                                                            placeholder="Ex: 30 dias"
                                                            className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 text-xs font-semibold mb-2 block">Dias</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={variacao.dias_prazo}
                                                            onChange={(e) => updateVariacaoPagamento(variacao.id, "dias_prazo", parseInt(e.target.value))}
                                                            className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 text-xs font-semibold mb-2 block">Variação (%)</label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={variacao.percentual_variacao}
                                                            onChange={(e) => updateVariacaoPagamento(variacao.id, "percentual_variacao", parseFloat(e.target.value))}
                                                            placeholder="Ex: 2.5"
                                                            className="w-full bg-slate-700/50 border border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 text-xs font-semibold mb-2 block">Preço Final (R$)</label>
                                                        <div className="bg-slate-700/70 border border-green-500/30 rounded-lg px-3 py-2 text-green-400 font-bold text-sm">
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

                            {/* Resumo */}
                            {(faixasPreco.length > 0 || variacoesPagamento.length > 0) && (
                                <div className="mt-8 p-4 bg-slate-50/3 border border-white/6 rounded-lg">
                                    <p className="text-white text-sm font-semibold mb-2">
                                        ✓ Resumo: {faixasPreco.length} faixa(s) de preço + {variacoesPagamento.length} variação(ões) de pagamento
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                        Essas informações serão enviadas junto com a tabela de preços para aprovação.
                                    </p>
                                </div>
                            )}

                            {/* Botões */}
                            <div className="flex flex-col md:flex-row gap-3 pt-8">
                                <button
                                    onClick={handleCriarPreco}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-green-600/40 transform hover:scale-105"
                                >
                                    <Save size={20} /> Criar e Enviar para Aprovação
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="flex-1 bg-slate-700/50 hover:bg-slate-700/80 text-slate-200 hover:text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600/50"
                                >
                                    <X size={20} /> Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ABA: HISTÓRICO */}
                {activeTab === "historico" && (
                    <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-md p-6 md:p-8 rounded-xl border border-slate-600/50 shadow-lg">
                        <h3 className="text-white font-bold text-2xl mb-6 flex items-center gap-3">
                            <span className="text-3xl">📈</span>Histórico de Preços
                        </h3>

                        {historico.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-400 text-lg">Nenhum histórico disponível</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {historico.map((item) => (
                                    <div key={item.id} className="bg-slate-700/40 hover:bg-slate-700/60 p-4 rounded-lg border border-slate-600/50 flex justify-between items-center transition-colors">
                                        <div className="flex-1">
                                            <p className="text-white font-semibold">{new Date(item.criadoEm).toLocaleDateString("pt-BR")}</p>
                                            <p className="text-slate-400 text-sm mt-1">
                                                {item.preco_anterior && `De R$ ${item.preco_anterior.toFixed(2)}`} → <span className="text-green-400 font-bold">R$ {item.preco_novo.toFixed(2)}</span>
                                            </p>
                                        </div>
                                        {item.percentual_variacao && (
                                            <div className={cn("text-right pl-4", item.percentual_variacao > 0 ? "text-red-400" : "text-green-400")}>
                                                <p className="font-bold text-lg">{item.percentual_variacao > 0 ? "+" : ""}{item.percentual_variacao.toFixed(2)}%</p>
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
                    <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-md p-6 md:p-8 rounded-xl border border-slate-600/50 shadow-lg">
                        <h3 className="text-white font-bold text-2xl mb-8 flex items-center gap-3">
                            <span className="text-3xl">📊</span>Relatório de Variação
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Info Material */}
                            <div className="bg-slate-700/40 p-6 rounded-lg border border-slate-600/50">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-4 tracking-wider">Informações</h4>
                                <div className="space-y-3 text-white">
                                    <div>
                                        <p className="text-slate-400 text-sm">Material</p>
                                        <p className="text-lg font-bold text-orange-400">{relatorio.classificacao.nome}</p>
                                    </div>
                                    {relatorio.estado && (
                                        <div>
                                            <p className="text-slate-400 text-sm">Estado</p>
                                            <p className="text-lg font-bold">{relatorio.estado.sigla} - {relatorio.estado.nome}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tendência */}
                            <div className="bg-slate-700/40 p-6 rounded-lg border border-slate-600/50">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-4 tracking-wider">Tendência</h4>
                                <div className="flex items-center gap-4">
                                    <span className="text-5xl">
                                        {relatorio.tendencia === "subindo" && "📈"}
                                        {relatorio.tendencia === "descendo" && "📉"}
                                        {relatorio.tendencia === "estavel" && "➡️"}
                                    </span>
                                    <div>
                                        <p className="text-white font-bold capitalize text-lg">{relatorio.tendencia}</p>
                                        {relatorio.percentual_variacao && (
                                            <p className={cn("text-lg font-bold", relatorio.percentual_variacao > 0 ? "text-red-400" : "text-green-400")}>
                                                {relatorio.percentual_variacao > 0 ? "+" : ""}{relatorio.percentual_variacao.toFixed(2)}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preço Atual */}
                            <div className="bg-slate-700/40 p-6 rounded-lg border border-slate-600/50 lg:col-span-1">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-4 tracking-wider">Preço Atual</h4>
                                <p className="text-4xl font-bold text-green-400">
                                    R$ {relatorio.preco_atual.toFixed(2)}
                                </p>
                            </div>

                            {/* Preço Anterior */}
                            <div className="bg-slate-700/40 p-6 rounded-lg border border-slate-600/50">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-4 tracking-wider">Preço Anterior</h4>
                                <p className="text-4xl font-bold text-orange-400">
                                    {relatorio.preco_anterior ? `R$ ${relatorio.preco_anterior.toFixed(2)}` : "N/A"}
                                </p>
                            </div>

                            {/* Média 30 dias */}
                            <div className="bg-slate-700/40 p-6 rounded-lg border border-slate-600/50">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-4 tracking-wider">Média (30 dias)</h4>
                                <p className="text-4xl font-bold text-blue-400">
                                    R${relatorio.preco_medio_30_dias?.toFixed(2) || "N/A"}
                                </p>
                            </div>

                            {/* Mín/Máx 30 dias */}
                            <div className="bg-slate-700/40 p-6 rounded-lg border border-slate-600/50">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-4 tracking-wider">Mín/Máx (30 dias)</h4>
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-300">
                                        Mín: <span className="font-bold text-green-400 text-lg">R$ {relatorio.preco_minimo_30_dias?.toFixed(2)}</span>
                                    </p>
                                    <p className="text-sm text-slate-300">
                                        Máx: <span className="font-bold text-red-400 text-lg">R$ {relatorio.preco_maximo_30_dias?.toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>);
};


