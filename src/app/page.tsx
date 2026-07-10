import Link from "next/link";
import { MarketingHeader } from "@/components/AppHeader";
import { Button, Card } from "@/components/ui";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Map,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="animate-fade-up">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Mentor de carreira com IA
              </p>
              <h1 className="font-display text-4xl leading-[1.15] text-foreground sm:text-5xl lg:text-[3.25rem]">
                Transforme sua experiência profissional em uma narrativa mais clara e competitiva.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                TwinJobs analisa seu currículo, LinkedIn e vagas de interesse para recomendar
                melhorias, avaliar aderência e criar um plano de evolução profissional.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/cadastro">
                  <Button size="lg">
                    Começar análise
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button size="lg" variant="outline">
                    Ver como funciona
                  </Button>
                </a>
              </div>
              <p className="mt-6 text-sm text-muted">
                Sem promessas de contratação. Foco em comunicação honesta e decisões melhores.
              </p>
            </div>

            <Card className="relative overflow-hidden animate-fade-up border-primary/10 bg-gradient-to-br from-card to-primary-soft/40">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted">Score de aderência</span>
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                    72 · Boa
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted-bg">
                  <div className="h-full w-[72%] rounded-full bg-primary" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { t: "Ponto forte", d: "Rotinas e atendimento" },
                    { t: "Lacuna principal", d: "Evidências de resultado" },
                    { t: "Próxima ação", d: "Ajustar título no LinkedIn" },
                    { t: "Confiança", d: "Média — complete o currículo" },
                  ].map((item) => (
                    <div key={item.t} className="rounded-xl bg-card/80 p-3 border border-card-border">
                      <p className="text-xs text-muted">{item.t}</p>
                      <p className="mt-1 text-sm font-medium">{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="border-y border-card-border bg-card/50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-foreground">Como funciona</h2>
            <p className="mt-2 max-w-2xl text-muted">
              Um caminho guiado do material que você já tem até um plano acionável — seu
              &quot;gêmeo&quot; de carreira, com diagnóstico e próximos passos claros.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  n: "01",
                  icon: FileText,
                  t: "Envie currículo e LinkedIn",
                  d: "Upload ou texto colado — usamos o que você realmente fez.",
                },
                {
                  n: "02",
                  icon: Target,
                  t: "Informe o cargo-alvo",
                  d: "E uma vaga específica, se tiver. Ou peça sugestões de cargos.",
                },
                {
                  n: "03",
                  icon: Sparkles,
                  t: "Receba o diagnóstico",
                  d: "Recomendações, aderência, tradução da experiência e plano.",
                },
                {
                  n: "04",
                  icon: Map,
                  t: "Ajuste e evolua",
                  d: "Marque ações concluídas e faça reanálises para comparar.",
                },
              ].map((step) => (
                <Card key={step.n} className="relative pt-6">
                  <span className="absolute right-4 top-4 font-display text-2xl text-primary/15">
                    {step.n}
                  </span>
                  <step.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-semibold text-foreground">{step.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.d}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* O que você recebe */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-foreground">O que você recebe</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {[
                {
                  icon: FileText,
                  t: "Recomendações para currículo e LinkedIn",
                  d: "Priorizadas por impacto, esforço e urgência — com ação clara e justificativa.",
                },
                {
                  icon: Target,
                  t: "Diagnóstico de aderência a cargos e vagas",
                  d: "Score de 0 a 100, lacunas reais vs. de comunicação e decisão sugerida.",
                },
                {
                  icon: Briefcase,
                  t: "Tradução da experiência para linguagem de mercado",
                  d: "Sem inventar fatos. Cada sugestão traz alerta de autenticidade.",
                },
                {
                  icon: Map,
                  t: "Plano de evolução com ações priorizadas",
                  d: "Checklist prático com prazos e critérios de sucesso.",
                },
              ].map((item) => (
                <Card key={item.t} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.d}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Confiança */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Card className="flex flex-col gap-4 border-primary/15 bg-primary-soft/40 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-foreground">Compromisso de honestidade</h2>
                <p className="mt-2 max-w-3xl leading-relaxed text-muted">
                  O TwinJobs não promete contratação e não inventa experiências. A proposta é
                  ajudar você a comunicar melhor sua trajetória e tomar decisões mais estratégicas.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    "Não cria métricas falsas",
                    "Não substitui recrutadores",
                    "Diferencia lacuna real de comunicação",
                    "Seus dados ficam só com você (RLS)",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-card-border bg-primary py-14 text-white">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl sm:text-4xl">Pronto para clarear seu caminho?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Crie sua conta e gere a primeira análise com base nos materiais que você já tem.
            </p>
            <div className="mt-8">
              <Link href="/cadastro">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-primary-soft"
                >
                  Criar minha primeira análise
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-card-border py-8 text-center text-sm text-muted">
        <p>TwinJobs · Mentor de carreira · © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
