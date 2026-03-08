import { useState, useEffect } from 'react';
import { Wallet, Package, TrendingUp, AlertCircle, CheckCircle2, Clock, DollarSign, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import FinancialOverview from '@/components/charts/FinancialOverview';
import InventoryChart from '@/components/charts/InventoryChart';
import MetasProgress from '@/components/charts/MetasProgress';
import { listarPagamentos, type Pagamento } from '@/services/pagamentos';
import { listarEstoque } from '@/services/inventory';
import { listarFornecedores } from '@/services/fornecedores';

interface KPI {
    icon: React.ReactNode;
    title: string;
    value: string;
    subtittle: string;
    color: string;
    bgColor: string;
    trend?: string;
}

export default function SupplierDashboard() {
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<Pagamento[]>([]);
    const [topSuppliers, setTopSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Carregar pagamentos
                const pagamentos = await listarPagamentos();

                // Calcular KPIs
                const pagos = pagamentos.reduce((a, b) => a + (b.status === 'pago' ? b.valor : 0), 0);
                const agendados = pagamentos.reduce((a, b) => a + (b.status === 'agendado' ? b.valor : 0), 0);
                const atrasados = pagamentos.reduce((a, b) => a + (b.status === 'atrasado' ? b.valor : 0), 0);
                const total = pagamentos.reduce((a, b) => a + b.valor, 0);

                // Carregar estoque
                const estoque = await listarEstoque();
                const totalItems = estoque.reduce((a: number, b: any) => a + b.quantidade, 0);
                const disponivel = estoque.filter((e: any) => e.status === 'disponível').reduce((a: number, b: any) => a + b.quantidade, 0);

                // KPIs
                const newKpis: KPI[] = [
                    {
                        icon: <Wallet className="w-6 h-6" />,
                        title: 'Saldo Recebido',
                        value: `R$ ${pagos.toFixed(2)}`,
                        subtittle: `${pagamentos.filter(p => p.status === 'pago').length} pagamentos`,
                        color: 'text-green-600',
                        bgColor: 'bg-green-50'
                    },
                    {
                        icon: <Clock className="w-6 h-6" />,
                        title: 'Pendente',
                        value: `R$ ${agendados.toFixed(2)}`,
                        subtittle: `${pagamentos.filter(p => p.status === 'agendado').length} agendados`,
                        color: 'text-yellow-600',
                        bgColor: 'bg-yellow-50'
                    },
                    {
                        icon: <AlertCircle className="w-6 h-6" />,
                        title: 'Atrasado',
                        value: `R$ ${atrasados.toFixed(2)}`,
                        subtittle: `${pagamentos.filter(p => p.status === 'atrasado').length} atrasados`,
                        color: 'text-red-600',
                        bgColor: 'bg-red-50'
                    },
                    {
                        icon: <DollarSign className="w-6 h-6" />,
                        title: 'Total Geral',
                        value: `R$ ${total.toFixed(2)}`,
                        subtittle: `${pagamentos.length} transações`,
                        color: 'text-blue-600',
                        bgColor: 'bg-blue-50'
                    },
                    {
                        icon: <Package className="w-6 h-6" />,
                        title: 'Itens em Estoque',
                        value: totalItems.toLocaleString(),
                        subtittle: `${disponivel.toLocaleString()} disponíveis`,
                        color: 'text-purple-600',
                        bgColor: 'bg-purple-50'
                    },
                    {
                        icon: <TrendingUp className="w-6 h-6" />,
                        title: 'Taxa de Sucesso',
                        value: `${((pagos / total) * 100).toFixed(1)}%`,
                        subtittle: 'De pagamentos realizados',
                        color: 'text-indigo-600',
                        bgColor: 'bg-indigo-50'
                    }
                ];

                setKpis(newKpis);

                // Últimas transações
                setRecentTransactions(pagamentos.slice(0, 5));

                // Top fornecedores
                const fornecedores = await listarFornecedores();
                const supplierMap: Record<string, number> = {};

                pagamentos.forEach(pag => {
                    const nome = pag.fornecedor_nome || 'Desconhecido';
                    supplierMap[nome] = (supplierMap[nome] || 0) + pag.valor;
                });

                const topSuppliersList = Object.entries(supplierMap)
                    .map(([nome, valor]) => {
                        const supplier = fornecedores.find((f: any) => f.nome === nome);
                        return {
                            nome,
                            valor,
                            transacoes: pagamentos.filter(p => p.fornecedor_nome === nome).length,
                            status: supplier?.status || 'ativo'
                        };
                    })
                    .sort((a, b) => b.valor - a.valor)
                    .slice(0, 6);

                setTopSuppliers(topSuppliersList);

            } catch (error) {
                console.error('Erro ao carregar dashboard:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="ml-4 text-2xl font-black text-gray-800">Carregando...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tight">
                        Dashboard Inteligente
                    </h1>
                    <p className="text-gray-600 font-medium">
                        Acompanhamento completo de suas operações - {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kpis.map((kpi, index) => (
                        <Card
                            key={index}
                            className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 ${kpi.bgColor} ${kpi.color} rounded-xl group-hover:scale-110 transition-transform`}>
                                        {kpi.icon}
                                    </div>
                                    {kpi.trend && (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                            {kpi.trend}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                                    {kpi.title}
                                </p>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 italic tracking-tighter mb-2">
                                    {kpi.value}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                    {kpi.subtittle}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Gráficos Principais */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-4">
                            Análise Financeira
                        </h2>
                        <FinancialOverview />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-4">
                            Inventário e Operações
                        </h2>
                        <InventoryChart />
                    </div>

                    {/* Metas e Top Fornecedores */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <MetasProgress />
                        </div>

                        {/* Top Fornecedores */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow h-full">
                                <CardHeader className="pb-0 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-gray-900 font-black uppercase italic flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-600" />
                                            Top Fornecedores
                                        </CardTitle>
                                        <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            {topSuppliers.length} ativos
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        {topSuppliers.length > 0 ? (
                                            topSuppliers.map((supplier, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-black text-gray-900 uppercase italic text-sm truncate group-hover:text-blue-600">
                                                                {supplier.nome}
                                                            </p>
                                                            <p className="text-xs text-gray-500 font-medium">
                                                                {supplier.transacoes} transações
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="font-black text-gray-900 italic">R$ {supplier.valor.toFixed(2)}</p>
                                                        <div className={`text-xs font-bold px-2 py-1 rounded-lg mt-1 ${supplier.status === 'ativo'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {supplier.status === 'ativo' ? 'Ativo' : 'Inativo'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p className="font-medium">Nenhum fornecedor ativo</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Transações Recentes */}
                <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-0 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-gray-900 font-black uppercase italic flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                Transações Recentes
                            </CardTitle>
                            <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Últimas {recentTransactions.length}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left px-4 py-3 font-black text-gray-600 uppercase italic text-xs">Material</th>
                                        <th className="text-left px-4 py-3 font-black text-gray-600 uppercase italic text-xs">Fornecedor</th>
                                        <th className="text-left px-4 py-3 font-black text-gray-600 uppercase italic text-xs">Data</th>
                                        <th className="text-left px-4 py-3 font-black text-gray-600 uppercase italic text-xs">Valor</th>
                                        <th className="text-left px-4 py-3 font-black text-gray-600 uppercase italic text-xs">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 font-medium text-gray-900">{transaction.material}</td>
                                            <td className="px-4 py-4 text-gray-600">{transaction.fornecedor_nome}</td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {new Date(transaction.data_pagamento).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-4 font-black text-gray-900">R$ {transaction.valor.toFixed(2)}</td>
                                            <td className="px-4 py-4">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-xs uppercase ${transaction.status === 'pago'
                                                    ? 'bg-green-100 text-green-700'
                                                    : transaction.status === 'agendado'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${transaction.status === 'pago'
                                                        ? 'bg-green-600'
                                                        : transaction.status === 'agendado'
                                                            ? 'bg-yellow-600'
                                                            : 'bg-red-600'
                                                        }`} />
                                                    {transaction.status === 'pago' ? 'Pago' : transaction.status === 'agendado' ? 'Agendado' : 'Atrasado'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t border-gray-100 text-xs text-gray-500 font-medium">
                        <p>Mostrando {recentTransactions.length} transações mais recentes</p>
                    </CardFooter>
                </Card>

                {/* Footer Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center">
                    <p className="text-sm text-gray-700">
                        <span className="font-black text-blue-600">📊 Dashboard em Tempo Real</span> - Dados atualizados automaticamente
                    </p>
                </div>

            </div>
        </div>
    );
}
