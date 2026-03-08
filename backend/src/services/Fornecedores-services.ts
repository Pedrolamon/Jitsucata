import { v4 as uuidv4 } from 'uuid';
import { query, pool } from '../database';
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
export async function getAllActiveSuppliers() {
  try {
    const sql = `
    SELECT 
      f.id, f.name, f.cnpj, f."stateRegistration", f.email, f."phone" as "Phone", 
      f.capacity, f.observacoes, f.status, f."legalNature", f."criadoEm",
      json_build_object(
        'street', e.street, 'number', e.number, 'neighborhood', e.neighborhood,
        'city', e.city, 'state', e.state, 'cep', e.cep, 'complement', e.complement
      ) as address,
      json_build_object(
        'numero', l.numero, 'IssuingBody', l."issuingBody", 'validity', l.validity
      ) as "EnvironmentalLicense",
      json_build_object(
        'name', r.name, 'cpf', r.cpf, 'rg', r.rg, 
        'position', r.position, 'phone', r.phone, 'email', r.email
      ) as "LegalRepresentative"
    FROM "Fornecedores" f
    INNER JOIN "Enderecos" e ON f.address_id = e.id
    LEFT JOIN "LicencasAmbientais" l ON f.license_id = l.id
    LEFT JOIN "RepresentantesLegais" r ON f.representative_id = r.id
    WHERE f.status = true 
    ORDER BY f.name ASC
  `;
    const result = await query(sql);
    return result.rows;
  } catch (error) {
    console.error("❌ ERRO NA QUERY SQL:", error);
    throw error;
  }
}

export async function createsupplier(data: Fornecedor) {
  const ids = {
    fornecedor: uuidv4(),
    address: uuidv4(),
    license: uuidv4(),
    representative: uuidv4()
  };

  try {
    // Iniciamos a transação (dependendo do seu arquivo ../database, pode variar)
    await query('BEGIN');

    // 1. Inserir Endereço
    await query(`
            INSERT INTO "Enderecos" (id, street, number, neighborhood, city, state, cep, complement, latitude, longitude)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [ids.address, data.address.street, data.address.number, data.address.neighborhood,
      data.address.city, data.address.state, data.address.cep, data.address.complement,
      data.address.latitude, data.address.longitude]
    );

    // 2. Inserir Licença Ambiental
    await query(`
            INSERT INTO "LicencasAmbientais" (id, numero, "issuingBody", validity)
            VALUES ($1, $2, $3, $4)`,
      [ids.license, data.EnvironmentalLicense.numero, data.EnvironmentalLicense.IssuingBody, data.EnvironmentalLicense.validity]
    );

    // 3. Inserir Representante Legal
    await query(`
            INSERT INTO "RepresentantesLegais" (id, name, cpf, rg, position, phone, email)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [ids.representative, data.LegalRepresentative.name, data.LegalRepresentative.cpf,
      data.LegalRepresentative.rg, data.LegalRepresentative.position,
      data.LegalRepresentative.phone, data.LegalRepresentative.email]
    );

    // 4. Inserir Fornecedor (Vinculando os IDs anteriores)
    const sqlFornecedor = `
            INSERT INTO "Fornecedores" (
                id, name, cnpj, "stateRegistration", email, phone, capacity, 
                "legalNature", password, status, address_id, license_id, representative_id, observacoes
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id, name, cnpj;
        `;

    const result = await query(sqlFornecedor, [
      ids.fornecedor, data.name, data.cnpj, data.stateRegistration, data.email,
      data.Phone, data.capacity, data.legalNature, data.password, false,
      ids.address, ids.license, ids.representative, data.observacoes
    ]);

    await query('COMMIT');
    return result.rows[0];

  } catch (error) {
    await query('ROLLBACK');
    console.error("Erro ao criar fornecedor completo:", error);
    throw error;
  }
}


export async function getPendingSuppliers() {
  const sql = `
      SELECT 
        f.*,
        json_build_object(
          'street', e.street, 'number', e.number, 'neighborhood', e.neighborhood,
          'city', e.city, 'state', e.state, 'cep', e.cep, 'complement', e.complement
        ) as address,
        json_build_object(
          'numero', l.numero, 'IssuingBody', l."issuingBody", 'validity', l.validity
        ) as "EnvironmentalLicense",
        json_build_object(
          'name', r.name, 'cpf', r.cpf, 'phone', r.phone, 'position', r.position
        ) as "LegalRepresentative"
      FROM "Fornecedores" f
      INNER JOIN "Enderecos" e ON f.address_id = e.id
      LEFT JOIN "LicencasAmbientais" l ON f.license_id = l.id
      LEFT JOIN "RepresentantesLegais" r ON f.representative_id = r.id
      WHERE f.status = false -- Fornecedores ainda não aprovados
      ORDER BY f."criadoEm" DESC
    `;
  const result = await query(sql);
  return result.rows;
}

