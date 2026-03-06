<<<<<<< HEAD
import { useState, useEffect } from "react";
import {
  DollarSign,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Filter,
  FileSpreadsheet,
  X,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import {
  listarPagamentos,
  getResumoFinanceiro,
  criarPagamento,
  atualizarPagamento,
  deletarPagamento,
} from "../services/pagamentos";
import type { Pagamento } from "../services/pagamentos";
export default function Payments() {
  const [filter, setFilter] = useState("todos");
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [resumo, setResumo] = useState({
    total_pago: 0,
    total_agendado: 0,
    total_atrasado: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fornecedor_id: "",
    fornecedor_nome: "",
    material: "",
    valor: "",
    data_pagamento: "",
    status: "agendado",
    metodo_pagamento: "PIX",
    descricao: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagsData, resumoData] = await Promise.all([
        listarPagamentos(),
        getResumoFinanceiro(),
      ]);
      setPagamentos(pagsData || []);
      setResumo(
        resumoData || { total_pago: 0, total_agendado: 0, total_atrasado: 0 },
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await atualizarPagamento(editingId, {
          ...formData,
          valor: parseFloat(formData.valor),
        });
      } else {
        await criarPagamento({
          ...formData,
          valor: parseFloat(formData.valor),
        });
      }
      await fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar pagamento:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este pagamento?")) {
      try {
        await deletarPagamento(id);
        await fetchData();
      } catch (error) {
        console.error("Erro ao deletar pagamento:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fornecedor_id: "",
      fornecedor_nome: "",
      material: "",
      valor: "",
      data_pagamento: "",
      status: "agendado",
      metodo_pagamento: "PIX",
      descricao: "",
    });
    setEditingId(null);
  };

  const handleEdit = (pag: Pagamento) => {
    setFormData({
      fornecedor_id: pag.fornecedor_id,
      fornecedor_nome: pag.fornecedor_nome,
      material: pag.material,
      valor: pag.valor.toString(),
      data_pagamento: pag.data_pagamento,
      status: pag.status || "agendado",
      metodo_pagamento: pag.metodo_pagamento || "PIX",
      descricao: pag.descricao || "",
    });
    setEditingId(pag.id || "");
    setShowModal(true);
  };

  const filterPagamentos = pagamentos.filter(
    (p) => filter === "todos" || p.status === filter,
  );

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Fluxo Financeiro
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Gestão de pagamentos e liquidações
          </p>
        </div>

        <div className="flex gap-3">
          <Button className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl h-12">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Relatório
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="h-12 px-8 bg-white text-[var(--color-primary)] hover:bg-gray-100 font-black uppercase italic shadow-2xl transition-all border-none"
          >
            <DollarSign className="mr-2 h-5 w-5" /> Novo Lançamento
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-green-500">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Pago
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(resumo.total_pago || 0)}
            </h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-orange-400">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Agendado / Pendente
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(resumo.total_agendado || 0)}
            </h3>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-red-500">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Atrasos de Faturamento
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(resumo.total_atrasado || 0)}
            </h3>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ArrowDownLeft size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filtros Laterais */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
            <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
              <Filter size={14} /> Filtrar Status
            </h4>
            <div className="space-y-2">
              {["todos", "pago", "agendado", "atrasado"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase italic transition-all",
                    filter === s
                      ? "bg-white text-[var(--color-primary)]"
                      : "text-white/60 hover:bg-white/5",
                  )}
                >
                  {s}
                </button>
              ))}
