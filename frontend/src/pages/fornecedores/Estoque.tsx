import React, { useEffect, useState } from 'react';
import { portalService } from '../../services/portal';
import type { EstoqueItem } from '../../services/portal';
import { Box, Plus, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

export default function SupplierEstoque() {
    const [itens, setItens] = useState<EstoqueItem[]>([]);
    const [novaEntrada, setNovaEntrada] = useState({ tipo: '', quantidade: 0, unidade: 'kg', preco: 0, observacoes: '' });
    const [loading, setLoading] = useState(false);
    const [totalVolume, setTotalVolume] = useState(0);

    useEffect(() => {
        carregar();
    }, []);

    const carregar = () => {
        portalService
            .listarEstoque()
            .then((items) => {
                setItens(items);
                setTotalVolume(items.reduce((a, b) => a + b.quantidade, 0));
            })
            .catch(console.error);
    };

    const registrar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!novaEntrada.tipo || novaEntrada.quantidade <= 0 || novaEntrada.preco <= 0) {
            alert('Preencha todos os campos corretamente');
            return;
        }
        setLoading(true);
        try {
            await portalService.registrarEntrada(novaEntrada);
            carregar();
            setNovaEntrada({ tipo: '', quantidade: 0, unidade: 'kg', preco: 0, observacoes: '' });
            alert('Entrada registrada com sucesso!');
        } catch (err) {
            alert('Erro ao registrar entrada');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Meu Estoque</h2>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Gerencie sua entrada e saída de materiais</p>
                </div>
            </div>

            {/* KPI */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume Total em Estoque</p>
                        <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic">{
                            totalVolume.toFixed(2)
                        } <span className="text-sm">kg</span></h3>
                    </div>
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                        <Box size={32} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* ESQUERDA: Formulário */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="bg-white rounded-[2.5rem] shadow-xl p-8">
                        <h4 className="text-lg font-black text-gray-800 uppercase italic mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-[var(--color-primary)]" /> Registrar Nova Entrada
                        </h4>
                        <form onSubmit={registrar} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Material</label>
                                <input
                                    type="text"
                                    required
                                    value={novaEntrada.tipo}
                                    onChange={(e) => setNovaEntrada({ ...novaEntrada, tipo: e.target.value })}
                                    className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                                    placeholder="Ex: Ferro Pesado"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantidade</label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={novaEntrada.quantidade}
                                    onChange={(e) => setNovaEntrada({ ...novaEntrada, quantidade: Number(e.target.value) })}
                                    className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço por Unidade</label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={novaEntrada.preco}
                                    onChange={(e) => setNovaEntrada({ ...novaEntrada, preco: Number(e.target.value) })}
                                    className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Observações (Opcional)</label>
                                <textarea
                                    value={novaEntrada.observacoes}
                                    onChange={(e) => setNovaEntrada({ ...novaEntrada, observacoes: e.target.value })}
                                    className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                                    rows={3}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--color-primary)] hover:bg-[#BF5A1B] text-white font-black uppercase italic py-3 rounded-xl shadow-lg"
                            >
                                {loading ? 'Registrando...' : 'Registrar Entrada'}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* DIREITA: Lista */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-white rounded-[3rem] shadow-2xl p-8">
                        <h4 className="text-lg font-black text-gray-800 uppercase italic mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-[var(--color-primary)]" /> Materiais em Estoque
                        </h4>
                        {itens.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {itens.map((item) => (
                                    <div key={item.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h5 className="font-black text-gray-800 uppercase italic text-sm">{item.tipo}</h5>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                    Entrada: {new Date(item.dataRegistro).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-[var(--color-primary)] italic text-lg">{item.quantidade}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{item.unidade}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 py-8">Nenhum material em estoque</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
