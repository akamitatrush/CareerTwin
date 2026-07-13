# Graphify no CareerTwin (Grok Build)

O [Graphify](https://github.com/Graphify-Labs/graphify) mapeia o projeto em um **grafo de conhecimento** (não é vector DB). Código via AST local (sem custo de LLM).

## Instalação (já feita nesta máquina)

```bash
# CLI
export PATH="$HOME/.local/bin:$PATH"
uv tool install graphifyy   # ou: uvx --from graphifyy graphify …

# Skill no Grok
# ~/.grok/skills/graphify/SKILL.md

# Skill genérica (agents)
# ~/.agents/skills/graphify/SKILL.md
# .agents/skills/graphify/  (no repo)
```

## Uso

No chat com o Grok:

```
/graphify .
/graphify query "Como funciona a análise de carreira?"
/graphify explain "generateCareerAnalysis"
/graphify path "LandingPage" "POST /api/analyze"
```

No terminal:

```bash
cd ~/peabirujobs
graphify update .          # atualiza grafo de código (sem LLM)
graphify query "..." 
# abra no browser:
xdg-open graphify-out/graph.html   # ou file://.../graphify-out/graph.html
```

## Saídas

```
graphify-out/
├── graph.html        # visual interativo
├── GRAPH_REPORT.md   # destaques e comunidades
└── graph.json        # grafo completo
```

## Notas

- `graphify-out/` está no `.gitignore` (artefato local).
- PDF/docs semânticos usam LLM se houver API key configurada (Gemini etc.); código não precisa.
- Cursor: regra em `.cursor/rules/graphify.mdc`.
