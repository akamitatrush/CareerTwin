# TwinJobs

Mentor de carreira com IA para profissionais brasileiros em recolocação ou transição.

O TwinJobs ajuda a melhorar currículo e LinkedIn, avaliar aderência a cargos e vagas, traduzir experiências reais para linguagem de mercado e montar um plano prático de evolução — **sem prometer contratação e sem inventar experiências**.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Supabase** Auth, Postgres (RLS), Storage (bucket privado)
- **IA**: modo `mock` (padrão), **Grok/xAI** (`AI_PROVIDER=xai`) ou OpenAI (`AI_PROVIDER=openai`)

## Funcionalidades do MVP

1. **Fluxo de nova análise** — wizard guiado com currículo, LinkedIn, cargo-alvo, vaga opcional e complementos
2. **Resultado estruturado** — abas Visão geral, Recomendações, Aderência, Tradução e Plano
3. **Dashboard** — histórico, progresso, reanálise e comparativo de scores
4. Auth (cadastro, login, logout, recuperação de senha)
5. Marcação de recomendações e ações como concluídas (persistente)
6. Feedback pós-análise + nota de confiança
7. Tela de planos freemium (sem checkout real)
8. RLS em todas as tabelas; storage privado por pasta de usuário

## Pré-requisitos

- Node.js 20+
- Conta [Supabase](https://supabase.com) (projeto gratuito basta)

## Configuração

### 1. Instalar dependências

```bash
cd twinjobs
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave **anon/public** (nunca service_role no app) |
| `NEXT_PUBLIC_APP_URL` | Ex.: `http://localhost:3000` |
| `AI_PROVIDER` | `mock` (padrão), `xai` / `grok`, ou `openai` |
| `XAI_API_KEY` | Chave em [console.x.ai](https://console.x.ai) se usar Grok |
| `XAI_MODEL` | Opcional, padrão `grok-3-mini` |
| `OPENAI_API_KEY` | Só se `AI_PROVIDER=openai` |
| `OPENAI_MODEL` | Opcional, padrão `gpt-4o-mini` |

### Usar Grok (xAI) na análise

```env
AI_PROVIDER=xai
XAI_API_KEY=xai-sua-chave
XAI_MODEL=grok-3-mini
```

Reinicie o `npm run dev`. Se a API falhar ou o JSON for inválido, o app cai no **mock** automaticamente.

### 3. Banco e Storage

No Supabase SQL Editor, execute o arquivo completo:

```
supabase/migrations/001_initial_schema.sql
```

Isso cria:

- Tabelas com `ON DELETE CASCADE` a partir de `auth.users`
- Trigger de `user_profiles` + `user_credits` no cadastro
- **RLS** em todas as tabelas
- Bucket privado `career-documents` com policies por pasta `user_id/...`
- Seeds de `plans` e `market_jargons`

### 4. Auth no Supabase

Em **Authentication → Providers**, habilite Email.

Em **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

**Recuperação de senha:** exige SMTP configurado (Authentication → Emails / SMTP). Se o envio falhar, a UI mostra erro claro em vez de falhar em silêncio.

Para desenvolvimento rápido, desative “Confirm email” em Authentication → Providers → Email.

### 5. Rodar

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Uso rápido

1. Crie uma conta em `/cadastro`
2. Vá em **Nova análise**
3. Cole o **texto** do currículo (PDF é só armazenado neste MVP — a UI deixa isso explícito)
4. Informe LinkedIn (URL + texto) e cargo-alvo
5. Gere a análise e explore as abas
6. Marque recomendações/ações como feitas
7. Faça reanálise para ver o comparativo de scores

## Arquitetura da IA

`src/lib/ai/generateCareerAnalysis.ts` em 3 peças:

1. **System prompt** (`systemPrompt.ts`) — papel, 15 regras, faixas de score, textos de recomendação final  
2. **User prompt** (`userPrompt.ts`) — materiais da pessoa  
3. **Market jargons** — consulta `market_jargons` por área e injeta termos no prompt  

Modo `mock`: saída realista e **determinística** (mesma entrada → mesma saída).  
Modo `openai`: valida JSON com Zod; se falhar, usa mock como fallback.

## Segurança

- Apenas chave **anon** no cliente e nas server actions/rotas
- RLS: `auth.uid() = user_id` (filhas via join com `career_analyses`)
- Storage: path deve começar com o UUID do usuário
- Enums no banco em minúsculo sem acento; rótulos com acento só na UI (`src/lib/labels.ts`)

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servir build
npm run lint     # eslint
```

## Estrutura

```
src/
  app/                 # páginas e API routes
  components/          # UI, wizard, resultado
  lib/
    ai/                # generateCareerAnalysis, mock, schema
    supabase/          # client, server, middleware
    labels.ts          # mapas enum → pt-BR
    types.ts
supabase/migrations/   # SQL com RLS + seeds
```

## Limitações honestas do MVP

- Extração de PDF/DOC **não implementada** — arquivo é guardado; análise usa texto colado ou `.txt`
- LinkedIn: sem scraping — só URL + texto/PDF enviado
- Pagamento freemium: UI e tabelas prontas, sem checkout
- IA real opcional; mock cobre toda a interface

## Licença

Uso educacional / MVP de produto. Ajuste conforme sua necessidade.
