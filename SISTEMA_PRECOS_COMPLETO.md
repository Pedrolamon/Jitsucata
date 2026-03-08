# 💰 Sistema de Preços Avançado - Documentação Completa

## 🎯 Visão Geral

Sistema robusto de gerenciamento de preços com suporte a:
- ✅ Tabelas de preço por **Estado do Brasil**
- ✅ Variação por **Classificação/Tipo de Material**
- ✅ **Tiered Pricing** (faixas de peso/volume)
- ✅ **Vigência temporal** (data início/fim)
- ✅ **Status de aprovação** (pendente → ativo)
- ✅ **Histórico completo** de preços
- ✅ **Relatórios de variação** com tendências
- ✅ **Variação por condição de pagamento** (à vista, 30 dias, 60 dias, etc.)
- ✅ **Bulk Update** (aumentar/reduzir preços em massa por estado/classificação)
- ✅ Filtros inteligentes e exportação CSV

---

## 📊 Arquitetura de Banco de Dados

### Novas Tabelas Criadas

#### 1. **EstadosBrasil**
```sql
id (UUID)
sigla (VARCHAR 2) - SP, RJ, MG, etc.
nome (VARCHAR 100) - São Paulo, Rio de Janeiro, etc.
regiao (VARCHAR 50) - Sudeste, Nordeste, etc.
```

#### 2. **ClassificacoesMaterial**
```sql
id (UUID)
nome (VARCHAR 255) - Ex: "Sucata de Ferreo", "Cobre", "Aluminio"
descricao (TEXT)
categoria (VARCHAR 100)
```

#### 3. **CondicoesPagamento**
```sql
id (UUID)
nome (VARCHAR 100) - "À Vista", "30 dias", "60 dias"
dias_prazo (INTEGER)
percentual_variacao (DECIMAL 5,2) - Variação % de preço
```

#### 4. **TabelaPrecosAvancada** (Tabela Principal)
```sql
id (UUID)
classificacao_id (FK) - Tipo de material
estado_id (FK) - Estado do Brasil (NULL = Nacional)
preco_base (DECIMAL 12,4) - Preço base em R$/kg
data_inicio (DATE) - Vigência inicial
data_fim (DATE) - Vigência final (NULL = sem fim)
status (VARCHAR 50) - 'ativo', 'pendente_aprovacao', 'inativo', 'expirado'
observacoes (TEXT)
criado_por_id (FK) - Usuário criador
aprovado_por_id (FK) - Usuário aprovador
data_aprovacao (TIMESTAMP)
criadoEm / atualizadoEm (TIMESTAMP)
```

#### 5. **FaixasPreco** (Tiered Pricing)
```sql
id (UUID)
preco_id (FK) - Referência para TabelaPrecosAvancada
peso_minimo (DECIMAL 10,2) - Começando em X kg
peso_maximo (DECIMAL 10,2) - Até Y kg (NULL = sem limite)
percentual_desconto (DECIMAL 5,2) - Ex: 10% para volumes grandes
preco_faixa (DECIMAL 12,4) - Preço fixo da faixa (se NULL, calcula dinamicamente)
```

#### 6. **HistoricoPrecos**
```sql
id (UUID)
classificacao_id (FK)
estado_id (FK)
preco_anterior (DECIMAL 12,4)
preco_novo (DECIMAL 12,4)
percentual_variacao (DECIMAL 5,2) - Calculado automaticamente
quantidade_transacoes (INTEGER)
preco_medio_periodo (DECIMAL 12,4)
motivo_alteracao (VARCHAR 50) - 'ajuste_inflacao', 'ajuste_manual', 'ajuste_em_massa'
usuario_id (FK)
criadoEm (TIMESTAMP)
```

#### 7. **AuditoriaPrecos**
```sql
id (UUID)
preco_id (FK)
acao (VARCHAR 50) - 'criado', 'atualizado', 'aprovado', 'rejeitado', 'expirado'
status_anterior / status_novo (VARCHAR 50)
usuario_id (FK)
observacao (TEXT)
dataAcao (TIMESTAMP)
```

---

## 🔧 Backend - TypeScript Services & Routes

### Services: `/backend/src/services/advanced-prices-services.ts`

