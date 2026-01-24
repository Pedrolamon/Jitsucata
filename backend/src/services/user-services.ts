import { v4 as uuidv4 } from 'uuid';
import { query } from '../database';
import { QueryResult } from 'pg';
import { Fornecedor } from '../types/express';

const FORNECEDOR_SELECT_FIELDS = `
    name, cnpj, stateRegistration, address, EnvironmentalLicense, LegalRepresentative,
    Phone, capacity, email, observacoes, legalNature, password, status
`;

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    isActive: boolean;
    status: boolean;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const sql = `SELECT ${FORNECEDOR_SELECT_FIELDS} FROM "Fornecedores" WHERE email = $1`;
    const result: QueryResult<User> = await query(sql, [email]);
    return result.rows.length ? result.rows[0] : null;
}

export async function findUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const fieldsWithoutPassword = FORNECEDOR_SELECT_FIELDS.replace(', password', '');
    const sql = `SELECT ${fieldsWithoutPassword} FROM "Fornecedores" WHERE id = $1`;
    // Não inclua a coluna 'password' no resultado para o frontend
    const result: QueryResult<Omit<User, 'password'>> = await query(sql, [id]);
    return result.rows.length ? result.rows[0] : null;
}

export async function createuser(data: User) {
    const id = uuidv4();

    try {
        // Iniciamos a transação (dependendo do seu arquivo ../database, pode variar)
        await query('BEGIN');

        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(data.senha || '123456', saltRounds);

        await query(`
            INSERT INTO "User" (id, name, role, phone, email)
            VALUES ($1, $2, $3, $4, $5)`,
            [ids.representative, data.LegalRepresentative.name, data.LegalRepresentative.cpf,
            data.LegalRepresentative.rg, data.LegalRepresentative.position,
            data.LegalRepresentative.phone, data.LegalRepresentative.email]
        );


        await query('COMMIT');
        return result.rows[0];

    } catch (error) {
        await query('ROLLBACK');
        console.error("Erro ao criar fornecedor completo:", error);
        throw error;
    }
}
