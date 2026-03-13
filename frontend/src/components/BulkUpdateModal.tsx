import { useState } from "react";
import { X, Save } from "lucide-react";
import { cn } from "../lib/utils";
import { advancedPricesService } from "../services/advanced-prices";

interface BulkUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
    estadoId?: string;
    estadoNome?: string;
    classificacaoId?: string;
    classificacaoNome?: string;
}

export function BulkUpdateModal({
    isOpen,
    onClose,
    onSuccess,
    onError,
    estadoId,
    estadoNome,
    classificacaoId,
    classificacaoNome,
}: BulkUpdateModalProps) {
    const [tipo, setTipo] = useState<"estado" | "classificacao">("estado");
    const [percentual, setPercentual] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            let resultado;

            if (tipo === "estado" && estadoId) {
                resultado = await advancedPricesService.bulkUpdateEstado(estadoId, percentual);
            } else if (tipo === "classificacao" && classificacaoId) {
                resultado = await advancedPricesService.bulkUpdateClassificacao(classificacaoId, percentual);
            } else {
                throw new Error("Selecione uma opção válida");
            }

            onSuccess(
                `✅ ${resultado.atualizados} preço(s) atualizado(s) com ${percentual > 0 ? "+" : ""}${percentual}%`
            );
            onClose();
            setPercentual(0);
        } catch (err: any) {
            onError(`❌ Erro: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-white/20 p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">🔄 Atualização em Massa</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <X size={20} className="text-white/60" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Tipo de Atualização */}
                    <div>
                        <label className="block text-white/80 font-semibold text-sm mb-2">
                            O que deseja atualizar?
                        </label>
                        <div className="space-y-2">
                            {estadoId && (
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-colors">
                                    <input
                                        type="radio"
                                        name="tipo"
                                        value="estado"
                                        checked={tipo === "estado"}
                                        onChange={() => setTipo("estado")}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-white">
                                        Todos os preços do estado <strong>{estadoNome}</strong>
                                    </span>
                                </label>
                            )}
                            {classificacaoId && (
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-colors">
                                    <input
                                        type="radio"
                                        name="tipo"
                                        value="classificacao"
                                        checked={tipo === "classificacao"}
                                        onChange={() => setTipo("classificacao")}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-white">
                                        Todos os preços de <strong>{classificacaoNome}</strong>
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Percentual de Variação */}
                    <div>
                        <label className="block text-white/80 font-semibold text-sm mb-2">
                            Percentual de Variação
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                step="0.1"
                                value={percentual}
                                onChange={(e) => setPercentual(parseFloat(e.target.value))}
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-500 focus:outline-none focus:border-orange-500"
                                placeholder="Ex: 5.5"
                            />
                            <span className="text-white font-bold">%</span>
                        </div>
                        <p className="text-white/50 text-xs mt-2">
                            {percentual > 0 ? "📈 Aumento" : percentual < 0 ? "📉 Redução" : "➡️ Sem alteração"}
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-white/70 text-sm">
                            📌 <strong>Exemplo:</strong> Se um preço é R$ 100,00 será{" "}
                            <strong>R$ {(100 * (1 + percentual / 100)).toFixed(2)}</strong>
                        </p>
                    </div>

                    {/* Warning */}
                    {Math.abs(percentual) > 20 && (
                        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
                            <p className="text-yellow-300 text-sm font-semibold">
                                ⚠️ Atenção! Variação acima de 20%. Tem certeza?
                            </p>
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-gray-500/60 hover:bg-gray-600/60 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || percentual === 0}
                            className={cn(
                                "flex-1 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50",
                                percentual > 0
                                    ? "bg-red-500/60 hover:bg-red-600/60"
                                    : "bg-green-500/60 hover:bg-green-600/60"
                            )}
                        >
                            <Save size={16} />
                            {loading ? "Atualizando..." : "Confirmar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
