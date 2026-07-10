# CareerTwin

<p align="center">
  <img src="public/logo-careertwin.png" alt="CareerTwin" width="220" />
</p>

<p align="center">
  <strong>Evolua, Reposicione e Conquiste.</strong><br/>
  Mentor digital para profissionais brasileiros em <em>recolocação</em> ou <em>transição de carreira</em>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB%20%2B%20Storage-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Zod" src="https://img.shields.io/badge/Zod-Schema-3068B7?style=for-the-badge&logo=zod&logoColor=white" />
  <img alt="xAI Grok" src="https://img.shields.io/badge/IA-Grok%20%7C%20OpenAI%20%7C%20Mock-111111?style=for-the-badge" />
  <img alt="License" src="https://img.shields.io/badge/License-MVP%20%2F%20Educacional-orange?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-em-uma-frase">O que é</a> ·
  <a href="#-prd-para-product-owners">PRD</a> ·
  <a href="#-como-funciona-fluxo-do-usuário">Fluxo</a> ·
  <a href="#-arquitetura">Arquitetura</a> ·
  <a href="#-subir-localmente-passo-a-passo">Subir local</a> ·
  <a href="#-variáveis-de-ambiente">Env</a> ·
  <a href="#-limitações-honestas-do-mvp">Limitações</a>
</p>

---

## 📌 Em uma frase

> O **CareerTwin** analisa o que a pessoa **já tem** (currículo, LinkedIn, cargo-alvo e opcionalmente uma vaga) e devolve um **diagnóstico acionável**: o que melhorar, se o perfil adere ao cargo, como comunicar melhor a experiência e um **plano de evolução** — **sem prometer emprego** e **sem inventar trajetória**.

---

## 🎯 Para quem é este projeto?

| Perfil | O que encontra aqui |
|--------|---------------------|
| 👤 **Usuário final** | App web para se reposicionar no mercado com clareza |
| 🧑‍💼 **PO / PM / Designer** | PRD do MVP, escopo, o que entra / o que não entra |
| 👩‍💻 **Dev** | Como clonar, configurar Supabase, rodar e estender |
| 🧪 **QA / tester** | Fluxo feliz de ponta a ponta e limitações conhecidas |

