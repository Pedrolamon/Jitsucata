import { Router, Request, Response } from "express";
import { getAllPrices, createPrice, updateBulkPrices, deletePrice } from "../services/prices-services.js"

const router = Router();

router.get('/prices', async (req: Request, res: Response) => {
    try {
        const prices = await getAllPrices()
        res.json(prices);
    } catch (error) {
        res.status(500).json({ error: "erro ao buscar tabela de preço" })
    }
});

router.post('/prices', async (req: Request, res: Response) => {
    try {
        const novo = await createPrice(req.body);
        res.status(201).json(novo);
    } catch (error) {
        res.status(400).json({ error: "erro ao criar materiais" });
    }
});

router.put('/prices/bulk', async (req: Request, res: Response) => {
    try {
        const { materiais } = req.body;
        console.log("Valores recebidos para atualização:", JSON.stringify(materiais, null, 2));
        await updateBulkPrices(materiais);
        res.json({ message: "Tabela atualizada com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar preços" });
    }
});

router.delete('/prices/:id', async (req: Request, res: Response) => {
    try {
        await deletePrice(req.params.id);
        res.status(204).send()
    } catch (error) {
        res.status(400).json({ error: "Erro ao excluir material" });
    }
})

export default router