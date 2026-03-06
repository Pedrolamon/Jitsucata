
import { query } from "../database"; // Importe sua função de query
import { v4 as uuidv4 } from "uuid";

interface material {
    id: string,
    tipo: string,
}



export interface TipoMaterial {
    id?: string;
    tipo: string;
}

export async function postMaterial(dados: material) {
    const result = await query(
        `INSERT INTO "Material" (id, tipo, "dataRegistro")
         VALUES ($1, $2, NOW())
         RETURNING *`,
        [dados.id, dados.tipo]
    );
    return result.rows[0]
}

// Filtros aceitos na listagem de inventário
export interface InventoryFilters {
    busca?: string;
    status?: string;
    material?: string;
    dataInicio?: string;
    dataFim?: string;
}

// Estrutura principal de um lote em estoque
export interface InventoryItem {
    id: string;
    material: string;
    quantidade: number;
    unidade: string;
    status: string;
    ultima_entrada: string;
    patio?: string;
    fornecedorId?: string;
    notaFiscal?: string;
}

export interface NewInventoryInput {
    tipo: string;
    quantidade: number;
    unidade: string;
    fornecedorId?: string;
    observacoes?: string;
    patio?: string;
    notaFiscal?: string;
    placaVeiculo?: string;
    pesoBruto?: number;
    pesoLiquido?: number;
    contaminacao?: number;
    cambio?: number;
    preco?: number;
    dataEntrada?: string;
    status?: string;
}

export interface UpdateInventoryInput extends Partial<NewInventoryInput> { }

