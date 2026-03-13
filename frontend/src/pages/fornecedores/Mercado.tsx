import { useEffect, useState } from 'react';
import { portalService } from '../../services/portal';
import { Handshake, MapPin, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SupplierMercado() {
    const [materiais, setMateriais] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({ state: '', city: '', tipo: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const carregar = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filtros.state) params.state = filtros.state;
            if (filtros.city) params.city = filtros.city;
            const items = await portalService.materialMercado(params);
            setMateriais(items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const materiaisFiltered = materiais.filter(m =>
    (m.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="w-full space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Material no Mercado</h2>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Veja materiais disponíveis de outros fornecedores</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* ESQUERDA: Filtros */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20">
                        <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
                            <Search size={14} /> Filtrar Materiais
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-white text-[10px] font-bold uppercase mb-2 block">Estado</label>
                                <input
                                    placeholder="Ex: SP"
                                    value={filtros.state}
                                    onChange={(e) => setFiltros({ ...filtros, state: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-gray-500 border border-white/30 text-xs outline-none focus:border-white transition-colors placeholder-white/50"
                                />
                            </div>
                            <div>
                                <label className="text-white text-[10px] font-bold uppercase mb-2 block">Cidade</label>
                                <input
                                    placeholder="Ex: São Paulo"
                                    value={filtros.city}
                                    onChange={(e) => setFiltros({ ...filtros, city: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-gray-500 border border-white/30 text-xs outline-none focus:border-white transition-colors placeholder-white/50"
                                />
                            </div>
                            <button
                                onClick={carregar}
                                className="w-full px-4 py-2 bg-white text-[var(--color-primary)] font-black uppercase text-xs rounded-xl hover:shadow-lg transition-all"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                {/* DIREITA: Lista */}
                <div className="col-span-12 lg:col-span-9">
                    <div className="bg-white rounded-[3rem] shadow-2xl p-8">
                        {/* Busca */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Buscar por tipo ou fornecedor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                            />
                        </div>

                        {/* Lista de Materiais */}
                        {!loading ? (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {materiaisFiltered.length > 0 ? (
                                    materiaisFiltered.map((m) => (
                                        <div key={m.id} className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-orange-200 transition-all">
                                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedor</p>
                                                    <h5 className="font-black text-gray-800 uppercase italic text-sm mt-1">{m.name}</h5>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Material</p>
                                                    <p className="font-bold text-gray-700 text-sm mt-1">{m.tipo}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantidade</p>
                                                    <p className="font-black text-[var(--color-primary)] italic text-lg mt-1">{m.quantidade.toFixed(2)} {m.unidade}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço</p>
                                                    <p className="font-black text-gray-800 italic text-lg mt-1">R$ {(m.preco || 0).toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização</p>
                                                    <p className="font-bold text-gray-700 text-sm mt-1 flex items-center gap-1">
                                                        <MapPin size={12} /> {m.city}, {m.state}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <Handshake size={32} className="mx-auto mb-2 opacity-50 text-gray-400" />
                                        <p className="text-gray-400">Nenhum material disponível com esses filtros</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">Carregando materiais...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
