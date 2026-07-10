"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  ArrowRight,
  CheckCircle2,
  GitCompare,
  Lock,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Recomendações priorizadas",
    text: "O que ajustar no currículo e no LinkedIn, por impacto e esforço — com ação clara e justificativa.",
    foot: "Comece pelo que move o ponteiro.",
  },
  {
    icon: Target,
    title: "Aderência a cargos e vagas",
    text: "Score de 0 a 100 e leitura honesta: lacuna real, de comunicação ou de evidência.",
    foot: "Decida se aplica agora ou desenvolve antes.",
  },
  {
    icon: MessageSquareQuote,
    title: "Tradução da experiência",
    text: "Reescreva trechos reais em linguagem de mercado, com alerta de autenticidade em cada sugestão.",
    foot: "Sem inventar o que você não fez.",
  },
  {
    icon: GitCompare,
    title: "Plano de evolução",
    text: "Checklist com prazos e critérios de sucesso. Marque o que concluiu e reanalise depois.",
    foot: "Evolução mensurável, semana a semana.",
  },
  {
    icon: ShieldCheck,
    title: "Honestidade por design",
    text: "Não prometemos contratação. Não inventamos métricas. A proposta é clareza e estratégia.",
    foot: "Você é o cliente, não o produto.",
  },
  {
    icon: Lock,
    title: "Dados só seus",
    text: "RLS no banco e storage privado: cada usuário acessa apenas as próprias análises e arquivos.",
    foot: "Privacidade no centro do produto.",
  },
];

const steps = [
  {
    n: "01",
    time: "poucos minutos",
    title: "Envie currículo e LinkedIn",
    text: "Cole o texto dos seus materiais (e o cargo-alvo). PDF pode ser guardado; a análise usa o texto que você envia.",
  },
  {
    n: "02",
    time: "segundos",
    title: "Receba o diagnóstico",
    text: "Score, recomendações, aderência, tradução da experiência e plano — sempre no mesmo formato estruturado.",
  },
  {
    n: "03",
    time: "iteração contínua",
    title: "Execute e reanalise",
    text: "Marque ações feitas, atualize seus materiais e compare a evolução entre versões.",
  },
];

const trust = [
  "LGPD-friendly (RLS)",
  "Sem promessa de contratação",
  "Sem inventar experiência",
  "Schema JSON estável",
  "Mock ou Grok / OpenAI",
  "Brasil · pt-BR",
];

