import React, { useEffect, useState } from "react";
import {
  Edit3,
  Plus,
  Info,
  Trash2,
  Save,
  FileText,
  Table as TableIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { priceService } from "../services/prices";
import type { Material } from "../services/prices";

export default function PriceList() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [novoMaterial, setNovoMaterial] = useState({ nome: "", preco: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMateriais();
  }, []);
  // --- Função Exportar para Excel ---
  const exportToExcel = () => {
    const dadosParaExportar = materiais.map((m) => ({
      Material: m.nome,
      Preço: m.preco,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Preços");
    XLSX.writeFile(workbook, "Tabela_de_Precos_JitSucata.xlsx");
  };

  // --- Função Exportar para PDF ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("JitSucata - Tabela de Preços", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Material", "Preço por Tonelada"]],
      body: materiais.map((m) => [m.nome, m.preco]),
      theme: "striped",
      headStyles: { fillColor: [191, 90, 27] },
    });
    doc.save("Tabela_de_Precos_JitSucata.pdf");
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novoMaterial.nome && novoMaterial.preco) {
      try {
        const criado = await priceService.criar(novoMaterial);
        setMateriais([...materiais, criado]);
        setNovoMaterial({ nome: "", preco: "" });
      } catch (error) {
        alert("Erro ao adicionar material");
      }
    }
  };

  const fetchMateriais = async () => {
    try {
      const data = await priceService.listar();
      setMateriais(data);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    }
  };

  const handleSaveAll = async () => {
    try {
      await priceService.atualizarTudo(materiais);
      setIsEditing(false);
      alert("Tabela atualizada com sucesso!");
    } catch (error) {
      alert("Erro ao salvar alterações");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja excluir este item?")) {
      try {
        await priceService.deletar(id);
        setMateriais(materiais.filter((m) => m.id !== id));
      } catch (error) {
        alert("Erro ao excluir");
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Tabela de Preços
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Gestão de Valores por Categoria
          </p>
        </div>

        {/* Botão de Editar Gigante na Direita */}
        <Button
          onClick={() => {
            if (isEditing) {
              handleSaveAll();
            } else {
              setIsEditing(true);
            }
          }}
          className={cn(
            "h-16 px-12 text-lg font-black uppercase italic shadow-2xl transition-all border-none ring-offset-[var(--color-primary)]",
            isEditing
              ? "bg-green-500 hover:bg-green-600 text-[var(--color-primary)]"
              : "bg-white text-[var(--color-primary)] hover:bg-gray-100",
          )}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-6 w-6" /> Salvar Tudo
            </>
          ) : (
            <>
              <Edit3 className="mr-2 h-6 w-6" /> Editar Tabela
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* LADO ESQUERDO: Legenda e Novo Material */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-4">
              <Info size={14} /> Legenda de Status
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/90 text-xs font-medium uppercase">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />{" "}
                Preço Atualizado
              </li>
              <li className="flex items-center gap-3 text-white/90 text-xs font-medium uppercase">
                <div className="w-2 h-2 rounded-full bg-blue-400" />{" "}
                Preferencial
              </li>
            </ul>
          </div>

          <form
            onSubmit={handleAddMaterial}
            className="bg-white p-5 rounded-2xl shadow-xl space-y-4"
          >
            <h4 className="text-[var(--color-primary)] font-black text-xs uppercase italic border-b pb-2">
              Cadastrar Novo
            </h4>
            <input
              type="text"
              placeholder="Nome do Material"
              className="w-full p-2.5 text-sm border-gray-100 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20"
              value={novoMaterial.nome}
              onChange={(e) =>
                setNovoMaterial({ ...novoMaterial, nome: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Preço (Ex: R$ 1.000,00)"
              className="w-full p-2.5 text-sm border-gray-100 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20"
              value={novoMaterial.preco}
              onChange={(e) =>
                setNovoMaterial({ ...novoMaterial, preco: e.target.value })
              }
            />
            <Button
              type="submit"
              className="w-full bg-[var(--color-primary)] hover:bg-[#BF5A1B] text-[#BF5A1B] font-black text-xs uppercase py-6 shadow-lg"
            >
              <Plus size={16} className="mr-2" /> Adicionar à Lista
            </Button>
          </form>
        </div>

        {/* CENTRO: Tabela e Exportação */}
        <div className="col-span-12 md:col-span-9 space-y-4">
          {/* Barra de Exportação */}
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-[#BF5A1B] rounded-lg text-xs font-bold uppercase transition-all"
            >
              <FileText size={14} /> Exportar PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-[#BF5A1B] rounded-lg text-xs font-bold uppercase transition-all"
            >
              <TableIcon size={14} /> Exportar Excel
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Descrição do Material
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Valor por Ton (R$)
                  </th>
                  {isEditing && (
                    <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Gerenciar
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {materiais.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                        {item.nome}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.preco}
                          onChange={(e) => {
                            const novosMateriais = materiais.map((m) =>
                              m.id === item.id
                                ? { ...m, preco: e.target.value }
                                : m,
                            );
                            setMateriais(novosMateriais);
                          }}
                          className="border-b-2 border-orange-100 bg-transparent focus:border-[var(--color-primary)] outline-none font-bold text-gray-800 w-full"
                        />
                      ) : (
                        <div className="text-sm font-black text-gray-700">
                          {item.preco}
                        </div>
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-8 py-5 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
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
