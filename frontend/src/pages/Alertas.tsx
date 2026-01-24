import  { useState } from 'react';
import { listarHistoricoAlertas, marcarAlertaComoLido } from '../services/alertas';

const Alertas = () => {
  const [alertas, setAlertas] = useState(() => listarHistoricoAlertas());

  const handleLer = (a: any) => {
    marcarAlertaComoLido(a.tipo, a.quantidade, a.atingidoEm);
    setAlertas([...listarHistoricoAlertas()]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Histórico de Alertas</h2>
      {alertas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Nenhum alerta registrado.</div>
      ) : (
        <ul>
          {alertas.map((a, idx) => (
            <li key={idx} className={`mb-4 p-4 rounded border-l-4 ${a.lido ? 'bg-gray-100 border-gray-400 text-gray-600' : 'bg-yellow-100 border-yellow-500 text-yellow-800'}`}>
              <div><b>Tipo:</b> {a.tipo}</div>
              <div><b>Total disponível:</b> {a.quantidade}</div>
              <div><b>Atingido em:</b> {new Date(a.atingidoEm).toLocaleString()}</div>
              <div><b>Status:</b> {a.lido ? 'Lido/Resolvido' : 'Ativo'}</div>
              {!a.lido && (
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" onClick={() => handleLer(a)}>Marcar como lido</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Alertas; 