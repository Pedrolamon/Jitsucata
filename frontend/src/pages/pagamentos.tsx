import { useState, useEffect } from 'react';
import {
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    Filter,
    FileSpreadsheet,
    X,
    Plus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { listarPagamentos, listarFornecedores, criarPagamento } from "@/services/pagamentos";
import type { Pagamento } from "@/services/pagamentos";
import type { Fornecedor } from "@/types/fornecedor";

export default function Payments() {
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [filter, setFilter] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        fornecedor_id: '',
        material: '',
        valor: '',
        data_pagamento: new Date().toISOString().split('T')[0],
        metodo_pagamento: 'PIX',
        descricao: '',
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [pags, forn] = await Promise.all([
                listarPagamentos(),
                listarFornecedores(),
            ]);
            setPagamentos(pags || []);
            setFornecedores(forn || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao carregar pagamentos');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.fornecedor_id || !formData.material || !formData.valor) {
            setError('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            setSubmitLoading(true);
            const fornecedor = fornecedores.find(f => f.id === formData.fornecedor_id);

            await criarPagamento({
                fornecedor_id: formData.fornecedor_id,
                fornecedor_nome: fornecedor?.name || 'Desconhecido',
                material: formData.material,
                valor: parseFloat(formData.valor),
                data_pagamento: formData.data_pagamento,
                metodo_pagamento: formData.metodo_pagamento as 'PIX' | 'TED' | 'Boleto' | 'Dinheiro',
                descricao: formData.descricao || undefined,
                status: 'agendado',
            });

            setSuccess('Pagamento criado com sucesso!');
            setFormData({
                fornecedor_id: '',
                material: '',
                valor: '',
                data_pagamento: new Date().toISOString().split('T')[0],
                metodo_pagamento: 'PIX',
                descricao: '',
            });
            setShowModal(false);
            await loadData();
        } catch (error) {
            console.error('Erro ao criar pagamento:', error);
            setError('Erro ao criar pagamento');
        } finally {
            setSubmitLoading(false);
        }
    }

    // Cálculos
    const totalPago = pagamentos
        .filter(p => p.status === 'pago')
        .reduce((a, p) => a + (p.valor || 0), 0);

    const totalAgendado = pagamentos
        .filter(p => p.status === 'agendado')
        .reduce((a, p) => a + (p.valor || 0), 0);

    const totalAtrasado = pagamentos
        .filter(p => p.status === 'atrasado')
        .reduce((a, p) => a + (p.valor || 0), 0);

    // Filtrados
    const filtrados = pagamentos.filter(p =>
        filter === 'todos' || p.status === filter
    );

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse mx-auto mb-4"></div>
                    <p className="text-lg font-black text-gray-800">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Cabeçalho */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tight">
                            Fluxo Financeiro
                        </h2>
                        <p className="text-gray-600 font-medium mt-1">Gestão de pagamentos e liquidações</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-xl h-12 font-black uppercase italic shadow-md transition-all inline-flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4" /> Exportar
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-700 font-black uppercase italic shadow-lg transition-all border-none rounded-xl inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Novo Lançamento
                        </button>
                    </div>
                </div>

                {/* Mensagens */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError('')}><X size={20} /></button>
                    </div>
                )}
                {success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold flex items-center justify-between">
                        <span>{success}</span>
                        <button onClick={() => setSuccess('')}><X size={20} /></button>
                    </div>
                )}

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden border-b-4 border-green-500">
                        <CardContent className="p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Pago (Geral)</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter">
                                    R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </h3>
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden border-b-4 border-orange-400">
                        <CardContent className="p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Agendado / Pendente</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter">
                                    R$ {totalAgendado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </h3>
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                    <Clock size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden border-b-4 border-red-500">
                        <CardContent className="p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Atrasos</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter">
                                    R$ {totalAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </h3>
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                    <ArrowDownLeft size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros e Tabela */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Filtros */}
                    <div className="col-span-12 lg:col-span-3">
                        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                            <CardHeader className="pb-0 border-b border-gray-100">
                                <CardTitle className="text-gray-900 font-black uppercase italic flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-blue-600" /> Filtrar Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-2">
                                {['todos', 'pago', 'agendado', 'atrasado'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase italic transition-all ${filter === s
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {s === 'todos' ? 'Todos' : s === 'pago' ? 'Pago' : s === 'agendado' ? 'Agendado' : 'Atrasado'}
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabela */}
                    <div className="col-span-12 lg:col-span-9">
                        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-6 py-4 text-left font-black text-gray-600 uppercase italic text-xs">
                                                    Fornecedor / Material
                                                </th>
                                                <th className="px-6 py-4 text-left font-black text-gray-600 uppercase italic text-xs">
                                                    Valor
                                                </th>
                                                <th className="px-6 py-4 text-left font-black text-gray-600 uppercase italic text-xs">
                                                    Data
                                                </th>
                                                <th className="px-6 py-4 text-center font-black text-gray-600 uppercase italic text-xs">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-center font-black text-gray-600 uppercase italic text-xs">
                                                    Ação
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filtrados.length > 0 ? (
                                                filtrados.map((pag) => (
                                                    <tr key={pag.id} className="hover:bg-gray-50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="font-black text-gray-900 uppercase italic">{pag.fornecedor_nome}</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {pag.material} • {pag.metodo_pagamento}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-black text-gray-900">
                                                            R$ {pag.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 flex items-center gap-1">
                                                            <Calendar size={16} />
                                                            {new Date(pag.data_pagamento).toLocaleDateString('pt-BR')}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-xs uppercase ${pag.status === 'pago'
                                                                ? 'bg-green-100 text-green-700'
                                                                : pag.status === 'agendado'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                <span className={`w-2 h-2 rounded-full ${pag.status === 'pago'
                                                                    ? 'bg-green-600'
                                                                    : pag.status === 'agendado'
                                                                        ? 'bg-blue-600'
                                                                        : 'bg-red-600'
                                                                    }`} />
                                                                {pag.status === 'pago' ? 'Pago' : pag.status === 'agendado' ? 'Agendado' : 'Atrasado'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                                <Download size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-semibold">
                                                        Nenhum pagamento encontrado
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t border-gray-100 text-xs text-gray-500 font-medium">
                                <p>Total de {filtrados.length} pagamentos</p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="bg-white border-0 shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CardHeader className="pb-0 border-b border-gray-100 flex items-center justify-between flex-row">
                                <CardTitle className="text-gray-900 font-black uppercase italic">
                                    Novo Lançamento de Pagamento
                                </CardTitle>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={24} className="text-gray-600" />
                                </button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Fornecedor */}
                                    <div>
                                        <label className="block text-sm font-black text-gray-900 uppercase italic mb-2">
                                            Fornecedor *
                                        </label>
                                        <select
                                            value={formData.fornecedor_id}
                                            onChange={(e) => setFormData({ ...formData, fornecedor_id: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        >
                                            <option value="">Selecione um fornecedor</option>
                                            {fornecedores.map(f => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Material */}
                                    <div>
                                        <label className="block text-sm font-black text-gray-900 uppercase italic mb-2">
                                            Material *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Sucata de Gusa"
                                            value={formData.material}
                                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        />
                                    </div>

                                    {/* Valor */}
                                    <div>
                                        <label className="block text-sm font-black text-gray-900 uppercase italic mb-2">
                                            Valor (R$) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.valor}
                                            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        />
                                    </div>

                                    {/* Data */}
                                    <div>
                                        <label className="block text-sm font-black text-gray-900 uppercase italic mb-2">
                                            Data do Pagamento *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.data_pagamento}
                                            onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        />
                                    </div>

                                    {/* Método */}
                                    <div>
                                        <label className="block text-sm font-black text-gray-900 uppercase italic mb-2">
                                            Método de Pagamento
                                        </label>
                                        <select
                                            value={formData.metodo_pagamento}
                                            onChange={(e) => setFormData({ ...formData, metodo_pagamento: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        >
                                            <option value="PIX">PIX</option>
                                            <option value="TED">TED</option>
                                            <option value="Boleto">Boleto</option>
                                            <option value="Dinheiro">Dinheiro</option>
                                        </select>
                                    </div>

                                    {/* Descrição */}
                                    <div>
                                        <label className="block text-sm font-black text-gray-900 uppercase italic mb-2">
                                            Descrição
                                        </label>
                                        <textarea
                                            placeholder="Adicione observações..."
                                            value={formData.descricao}
                                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Botões */}
                                    <div className="flex gap-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold uppercase italic transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitLoading}
                                            className="flex-1 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 rounded-lg font-bold uppercase italic transition-all"
                                        >
                                            {submitLoading ? 'Salvando...' : 'Salvar Pagamento'}
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

            </div>
        </div>
    );
}
