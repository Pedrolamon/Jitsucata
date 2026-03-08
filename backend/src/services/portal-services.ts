import { query } from "../database";
import { v4 as uuidv4 } from "uuid";

// retorna os preços (mesmo que getAllPrices, mas exposto para fornecedor)
export async function getPrices() {
    const result = await query('SELECT nome, preco FROM "TabelaPrecos" ORDER BY nome ASC');
    return result.rows;
}

// inventário específico de um fornecedor
export async function getInventoryForSupplier(fornecedorId: string) {
    const result = await query(
        `SELECT * FROM "Materiais" WHERE "fornecedorId" = $1 AND ativo = TRUE ORDER BY "dataRegistro" DESC`,
        [fornecedorId]
    );
    return result.rows;
}

// adiciona entrada e calcula preço médio utilizando tabela resumo
export async function addStockEntry(
    fornecedorId: string,
    data: { tipo: string; quantidade: number; unidade: string; preco: number; patio?: string; notaFiscal?: string; placaVeiculo?: string; observacoes?: string; dataEntrada: Date }
) {
    // atualiza tabela de resumo
    const existing = await query(
        `SELECT quantidade, preco_medio FROM "EstoqueFornecedores" WHERE "fornecedorId" = $1 AND tipo = $2`,
        [fornecedorId, data.tipo]
    );

    let novoPrecoMedio = data.preco;
    let novaQuantidade = data.quantidade;
    if (existing.rows.length) {
        const { quantidade: qtdAtual, preco_medio: precoAtual } = existing.rows[0];
        const valorAtual = parseFloat(qtdAtual) * parseFloat(precoAtual);
        const valorEntrada = data.quantidade * data.preco;
        novaQuantidade = parseFloat(qtdAtual) + data.quantidade;
        novoPrecoMedio = novaQuantidade > 0 ? (valorAtual + valorEntrada) / novaQuantidade : data.preco;
        await query(
            `UPDATE "EstoqueFornecedores" SET quantidade = $1, preco_medio = $2, "updatedAt" = NOW()
       WHERE "fornecedorId" = $3 AND tipo = $4`,
            [novaQuantidade, novoPrecoMedio, fornecedorId, data.tipo]
        );
    } else {
        await query(
            `INSERT INTO "EstoqueFornecedores" (id, "fornecedorId", tipo, quantidade, preco_medio)
       VALUES ($1,$2,$3,$4,$5)`,
            [uuidv4(), fornecedorId, data.tipo, data.quantidade, data.preco]
        );
    }

    // cria o material e a movimentação como já existe
    const id = uuidv4();
    const result = await query(
        `INSERT INTO "Materiais"
     (id, "fornecedorId", tipo, quantidade, unidade, observacoes, status, "dataRegistro",
      "pesoBruto", "pesoLiquido", contaminacao, cambio, preco, patio, "notaFiscal",
      "placaVeiculo", "dataEntrada", ativo)
     VALUES
     ($1,$2,$3,$4,$5,$6,'disponivel',NOW(),
      NULL,NULL,NULL,NULL,$7,$8,$9,$10,$11,TRUE)
     RETURNING *`,
        [
            id,
            fornecedorId,
            data.tipo,
            data.quantidade,
            data.unidade,
            data.observacoes || null,
            data.preco,
            data.patio || null,
            data.notaFiscal || null,
            data.placaVeiculo || null,
            data.dataEntrada || null,
        ]
    );

    // registrar movimentação
    await query(
        `INSERT INTO "MovimentacaoEstoque"
     (id, "materialId", tipo, quantidade, unidade, origem, destino, observacao)
     VALUES ($1,$2,'ENTRADA',$3,$4,$5,$6,$7)`,
        [uuidv4(), id, data.quantidade, data.unidade, null, null, 'Entrada por fornecedor']
    );

    // devolve objeto com preço médio atualizado
    return { ...result.rows[0], precoMedio: novoPrecoMedio, saldo: novaQuantidade };
}

export async function recordStockExit(
    fornecedorId: string,
    materialId: string,
    quantidade: number,
    unidade: string,
    observacao?: string
) {
    // certifica que o material pertence ao fornecedor
    const mat = await query(
        `SELECT quantidade FROM "Materiais" WHERE id = $1 AND "fornecedorId" = $2`,
        [materialId, fornecedorId]
    );
    if (!mat.rows.length) throw new Error('Material não encontrado');
    const qtdAtual = parseFloat(mat.rows[0].quantidade);
    if (qtdAtual < quantidade) throw new Error('Quantidade insuficiente');

    await query(
        `UPDATE "Materiais" SET quantidade = quantidade - $1 WHERE id = $2`,
        [quantidade, materialId]
    );

    await query(
        `INSERT INTO "MovimentacaoEstoque" (id, "materialId", tipo, quantidade, unidade, observacao)
     VALUES ($1,$2,'SAIDA',$3,$4,$5)`,
        [uuidv4(), materialId, quantidade, unidade, observacao || null]
    );
}

export async function getStockHistory(fornecedorId: string) {
    const result = await query(
        `SELECT me.*, m.tipo, m."fornecedorId" FROM "MovimentacaoEstoque" me
     JOIN "Materiais" m ON me."materialId" = m.id
     WHERE m."fornecedorId" = $1 ORDER BY me."dataRegistro" DESC`,
        [fornecedorId]
    );
    return result.rows;
}

export async function getCashflow(fornecedorId: string) {
    const result = await query(
        `SELECT * FROM "Pagamentos" WHERE fornecedor_id = $1 ORDER BY data_pagamento DESC`,
        [fornecedorId]
    );
    return result.rows;
}

export async function getMarketMaterials(filters: { state?: string; city?: string }) {
    let sql = `
    SELECT m.*, f.name, e.city, e.state
    FROM "Materiais" m
    JOIN "Fornecedores" f ON m."fornecedorId" = f.id
    LEFT JOIN "Enderecos" e ON f.address_id = e.id
    WHERE m.status = 'disponivel'
  `;
    const params: any[] = [];
    if (filters.state) {
        params.push(filters.state);
        sql += ` AND e.state = $${params.length}`;
    }
    if (filters.city) {
        params.push(filters.city);
        sql += ` AND e.city = $${params.length}`;
    }
    const result = await query(sql, params);
    return result.rows;
}
