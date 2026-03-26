# CLAUDE.md — Instruções do Projeto GUI Personal

## Contexto do Projeto

Sistema gratuito de acompanhamento de treinos para o personal trainer Guilherme Duarte (@personalguiduarte).

### Arquitetura
- **Google Sheets** → banco de dados (alunos, treinos, exercícios)
- **Google Apps Script** (`Code.gs`) → API REST grátis que lê/escreve na planilha
- **GitHub Pages** → hospeda dois apps HTML:
  - `index.html` — Dashboard do aluno (fundo claro, filtros, gráficos, exportar PDF)
  - `registrar.html` — App de input do personal (mobile-first, cards por exercício, tempo real)

### Repositório GitHub
- **Org**: `guiduarte-personal`
- **Repo**: `meu-treino`
- **URL**: `https://github.com/guiduarte-personal/meu-treino`
- **GitHub Pages**: `https://guiduarte-personal.github.io/meu-treino/`

### URLs em produção
- **App registro (Gui)**: `https://guiduarte-personal.github.io/meu-treino/registrar.html`
- **Dashboard aluno**: `https://guiduarte-personal.github.io/meu-treino/?api=API_URL&aluno=Nome1234` (PrimeiroNome + 4 últimos dígitos do telefone)
- **API Apps Script**: `https://script.google.com/macros/s/AKfycbxzt-SOKHMOvVoo5P6rtBsznMnGpKADmM08A4y-agd5HSERfzxLLmNLUbIRm9MfP5Cq/exec`
- **Planilha**: `https://docs.google.com/spreadsheets/d/1bFR-9YXJs4I9w14YpTf4Kw5n0lgAukrevqwPJ4fQDoE/edit`

### Identidade Visual
- **Marca**: GUI PERSONAL
- **Instagram**: @personalguiduarte
- **Paleta**: fundo claro (#f5f5f5), laranja (#e8750a) como accent, verde (#06d6a0), azul (#3a86ff), vermelho (#e63946)
- **Tipografia**: Bebas Neue (títulos/logo), Inter (corpo)
- **Tom**: profissional, clean, mobile-first

### Estrutura de arquivos
```
meu-treino/
├── index.html        # Dashboard do aluno (HTML + Chart.js)
├── registrar.html    # App de input do personal (HTML + JS)
├── Code.gs           # Google Apps Script (API) — NÃO vai pro GitHub, fica na planilha
├── README.md         # Instruções de setup
└── CLAUDE.md         # Este arquivo — contexto pro Claude Code
```

### Fluxo de deploy
1. Editar arquivos localmente
2. `git add . && git commit -m "descrição" && git push`
3. GitHub Pages atualiza automaticamente em ~1 min
4. Se alterar `Code.gs`: copiar o conteúdo → Apps Script → nova implantação

### Notas técnicas
- `Code.gs` não é commitado no GitHub (ele vive dentro do Apps Script da planilha). Está no repo apenas como referência/backup.
- Os HTMLs são single-file (CSS + JS inline) — sem build step, sem framework.
- Chart.js é carregado via CDN (v4.4.0).
- Fontes via Google Fonts (Bebas Neue + Inter).
- O app de registro usa `localStorage` para salvar a URL da API.
- O dashboard aceita tanto `?api=` (Apps Script) quanto `?csv=` (CSV publicado) como fallback.

### API Endpoints (Apps Script)
- `GET ?action=students` — lista alunos
- `GET ?action=exercises` — lista exercícios
- `GET ?action=history&aluno=NOME&from=YYYY-MM-DD&to=YYYY-MM-DD` — histórico
- `GET ?action=today&aluno=NOME` — treinos de hoje
- `POST {action:"add", aluno, exercicio, series, reps, carga, ...}` — adicionar exercício
- `POST {action:"delete", rowIndex}` — deletar linha
- `POST {action:"update", rowIndex, ...}` — atualizar linha
