# GUI Personal — Sistema de Treinos

Sistema gratuito para acompanhamento de treinos: input pelo personal, dashboard para os alunos.

## Arquitetura

```
Google Sheets (banco de dados)
    ↕ Google Apps Script (API grátis)
    ↕
GitHub Pages
    ├── /registrar.html → App de input (Personal)
    └── /index.html     → Dashboard (Aluno)
```

---

## Setup Passo a Passo

### 1. Preparar a Planilha

1. Abra a **planilha modelo** no Google Sheets (importe o .xlsx)
2. Confira se as abas se chamam exatamente: `Alunos`, `Treinos`, `Exercícios`
3. Cadastre seus alunos na aba `Alunos` (nome é obrigatório)
4. Adicione exercícios na aba `Exercícios`

### 2. Instalar o Apps Script (API)

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o código que estiver lá
3. Cole o conteúdo do arquivo `Code.gs`
4. Clique em **Implantar → Nova implantação**
5. Em "Tipo", selecione **App da Web**
6. Configure:
   - **Executar como**: Eu
   - **Quem tem acesso**: Qualquer pessoa
7. Clique em **Implantar**
8. **Copie a URL** que aparece (parece com: `https://script.google.com/macros/s/xxx.../exec`)

> ⚠️ Sempre que alterar o código, faça uma **nova implantação** (não "editar implantação")

### 3. Subir os arquivos no GitHub

1. No repositório `meu-treino`, suba os 3 arquivos:
   - `index.html` (dashboard do aluno)
   - `registrar.html` (app do personal)
   - `README.md` (este arquivo)
2. Ative GitHub Pages: **Settings → Pages → Branch: main → Save**
3. Aguarde ~1 minuto

### 4. Configurar o App de Input

1. Acesse: `https://guiduarte-personal.github.io/meu-treino/registrar.html`
2. Na primeira vez, cole a **URL do Apps Script**
3. A URL fica salva no navegador — não precisa colar de novo
4. Adicione à tela inicial do celular para acesso rápido:
   - **iPhone**: Safari → Compartilhar → Adicionar à Tela de Início
   - **Android**: Chrome → Menu (⋮) → Adicionar à tela inicial

---

## Como Usar

### Para o Personal (Gui)

1. Abra o app de registro no celular
2. Selecione o aluno
3. Escolha o tipo de treino (A, B, C...)
4. Adicione exercícios um por um durante o treino
5. Cada exercício é salvo imediatamente na planilha

**Dica**: Não precisa lembrar de nada no fim — vá registrando conforme o treino acontece!

### Para o Aluno

Envie o link personalizado:

```
https://guiduarte-personal.github.io/meu-treino/?api=SUA_URL_API&aluno=Nome do Aluno
```

O aluno pode:
- Ver estatísticas gerais
- Filtrar por período, tipo de treino ou exercício
- Acompanhar evolução de cargas nos gráficos
- Exportar PDF com o botão "Exportar PDF"

---

## Links Rápidos

| O quê | URL |
|-------|-----|
| App de registro | `guiduarte-personal.github.io/meu-treino/registrar.html` |
| Dashboard aluno | `guiduarte-personal.github.io/meu-treino/?api=URL&aluno=NOME` |
| Planilha | _(seu link do Google Sheets)_ |
| Instagram | [@personalguiduarte](https://instagram.com/personalguiduarte) |

---

## Solução de Problemas

**"Erro ao carregar"**: Verifique se a URL do Apps Script está correta e se a implantação permite acesso a "Qualquer pessoa".

**Aluno não aparece**: Confira se o nome está exatamente igual na aba `Alunos` e no link.

**Dados não atualizam**: O Google pode cachear por alguns minutos. Recarregue a página.

**Novo exercício não aparece no autocomplete**: Adicione o exercício na aba `Exercícios` da planilha.
