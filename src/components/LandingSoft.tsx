"use client";

import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GitCompare,
  Lock,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

const personas = [
  {
    title: "Recolocação",
    text: "Mandou dezenas de currículos e o silêncio pesa. Quer saber o que ajustar primeiro — sem culpa e sem milagre.",
  },
  {
    title: "Transição de carreira",
    text: "Tem experiência, mas o mercado parece pedir “outro perfil”. Precisa separar o que falta de verdade do que só está mal contado.",
  },
  {
    title: "Sênior com LinkedIn fraco",
    text: "Histórico forte, título genérico. Quer posicionamento à altura do que já entregou — sem inventar promoção.",
  },
];

const features = [
  {
    icon: FileText,
    title: "Parte do que você envia",
    text: "Currículo e LinkedIn em texto (PDF pode ser guardado). A análise usa o conteúdo real — não inventa cargos nem resultados.",
  },
  {
    icon: Sparkles,
    title: "Recomendações priorizadas",
    text: "O que mudar no currículo e no LinkedIn, com impacto, esforço e ação. Você marca o que já fez.",
  },
  {
    icon: Target,
    title: "Aderência a cargo e vaga",
    text: "Score de 0 a 100 para o cargo-alvo e, se colar uma vaga, leitura extra de alinhamento — sem prometer entrevista.",
  },
  {
    icon: MessageSquareQuote,
    title: "Tradução da experiência",
    text: "Sugestões de reescrita em linguagem de mercado, sempre com alerta de autenticidade.",
  },
  {
    icon: GitCompare,
    title: "Plano e reanálise",
    text: "Checklist com status. Atualizou o material? Gere outra análise e compare a evolução.",
  },
  {
    icon: Lock,
    title: "Conta e privacidade",
    text: "Só você vê suas análises e arquivos. Login com e-mail, dados isolados por usuário.",
  },
];

const steps = [
  {
    n: "01",
    title: "Crie a conta e envie o que tem",
    text: "Cole o texto do currículo e do LinkedIn, informe o cargo-alvo e, se quiser, uma vaga. Sem formulário infinito.",
  },
  {
    n: "02",
    title: "Receba o diagnóstico em 5 abas",
    text: "Visão geral, recomendações, aderência, tradução e plano — formato estável, conteúdo da sua trajetória.",
  },
  {
    n: "03",
    title: "Execute e volte se quiser",
    text: "Marque o que concluiu. Quando atualizar os materiais, faça reanálise e veja o comparativo de score.",
  },
];

