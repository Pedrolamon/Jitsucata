import axios from 'axios';

const BASE_URL = 'http://localhost:3333/api';

async function testCreatePrice() {
    try {
        // Dados de teste
        const priceData = {
            classificacao_id: "test-class-1",
            estado_id: "SP",
            preco_base: 100.00,
            data_inicio: "2025-01-01",
            data_fim: "2025-12-31",
            observacoes: "Teste de criação de preço",
            faixas: [
                {
                    id: "faixa-1",
                    peso_minimo: 0,
                    peso_maximo: 100,
                    preco_faixa: 100.00
                },
                {
                    id: "faixa-2",
                    peso_minimo: 100,
                    peso_maximo: 500,
                    preco_faixa: 95.00
                },
                {
                    id: "faixa-3",
                    peso_minimo: 500,
                    preco_faixa: 90.00
                }
            ],
            variacoes_pagamento: [
                {
                    condicao_nome: "À Vista",
                    dias_prazo: 0,
                    percentual_variacao: 0
                },
                {
                    condicao_nome: "30 dias",
                    dias_prazo: 30,
                    percentual_variacao: 3.5
                }
            ]
        };

        console.log('📤 Enviando dados:', JSON.stringify(priceData, null, 2));

        const response = await axios.post(`${BASE_URL}/prices/tabela`, priceData);

        console.log('✅ Sucesso! Resposta:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        console.error('❌ Erro ao criar preço:');
        console.error('Status:', error.response?.status);
        console.error('Dados de erro:', error.response?.data);
        console.error('Mensagem:', error.message);
    }
}

testCreatePrice();
