# 🚀 Onboarding — entrando no CareerTwin

> Meta: **produtivo em menos de 1 hora**.

## 1. Acessos

| Acesso | Quem concede | Quando |
| --- | --- | --- |
| **GitHub** (obrigatório) | Admin do repo `CareerTwin` | Sempre |
| **Supabase** (opcional) | Dono do projeto | Mexer em SQL/Auth/Storage |
| **Vercel** (opcional) | Dono do time `log-null-sec` | Logs, envs, domínio |

### Política de segredos

- ✅ Pode circular: URL Supabase + **anon/publishable**  
- ❌ Nunca: `service_role`, tokens Vercel, `XAI_API_KEY` / `OPENAI_API_KEY`, `.env.local`  

## 2. Setup local (~10 minutos)

Pré-requisito: **Node.js 20+**.

```bash
git clone https://github.com/akamitatrush/CareerTwin.git
cd CareerTwin
npm install
cp .env.example .env.local
# Preencher:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# NEXT_PUBLIC_APP_URL=http://localhost:3000
# AI_PROVIDER=mock
npm run dev
```

Abra http://localhost:3000.

### Supabase (se o banco ainda estiver vazio)

1. SQL Editor → colar `supabase/migrations/001_initial_schema.sql` → Run  
2. Auth → Email provider **ON**  
3. Confirm email **OFF** (teste)  
4. Site URL: `http://localhost:3000`  
5. Redirect: `http://localhost:3000/auth/callback`  

### Sanity check

1. Criar conta (Gmail costuma funcionar melhor que domínio próprio no free tier)  
2. Nova análise com **texto colado** de currículo  
3. Ver resultado nas **5 abas**  
4. Marcar uma recomendação como feita  

## 3. Leitura de contexto (~20 minutos)

1. [README](../README.md)  
2. Sua área:  
   - PO → [produto.md](produto.md) · [prd.md](prd.md) · [one-page.md](one-page.md)  
   - Dev → [arquitetura.md](arquitetura.md) · [ia.md](ia.md) · [seguranca.md](seguranca.md)  
   - Ops → [devops.md](devops.md)  
3. Contribuir com agente → [claude-code.md](claude-code.md)  

## 4. Estrutura mental do repo

```text
src/app/           páginas + API
src/components/    UI + wizard + resultado + logo
src/lib/ai/        prompts, mock, schema, providers
src/lib/supabase/  client / server / middleware
supabase/migrations/
docs/              você está aqui
```

## 5. Primeira contribuição

1. Branch a partir de `main`  
2. Mudança pequena + `npm run build`  
3. PR no GitHub  
4. Review do time  
5. Merge → deploy Vercel (se `main` estiver conectada)  

## 6. Produção (referência)

- App: https://career-twin-sigma.vercel.app  
- Repo: https://github.com/akamitatrush/CareerTwin  
