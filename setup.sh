#!/bin/bash
# ═══════════════════════════════════════════════════════
# GUI Personal — Setup Script
# Rode este script na pasta do projeto no terminal
# ═══════════════════════════════════════════════════════

echo "🏋️ GUI Personal — Inicializando projeto..."
echo ""

# Verifica se git está disponível
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado. Instale o git primeiro."
    exit 1
fi

# Inicializa o repo
git init
git branch -M main

# Adiciona o remote
git remote add origin https://github.com/guiduarte-personal/meu-treino.git

# Faz pull do que já existe no GitHub (se houver)
echo "📥 Baixando estado atual do repositório..."
git pull origin main --allow-unrelated-histories 2>/dev/null || true

# Adiciona todos os arquivos
git add index.html registrar.html README.md CLAUDE.md

# Commit
git commit -m "v2: sistema completo — app de registro + dashboard do aluno

- registrar.html: app mobile-first para input em tempo real
- index.html: dashboard do aluno com filtros, gráficos e export PDF
- Tema claro com identidade GUI Personal
- Integração via Google Apps Script API"

echo ""
echo "✅ Pronto! Para enviar pro GitHub:"
echo ""
echo "   git push -u origin main"
echo ""
echo "Se pedir autenticação, use um Personal Access Token como senha."
echo "Gere em: https://github.com/settings/tokens"