=======
import { useState } from 'react';
import {
    DollarSign,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,

    Filter,
    FileSpreadsheet
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

// Mock de dados de pagamentos
const PAGAMENTOS_MOCK = [
    { id: 1, fornecedor: "Recicla Tech Ltda", material: "Sucata de Gusa", valor: 12500.00, data: "2024-05-20", status: "pago", metodo: "PIX" },
    { id: 2, fornecedor: "Metalúrgica Silva", material: "Chapa Recorte", valor: 8900.50, data: "2024-05-22", status: "agendado", metodo: "TED" },
    { id: 3, fornecedor: "Auto Desmonte", material: "Ferro Fundido", valor: 4200.00, data: "2024-05-18", status: "atrasado", metodo: "Boleto" },
    { id: 4, fornecedor: "Indústria Alfa", material: "Cavaco", valor: 15700.00, data: "2024-05-25", status: "agendado", metodo: "PIX" },
];

export default function Payments() {
    const [filter, setFilter] = useState('todos');

    return (
        <div className="w-full space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Fluxo Financeiro</h2>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Gestão de pagamentos e liquidações</p>
                </div>

                <div className="flex gap-3">
                    <Button className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl h-12">
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Relatório
                    </Button>
                    <Button className="h-12 px-8 bg-white text-[var(--color-primary)] hover:bg-gray-100 font-black uppercase italic shadow-2xl transition-all border-none">
                        <DollarSign className="mr-2 h-5 w-5" /> Novo Lançamento
                    </Button>
                </div>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-green-500">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pago (Mês)</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-800 tracking-tighter">R$ 45.300,00</h3>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ArrowUpRight size={20} /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-orange-400">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Agendado / Pendente</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-800 tracking-tighter">R$ 24.600,50</h3>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Clock size={20} /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-red-500">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Atrasos de Faturamento</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-800 tracking-tighter">R$ 4.200,00</h3>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ArrowDownLeft size={20} /></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Filtros Laterais */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
                        <h4 className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
                            <Filter size={14} /> Filtrar Status
                        </h4>
                        <div className="space-y-2">
                            {['todos', 'pago', 'agendado', 'atrasado'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase italic transition-all",
                                        filter === s ? "bg-white text-[var(--color-primary)]" : "text-white/60 hover:bg-white/5"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabela de Pagamentos */}
                <div className="col-span-12 lg:col-span-9">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedor / Material</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Recibo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {PAGAMENTOS_MOCK.filter(p => filter === 'todos' || p.status === filter).map((pag) => (
                                    <tr key={pag.id} className="hover:bg-orange-50/30 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-black text-gray-800 leading-none">{pag.fornecedor}</div>
                                            <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{pag.material} • {pag.metodo}</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-black text-gray-700">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pag.valor)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                <Calendar size={14} />
                                                {new Date(pag.data).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
                                                pag.status === 'pago' ? "bg-green-100 text-green-600" :
                                                    pag.status === 'agendado' ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                                            )}>
                                                {pag.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
>>>>>>> 67748c1f5223b794bc71d6873e60be11a17a78f2
            </div>
          </div>
        </div>
<<<<<<< HEAD

        {/* Tabela de Pagamentos */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Carregando pagamentos...
              </div>
            ) : filterPagamentos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhum pagamento encontrado
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Fornecedor / Material
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Valor
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Data
                    </th>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filterPagamentos.map((pag) => (
                    <tr
                      key={pag.id}
                      className="hover:bg-orange-50/30 transition-all group"
                    >
                      <td className="px-6 py-5">
                        <div className="text-sm font-black text-gray-800 leading-none">
                          {pag.fornecedor_nome}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                          {pag.material} • {pag.metodo_pagamento}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-gray-700">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(pag.valor)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <Calendar size={14} />
                          {new Date(pag.data_pagamento).toLocaleDateString(
                            "pt-BR",
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
                            pag.status === "pago"
                              ? "bg-green-100 text-green-600"
                              : pag.status === "agendado"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-red-100 text-red-600",
                          )}
                        >
                          {pag.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(pag)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(pag.id!)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Novo/Editar Pagamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-black text-gray-800">
                {editingId ? "Editar" : "Novo"} Pagamento
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Fornecedor
                </label>
                <input
                  type="text"
                  required
                  value={formData.fornecedor_nome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fornecedor_nome: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Material
                </label>
                <input
                  type="text"
                  required
                  value={formData.material}
                  onChange={(e) =>
                    setFormData({ ...formData, material: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Tipo de material"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) =>
                    setFormData({ ...formData, valor: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Data de Pagamento
                </label>
                <input
                  type="date"
                  required
                  value={formData.data_pagamento}
                  onChange={(e) =>
                    setFormData({ ...formData, data_pagamento: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="agendado">Agendado</option>
                  <option value="pago">Pago</option>
                  <option value="atrasado">Atrasado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Método de Pagamento
                </label>
                <select
                  value={formData.metodo_pagamento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metodo_pagamento: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="PIX">PIX</option>
                  <option value="TED">TED</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Descrição (Opcional)
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                  placeholder="Observações sobre o pagamento"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:opacity-90 transition-all"
                >
                  {editingId ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
=======
    );
}
>>>>>>> 67748c1f5223b794bc71d6873e60be11a17a78f2
