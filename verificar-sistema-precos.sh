#!/bin/bash

# =========================================
# ✅ VERIFICADOR DO SISTEMA DE PREÇOS
# =========================================
# Execute este script para verificar se tudo está instalado corretamente

echo "🔍 Verificando dependências do Sistema de Preços Avançado..."

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

function check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} $1"
    return 0
  else
    echo -e "${RED}❌${NC} $1 (FALTANDO)"
    return 1
  fi
}

function check_content() {
  if grep -q "$2" "$1" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} $1 contém '$2'"
    return 0
  else
    echo -e "${RED}❌${NC} $1 não contém '$2'"
    return 1
  fi
}

echo ""
echo "📦 Backend - Arquivos:"
check_file "backend/database.sql"
check_file "backend/src/types/preco-avancado.ts"
check_file "backend/src/services/advanced-prices-services.ts"
check_file "backend/src/routes/advanced-prices.ts"

echo ""
echo "📦 Backend - Conteúdo:"
check_content "backend/src/index.ts" "advanced-prices"

echo ""
echo "💻 Frontend - Arquivos:"
check_file "frontend/src/types/preco-avancado.ts"
check_file "frontend/src/services/advanced-prices.ts"
check_file "frontend/src/pages/PrecosAvancados.tsx"
check_file "frontend/src/components/BulkUpdateModal.tsx"

echo ""
echo "📖 Documentação:"
check_file "SISTEMA_PRECOS_COMPLETO.md"
check_file "GUIA_RAPIDO_PRECOS.md"
check_file "EXEMPLOS_USO_SISTEMA_PRECOS.tsx"

echo ""
echo "📋 SQL - Tabelas:"
check_content "backend/database.sql" "EstadosBrasil"
check_content "backend/database.sql" "ClassificacoesMaterial"
check_content "backend/database.sql" "TabelaPrecosAvancada"
check_content "backend/database.sql" "FaixasPreco"
check_content "backend/database.sql" "HistoricoPrecos"
check_content "backend/database.sql" "AuditoriaPrecos"

echo ""
echo "==========================================="
echo "🚀 PRÓXIMOS PASSOS:"
echo "==========================================="
echo ""
echo "1️⃣  Reiniciar servidor backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2️⃣  Inicializar dados (execute UMA VEZ):"
echo "   curl -X POST http://localhost:3333/api/prices/init"
echo ""
echo "3️⃣  Acessar interface:"
echo "   http://localhost:5173/admin/precos"
echo ""
echo "4️⃣  Criar primeira classificação:"
echo "   curl -X POST http://localhost:3333/api/prices/classificacoes \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"nome\":\"Sucata de Ferro\"}'"
echo ""
echo "5️⃣  Ler guio completo:"
echo "   cat GUIA_RAPIDO_PRECOS.md"
echo ""
echo "✅ Sistema pronto para usar!"
