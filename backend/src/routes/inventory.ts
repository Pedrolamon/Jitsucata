import { Router, Request, Response } from "express"
import { getInventory, deleteInventory, patchInventory, postInventory, postMaterial, getMaterial } from "../services/inventory-services"
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get("/materiais", async (req: Request, res: Response) => {
    try {
<<<<<<< HEAD
        const inventory = await getInventory();
        return res.json(inventory)
    } catch (error) {
        res.status(500).json({ message: "erro ao buscar inventario" })

=======
        const { busca, status, material, dataInicio, dataFim } = req.query;
        const inventory = await getInventory({
            busca: busca as string | undefined,
            status: status as string | undefined,
            material: material as string | undefined,
            dataInicio: dataInicio as string | undefined,
            dataFim: dataFim as string | undefined
        });
        return res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar inventário" });
>>>>>>> 67748c1f5223b794bc71d6873e60be11a17a78f2
    }
});

router.post("/materiais", async (req: Request, res: Response) => {
    try {
<<<<<<< HEAD
        const { material, quantidade, unidade, status, entrada } = req.body
        return res.status(200).json({ message: "Material adiciona ao estoque com sucesso" });
    } catch (error) {

=======
        const novoMaterial = await postInventory(req.body);
        return res.status(201).json(novoMaterial);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao adicionar material ao estoque" });
>>>>>>> 67748c1f5223b794bc71d6873e60be11a17a78f2
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

<<<<<<< HEAD
router.patch("/inventory/:id", async (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
});

router.delete("/inventory/:id", async (req: Request, res: Response) => {
    try {

    } catch (error) {

=======
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
>>>>>>> 67748c1f5223b794bc71d6873e60be11a17a78f2
    }
});









export default router