async function registrarMovimentacao(
    materialId: string,
    tipo: "ENTRADA" | "SAIDA" | "AJUSTE" | "TRANSFERENCIA",
    quantidade: number,
    unidade: string,
    origem?: string,
    destino?: string,
    observacao?: string
) {
    await query(
        `INSERT INTO "MovimentacaoEstoque"
         (id, "materialId", tipo, quantidade, unidade, origem, destino, observacao)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
            uuidv4(),
            materialId,
            tipo,
            quantidade,
            unidade,
            origem || null,
            destino || null,
            observacao || null
        ]
    );
}

export async function getInventory(filters: InventoryFilters = {}): Promise<InventoryItem[]> {
    const params: any[] = [];
    let where = `WHERE ativo = TRUE`;

    if (filters.busca) {
        params.push(`%${filters.busca}%`);
        where += ` AND (CAST(id AS TEXT) ILIKE $${params.length} OR tipo ILIKE $${params.length})`;
    }

    if (filters.status) {
        params.push(filters.status);
        where += ` AND status = $${params.length}`;
    }

    if (filters.material) {
        params.push(`%${filters.material}%`);
        where += ` AND tipo ILIKE $${params.length}`;
    }

    if (filters.dataInicio) {
        params.push(filters.dataInicio);
        where += ` AND "dataRegistro" >= $${params.length}`;
    }

    if (filters.dataFim) {
        params.push(filters.dataFim);
        where += ` AND "dataRegistro" <= $${params.length}`;
    }

    const result = await query(
        `
        SELECT
            id,
            tipo AS material,
            quantidade,
            unidade,
            status,
            "dataRegistro" AS "ultima_entrada",
            patio,
            "fornecedorId",
            "notaFiscal"
        FROM "Materiais"
        ${where}
        ORDER BY "dataRegistro" DESC
        `,
        params
    );

    return result.rows;
}

export async function postInventory(data: NewInventoryInput) {
    const id = uuidv4();
    const status = data.status ?? "disponivel";

    const result = await query(
        `INSERT INTO "Materiais"
         (id, "fornecedorId", tipo, quantidade, unidade, observacoes, status, "dataRegistro",
          "pesoBruto", "pesoLiquido", contaminacao, cambio, preco, patio, "notaFiscal",
          "placaVeiculo", "dataEntrada", ativo)
         VALUES
         ($1, $2, $3, $4, $5, $6, $7, NOW(),
          $8, $9, $10, $11, $12, $13, $14,
          $15, $16, TRUE)
         RETURNING *`,
        [
            id,
            data.fornecedorId || null,
            data.tipo,
            data.quantidade,
            data.unidade,
            data.observacoes || null,
            status,
            data.pesoBruto ?? null,
            data.pesoLiquido ?? null,
            data.contaminacao ?? null,
            data.cambio ?? null,
            data.preco ?? null,
            data.patio || null,
            data.notaFiscal || null,
            data.placaVeiculo || null,
            data.dataEntrada || null
        ]
    );

    // registra movimentação de entrada
    await registrarMovimentacao(
        id,
        "ENTRADA",
        data.quantidade,
        data.unidade,
        undefined,
        data.patio,
        "Entrada manual de material"
    );

    return result.rows[0];
}

export async function getMaterial() {
    const result = await query(
        `SELECT id, tipo FROM "TipoMaterial" ORDER BY tipo ASC`
    );
    return result.rows;
}

export async function patchInventory(id: string, data: UpdateInventoryInput) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (data.tipo !== undefined) {
        fields.push(`tipo = $${idx++}`);
        params.push(data.tipo);
    }
    if (data.quantidade !== undefined) {
        fields.push(`quantidade = $${idx++}`);
        params.push(data.quantidade);
    }
    if (data.unidade !== undefined) {
        fields.push(`unidade = $${idx++}`);
        params.push(data.unidade);
    }
    if (data.status !== undefined) {
        fields.push(`status = $${idx++}`);
        params.push(data.status);
    }
    if (data.observacoes !== undefined) {
        fields.push(`observacoes = $${idx++}`);
        params.push(data.observacoes);
    }
    if (data.patio !== undefined) {
        fields.push(`patio = $${idx++}`);
        params.push(data.patio);
    }
    if (data.notaFiscal !== undefined) {
        fields.push(`"notaFiscal" = $${idx++}`);
        params.push(data.notaFiscal);
    }
    if (data.placaVeiculo !== undefined) {
        fields.push(`"placaVeiculo" = $${idx++}`);
        params.push(data.placaVeiculo);
    }
    if (data.pesoBruto !== undefined) {
        fields.push(`"pesoBruto" = $${idx++}`);
        params.push(data.pesoBruto);
    }
    if (data.pesoLiquido !== undefined) {
        fields.push(`"pesoLiquido" = $${idx++}`);
        params.push(data.pesoLiquido);
    }
    if (data.contaminacao !== undefined) {
        fields.push(`contaminacao = $${idx++}`);
        params.push(data.contaminacao);
    }
    if (data.cambio !== undefined) {
        fields.push(`cambio = $${idx++}`);
        params.push(data.cambio);
    }
    if (data.preco !== undefined) {
        fields.push(`preco = $${idx++}`);
        params.push(data.preco);
    }
    if (data.dataEntrada !== undefined) {
        fields.push(`"dataEntrada" = $${idx++}`);
        params.push(data.dataEntrada);
    }

    if (fields.length === 0) {
        const current = await query(
            `SELECT id, tipo AS material, quantidade, unidade, status,
                    "dataRegistro" AS "ultima_entrada", patio, "fornecedorId", "notaFiscal"
             FROM "Materiais"
             WHERE id = $1 AND ativo = TRUE`,
            [id]
        );
        return current.rows[0];
    }

    params.push(id);

    const result = await query(
        `
        UPDATE "Materiais"
        SET ${fields.join(", ")}
        WHERE id = $${idx}
        RETURNING id, tipo AS material, quantidade, unidade, status,
                  "dataRegistro" AS "ultima_entrada", patio, "fornecedorId", "notaFiscal"
        `,
        params
    );

    return result.rows[0];
}

export async function deleteInventory(id: string) {
    await query(
        `UPDATE "Materiais"
         SET ativo = FALSE
         WHERE id = $1`,
        [id]
    );
    return true;
}