# 🔒 Segurança — CareerTwin

> Autenticação, autorização, storage e segredos.

## 1. Princípios

1. **Defesa em profundidade:** middleware (rota) + RLS (dados) + policies de Storage  
2. **Menor privilégio:** só chave **anon/publishable** no app — **nunca** `service_role`  
3. **Dados do usuário pertencem ao usuário:** acesso filtrado por `auth.uid()`  

## 2. Autenticação e sessão

- **Supabase Auth** e-mail/senha  
- Sessão em cookies via `@supabase/ssr`  
- `src/middleware.ts` + `src/lib/supabase/middleware.ts`: renova sessão; redireciona não autenticados de `/dashboard`, `/analise`, `/planos`, `/configuracoes`  
- Logado em `/login` ou `/cadastro` → redireciona ao dashboard  
- Callback: `src/app/auth/callback/route.ts`  
- Recuperação de senha: UI com erro claro se SMTP falhar  

## 3. Autorização — Row Level Security

RLS em **todas** as tabelas (ver migration).

| Tabela | Política |
| --- | --- |
| `user_profiles`, `career_analyses`, `user_documents`, `analysis_versions`, `analysis_feedback`, `user_credits` | `auth.uid() = user_id` |
| `recommendations`, `fit_diagnostics`, `experience_translations`, `evolution_plans` | Via join: análise do usuário |
| `market_jargons`, `plans` | Leitura para autenticados (jargons); plans também anon para landing futura |

**Consequência:** anon key no browser **não** permite ler dados de outro usuário.

## 4. Storage

- Bucket **`career-documents`** privado  
- Path: `{user_id}/{analysis_id}/…`  
- Policies: pasta do `auth.uid()`  
- Tipos: PDF, DOC, DOCX, TXT, imagens leves  

## 5. Segredos e chaves

| Chave | Classificação | Regra |
| --- | --- | --- |
| Anon/publishable | Pública | Bundle ok; RLS protege |
| `XAI_API_KEY` / `OPENAI_API_KEY` | **Secreta** | Só server; nunca `NEXT_PUBLIC_` |
| Token Vercel | **Secreta** | Não commitar; revogar se vazou no chat |
| `service_role` | **Proibida no app** | Não usar neste MVP |

## 6. Dados e privacidade

- Cascade ao excluir usuário (`ON DELETE CASCADE`)  
- Produto **não** faz scraping de LinkedIn  
- PDF não é “lido” secretamente — UI é honesta  
- Feedback e análises são do próprio usuário  

## 7. Checklist de segurança (MVP)

- [x] RLS em todas as tabelas  
- [x] Storage privado por pasta  
- [x] Middleware de rotas protegidas  
- [x] Sem service_role no código  
- [x] `.env*` no `.gitignore`  
- [ ] Separar Supabase dev/prod (futuro)  
- [ ] Rate limit de API de análise (futuro)  