Se você **nunca programou**, ainda consegue entender a seção [O que o produto faz](#-o-que-o-produto-faz) e o [fluxo do usuário](#-como-funciona-fluxo-do-usuário).  
Se você **quer rodar na máquina**, pule para [Subir localmente](#-subir-localmente-passo-a-passo).

---

## ✨ O que o produto faz

### ✅ Faz

- Conta + login (e-mail e senha)
- Wizard de **nova análise** (currículo, LinkedIn, cargo, vaga opcional)
- Resultado em **5 abas**: Visão geral · Recomendações · Aderência · Tradução · Plano
- Marcar recomendações e ações como **concluídas** (salva no banco)
- **Dashboard** com histórico e progresso
- **Reanálise** com comparativo de score
- Feedback “esta análise foi útil?”
- Tela de **planos freemium** (só visual no MVP — sem cobrança)
- Dados **isolados por usuário** (Row Level Security)

### ❌ Não faz (de propósito)

| Não faz | Por quê |
|---------|--------|
| Prometer contratação | Produto é mentor, não headhunter |
| Inventar experiências / métricas | Integridade e confiança |
| Scraping do LinkedIn | Só URL + texto/PDF que o usuário envia |
| Ler PDF magicamente (MVP) | Arquivo é guardado; texto da análise vem do **campo colado** ou `.txt` |
| Checkout / pagamento real | Estrutura preparada, cobrança fica para depois |
| Substituir recrutador | Apoia decisão e comunicação do candidato |

---

## 📄 PRD para Product Owners

### Visão do produto

**Nome:** CareerTwin (gêmeo de carreira — seu “twin” profissional)  
**Tipo:** B2C web  
**Mercado:** Brasil (UI 100% pt-BR)  
**Proposta de valor:** clareza de posicionamento na recolocação, com honestidade.

### Problema

Profissionais em transição:

1. Comunicam mal o que já fizeram  
2. Não sabem se o perfil “cola” no cargo/vaga  
3. Recebem conselhos genéricos ou genéricos de IA que **inventam** currículo  

### Solução (MVP)

Um fluxo guiado que transforma materiais reais em:

1. Recomendações priorizadas (currículo / LinkedIn / posicionamento)  
2. Score de aderência ao cargo e à vaga  
3. Tradução de experiência → linguagem de mercado (com alerta de autenticidade)  
4. Plano de ações com status  

### Objetivos de negócio do MVP

| Objetivo | Como medimos |
|----------|----------------|
| Validar se a análise é útil | Tabela `analysis_feedback` |
| Validar retenção do fluxo | Análises criadas + reanálises |
| Validar freemium futuro | Tela de planos + `user_credits` / `plans` |
| Validar segurança | RLS: usuário A não vê dados do B |

### Personas

1. **Recolocação operacional / administrativo** — narrativa fraca, pouca evidência  
2. **TI sênior em transição** — stack forte, posicionamento confuso no LinkedIn  
3. **Pessoa que “não sabe o cargo”** — quer 2–3 sugestões honestas de direção  

### Features prioritárias (já no código)

| # | Feature | Status MVP |
|---|---------|------------|
| 1 | Fluxo de nova análise | ✅ |
| 2 | Resultado estruturado com IA (mock / Grok / OpenAI) | ✅ |
| 3 | Dashboard + reanálise | ✅ |
| — | Auth Supabase | ✅ |
| — | Storage privado | ✅ |
| — | Planos freemium (UI) | ✅ (sem pagamento) |
| — | Extração real de PDF | ❌ (explícito na UI) |

### Regras de ouro do produto (não negociáveis)

1. Não inventar experiência  
2. Não criar métricas falsas  
3. Não prometer aprovação em vaga  
4. Diferenciar lacuna **real** × **comunicação** × **evidência**  
5. Enums no banco **sem acento** (`concluida`, `comunicacao`); rótulos com acento só na UI  

### Fora de escopo (próximas fases)

- Pagamento (Stripe etc.)  
- App mobile nativo  
- Matching com vagas em tempo real  
- Parser robusto de PDF/DOCX  
- Multi-idioma  

### Critérios de aceite (checklist do MVP)

- [x] Cadastro e login  
- [x] Criar análise com currículo + LinkedIn + cargo  
- [x] Vaga opcional  
- [x] Persistir no Supabase  
- [x] Resultado com abas  
- [x] Marcar itens como feitos  
- [x] Histórico no dashboard  
- [x] Reanálise  
- [x] RLS por usuário  
- [x] README com setup  

---

## 🔄 Como funciona (fluxo do usuário)

```mermaid
flowchart TD
  A([👤 Entra no CareerTwin]) --> B{Tem conta?}
  B -->|Não| C[📝 Cadastro]
  B -->|Sim| D[🔐 Login]
  C --> E[📊 Dashboard]
  D --> E
  E --> F[➕ Nova análise]
  F --> G[📄 Currículo<br/>texto ou arquivo]
  G --> H[💼 LinkedIn<br/>URL + texto]
  H --> I[🎯 Cargo-alvo<br/>área + senioridade]
  I --> J{Tem vaga específica?}
  J -->|Sim| K[📎 Cola descrição da vaga]
  J -->|Não| L[Pula etapa]
  K --> M[📎 Complementos opcionais]
  L --> M
  M --> N[✅ Revisão]
  N --> O[⚙️ Processamento / IA]
  O --> P[📑 Resultado em 5 abas]
  P --> Q[✔️ Marca ações feitas]
  P --> R[🔁 Reanálise depois]
  R --> O
  P --> S[💬 Feedback da análise]

  style A fill:#1f5c45,color:#fff
  style P fill:#c45c26,color:#fff
  style O fill:#3178C6,color:#fff
  style E fill:#0f766e,color:#fff
```

### As 5 abas do resultado

| Aba | O que a pessoa leva |
|-----|---------------------|
| **Visão geral** | Diagnóstico, confiança, score, cargos sugeridos (se pediu) |
| **Recomendações** | Lista priorizada + filtros + “marcar como feita” |
| **Aderência** | Score 0–100, cargo e/ou vaga, tipos de lacuna |
| **Tradução** | Original → versão mercado + alerta de autenticidade |
| **Plano** | Ações com prazo, prioridade e progresso |

---

## 🏗 Arquitetura

### Visão de alto nível

```mermaid
flowchart LR
  subgraph Client["🌐 Browser"]
    UI[Next.js App Router<br/>React + Tailwind]
  end

  subgraph VercelOrLocal["☁️ Next.js Server"]
    MW[Middleware Auth]
    API["/api/analyze<br/>/api/recommendations<br/>/api/actions<br/>/api/feedback"]
    AI[generateCareerAnalysis]
  end

  subgraph Supa["🟢 Supabase"]
    AUTH[Auth]
    DB[(Postgres + RLS)]
    ST[(Storage privado<br/>career-documents)]
  end

  subgraph LLM["🧠 Provedores de IA"]
    MOCK[Mock determinístico]
    XAI[xAI Grok]
    OAI[OpenAI]
  end

  UI --> MW
  UI --> AUTH
  UI --> API
  API --> DB
  API --> ST
  API --> AI
  AI --> MOCK
  AI --> XAI
  AI --> OAI
  AUTH --> DB

  style Client fill:#0f172a,color:#fff
  style Supa fill:#064e3b,color:#fff
  style LLM fill:#1e3a5f,color:#fff
```

### Pipeline da análise (IA)

```mermaid
sequenceDiagram
  participant U as Usuário
  participant W as Wizard
  participant API as POST /api/analyze
  participant DB as Supabase DB
  participant AI as generateCareerAnalysis
  participant LLM as Mock / Grok / OpenAI

  U->>W: Envia materiais + cargo
  W->>DB: Cria career_analyses + user_documents
  W->>API: analysis_id + textos
  API->>DB: Valida dono da análise + market_jargons
  API->>AI: Input estruturado
  AI->>LLM: System + User prompt (+ termos de mercado)
  LLM-->>AI: JSON da análise
  AI->>AI: Valida com Zod
  Note over AI: Se inválido / erro → fallback mock
  AI-->>API: Resultado válido
  API->>DB: recommendations, fit, translations, plan
  API-->>W: ok + analysis_id
  W->>U: Redirect /analise/[id]
```

### Stack tecnológica (com cores 🎨)

| Camada | Tecnologia | Badge |
|--------|------------|-------|
| Framework | **Next.js 16** (App Router) | ![Next](https://img.shields.io/badge/Next.js-black?logo=nextdotjs&logoColor=white) |
| UI | **React 19** + **Tailwind CSS 4** | ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![TW](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white) |
| Linguagem | **TypeScript 5** | ![TS](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) |
| Auth / DB / Files | **Supabase** (Auth, Postgres, Storage) | ![SB](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white) |
| Validação IA | **Zod** | ![Zod](https://img.shields.io/badge/Zod-3068B7) |
| Ícones | **Lucide React** | ![Lucide](https://img.shields.io/badge/Lucide-icons-000) |
| IA | **Mock** · **xAI Grok** · **OpenAI** | ![AI](https://img.shields.io/badge/AI-multi_provider-111) |
| Deploy alvo | **Vercel** (+ GitHub) | ![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white) |

### Estrutura de pastas (mapa mental)

```text
CareerTwin/
├── README.md                 ← você está aqui
├── .env.example              ← modelo de variáveis (sem segredos)
├── package.json
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   ← rode isso no SQL Editor
└── src/
    ├── app/                  ← páginas e rotas
    │   ├── page.tsx          ← Landing
    │   ├── login/ cadastro/ recuperar-senha/
    │   ├── (app)/            ← área logada
    │   │   ├── dashboard/
    │   │   ├── analise/nova  ← wizard
    │   │   ├── analise/[id]  ← resultado
    │   │   ├── planos/
    │   │   └── configuracoes/
    │   ├── api/              ← analyze, recommendations, actions, feedback
    │   └── auth/callback/
    ├── components/           ← UI, wizard, resultado
    ├── lib/
    │   ├── ai/               ← prompts, mock, schema, Grok/OpenAI
    │   ├── supabase/         ← client / server / middleware
    │   ├── labels.ts         ← enums → pt-BR com acento
    │   └── types.ts
    └── middleware.ts         ← protege rotas logadas
```

---

## 🚀 Subir localmente (passo a passo)

> Tempo estimado: **15–25 min** na primeira vez (conta Supabase + SQL).  
> Depois: **1 min** com `npm run dev`.

### 0. O que você precisa ter instalado

| Ferramenta | Versão | Como checar |
|------------|--------|-------------|
| Node.js | 20+ (ideal 22) | `node -v` |
| npm | vem com o Node | `npm -v` |
| Conta | [supabase.com](https://supabase.com) | grátis ok |
| Git | qualquer recente | `git --version` |

Não precisa de Docker.

---

### 1. Clonar o repositório

```bash
git clone https://github.com/akamitatrush/CareerTwin.git
cd CareerTwin
npm install
```

---

### 2. Criar projeto no Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)  
2. **New project** → escolha senha do banco (guarde se for usar connection string)  
3. Espere o projeto ficar **Healthy**  
4. Em **Project Settings → API**, copie:
   - **Project URL**  
   - **anon / publishable** key  

> ⚠️ Nunca use a chave **service_role** no frontend nem no app Next deste MVP.

---

### 3. Rodar o SQL (cria tabelas + segurança)

1. No Supabase: **SQL → New query**  
2. Abra o arquivo do repo:  
   `supabase/migrations/001_initial_schema.sql`  
3. **Copie tudo** → cole no editor → **Run**  

Isso cria, entre outras coisas:

- Tabelas de análise, recomendações, plano, feedback…  
- **RLS** (cada um só vê o próprio dado)  
- Bucket **privado** `career-documents`  
- Seeds de planos e jargons de mercado  

---

### 4. Configurar Auth (senão o cadastro falha)

**Authentication → Providers → Email**

| Opção | Em desenvolvimento |
|-------|--------------------|
| Enable email provider | ✅ ON |
| Confirm email | ❌ OFF (senão precisa SMTP e estoura rate limit) |

**Authentication → URL Configuration**

| Campo | Valor local |
|-------|-------------|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

---

### 5. Arquivo `.env.local`

```bash
cp .env.example .env.local
```

Edite `.env.local` (exemplo mínimo):

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publishable-ou-anon
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Comece com mock (não gasta API de IA)
AI_PROVIDER=mock
```

#### Opcional: IA real com Grok (xAI)

```env
AI_PROVIDER=xai
XAI_API_KEY=xai-...
XAI_MODEL=grok-3-mini
```

Chave em [console.x.ai](https://console.x.ai).  
Se a API falhar, o app **cai no mock** sozinho.

#### Opcional: OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

---

### 6. Subir o app

```bash
npm run dev
```

Abra: **[http://localhost:3000](http://localhost:3000)**

Se a porta 3000 estiver ocupada:

```bash
# veja o PID e mate o processo antigo, ou use a porta que o Next sugerir
```

---

### 7. Teste do “fluxo feliz” (QA rápido)

1. **Criar conta** com e-mail tipo Gmail (alguns domínios próprios o Supabase rejeita)  
2. Dashboard → **Nova análise**  
3. Cole **texto** do currículo (importante: PDF sozinho não é lido)  
4. LinkedIn: URL + um trecho de texto  
5. Cargo + área **Desenvolvimento** + senioridade **Sênior** (se for o seu caso)  
6. **Gerar análise** → explorar abas  
7. Marcar uma recomendação como feita → recarregar → deve continuar marcada  
8. (Opcional) **Reanálise**  

---

## 🔐 Variáveis de ambiente

| Variável | Obrigatória? | Descrição |
|----------|--------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Chave pública (anon/publishable) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Base do app (`http://localhost:3000` ou URL Vercel) |
| `AI_PROVIDER` | recomendado | `mock` · `xai` · `grok` · `openai` |
| `XAI_API_KEY` | se `xai` | API key xAI |
| `XAI_MODEL` | não | Default `grok-3-mini` |
| `OPENAI_API_KEY` | se `openai` | API key OpenAI |
| `OPENAI_MODEL` | não | Default `gpt-4o-mini` |
| `DATABASE_URL` | não (app) | Só se for script externo de DB |

Arquivo de referência: [`.env.example`](./.env.example)

---

## 🛡 Segurança (resumo)

```mermaid
flowchart TB
  U1[Usuário A] -->|auth.uid = A| RLS[(RLS Postgres)]
  U2[Usuário B] -->|auth.uid = B| RLS
  RLS -->|vê só| DA[Dados A]
  RLS -->|vê só| DB[Dados B]
  U1 -.->|🚫 bloqueado| DB
  U2 -.->|🚫 bloqueado| DA

  F[Upload] --> S[Storage path<br/>userId/analysisId/arquivo]
  S -->|policy pasta do user| OK[OK]
```

- Só chave **anon/publishable** no client  
- **Sem** `service_role` no código do app  
- Storage: caminho começa com o `user_id`  
- Cascade: apagar usuário remove dados relacionados  

---

## 🧠 Como a IA está organizada

Arquivo central: `src/lib/ai/generateCareerAnalysis.ts`

| Peça | Arquivo | Função |
|------|---------|--------|
| 1. System prompt | `systemPrompt.ts` | Papel + 15 regras + faixas de score |
| 2. User prompt | `userPrompt.ts` | Materiais da pessoa |
| 3. Tool / jargons | tabela `market_jargons` | Termos da área injetados no prompt |
| Schema | `schema.ts` (Zod) | Garante JSON sempre no mesmo formato |
| Mock | `mockAnalysis.ts` | Demo sem custo, determinístico |

```text
AI_PROVIDER=mock     →  sempre mock
AI_PROVIDER=xai      →  Grok; se quebrar → mock
AI_PROVIDER=openai   →  OpenAI; se quebrar → mock
```

---

## 📜 Scripts npm

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Sobe em http://localhost:3000 |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build |
| `npm run lint` | ESLint |

---

## ☁️ Deploy na Vercel (visão rápida)

1. Importe o repo `akamitatrush/CareerTwin` na Vercel  
2. Configure as **mesmas env vars** do `.env.local` (Production)  
3. `NEXT_PUBLIC_APP_URL` = URL do deploy (ex. `https://careertwin.vercel.app`)  
4. No Supabase, adicione Site URL + Redirect da Vercel  
5. Deploy  

Detalhes de domínio custom (`careertwin.com` etc.) ficam para depois.

---

## ⚠️ Limitações honestas do MVP

| Limitação | Impacto | Workaround |
|-----------|---------|------------|
| PDF/DOC não são “lidos” | Análise fraca se só enviar arquivo | **Colar o texto** do currículo |
| Sem scraping LinkedIn | Precisa colar texto do perfil | Exportar PDF + colar trechos |
| Mock não é mentor sênior real | Sugestões genéricas se `AI_PROVIDER=mock` | Usar `xai` ou `openai` |
| Rate limit de e-mail Supabase free | Cadastro trava se Confirm email ON | Confirm email **OFF** em dev |
| Freemium sem cobrança | Botões “Em breve” | Normal no MVP |
| Alguns e-mails de domínio próprio | Supabase marca `email_address_invalid` | Testar com Gmail/Outlook |

---

## 🗺 Mapa de rotas

| Rota | Público? | Função |
|------|----------|--------|
| `/` | Sim | Landing |
| `/login` `/cadastro` `/recuperar-senha` | Sim | Auth |
| `/dashboard` | Não | Histórico e resumo |
| `/analise/nova` | Não | Wizard |
| `/analise/[id]` | Não | Resultado |
| `/planos` | Não | Freemium (UI) |
| `/configuracoes` | Não | Perfil |

---

## 🤝 Contribuição / uso

MVP educacional / produto em validação.  
Sinta-se livre para fork, testes e PRs — mantenha as **regras de honestidade** do produto.

---

## 📞 FAQ de 30 segundos

**“Deu Email signups are disabled”**  
→ Supabase → Auth → Providers → Email → Enable.

**“Email rate limit exceeded”**  
→ Desligue Confirm email e espere ~1h no free tier.

**“Email is invalid” no domínio da empresa**  
→ Teste com Gmail; validação do Supabase é rígida.

**“Análise de sênior de TI saiu assistente admin”**  
→ Em mock antigo acontecia; atualize o código e use área **Desenvolvimento** + **Sênior**, ou `AI_PROVIDER=xai`.

**“Posso commitar o `.env.local`?”**  
→ **Não.** Só o `.env.example`.

---

## 📚 Documentação

Suíte completa (mesmo modelo do PeabiruJobs / Tera AIPL), adaptada ao CareerTwin:

| Documento | Conteúdo |
|-----------|----------|
| **[docs/](docs/README.md)** | Índice de toda a documentação |
| [One Page](docs/one-page.md) | Visão e discovery |
| [PRD](docs/prd.md) | Requisitos do MVP |
| [Produto](docs/produto.md) | Personas e user stories |
| [Jornada](docs/jornada-usuario.md) | Jornada emocional + telas |
| [Arquitetura](docs/arquitetura.md) | Stack e ADRs |
| [IA](docs/ia.md) | 3 prompts, schema, jargões |
| [Segurança](docs/seguranca.md) | RLS, auth, storage |
| [DevOps](docs/devops.md) | Vercel, envs, deploy |
| [Onboarding](docs/onboarding.md) | Setup em &lt; 1h |
| [Claude Code](docs/claude-code.md) | Contribuir com agente |

## 💚 Princípio final

```text
CareerTwin não vende vaga.
CareerTwin ajuda a comunicar a trajetória real
e a decidir o próximo passo com mais clareza.
```

<p align="center">
  <sub>Feito para profissionais brasileiros · MVP · pt-BR</sub>
</p>
