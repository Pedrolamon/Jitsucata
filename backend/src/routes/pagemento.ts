import { Request, Response, Router } from "express";
import {
  getPagamentos,
  getPagamentosByFornecedor,
  getPagamentoById,
  getPagamentosByStatus,
  postPagamento,
  updatePagamento,
  deletePagamento,
  getResumoFinanceiro,
} from "../services/pagamentos-services";

const router = Router();

// LISTAR TODOS OS PAGAMENTOS
router.get("/pagamentos", async (req: Request, res: Response) => {
  try {
    const pagamentos = await getPagamentos();
    return res.json(pagamentos);
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    res.status(500).json({ message: "Erro ao buscar pagamentos" });
  }
});

// LISTAR PAGAMENTOS POR STATUS
router.get("/pagamentos/status/:status", async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const pagamentos = await getPagamentosByStatus(status);
    return res.json(pagamentos);
  } catch (error) {
    console.error("Erro ao buscar pagamentos por status:", error);
    res.status(500).json({ message: "Erro ao buscar pagamentos por status" });
  }
});

// LISTAR PAGAMENTOS DE UM FORNECEDOR
router.get("/pagamentos/fornecedor/:fornecedor_id", async (req: Request, res: Response) => {
  try {
    const { fornecedor_id } = req.params;
    const pagamentos = await getPagamentosByFornecedor(fornecedor_id);
    return res.json(pagamentos);
  } catch (error) {
    console.error("Erro ao buscar pagamentos do fornecedor:", error);
    res.status(500).json({ message: "Erro ao buscar pagamentos do fornecedor" });
  }
});

// OBTER DETALHES DE UM PAGAMENTO
router.get("/pagamentos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pagamento = await getPagamentoById(id);
    if (!pagamento) {
      return res.status(404).json({ message: "Pagamento não encontrado" });
    }
    return res.json(pagamento);
  } catch (error) {
    console.error("Erro ao buscar pagamento:", error);
    res.status(500).json({ message: "Erro ao buscar pagamento" });
  }
});

// OBTER RESUMO FINANCEIRO
router.get("/pagamentos/resumo/geral", async (req: Request, res: Response) => {
  try {
    const resumo = await getResumoFinanceiro();
    return res.json(resumo);
  } catch (error) {
    console.error("Erro ao buscar resumo financeiro:", error);
    res.status(500).json({ message: "Erro ao buscar resumo financeiro" });
  }
});

// CRIAR NOVO PAGAMENTO
router.post("/pagamentos", async (req: Request, res: Response) => {
  try {
    const { fornecedor_id, fornecedor_nome, material, valor, data_pagamento, status, metodo_pagamento, descricao } = req.body;

    if (!fornecedor_id || !material || !valor || !data_pagamento) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    const pagamento = await postPagamento({
      fornecedor_id,
      fornecedor_nome,
      material,
      valor,
      data_pagamento,
      status,
      metodo_pagamento,
      descricao,
    });

    return res.status(201).json(pagamento);
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ message: "Erro ao criar pagamento" });
  }
});

// ATUALIZAR PAGAMENTO
router.patch("/pagamentos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, metodo_pagamento, valor, data_pagamento, descricao } = req.body;

    const pagamento = await updatePagamento(id, {
      status,
      metodo_pagamento,
      valor,
      data_pagamento,
      descricao,
    });

    if (!pagamento) {
      return res.status(404).json({ message: "Pagamento não encontrado" });
    }

    return res.status(200).json(pagamento);
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error);
    res.status(500).json({ message: "Erro ao atualizar pagamento" });
  }
});

// DELETAR PAGAMENTO
router.delete("/pagamentos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deletePagamento(id);
    return res.status(200).json({ message: "Pagamento deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pagamento:", error);
    res.status(500).json({ message: "Erro ao deletar pagamento" });
  }
});

export default router;
