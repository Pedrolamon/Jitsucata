import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRota, editarRota, atualizarPontoRota } from '../../services/rotas';
import type { Rota, PontoRota } from '../../services/rotas';
import { listarFornecedores } from '../../services/fornecedores';
import type { Fornecedor } from '../../types/fornecedor';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

type StatusKey = 'em planejamento' | 'agendada' | 'em andamento' | 'concluída' | 'cancelada';

const statusLabels: Record<StatusKey, string> = {
  'em planejamento': 'Em Planejamento',
  'agendada': 'Agendada',
  'em andamento': 'Em Andamento',
  'concluída': 'Concluída',
  'cancelada': 'Cancelada',
};

const statusOptions: StatusKey[] = [
  'em planejamento',
  'agendada',
  'em andamento',
  'concluída',
  'cancelada',
];

function ColetaModal({ open, onClose, ponto, onRegistrar }: { open: boolean, onClose: () => void, ponto: PontoRota | null, onRegistrar: (dados: any) => void }) {
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (open) {
      setQuantidade('');
      setObservacoes('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantidade || isNaN(Number(quantidade))) return;
    onRegistrar({ status: 'coletado', quantidadeColetada: Number(quantidade), observacoesColeta: observacoes, dataHoraColeta: new Date().toISOString() });
  };

  if (!open || !ponto) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>x</button>
        <h3 className="text-xl font-bold mb-2">Registrar Coleta</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-2"><b>Ponto:</b> {ponto.fornecedorId}</div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Quantidade Coletada *</label>
            <input value={quantidade} onChange={e => setQuantidade(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Observações</label>
            <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} className="w-full border rounded px-3 py-2" rows={2} />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={onClose}>Cancelar</button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const DetalhesRota = () => {
  const { id } = useParams();
  const [rota, setRota] = useState<Rota | null>(null);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoRota | null>(null);

  useEffect(() => {
    Promise.all([getRota(id!), listarFornecedores()]).then(([r, forn]) => {
      setRota(r);
      setFornecedores(forn);
      setStatus(r.status);
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!rota) return;
    setStatus(e.target.value);
    await editarRota(rota.id, { status: e.target.value });
    setRota({ ...rota, status: e.target.value });
  };

  const abrirModal = (ponto: PontoRota) => {
    setPontoSelecionado(ponto);
    setModalOpen(true);
  };
  const fecharModal = () => {
    setPontoSelecionado(null);
    setModalOpen(false);
  };
  const registrarColeta = async (dados: any) => {
    if (!pontoSelecionado) return;
    await atualizarPontoRota(pontoSelecionado.id, dados);
    if (rota) {
      const novaRota = await getRota(rota.id);
      setRota(novaRota);
    }
    fecharModal();
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (!rota) return <div className="text-center py-8 text-red-500">Rota não encontrada.</div>;

  const pontos = rota.pontos.sort((a, b) => a.ordem - b.ordem);
  // Buscar coordenadas reais dos fornecedores
  const coords = pontos
    .map(p => fornecedores.find(f => f.id === p.fornecedorId))
    .filter(f => f && f.latitude && f.longitude)
    .map(f => [f!.latitude!, f!.longitude!] as [number, number]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Detalhes da Rota</h2>
      <div className="mb-4">
        <b>Nome:</b> {rota.nome}
      </div>
      <div className="mb-4">
        <b>Status:</b> {' '}
        <select value={status} onChange={handleStatusChange} className="border rounded px-2 py-1">
          {statusOptions.map(opt => <option key={opt} value={opt}>{statusLabels[opt]}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <b>Data de Criação:</b> {new Date(rota.dataCriacao).toLocaleString()}
      </div>
      <div className="mb-4">
        <b>Pontos da Rota (Ordem):</b>
        <ol className="list-decimal ml-6 mt-2">
          {pontos.map((f) => (
            <li key={f.id} className="mb-2">
              <div className="flex items-center gap-2">
                <span>{f.fornecedorId} (ordem {f.ordem + 1})</span>
                {f.status === 'pendente' ? (
                  <button className="ml-2 text-green-600 hover:underline" onClick={() => abrirModal(f)}>Registrar Coleta</button>
                ) : (
                  <span className="ml-2 text-green-700">Coletado</span>
                )}
              </div>
              {f.status === 'coletado' && (
                <div className="ml-4 text-sm text-gray-700">
                  <div>Quantidade: {f.quantidadeColetada}</div>
                  {f.observacoesColeta && <div>Obs: {f.observacoesColeta}</div>}
                  <div>Data/Hora: {f.dataHoraColeta && new Date(f.dataHoraColeta).toLocaleString()}</div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="mb-4 font-semibold">Visualização no Mapa</div>
      <div className="h-96 rounded overflow-hidden">
        <MapContainer center={coords[0] || [-23.55, -46.63]} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {coords.map((pos, idx) => (
            <Marker key={idx} position={pos} icon={markerIcon}>
              <Popup>Ponto {idx + 1}</Popup>
            </Marker>
          ))}
          {coords.length > 1 && <Polyline positions={coords} color="blue" />}
        </MapContainer>
      </div>
      <ColetaModal open={modalOpen} onClose={fecharModal} ponto={pontoSelecionado} onRegistrar={registrarColeta} />
    </div>
  );
};

export default DetalhesRota; 