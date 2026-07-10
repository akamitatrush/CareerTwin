"use client";

import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  GitCompare,
  Lock,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   Conteúdo — nosso produto, ritmo careertwin.com.br
═══════════════════════════════════════════ */

const trustChips = [
  "Sem promessa de emprego",
  "Sem inventar trajetória",
  "5 abas de diagnóstico",
  "Dados só seus",
  "Reanálise e plano",
  "Brasil-first",
];

const features = [
  {
    icon: FileText,
    title: "Parte do que você envia",
    text: "Currículo e LinkedIn em texto. A análise usa o conteúdo real — não inventa cargos nem resultados.",
    foot: "Texto colado, não scraping.",
  },
  {
    icon: Sparkles,
    title: "Recomendações priorizadas",
    text: "O que mudar no CV e no LinkedIn, com impacto, esforço e ação. Você marca o que já fez.",
    foot: "Prioridade, não monólogo.",
  },
  {
    icon: Target,
    title: "Aderência a cargo e vaga",
    text: "Score de 0 a 100 para o cargo-alvo e, se colar uma vaga, leitura extra de alinhamento.",
    foot: "Alinhamento, não previsão de entrevista.",
  },
  {
    icon: MessageSquareQuote,
    title: "Tradução da experiência",
    text: "Sugestões de reescrita em linguagem de mercado, sempre com alerta de autenticidade.",
    foot: "Só o que for verdade pra você.",
  },
  {
    icon: GitCompare,
    title: "Plano e reanálise",
    text: "Checklist com status. Atualizou o material? Gere outra análise e compare a evolução.",
    foot: "Loop de execução.",
  },
  {
    icon: Lock,
    title: "Conta e privacidade",
    text: "Só você vê suas análises e arquivos. Login com e-mail, dados isolados por usuário.",
    foot: "Você é o cliente, não o produto.",
  },
];

const steps = [
  {
    n: "01",
    time: "~2 minutos",
    title: "Crie a conta e cole o que tem",
    text: "Texto do currículo e do LinkedIn, cargo-alvo e, se quiser, a descrição de uma vaga. Nada de scraping automático.",
  },
  {
    n: "02",
    time: "Diagnóstico estruturado",
    title: "Receba o resultado em 5 abas",
    text: "Visão geral, recomendações, aderência, tradução e plano — formato estável, com alertas de autenticidade.",
  },
  {
    n: "03",
    time: "Iteração contínua",
    title: "Execute e volte se quiser",
    text: "Marque o que concluiu. Atualize os materiais, reanalise e compare o score com a versão anterior.",
  },
];

const limitsNo = [
  "Não prometemos contratação nem entrevista",
  "Não inventamos experiências ou métricas",
  "Não fazemos scraping do LinkedIn",
  "Não lemos PDF sozinhos no MVP — cole o texto",
  "Não buscamos vagas na internet por você",
];

const limitsYes = [
  "Analisamos só o texto que você envia",
  "Priorizamos o que ajustar primeiro",
  "Marcamos alertas de autenticidade",
  "Guardamos análises só na sua conta",
  "Permitimos reanálise e comparação",
];

const faqs = [
  {
    q: "Isso garante emprego?",
    a: "Não. O CareerTwin ajuda a comunicar melhor sua trajetória e a decidir com mais estratégia. Não prometemos contratação nem entrevista.",
  },
  {
    q: "A IA inventa experiências?",
    a: "Não deve. As regras do produto proíbem inventar cargos, métricas e ferramentas. Nas traduções há sempre alerta de autenticidade.",
  },
  {
    q: "Preciso de PDF ou o texto colado?",
    a: "No MVP, a melhor análise usa o texto que você cola. PDF/DOC podem ser guardados, mas não são lidos automaticamente.",
  },
  {
    q: "Vocês leem meu LinkedIn sozinhos?",
    a: "Não. Não fazemos scraping. Você informa o link (só armazenado) e/ou cola o texto do perfil.",
  },
  {
    q: "O que acontece depois da análise?",
    a: "Você vê 5 abas, marca recomendações e ações como feitas e, se quiser, faz reanálise para comparar o score.",
  },
  {
    q: "É gratuito?",
    a: "O MVP tem conta grátis para gerar o diagnóstico. Planos futuros podem expandir limites — o valor principal já está no diagnóstico estruturado.",
  },
];

