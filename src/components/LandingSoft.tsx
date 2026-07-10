"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge, Button, Card } from "@/components/ui";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  CircleDot,
  FileText,
  GitCompare,
  Layers,
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
   Conteúdo — denso e fechado
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
  { t: "Lendo o material que você colou…", d: 850 },
  { t: "Cruzando com o cargo-alvo…", d: 1000 },
  { t: "Priorizando o que ajustar primeiro…", d: 950 },
  { t: "Montando as 5 abas do diagnóstico…", d: 850 },
] as const;

const outputTabs = [
  { id: "visao", name: "Visão geral", desc: "Diagnóstico e próxima ação" },
  { id: "rec", name: "Recomendações", desc: "Prioridade, impacto, esforço" },
  { id: "aderencia", name: "Aderência", desc: "Score 0–100 + lacunas" },
  { id: "traducao", name: "Tradução", desc: "Antes/depois com alerta" },
  { id: "plano", name: "Plano", desc: "Checklist e reanálise" },
] as const;

const pageMap = [
  { href: "#mapa", label: "Mapa", n: "00" },
  { href: "#produto", label: "Produto", n: "01" },
  { href: "#prova", label: "Prova", n: "02" },
  { href: "#entrega", label: "Entrega", n: "03" },
  { href: "#confianca", label: "Confiança", n: "04" },
  { href: "#faq", label: "FAQ", n: "05" },
  { href: "#comecar", label: "Começar", n: "06" },
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
    a: "O MVP tem conta grátis para gerar o diagnóstico. Planos futuros podem expandir limites — a proposta de valor principal já está no diagnóstico.",
  },
];

const trustRules = [
  { ok: false, t: "Prometer contratação ou entrevista" },
  { ok: false, t: "Inventar cargos, métricas ou ferramentas" },
  { ok: false, t: "Fazer scraping do LinkedIn" },
  { ok: false, t: "Ler PDF sozinho no MVP (cole o texto)" },
  { ok: false, t: "Buscar vagas na internet por você" },
  { ok: true, t: "Analisar só o texto que você envia" },
  { ok: true, t: "Priorizar o que ajustar primeiro" },
  { ok: true, t: "Marcar alertas de autenticidade" },
  { ok: true, t: "Guardar análises só na sua conta" },
  { ok: true, t: "Permitir reanálise e comparação" },
];