// Aprovar um fornecedor (mudar status para true)
export async function approveSupplier(id: string) {
  const sql = `UPDATE "Fornecedores" SET status = true WHERE id = $1 RETURNING id, name, status`;
  const result = await query(sql, [id]);
  return result.rows[0];
}

export async function deleteSupplier(id: string) {
  const sql = `DELETE FROM "Fornecedores" WHERE id = $1 AND status = false`;
  const result = await query(sql, [id]);
  return (result.rowCount ?? 0) > 0; // retorna true se algo foi deletado
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const sql = `SELECT ${FORNECEDOR_SELECT_FIELDS} FROM "Fornecedores" WHERE email = $1`;
  const result: QueryResult<User> = await query(sql, [email]);
  return result.rows.length ? result.rows[0] : null;
}

export async function findUserById(id: string) {
  try {
    const sql = `
        SELECT 
          f.id, f.name, f.cnpj, f."stateRegistration", f.email, f.phone as "Phone", 
          f.capacity, f.observacoes, f.status, f."legalNature",
          json_build_object(
            'street', e.street, 'number', e.number, 'neighborhood', e.neighborhood,
            'city', e.city, 'state', e.state, 'cep', e.cep, 'complement', e.complement
          ) as address,
          json_build_object(
            'numero', l.numero, 'IssuingBody', l."issuingBody", 'validity', l.validity
          ) as "EnvironmentalLicense",
          json_build_object(
            'name', r.name, 'cpf', r.cpf, 'rg', r.rg, 
            'position', r.position, 'phone', r.phone, 'email', r.email
          ) as "LegalRepresentative"
        FROM "Fornecedores" f
        INNER JOIN "Enderecos" e ON f.address_id = e.id
        LEFT JOIN "LicencasAmbientais" l ON f.license_id = l.id
        LEFT JOIN "RepresentantesLegais" r ON f.representative_id = r.id
        WHERE f.id = $1
      `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ Erro ao buscar fornecedor por ID:", error);
    throw error;
  }
}

export async function getSupplierPrices() {
  try {
    // Ajuste o nome da tabela conforme o seu banco (ex: "Produtos" ou "TabelaPrecos")
    const sql = `
            SELECT nome, preco 
            FROM "Precos" 
            ORDER BY nome ASC
        `;
    const result = await query(sql);
    return result.rows; // Retorna o Array [{nome: "...", preco: 0}, ...]
  } catch (error) {
    console.error("❌ Erro ao buscar preços no banco:", error);
    throw error;
  }
}


export const updateSupplier = async (id: string, data: any) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Atualizar Endereço (Usando address_id conforme seu INSERT)
    await client.query(`
        UPDATE "Enderecos" SET 
          street = $1, number = $2, neighborhood = $3, city = $4, 
          state = $5, cep = $6, complement = $7
        WHERE id = (SELECT address_id FROM "Fornecedores" WHERE id = $8)
      `, [
      data.address.street, data.address.number, data.address.neighborhood,
      data.address.city, data.address.state, data.address.cep,
      data.address.complement, id
    ]);

    // 2. Atualizar Licença Ambiental (Usando license_id)
    await client.query(`
        UPDATE "LicencasAmbientais" SET 
          numero = $1, "issuingBody" = $2, validity = $3
        WHERE id = (SELECT license_id FROM "Fornecedores" WHERE id = $4)
      `, [
      data.EnvironmentalLicense.numero,
      data.EnvironmentalLicense.IssuingBody,
      data.EnvironmentalLicense.validity,
      id
    ]);

    // 3. Atualizar Representante Legal (Usando representative_id)
    await client.query(`
        UPDATE "RepresentantesLegais" SET 
          name = $1, cpf = $2, rg = $3, position = $4, phone = $5, email = $6
        WHERE id = (SELECT representative_id FROM "Fornecedores" WHERE id = $7)
      `, [
      data.LegalRepresentative.name, data.LegalRepresentative.cpf,
      data.LegalRepresentative.rg, data.LegalRepresentative.position,
      data.LegalRepresentative.phone, data.LegalRepresentative.email, id
    ]);

    // 4. Atualizar Fornecedor
    const result = await client.query(`
        UPDATE "Fornecedores" SET 
          name = $1, cnpj = $2, email = $3, phone = $4, 
          capacity = $5, "stateRegistration" = $6, "legalNature" = $7, observacoes = $8
        WHERE id = $9
        RETURNING *
      `, [
      data.name, data.cnpj, data.email, data.Phone,
      data.capacity, data.stateRegistration, data.legalNature, data.observacoes, id
    ]);

    await client.query('COMMIT');
    return result.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Erro no updateSupplier:", error);
    throw error;
  } finally {
    client.release();
  }
};