const marqueeItems = [
  "Currículo",
  "LinkedIn",
  "Cargo-alvo",
  "Vaga opcional",
  "Score de aderência",
  "Recomendações",
  "Tradução honesta",
  "Plano de evolução",
  "Reanálise",
  "Dados só seus",
];

/* ═══════════════════════════════════════════
   Primitivos
═══════════════════════════════════════════ */

function AnimatedScore({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const duration = 1000;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
    </span>
  );
}

function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--site-border)] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-[var(--site-fg)] sm:text-lg">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[var(--site-fg-muted)] transition-transform duration-200",
            open && "rotate-180 text-[var(--site-accent)]"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[15px] leading-relaxed text-[var(--site-fg-muted)]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Demo glass no estilo do hero da referência */
function HeroDemo() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="site-card-glass mx-auto w-full max-w-[560px] p-6 text-left sm:p-7"
      role="region"
      aria-label="Demonstração ilustrativa do diagnóstico CareerTwin"
    >
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] tracking-wide text-[var(--site-fg-muted)]">
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full transition-all duration-500",
            phase >= 1
              ? "bg-[var(--site-accent)] shadow-[0_0_12px_var(--site-accent-glow)]"
              : "bg-[var(--site-fg-dim)]"
          )}
        />
        {phase < 1
          ? "Calculando diagnóstico…"
          : phase < 3
            ? "Montando as 5 abas…"
            : "Diagnóstico de exemplo"}
        <div className="ml-auto h-1 w-24 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-[var(--site-accent)]"
            initial={{ width: "8%" }}
            animate={{ width: phase >= 3 ? "100%" : phase >= 2 ? "72%" : "35%" }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm leading-relaxed text-[var(--site-fg)]"
          >
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--site-fg-muted)]">
              Persona
            </span>
            Assistente administrativo{" "}
            <span className="text-[var(--site-fg-muted)]">→</span>{" "}
            <span className="text-[var(--site-accent)]">Analista administrativo Jr</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-[13px]"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--site-fg-muted)]">
              Presente
            </span>
            <span className="flex flex-wrap gap-1.5">
              {["Rotinas", "Organização", "Atendimento"].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--site-border)] bg-white/[0.04] px-2 py-0.5 font-mono text-[11px]"
                >
                  {t}
                </span>
              ))}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--site-fg-muted)]">
              Ajustar
            </span>
            <span className="flex flex-wrap gap-1.5">
              {["+Headline", "+Evidências"].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--site-accent)] bg-[var(--site-accent-soft)] px-2 py-0.5 font-mono text-[11px] text-[var(--site-accent)]"
                >
                  {t}
                </span>
              ))}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="site-divider mb-4" />

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--site-fg-muted)]">
            Score de aderência
          </p>
          <p className="mt-1 font-mono text-[clamp(2rem,5vw,2.5rem)] font-medium leading-none tracking-tight">
            {phase >= 3 ? <AnimatedScore value={68} /> : 0}
            <span className="text-[0.55em] text-[var(--site-fg-muted)]">/100</span>
          </p>
          <p className="mt-2 text-xs font-medium text-[var(--site-accent)]">
            Boa aderência · confiança média
          </p>
        </div>
      </div>

      {phase >= 3 && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 space-y-0 border-t border-dashed border-white/[0.06] pt-3"
        >
          {[
            { n: "+8", t: "Título do LinkedIn", d: "clareza de cargo" },
            { n: "+6", t: "3 bullets reescritos", d: "evidências reais" },
            { n: "+5", t: "Sumário alinhado", d: "sem inventar métrica" },
          ].map((row) => (
            <li
              key={row.t}
              className="grid grid-cols-[44px_1fr_auto] items-baseline gap-3 border-b border-dashed border-white/[0.06] py-2 text-[13px] last:border-0"
            >
              <span className="font-mono font-medium text-[var(--site-accent)]">
                {row.n}
              </span>
              <span className="text-[var(--site-fg)]">{row.t}</span>
              <span className="text-[var(--site-fg-dim)]">{row.d}</span>
            </li>
          ))}
        </motion.ul>
      )}

      <p className="mt-4 text-center text-[10px] text-[var(--site-fg-dim)]">
        Exemplo ilustrativo · no app, os números vêm do seu texto
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Landing
═══════════════════════════════════════════ */

