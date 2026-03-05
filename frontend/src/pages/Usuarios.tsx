import React, { useEffect, useState } from "react";
import {
  listarUsuarios,
  criarUsuario,
  editarUsuario,
  excluirUsuario,
  trocarSenha,
  listarPerfis,
} from "../services/usuarios";
import type { Usuario, Perfil } from "../services/usuarios";
import {
  UserPlus,
  ShieldCheck,
  Key,
  Trash2,
  Edit3,
  X,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [form, setForm] = useState<Omit<Usuario, "id">>({
    nome: "",
    email: "",
    perfil: "fornecedor",
    senha: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [perfilFiltro, setPerfilFiltro] = useState<string>("todos");

  const fetchUsuarios = async () => {
    setLoading(true);
    const data = await listarUsuarios();
    setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
    listarPerfis().then(setPerfis);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await editarUsuario(editId, form);
        setEditId(null);
      } else {
        await criarUsuario(form);
      }
      setForm({ nome: "", email: "", perfil: "fornecedor", senha: "" });
      fetchUsuarios();
    } catch (err) {
      alert("Erro ao salvar usuário.");
    }
  };

  const handleEdit = (u: Usuario) => {
    setEditId(u.id);
    setForm({ nome: u.nome, email: u.email, perfil: u.perfil, senha: "" });
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      (u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (perfilFiltro === "todos" || u.perfil === perfilFiltro),
  );

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Controle de Acessos
          </h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Administração de usuários e permissões
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar usuário..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm outline-none focus:bg-white/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LADO ESQUERDO: Formulário de Cadastro */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[var(--color-primary)]">
                {editId ? <Edit3 size={20} /> : <UserPlus size={20} />}
              </div>
              <h3 className="font-black uppercase italic text-gray-800">
                {editId ? "Editar Usuário" : "Novo Usuário"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  Nome Completo
                </label>
                <input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full p-3 bg-[var(--bg-input)]  border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 bg-[var(--bg-input)]  border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  Nível de Permissão
                </label>
                <select
                  value={form.perfil}
                  onChange={(e) =>
                    setForm({ ...form, perfil: e.target.value as Perfil })
                  }
                  className="w-full p-3 bg-[var(--bg-input)]  border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                >
                  {perfis.map((p) => (
                    <option key={p} value={p}>
                      {p.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {!editId && (
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    Senha Inicial
                  </label>
                  <input
                    type="password"
                    value={form.senha}
                    onChange={(e) =>
                      setForm({ ...form, senha: e.target.value })
                    }
                    className="w-full p-3 bg-[var(--bg-input)] border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                    required
                  />
                </div>
              )}

              <div className="pt-4 flex gap-2">
                <Button
                  type="submit"
                  className="flex-1  text-[var(--color-primary)] font-black uppercase italic py-6 rounded-2xl shadow-lg border !border-orange-500/20"
                >
                  {editId ? "Salvar Alterações" : "Criar Conta"}
                </Button>
                {editId && (
                  <Button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setForm({
                        nome: "",
                        email: "",
                        perfil: "fornecedor",
                        senha: "",
                      });
                    }}
                    className="bg-gray-100 text-gray-500 hover:bg-gray-200 p-4 rounded-2xl"
                  >
                    <X size={20} />
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Card de Informação Útil */}
          <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
            <ShieldCheck className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
            <h4 className="font-black uppercase italic text-sm mb-2">
              Segurança
            </h4>
            <p className="text-blue-100 text-xs leading-relaxed">
              Usuários com perfil <b>Admin</b> têm acesso total às
              configurações, enquanto <b>Fornecedores</b> acessam apenas o
              mercado.
            </p>
          </div>
        </div>

        {/* LADO DIREITO: Lista de Usuários */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex gap-2 mb-2">
            {["todos", ...perfis].map((p) => (
              <button
                key={p}
                onClick={() => setPerfilFiltro(p)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  perfilFiltro === p
                    ? "bg-white text-[var(--color-primary)] shadow-lg"
                    : "bg-white/10 text-[var(--color-primary)] hover:bg-white/20",
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Usuário
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Perfil
                    </th>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-20 text-center text-gray-400 font-medium italic"
                      >
                        Carregando usuários...
                      </td>
                    </tr>
                  ) : (
                    filteredUsuarios.map((u) => (
                      <tr
                        key={u.id}
                        className="group hover:bg-orange-50/30 transition-all"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gray-100 flex items-center justify-center text-[var(--color-primary)] font-black group-hover:bg-white transition-all shadow-sm">
                              {u.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-black text-gray-800 leading-none">
                                {u.nome}
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter",
                              u.perfil === "admin" &&
                                "bg-purple-100 text-purple-600",
                              u.perfil === "financeiro" &&
                                "bg-emerald-100 text-emerald-600",
                              u.perfil === "fornecedor" &&
                                "bg-blue-100 text-blue-600",
                            )}
                          >
                            {u.perfil}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(u)}
                              className="p-2 text-[var(--color-primary)] hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                              title="Editar"
                            >
                              <Edit3 size={16} />
                            </button>

                            {/* Botão Trocar Senha (abre um prompt rápido) */}
                            <button
                              onClick={async () => {
                                const p = prompt("Nova senha para " + u.nome);
                                if (p) {
                                  await trocarSenha(u.id, p);
                                  alert("Sucesso!");
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                              title="Resetar Senha"
                            >
                              <Key size={16} />
                            </button>

                            <button
                              onClick={() =>
                                excluirUsuario(u.id).then(fetchUsuarios)
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
