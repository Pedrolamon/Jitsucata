let metas: { tipo: string; quantidade: number }[] = [
  { tipo: 'Sucata Mista', quantidade: 5 },
  { tipo: 'Cavaco', quantidade: 3 },
];

let alertasAtivos: { tipo: string; quantidade: number; atingidoEm: string; lido?: boolean }[] = [];
let historicoAlertas: { tipo: string; quantidade: number; atingidoEm: string; lido: boolean }[] = [];

export const definirMeta = (tipo: string, quantidade: number) => {
  const idx = metas.findIndex(m => m.tipo === tipo);
  if (idx >= 0) metas[idx].quantidade = quantidade;
  else metas.push({ tipo, quantidade });
};

export const listarMetas = () => metas;

export const verificarAlertas = (materiais: { tipo: string; quantidade: number }[]) => {
  alertasAtivos = [];
  metas.forEach(meta => {
    const total = materiais.filter(m => m.tipo === meta.tipo).reduce((sum, m) => sum + m.quantidade, 0);
    if (total >= meta.quantidade) {
      // Só cria novo alerta se não existe igual não lido
      const jaExiste = historicoAlertas.some(a => a.tipo === meta.tipo && a.quantidade === total && !a.lido);
      if (!jaExiste) {
        const alerta = { tipo: meta.tipo, quantidade: total, atingidoEm: new Date().toISOString(), lido: false };
        alertasAtivos.push(alerta);
        historicoAlertas.push(alerta);
      }
    }
  });
};

export const listarAlertasAtivos = () => historicoAlertas.filter(a => !a.lido);
export const listarHistoricoAlertas = () => historicoAlertas;
export const marcarAlertaComoLido = (tipo: string, quantidade: number, atingidoEm: string) => {
  const alerta = historicoAlertas.find(a => a.tipo === tipo && a.quantidade === quantidade && a.atingidoEm === atingidoEm);
  if (alerta) alerta.lido = true;
}; 