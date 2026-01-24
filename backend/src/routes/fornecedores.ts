import { Router, Request, Response } from "express";
import { Fornecedor } from "../types/express";
import { createsupplier,getPendingSuppliers, approveSupplier, deleteSupplier, findUserById, getAllActiveSuppliers, updateSupplier } from "../services/Fornecedores-services";

const router = Router();

//LISTAR FORNECEDORES PENDENTES(TELA DE APROVAÇÃO)
router.get('/fornecedores/pendentes', async (req: Request, res:Response) =>{
    try{
        const suppliers = await getPendingSuppliers();
        res.json(suppliers);
    }catch(error){
        res.status(500).json({error: "Erro ao buscar fornecedores pendentes"});
    }
});

// 1. LISTAR TODOS (GET)
router.get('/fornecedores', async (req: Request, res: Response) => {
  try {
    const suppliers = await getAllActiveSuppliers();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar fornecedores" });
  }
});

// 2. CRIAR NOVO (POST)
router.post('/fornecedores', async (req: Request, res: Response) => {
  try {
    const novoFornecedor = await createsupplier(req.body);
    res.status(201).json({ message: "Criado com sucesso", data: novoFornecedor });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar fornecedor" });
  }
});

// 3. EDITAR 
router.get('/fornecedores/:id', async (req: Request, res: Response) => {
  try {
    const suppliers = await findUserById(req.params.id);
    if(!suppliers) return res.status(404).json({error: "Fornecedor não encontrado"})
        res.json(suppliers);
  } catch (error) {
    res.status(400).json({ error: "Erro ao Buscar fornecedor" });
  }
});

// 4. Aprovar (patch)
router.patch('/fornecedores/aprovar/:id', async (req: Request, res: Response) => {
    try{
        const aprovado = await approveSupplier(req.params.id);
        if (!aprovado) return res.status(404).json({ error: "Fornecedor não encontrado" });
        res.json(aprovado);
    }catch (error) {
        res.status(500).json({ error: "Erro ao aprovar fornecedor" });
    }
})

// 5. EXCLUIR (DELETE)
router.delete('/fornecedores/:id', async (req: Request, res: Response) => {
  try {
   const deletado = await deleteSupplier(req.params.id);
        if (!deletado) return res.status(404).json({ error: "Fornecedor não encontrado ou já está ativo" });
        res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao excluir fornecedor" });
  }
});

router.put('/fornecedores/:id', async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const dadosAtualizados = req.body;
      
      const fornecedorAtualizado = await updateSupplier(id, dadosAtualizados);
      
      if (!fornecedorAtualizado) {
          return res.status(404).json({ error: "Fornecedor não encontrado para atualizar" });
      }

      res.json({ message: "Atualizado com sucesso", data: fornecedorAtualizado });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar fornecedor" });
  }
});

export default router;