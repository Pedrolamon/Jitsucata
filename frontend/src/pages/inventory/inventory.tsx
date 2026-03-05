import { useState } from "react";
import {
  Box,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Scale,
  MoreHorizontal,
  Filter,
  FileText,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

export default function Inventory() {
  const [busca, setBusca] = useState("");

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Controle de Inventário
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Gestão de volumes e lotes em pátio
          </p>
        </div>

        <div className="flex gap-3 ">
          <Link
            to="/registrar-material"
            className="h-14 rounded-2xl px-8 flex items-center bg-white !text-[var(--color-primary)] hover:bg-gray-100 font-black uppercase italic shadow-2xl transition-all border-none"
          >
            <Box className="mr-2 h-5 w-5" /> Novo Lote Manual
          </Link>
        </div>
      </div>

      {/* Cards de Resumo de Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Volume Total",
            value: "36.4",
            unit: "Ton",
            icon: Scale,
            color: "text-blue-500",
          },
          {
            label: "Entradas (Hoje)",
            value: "+4.2",
            unit: "Ton",
            icon: ArrowDownToLine,
            color: "text-green-500",
          },
          {
            label: "Saídas (Hoje)",
            value: "-1.8",
            unit: "Ton",
            icon: ArrowUpFromLine,
            color: "text-orange-500",
          },
          {
            label: "Itens em Triagem",
            value: "05",
            unit: "Lotes",
            icon: History,
            color: "text-purple-500",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[2rem] shadow-xl flex items-center gap-4"
          >
            <div className={cn("p-3 rounded-2xl bg-gray-50", card.color)}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {card.label}
              </p>
              <h3 className="text-xl font-black text-gray-800 tracking-tighter">
                {card.value}{" "}
                <span className="text-xs text-gray-400">{card.unit}</span>
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LADO ESQUERDO: Filtros e Categorias */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
              <Filter size={14} /> Filtros de Busca
            </h4>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
                <input
                  type="text"
                  placeholder="ID do Lote..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:bg-white/10 transition-all"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">
                  Status do Lote
                </p>
                {["Disponível", "Reservado", "Em Triagem"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-3 text-white/80 text-xs cursor-pointer hover:text-white transition-colors p-1"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-transparent text-orange-500 focus:ring-orange-500"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Card Informativo */}
          <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <FileText className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
            <h4 className="font-black uppercase italic text-xs mb-2">
              Relatórios
            </h4>
            <p className="text-indigo-100 text-[10px] leading-relaxed mb-4">
              Gere o inventário consolidado para conferência de balança.
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-all">
              Baixar PDF
            </button>
          </div>
        </div>

        {/* DIREITA: Tabela de Inventário */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Identificação
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Material
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Qtd. Atual
                  </th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[].map((item: any) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-orange-50/30 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="text-xs font-black text-gray-400 uppercase">
                        #{item.id}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Entrada: {item.ultima_entrada}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-gray-800 uppercase italic tracking-tighter">
                        {item.material}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-gray-800">
                          {item.quantidade}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {item.unidade}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          item.status === "disponivel"
                            ? "bg-green-100 text-green-600"
                            : item.status === "reservado"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-orange-100 text-orange-600",
                        )}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
