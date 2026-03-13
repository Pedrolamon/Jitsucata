import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
    getAllEstados,
    initializeEstadosBrasil,
    createClassificacao,
    getAllClassificacoes,
    getClassificacaoById,
    createCondicaoPagamento,
    getAllCondicoesPagamento,
    initializeCondicoesPagamento,
    createTabelaPrecos,
    getTabelaPrecosById,
    listTabelaPrecos,
    updateTabelaPrecos,
    deleteTabelaPrecos,
    approveTabelaPrecos,
    calcularPreco,
    getHistoricoPrecos,
    getRelatorioVariacaoPrecos
} from "../services/advanced-prices-services.js";

const router = Router();

// ===== INICIALIZAÇÃO DE DADOS =====

router.post('/prices/init', async (req: Request, res: Response) => {
    try {
        await initializeEstadosBrasil();
        await initializeCondicoesPagamento();
        res.json({ message: "Dados inicializados com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao inicializar dados" });
    }
});

// ===== ESTADOS DO BRASIL =====

router.get('/prices/estados', async (req: Request, res: Response) => {
    try {
        const estados = await getAllEstados();
        res.json(estados);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar estados" });
    }
});

// ===== CLASSIFICAÇÕES DE MATERIAL =====

router.get('/prices/classificacoes', async (req: Request, res: Response) => {
    try {
        const classificacoes = await getAllClassificacoes();
        res.json(classificacoes);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar classificações" });
    }
});

router.get('/prices/classificacoes/:id', async (req: Request, res: Response) => {
    try {
        const classificacao = await getClassificacaoById(req.params.id);
        if (!classificacao) {
            return res.status(404).json({ error: "Classificação não encontrada" });
        }
        res.json(classificacao);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar classificação" });
    }
});

router.post('/prices/classificacoes', async (req: Request, res: Response) => {
    try {
        const classificacao = await createClassificacao(req.body);
        res.status(201).json(classificacao);
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar classificação" });
    }
});

// ===== CONDIÇÕES DE PAGAMENTO =====

router.get('/prices/condicoes-pagamento', async (req: Request, res: Response) => {
    try {
        const condicoes = await getAllCondicoesPagamento();
        res.json(condicoes);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar condições de pagamento" });
    }
});

router.post('/prices/condicoes-pagamento', async (req: Request, res: Response) => {
    try {
        const condicao = await createCondicaoPagamento(req.body);
        res.status(201).json(condicao);
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar condição de pagamento" });
    }
});

// ===== TABELA DE PREÇOS AVANÇADA =====

router.get('/prices/tabela', async (req: Request, res: Response) => {
    try {
        const filtros = {
            classificacao_id: req.query.classificacao_id as string,
            estado_id: req.query.estado_id as string,
            status: req.query.status as string,
        };

        const precos = await listTabelaPrecos(filtros);
        res.json(precos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar tabela de preços" });
    }
});

router.get('/prices/tabela/:id', async (req: Request, res: Response) => {
    try {
        const preco = await getTabelaPrecosById(req.params.id);
        res.json(preco);
    } catch (error) {
        res.status(404).json({ error: "Tabela de preços não encontrada" });
    }
});

router.post('/prices/tabela', async (req: Request, res: Response) => {
    try {
        // Assumindo que userId vem do middleware de autenticação, caso contrário null
        const userId = (req as any).userId || null;
        console.log("📦 Criando tabela de preços com dados:", JSON.stringify(req.body, null, 2));
        const preco = await createTabelaPrecos(req.body, userId);
        res.status(201).json(preco);
    } catch (error: any) {
        console.error("❌ Erro ao criar tabela de preços:", error);
        res.status(400).json({ error: "Erro ao criar tabela de preços", details: error.message });
    }
});

router.put('/prices/tabela/:id', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId || null;
        const preco = await updateTabelaPrecos(req.params.id, req.body, userId);
        res.json(preco);
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar tabela de preços" });
    }
});

router.post('/prices/tabela/:id/approve', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId || null;
        const preco = await approveTabelaPrecos(req.params.id, userId);
        res.json(preco);
    } catch (error) {
        res.status(400).json({ error: "Erro ao aprovar tabela de preços" });
    }
});

router.delete('/prices/tabela/:id', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId || null;
        await deleteTabelaPrecos(req.params.id, userId);
        res.status(204).send();
    } catch (error: any) {
        if (error.message && error.message.includes('não encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Erro ao deletar tabela de preços', error);
        res.status(500).json({ error: 'Erro ao deletar tabela de preços' });
    }
});

// ===== CÁLCULO DE PREÇO =====

router.post('/prices/calcular', async (req: Request, res: Response) => {
    try {
        const resultado = await calcularPreco(req.body);
        res.json(resultado);
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Erro ao calcular preço" });
    }
});

// ===== HISTÓRICO E RELATÓRIOS =====

router.get('/prices/historico/:classificacao_id', async (req: Request, res: Response) => {
    try {
        const historico = await getHistoricoPrecos(
            req.params.classificacao_id,
            req.query.estado_id as string,
            req.query.dias ? parseInt(req.query.dias as string) : undefined
        );
        res.json(historico);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico" });
    }
});

router.get('/prices/relatorio-variacao/:classificacao_id', async (req: Request, res: Response) => {
    try {
        const relatorio = await getRelatorioVariacaoPrecos(
            req.params.classificacao_id,
            req.query.estado_id as string
        );
        res.json(relatorio);
    } catch (error) {
        res.status(400).json({ error: "Erro ao gerar relatório" });
    }
});

// ===== BULK UPDATE =====


export default router;
