import { Request, Response, Router } from "express";
import { getMetas, postMetas, editMetas, deleteMetas } from "../services/metas-services";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const metas = await getMetas();
        return res.json(metas)
    } catch (error) {
        res.status(500).json({ message: "Erro ao busccar as metas" })
    }
});

router.post("/meta", async (req: Request, res: Response) => {
    try {
        const { tipo, quantidade } = req.body
        const novaMeta = await postMetas({ tipo, quantidade });
        res.status(200).json({ message: "Meta criada com sucesso" })
    } catch (error) {
        res.status(500).json({ message: "Erro ao cria meta" })
    }
});

router.patch("/meta/:id", async (req: Request, res: Response) => {
    try {
        const MetaEditada = await editMetas(req.params.id);
        res.status(200).json({ message: "Meta foi atualizada com sucesso" })

    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar meta" })
    }

})

router.delete("/meta/:id", async (req: Request, res: Response) => {
    try {
        const DeleteMetas = deleteMetas(req.params.id);
        res.status(204).json({ message: "mMta atualizada com sucesso" }).send()

    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar meta" })
    }
})