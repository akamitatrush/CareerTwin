# 📄 PRD — CareerTwin MVP

> Deriva do [One Page](one-page.md) e da [Jornada](jornada-usuario.md). Stories: [produto.md](produto.md).  
> **Status:** vivo · **Legenda:** ✅ implementado · 🔨 parcial · 📋 planejado

---

## 1. Contexto e problema

Profissionais brasileiros em recolocação/transição sofrem com falta de **diagnóstico**, **tradução** da experiência, **priorização** e **acompanhamento**. Detalhe e narrativa de mercado: [one-page.md](one-page.md).

## 2. Objetivos do MVP

1. Validar que a análise é **clara, útil e específica** (não genérica)  
2. Validar que recomendações geram **ação** (marcar feito / voltar)  
3. Validar **intenção de pagamento** (sem construir cobrança)  
4. Validar **segurança multi-tenant** (RLS)  

### Métricas de sucesso (piloto)

| Métrica | Como medir | Alvo proposto* |
| --- | --- | --- |
| Conclusão da 1ª análise | wizard → resultado | ≥ 70% |
| Diagnóstico útil | `analysis_feedback` | ≥ 70% util+parcial |
| Executou ≥ 1 recomendação | status `concluida` | ≥ 40% |
| Retorno para reanálise | `analysis_versions` | ≥ 25% |
| Intenção de pagamento | pesquisa / tela planos | qualitativo no piloto |

\*Calibrar com o time antes do teste com 10–30 usuários.

## 3. Não-objetivos

Integração automática LinkedIn · busca de vagas · scraping · mock interview · tracker de candidaturas · B2B · **checkout implementado**.

## 4. Personas

Ver [produto.md §2](produto.md#2-personas).

## 5. Requisitos funcionais

| ID | Requisito | Status |
| --- | --- | --- |
| RF01 | Cadastro e login e-mail/senha | ✅ |
| RF02 | Logout e proteção de rotas | ✅ |
| RF03 | Wizard de nova análise (8 etapas) | ✅ |
| RF04 | Upload Storage + texto colado | ✅ |
| RF05 | Cargo-alvo / sugestões de cargo | ✅ |
| RF06 | Vaga específica opcional | ✅ |
| RF07 | Gerar análise (mock/xAI/OpenAI) | ✅ |
| RF08 | Resultado com 5 abas | ✅ |
| RF09 | Filtrar e marcar recomendações | ✅ |
| RF10 | Marcar ações do plano | ✅ |
| RF11 | Dashboard e histórico | ✅ |
| RF12 | Reanálise + comparativo de score | ✅ |
| RF13 | Nota de confiança | ✅ |
| RF14 | Feedback pós-análise | ✅ |
| RF15 | Tela de planos freemium (sem pay) | ✅ |
| RF16 | Configurações de perfil | ✅ |
| RF17 | Jargões de mercado por área | ✅ |
| RF18 | Parser real de PDF | 📋 |
| RF19 | Pagamento | 📋 |

## 6. Requisitos não funcionais

| ID | Requisito | Status |
| --- | --- | --- |
| RNF01 | RLS em todas as tabelas | ✅ |
| RNF02 | Storage privado por usuário | ✅ |
| RNF03 | UI pt-BR responsiva | ✅ |
| RNF04 | Schema JSON estável (Zod) | ✅ |
| RNF05 | Fallback mock se IA falhar | ✅ |
| RNF06 | Deploy Vercel | ✅ |
| RNF07 | Enums canônicos sem acento | ✅ |

## 7. Regras de negócio da análise

- Score 0–100 com faixas fixas de nível de aderência  
- Confiança pela completude dos materiais  
- Vereditos de vaga: textos exatos (“Aplicar agora.”, etc.)  
- Traduções sempre com `authenticity_warning`  
- Não inventar experiência, métrica, ferramenta ou certificação  

## 8. Telas

| Tela | Rota |
| --- | --- |
| Landing | `/` |
| Login / Cadastro / Recuperar | `/login` `/cadastro` `/recuperar-senha` |
| Dashboard | `/dashboard` |
| Nova análise | `/analise/nova` |
| Resultado | `/analise/[id]` |
| Planos | `/planos` |
| Configurações | `/configuracoes` |

## 9. Critérios de aceite do MVP (checklist)

- [x] Conta e login  
- [x] Análise com currículo + LinkedIn + cargo  
- [x] Vaga opcional  
- [x] Persistência Supabase  
- [x] 5 abas  
- [x] Marcar feitos  
- [x] Histórico e reanálise  
- [x] RLS  
- [x] README + docs  
- [x] Deploy em produção  

## 10. Riscos

| Risco | Mitigação |
| --- | --- |
| IA genérica / inventiva | System prompt + Zod + fallback mock |
| Expectativa de “emprego garantido” | Copy de honestidade em toda a UI |
| PDF “não lido” | Mensagem honesta no wizard |
| Rate limit e-mail Supabase | Confirm email OFF em teste |
