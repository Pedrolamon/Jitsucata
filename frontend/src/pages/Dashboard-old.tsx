import React, { useEffect, useState } from "react";
import { listarMateriais } from "@/services/materiais";
import type { Material } from "@/services/materiais";
import { listarFornecedores } from "@/services/fornecedores";
import type { Fornecedor } from "@/types/fornecedor";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  BarChart3,
  Map as MapIcon,
  AlertCircle,
  TrendingUp,
  Package,
  Truck,
  Activity,
  Clock,
  CheckCircle2,
  Zap,
  Users,
  GitBranch,
  LineChart,
  Boxes,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { BarChart, Bar, LineChart as LineChartComponent, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Configuração do ícone do mapa
const markerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DashboardMateriaisAdmin = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [mats, forn] = await Promise.all([
          listarMateriais(),
          listarFornecedores(),
        ]);
        setMateriais(mats || []);
        setFornecedores(forn || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Cálculos de dados
  const materiaisPendentes = materiais.filter((m) => m.status === "pendente");
  const materiaisEmColeta = materiais.filter((m) => m.status === "em_coleta");
  const materiaisEntregues = materiais.filter((m) => m.status === "entregue");

  const totalVolume = materiais.reduce((acc, curr) => acc + Number(curr.quantidade || 0), 0);
  const volumePendente = materiaisPendentes.reduce((acc, curr) => acc + Number(curr.quantidade || 0), 0);
  const volumeEntregue = materiaisEntregues.reduce((acc, curr) => acc + Number(curr.quantidade || 0), 0);

  const fornecedoresAtivos = fornecedores.filter((f) => f.status === "ativo");
  const eficiencia = materiaisEntregues.length > 0
    ? Math.round((materiaisEntregues.length / materiais.length) * 100)
    : 0;

  // Dados para gráficos
  const statusData = [
    { name: "Pendente", value: materiaisPendentes.length, volume: volumePendente },
    { name: "Em Coleta", value: materiaisEmColeta.length, volume: materiaisEmColeta.reduce((a, m) => a + Number(m.quantidade || 0), 0) },
    { name: "Entregue", value: materiaisEntregues.length, volume: volumeEntregue },
  ];

  const tipoMateriais = Array.from(new Set(materiais.map((m) => m.tipo))).map((tipo) => ({
    tipo,
    quantidade: materiais.filter((m) => m.tipo === tipo).length,
  }));

  const fornecedorVolume = fornecedores.map((f) => ({
    nome: f.name,
    materiais: materiais.filter((m) => m.fornecedorId === f.id).length,
    volume: materiais
      .filter((m) => m.fornecedorId === f.id)
      .reduce((a, m) => a + Number(m.quantidade || 0), 0),
  })).sort((a, b) => b.volume - a.volume).slice(0, 6);

  // Materiais filtrados
  const materiaisFiltrados = materiais.filter((m) => {
    const matchTipo = !filtroTipo || m.tipo === filtroTipo;
    const matchStatus = !filtroStatus || m.status === filtroStatus;
    const matchSearch = !searchTerm ||
      m.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fornecedorId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTipo && matchStatus && matchSearch;
  });

  const COLORS = {
    pendente: "#f59e0b",
    emColeta: "#3b82f6",
    entregue: "#10b981",
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-2xl font-black text-gray-800">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Premium */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tight">
                Command Center
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                Gerenciamento completo de operações e logística
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200">
                <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                <span className="text-xs font-black text-gray-700">
                  {new Date().toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs Grid - 8 Cards Informativos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={<Package className="w-6 h-6" />}
            title="Volume Total"
            value={`${totalVolume.toLocaleString()}t`}
            subtitle={`${materiais.length} itens`}
            color="text-blue-600"
            bgColor="bg-blue-50"
            trend="+12%"
          />
          <KPICard
            icon={<AlertCircle className="w-6 h-6" />}
            title="Pendentes"
            value={`${volumePendente.toLocaleString()}t`}
            subtitle={`${materiaisPendentes.length} materiais`}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <KPICard
            icon={<Truck className="w-6 h-6" />}
            title="Em Coleta"
            value={materiaisEmColeta.length.toString()}
            subtitle={`${materiaisEmColeta.reduce((a, m) => a + Number(m.quantidade || 0), 0)} unidades`}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <KPICard
            icon={<CheckCircle2 className="w-6 h-6" />}
            title="Entregue"
            value={`${volumeEntregue.toLocaleString()}t`}
            subtitle={`${materiaisEntregues.length} completos`}
            color="text-green-600"
            bgColor="bg-green-50"
            trend="+8%"
          />
          <KPICard
            icon={<Users className="w-6 h-6" />}
            title="Fornecedores"
            value={fornecedoresAtivos.length.toString()}
            subtitle={`${fornecedores.length} total`}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <KPICard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Eficiência"
            value={`${eficiencia}%`}
            subtitle="Taxa de sucesso"
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <KPICard
            icon={<Zap className="w-6 h-6" />}
            title="Taxa Média"
            value="2.4t"
            subtitle="Por fornecedor/dia"
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <KPICard
            icon={<Clock className="w-6 h-6" />}
            title="Tempo Médio"
            value="18h"
            subtitle="Para coleta"
            color="text-indigo-600"
            bgColor="bg-indigo-50"
          />
        </div>

        {/* Gráficos - Análise Financeira */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase italic">
            Análise de Operações
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              <CardHeader className="pb-0 border-b border-gray-100">
                <CardTitle className="text-gray-900 font-black uppercase italic">
                  Distribuição por Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#f59e0b" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value} itens`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.75rem",
                        padding: "8px 12px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-2">
                  {statusData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: Object.values(COLORS)[idx] }}
                        />
                        <span className="text-gray-600 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{item.value} itens</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Material Types */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              <CardHeader className="pb-0 border-b border-gray-100">
                <CardTitle className="text-gray-900 font-black uppercase italic">
                  Tipos de Material
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tipoMateriais}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="tipo" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      formatter={(value) => `${value} itens`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.75rem",
                        padding: "8px 12px"
                      }}
                    />
                    <Bar dataKey="quantidade" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Fornecedores Top Volume */}
          <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="pb-0 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 font-black uppercase italic flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                  Top Fornecedores por Volume
                </CardTitle>
                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Top 6
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={fornecedorVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="nome" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value) => `${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      padding: "8px 12px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="volume" fill="#10b981" radius={[8, 8, 0, 0]} name="Volume (t)" />
                  <Bar dataKey="materiais" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Materiais" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Mapa + Tabela */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden h-[450px]">
              <CardHeader className="pb-0 border-b border-gray-100">
                <CardTitle className="text-gray-900 font-black uppercase italic flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-orange-600" />
                  Mapa de Coletas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <MapContainer
                  center={[-23.5505, -46.6333]}
                  zoom={10}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {fornecedores.map((f) => {
                    const temMaterial = materiaisPendentes.some(
                      (m) => m.fornecedorId === f.id,
                    );
                    if (!temMaterial || !f.latitude || !f.longitude) return null;

                    const materialCount = materiaisPendentes.filter(
                      (m) => m.fornecedorId === f.id,
                    ).length;

                    return (
                      <React.Fragment key={f.id}>
                        <Marker
                          position={[f.latitude, f.longitude]}
                          icon={markerIcon}
                        >
                          <Popup>
                            <div className="font-sans p-2">
                              <strong className="text-orange-600 uppercase font-black text-sm">
                                {f.name}
                              </strong>
                              <br />
                              <span className="text-[10px] font-bold text-gray-600">
                                {materialCount} material(is) aguardando
                              </span>
                            </div>
                          </Popup>
                        </Marker>
                        <CircleMarker
                          center={[f.latitude, f.longitude]}
                          radius={Math.min(materialCount * 3, 20)}
                          fill
                          fillColor="#f97316"
                          fillOpacity={0.2}
                          weight={2}
                          color="#f97316"
                        />
                      </React.Fragment>
                    );
                  })}
                </MapContainer>
              </CardContent>
            </Card>
          </div>

          {/* Alertas + Estatísticas */}
          <div className="space-y-6">
            {/* Alert Card */}
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg rounded-2xl overflow-hidden text-white">
              <CardHeader className="pb-0">
                <CardTitle className="text-white font-black uppercase italic flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Alertas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur">
                  <p className="font-bold text-xs uppercase">⚠️ {materiaisPendentes.length} materiais pendentes</p>
                  <p className="text-xs opacity-90">Aguardando retirada</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur">
                  <p className="font-bold text-xs uppercase">🔄 {materiaisEmColeta.length} em rota</p>
                  <p className="text-xs opacity-90">Coletas em progresso</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur">
                  <p className="font-bold text-xs uppercase">✅ Taxa: {eficiencia}%</p>
                  <p className="text-xs opacity-90">Eficiência diária</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="pb-0 border-b border-gray-100">
                <CardTitle className="text-gray-900 font-black uppercase italic">
                  Resumo Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-bold text-gray-700">Fornecedores Ativos</span>
                  <span className="text-2xl font-black text-blue-600">{fornecedoresAtivos.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-bold text-gray-700">Entregas Hoje</span>
                  <span className="text-2xl font-black text-green-600">{materiaisEntregues.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-bold text-gray-700">Pendentes</span>
                  <span className="text-2xl font-black text-orange-600">{materiaisPendentes.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabela de Materiais */}
        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="pb-0 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-gray-900 font-black uppercase italic flex items-center gap-2">
                <Boxes className="w-5 h-5 text-blue-600" />
                Materiais Cadastrados
              </CardTitle>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Todos os Tipos</option>
                  {Array.from(new Set(materiais.map((m) => m.tipo))).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="em_coleta">Em Coleta</option>
                  <option value="entregue">Entregue</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-black text-gray-600 uppercase italic text-xs">Fornecedor</th>
                    <th className="px-4 py-3 text-left font-black text-gray-600 uppercase italic text-xs">Tipo</th>
                    <th className="px-4 py-3 text-center font-black text-gray-600 uppercase italic text-xs">Qtd</th>
                    <th className="px-4 py-3 text-left font-black text-gray-600 uppercase italic text-xs">Status</th>
                    <th className="px-4 py-3 text-left font-black text-gray-600 uppercase italic text-xs">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {materiaisFiltrados.slice(0, 10).map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {fornecedores.find((f) => f.id === m.fornecedorId)?.name || "Desconhecido"}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-black text-gray-800 italic uppercase text-sm">
                          {m.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-bold text-gray-700">{m.quantidade}{m.unidade}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-xs uppercase ${m.status === "entregue"
                            ? "bg-green-100 text-green-700"
                            : m.status === "em_coleta"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                          <span className={`w-2 h-2 rounded-full ${m.status === "entregue"
                              ? "bg-green-600"
                              : m.status === "em_coleta"
                                ? "bg-blue-600"
                                : "bg-orange-600"
                            }`} />
                          {m.status === "entregue" ? "Entregue" : m.status === "em_coleta" ? "Em Coleta" : "Pendente"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase transition-colors">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 text-xs text-gray-500 font-medium">
            <p>Mostrando {Math.min(materiaisFiltrados.length, 10)} de {materiaisFiltrados.length} materiais</p>
          </CardFooter>
        </Card>

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-700">
            <span className="font-black text-blue-600">🔄 Dashboard em Tempo Real</span> - Atualizando a cada 30 segundos
          </p>
        </div>

      </div>
    </div>
  );
};

// KPI Card Component
interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  bgColor: string;
  trend?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color,
  bgColor,
  trend,
}) => {
  return (
    <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${bgColor} ${color} rounded-xl group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          {trend && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              {trend}
            </span>
          )}
        </div>

        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
          {title}
        </p>
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 italic tracking-tighter mb-2">
          {value}
        </h3>
        <p className="text-xs text-gray-500 font-medium">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
};
{/* MAPA DE CALOR / LOGÍSTICA */ }
<div className="col-span-12 lg:col-span-8 space-y-6">
  <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl overflow-hidden h-[450px] relative border border-white/10">
    <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl border border-gray-100">
      <h4 className="flex items-center gap-2 text-[var(--color-primary)] font-black uppercase italic text-xs">
        <MapIcon size={16} /> Mapa de Coletas Disponíveis
      </h4>
    </div>
    <MapContainer
      center={[-23.5505, -46.6333]}
      zoom={10}
      className="h-full w-full rounded-[2rem]"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {fornecedores.map((f) => {
        const temMaterial = materiaisPendentes.some(
          (m) => m.fornecedorId === f.id,
        );
        if (!temMaterial || !f.latitude || !f.longitude) return null;
        return (
          <Marker
            key={f.id}
            position={[f.latitude, f.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <div className="font-sans p-1">
                <strong className="text-[var(--color-primary)] uppercase font-black">
                  {f.name}
                </strong>
                <br />
                <span className="text-[10px] font-bold text-gray-400 uppercase italic">
                  Material aguardando retirada
                </span>
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
        <BarChart3 size={18} className="text-[var(--color-primary)]" />{" "}
        Materiais Pendentes
      </h3>
      <select
        value={filtroTipo}
        onChange={(e) => setFiltroTipo(e.target.value)}
        className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase px-4 py-2 outline-none"
      >
        <option value="">Todos os Tipos</option>
        {Array.from(new Set(materiais.map((m) => m.tipo))).map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50/50">
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Fornecedor
            </th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Material
            </th>
            <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {materiaisPendentes.slice(0, 5).map((m) => (
            <tr
              key={m.id}
              className="hover:bg-orange-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-bold text-gray-700">
                {fornecedores.find((f) => f.id === m.fornecedorId)
                  ?.name || "Desconhecido"}
              </td>
              <td className="px-6 py-4">
                <span className="font-black text-gray-800 italic uppercase">
                  {m.tipo}
                </span>
                <span className="ml-2 text-[10px] text-gray-400 font-bold">
                  {m.quantidade}
                  {m.unidade}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-md text-[9px] font-black uppercase">
                  Aguardando
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

{/* COLUNA DIREITA: RELATÓRIOS E AÇÕES */ }
<div className="col-span-12 lg:col-span-4 space-y-6">
  {/* Card de Alerta do Sistema */}
  <div className="bg-[var(--color-primary-dark)] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
    <AlertCircle className="absolute -right-6 -top-6 h-32 w-32 text-black/20" />
    <h4 className="font-black uppercase italic text-sm mb-4">
      Lembrete de Hoje
    </h4>
    <p className="text-white/70 text-xs leading-relaxed mb-6">
      Existem <b>3 fornecedores</b> com material parado há mais de 48h.
      Verifique a disponibilidade de frete.
    </p>
    <Button className="w-full bg-white text-[var(--color-primary)] hover:bg-gray-100 font-black uppercase italic rounded-2xl py-6">
      Gerar Rota de Coleta
    </Button>
  </div>
</div>
      </div >
    </div >
  );
};

// Subcomponente de Card de Estatística
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) => {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-white/10 group hover:translate-y-[-5px] transition-all duration-300">
      <div
        className={cn(
          "p-3 w-fit rounded-2xl mb-4 transition-transform group-hover:scale-110",
          colors[color],
        )}
      >
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-2xl font-black text-gray-800 italic tracking-tighter">
        {value}
      </h3>
    </div>
  );
};

export default DashboardMateriaisAdmin;
