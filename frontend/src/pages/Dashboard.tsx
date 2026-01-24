import React, { useEffect, useState } from 'react';
import { listarMateriais } from '../services/materiais';
import type { Material } from '../services/materiais';
import { listarFornecedores } from '../services/fornecedores';
import type { Fornecedor } from '../types/fornecedor';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart3,
  Map as MapIcon,
  AlertCircle,
  TrendingUp,
  Package,
  Truck,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { cn } from "../lib/utils";

// Configuração do ícone do mapa (estilizado para o seu tema)
const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DashboardMateriaisAdmin = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    Promise.all([listarMateriais(), listarFornecedores()]).then(([mats, forn]) => {
      setMateriais(mats);
      setFornecedores(forn);
      setLoading(false);
    });
  }, []);

  const materiaisPendentes = materiais.filter(m => m.status === 'pendente');
  const totalVolume = materiais.reduce((acc, curr) => acc + Number(curr.quantidade), 0);

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho do Dashboard */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Command Center</h2>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Visão geral da operação e logística</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase italic border border-white/20">
            Live Data: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* KPIs Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Volume em Pátio" value={`${totalVolume}t`} icon={<Package />} color="blue" />
        <StatCard title="Coletas Pendentes" value={materiaisPendentes.length.toString()} icon={<AlertCircle />} color="orange" />
        <StatCard title="Fornecedores Ativos" value={fornecedores.length.toString()} icon={<TrendingUp />} color="green" />
        <StatCard title="Eficiência Mensal" value="92%" icon={<Truck />} color="purple" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* MAPA DE CALOR / LOGÍSTICA */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl overflow-hidden h-[450px] relative border border-white/10">
            <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl border border-gray-100">
              <h4 className="flex items-center gap-2 text-[var(--color-primary)] font-black uppercase italic text-xs">
                <MapIcon size={16} /> Mapa de Coletas Disponíveis
              </h4>
            </div>
            <MapContainer center={[-23.5505, -46.6333]} zoom={10} className="h-full w-full rounded-[2rem]">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {fornecedores.map(f => {
                const temMaterial = materiaisPendentes.some(m => m.fornecedorId === f.id);
                if (!temMaterial || !f.latitude || !f.longitude) return null;
                return (
                  <Marker key={f.id} position={[f.latitude, f.longitude]} icon={markerIcon}>
                    <Popup>
                      <div className="font-sans p-1">
                        <strong className="text-[var(--color-primary)] uppercase font-black">{f.name}</strong><br />
                        <span className="text-[10px] font-bold text-gray-400 uppercase italic">Material aguardando retirada</span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* LISTA DE MATERIAIS AGORA INTEGRADA */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-black uppercase italic text-gray-800 flex items-center gap-2">
                <BarChart3 size={18} className="text-[var(--color-primary)]" /> Materiais Pendentes
              </h3>
              <select
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase px-4 py-2 outline-none"
              >
                <option value="">Todos os Tipos</option>
                {Array.from(new Set(materiais.map(m => m.tipo))).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedor</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Material</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {materiaisPendentes.slice(0, 5).map(m => (
                    <tr key={m.id} className="hover:bg-orange-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-700">{fornecedores.find(f => f.id === m.fornecedorId)?.name || 'Desconhecido'}</td>
                      <td className="px-6 py-4">
                        <span className="font-black text-gray-800 italic uppercase">{m.tipo}</span>
                        <span className="ml-2 text-[10px] text-gray-400 font-bold">{m.quantidade}{m.unidade}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-md text-[9px] font-black uppercase">Aguardando</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: RELATÓRIOS E AÇÕES */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Card de Alerta do Sistema */}
          <div className="bg-[var(--color-primary-dark)] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <AlertCircle className="absolute -right-6 -top-6 h-32 w-32 text-black/20" />
            <h4 className="font-black uppercase italic text-sm mb-4">Lembrete de Hoje</h4>
            <p className="text-white/70 text-xs leading-relaxed mb-6">
              Existem <b>3 fornecedores</b> com material parado há mais de 48h. Verifique a disponibilidade de frete.
            </p>
            <Button className="w-full bg-white text-[var(--color-primary)] hover:bg-gray-100 font-black uppercase italic rounded-2xl py-6">
              Gerar Rota de Coleta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponente de Card de Estatística
const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: any, color: string }) => {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-white/10 group hover:translate-y-[-5px] transition-all duration-300">
      <div className={cn("p-3 w-fit rounded-2xl mb-4 transition-transform group-hover:scale-110", colors[color])}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-800 italic tracking-tighter">{value}</h3>
    </div>
  );
};

export default DashboardMateriaisAdmin;