**CRUD Básico:**
- `getAllEstados()` - Lista todos os estados
- `initializeEstadosBrasil()` - Popula estados (execute uma vez)
- `createClassificacao(data)` - Criar tipo de material
- `getAllClassificacoes()` - Listar classificações

**Gerenciamento de Preços:**
- `createTabelaPrecos(data, userId)` - Criar nova tabela (status: pendente_aprovacao)
- `getTabelaPrecosById(id)` - Buscar com detalhes e faixas
- `listTabelaPrecos(filtros)` - Listar com filtros
- `updateTabelaPrecos(id, data, userId)` - Atualizar (volta a pendente_aprovacao)
- `approveTabelaPrecos(id, userId)` - Aprovar (status: ativo)

**Cálculo de Preço:**
```typescript
calcularPreco({
  classificacao_id: string;
  estado_id?: string;
  peso?: number;        // Para aplicar desconto de faixa
  condicao_pagamento_id?: string;
  quantidade?: number;
}) => ResultadoCalculoPreco
```

Retorna:
```typescript
{
  preco_base: 100.00,
  desconto_faixa: 10,           // % de desconto aplicado
  preco_com_faixa: 90.00,       // Preço após faixa
  variacao_pagamento: 3.5,      // % adicionado por condição
  preco_final: 93.15,           // Preço final
  vigencia: { data_inicio, data_fim },
  faixa_aplicada?: {...},
  condicao_pagamento?: {...}
}
```

**Relatórios:**
- `getHistoricoPrecos(classificacao_id, estado_id?, dias?)` - Histórico
- `getRelatorioVariacaoPrecos(classificacao_id, estado_id?)` - Tendências com cálculos

**Bulk Update:**
- `bulkUpdatePrecosEstado(estado_id, percentualVariacao, userId)` - Aumentar/reduzir todos preços de um estado
- `bulkUpdatePrecosClassificacao(classificacao_id, percentualVariacao, userId)` - Aumentar/reduzir todos de uma classificação
- `bulkUpdatePrecos(atualizacoes[], userId)` - Atualizar múltiplos preços individuais

### Routes: `/backend/src/routes/advanced-prices.ts`

```
POST   /api/prices/init                              - Inicializar dados
GET    /api/prices/estados                           - Listar estados
GET    /api/prices/classificacoes                    - Listar classificações
POST   /api/prices/classificacoes                    - Criar classificação
GET    /api/prices/condicoes-pagamento              - Listar condições
POST   /api/prices/condicoes-pagamento              - Criar condição
GET    /api/prices/tabela                           - Listar preços (com filtros)
GET    /api/prices/tabela/:id                       - Detalhes de um preço
POST   /api/prices/tabela                           - Criar novo preço
PUT    /api/prices/tabela/:id                       - Atualizar preço
POST   /api/prices/tabela/:id/approve               - Aprovar preço
POST   /api/prices/calcular                         - Calcular preço final
GET    /api/prices/historico/:classificacao_id      - Histórico de preços
GET    /api/prices/relatorio-variacao/:classificacao_id - Relatório
POST   /api/prices/bulk/estado/:estado_id           - Bulk update por estado
POST   /api/prices/bulk/classificacao/:classificacao_id - Bulk update por classificação
POST   /api/prices/bulk/update                      - Bulk update individual
```

---

## 🎨 Frontend - React Components

### Types: `/frontend/src/types/preco-avancado.ts`
Interface completa TypeScript com tipos para todas as operações.

### Service: `/frontend/src/services/advanced-prices.ts`
Service com métodos para consumir API + utilitários:
- `formatarMoeda(valor)` - Formata como BRL
- `exportToCSV(precos)` - Gera CSV
- `downloadCSV(precos, filename)` - Baixa arquivo
- `getTendenciaIcon(tendencia)` - 📈 📉 ➡️
- `getTendenciaColor(tendencia)` - Classes CSS

### Page: `/frontend/src/pages/PrecosAvancados.tsx`
Página completa com:

**4 Abas:**
1. **📊 Tabela** - Lista com filtros avançados
2. **➕ Criar** - Formulário para novo preço
3. **📈 Histórico** - Histórico com variações
4. **📉 Relatório** - Análise com tendências

**Filtros Inteligentes:**
- Busca por texto
- Por classificação
- Por estado
- Por status
- Exportar CSV

