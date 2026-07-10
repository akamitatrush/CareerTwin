"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge, Button, Card } from "@/components/ui";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  FileText,
  GitCompare,
  Lock,
  MessageSquareQuote,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   Conteúdo
═══════════════════════════════════════════ */

const personas = [
  {
    id: "recolocacao",
    title: "Recolocação",
    short: "Silêncio nas candidaturas",
    text: "Mandou dezenas de currículos e o silêncio pesa. Quer saber o que ajustar primeiro — sem culpa e sem milagre.",
    score: 58,
    scoreAfter: 68,
    label: "Aderência parcial",
    labelAfter: "Boa aderência",
    next: "Clarear o título do LinkedIn e priorizar 3 evidências reais.",
    present: "organização, atendimento, rotinas",
    gap: "título genérico e poucas evidências no CV",
    rec: "Reescrever 3 bullets do último emprego com rotinas reais",
  },
  {
    id: "transicao",
    title: "Transição",
    short: "Experiência em outro formato",
    text: "Tem experiência, mas o mercado parece pedir “outro perfil”. Separar o que falta de verdade do que só está mal contado.",
    score: 64,
    scoreAfter: 74,
    label: "Base ok, posicionamento fraco",
    labelAfter: "Posicionamento alinhado",
    next: "Mapear competências transferíveis e reescrever o sumário.",
    present: "gestão de rotina, comunicação, prazos",
    gap: "linguagem ainda do cargo antigo",
    rec: "Traduzir 5 competências transferíveis no LinkedIn",
  },
  {
    id: "senior",
    title: "Sênior subposicionado",
    short: "Histórico forte, headline fraco",
    text: "Histórico forte, título genérico. Quer posicionamento à altura do que já entregou — sem inventar promoção.",
    score: 72,
    scoreAfter: 81,
    label: "Boa aderência",
    labelAfter: "Alta aderência comunicada",
    next: "Elevar o headline e quantificar 2–3 entregas reais.",
    present: "liderança informal, entregas, contexto de negócio",
    gap: "headline e sobre não refletem o nível",
    rec: "Atualizar headline + 2 resultados reais no sobre",
  },
] as const;

type PersonaId = (typeof personas)[number]["id"];

const inputSteps = [
  {
    id: "cv",
    label: "Currículo",
    detail:
      "Cole o texto do CV. No MVP a análise lê o texto — PDF pode ser guardado, mas não é parseado sozinho.",
    preview: "Experiência · Assistente administrativo · 2021–atual…",
  },
  {
    id: "li",
    label: "LinkedIn",
    detail:
      "Cole headline, sobre e experiências. O link é só armazenado — não fazemos scraping.",
    preview: "Headline · “Buscando novas oportunidades”…",
  },
  {
    id: "cargo",
    label: "Cargo-alvo",
    detail: "Usado para score de aderência e priorização das recomendações.",
    preview: "Analista Administrativo Jr",
  },
  {
    id: "vaga",
    label: "Vaga (opcional)",
    detail:
      "Cole a descrição para leitura extra de alinhamento — sem prometer entrevista.",
    preview: "Requisitos · responsabilidades · diferenciais…",
  },
] as const;

const beforeAfter = {
  before:
    "Responsável por auxiliar a equipe no dia a dia e atender demandas da área administrativa.",
  after:
    "Organizei rotinas de atendimento e documentação na área administrativa, alinhando prazos com a equipe — sem inventar volume ou métricas que não existiram.",
};

const simSteps = [
  { t: "Lendo o material que você colou…", d: 900 },
  { t: "Cruzando com o cargo-alvo…", d: 1100 },
  { t: "Priorizando o que ajustar primeiro…", d: 1000 },
  { t: "Montando as 5 abas do diagnóstico…", d: 900 },
] as const;

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
];

const navLinks = [
  { href: "#produto", label: "Produto" },
  { href: "#prova", label: "Prova" },
  { href: "#confianca", label: "Confiança" },
  { href: "#faq", label: "FAQ" },
];

/* ═══════════════════════════════════════════
   Primitivos visuais
═══════════════════════════════════════════ */

function AnimatedScore({
  value,
  replayKey,
}: {
  value: number;
  replayKey?: string | number;
}) {
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
    setN(0);
    const duration = 850;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, replayKey, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
    </span>
  );
}

