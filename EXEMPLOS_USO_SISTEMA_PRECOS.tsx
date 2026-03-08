

/**
 * EXEMPLO DE INTEGRAÇÃO DO SISTEMA DE PREÇOS AVANÇADO
 * 
 * Este arquivo mostra como usar o sistema em um componente React
 

// ============ EXEMPLO 1: CALCULAR PREÇO PARA FORNECEDOR ============

export async function exemploCalculoPreco() {
    // Fornecedor do interior de SP quer comprar 250kg de Sucata de Ferro
    // Pagando em 30 dias

    try {
        const resultado = await advancedPricesService.calcularPreco({
            classificacao_id: "uuid-sucata-ferro",
            estado_id: "uuid-sp", // São Paulo
            peso: 250, // kg - aplica desconto de faixa
            condicao_pagamento_id: "uuid-30-dias" // Adiciona 2.5% ao preço
        });

        console.log("=== RESULTADO DO CÁLCULO ===");
        console.log(`Preço Base (1kg): R$ ${resultado.preco_base.toFixed(2)}`);
        console.log(`Desconto Faixa (250kg): -${resultado.desconto_faixa}%`);
        console.log(`Preço com Faixa: R$ ${resultado.preco_com_faixa.toFixed(2)}`);
        console.log(`Variação Pagamento (+30 dias): +${resultado.variacao_pagamento}%`);
        console.log(`\n*** PREÇO FINAL: R$ ${resultado.preco_final.toFixed(2)} ***`);
        console.log(`Válido de: ${resultado.vigencia.data_inicio} até ${resultado.vigencia.data_fim}`);

        return resultado;
    } catch (error) {
        console.error("Erro ao calcular:", error);
    }
}

// ============ EXEMPLO 2: CRIAR TABELA DE PREÇO ============

export async function exemploCriarTabelaPreco() {
    try {
        const novaTabela = await advancedPricesService.createTabelaPrecos({
            classificacao_id: "uuid-sucata-ferro",
            estado_id: "uuid-sp", // Específico para SP (NULL = Nacional)
            preco_base: 1250.00, // R$/kg
            data_inicio: "2026-03-08",
            data_fim: "2026-03-31", // Vigência de março
            observacoes: "Preço atualizado conforme inflação",

            // Faixas de desconto por volume
            faixas: [
                {
                    peso_minimo: 1,
                    peso_maximo: 100,
                    percentual_desconto: 0 // De 1 a 100kg: sem desconto
                },
                {
                    peso_minimo: 101,
                    peso_maximo: 500,
                    percentual_desconto: 5 // De 101 a 500kg: 5% desconto
                },
                {
                    peso_minimo: 501,
                    peso_maximo: null, // null = sem limite máximo
                    percentual_desconto: 10 // Acima de 501kg: 10% desconto
                }
            ]
        });

        console.log("Tabela de Preço criada! ID:", novaTabela.id);
        console.log("Status:", novaTabela.status, "← Aguardando aprovação");

        return novaTabela;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// ============ EXEMPLO 3: APROVAR E USAR PREÇO ============

export async function exemploAprovarPreco(tabelaPrecosId: string) {
    try {
        // Admin aprova o preço
        const tabelaPrecosAprovada = await advancedPricesService.approveTabelaPrecos(tabelaPrecosId);
        console.log("✅ Preço aprovado! Status:", tabelaPrecosAprovada.status); // = "ativo"

        // Agora fornecedores conseguem ver esse preço
        return tabelaPrecosAprovada;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// ============ EXEMPLO 4: BULK UPDATE - AUMENTAR PREÇOS ============

export async function exemploBulkUpdateEstado() {
    try {
        // Aumentar TODOS os preços de São Paulo em 5%
        const resultado = await advancedPricesService.bulkUpdateEstado(
            "uuid-sp",
            5 // Percentual: +5%
        );

        console.log(`✅ ${resultado.atualizados} preços de SP aumentados em 5%`);
        console.log("IDs atualizados:", resultado.ids);

        return resultado;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// ============ EXEMPLO 5: REDUZIR PREÇOS DE CLASSIFICAÇÃO ============

export async function exemploBulkUpdateClassificacao() {
    try {
        // Reduzir todos os preços de "Sucata de Cobre" em 3% (promoção)
        const resultado = await advancedPricesService.bulkUpdateClassificacao(
            "uuid-cobre",
            -3 // Percentual: -3%
        );

        console.log(`✅ ${resultado.atualizados} preços de Cobre reduzidos em 3%`);

        return resultado;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// ============ EXEMPLO 6: VER HISTÓRICO DE PREÇOS ============

export async function exemploHistoricoPrecos() {
    try {
        // Ver últimos 30 dias de Sucata de Ferro em SP
        const historico = await advancedPricesService.getHistoricoPrecos(
            "uuid-sucata-ferro",
            "uuid-sp",
            30 // dias
        );

        console.log("=== HISTÓRICO (30 dias) ===");
        historico.forEach((item) => {
            const data = new Date(item.criadoEm).toLocaleDateString("pt-BR");
            console.log(`${data}: R$ ${item.preco_anterior?.toFixed(2)} → R$ ${item.preco_novo.toFixed(2)}`);

            if (item.percentual_variacao) {
                const sinal = item.percentual_variacao > 0 ? "📈" : "📉";
                console.log(`  ${sinal} ${item.percentual_variacao.toFixed(2)}%`);
            }
        });

        return historico;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// ============ EXEMPLO 7: RELATÓRIO COM TENDÊNCIA ============

export async function exemploRelatorioTendencia() {
    try {
        // Análise de Sucata de Ferro em SP
        const relatorio = await advancedPricesService.getRelatorioVariacaoPrecos(
            "uuid-sucata-ferro",
            "uuid-sp"
        );

        console.log("=== RELATÓRIO DE VARIAÇÃO ===");
        console.log(`Material: ${relatorio.classificacao.nome}`);
        console.log(`Estado: ${relatorio.estado?.nome}`);
        console.log(`\nPreço Anterior: R$ ${relatorio.preco_anterior?.toFixed(2) || "N/A"}`);
        console.log(`Preço Atual: R$ ${relatorio.preco_atual.toFixed(2)}`);
        console.log(`Variação: ${relatorio.percentual_variacao?.toFixed(2) || 0}%`);

        console.log(`\n📊 Estatísticas (30 dias):`);
        console.log(`  Média: R$ ${relatorio.preco_medio_30_dias?.toFixed(2) || "N/A"}`);
        console.log(`  Mínimo: R$ ${relatorio.preco_minimo_30_dias?.toFixed(2) || "N/A"}`);
        console.log(`  Máximo: R$ ${relatorio.preco_maximo_30_dias?.toFixed(2) || "N/A"}`);

        const tendencia = relatorio.tendencia;
        const ícone = tendencia === "subindo" ? "📈" : tendencia === "descendo" ? "📉" : "➡️";
        console.log(`\n${ícone} Tendência: ${tendencia.toUpperCase()}`);
        console.log(`Transações registradas: ${relatorio.numero_transacoes}`);

        return relatorio;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// ============ EXEMPLO 8: FILTRAR PREÇOS ============

export async function exemploFiltrarPrecos() {
    try {
        // Listar apenas preços ATIVOS de Ferro em SP
        const precosAtivos = await advancedPricesService.listTabelaPrecos({
            classificacao_id: "uuid-sucata-ferro",
            estado_id: "uuid-sp",
            status: "ativo"
        });

        console.log(`Encontrados ${precosAtivos.length} preços ativos`);

        precosAtivos.forEach((preco) => {
            console.log(`✅ ${preco.classificacao?.nome} (SP) - R$ ${preco.preco_base.toFixed(2)}`);
            console.log(`   Válido de ${preco.data_inicio} até ${preco.data_fim || "indefinidamente"}`);
        });

        return precosAtivos;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// ============ EXEMPLO 9: EXPORTAR CSV ============

export function exemploExportarCSV() {
    // Obter preços e exportar
    const precos = [
        {
            id: "1",
            classificacao: { nome: "Sucata de Ferro" },
            estado: { nome: "São Paulo" },
            preco_base: 1250,
            data_inicio: "2026-03-08",
            data_fim: "2026-03-31",
            status: "ativo"
        }
    ];

    // Baixar CSV
    advancedPricesService.downloadCSV(precos as any, "meus-precos.csv");
    console.log("📥 Arquivo baixado: meus-precos.csv");
}

// ============ EXEMPLO 10: COMPONENTE REACT COM ESTADO ============

export function ExemploComponenteCompleto() {
    const [precos, setPrecos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [estado, setEstado] = React.useState("");

    const handleBulkUpdate = async () => {
        try {
            setLoading(true);

            // Aumentar 5% no estado selecionado
            const resultado = await advancedPricesService.bulkUpdateEstado(estado, 5);

            // Recarregar preços
            const precosAtualizados = await advancedPricesService.listTabelaPrecos({
                estado_id: estado
            });

            setPrecos(precosAtualizados);
            alert(`✅ ${resultado.atualizados} preços atualizados!`);
        } catch (error) {
            alert("❌ Erro ao atualizar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-900 rounded-lg text-white">
            <h3 className="text-lg font-bold mb-4">Bulk Update de Preços</h3>

            <input
                type="text"
                placeholder="ID do Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded"
            />

            <button
                onClick={handleBulkUpdate}
                disabled={loading}
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded font-bold disabled:opacity-50"
            >
                {loading ? "Atualizando..." : "Aumentar 5%"}
            </button>

            {precos.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-bold mb-2">Preços Atualizados:</h4>
                    <ul>
                        {precos.map((p: any) => (
                            <li key={p.id}>
                                {p.classificacao?.nome} - R$ {p.preco_base.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ============ TABELA DE REFERÊNCIA RÁPIDA ============

/*
┌─────────────────────────────────────────────────────────────────┐
│        CÁLCULO DE PREÇO - REFERÊNCIA RÁPIDA                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PREÇO BASE: R$ 1.000,00 por kg                               │
│                                                                 │
│  EXEMPLO 1 - 50kg em SP, à vista:                            │
│  └─ Sem faixa (< 100kg): sem desconto                         │
│  └─ Sem variação pagamento: preço = R$ 1.000,00             │
│  └─ Total: 50kg × R$ 1.000,00 = R$ 50.000,00               │
│                                                                 │
│  EXEMPLO 2 - 200kg em SP, 30 dias:                           │
│  └─ Faixa 101-500kg: 5% desconto → R$ 950,00/kg            │
│  └─ Pagamento +30 dias: +2.5% → R$ 974,38/kg               │
│  └─ Total: 200kg × R$ 974,38 = R$ 194.876,00               │
│                                                                 │
│  EXEMPLO 3 - 1.000kg em SP, 60 dias:                         │
│  └─ Faixa >500kg: 10% desconto → R$ 900,00/kg              │
│  └─ Pagamento +60 dias: +5.0% → R$ 945,00/kg               │
│  └─ Total: 1.000kg × R$ 945,00 = R$ 945.000,00             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│        CONDIÇÕES DE PAGAMENTO - MARKUP PADRÃO                  │
├─────────────────────────────────────────────────────────────────┤
│  À Vista      : 0%                                             │
│  7 dias       : +1.5%                                          │
│  15 dias      : +2.5%                                          │
│  30 dias      : +3.5%                                          │
│  60 dias      : +5.0%                                          │
│  90 dias      : +7.0%                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│        STATUS DE PREÇO - FLUXO                                  │
├─────────────────────────────────────────────────────────────────┤
│  pendente_aprovacao  ─── (admin aprova) ──→  ativo            │
│                                              ├─→ inativo (manual)
│                                              └─→ expirado (data fim)
└─────────────────────────────────────────────────────────────────┘
*/

/**
 * NOTAS DE IMPLEMENTAÇÃO:
 * 
 * 1. SEMPRE chamar /api/prices/init na primeira execução
 * 2. Preços novos nascem em status "pendente_aprovacao"
 * 3. Histórico é gerado AUTOMATICAMENTE a cada mudança
 * 4. Bulk update registra em HistoricoPrecos e AuditoriaPrecos
 * 5. Relatório calcula automáticamente tendência (subindo/descendo/estável)
 * 6. Faixas sem data fim continuam indefinidamente
 * 7. Estado_id NULL = válido para todo Brasil (nacional)
 * 8. Peso e condicao_pagamento são OPCIONAIS no calculo
 * 9. Aprova operações requer permissão de admin
 * 10. Todo usuário que faz ação é registrado em auditoria
 */
