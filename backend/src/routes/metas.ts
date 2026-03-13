import { Request, Response, Router } from "express";
import { getMetas, postMetas, editMetas, deleteMetas } from "../services/metas-services.js";

const router = Router();

router.get("/metas", async (req: Request, res: Response) => {
    try {
        const metas = await getMetas();
        return res.json(metas)
    } catch (error) {
        res.status(500).json({ message: "Erro ao busccar as metas" })
    }
});

router.post("/metas", async (req: Request, res: Response) => {
    try {
        const { tipo, quantidade } = req.body
        const novaMeta = await postMetas({ tipo, quantidade });
        res.status(200).json({ message: "Meta criada com sucesso" })
    } catch (error) {
        res.status(500).json({ message: "Erro ao cria meta" })
    }
});

router.patch("/metas/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tipo, quantidade } = req.body;

        await editMetas(id, { tipo, quantidade });
        console.log(`${quantidade}`)

        res.status(200).json({ message: "Meta foi atualizada com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar meta" });
    }
});

router.delete("/metas/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await deleteMetas(req.params.id);
        return res.status(200).json({ message: "Meta deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar meta" });
    }
});

export default router