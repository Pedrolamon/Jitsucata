import { query, pool } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

export async function getAllPrices() {
    const sql = 'SELECT * FROM "TabelaPrecos" ORDER BY nome ASC';
    const result = await query(sql);
    return result.rows;
}

export async function createPrice(data: { nome: string, preco: string }) {
    const id = uuidv4();
    const sql = 'INSERT INTO "TabelaPrecos" (id, nome, preco) VALUES ($1, $2, $3) RETURNING *';
    const result = await query(sql, [id, data.nome, data.preco]);
    return result.rows[0];
}

export async function updateBulkPrices(materiais: any[]) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Loop para atualizar cada material enviado
        for (const item of materiais) {
            await client.query(
                'UPDATE "TabelaPrecos" SET preco = $1, nome = $2 WHERE id = $3',
                [item.preco, item.nome, item.id]
            );
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function deletePrice(id: string) {
    const sql = 'DELETE FROM "TabelaPrecos" WHERE id = $1';
    await query(sql, [id]);
}