export function LandingSoft() {
  return (
    <div className="landing-soft relative overflow-x-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 site-mesh" />
      <div aria-hidden className="pointer-events-none fixed inset-0 site-noise" />

      {/* NAV — estilo careertwin.com.br */}
      <nav
        className="fixed inset-x-0 top-0 z-[100] border-b border-transparent"
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-[18px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.01em] text-[var(--site-fg)] no-underline"
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--site-accent)] shadow-[0_0_16px_var(--site-accent-glow)]"
            />
            CareerTwin
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {[
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#o-que-voce-recebe", label: "O que você recebe" },
              { href: "#honestidade", label: "Honestidade" },
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
        {/* HERO */}
        <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-36 text-center sm:pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(at 30% 20%, var(--site-mesh), transparent 50%), radial-gradient(at 80% 60%, var(--site-mesh-2), transparent 60%)",
            }}
          />

          <div className="relative z-[2] w-full max-w-[1100px]">
            <p className="site-eyebrow site-fade-up mb-7 flex items-center justify-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--site-accent)]" />
              Brasil · mentor de carreira com IA
            </p>

            <h1
              className="site-h-display site-fade-up mx-auto max-w-[18ch] text-[clamp(2.25rem,5.5vw,3.75rem)]"
              style={{ animationDelay: "0.05s" }}
            >
              Pare de mandar CV genérico.{" "}
              <em className="not-italic text-[var(--site-accent)] sm:italic">
                Clareza de mercado
              </em>
              , sem caixa-preta.
            </h1>

            <p
              className="site-fade-up mx-auto mt-6 max-w-[34rem] text-[17px] leading-relaxed text-[var(--site-fg-muted)] sm:text-lg"
              style={{ animationDelay: "0.15s" }}
            >
              Diagnóstico de currículo e LinkedIn, aderência a cargos e vagas, tradução da
              experiência e plano de evolução — em português, sem inventar o que você não fez.
            </p>

            <div
              className="site-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "0.2s" }}
            >
              <Link href="/cadastro" className="site-btn-primary w-full sm:w-auto">
                Começar análise
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#como-funciona" className="site-btn-secondary w-full sm:w-auto">
                Ver como funciona
              </a>
            </div>

            {/* Demo card suave — como o site irmão */}
            <div
              className="site-fade-up site-card-glass mx-auto mt-16 max-w-xl p-6 text-left sm:p-8"
              style={{ animationDelay: "0.28s" }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="site-eyebrow !normal-case !tracking-normal">Exemplo de resultado</p>
                <span className="rounded-full bg-[var(--site-accent)]/15 px-2.5 py-0.5 text-xs font-semibold text-[var(--site-accent)]">
                  Boa aderência
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-[var(--site-fg-dim)]">Score de aderência</p>
                  <p className="mt-1 font-display text-5xl font-semibold text-[var(--site-fg)]">
                    72
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full border-[5px] border-white/10 border-t-[var(--site-accent)] border-r-[var(--site-accent)]/40" />
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-[var(--site-accent)]" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { k: "Forte", v: "Rotinas e entrega" },
                  { k: "Lacuna", v: "Evidências" },
                  { k: "Próximo", v: "Título LinkedIn" },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-[10px] border border-[var(--site-border)] bg-white/[0.03] p-3"
                  >
                    <p className="text-[11px] font-medium text-[var(--site-fg-dim)]">{x.k}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--site-fg)]">{x.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="border-y border-[var(--site-border)] py-8">
          <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-2 px-6 sm:gap-3">
            {trust.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--site-border)] bg-[var(--site-card-bg)] px-3.5 py-1.5 text-xs font-medium text-[var(--site-fg-muted)] sm:text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="o-que-voce-recebe" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-[1100px]">
            <p className="site-eyebrow mb-4">O que você recebe</p>
            <h2 className="site-h-display max-w-[16ch] text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Clareza para decidir o próximo passo
            </h2>
            <p className="mt-4 max-w-xl text-[var(--site-fg-muted)] leading-relaxed">
              Diferente de um chat genérico: formato estável, prioridades e plano que você
              consegue executar.
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
                  <p className="mt-4 text-xs font-medium text-[var(--site-fg-dim)]">{f.foot}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="border-t border-[var(--site-border)] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-[1100px]">
            <p className="site-eyebrow mb-4">Como funciona</p>
            <h2 className="site-h-display max-w-[14ch] text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Três momentos. Zero enrolação.
            </h2>

            <div className="mt-14 space-y-10">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="grid items-start gap-6 border-b border-[var(--site-border)] pb-10 last:border-0 md:grid-cols-[auto_1fr] md:gap-12"
                >
                  <span className="site-step-number">{s.n}</span>
                  <div>
                    <p className="site-eyebrow !normal-case !tracking-wide text-[var(--site-accent)]">
                      {s.time}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[var(--site-fg)] sm:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[var(--site-fg-muted)] leading-relaxed">
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HONESTIDADE */}
        <section id="honestidade" className="border-t border-[var(--site-border)] px-6 py-20">
          <div className="mx-auto max-w-[1100px]">
            <div className="site-card-glass p-8 sm:p-12">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--site-accent)] text-white shadow-[0_8px_24px_var(--site-accent-glow)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="site-h-display text-[clamp(1.5rem,3vw,2.25rem)]">
                    Compromisso de honestidade
                  </h2>
                  <p className="mt-4 max-w-2xl text-[var(--site-fg-muted)] leading-relaxed">
                    O CareerTwin não promete contratação e não inventa experiências. A proposta
                    é ajudar você a comunicar melhor sua trajetória e tomar decisões mais
                    estratégicas.
                  </p>
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {[
                      "Não cria métricas falsas",
                      "Não substitui recrutadores",
                      "Lacuna real ≠ comunicação",
                      "Dados protegidos por RLS",
                    ].map((t) => (
                      <li
                        key={t}
                        className="flex items-center gap-2 text-sm font-medium text-[var(--site-fg)]"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--site-accent)]" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--site-border)] px-6 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="site-eyebrow mb-4">Pronto?</p>
            <h2 className="site-h-display text-[clamp(1.75rem,3.5vw,2.75rem)]">
              Crie sua primeira análise
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--site-fg-muted)] leading-relaxed">
              Envie os materiais que você já tem. Em poucos minutos você sai com diagnóstico e
              próximos passos.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/cadastro" className="site-btn-primary w-full sm:w-auto">
                Começar grátis
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
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Logo href="/" size="md" onDark />
            <p className="text-sm text-[var(--site-fg-dim)]">
              Evolua, Reposicione e Conquiste.
            </p>
          </div>
          <div className="text-center text-sm text-[var(--site-fg-dim)] sm:text-right">
            <p>© {new Date().getFullYear()} CareerTwin</p>
            <p className="mt-1">Mentor de carreira · Sem promessas de contratação</p>
            <p className="mt-3 text-xs">
              Produto irmão de{" "}
              <a
                href="https://careertwin.com.br"
                className="text-[var(--site-fg-muted)] underline-offset-2 hover:text-[var(--site-accent)] hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                careertwin.com.br
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
