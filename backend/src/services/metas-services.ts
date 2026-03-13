import { query } from "../database.js";
import { v4 as uuidv4 } from "uuid";

// Definindo a interface para o TypeScript
export interface Meta {
    id?: string;
    tipo: string;
    quantidade: number;
    progresso?: number;
    status?: string;
}

// BUSCAR TODAS AS METAS
export async function getMetas() {
    const result = await query(
        'SELECT id, tipo, quantidade, progresso, status FROM "Metas" ORDER BY tipo ASC'
    );
    return result.rows;
}

// CRIAR NOVA META
export async function postMetas(data: Omit<Meta, "id">) {
    const id = uuidv4();
    const result = await query(
        `INSERT INTO "Metas" (id, tipo, quantidade, progresso, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [id, data.tipo, data.quantidade, 0, 'ativa'] // Começa com progresso 0
    );
    return result.rows[0];
}

// EDITAR META (Aqui você pode passar o corpo da edição também)
export async function editMetas(id: string, data?: any) {
    const result = await query(
        `UPDATE "Metas" SET tipo = $1, quantidade = 2$, status = 3$ WHERE id = $4 RETURNING *`,
        [data.tipo, data.quantidade, 'concluida', id]
    );
    return result.rows[0];
}

// DELETAR META
export async function deleteMetas(id: string) {
    await query('DELETE FROM "Metas" WHERE id = $1', [id]);
    return true;
}