/* ═══════════════════════════════════════════
   Primitivos
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

function ScoreRing({ value, size = 76 }: { value: number; size?: number }) {
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
          reduce ? { duration: 0 } : { duration: 1, ease: [0.22, 1, 0.36, 1] }
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(255,89,34,0.1),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(255,89,34,0.16),transparent_55%)]" />
      {!reduce && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(420px circle at ${spot.x}% ${spot.y}%, color-mix(in oklab, var(--brand) 10%, transparent), transparent 55%)`,
          }}
        />
      )}
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--card-border) 65%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--card-border) 65%, transparent) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 20%, black, transparent)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }}
      />
    </div>
  );
}

function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-primary px-1.5 font-mono text-[11px] font-bold text-white">
        {n}
      </span>
      <p className="text-sm font-bold text-primary">{children}</p>
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
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-foreground sm:text-[15px]">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform",
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
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <p className="pb-3.5 text-sm leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
    <div className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-[var(--shadow-lg)]">
      <div className="flex items-center justify-between gap-2 border-b border-card-border bg-muted-bg/70 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-card-border" />
            <span className="h-2 w-2 rounded-full bg-card-border" />
            <span className="h-2 w-2 rounded-full bg-card-border" />
          </span>
          <p className="truncate text-[11px] font-semibold text-muted">
            careertwin · diagnóstico · {persona.title}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleReanalysis}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors",
              reanalysis
                ? "bg-primary text-white"
                : "bg-card text-muted ring-1 ring-card-border hover:text-foreground"
            )}
          >
            <GitCompare className="h-3 w-3" />
            {reanalysis ? "Pós" : "Pré"}
          </button>
          <Badge tone={reanalysis ? "success" : "primary"} className="!text-[10px]">
            {reanalysis ? "Reanalisada" : "Concluída"}
          </Badge>
        </div>
      </div>

      <div className="relative p-4">
        <AnimatePresence>
          {simRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-card/92 px-5 text-center backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <p className="text-sm font-semibold">{simLabel ?? "Analisando…"}</p>
              <p className="text-[11px] text-muted">
                Simulação com exemplo — não é a sua análise.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Score de aderência
            </p>
            <p className="font-display text-4xl font-semibold leading-none">
              <AnimatedScore
                value={score}
                replayKey={`${persona.id}-${reanalysis}`}
              />
            </p>
            <p className="mt-1.5 text-xs font-semibold text-primary">{label}</p>
            {reanalysis && (
              <p className="mt-0.5 text-[10px] text-muted">
                Antes {persona.score} → depois de ações reais
              </p>
            )}
          </div>
          <div className="relative flex items-center justify-center">
            <ScoreRing value={score} key={`r-${persona.id}-${reanalysis}`} />
            <span className="absolute text-xs font-bold tabular-nums">{score}</span>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted-bg">
          <motion.div
            key={`b-${score}`}
            className="h-full rounded-full bg-gradient-to-r from-primary to-[#ff8f66]"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div
          className="-mx-0.5 mt-4 flex gap-1 overflow-x-auto pb-0.5"
          role="tablist"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => onTab(t.id)}
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all sm:text-xs",
                tab === t.id
                  ? "bg-primary text-white"
                  : "bg-muted-bg text-muted ring-1 ring-card-border hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-3 min-h-[150px] rounded-xl border border-card-border bg-muted-bg/40 p-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab}-${persona.id}-${reanalysis}-${showAfter}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-sm"
            >
              {tab === "visao" && (
                <div className="space-y-2 text-muted">
                  <p>
                    <strong className="text-foreground">Diagnóstico:</strong> base
                    real; falta clareza ao comunicar evidências e cargo.
                  </p>
                  <p>
                    <strong className="text-foreground">Próxima ação:</strong>{" "}
                    {persona.next}
                  </p>
                </div>
              )}
              {tab === "rec" && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1">
                    <Badge tone="primary">Comunicação</Badge>
                    <Badge>Impacto alto</Badge>
                    <Badge>Esforço médio</Badge>
                  </div>
                  <p className="font-semibold text-foreground">{persona.rec}</p>
                  <p className="rounded-lg border border-orange-200 bg-primary-soft px-2.5 py-2 text-[11px] text-[color:var(--brand-hover)] dark:border-orange-500/30 dark:text-[#ffc4b0]">
                    Autenticidade: use só se for verdade na sua trajetória.
                  </p>
                </div>
              )}
              {tab === "aderencia" && (
                <div className="space-y-2 text-muted">
                  <p>
                    <strong className="text-foreground">Presente:</strong>{" "}
                    {persona.present}
                  </p>
                  <p>
                    <strong className="text-foreground">Lacuna:</strong>{" "}
                    {persona.gap}
                  </p>
                  <p className="text-xs">
                    Score = alinhamento comunicado — não previsão de entrevista.
                  </p>
                </div>
              )}
              {tab === "traducao" && (
                <div className="space-y-2.5">
                  <div className="flex gap-1.5">
                    {(["Antes", "Depois"] as const).map((lab, i) => {
                      const after = i === 1;
                      const on = showAfter === after;
                      return (
                        <button
                          key={lab}
                          type="button"
                          onClick={() => onToggleAfter(after)}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-[11px] font-bold",
                            on
                              ? after
                                ? "bg-primary text-white"
                                : "bg-foreground text-background"
                              : "bg-muted-bg text-muted ring-1 ring-card-border"
                          )}
                        >
                          {lab}
                        </button>
                      );
                    })}
                  </div>
                  <p className="leading-relaxed text-foreground">
                    “{showAfter ? beforeAfter.after : beforeAfter.before}”
                  </p>
                </div>
              )}
              {tab === "plano" && (
                <ul className="space-y-1">
                  {planItems.map((item) => {
                    const done = !!planDone[item];
                    return (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => onTogglePlan(item)}
                          className="flex w-full items-start gap-2 rounded-md px-1 py-1.5 text-left text-muted hover:bg-muted-bg"
                        >
                          <CheckCircle2
                            className={cn(
                              "mt-0.5 h-3.5 w-3.5 shrink-0",
                              done ? "text-success" : "text-primary/35"
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs sm:text-sm",
                              done && "line-through opacity-60"
                            )}
                          >
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

        <p className="mt-2.5 text-center text-[10px] text-muted">
          Exemplo fictício · no app vem do{" "}
          <strong className="text-foreground">seu</strong> texto
        </p>
      </div>
    </div>
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

  const selectPersona = (id: PersonaId) => {
    setPersonaId(id);
    setReanalysis(false);
    setPlanDone({});
  };

  return (
    <div className="relative flex min-h-full flex-col overflow-x-hidden bg-background text-foreground">
      <LivingBackground />

      {/* NAV densa */}
      <nav
        className="sticky top-0 z-50 border-b border-card-border bg-[var(--header-bg)] backdrop-blur-xl"
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Logo href="/" size="sm" priority onDark={isDark} />
          <ul className="hidden items-center gap-1 lg:flex">
            {pageMap.slice(1).map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5">
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
        {/* ═══ HERO PREENCHIDO (2 colunas) ═══ */}
        <section className="border-b border-card-border">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8 lg:py-14">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-[color:var(--brand-hover)] dark:border-orange-500/30 dark:text-[#ffc4b0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Mentor de carreira · Brasil
                </span>
                <span className="rounded-full border border-card-border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted">
                  Sem promessa de emprego
                </span>
                <span className="rounded-full border border-card-border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted">
                  Sem inventar trajetória
                </span>
              </div>

              <h1 className="mt-4 font-display text-[clamp(1.85rem,4.2vw,2.85rem)] leading-[1.12] tracking-tight">
                Você manda currículo e{" "}
                <em className="not-italic text-primary sm:italic">
                  o silêncio responde
                </em>
                . A gente devolve um plano.
              </h1>

              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
                O CareerTwin analisa o que você{" "}
                <strong className="font-semibold text-foreground">já viveu</strong>{" "}
                e organiza em 5 abas: o que ajustar primeiro, se cola na vaga e
                como executar — com regras anti-invenção.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/cadastro">
                  <Button size="lg">
                    Quero meu diagnóstico
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#prova">
                  <Button size="lg" variant="outline">
                    Explorar o exemplo
                  </Button>
                </a>
              </div>

              {/* faixa de fatos — preenche o vazio sob o CTA */}
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { k: "5", v: "abas no resultado" },
                  { k: "8", v: "etapas no wizard" },
                  { k: "15+", v: "regras de honestidade" },
                  { k: "0", v: "promessas de vaga" },
                ].map((s) => (
                  <div
                    key={s.v}
                    className="rounded-xl border border-card-border bg-card/90 px-3 py-2.5 shadow-sm"
                  >
                    <p className="font-display text-xl font-semibold text-primary">
                      {s.k}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium leading-snug text-muted">
                      {s.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* mini preview no hero — mata o “lado vazio” */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-orange-200/20 blur-xl dark:from-primary/15"
              />
              <div className="relative">
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
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPersona(p.id)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors",
                        personaId === p.id
                          ? "bg-primary text-white"
                          : "bg-card text-muted ring-1 ring-card-border hover:text-foreground"
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

        {/* ═══ MAPA DA PÁGINA — fecha a lacuna “o que tem aqui?” ═══ */}
        <section
          id="mapa"
          className="border-b border-card-border bg-card/70"
        >
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Mapa desta página · nada escondido
              </p>
              <p className="text-xs text-muted sm:text-right">
                Role ou clique · cada bloco tem função
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {pageMap.map((m) => (
                <a
                  key={m.href}
                  href={m.href}
                  className="group flex items-center gap-2 rounded-xl border border-card-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary-soft/40"
                >
                  <span className="font-mono text-[10px] font-bold text-primary">
                    {m.n}
                  </span>
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary">
                    {m.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FLUXO CONTÍNUO ENTRADA → SAÍDA ═══ */}
        <section className="border-b border-card-border">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <SectionLabel n="00">Fluxo completo</SectionLabel>
            <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-[1.75rem]">
              Do material colado ao plano — sem buraco no meio
            </h2>
            <div className="mt-5 grid gap-0 overflow-hidden rounded-2xl border border-card-border sm:grid-cols-5">
              {[
                { t: "Cole CV + LinkedIn", d: "Texto real" },
                { t: "Cargo e vaga", d: "Alvo claro" },
                { t: "Análise estruturada", d: "Regras fixas" },
                { t: "5 abas", d: "Resultado estável" },
                { t: "Plano + reanálise", d: "Evolução" },
              ].map((step, i) => (
                <div
                  key={step.t}
                  className={cn(
                    "relative bg-card px-4 py-4",
                    i > 0 && "border-t border-card-border sm:border-t-0 sm:border-l"
                  )}
                >
                  <p className="font-mono text-[10px] font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {step.t}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{step.d}</p>
                  {i < 4 && (
                    <ArrowRight
                      className="absolute right-2 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-primary/40 sm:block"
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRODUTO: story + sticky ═══ */}
        <section id="produto" className="border-b border-card-border bg-muted-bg/30">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
              {/* STORY com spine */}
              <div className="relative space-y-0">
                {/* linha vertical contínua */}
                <div
                  aria-hidden
                  className="absolute bottom-4 left-[13px] top-4 hidden w-px bg-gradient-to-b from-primary via-card-border to-primary/40 sm:block"
                />

                {/* 01 personas */}
                <div className="relative pb-8 sm:pl-10">
                  <span className="absolute left-0 top-0 hidden h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-card text-[10px] font-bold text-primary sm:flex">
                    01
                  </span>
                  <SectionLabel n="01">Para quem · escolha e o painel reage</SectionLabel>
                  <h2 className="mt-2 font-display text-xl tracking-tight sm:text-2xl">
                    Três cenários reais, um diagnóstico diferente
                  </h2>
                  <div className="mt-4 space-y-2">
                    {personas.map((p) => {
                      const active = personaId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => selectPersona(p.id)}
                          className={cn(
                            "flex w-full gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                            active
                              ? "border-primary/45 bg-primary-soft/70 ring-1 ring-primary/25"
                              : "border-card-border bg-card hover:border-orange-200"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              active
                                ? "bg-primary text-white"
                                : "bg-muted-bg text-primary"
                            )}
                          >
                            <UserRound className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                              <span className="text-sm font-bold text-foreground">
                                {p.title}
                              </span>
                              <span className="text-[11px] text-muted">
                                {p.short}
                              </span>
                              <span className="ml-auto font-mono text-[11px] font-bold text-primary">
                                {p.score}
                              </span>
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-muted sm:text-[13px]">
                              {p.text}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 02 entrada */}
                <div id="entrada" className="relative pb-8 sm:pl-10">
                  <span className="absolute left-0 top-0 hidden h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-card text-[10px] font-bold text-primary sm:flex">
                    02
                  </span>
                  <SectionLabel n="02">O que entra · só o que você cola</SectionLabel>
                  <h2 className="mt-2 font-display text-xl tracking-tight sm:text-2xl">
                    Quatro peças do wizard, sem scraping
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {inputSteps.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setInputId(s.id)}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-left transition-all",
                          inputId === s.id
                            ? "border-primary/50 bg-primary text-white"
                            : "border-card-border bg-card text-foreground hover:border-orange-200"
                        )}
                      >
                        <span
                          className={cn(
                            "font-mono text-[10px] font-bold",
                            inputId === s.id ? "text-white/80" : "text-primary"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 rounded-xl border border-card-border bg-card p-3.5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeInput.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                          <p className="text-sm font-semibold">
                            {activeInput.label}
                          </p>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                          {activeInput.detail}
                        </p>
                        <p className="mt-2 rounded-lg border border-dashed border-card-border bg-muted-bg/60 px-2.5 py-2 font-mono text-[10px] text-muted sm:text-[11px]">
                          {activeInput.preview}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* 03 simulação */}
                <div className="relative pb-8 sm:pl-10">
                  <span className="absolute left-0 top-0 hidden h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-card text-[10px] font-bold text-primary sm:flex">
                    03
                  </span>
                  <SectionLabel n="03">Simulação · ritmo sem mentira</SectionLabel>
                  <h2 className="mt-2 font-display text-xl tracking-tight sm:text-2xl">
                    Veja o que acontece em ~30 segundos
                  </h2>
                  <p className="mt-1.5 text-sm text-muted">
                    Dados de exemplo. Não fingimos que já lemos o seu CV.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!simRunning ? (
                      <Button type="button" size="sm" onClick={runSimulation}>
                        <Play className="h-3.5 w-3.5" />
                        Simular análise
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          simCancel.current = true;
                          setSimRunning(false);
                          setSimLabel(null);
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancelar
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReanalysis((v) => !v);
                        setTab("aderencia");
                      }}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {reanalysis ? "Score inicial" : `Reanálise ${persona.score}→${persona.scoreAfter}`}
                    </Button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {simSteps.map((s, i) => (
                      <div
                        key={s.t}
                        className="flex items-start gap-2 rounded-lg border border-card-border bg-card px-2.5 py-2"
                      >
                        <CircleDot className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        <div>
                          <p className="font-mono text-[10px] text-primary">
                            {i + 1}/{simSteps.length}
                          </p>
                          <p className="text-[11px] font-medium leading-snug text-muted">
                            {s.t.replace("…", "")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 04 mentor */}
                <div className="relative sm:pl-10">
                  <span className="absolute left-0 top-0 hidden h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-card text-[10px] font-bold text-primary sm:flex">
                    04
                  </span>
                  <SectionLabel n="04">Mentor, não oráculo</SectionLabel>
                  <h2 className="mt-2 font-display text-xl tracking-tight sm:text-2xl">
                    Quem faz o quê — sem ambiguidade
                  </h2>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-card-border bg-card p-3.5">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <p className="text-sm font-bold">A IA</p>
                      </div>
                      <ul className="mt-2 space-y-1.5 text-xs text-muted">
                        {[
                          "Lê o texto colado",
                          "Prioriza recomendações",
                          "Estima aderência",
                          "Sugere reescritas + alerta",
                        ].map((t) => (
                          <li key={t} className="flex gap-1.5">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-card-border bg-card p-3.5">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <p className="text-sm font-bold">Você</p>
                      </div>
                      <ul className="mt-2 space-y-1.5 text-xs text-muted">
                        {[
                          "Decide o que é verdade",
                          "Aceita ou descarta sugestões",
                          "Aplica no CV/LinkedIn",
                          "Escolhe quando reanalisar",
                        ].map((t) => (
                          <li key={t} className="flex gap-1.5">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* STICKY PANEL */}
              <div id="prova" className="lg:sticky lg:top-20 lg:self-start">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Painel ao vivo · prova
                  </p>
                  <Badge tone="primary">Interativo</Badge>
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
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ENTREGA — bento denso ═══ */}
        <section id="entrega" className="border-b border-card-border">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel n="03">O que você leva</SectionLabel>
                <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-[1.75rem]">
                  Cinco abas. Sem monólogo solto.
                </h2>
              </div>
              <p className="max-w-xs text-xs text-muted sm:text-right">
                Formato estável no app — a landing mostra o mesmo mapa.
              </p>
            </div>

            {/* mapa das 5 abas — grade completa */}
            <div className="mt-5 grid gap-2 sm:grid-cols-5">
              {outputTabs.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id as DemoTab)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left transition-all",
                    tab === t.id
                      ? "border-primary bg-primary-soft/80 ring-1 ring-primary/30"
                      : "border-card-border bg-card hover:border-orange-200"
                  )}
                >
                  <p className="font-mono text-[10px] font-bold text-primary">
                    Aba {i + 1}
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">{t.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* bento 2x3 preenchido */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Sparkles,
                  t: "Recomendações priorizadas",
                  d: "Impacto, esforço e ação. Você marca o que já fez.",
                },
                {
                  icon: Target,
                  t: "Aderência a cargo e vaga",
                  d: "Score 0–100 — alinhamento, não previsão de entrevista.",
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
                <div
                  key={f.t}
                  className="flex gap-3 rounded-xl border border-card-border bg-card p-3.5 shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{f.t}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      {f.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CONFIANÇA — grade sim/não completa ═══ */}
        <section
          id="confianca"
          className="border-b border-card-border bg-card/60"
        >
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <SectionLabel n="04">Arquitetura de confiança</SectionLabel>
                <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-[1.75rem]">
                  Regras explícitas — o que faz e o que não faz
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Em vez de um parágrafo vazio no centro da tela: a tabela
                  completa. Assim não fica a sensação de que “falta um bloco”.
                </p>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {trustRules.map((r) => (
                  <div
                    key={r.t}
                    className={cn(
                      "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm",
                      r.ok
                        ? "border-emerald-200/80 bg-emerald-50/50 text-foreground dark:border-emerald-500/20 dark:bg-emerald-500/5"
                        : "border-card-border bg-background text-muted"
                    )}
                  >
                    {r.ok ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                    )}
                    <span className="text-xs font-medium leading-snug sm:text-[13px]">
                      <span className="font-bold">
                        {r.ok ? "Fazemos: " : "Não fazemos: "}
                      </span>
                      {r.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ + COMEÇAR lado a lado no desktop ═══ */}
        <section className="border-b border-card-border">
          <div className="mx-auto grid max-w-6xl gap-0 lg:grid-cols-2">
            <div
              id="faq"
              className="border-b border-card-border px-4 py-10 sm:px-6 sm:py-12 lg:border-b-0 lg:border-r lg:px-8"
            >
              <SectionLabel n="05">Perguntas frequentes</SectionLabel>
              <h2 className="mt-2 font-display text-2xl tracking-tight">
                Dúvidas fechadas antes do cadastro
              </h2>
              <div className="mt-4 rounded-2xl border border-card-border bg-card px-3 sm:px-4">
                {faqs.map((f, i) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
                ))}
              </div>
            </div>

            <div
              id="comecar"
              className="bg-muted-bg/40 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
            >
              <SectionLabel n="06">Começar · próximos 5 minutos</SectionLabel>
              <h2 className="mt-2 font-display text-2xl tracking-tight">
                Do silêncio para um plano claro
              </h2>
              <ol className="mt-5 space-y-2">
                {[
                  "Crie a conta com e-mail",
                  "Cole o texto do currículo e do LinkedIn",
                  "Informe o cargo-alvo (e a vaga, se quiser)",
                  "Receba o diagnóstico em 5 abas",
                  "Marque ações e reanalise se quiser",
                ].map((t, i) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 rounded-xl border border-card-border bg-card px-3.5 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{t}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link href="/cadastro" className="flex-1">
                  <Button size="lg" className="w-full">
                    Criar conta e começar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full">
                    Já tenho conta
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-center text-[11px] text-muted sm:text-left">
                Conta grátis · sem promessa de contratação · dados só seus
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER densificado — fecha a página */}
      <footer className="relative z-[2] border-t border-card-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo href="/" size="md" onDark={isDark} />
            <p className="mt-2 text-sm font-medium text-foreground">
              Evolua, Reposicione e Conquiste.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Mentor de carreira com IA. Clareza sobre o que você já viveu — sem
              vender milagre.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Produto
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { href: "#produto", l: "Como funciona" },
                { href: "#prova", l: "Exemplo interativo" },
                { href: "#entrega", l: "O que você leva" },
                { href: "/planos", l: "Planos" },
              ].map((x) => (
                <li key={x.l}>
                  <a
                    href={x.href}
                    className="font-medium text-muted hover:text-primary"
                  >
                    {x.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Conta
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { href: "/cadastro", l: "Criar conta" },
                { href: "/login", l: "Entrar" },
                { href: "/dashboard", l: "Dashboard" },
                { href: "#faq", l: "FAQ" },
              ].map((x) => (
                <li key={x.l}>
                  <Link
                    href={x.href}
                    className="font-medium text-muted hover:text-primary"
                  >
                    {x.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Princípios
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li className="flex gap-2">
                <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                Diagnóstico estruturado em 5 abas
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                Sem inventar experiência
              </li>
              <li className="flex gap-2">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                Dados isolados por usuário
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-card-border">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-muted sm:flex-row sm:px-6 sm:text-left lg:px-8">
            <p>© {new Date().getFullYear()} CareerTwin · MVP</p>
            <p>Sem promessas de contratação · Feito com honestidade operacional</p>
          </div>
        </div>
      </footer>

      {/* sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-card-border bg-[var(--header-bg)] p-2.5 backdrop-blur-xl sm:hidden">
        <Link href="/cadastro" className="block">
          <Button className="w-full" size="lg">
            Quero meu diagnóstico
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="h-[4.25rem] sm:hidden" aria-hidden />
    </div>
  );
}
