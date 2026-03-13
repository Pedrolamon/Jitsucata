import { Router, Request, Response } from "express"
import { getInventory, deleteInventory, patchInventory, postInventory, postMaterial, getMaterial } from "../services/inventory-services.js"
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get("/materiais", async (req: Request, res: Response) => {
    try {
        const inventory = await getInventory();
        return res.json(inventory)
    } catch (error) {
        res.status(500).json({ message: "erro ao buscar inventario" })

        const { busca, status, material, dataInicio, dataFim } = req.query;
        const inventory = await getInventory({
            busca: busca as string | undefined,
            status: status as string | undefined,
            material: material as string | undefined,
            dataInicio: dataInicio as string | undefined,
            dataFim: dataFim as string | undefined
        });
        return res.json(inventory);
    }
});

router.post("/materiais", async (req: Request, res: Response) => {
    try {
        // 1. Chama a função que realmente salva no banco (postInventory)
        const novoMaterial = await postInventory(req.body);

        // 2. Se deu certo, retorna o status 201 (Created) com o objeto criado
        return res.status(201).json({
            message: "Material adicionado ao estoque com sucesso",
            data: novoMaterial
        });

    } catch (error) {
        // 3. Se houver erro (banco fora, dados inválidos), cai aqui
        console.error("Erro ao adicionar material:", error);

        return res.status(500).json({
            message: "Erro ao adicionar material ao estoque",
            error: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
});

router.post('/material', async (req: Request, res: Response) => {
    try {
        const { tipo } = req.body

        const novoMaterial = { tipo: tipo, id: uuidv4() }
        const material = await postMaterial(novoMaterial);
        res.status(201).json(material);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao cadastrar o material", error })
    }

});

router.get("/material", async (req: Request, res: Response) => {
    try {
        const material = await getMaterial();
        return res.json(material)
    } catch (error) {
        res.status(500).json({ message: "erro ao buscar inventario" })
    }
});

router.patch("/materiais/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const atualizado = await patchInventory(id, req.body);
        return res.json(atualizado);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar material do estoque" });
    }
});

router.delete("/materiais/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteInventory(id);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao remover material do estoque" });
    }
});

export default router