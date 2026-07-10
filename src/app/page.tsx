import Link from "next/link";
import { MarketingHeader } from "@/components/AppHeader";
import { Badge, Button, Card } from "@/components/ui";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Target,
  Layers,
  GitCompare,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* ─── HERO ─── */}
      <section className="relative mesh-hero grain overflow-hidden pb-24 pt-28 sm:pt-32 sm:pb-32">
        <MarketingHeader />

        {/* soft orbs */}
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-teal-200 backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
                </span>
                Mentor de carreira com IA · sem promessas falsas
              </div>

              <h1 className="animate-fade-up-delay-1 mt-6 font-display text-[2.6rem] leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                Seu currículo e LinkedIn,{" "}
                <em className="text-teal-300 not-italic sm:italic">
                  com a clareza que o mercado entende
                </em>
                .
              </h1>

              <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                TwinJobs analisa sua trajetória real, mede aderência a cargos e vagas e
                monta um plano de evolução — sem inventar experiência e sem vender
                contratação.
              </p>

              <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap items-center gap-3">
                <Link href="/cadastro">
                  <Button size="lg" className="shadow-lg shadow-teal-900/30">
                    Começar análise
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25"
                  >
                    Ver como funciona
                  </Button>
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                {["Honestidade total", "Dados só seus (RLS)", "Plano acionável"].map(
                  (t) => (
                    <span key={t} className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Product preview card */}
            <div className="animate-fade-up-delay-2 relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-500/20 via-transparent to-indigo-500/20 blur-2xl" />
              <div className="animate-float relative rounded-3xl border border-white/10 bg-zinc-900/80 p-1 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[1.35rem] bg-zinc-950 p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-400/80" />
                      <div className="h-2 w-2 rounded-full bg-amber-400/80" />
                      <div className="h-2 w-2 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                      Análise · resultado
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Score de aderência</p>
                      <p className="mt-1 font-display text-4xl text-white">72</p>
                      <Badge tone="primary" className="mt-2">
                        Boa aderência
                      </Badge>
                    </div>
                    <div className="h-20 w-20 rounded-full border-[6px] border-zinc-800 border-t-teal-400 border-r-teal-400/40" />
                  </div>

                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-teal-500 to-teal-300" />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { k: "Ponto forte", v: "Experiência em TI sênior" },
                      { k: "Lacuna", v: "Evidências de impacto" },
                      { k: "Próxima ação", v: "Título no LinkedIn" },
                      { k: "Confiança", v: "Alta · materiais ok" },
                    ].map((item) => (
                      <div
                        key={item.k}
                        className="rounded-2xl border border-white/5 bg-white/[0.03] p-3"
                      >
                        <p className="text-[11px] font-medium text-zinc-500">{item.k}</p>
                        <p className="mt-1 text-sm font-medium text-zinc-200 leading-snug">
                          {item.v}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex gap-2 overflow-hidden">
                    {["Visão geral", "Recomendações", "Aderência", "Plano"].map((tab, i) => (
                      <span
                        key={tab}
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                          i === 0
                            ? "bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30"
                            : "text-zinc-500"
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOGOS / SOCIAL STRIP ─── */}
      <section className="border-b border-card-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-sm text-muted">
            Feito para recolocação e transição — com linguagem de mercado real.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Currículo", "LinkedIn", "Cargo-alvo", "Vaga", "Plano"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted-bg px-3 py-1 text-xs font-semibold text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section id="como-funciona" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Como funciona</p>
            <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
              Quatro passos. Zero enrolação.
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Do material que você já tem até um plano que dá para executar na semana.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                icon: FileText,
                t: "Envie seus materiais",
                d: "Currículo e LinkedIn em texto. PDF fica guardado; o texto alimenta a análise.",
              },
              {
                n: "02",
                icon: Target,
                t: "Defina o alvo",
                d: "Cargo, área e senioridade — ou peça sugestões se ainda não souber.",
              },
              {
                n: "03",
                icon: Sparkles,
                t: "Receba o diagnóstico",
                d: "Recomendações, aderência, tradução da experiência e plano.",
              },
              {
                n: "04",
                icon: GitCompare,
                t: "Ajuste e reanalise",
                d: "Marque ações feitas e compare a evolução entre versões.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="group relative overflow-hidden rounded-3xl border border-card-border bg-card p-6 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl text-zinc-200">{step.n}</span>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENTO FEATURES ─── */}
      <section className="border-y border-card-border bg-zinc-50/80 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">O que você recebe</p>
            <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
              Um gêmeo profissional que fala a língua do mercado
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-6">
            <Card className="md:col-span-4 p-7 bg-gradient-to-br from-white to-teal-50/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-2xl">Recomendações priorizadas</h3>
              <p className="mt-2 max-w-lg text-muted leading-relaxed">
                Impacto, esforço e urgência em cada item — com ação clara e justificativa.
                Comece pelo que move o ponteiro mais rápido.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Alto impacto", "Baixo esforço", "Posicionamento", "Evidência"].map((t) => (
                  <Badge key={t} tone="primary">
                    {t}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="md:col-span-2 p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">Aderência 0–100</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Score fixo por faixas. Separação entre lacuna real, de comunicação e de
                evidência.
              </p>
            </Card>

            <Card className="md:col-span-2 p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <MessageSquareQuote className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">Tradução honesta</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Linguagem de mercado com alerta de autenticidade em toda sugestão.
              </p>
            </Card>

            <Card className="md:col-span-2 p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">Plano de evolução</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Ações com prazo, critério de sucesso e progresso visível.
              </p>
            </Card>

            <Card className="md:col-span-2 p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">Privacidade real</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                RLS no banco: só você acessa suas análises e arquivos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── TRUST ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-card-border bg-ink text-white shadow-[var(--shadow-lg)]">
            <div className="grid lg:grid-cols-[1fr_0.85fr]">
              <div className="p-8 sm:p-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="mt-6 font-display text-3xl sm:text-4xl">
                  Compromisso de honestidade
                </h2>
                <p className="mt-4 max-w-lg text-zinc-400 leading-relaxed">
                  TwinJobs não promete contratação e não inventa experiências. A proposta é
                  ajudar você a comunicar melhor sua trajetória e decidir com estratégia.
                </p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "Não cria métricas falsas",
                    "Não substitui recrutadores",
                    "Lacuna real ≠ comunicação",
                    "Seus dados ficam só com você",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative border-t border-white/5 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 p-8 sm:p-12 lg:border-l lg:border-t-0">
                <p className="text-sm font-medium text-teal-300">Para quem é</p>
                <ul className="mt-6 space-y-5">
                  {[
                    {
                      t: "Recolocação",
                      d: "Quer clareza no que melhorar primeiro no perfil.",
                    },
                    {
                      t: "Transição de carreira",
                      d: "Precisa traduzir experiência sem forçar narrativa.",
                    },
                    {
                      t: "Sênior em TI ou outras áreas",
                      d: "Posicionamento confuso no LinkedIn apesar do histórico forte.",
                    },
                  ].map((item) => (
                    <li key={item.t}>
                      <p className="font-semibold text-white">{item.t}</p>
                      <p className="mt-1 text-sm text-zinc-400">{item.d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-teal-700 to-zinc-900 px-8 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                Pronto para clarear seu caminho?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-teal-100/90">
                Crie sua conta e gere a primeira análise com os materiais que você já tem.
              </p>
              <div className="mt-8">
                <Link href="/cadastro">
                  <Button size="lg" variant="white">
                    Criar minha primeira análise
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-card-border bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            TwinJobs
          </div>
          <p className="text-sm text-muted">
            Mentor de carreira · © {new Date().getFullYear()} · Sem promessas de contratação
          </p>
        </div>
      </footer>
    </div>
  );
}
