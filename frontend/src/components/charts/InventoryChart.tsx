import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { listarEstoque } from '@/services/inventory';

interface InventoryData {
    material: string;
    [key: string]: string | number;
}

export default function InventoryChart() {
    const [data, setData] = useState<InventoryData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const items = await listarEstoque();

                // Agrupar por material e status
                const groupedData: Record<string, Record<string, number>> = {};
                let total = 0;

                items.forEach((item: any) => {
                    if (!groupedData[item.material]) {
                        groupedData[item.material] = {};
                    }

                    const status = item.status || 'disponível';
                    groupedData[item.material][status] = (groupedData[item.material][status] || 0) + item.quantidade;
                    total += item.quantidade;
                });

                const chartData = Object.entries(groupedData)
                    .map(([material, statuses]) => ({
                        material: material.length > 20 ? material.substring(0, 20) + '...' : material,
                        ...statuses,
                        total: Object.values(statuses).reduce((a, b) => a + b, 0)
                    }))
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 8);

                setData(chartData);
                setTotalItems(total);
            } catch (error) {
                console.error('Erro ao carregar inventário:', error);
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
        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow col-span-1 lg:col-span-2">
            <CardHeader className="pb-0 border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-900 font-black uppercase italic">
                        Inventário - Top Materiais
                    </CardTitle>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium uppercase">Total em Estoque</p>
                        <p className="text-2xl font-black text-blue-600">{totalItems.toLocaleString()}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="material"
                            stroke="#9ca3af"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            formatter={(value) => `${Number(value).toLocaleString()}`}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.75rem',
                                padding: '8px 12px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="disponível" fill="#10b981" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="reservado" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="aguardando_triagem" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
