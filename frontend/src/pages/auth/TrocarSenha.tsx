import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

const TrocarSenha = () => {
  const { user, logout } = useAuth();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [msg, setMsg] = useState({ tipo: '', texto: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ tipo: '', texto: '' });
    
    if (!user) return;
    if (novaSenha !== confirmar) {
      setMsg({ tipo: 'erro', texto: 'Nova senha e confirmação não conferem.' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/trocar-senha', { senhaAtual, novaSenha });
      setMsg({ tipo: 'sucesso', texto: 'Senha alterada com sucesso! Reiniciando sessão...' });
      setTimeout(() => logout(), 2000);
    } catch (err: any) {
      setMsg({ tipo: 'erro', texto: err?.response?.data?.error || 'Erro ao trocar senha.' });
    } finally {
      setLoading(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmar('');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 py-10">
      {/* Cabeçalho de Segurança */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-orange-500/10 rounded-full text-orange-500 mb-2">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Segurança da Conta</h2>
        <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">Atualize sua credencial de acesso</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 p-8 md:p-12 relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Senha Atual */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Senha Atual</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="password" 
                value={senhaAtual} 
                onChange={e => setSenhaAtual(e.target.value)} 
                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-gray-800"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Nova Senha */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="password" 
                value={novaSenha} 
                onChange={e => setNovaSenha(e.target.value)} 
                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-gray-800"
                placeholder="Mínimo 8 caracteres"
                required 
              />
            </div>
          </div>

          {/* Confirmar Nova Senha */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Confirmar Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="password" 
                value={confirmar} 
                onChange={e => setConfirmar(e.target.value)} 
                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-gray-800"
                placeholder="Repita a nova senha"
                required 
              />
            </div>
          </div>

          {/* Mensagens de Feedback */}
          {msg.texto && (
            <div className={cn(
              "p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
              msg.tipo === 'sucesso' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            )}>
              {msg.tipo === 'sucesso' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="text-xs font-bold uppercase tracking-tighter">{msg.texto}</span>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-[var(--color-primary)] hover:bg-orange-600 text-white font-black uppercase italic italic rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? "Processando..." : "Confirmar Alteração"}
          </Button>
        </form>
      </div>

      <p className="text-center text-white/30 text-[9px] font-bold uppercase tracking-[0.3em]">
        Sua sessão será encerrada após a alteração
      </p>
    </div>
  );
};

export default TrocarSenha;