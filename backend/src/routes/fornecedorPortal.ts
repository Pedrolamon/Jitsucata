import { Router, Request, Response } from "express";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import * as portal from "../services/portal-services.js";

const router = Router();

// rota pública para mercado (pode ser usada por qualquer perfil)
router.get('/materialMercado', async (req: Request, res: Response) => {
  try {
    const { state, city } = req.query;
    const list = await portal.getMarketMaterials({
      state: state as string,
      city: city as string,
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar material no mercado' });
  }
});

// todas as rotas deste arquivo exigem token de fornecedor
router.use(authenticateJWT, requireRole('fornecedor'));

// preços apenas leitura
router.get('/fornecedores/precos', async (req: Request, res: Response) => {
  try {
    const prices = await portal.getPrices();
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao recuperar tabela de preços' });
  }
});

// inventário do próprio fornecedor
router.get('/fornecedores/estoque', async (req: any, res: Response) => {
  try {
    const items = await portal.getInventoryForSupplier(req.userId);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar inventário' });
  }
});

router.post('/fornecedores/estoque/entrada', async (req: any, res: Response) => {
  try {
    const item = await portal.addStockEntry(req.userId, req.body);
    res.status(201).json(item);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Erro ao registrar entrada' });
  }
});

router.post('/fornecedores/estoque/saida', async (req: any, res: Response) => {
  try {
    const { materialId, quantidade, unidade, observacao } = req.body;
    await portal.recordStockExit(req.userId, materialId, quantidade, unidade, observacao);
    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Erro ao registrar saída' });
  }
});

router.get('/fornecedores/estoque/historico', async (req: any, res: Response) => {
  try {
    const hist = await portal.getStockHistory(req.userId);
    res.json(hist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
});

router.get('/fornecedores/financeiro', async (req: any, res: Response) => {
  try {
    const fluxo = await portal.getCashflow(req.userId);
    res.json(fluxo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar fluxo financeiro' });
  }
});



export default router;
