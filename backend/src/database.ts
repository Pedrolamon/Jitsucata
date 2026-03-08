import { Pool, QueryResult } from 'pg';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL não está definido no ambiente.");
}

export const pool = new Pool({
    connectionString: connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
});

export const syncDatabase = async () => {
    try {
        // determinamos possíveis caminhos em tempo de execução para o arquivo SQL
        const candidates = [
            path.join(process.cwd(), 'database.sql'),
            path.join(process.cwd(), 'src', 'database.sql'),
        ];

        let sqlPath: string | null = null;
        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                sqlPath = candidate;
                break;
            }
        }

        if (!sqlPath) {
            throw new Error(
                `Arquivo database.sql não encontrado. Procurei em: ${candidates.join(', ')}`
            );
        }

        console.log('Tentando ler arquivo em:', sqlPath);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        if (!sql.trim()) {
            console.warn('O arquivo database.sql está vazio, nenhuma tabela será criada.');
            return;
        }

        console.log('⏳ Criando tabelas se não existirem...');
        // o pool.query aceita múltiplas statements separadas por ';' no Postgres
        await pool.query(sql);
        console.log('✅ Tabelas verificadas/criadas com sucesso!');
    } catch (err) {
        console.error('❌ Erro ao inicializar tabelas do banco:', err);
    }
}

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
    return pool.query(text, params);
};

export const connectDB = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Conexão com o PostgreSQL bem-sucedida!');

        // Chama a sincronização logo após conectar
        await syncDatabase();

    } catch (err) {
        console.error('❌ Falha na conexão com o PostgreSQL:', err);
        throw err;
    }
};

export const closeDB = () => {
    pool.end();
    console.log('Pool de conexão do PostgreSQL encerrado.');
};