export function LandingSoft() {
  return (
    <div className="landing-soft relative overflow-x-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 site-mesh" />
      <div aria-hidden className="pointer-events-none fixed inset-0 site-noise" />

      {/* NAV */}
      <nav
        className="fixed inset-x-0 top-0 z-[100] border-b border-[var(--site-border)]/80 bg-[var(--site-bg)]/85 backdrop-blur-xl"
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3.5">
          <LogoWordmark href="/" size="sm" />

          <ul className="hidden items-center gap-8 md:flex">
            {[
              { href: "#para-quem", label: "Para quem" },
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#resultado", label: "Resultado" },
              { href: "#limites", label: "Limites" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-[var(--site-fg-muted)] no-underline transition-colors hover:text-[var(--site-fg)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-[var(--site-border-strong)] bg-[var(--site-card-bg)] px-[18px] py-2.5 text-sm font-medium text-[var(--site-fg)] no-underline sm:inline-flex"
            >
              Entrar
            </Link>
            <Link href="/cadastro" className="site-btn-primary !px-[18px] !py-2.5 !text-sm">
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-[2]">
        {/* ═══ HERO — dor + promessa honesta ═══ */}
        <section className="relative flex min-h-[min(100vh,880px)] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-32 text-center sm:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(at 30% 20%, var(--site-mesh), transparent 50%), radial-gradient(at 80% 60%, var(--site-mesh-2), transparent 60%)",
            }}
          />

          <div className="relative z-[2] w-full max-w-[760px]">
            <p className="site-eyebrow site-fade-up mb-6 flex items-center justify-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--site-accent)]" />
              Mentor de carreira · Brasil · sem promessa de emprego
            </p>

            <h1
              className="site-h-display site-fade-up mx-auto text-[clamp(2.1rem,5.2vw,3.4rem)]"
              style={{ animationDelay: "0.04s" }}
            >
              Você manda currículo e{" "}
              <em className="not-italic text-[var(--site-accent)] sm:italic">
                não sabe o que está errado
              </em>
              .
            </h1>

            <p
              className="site-fade-up mx-auto mt-5 max-w-[36rem] text-[17px] leading-relaxed text-[var(--site-fg-muted)] sm:text-lg"
              style={{ animationDelay: "0.08s" }}
            >
              O CareerTwin analisa o que você{" "}
              <strong className="font-semibold text-[var(--site-fg)]">já viveu</strong> — currículo,
              LinkedIn, cargo-alvo e vaga opcional — e devolve clareza: o que ajustar primeiro,
              se o perfil cola na vaga e um plano que dá para executar.{" "}
              <strong className="font-semibold text-[var(--site-fg)]">
                Sem inventar trajetória. Sem vender contratação.
              </strong>
            </p>

            <div
              className="site-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "0.12s" }}
            >
              <Link href="/cadastro" className="site-btn-primary w-full sm:w-auto">
                Quero meu diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#resultado" className="site-btn-secondary w-full sm:w-auto">
                Ver como fica o resultado
              </a>
            </div>

            <p
              className="site-fade-up mt-5 text-sm text-[var(--site-fg-dim)]"
              style={{ animationDelay: "0.15s" }}
            >
              Conta gratuita no MVP · você cola o texto dos materiais · histórico no dashboard
            </p>
          </div>
        </section>

        {/* ═══ PARA QUEM ═══ */}
        <section
          id="para-quem"
          className="border-t border-[var(--site-border)] px-6 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1100px]">
            <p className="site-eyebrow mb-4">Para quem é</p>
            <h2 className="site-h-display max-w-[16ch] text-[clamp(1.75rem,3.5vw,2.4rem)]">
              Feito para quem está no meio da névoa da recolocação
            </h2>
            <p className="mt-4 max-w-xl text-[var(--site-fg-muted)] leading-relaxed">
              Não é job board. Não é gerador de CV milagroso. É um espaço para entender o
              posicionamento e decidir o próximo passo com mais calma.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {personas.map((p) => (
                <article key={p.title} className="site-card-glass p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--site-accent)]/12 text-[var(--site-accent)]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--site-fg)]">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--site-fg-muted)]">
                    {p.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROVA VISUAL — exemplo de resultado ═══ */}
        <section
          id="resultado"
          className="border-t border-[var(--site-border)] px-6 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1100px]">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              <div>
                <p className="site-eyebrow mb-4">Por dentro do produto</p>
                <h2 className="site-h-display text-[clamp(1.75rem,3.5vw,2.4rem)]">
                  Assim fica o resultado — de verdade
                </h2>
                <p className="mt-4 text-[var(--site-fg-muted)] leading-relaxed">
                  Depois do wizard, você abre uma análise com score, confiança e cinco abas.
                  Abaixo é um{" "}
                  <strong className="font-medium text-[var(--site-fg)]">exemplo ilustrativo</strong>{" "}
                  (números fictícios), no mesmo formato que o app usa.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {[
                    "Visão geral com o que priorizar",
                    "Recomendações que você marca como feitas",
                    "Aderência ao cargo e à vaga (se enviou)",
                    "Tradução com alerta de autenticidade",
                    "Plano de evolução no seu ritmo",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-sm text-[var(--site-fg-muted)]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--site-accent)]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock visual honesto */}
              <div className="site-card-glass overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-[var(--site-border)] px-5 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--site-fg-dim)]">
                    Exemplo · não é o seu resultado
                  </span>
                  <span className="rounded-full bg-[var(--site-accent)]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--site-accent)]">
                    Concluída
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--site-fg-dim)]">Score de aderência</p>
                      <p className="mt-1 font-display text-5xl font-semibold text-[var(--site-fg)]">
                        68
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--site-accent)]">
                        Boa aderência · confiança média
                      </p>
                    </div>
                    <div className="h-[72px] w-[72px] rounded-full border-[5px] border-white/10 border-t-[var(--site-accent)] border-r-[var(--site-accent)]/35" />
                  </div>

                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[68%] rounded-full bg-[var(--site-accent)]" />
                  </div>

                  <div className="mt-6 rounded-[12px] border border-[var(--site-border)] bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--site-accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--site-accent)]">
                        Comunicação
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--site-fg-dim)]">
                        Impacto alto
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--site-fg-dim)]">
                        Esforço médio
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[var(--site-fg)]">
                      Reescrever a experiência genérica do último emprego
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--site-fg-dim)]">
                      <span className="text-[var(--site-fg-muted)]">Problema:</span> “Ajudava a
                      equipe no dia a dia” não mostra demanda, ferramenta nem impacto.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--site-fg-muted)]">
                      <span className="font-medium text-[var(--site-fg)]">Ação:</span> detalhar 2–3
                      rotinas reais — sem inventar números.
                    </p>
                    <p className="mt-3 rounded-lg border border-[var(--site-accent)]/25 bg-[var(--site-accent)]/10 px-3 py-2 text-[11px] leading-relaxed text-[#ffc4b0]">
                      Alerta de autenticidade: use a sugestão só se essas atividades realmente
                      fizeram parte da sua experiência.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {["Visão geral", "Recomendações", "Aderência", "Tradução", "Plano"].map(
                      (tab, i) => (
                        <span
                          key={tab}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                            i === 1
                              ? "bg-[var(--site-accent)] text-white"
                              : "bg-white/5 text-[var(--site-fg-dim)]"
                          }`}
                        >
                          {tab}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA MEIO */}
        <section className="px-6 pb-4">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] border border-[var(--site-accent)]/30 bg-gradient-to-br from-[var(--site-accent)]/15 to-transparent px-6 py-8 sm:flex-row sm:items-center sm:px-10">
              <div>
                <p className="text-sm font-semibold text-[var(--site-accent)]">
                  Pronto para sair da névoa?
                </p>
                <p className="mt-1 max-w-lg text-[var(--site-fg-muted)]">
                  Crie a conta, cole o texto do seu material e gere a primeira análise. Leva
                  poucos minutos.
                </p>
              </div>
              <Link href="/cadastro" className="site-btn-primary shrink-0 whitespace-nowrap">
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ COMO FUNCIONA ═══ */}
        <section
          id="como-funciona"
          className="border-t border-[var(--site-border)] px-6 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1100px]">
            <p className="site-eyebrow mb-4">Como funciona</p>
            <h2 className="site-h-display max-w-[16ch] text-[clamp(1.75rem,3.5vw,2.4rem)]">
              Três passos. Sem atalho mágico.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--site-fg-muted)] leading-relaxed">
              O mesmo fluxo que você percorre depois do login — simples e guiado.
            </p>

            <div className="mt-12 space-y-8">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="grid items-start gap-5 border-b border-[var(--site-border)] pb-8 last:border-0 md:grid-cols-[auto_1fr] md:gap-10"
                >
                  <span className="site-step-number">{s.n}</span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.01em] text-[var(--site-fg)] sm:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[var(--site-fg-muted)] leading-relaxed">
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ O QUE ENTREGA ═══ */}
        <section
          id="o-que-voce-recebe"
          className="border-t border-[var(--site-border)] px-6 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1100px]">
            <p className="site-eyebrow mb-4">O que você leva</p>
            <h2 className="site-h-display max-w-[18ch] text-[clamp(1.75rem,3.5vw,2.4rem)]">
              Clareza prática — não um monólogo de IA
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--site-fg-muted)] leading-relaxed">
              Tudo baseado no material que você envia. Formato estável, prioridades e plano
              para executar.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article key={f.title} className="site-card-glass flex flex-col p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--site-accent)]/12 text-[var(--site-accent)]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-[var(--site-fg)]">
                    {f.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--site-fg-muted)]">
                    {f.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ LIMITES — curtos e humanos ═══ */}
        <section id="limites" className="border-t border-[var(--site-border)] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-[800px] text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--site-accent)]/15 text-[var(--site-accent)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="site-eyebrow mb-3">Limites honestos</p>
            <h2 className="site-h-display text-[clamp(1.6rem,3vw,2.25rem)]">
              Preferimos dizer o que{" "}
              <em className="not-italic text-[var(--site-accent)] sm:italic">não</em> fazemos
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--site-fg-muted)] leading-relaxed">
              Assim você usa a ferramenta pelo valor certo — posicionamento e plano — e não por
              uma expectativa que o produto não cumpre.
            </p>
            <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
              {[
                "Não prometemos contratação nem entrevista",
                "Não inventamos experiências, métricas ou certificações",
                "Não fazemos scraping do LinkedIn — você cola o texto",
                "Não “lemos” PDF sozinhos no MVP — cole o conteúdo para a melhor análise",
                "Não buscamos vagas na internet por você",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-3 rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] px-4 py-3 text-sm text-[var(--site-fg-muted)]"
                >
                  <span className="text-[var(--site-accent)]">—</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="border-t border-[var(--site-border)] px-6 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="site-eyebrow mb-4">Vamos juntos</p>
            <h2 className="site-h-display text-[clamp(1.85rem,3.5vw,2.75rem)]">
              Do silêncio das candidaturas para um plano claro
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--site-fg-muted)] leading-relaxed">
              Crie a conta, cole o texto do seu currículo e do LinkedIn, diga o cargo que busca
              e gere o diagnóstico. Você decide o ritmo.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/cadastro" className="site-btn-primary w-full sm:w-auto">
                Criar conta e começar
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="site-btn-secondary w-full sm:w-auto">
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-[2] border-t border-[var(--site-border)] px-6 py-12">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <LogoWordmark href="/" size="md" />
            <p className="text-sm text-[var(--site-fg-dim)]">
              Evolua, Reposicione e Conquiste.
            </p>
          </div>
          <div className="text-center text-sm text-[var(--site-fg-dim)] sm:text-right">
            <p>© {new Date().getFullYear()} CareerTwin</p>
            <p className="mt-1">Mentor de carreira · MVP · Sem promessas de contratação</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
