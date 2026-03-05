import { query } from "../database";
import { v4 as uuidv4 } from "uuid";

export interface Pagamento {
  id?: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  material: string;
  valor: number;
  data_pagamento: string;
  status?: string;
  metodo_pagamento?: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

// BUSCAR TODOS OS PAGAMENTOS
export async function getPagamentos() {
  const result = await query(
    `SELECT id, fornecedor_id, fornecedor_nome, material, valor, data_pagamento, 
            status, metodo_pagamento, descricao, created_at, updated_at 
     FROM "Pagamentos" 
     ORDER BY data_pagamento DESC`
  );
  return result.rows;
}

// BUSCAR PAGAMENTOS POR FORNECEDOR
export async function getPagamentosByFornecedor(fornecedor_id: string) {
  const result = await query(
    `SELECT id, fornecedor_id, fornecedor_nome, material, valor, data_pagamento, 
            status, metodo_pagamento, descricao, created_at, updated_at 
     FROM "Pagamentos" 
     WHERE fornecedor_id = $1
     ORDER BY data_pagamento DESC`,
    [fornecedor_id]
  );
  return result.rows;
}

// BUSCAR PAGAMENTO POR ID
export async function getPagamentoById(id: string) {
  const result = await query(
    `SELECT id, fornecedor_id, fornecedor_nome, material, valor, data_pagamento, 
            status, metodo_pagamento, descricao, created_at, updated_at 
     FROM "Pagamentos" 
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

// BUSCAR PAGAMENTOS POR STATUS
export async function getPagamentosByStatus(status: string) {
  const result = await query(
    `SELECT id, fornecedor_id, fornecedor_nome, material, valor, data_pagamento, 
            status, metodo_pagamento, descricao, created_at, updated_at 
     FROM "Pagamentos" 
     WHERE status = $1
     ORDER BY data_pagamento DESC`,
    [status]
  );
  return result.rows;
}

// CRIAR NOVO PAGAMENTO
export async function postPagamento(data: Omit<Pagamento, "id">) {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO "Pagamentos" 
     (id, fornecedor_id, fornecedor_nome, material, valor, data_pagamento, status, metodo_pagamento, descricao)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      id,
      data.fornecedor_id,
      data.fornecedor_nome,
      data.material,
      data.valor,
      data.data_pagamento,
      data.status || "agendado",
      data.metodo_pagamento || "PIX",
      data.descricao || null,
    ]
  );
  return result.rows[0];
}

// ATUALIZAR PAGAMENTO
export async function updatePagamento(id: string, data: Partial<Pagamento>) {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.status !== undefined) {
    updates.push(`status = $${paramIndex}`);
    values.push(data.status);
    paramIndex++;
  }
  if (data.metodo_pagamento !== undefined) {
    updates.push(`metodo_pagamento = $${paramIndex}`);
    values.push(data.metodo_pagamento);
    paramIndex++;
  }
  if (data.valor !== undefined) {
    updates.push(`valor = $${paramIndex}`);
    values.push(data.valor);
    paramIndex++;
  }
  if (data.data_pagamento !== undefined) {
    updates.push(`data_pagamento = $${paramIndex}`);
    values.push(data.data_pagamento);
    paramIndex++;
  }
  if (data.descricao !== undefined) {
    updates.push(`descricao = $${paramIndex}`);
    values.push(data.descricao);
    paramIndex++;
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  if (updates.length === 1) return getPagamentoById(id); // Nada para atualizar

  const result = await query(
    `UPDATE "Pagamentos" SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
}

// DELETAR PAGAMENTO
export async function deletePagamento(id: string) {
  await query("DELETE FROM \"Pagamentos\" WHERE id = $1", [id]);
  return true;
}

// OBTER RESUMO FINANCEIRO
export async function getResumoFinanceiro() {
  const result = await query(
    `SELECT 
      SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) as total_pago,
      SUM(CASE WHEN status = 'agendado' THEN valor ELSE 0 END) as total_agendado,
      SUM(CASE WHEN status = 'atrasado' THEN valor ELSE 0 END) as total_atrasado,
      COUNT(*) as total_pagamentos
     FROM "Pagamentos"`
  );
  return result.rows[0];
}
