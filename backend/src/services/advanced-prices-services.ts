import { query, pool } from '../database';
import { v4 as uuidv4 } from 'uuid';
import {
    EstadoBrasil,
    ClassificacaoMaterial,
    CondicaoPagamento,
    FaixaPreco,
    TabelaPrecosAvancada,
    HistoricoPrecos,
    AuditoriaPrecos,
    CriarTabelaPrecosRequest,
    ResultadoCalculoPreco,
    RelatorioVariacaoPrecos,
    CalculoPrecoBuscador,
    FiltroPrecos
} from '../types/preco-avancado';

// ===== ESTADOS DO BRASIL =====

export async function getAllEstados(): Promise<EstadoBrasil[]> {
    const sql = 'SELECT * FROM "EstadosBrasil" ORDER BY nome ASC';
    const result = await query(sql);
    return result.rows;
}

export async function initializeEstadosBrasil(): Promise<void> {
    const estadosBrasil = [
        { sigla: 'AC', nome: 'Acre', regiao: 'Norte' },
        { sigla: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
        { sigla: 'AP', nome: 'Amapá', regiao: 'Norte' },
        { sigla: 'AM', nome: 'Amazonas', regiao: 'Norte' },
        { sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
        { sigla: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
        { sigla: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
        { sigla: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
        { sigla: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
        { sigla: 'MA', nome: 'Maranhão', regiao: 'Nordeste' },
        { sigla: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
        { sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
        { sigla: 'PA', nome: 'Pará', regiao: 'Norte' },
        { sigla: 'PB', nome: 'Paraíba', regiao: 'Nordeste' },
        { sigla: 'PR', nome: 'Paraná', regiao: 'Sul' },
        { sigla: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
        { sigla: 'PI', nome: 'Piauí', regiao: 'Nordeste' },
        { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
        { sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
        { sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
        { sigla: 'RO', nome: 'Rondônia', regiao: 'Norte' },
        { sigla: 'RR', nome: 'Roraima', regiao: 'Norte' },
        { sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
        { sigla: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },
        { sigla: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
        { sigla: 'TO', nome: 'Tocantins', regiao: 'Norte' },
    ];

    for (const estado of estadosBrasil) {
        const existsCheck = 'SELECT id FROM "EstadosBrasil" WHERE sigla = $1';
        const checkResult = await query(existsCheck, [estado.sigla]);

        if (checkResult.rows.length === 0) {
            const id = uuidv4();
            const insertSql = 'INSERT INTO "EstadosBrasil" (id, sigla, nome, regiao) VALUES ($1, $2, $3, $4)';
            await query(insertSql, [id, estado.sigla, estado.nome, estado.regiao]);
        }
    }
}

// ===== CLASSIFICAÇÕES DE MATERIAL =====

export async function createClassificacao(data: {
    nome: string;
    descricao?: string;
    categoria?: string;
}): Promise<ClassificacaoMaterial> {
    const id = uuidv4();
    const sql = `INSERT INTO "ClassificacoesMaterial" (id, nome, descricao, categoria) 
               VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await query(sql, [id, data.nome, data.descricao, data.categoria]);
    return result.rows[0];
}

export async function getAllClassificacoes(): Promise<ClassificacaoMaterial[]> {
    const sql = 'SELECT * FROM "ClassificacoesMaterial" ORDER BY nome ASC';
    const result = await query(sql);
    return result.rows;
}

export async function getClassificacaoById(id: string): Promise<ClassificacaoMaterial | null> {
    const sql = 'SELECT * FROM "ClassificacoesMaterial" WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
}

// ===== CONDIÇÕES DE PAGAMENTO =====

export async function createCondicaoPagamento(data: {
    nome: string;
    dias_prazo?: number;
    percentual_variacao?: number;
    descricao?: string;
}): Promise<CondicaoPagamento> {
    const id = uuidv4();
    const sql = `INSERT INTO "CondicoesPagamento" (id, nome, dias_prazo, percentual_variacao, descricao) 
               VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await query(sql, [id, data.nome, data.dias_prazo || 0, data.percentual_variacao || 0, data.descricao]);
    return result.rows[0];
}

export async function getAllCondicoesPagamento(): Promise<CondicaoPagamento[]> {
    const sql = 'SELECT * FROM "CondicoesPagamento" WHERE ativo = true ORDER BY dias_prazo ASC';
    const result = await query(sql);
    return result.rows;
}

export async function initializeCondicoesPagamento(): Promise<void> {
    const condicoes = [
        { nome: 'À Vista', dias_prazo: 0, percentual_variacao: 0 },
        { nome: '7 dias', dias_prazo: 7, percentual_variacao: 1.5 },
        { nome: '15 dias', dias_prazo: 15, percentual_variacao: 2.5 },
        { nome: '30 dias', dias_prazo: 30, percentual_variacao: 3.5 },
        { nome: '60 dias', dias_prazo: 60, percentual_variacao: 5.0 },
        { nome: '90 dias', dias_prazo: 90, percentual_variacao: 7.0 },
    ];

    for (const condicao of condicoes) {
        const checkSql = 'SELECT id FROM "CondicoesPagamento" WHERE nome = $1';
        const checkResult = await query(checkSql, [condicao.nome]);

        if (checkResult.rows.length === 0) {
            await createCondicaoPagamento(condicao);
        }
    }
}

// ===== TABELA DE PREÇOS AVANÇADA =====

export async function createTabelaPrecos(
    data: CriarTabelaPrecosRequest,
    userId: string
): Promise<TabelaPrecosAvancada> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const id = uuidv4();
        const sql = `INSERT INTO "TabelaPrecosAvancada" 
                 (id, classificacao_id, estado_id, preco_base, data_inicio, data_fim, criado_por_id, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'pendente_aprovacao') RETURNING *`;

        const result = await client.query(sql, [
            id,
            data.classificacao_id,
            data.estado_id || null,
            data.preco_base,
            data.data_inicio,
            data.data_fim || null,
            userId
        ]);

        const precoId = result.rows[0].id;

        // Inserir faixas de preço
        if (data.faixas && data.faixas.length > 0) {
            for (const faixa of data.faixas) {
                const faixaId = uuidv4();
                const faixaSql = `INSERT INTO "FaixasPreco" 
                          (id, preco_id, peso_minimo, peso_maximo, percentual_desconto, preco_faixa) 
                          VALUES ($1, $2, $3, $4, $5, $6)`;

                await client.query(faixaSql, [
                    faixaId,
                    precoId,
                    faixa.peso_minimo,
                    faixa.peso_maximo || null,
                    faixa.percentual_desconto || 0,
                    faixa.preco_faixa || null
                ]);
            }
        }

        // Registrar auditoria
        const auditoriaId = uuidv4();
        const auditoriaSql = `INSERT INTO "AuditoriaPrecos" 
                          (id, preco_id, acao, usuario_id, status_novo, observacao) 
                          VALUES ($1, $2, 'criado', $3, 'pendente_aprovacao', 'Preço criado aguardando aprovação')`;
        await client.query(auditoriaSql, [auditoriaId, precoId, userId]);

        await client.query('COMMIT');

        return await getTabelaPrecosById(precoId);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function getTabelaPrecosById(id: string): Promise<TabelaPrecosAvancada> {
    const sql = `SELECT tp.*, 
                 cm.id as classificacao_id, cm.nome as classificacao_nome, cm.descricao as classificacao_descricao, 
                 cm.categoria as classificacao_categoria, cm."criadoEm" as classificacao_criadoEm, 
                 cm."atualizadoEm" as classificacao_atualizadoEm,
                 eb.id as estado_id, eb.sigla as estado_sigla, eb.nome as estado_nome, eb.regiao as estado_regiao
                FROM "TabelaPrecosAvancada" tp
                LEFT JOIN "ClassificacoesMaterial" cm ON tp.classificacao_id = cm.id
                LEFT JOIN "EstadosBrasil" eb ON tp.estado_id = eb.id
                WHERE tp.id = $1`;

    const result = await query(sql, [id]);
    if (result.rows.length === 0) throw new Error('Tabela de preços não encontrada');

    const row = result.rows[0];
    const precoTabela = {
        ...row,
        classificacao: row.classificacao_nome ? {
            id: row.classificacao_id,
            nome: row.classificacao_nome,
            descricao: row.classificacao_descricao,
            categoria: row.classificacao_categoria,
            criadoEm: row.classificacao_criadoEm,
            atualizadoEm: row.classificacao_atualizadoEm
        } : undefined,
        estado: row.estado_sigla ? {
            id: row.estado_id,
            sigla: row.estado_sigla,
            nome: row.estado_nome,
            regiao: row.estado_regiao,
            criadoEm: row.criadoEm
        } : undefined
    };

    // Buscar faixas
    const faixasSql = 'SELECT * FROM "FaixasPreco" WHERE preco_id = $1 ORDER BY peso_minimo ASC';
    const faixasResult = await query(faixasSql, [id]);
    precoTabela.faixas = faixasResult.rows;

    return precoTabela;
}

export async function listTabelaPrecos(filtros?: FiltroPrecos): Promise<TabelaPrecosAvancada[]> {
    let sql = `SELECT tp.*, 
              cm.nome as classificacao_nome, 
              eb.sigla as estado_sigla, eb.nome as estado_nome
             FROM "TabelaPrecosAvancada" tp
             LEFT JOIN "ClassificacoesMaterial" cm ON tp.classificacao_id = cm.id
             LEFT JOIN "EstadosBrasil" eb ON tp.estado_id = eb.id
             WHERE 1=1`;

    const params: any[] = [];
    let paramCount = 1;

    if (filtros?.classificacao_id) {
        sql += ` AND tp.classificacao_id = $${paramCount}`;
        params.push(filtros.classificacao_id);
        paramCount++;
    }

    if (filtros?.estado_id) {
        sql += ` AND tp.estado_id = $${paramCount}`;
        params.push(filtros.estado_id);
        paramCount++;
    }

    if (filtros?.status) {
        sql += ` AND tp.status = $${paramCount}`;
        params.push(filtros.status);
        paramCount++;
    }

    sql += ' ORDER BY tp."criadoEm" DESC';

    const result = await query(sql, params);
    return result.rows;
}

export async function updateTabelaPrecos(
    id: string,
    data: Partial<CriarTabelaPrecosRequest>,
    userId: string
): Promise<TabelaPrecosAvancada> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Buscar preço antigo
        const oldPrecoResult = await client.query('SELECT * FROM "TabelaPrecosAvancada" WHERE id = $1', [id]);
        if (oldPrecoResult.rows.length === 0) throw new Error('Tabela de preços não encontrada');
        const oldPreco = oldPrecoResult.rows[0];

        // Atualizar
        let updateSql = 'UPDATE "TabelaPrecosAvancada" SET ';
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.preco_base !== undefined) {
            updates.push(`preco_base = $${paramCount}`);
            values.push(data.preco_base);
            paramCount++;
        }
        if (data.data_inicio !== undefined) {
            updates.push(`data_inicio = $${paramCount}`);
            values.push(data.data_inicio);
            paramCount++;
        }
        if (data.data_fim !== undefined) {
            updates.push(`data_fim = $${paramCount}`);
            values.push(data.data_fim);
            paramCount++;
        }

        updates.push(`"atualizadoEm" = CURRENT_TIMESTAMP`);
        updates.push(`status = 'pendente_aprovacao'`);

        updateSql += updates.join(', ') + ` WHERE id = $${paramCount}`;
        values.push(id);

        await client.query(updateSql, values);

        // Registrar histórico
        const historicoId = uuidv4();
        const historicoSql = `INSERT INTO "HistoricoPrecos" 
                          (id, classificacao_id, estado_id, preco_anterior, preco_novo, percentual_variacao, motivo_alteracao, usuario_id)
                          VALUES ($1, $2, $3, $4, $5, $6, 'ajuste_manual', $7)`;

        const percentualVariacao = data.preco_base && oldPreco.preco_base
            ? ((data.preco_base - oldPreco.preco_base) / oldPreco.preco_base) * 100
            : 0;

        await client.query(historicoSql, [
            historicoId,
            oldPreco.classificacao_id,
            oldPreco.estado_id,
            oldPreco.preco_base,
            data.preco_base || oldPreco.preco_base,
            percentualVariacao,
            userId
        ]);

        // Auditoria
        const auditoriaId = uuidv4();
        const auditoriaSql = `INSERT INTO "AuditoriaPrecos" 
                          (id, preco_id, acao, usuario_id, status_anterior, status_novo) 
                          VALUES ($1, $2, 'atualizado', $3, $4, 'pendente_aprovacao')`;
        await client.query(auditoriaSql, [auditoriaId, id, userId, oldPreco.status]);

        await client.query('COMMIT');

        return await getTabelaPrecosById(id);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function approveTabelaPrecos(id: string, userId: string): Promise<TabelaPrecosAvancada> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const updateSql = `UPDATE "TabelaPrecosAvancada" 
                       SET status = 'ativo', aprovado_por_id = $1, data_aprovacao = CURRENT_TIMESTAMP, "atualizadoEm" = CURRENT_TIMESTAMP
                       WHERE id = $2`;

        await client.query(updateSql, [userId, id]);

        // Auditoria
        const auditoriaId = uuidv4();
        const auditoriaSql = `INSERT INTO "AuditoriaPrecos" 
                          (id, preco_id, acao, usuario_id, status_anterior, status_novo, observacao) 
                          VALUES ($1, $2, 'aprovado', $3, 'pendente_aprovacao', 'ativo', 'Preço aprovado')`;
        await client.query(auditoriaSql, [auditoriaId, id, userId]);

        await client.query('COMMIT');

        return await getTabelaPrecosById(id);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// ===== CÁLCULO DE PREÇO =====

export async function calcularPreco(dados: CalculoPrecoBuscador): Promise<ResultadoCalculoPreco> {
    // Buscar preço base para a classificação e estado
    let sql = `SELECT tp.id, tp.preco_base, tp.data_inicio, tp.data_fim
             FROM "TabelaPrecosAvancada" tp
             WHERE tp.classificacao_id = $1 AND tp.status = 'ativo'`;

    const params = [dados.classificacao_id];
    let paramCount = 2;

    if (dados.estado_id) {
        sql += ` AND (tp.estado_id = $${paramCount} OR tp.estado_id IS NULL)`;
        params.push(dados.estado_id);
        paramCount++;
    } else {
        sql += ` AND tp.estado_id IS NULL`;
    }

    sql += ` ORDER BY tp.estado_id DESC, tp."criadoEm" DESC LIMIT 1`;

    const result = await query(sql, params);
    if (result.rows.length === 0) {
        throw new Error('Nenhum preço ativo encontrado para esta classificação');
    }

    const precoBase = result.rows[0];
    let precoFinal = precoBase.preco_base;
    let descontoFaixa = 0;
    let faixaAplicada: FaixaPreco | undefined;

    // Aplicar desconto de faixa de peso se necessário
    if (dados.peso) {
        const faixaSql = `SELECT * FROM "FaixasPreco" 
                      WHERE preco_id = $1 
                      AND peso_minimo <= $2 
                      AND (peso_maximo IS NULL OR peso_maximo >= $2)
                      LIMIT 1`;

        const faixaResult = await query(faixaSql, [precoBase.id, dados.peso]);
        if (faixaResult.rows.length > 0) {
            faixaAplicada = faixaResult.rows[0];
            descontoFaixa = faixaAplicada?.percentual_desconto || 0;
            precoFinal = faixaAplicada?.preco_faixa || precoBase.preco_base * (1 - descontoFaixa / 100);
        }
    }

    // Aplicar variação de condição de pagamento
    let variacaoPagamento = 0;
    let condicaoPagamento: CondicaoPagamento | undefined;

    if (dados.condicao_pagamento_id) {
        const condicaoSql = 'SELECT * FROM "CondicoesPagamento" WHERE id = $1 AND ativo = true';
        const condicaoResult = await query(condicaoSql, [dados.condicao_pagamento_id]);
        if (condicaoResult.rows.length > 0) {
            condicaoPagamento = condicaoResult.rows[0];
            variacaoPagamento = condicaoPagamento?.percentual_variacao || 0;
            precoFinal = precoFinal * (1 + variacaoPagamento / 100);
        }
    }

    return {
        preco_base: precoBase.preco_base,
        desconto_faixa: descontoFaixa,
        preco_com_faixa: faixaAplicada ? (precoBase.preco_base * (1 - descontoFaixa / 100)) : precoBase.preco_base,
        variacao_pagamento: variacaoPagamento,
        preco_final: precoFinal,
        vigencia: {
            data_inicio: precoBase.data_inicio,
            data_fim: precoBase.data_fim
        },
        faixa_aplicada: faixaAplicada,
        condicao_pagamento: condicaoPagamento
    };
}

// ===== HISTÓRICO E RELATÓRIOS =====

export async function getHistoricoPrecos(
    classificacao_id: string,
    estado_id?: string,
    dias?: number
): Promise<HistoricoPrecos[]> {
    let sql = `SELECT * FROM "HistoricoPrecos" WHERE classificacao_id = $1`;
    const params: any[] = [classificacao_id];
    let paramCount = 2;

    if (estado_id) {
        sql += ` AND (estado_id = $${paramCount} OR estado_id IS NULL)`;
        params.push(estado_id);
        paramCount++;
    }

    if (dias) {
        sql += ` AND "criadoEm" >= NOW() - INTERVAL '${dias} days'`;
    }

    sql += ` ORDER BY "criadoEm" DESC`;

    const result = await query(sql, params);
    return result.rows;
}

export async function getRelatorioVariacaoPrecos(
    classificacao_id: string,
    estado_id?: string
): Promise<RelatorioVariacaoPrecos> {
    // Buscar classificação
    const classSql = 'SELECT * FROM "ClassificacoesMaterial" WHERE id = $1';
    const classResult = await query(classSql, [classificacao_id]);
    if (classResult.rows.length === 0) throw new Error('Classificação não encontrada');

    const classificacao = classResult.rows[0];

    // Buscar estado se fornecido
    let estado = undefined;
    if (estado_id) {
        const estadoSql = 'SELECT * FROM "EstadosBrasil" WHERE id = $1';
        const estadoResult = await query(estadoSql, [estado_id]);
        if (estadoResult.rows.length > 0) {
            estado = estadoResult.rows[0];
        }
    }

    // Buscar histórico dos últimos 30 dias
    const historicoSql = `SELECT * FROM "HistoricoPrecos" 
                        WHERE classificacao_id = $1 
                        AND "criadoEm" >= NOW() - INTERVAL '30 days'
                        ORDER BY "criadoEm" DESC`;

    const historicoResult = await query(historicoSql, [classificacao_id]);
    const historico = historicoResult.rows;

    // Calcular estatísticas
    const precos = historico.map(h => h.preco_novo);
    const preco_atual = precos[0] || 0;
    const preco_anterior = historico[historico.length - 1]?.preco_anterior || preco_atual;
    const percentual_variacao = preco_anterior !== 0
        ? ((preco_atual - preco_anterior) / Math.abs(preco_anterior)) * 100
        : 0;

    const preco_medio = precos.length > 0 ? precos.reduce((a, b) => a + b, 0) / precos.length : 0;
    const preco_minimo = precos.length > 0 ? Math.min(...precos) : 0;
    const preco_maximo = precos.length > 0 ? Math.max(...precos) : 0;

    // Determinar tendência
    let tendencia: 'subindo' | 'descendo' | 'estavel' = 'estavel';
    if (percentual_variacao > 2) {
        tendencia = 'subindo';
    } else if (percentual_variacao < -2) {
        tendencia = 'descendo';
    }

    // Últimas datas de mudança
    const ultimas_datas_mudanca = [...new Set(historico.map(h => h.criadoEm.split('T')[0]))].slice(0, 5);

    return {
        classificacao,
        estado,
        preco_anterior,
        preco_atual,
        percentual_variacao,
        preco_medio_30_dias: preco_medio,
        preco_minimo_30_dias: preco_minimo,
        preco_maximo_30_dias: preco_maximo,
        tendencia,
        numero_transacoes: historico.length,
        ultimas_datas_mudanca
    };
}
