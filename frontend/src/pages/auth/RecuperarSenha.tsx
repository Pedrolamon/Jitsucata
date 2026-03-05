import React, { useState } from "react";
import api from "../../services/api";
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  LifeBuoy,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom"; // Se estiver usando react-router

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await api.post("/recuperar-senha", { email });
      setEnviado(true);
    } catch (err) {
      setErro("E-mail não encontrado ou erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-[var(--color-primary)]">
      <div className=" max-w-lg mx-auto py-12 px-4">
        {/* Botão Voltar */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Voltar para o login
        </Link>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 p-10 md:p-14 relative">
          {/* Elemento Decorativo de Fundo */}
          <div className="absolute -right-10 -top-10 text-gray-50 opacity-50">
            <LifeBuoy size={200} />
          </div>

          {!enviado ? (
            <div className="relative z-10">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter mb-2">
                  Esqueceu a Senha?
                </h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  Insira seu e-mail para receber as <br /> instruções de
                  recuperação.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                    E-mail Cadastrado
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={18}
                    />
                    <input
                      type="email"
                      className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-gray-800"
                      placeholder="exemplo@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {erro && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-tighter animate-shake">
                    <AlertCircle size={16} /> {erro}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-[var(--color-primary)] hover:bg-orange-600  font-black uppercase italic rounded-2xl shadow-xl !shadow-orange-500/20 transition-all"
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <span className="flex items-center gap-2">
                      Enviar Link <Send size={16} />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 relative z-10 animate-in zoom-in-95 duration-300">
              <div className="inline-flex p-5 bg-green-50 text-green-500 rounded-full mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter mb-4">
                E-mail Enviado!
              </h3>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                Verifique sua caixa de entrada e siga as <br /> instruções para
                redefinir sua senha.
              </p>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-gray-100 font-black uppercase italic text-gray-400 hover:text-orange-500 transition-all"
                >
                  Entendi, voltar ao login
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em]">
            Não recebeu o e-mail? Verifique sua caixa de spam
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
