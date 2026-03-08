import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { listarPagamentos } from '@/services/pagamentos';

interface PaymentData {
    status: string;
    valor: number;
    count: number;
}

interface MonthlyData {
    mes: string;
    recebido: number;
    pendente: number;
    atrasado: number;
}

export default function FinancialOverview() {
    const [paymentStatus, setPaymentStatus] = useState<PaymentData[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState(true);

    const COLORS = {
        pago: '#10b981',
        agendado: '#f59e0b',
        atrasado: '#ef4444',
        planejado: '#3b82f6'
    };

    useEffect(() => {
        async function loadData() {
            try {
                const pagamentos = await listarPagamentos();

                // Agrupar por status
                const byStatus = pagamentos.reduce((acc: Record<string, { valor: number; count: number }>, pag) => {
                    const status = pag.status || 'pendente';
                    if (!acc[status]) {
                        acc[status] = { valor: 0, count: 0 };
                    }
                    acc[status].valor += pag.valor;
                    acc[status].count += 1;
                    return acc;
                }, {});

                setPaymentStatus(
                    Object.entries(byStatus).map(([status, data]) => ({
                        status: status.charAt(0).toUpperCase() + status.slice(1),
                        valor: data.valor,
                        count: data.count
                    }))
                );

                // Análise mensal
                const monthlyMap: Record<string, { recebido: number; pendente: number; atrasado: number }> = {};
                pagamentos.forEach(pag => {
                    const date = new Date(pag.data_pagamento);
                    const mesKey = `${date.toLocaleString('pt-BR', { month: 'short' })}`;

                    if (!monthlyMap[mesKey]) {
                        monthlyMap[mesKey] = { recebido: 0, pendente: 0, atrasado: 0 };
                    }

                    if (pag.status === 'pago') {
                        monthlyMap[mesKey].recebido += pag.valor;
                    } else if (pag.status === 'agendado') {
                        monthlyMap[mesKey].pendente += pag.valor;
                    } else {
                        monthlyMap[mesKey].atrasado += pag.valor;
                    }
                });

                const monthlyArray = Object.entries(monthlyMap)
                    .slice(-6)
                    .map(([mes, data]) => ({
                        mes,
                        ...data
                    }));

                setMonthlyData(monthlyArray);
            } catch (error) {
                console.error('Erro ao carregar dados financeiros:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pagamentos por Status */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <CardHeader className="pb-0 border-b border-gray-100">
                    <CardTitle className="text-gray-900 font-black uppercase italic">
                        Distribuição de Pagamentos
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={paymentStatus}
                                dataKey="valor"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {paymentStatus.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[entry.status.toLowerCase() as keyof typeof COLORS] || '#6b7280'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.75rem',
                                    padding: '8px 12px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-6 space-y-2">
                        {paymentStatus.map((item) => (
                            <div key={item.status} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: COLORS[item.status.toLowerCase() as keyof typeof COLORS] || '#6b7280'
                                        }}
                                    />
                                    <span className="text-gray-600 font-medium">{item.status}</span>
                                </div>
                                <span className="font-bold text-gray-900">R$ {item.valor.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tendência Mensal */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <CardHeader className="pb-0 border-b border-gray-100">
                    <CardTitle className="text-gray-900 font-black uppercase italic">
                        Movimentação Mensal
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.75rem',
                                    padding: '8px 12px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="recebido" fill="#10b981" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="pendente" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="atrasado" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
