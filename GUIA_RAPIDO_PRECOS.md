# 🚀 GUIA RÁPIDO - Sistema de Preços Avançado

## ⚡ Setup Inicial (5 minutos)

### 1️⃣ Adicionar Rota ao Frontend (se ainda não está)

Abra sua rota principal (ex: `App.tsx` ou roteador) e adicione:

```tsx
import PrecosAvancados from "./pages/PrecosAvancados";

// Na configuração de rotas:
{
  path: "/admin/precos",
  element: <PrecosAvancados />
}
```

### 2️⃣ Inicializar Dados (Execute UMA VEZ)

No navegador ou via Postman:
```
POST http://localhost:3333/api/prices/init
```

✅ Isso carrega:
- 27 estados do Brasil
- 6 condições de pagamento padrão

### 3️⃣ Criar Primeira Classificação (Material)

```
POST http://localhost:3333/api/prices/classificacoes
Content-Type: application/json

{
  "nome": "Sucata de Ferro",
  "descricao": "Ferro danificado e sucata industrial",
  "categoria": "Metais Ferrosos"
}
```

Salve o `id` retornado.

### 4️⃣ Criar Primeiro Preço

```
POST http://localhost:3333/api/prices/tabela
Content-Type: application/json

{
  "classificacao_id": "COLE_O_ID_AQUI",
  "estado_id": null,  // nacional
  "preco_base": 1250.50,
  "data_inicio": "2026-03-08",
  "data_fim": "2026-03-31",
  "observacoes": "Preço de março"
}
```

Retorna preço com status: `pendente_aprovacao`

### 5️⃣ Aprovar Preço

```
POST http://localhost:3333/api/prices/tabela/{ID_RETORNADO}/approve
```

Agora status = `ativo` ✅

---

## 📋 Guia de Tarefas Comuns

### Tarefa 1️⃣: Ver Preços Ativos

**Frontend:**
```tsx
const precos = await advancedPricesService.listTabelaPrecos({
  status: "ativo"
});
```

**API:**
```
GET http://localhost:3333/api/prices/tabela?status=ativo
```

---

### Tarefa 2️⃣: Calcular Preço Final para Fornecedor

Fornecedor do RJ quer 150kg de Ferro com pagamento em 30 dias:

```tsx
const resultado = await advancedPricesService.calcularPreco({
  classificacao_id: "uuid-ferro",
  estado_id: "uuid-rj",
  peso: 150,
  condicao_pagamento_id: "uuid-30-dias"
});

console.log(`Preço Final: R$ ${resultado.preco_final.toFixed(2)}`);
```

---

### Tarefa 3️⃣: Aumentar Todos Preços de um Estado em 5%

```tsx
const resultado = await advancedPricesService.bulkUpdateEstado(
  "uuid-sp",
  5 // Percentual
);
alert(`✅ ${resultado.atualizados} preços atualizados`);
```

---

### Tarefa 4️⃣: Ver Histórico e Tendência

```tsx
// Últimos 30 dias de Ferro
const historico = await advancedPricesService.getHistoricoPrecos(
  "uuid-ferro",
  null, // todos estados
  30    // dias
);

// Análise com tendência
const relatorio = await advancedPricesService.getRelatorioVariacaoPrecos(
  "uuid-ferro"
);

console.log(`Tendência: ${relatorio.tendencia}`); // "subindo", "descendo", "estavel"
console.log(`Preço Médio: R$ ${relatorio.preco_medio_30_dias?.toFixed(2)}`);
```

---

### Tarefa 5️⃣: Exportar Preços em CSV

```tsx
const precos = await advancedPricesService.listTabelaPrecos();
advancedPricesService.downloadCSV(precos, "tabela-precos.csv");
```

---

## 📊 Modelo de Dados Simplificado

```
┌─────────────────────┐
│ TabelaPrecosAvancada│
├─────────────────────┤
│ id                  │
│ classificacao_id ───┼──→ ClassificacoesMaterial
│ estado_id       ───┼──→ EstadosBrasil
│ preco_base      │
│ data_inicio     │
│ data_fim        │
│ status          │
│ faixas[] ───────┼──→ FaixasPreco
└─────────────────────┘
        │
        ├──→ HistoricoPrecos (log de mudanças)
        └──→ AuditoriaPrecos (quem fez o quê)
```

---

## 🔍 Entendendo o Cálculo de Preço

### Fórmula Completa

```
PREÇO_FINAL = PRECO_BASE × (1 - DESCONTO_FAIXA/100) × (1 + MARKUP_PAGAMENTO/100)
```

### Exemplo Prático

**Dados:**
- Preço Base: R$ 1.000,00/kg
- Quantidade: 250kg
- Condição: 30 dias