export function LandingSoft() {
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="landing-soft relative overflow-x-hidden" data-site-root>
      {/* atmosphere fixa */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="site-mesh absolute inset-0" />
        <div className="site-noise absolute inset-0" />
      </div>

      {/* NAV — estilo referência: limpa, poucos links */}
      <nav
        className="fixed inset-x-0 top-0 z-[100] transition-[background,backdrop-filter,border-color] duration-200"
        style={{
          background: navSolid ? "rgba(7, 8, 12, 0.78)" : "transparent",
          backdropFilter: navSolid ? "blur(16px)" : "none",
          WebkitBackdropFilter: navSolid ? "blur(16px)" : "none",
          borderBottom: navSolid
            ? "1px solid var(--site-border)"
            : "1px solid transparent",
        }}
        aria-label="Navegação principal"
      >
        <div className="site-container flex items-center justify-between py-[18px]">
          <LogoWordmark href="/" size="sm" />
          <ul className="hidden items-center gap-8 md:flex">
            {[
              { id: "features", label: "Produto" },
              { id: "como-funciona", label: "Como funciona" },
              { id: "confianca", label: "Confiança" },
              { id: "faq", label: "FAQ" },
            ].map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(l.id)}
                  className="text-sm font-medium text-[var(--site-fg-muted)] transition-colors hover:text-[var(--site-fg)]"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="site-btn-secondary !px-[18px] !py-2.5 text-sm"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="site-btn-primary !px-[18px] !py-2.5 text-sm"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-[2]">
        {/* ═══ HERO — full viewport, centrado, ar generoso ═══ */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-36 text-center sm:pb-24 sm:pt-40">
          <p className="site-eyebrow site-fade-up mb-7 inline-flex items-center">
            <span className="mr-2.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--site-accent)] shadow-[0_0_12px_var(--site-accent-glow)]" />
            Mentor de carreira · Brasil · sem caixa-preta
          </p>

          <h1 className="site-h-display site-fade-up site-fade-up-d1 mx-auto max-w-[16ch] text-[clamp(2.75rem,9vw,6.5rem)]">
            Você manda currículo e{" "}
            <span className="text-[var(--site-accent)]">o silêncio</span>{" "}
            responde.
          </h1>

          <p className="site-body-lg site-fade-up site-fade-up-d2 mx-auto mt-8 max-w-[40rem]">
            O CareerTwin analisa o que você já viveu e devolve clareza: o que
            ajustar primeiro, se o perfil cola na vaga e um plano executável —
            sem inventar trajetória e sem vender contratação.
          </p>

          <div className="site-fade-up site-fade-up-d3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/cadastro" className="site-btn-primary">
              Começar diagnóstico
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => scrollTo("como-funciona")}
              className="site-btn-secondary"
            >
              Ver como funciona
            </button>
          </div>

          {/* demo glass — abaixo dos CTAs, com respiro */}
          <div className="site-fade-up site-fade-up-d4 mt-16 w-full sm:mt-20">
            <HeroDemo />
          </div>

          <button
            type="button"
            onClick={() => scrollTo("features")}
            className="mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--site-fg-dim)] transition-colors hover:text-[var(--site-fg-muted)]"
          >
            scroll
          </button>
        </section>

        {/* ═══ TRUST CHIPS ═══ */}
        <section className="border-y border-[var(--site-border)] py-5">
          <div className="site-container flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {trustChips.map((t) => (
              <span key={t} className="site-chip">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--site-accent)]" />
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* ═══ FEATURES — headline + grid com ar ═══ */}
        <section id="features" className="site-section">
          <div className="site-container">
            <p className="site-eyebrow">Produto</p>
            <h2 className="site-h-section mt-4 max-w-3xl">
              Tudo o que costuma virar monólogo de IA, a gente estrutura.
            </h2>
            <p className="site-body-lg mt-5 max-w-2xl">
              Cada bloco do resultado existe para responder uma pergunta difícil:
              o que fazer agora — e o que não inventar.
            </p>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {features.map((f) => (
                <article
                  key={f.title}
                  className="site-card-glass flex flex-col p-7 sm:p-8"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--site-border)] bg-[var(--site-accent-soft)] text-[var(--site-accent)]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--site-fg)]">
                    {f.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--site-fg-muted)]">
                    {f.text}
                  </p>
                  <p className="mt-6 border-t border-[var(--site-border)] pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--site-fg-dim)]">
                    {f.foot}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ COMO FUNCIONA — números grandes, respiro ═══ */}
        <section
          id="como-funciona"
          className="site-section border-t border-[var(--site-border)]"
        >
          <div className="site-container">
            <p className="site-eyebrow">Como funciona</p>
            <h2 className="site-h-section mt-4 max-w-2xl">
              Três passos. Sem ginástica mental.
            </h2>

            <div className="mt-16 space-y-16 lg:space-y-20">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:gap-16"
                >
                  <div>
                    <span className="site-step-number">{s.n}</span>
                    <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--site-fg-muted)]">
                      {s.time}
                    </p>
                  </div>
                  <div className="lg:pt-4">
                    <h3 className="text-2xl font-semibold tracking-tight text-[var(--site-fg)] sm:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--site-fg-muted)] sm:text-lg">
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ MARQUEE ═══ */}
        <section className="overflow-hidden border-y border-[var(--site-border)] py-6">
          <div className="flex animate-[marquee_32s_linear_infinite] gap-3 whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((t, i) => (
              <span key={`${t}-${i}`} className="site-chip">
                <span className="text-[var(--site-accent)]">◆</span>
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* ═══ CONFIANÇA ═══ */}
        <section id="confianca" className="site-section">
          <div className="site-container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--site-border)] bg-[var(--site-accent-soft)] text-[var(--site-accent)]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <p className="site-eyebrow">Arquitetura de confiança</p>
              <h2 className="site-h-section mt-4">
                Preferimos dizer o que{" "}
                <span className="text-[var(--site-accent)]">não</span> fazemos
              </h2>
              <p className="site-body-lg mx-auto mt-5 max-w-xl">
                Transparência operacional — o mesmo espírito do careertwin.com.br,
                aplicado ao nosso MVP de mentor honesto.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2 md:gap-6">
              <div className="site-card-glass p-7 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--site-fg-muted)]">
                  Não fazemos
                </p>
                <ul className="mt-5 space-y-3.5">
                  {limitsNo.map((t) => (
                    <li
                      key={t}
                      className="flex gap-3 text-[15px] leading-snug text-[var(--site-fg-muted)]"
                    >
                      <span className="mt-0.5 font-bold text-[var(--site-accent)]">
                        —
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="site-card-glass p-7 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--site-fg-muted)]">
                  Fazemos
                </p>
                <ul className="mt-5 space-y-3.5">
                  {limitsYes.map((t) => (
                    <li
                      key={t}
                      className="flex gap-3 text-[15px] leading-snug text-[var(--site-fg-muted)]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--site-accent)]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section
          id="faq"
          className="site-section border-t border-[var(--site-border)]"
        >
          <div className="site-container">
            <div className="mx-auto max-w-2xl">
              <p className="site-eyebrow text-center">FAQ</p>
              <h2 className="site-h-section mt-4 text-center">
                Perguntas que todo mundo faz.
              </h2>
              <div className="mt-12">
                {faqs.map((f, i) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="site-section border-t border-[var(--site-border)]">
          <div className="site-container text-center">
            <p className="site-eyebrow">Próximo passo</p>
            <h2 className="site-h-section mx-auto mt-4 max-w-2xl">
              Do silêncio das candidaturas para um plano claro
            </h2>
            <p className="site-body-lg mx-auto mt-5 max-w-lg">
              Crie a conta, cole o texto do seu material e gere o diagnóstico em 5
              abas.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/cadastro" className="site-btn-primary">
                Criar conta e começar
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="site-btn-secondary">
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-[2] border-t border-[var(--site-border)]">
        <div className="site-container flex flex-col items-center justify-between gap-8 py-12 sm:flex-row sm:py-14">
          <div className="text-center sm:text-left">
            <LogoWordmark href="/" size="sm" />
            <p className="mt-3 text-sm text-[var(--site-fg-muted)]">
              Evolua, Reposicione e Conquiste.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--site-fg-muted)]">
            <button type="button" onClick={() => scrollTo("features")} className="hover:text-[var(--site-fg)]">
              Produto
            </button>
            <button type="button" onClick={() => scrollTo("como-funciona")} className="hover:text-[var(--site-fg)]">
              Como funciona
            </button>
            <button type="button" onClick={() => scrollTo("faq")} className="hover:text-[var(--site-fg)]">
              FAQ
            </button>
            <Link href="/cadastro" className="hover:text-[var(--site-fg)]">
              Começar
            </Link>
          </div>
          <p className="text-center text-xs text-[var(--site-fg-dim)] sm:text-right">
            © {new Date().getFullYear()} CareerTwin
            <br />
            MVP · Sem promessas de contratação
          </p>
        </div>
      </footer>
    </div>
  );
}
