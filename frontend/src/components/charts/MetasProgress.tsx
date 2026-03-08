import { useState, useEffect } from 'react';
import { listarMetas } from '@/services/metas';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, Target } from 'lucide-react';

interface Meta {
    id: string;
    tipo: string;
    quantidade: number;
    progresso: number;
    status: string;
}

export default function MetasProgress() {
    const [metas, setMetas] = useState<Meta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await listarMetas();
                setMetas(data);
            } catch (error) {
                console.error('Erro ao carregar metas:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'bg-green-500';
        if (progress >= 75) return 'bg-blue-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { bg: string; text: string }> = {
            'ativo': { bg: 'bg-green-100', text: 'text-green-700' },
            'concluido': { bg: 'bg-blue-100', text: 'text-blue-700' },
            'paused': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
            'cancelado': { bg: 'bg-red-100', text: 'text-red-700' }
        };
        const config = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
        return config;
    };

    return (
        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="pb-0 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 font-black uppercase italic flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Metas de Coleta
                    </CardTitle>
                    <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {metas.length} ativo(s)
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {metas.length > 0 ? (
                        metas.map((meta) => {
                            const percentage = Math.min((meta.progresso / meta.quantidade) * 100, 100);
                            const statusConfig = getStatusBadge(meta.status);

                            return (
                                <div key={meta.id} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase italic text-sm">
                                                {meta.tipo}
                                            </h4>
                                            <p className="text-xs text-gray-500 font-medium">
                                                {meta.progresso} de {meta.quantidade} unidades
                                            </p>
                                        </div>
                                        <div className={`${statusConfig.bg} ${statusConfig.text} px-3 py-1 rounded-full text-xs font-bold`}>
                                            {meta.status}
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`${getProgressColor(percentage)} h-full transition-all duration-300 rounded-full`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                                        <span>{percentage.toFixed(1)}%</span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Progresso
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="font-medium">Nenhuma meta cadastrada</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