**Passo 1 - Aplicar Desconto de Faixa:**
- 250kg está na faixa 101-500kg
- Desconto: 5%
- Preço com faixa: 1.000 × (1 - 5/100) = **R$ 950,00/kg**

**Passo 2 - Aplicar Markup de Pagamento:**
- 30 dias: +3.5%
- Preço final: 950 × (1 + 3.5/100) = **R$ 982,75/kg**

**Passo 3 - Valor Total:**
- 250kg × R$ 982,75 = **R$ 245.687,50**

---

## ⚙️ Faixas de Preço - Exemplo

Criar preço com descontos progressivos:

```json
{
  "classificacao_id": "uuid-ferro",
  "preco_base": 1000,
  "faixas": [
    {
      "peso_minimo": 1,
      "peso_maximo": 100,
      "percentual_desconto": 0
    },
    {
      "peso_minimo": 101,
      "peso_maximo": 500,
      "percentual_desconto": 5
    },
    {
      "peso_minimo": 501,
      "peso_maximo": null,
      "percentual_desconto": 10
    }
  ]
}
```

**Resultado:**
- 50kg: R$ 1.000,00/kg
- 200kg: R$ 950,00/kg (5% off)
- 1.000kg: R$ 900,00/kg (10% off)

---

## 🎯 Casos de Uso Reais

### 1️⃣ Fornecedor em SP

**Fluxo:**
1. Se registra → Sistema detecta estado = SP
2. Ao buscar preço de Ferro:
   - Busca: `preços de Ferro com estado_id=SP`
   - Se não houver, usa nacional (estado_id=NULL)
3. Fornecedor vê preço específico de SP

### 2️⃣ Promoção por Classificação

**Cenário:** Reduzir 10% em todos os preços de Cobre por 2 semanas

```tsx
// Criar novo preço com 90% do original
await advancedPricesService.createTabelaPrecos({
  classificacao_id: "uuid-cobre",
  estado_id: null, // Nacional
  preco_base: 4500 * 0.9, // 90% de 4500 = 4050
  data_inicio: "2026-03-08",
  data_fim: "2026-03-22", // 2 semanas
  observacoes: "Promoção em Cobre"
});

// Aprovar
await advancedPricesService.approveTabelaPrecos(id);
```

### 3️⃣ Monitorar Tendência de Preços

**Dashboard de Preços:**

```tsx
const materiais = await advancedPricesService.getAllClassificacoes();

for (const mat of materiais) {
  const relatorio = await advancedPricesService.getRelatorioVariacaoPrecos(mat.id);
  
  const ícone = 
    relatorio.tendencia === "subindo" ? "📈" :
    relatorio.tendencia === "descendo" ? "📉" : "➡️";
  
  console.log(`${ícone} ${mat.nome}: R$ ${relatorio.preco_atual.toFixed(2)}`);
}
```

---

## 🛡️ Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|--------|
| `Nenhum preço ativo encontrado` | Preço ainda está pending | Aprovar o preço antes |
| `Classificação não encontrada` | ID inválido | Verificar ID no banco |
| `Informe o percentualVariacao` | Falta campo no bulk update | Adicionar `percentualVariacao` |
| `Erro ao atualizar preços` | Estado_id inválido | Confirmar estado existe |

---

## 📞 Suporte Rápido

**Questionário troubleshooting:**

1. A página carrega mas não mostra preços?
   - Execute `/api/prices/init` se não foi feito
   - Verifique se há preços com status "ativo"

2. Calculo de preço está errado?
   - Verificar se faixas estão corretas
   - Confirmar condição de pagamento existe
   - Checar se preço não está expirado

3. Bulk update não funciona?
   - Verificar que estado_id existe em EstadosBrasil
   - Confirmar que há preços ativos para aquele estado
   - Checar logs do servidor

4. Histórico não mostra mudanças?
   - Confirmar que preço é "ativo" (não pending)
   - Aguardar alguns segundos e recarregar
   - Verificar que mudanças foram aprovadas

---

## 🎓 Próximos Passos

- [ ] Criar dashboard com gráficos de tendência
- [ ] Adicionar relatórios em PDF mensal
- [ ] Criar alertas quando preço sai de range
- [ ] Integrar com integração automática de preços
- [ ] Adicionar sugestão automática de preços baseada em histórico
- [ ] API pública read-only para portal fornecedor

---

## 📚 Arquivos de Referência

- `SISTEMA_PRECOS_COMPLETO.md` - Documentação técnica completa
- `EXEMPLOS_USO_SISTEMA_PRECOS.tsx` - Exemplos de código
- `backend/src/services/advanced-prices-services.ts` - Lógica principal
- `frontend/src/pages/PrecosAvancados.tsx` - Interface completa
