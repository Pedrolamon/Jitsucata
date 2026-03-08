import { useEffect, useState } from 'react';
import { portalService } from '../../services/portal';
import { Grid2x2Check, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SupplierPrecos() {
    const [precos, setPrecos] = useState<{ nome: string; preco: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        portalService.listarPrecos()
            .then(setPrecos)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredPrecos = precos.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="w-full space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Tabela de Preços</h2>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Visualize todos os preços (somente leitura)</p>
                </div>
            </div>

            {/* Card Principal */}
            <div className="bg-white rounded-[3rem] shadow-2xl p-8">
                {/* Busca */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar material..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                    />
                </div>

                {/* Tabela */}
                {!loading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">
                                        <div className="flex items-center gap-2"><Grid2x2Check size={14} /> Material</div>
                                    </th>
                                    <th className="text-right py-4 px-6 font-black uppercase text-[10px] text-gray-600 tracking-widest">Preço por Tonelada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPrecos.length > 0 ? (
                                    filteredPrecos.map((p, i) => (
                                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-bold text-gray-800">{p.nome}</td>
                                            <td className="text-right py-4 px-6 font-black text-[var(--color-primary)] italic">R$ {(p.preco * 1000).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="py-8 text-center text-gray-400">Nenhum material encontrado</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">Carregando...</div>
                )}

                {/* Rodapé */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Eye size={12} className="inline mr-1" /> Esta tabela é atualizada automaticamente</p>
                </div>
            </div>
        </div>
    );
}