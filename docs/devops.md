# ⚙️ DevOps — CareerTwin

> Ambientes, deploy, variáveis e operação.

## 1. Ambientes

| Ambiente | Onde | Banco | IA | Objetivo |
| --- | --- | --- | --- | --- |
| **Local** | `npm run dev` | Projeto Supabase de teste | `mock` (padrão) | Desenvolvimento |
| **Preview** | Vercel (PR/branch) | Mesmo Supabase (PoC) | `mock` | Validar PRs |
| **Production** | Vercel `career-twin` | Projeto Supabase | `mock` ou `xai` | Usuários reais |

> Quando o produto crescer: **dois projetos Supabase** (dev/prod).

**Projeto Vercel atual:** `log-null-sec/career-twin`  
**URL produção:** https://career-twin-sigma.vercel.app  
**Repo:** https://github.com/akamitatrush/CareerTwin  

## 2. Variáveis de ambiente

| Variável | Escopo | Sensível? | Descrição |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Não | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Não (pública; RLS protege) | Chave anon/publishable |
| `NEXT_PUBLIC_APP_URL` | client + server | Não | Base URL (`http://localhost:3000` ou domínio Vercel) |
| `AI_PROVIDER` | server | Não | `mock` · `xai` · `grok` · `openai` |
| `XAI_API_KEY` | server | **Sim** | Só com provider xAI/Grok |
| `XAI_MODEL` | server | Não | Default `grok-3-mini` |
| `OPENAI_API_KEY` | server | **Sim** | Só com provider openai |
| `OPENAI_MODEL` | server | Não | Default `gpt-4o-mini` |

**Nunca** no cliente / no Git: `service_role`, tokens Vercel, chaves de IA com `NEXT_PUBLIC_`.

Na Vercel: **Settings → Environment Variables** (Production / Preview / Development). Variável nova → **Redeploy**.

## 3. Deploy (Vercel)

1. Repo GitHub `CareerTwin` importado (ou linkado)  
2. Envs configuradas  
3. `git push` na `main` → Production; PR → Preview  

CLI (com token ou login):

```bash
vercel link --project career-twin
vercel deploy --prod
```

**Erros comuns:**

| Sintoma | Causa | Correção |
| --- | --- | --- |
| App quebra sem Supabase | Env ausente no build | Adicionar vars + Redeploy |
| Login ok, dados vazios | Migration não rodada | SQL Editor: `001_initial_schema.sql` |
| Cadastro pede e-mail eterno | Confirm email + SMTP free | Desligar Confirm email (teste) ou SMTP (prod) |
| `email rate limit` | Free tier Supabase | Esperar ~1h; Confirm email OFF |
| Redirect errado pós-login | Site URL não atualizada | Auth → URL: domínio Vercel + `/auth/callback` |

## 4. Banco de dados (Supabase)

- Migration única inicial: `supabase/migrations/001_initial_schema.sql`  
- Inclui: tabelas, RLS, storage bucket `career-documents`, seeds (`plans`, `market_jargons`), trigger de perfil  
- Auth: Email provider ON; Confirm email OFF em teste  

## 5. Estratégia de branches (sugerida)

| Branch | Uso |
| --- | --- |
| `main` | Produção |
| `feat/*` / `fix/*` | Trabalho + PR |
| Preview Vercel | Automático por PR |

## 6. Checklist pós-deploy

- [ ] Home carrega com logo  
- [ ] Cadastro/login  
- [ ] Nova análise (mock)  
- [ ] Resultado com 5 abas  
- [ ] Marcar recomendação/ação  
- [ ] Redirect auth aponta para o domínio certo  