**Tabela com:**
- Visualização de status (badges coloridas)
- Ações: Aprovar, Ver Histórico, Gerar Relatório
- Preços em R$ verde (destaque)
- Datas de vigência

### Modal: `/frontend/src/components/BulkUpdateModal.tsx`
Modal para atualização em massa:
- Selecionar por estado ou classificação
- Informar percentual
- Preview do resultado
- Validação de variação >20%

---

## 🚀 Como Usar

### 1. Inicializar Sistema (Uma Única Vez)
```bash
POST /api/prices/init
```
Isso popula:
- 27 estados do Brasil
- 6 condições de pagamento padrão

### 2. Adicionar Classificação de Material
```json
POST /api/prices/classificacoes
{
  "nome": "Sucata de Ferro",
  "descricao": "Ferro danificado",
  "categoria": "Metais Ferrosos"
}
```

### 3. Criar Tabela de Preços

```json
POST /api/prices/tabela
{
  "classificacao_id": "uuid-aqui",
  "estado_id": "uuid-sp",  // Deixe NULL para nacional
  "preco_base": 1250.50,   // R$/kg
  "data_inicio": "2026-03-08",
  "data_fim": "2026-03-31",
  "observacoes": "Preço de março",
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

Retorna preço com status `pendente_aprovacao`.

### 4. Aprovar Preço
```bash
POST /api/prices/tabela/{id}/approve
```

### 5. Calcular Preço Final para Fornecedor

Fornecedor em SP quer 250kg, pagando em 30 dias:

```json
POST /api/prices/calcular
{
  "classificacao_id": "uuid-ferro",
  "estado_id": "uuid-sp",
  "peso": 250,
  "condicao_pagamento_id": "uuid-30-dias"
}
```

Retorna:
```json
{
  "preco_base": 1250.50,
  "desconto_faixa": 5,
  "preco_com_faixa": 1187.98,
  "variacao_pagamento": 2.5,
  "preco_final": 1217.68,    // ← Preço a pagar
  "vigencia": { "data_inicio": "2026-03-08", ... },
  "faixa_aplicada": { ... },
  "condicao_pagamento": { "nome": "30 dias", ... }
}
```

### 6. Historico e Relatórios

**Histórico:**
```bash
GET /api/prices/historico/{classificacao_id}?estado_id={id}&dias=30
```

**Relatório com Tendência:**
```bash
GET /api/prices/relatorio-variacao/{classificacao_id}?estado_id={id}
```

Retorna: preço anterior, atual, variação %, média, mín/máx, **tendência** (📈 subindo / 📉 descendo / ➡️ estável)

### 7. Bulk Update

**Aumentar 5% de Ferro em SP:**
```json
POST /api/prices/bulk/estado/{estado_id}
{
  "percentualVariacao": 5
}
```

**Reduzir 3% de Aluminio nacionalmente:**
```json
POST /api/prices/bulk/classificacao/{classificacao_id}
{
  "percentualVariacao": -3
}
```

Retorna:
```json
{
  "message": "15 preços atualizados com sucesso",
  "atualizados": 15,
  "ids": ["uuid1", "uuid2", ...]
}
```

---

## 📱 Fluxo de Fornecedor

1. **Fornecedor se registra** → Seleciona seu **estado**
2. **Ao consultar preço**:
   - Frontend envia: `{ classificacao_id, estado_id, peso, condicao_pagamento }`
   - Backend retorna: `preco_final` + detalhes de cálculo
3. **Fornecedor vê preço atualizado** com histórico de variação

---

## 🔐 Segurança & Auditoria

✅ Todas as mudanças são **registradas** em HistoricoPrecos e AuditoriaPrecos
✅ Rastreamento de **usuário** que fez cada ação
✅ Preços requerem **aprovação** antes de ficar ativos
✅ Vigência **temporal** evita preços retroativos

---

## 🎯 Próximos Passos

- [ ] Adicionar dashboard com gráficos de tendência
- [ ] Integrar com relatórios PDF
- [ ] Alertas automáticos quando preço sair de range definido
- [ ] Suporte a agrupamento de preços por região
- [ ] API de precos para portal fornecedor (read-only)
- [ ] Validação de integridade de faixas de preço
- [ ] Cache de precalculos para performance
