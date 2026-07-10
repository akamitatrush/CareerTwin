# 🏗 Arquitetura Técnica — CareerTwin

> Como o CareerTwin é construído: front-end, back-end, camada de IA e decisões. Diagramas de alto nível também no [README](../README.md). Detalhe da IA: [ia.md](ia.md).

## 1. Visão geral

Aplicação **Next.js 16 (App Router)** única — SSR + API routes no mesmo deploy — com **Supabase** (Auth, Postgres, Storage) e camada de IA plugável (`mock` | `xai`/`grok` | `openai`).

```
Navegador ── HTTPS ──▶ Next.js (Vercel) ──▶ Supabase (Auth + Postgres/RLS + Storage)
                          │
                          └──▶ lib/ai → Mock | xAI Grok | OpenAI
```

**Por que essa stack:** MVP com segurança real. Supabase entrega auth + banco + RLS + storage; Next unifica front e API; a IA isolada permite demo sem custo e produção sem reescrever o app.

## 2. Front-End

### Organização

| Camada | Onde | Padrão |
| --- | --- | --- |
| Rotas e páginas | `src/app/` | Landing e auth públicas; `(app)/` protegido |
| Design system | `src/components/ui.tsx` + tokens em `globals.css` | Marca laranja `#FF5922`, CVA nos botões |
| Feature | `AnalysisWizard`, `AnalysisResult`, `AppHeader`, `Logo` | Domínio de carreira |
| Tipos | `src/lib/types.ts` | Espelham o banco |
| Labels pt-BR | `src/lib/labels.ts` | Enums sem acento → rótulos com acento |

### Server × Client

- **Server Components:** dashboard, resultado (`analise/[id]`), layout app — leem Supabase com sessão (cookies).
- **Client Components:** wizard, abas, login/cadastro, header com logout, marcação de status via `fetch` às APIs.
- **Regra:** dados sensíveis e listagens no server; interatividade no client; RLS sempre no banco.

### Design system

`Button`, `Card`, `Badge`, `Input`, `Textarea`, `Label`, `ScoreRing`, `ProgressBar`, `Alert`, `EmptyState`, `PageShell`, `Logo`.

**Convenções:** Tailwind v4; tokens CSS da marca; contraste legível; microcopy pt-BR; mobile-first.

### Fluxos com estado complexo

- **`AnalysisWizard`** — passos 0–7, uploads Storage, texto colado, reanálise via `?reanalise=`.
- **`AnalysisResult`** — 5 abas; update de status com persistência (`/api/recommendations`, `/api/actions`); feedback (`/api/feedback`).

## 3. Back-End

### API routes

| Rota | Papel |
| --- | --- |
| `POST /api/analyze` | Orquestra análise: ownership → jargões → IA → persistência → créditos → versão (reanálise) |
| `PATCH /api/recommendations/[id]` | Status da recomendação |
| `PATCH /api/actions/[id]` | Status da ação do plano |
| `POST /api/feedback` | Feedback pós-análise |
| `GET /auth/callback` | Exchange de código Supabase Auth |

### Sequência de `POST /api/analyze`

1. `getUser()` — 401 se sem sessão  
2. Valida `analysis_id` e `user_id`  
3. `SELECT terms FROM market_jargons WHERE area = …`  
4. `generateCareerAnalysis` (mock / xAI / OpenAI)  
5. `persistAnalysisResult` (recommendations, fit, translations, plan)  
6. Atualiza `user_credits`  
7. Se reanálise: `analysis_versions` + status `reanalyzed` na original  

### Modelo de dados

Tabelas principais (migration `supabase/migrations/001_initial_schema.sql`):

`user_profiles` · `career_analyses` · `user_documents` · `recommendations` · `fit_diagnostics` · `experience_translations` · `evolution_plans` · `analysis_versions` · `analysis_feedback` · `market_jargons` · `plans` · `user_credits`

Convenções:

- Enums minúsculo sem acento (`comunicacao`, `concluida`)  
- `"current_role"` entre aspas (reservado no Postgres)  
- `ON DELETE CASCADE` a partir de `auth.users`  
- Trigger cria perfil + créditos no signup  

### Camada de IA (`src/lib/ai/`)

| Arquivo | Papel |
| --- | --- |
| `systemPrompt.ts` | Peça 1 — regras e formato |
| `userPrompt.ts` | Peça 2 — materiais variáveis |
| `generateCareerAnalysis.ts` | Dispatcher + fallback mock |
| `schema.ts` | Zod — contrato de saída |
| `mockAnalysis.ts` | Mock determinístico |
| `persistAnalysis.ts` | Escrita no Supabase |

Detalhe completo: [ia.md](ia.md).

## 4. Decisões de arquitetura (ADR resumido)

| # | Decisão | Alternativa rejeitada | Motivo |
| --- | --- | --- | --- |
| 1 | Supabase BaaS | Backend Node próprio | Auth+RLS+Storage em dias |
| 2 | Geração síncrona na API | Fila assíncrona | Mock instantâneo; MVP simples |
| 3 | Provider por env + fallback | Acoplamento a um SDK | Demo sem custo |
| 4 | Texto colado como fonte primária | Parser PDF server-side | Honestidade da UI; parser depois |
| 5 | Zod no schema de saída | “Confiar no parse da LLM” | UI estável |
| 6 | Mutações de status via API | Só client→Supabase | Controle e validação de enum |
| 7 | 3 status de análise | Workflow complexo | Suficiente para o ciclo do MVP |

## 5. Pontos de extensão

- **Parser PDF/DOCX** no wizard ou na API antes da IA  
- **Novos providers** no dispatcher de `generateCareerAnalysis`  
- **Fila** (Inngest/QStash) se volume exigir  
- **Chat de refinamento** sobre uma análise existente  
- **pgvector** sobre vagas reais (Fase 3 da IA)  
