import { query } from "../database"; // Importe sua função de query
import { v4 as uuidv4 } from "uuid";

interface material {
    id: string,
    tipo: string,
}

export async function getInventory() {
    const result = await query(
        ``
    );
    return result.rows
}

export async function postInventory() {

}

export async function postMaterial(dados: material) {
    const result = await query(
        `INSERT INTO "Material" (id, tipo, "dataRegistro")
         VALUES ($1, $2, NOW())
         RETURNING *`,
        [dados.id, dados.tipo]
    );
    return result.rows[0];
}

export async function getMaterial() {
    const result = await query(
        `SELECT id, tipo, quantidade, progresso, status FROM "Material" ORDER BY tipo ASC`
    );
    return result.rows;
}

export async function patchInventory() {
    return
}

export async function deleteInventory() {
    return
}