import { v4 as uuidv4 } from 'uuid';
import { query } from '../database.js';
import { QueryResult } from 'pg';
import { Perfil, Usuario } from '../types/express.js';

import bcrypt from "bcrypt"

const USER_SELECT_FIELDS = `
    id, nome, perfil, email, senha, criado_at
`;

const USER_SELECT_FIELD = `
    id, email, senha
`;


export async function findUserByEmail(email: string): Promise<Usuario | null> {
    const sql = `SELECT ${USER_SELECT_FIELD} FROM "User" WHERE email = $1`;
    const result: QueryResult<Usuario> = await query(sql, [email]);
    return result.rows.length ? result.rows[0] : null;
}

// Função que procura em User e Fornecedores (para login de ambos)
export async function findUserByEmailAnyTable(email: string): Promise<(Usuario & { table: string; role?: string }) | null> {
    try {
        // Tenta procurar na tabela User primeiro
        const userSql = `SELECT id, email, senha as password, perfil as role, 'User' as table FROM "User" WHERE email = $1`;
        const userResult: QueryResult<any> = await query(userSql, [email]);

        if (userResult.rows.length) {
            return {
                ...userResult.rows[0],
                table: 'User',
                role: userResult.rows[0].role || 'admin'
            };
        }

        // Se não encontrou em User, procura em Fornecedores
        const supplierSql = `SELECT id, email, password, 'Fornecedor' as role, status, 'Fornecedores' as table FROM "Fornecedores" WHERE email = $1`;
        const supplierResult: QueryResult<any> = await query(supplierSql, [email]);

        if (supplierResult.rows.length) {
            return {
                ...supplierResult.rows[0],
                table: 'Fornecedores',
                role: 'fornecedor'
            };
        }

        return null;
    } catch (error) {
        console.error("Erro ao procurar usuário:", error);
        return null;
    }
}

export async function findUserById(id: string): Promise<Omit<Usuario, 'password'> | null> {
    const fieldsWithoutPassword = USER_SELECT_FIELDS.replace(', senha', '');
    const sql = `SELECT ${fieldsWithoutPassword} FROM "User" WHERE id = $1`;
    const result: QueryResult<Omit<Usuario, 'senha'>> = await query(sql, [id]);
    return result.rows.length ? result.rows[0] : null;
}

export async function createuser(data: Usuario) {
    const id = uuidv4();

    try {
        await query('BEGIN');
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(data.password || '123456', saltRounds);

        const result = await query(
            `INSERT INTO "User" (id, nome, perfil, email, senha)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, nome, email, perfil`,
            [id, data.nome, data.role, data.email, data.password ? senhaHash : null]
        );
        await query('COMMIT');
        return result.rows[0];

    } catch (error) {
        await query('ROLLBACK');
        console.error("Erro ao criar fornecedor completo:", error);
        throw error;
    }
}

export async function listarUsuarios(): Promise<Usuario[]> {
    const result = await query('SELECT id, nome, email, perfil FROM "User" ORDER BY nome ASC');
    return result.rows;
}

export async function editarUsuario(id: string, data: Partial<Usuario>) {
    const sql = `UPDATE "User" SET nome = $1, email = $2, perfil = $3 WHERE id = $4`;
    await query(sql, [data.nome, data.email, data.role, id]);
}

export async function excluirUsuario(id: string) {
    await query('DELETE FROM "User" WHERE id = $1', [id]);
}

export async function listarPerfis(): Promise<Perfil[]> {
    return ['admin', 'fornecedor', 'financeiro'];
}

export async function trocarSenha(id: string, novaSenha: string) {
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await query('UPDATE "User" SET senha = $1 WHERE id = $2', [senhaHash, id]);
}
