import { Router, Request, Response } from "express"
import { getInventory, deleteInventory, patchInventory, postInventory, postMaterial, getMaterial } from "../services/inventory-services"
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get("/materiais", async (req: Request, res: Response) => {
    try {
        const inventory = await getInventory();
        return res.json(inventory)
    } catch (error) {
        res.status(500).json({ message: "erro ao buscar inventario" })

    }
});

router.post("/materiais", async (req: Request, res: Response) => {
    try {
        const { material, quantidade, unidade, status, entrada } = req.body
        return res.status(200).json({ message: "Material adiciona ao estoque com sucesso" });
    } catch (error) {

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

router.patch("/inventory/:id", async (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
});

router.delete("/inventory/:id", async (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
});









export default router