function ScoreRing({ value, size = 80 }: { value: number; size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reduce = useReducedMotion();
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--muted-bg)"
        strokeWidth={5}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--brand)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={
          inView || reduce
            ? { strokeDashoffset: offset }
            : { strokeDashoffset: c }
        }
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 1, ease: [0.22, 1, 0.36, 1] }
        }
      />
    </svg>
  );
}

function LivingBackground() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(28);
  const sx = useSpring(mx, { stiffness: 40, damping: 28 });
  const sy = useSpring(my, { stiffness: 40, damping: 28 });
  const [spot, setSpot] = useState({ x: 50, y: 28 });

  useEffect(() => {
    if (reduce) return;
    const ux = sx.on("change", (v) => setSpot((s) => ({ ...s, x: v })));
    const uy = sy.on("change", (v) => setSpot((s) => ({ ...s, y: v })));
    return () => {
      ux();
      uy();
    };
  }, [sx, sy, reduce]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100);
      my.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(255,89,34,0.11),transparent_55%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(255,89,34,0.18),transparent_55%)]" />
      {!reduce && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(480px circle at ${spot.x}% ${spot.y}%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 55%)`,
          }}
        />
      )}
      <motion.div
        className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/12 blur-3xl dark:bg-primary/22"
        animate={reduce ? undefined : { x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 top-[32%] h-80 w-80 rounded-full bg-orange-300/15 blur-3xl dark:bg-orange-500/12"
        animate={reduce ? undefined : { x: [0, -20, 0], y: [0, 28, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--card-border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--card-border) 70%, transparent) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 25%, black, transparent)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }}
      />
    </div>
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
    <div className="border-b border-card-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180 text-primary"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Painel sticky do resultado (coração da landing)
═══════════════════════════════════════════ */

type DemoTab = "visao" | "rec" | "aderencia" | "traducao" | "plano";

function ResultPanel({
  persona,
  tab,
  onTab,
  showAfter,
  onToggleAfter,
  planDone,
  onTogglePlan,
  reanalysis,
  onToggleReanalysis,
  simRunning,
  simLabel,
}: {
  persona: (typeof personas)[number];
  tab: DemoTab;
  onTab: (t: DemoTab) => void;
  showAfter: boolean;
  onToggleAfter: (v: boolean) => void;
  planDone: Record<string, boolean>;
  onTogglePlan: (key: string) => void;
  reanalysis: boolean;
  onToggleReanalysis: () => void;
  simRunning: boolean;
  simLabel: string | null;
}) {
  const score = reanalysis ? persona.scoreAfter : persona.score;
  const label = reanalysis ? persona.labelAfter : persona.label;

  const planItems = [
    "Atualizar título do LinkedIn — 2 dias",
    "Reescrever 3 bullets do currículo — 5 dias",
    "Listar 5 evidências reais — 1 semana",
  ];

  const tabs: { id: DemoTab; label: string }[] = [
    { id: "visao", label: "Visão" },
    { id: "rec", label: "Recs" },
    { id: "aderencia", label: "Aderência" },
    { id: "traducao", label: "Tradução" },
    { id: "plano", label: "Plano" },
  ];

  return (
    <Card
      variant="elevated"
      padding="none"
      className="overflow-hidden border-card-border/90 shadow-[var(--shadow-lg)]"
    >
      {/* chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-card-border bg-muted-bg/60 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted">
            Diagnóstico · exemplo
          </p>
          <p className="truncate text-xs font-medium text-foreground">
            {persona.title}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleReanalysis}
            className={cn(
              "hidden items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors sm:inline-flex",
              reanalysis
                ? "bg-primary text-white"
                : "bg-card text-muted ring-1 ring-card-border hover:text-foreground"
            )}
          >
            <GitCompare className="h-3 w-3" />
            {reanalysis ? "Pós-reanálise" : "Pré"}
          </button>
          <Badge tone={reanalysis ? "success" : "primary"}>
            {reanalysis ? "Reanalisada" : "Concluída"}
          </Badge>
        </div>
      </div>

      <div className="relative p-4 sm:p-5">
        {/* overlay simulação */}
        <AnimatePresence>
          {simRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/90 px-6 text-center backdrop-blur-sm"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                <span className="relative h-3 w-3 rounded-full bg-primary" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                {simLabel ?? "Analisando…"}
              </p>
              <p className="text-[11px] text-muted">
                Simulação com dados de exemplo — não é a sua análise.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Score de aderência</p>
            <p className="mt-0.5 font-display text-4xl font-semibold sm:text-5xl">
              <AnimatedScore value={score} replayKey={`${persona.id}-${reanalysis}`} />
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">{label}</p>
            {reanalysis && (
              <p className="mt-1 text-[11px] text-muted">
                Antes: {persona.score} → depois de ações reais no material
              </p>
            )}
          </div>
          <div className="relative flex items-center justify-center">
            <ScoreRing value={score} key={`ring-${persona.id}-${reanalysis}`} />
            <span className="absolute text-sm font-semibold tabular-nums">
              {score}
            </span>
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted-bg">
          <motion.div
            key={`bar-${score}`}
            className="h-full rounded-full bg-gradient-to-r from-primary to-[#ff8f66]"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          />
        </div>

        {/* tabs — scroll horizontal no mobile */}
        <div
          className="-mx-1 mt-5 flex gap-1.5 overflow-x-auto px-1 pb-1 scrollbar-none"
          role="tablist"
          aria-label="Abas do resultado"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => onTab(t.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm",
                tab === t.id
                  ? "bg-primary text-white shadow-md shadow-orange-500/20"
                  : "bg-muted-bg text-muted ring-1 ring-card-border hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[168px] rounded-xl border border-card-border bg-muted-bg/35 p-3.5 sm:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab}-${persona.id}-${reanalysis}-${showAfter}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "visao" && (
                <div className="space-y-2.5 text-sm text-muted">
                  <p>
                    <strong className="text-foreground">Diagnóstico:</strong>{" "}
                    perfil com base real; principal oportunidade é comunicar
                    evidências e o cargo com mais clareza.
                  </p>
                  <p>
                    <strong className="text-foreground">Próxima ação:</strong>{" "}
                    {persona.next}
                  </p>
                </div>
              )}
              {tab === "rec" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="primary">Comunicação</Badge>
                    <Badge>Impacto alto</Badge>
                    <Badge>Esforço médio</Badge>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {persona.rec}
                  </p>
                  <p className="rounded-lg border border-orange-200 bg-primary-soft px-3 py-2 text-[11px] text-[color:var(--brand-hover)] dark:border-orange-500/30 dark:text-[#ffc4b0]">
                    Alerta de autenticidade: só use se refletir o que você
                    realmente fez.
                  </p>
                </div>
              )}
              {tab === "aderencia" && (
                <div className="space-y-2.5 text-sm text-muted">
                  <p>
                    <strong className="text-foreground">Presente:</strong>{" "}
                    {persona.present}
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Lacuna de comunicação:
                    </strong>{" "}
                    {persona.gap}
                  </p>
                  <p className="text-xs">
                    Score é leitura de alinhamento — não previsão de entrevista.
                  </p>
                </div>
              )}
              {tab === "traducao" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleAfter(false)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        !showAfter
                          ? "bg-foreground text-background"
                          : "bg-muted-bg text-muted ring-1 ring-card-border"
                      )}
                    >
                      Antes
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleAfter(true)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        showAfter
                          ? "bg-primary text-white"
                          : "bg-muted-bg text-muted ring-1 ring-card-border"
                      )}
                    >
                      Depois
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    “{showAfter ? beforeAfter.after : beforeAfter.before}”
                  </p>
                  {showAfter && (
                    <p className="text-[11px] text-muted">
                      Sugestão de reescrita · sem inventar métricas.
                    </p>
                  )}
                </div>
              )}
              {tab === "plano" && (
                <ul className="space-y-1.5">
                  {planItems.map((item) => {
                    const done = !!planDone[item];
                    return (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => onTogglePlan(item)}
                          className="flex w-full items-start gap-2 rounded-lg px-1.5 py-1.5 text-left text-sm text-muted hover:bg-muted-bg"
                        >
                          <CheckCircle2
                            className={cn(
                              "mt-0.5 h-4 w-4 shrink-0",
                              done ? "text-success" : "text-primary/40"
                            )}
                          />
                          <span className={cn(done && "line-through opacity-65")}>
                            {item}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-3 text-center text-[10px] text-muted sm:text-[11px]">
          Números fictícios de exemplo. No app, tudo vem do{" "}
          <strong className="font-semibold text-foreground">seu</strong> texto.
        </p>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   Landing
═══════════════════════════════════════════ */

export function LandingSoft() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [personaId, setPersonaId] = useState<PersonaId>("senior");
  const [inputId, setInputId] = useState<(typeof inputSteps)[number]["id"]>("cv");
  const [tab, setTab] = useState<DemoTab>("rec");
  const [showAfter, setShowAfter] = useState(false);
  const [planDone, setPlanDone] = useState<Record<string, boolean>>({});
  const [reanalysis, setReanalysis] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simLabel, setSimLabel] = useState<string | null>(null);
  const simCancel = useRef(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  const persona = personas.find((p) => p.id === personaId) ?? personas[2];
  const activeInput = inputSteps.find((s) => s.id === inputId) ?? inputSteps[0];

  const runSimulation = useCallback(async () => {
    if (simRunning) return;
    simCancel.current = false;
    setSimRunning(true);
    setReanalysis(false);
    for (const step of simSteps) {
      if (simCancel.current) break;
      setSimLabel(step.t);
      await new Promise((r) => setTimeout(r, step.d));
    }
    if (!simCancel.current) {
      setSimLabel(null);
      setSimRunning(false);
      setTab("visao");
    }
  }, [simRunning]);

  const stopSimulation = () => {
    simCancel.current = true;
    setSimRunning(false);
    setSimLabel(null);
  };

  const selectPersona = (id: PersonaId) => {
    setPersonaId(id);
    setReanalysis(false);
    setPlanDone({});
  };

  return (
    <div className="relative flex min-h-full flex-col overflow-x-hidden bg-background text-foreground">
      <LivingBackground />

      {/* NAV */}
      <nav
        className="sticky top-0 z-50 border-b border-card-border/90 bg-[var(--header-bg)] backdrop-blur-xl"
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Logo href="/" size="sm" priority onDark={isDark} />
          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-semibold text-muted transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle variant="ghost" />
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-[2] flex-1">
        {/* ── HERO ── */}
        <section className="border-b border-card-border">
          <div className="mx-auto max-w-3xl px-4 pb-12 pt-14 text-center sm:px-6 sm:pb-16 sm:pt-20 lg:pt-22">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-[color:var(--brand-hover)] dark:border-orange-500/30 dark:text-[#ffc4b0]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Mentor de carreira · sem promessa de emprego
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="mt-5 font-display text-[clamp(2.1rem,5.2vw,3.4rem)] leading-[1.1] tracking-tight"
            >
              Você manda currículo e{" "}
              <em className="not-italic text-primary sm:italic">
                o silêncio responde
              </em>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              O CareerTwin analisa o que você{" "}
              <strong className="font-semibold text-foreground">já viveu</strong>{" "}
              e devolve clareza: o que ajustar primeiro, se o perfil cola na vaga
              e um plano executável.{" "}
              <strong className="font-semibold text-foreground">
                Sem inventar trajetória.
              </strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link href="/cadastro">
                <Button size="lg">
                  Quero meu diagnóstico
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#prova">
                <Button size="lg" variant="outline">
                  Ver um resultado de verdade
                </Button>
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-xs text-muted"
            >
              Conta grátis · cole o texto · 5 abas de diagnóstico
            </motion.p>
          </div>
        </section>

        {/* ── PRODUTO: story + sticky ── */}
        <section id="produto" className="border-b border-card-border">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
              {/* COLUNA STORY */}
              <div className="space-y-14 sm:space-y-16">
                {/* 1 · Para quem */}
                <div>
                  <p className="text-sm font-bold text-primary">01 · Para quem</p>
                  <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                    Escolha o cenário — o painel reage
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Três situações reais. Clique e veja score, diagnóstico e
                    recomendações mudarem no painel.
                  </p>
                  <div className="mt-6 space-y-2.5">
                    {personas.map((p) => {
                      const active = personaId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => selectPersona(p.id)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all",
                            active
                              ? "border-primary/50 bg-primary-soft/60 shadow-sm ring-1 ring-primary/30"
                              : "border-card-border bg-card/70 hover:border-orange-200 hover:bg-card"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                              active
                                ? "bg-primary text-white"
                                : "bg-muted-bg text-primary"
                            )}
                          >
                            <UserRound className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-foreground">
                                {p.title}
                              </span>
                              <span className="text-[11px] font-medium text-muted">
                                {p.short}
                              </span>
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-muted">
                              {p.text}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2 · O que entra */}
                <div id="entrada">
                  <p className="text-sm font-bold text-primary">02 · O que entra</p>
                  <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                    Só o que você fornece
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Sem scraping. Sem “a IA descobriu sua vida”. Clique em cada
                    peça do wizard.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {inputSteps.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setInputId(s.id)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all",
                          inputId === s.id
                            ? "bg-primary text-white shadow-md shadow-orange-500/20"
                            : "bg-muted-bg text-muted ring-1 ring-card-border hover:text-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                            inputId === s.id
                              ? "bg-white/20 text-white"
                              : "bg-card text-muted"
                          )}
                        >
                          {i + 1}
                        </span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <Card className="mt-4 !p-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeInput.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <p className="text-sm font-semibold">
                            {activeInput.label}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {activeInput.detail}
                        </p>
                        <p className="mt-3 rounded-lg border border-dashed border-card-border bg-muted-bg/50 px-3 py-2 font-mono text-[11px] text-muted">
                          {activeInput.preview}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </Card>
                </div>

                {/* 3 · Simulação */}
                <div>
                  <p className="text-sm font-bold text-primary">03 · O que acontece</p>
                  <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                    Simule a análise em ~30s
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Uma simulação honesta com dados de exemplo — para você ver o
                    ritmo, não para fingir que já analisamos o seu CV.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {!simRunning ? (
                      <Button type="button" onClick={runSimulation}>
                        <Play className="h-4 w-4" />
                        Simular análise
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={stopSimulation}>
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setReanalysis((v) => !v);
                        setTab("aderencia");
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      {reanalysis ? "Ver score inicial" : "Ver reanálise"}
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    Reanálise: depois de executar o plano, o score de exemplo sobe
                    de {persona.score} para {persona.scoreAfter}.
                  </p>
                </div>

                {/* 4 · Mentor vs oráculo */}
                <div>
                  <p className="text-sm font-bold text-primary">
                    04 · Mentor, não oráculo
                  </p>
                  <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                    Responsabilidade compartilhada
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Card className="!p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Bot className="h-4 w-4" />
                        <p className="text-sm font-semibold text-foreground">
                          O que a IA faz
                        </p>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-muted">
                        {[
                          "Lê o texto que você cola",
                          "Prioriza recomendações",
                          "Estima aderência ao cargo/vaga",
                          "Sugere reescritas com alerta",
                        ].map((t) => (
                          <li key={t} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </Card>
                    <Card className="!p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <User className="h-4 w-4" />
                        <p className="text-sm font-semibold text-foreground">
                          O que só você decide
                        </p>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-muted">
                        {[
                          "O que é verdade na sua trajetória",
                          "Se aceita cada sugestão",
                          "Se aplica no CV/LinkedIn",
                          "Quando reanalisar",
                        ].map((t) => (
                          <li key={t} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>

                {/* CTA mid story */}
                <Card
                  variant="brand"
                  className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Pronto para o seu, de verdade?
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Crie a conta e cole o texto do seu material.
                    </p>
                  </div>
                  <Link href="/cadastro" className="shrink-0">
                    <Button>
                      Criar conta grátis
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </div>

              {/* COLUNA STICKY PANEL */}
              <div id="prova" className="lg:sticky lg:top-24 lg:self-start">
                <div className="mb-3 flex items-center justify-between gap-2 lg:mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Painel ao vivo
                  </p>
                  <a
                    href="#prova"
                    className="text-xs font-semibold text-primary lg:hidden"
                  >
                    Ver resultado
                  </a>
                </div>
                <ResultPanel
                  persona={persona}
                  tab={tab}
                  onTab={setTab}
                  showAfter={showAfter}
                  onToggleAfter={setShowAfter}
                  planDone={planDone}
                  onTogglePlan={(key) =>
                    setPlanDone((s) => ({ ...s, [key]: !s[key] }))
                  }
                  reanalysis={reanalysis}
                  onToggleReanalysis={() => {
                    setReanalysis((v) => !v);
                    setTab("aderencia");
                  }}
                  simRunning={simRunning}
                  simLabel={simLabel}
                />

                {/* mobile: quick persona pills under panel */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPersona(p.id)}
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                        personaId === p.id
                          ? "bg-primary text-white"
                          : "bg-muted-bg text-muted ring-1 ring-card-border"
                      )}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── O QUE VOCÊ LEVA (compacto) ── */}
        <section className="border-b border-card-border bg-card/40 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-bold text-primary">O que você leva</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
              Cinco abas. Um plano. Sem monólogo.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Sparkles,
                  t: "Recomendações priorizadas",
                  d: "Impacto, esforço e ação. Você marca o que já fez.",
                },
                {
                  icon: Target,
                  t: "Aderência a cargo e vaga",
                  d: "Score 0–100 — leitura de alinhamento, não promessa.",
                },
                {
                  icon: MessageSquareQuote,
                  t: "Tradução com autenticidade",
                  d: "Reescritas em linguagem de mercado + alerta.",
                },
                {
                  icon: GitCompare,
                  t: "Plano e reanálise",
                  d: "Checklist e comparação de evolução no score.",
                },
                {
                  icon: Lock,
                  t: "Dados só seus",
                  d: "Login com e-mail. Análises isoladas por usuário.",
                },
                {
                  icon: ShieldCheck,
                  t: "Regras anti-invenção",
                  d: "Sem cargos, métricas ou ferramentas inventadas.",
                },
              ].map((f) => (
                <Card key={f.t} variant="interactive" className="!p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold">{f.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{f.d}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONFIANÇA ── */}
        <section
          id="confianca"
          className="border-b border-card-border py-14 sm:py-16"
        >
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-primary">Arquitetura de confiança</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
              Preferimos dizer o que{" "}
              <em className="not-italic text-primary sm:italic">não</em> fazemos
            </h2>
            <ul className="mx-auto mt-8 max-w-md space-y-2 text-left">
              {[
                "Não prometemos contratação nem entrevista",
                "Não inventamos experiências ou métricas",
                "Não fazemos scraping do LinkedIn",
                "Não lemos PDF sozinhos no MVP — cole o texto",
                "Não buscamos vagas na internet por você",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-3 rounded-xl border border-card-border bg-card/80 px-4 py-3 text-sm text-muted shadow-sm backdrop-blur-sm"
                >
                  <span className="font-bold text-primary">—</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="border-b border-card-border py-14 sm:py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <p className="text-center text-sm font-bold text-primary">
              Perguntas frequentes
            </p>
            <h2 className="mt-2 text-center font-display text-2xl tracking-tight sm:text-3xl">
              Tira a dúvida antes de entrar
            </h2>
            <Card variant="elevated" className="mt-8 !p-2 sm:!p-4">
              {faqs.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
              ))}
            </Card>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative py-16 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_40%,rgba(255,89,34,0.09),transparent)]"
          />
          <div className="relative mx-auto max-w-xl px-4 text-center sm:px-6">
            <p className="text-sm font-bold text-primary">Próximos 5 minutos</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-4xl">
              Do silêncio para um plano claro
            </h2>
            <ol className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-muted">
              {[
                "Crie a conta com e-mail",
                "Cole o texto do currículo e do LinkedIn",
                "Informe o cargo-alvo (e a vaga, se quiser)",
                "Receba o diagnóstico em 5 abas",
              ].map((t, i) => (
                <li
                  key={t}
                  className="flex items-center gap-3 rounded-xl border border-card-border bg-card/70 px-3.5 py-2.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/cadastro">
                <Button size="lg">
                  Criar conta e começar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-[2] border-t border-card-border bg-card/80 py-10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Logo href="/" size="md" onDark={isDark} />
            <p className="text-sm text-muted">Evolua, Reposicione e Conquiste.</p>
          </div>
          <div className="text-center text-sm text-muted sm:text-right">
            <p>© {new Date().getFullYear()} CareerTwin</p>
            <p className="mt-1">
              Mentor de carreira · MVP · Sem promessas de contratação
            </p>
          </div>
        </div>
      </footer>

      {/* sticky CTA mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-card-border bg-[var(--header-bg)] p-3 backdrop-blur-xl sm:hidden">
        <Link href="/cadastro" className="block">
          <Button className="w-full" size="lg">
            Quero meu diagnóstico
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      {/* spacer for mobile sticky CTA */}
      <div className="h-20 sm:hidden" aria-hidden />
    </div>
  );
}
