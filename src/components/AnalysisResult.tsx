"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  ProgressBar,
  ScoreRing,
  Textarea,
} from "@/components/ui";
import {
  CATEGORY,
  CONFIDENCE,
  EFFORT,
  FEEDBACK_RATING,
  IMPACT,
  PLAN_STATUS,
  PRIORITY,
  REC_STATUS,
  STATUS_ANALYSIS,
  URGENCY,
  label,
} from "@/lib/labels";
import { formatDateBR } from "@/lib/utils";
import type {
  AnalysisVersion,
  CareerAnalysis,
  EvolutionPlanAction,
  ExperienceTranslation,
  FitDiagnostic,
  Recommendation,
} from "@/lib/types";
import {
  Check,
  CheckCircle2,
  Copy,
  RefreshCw,
  Sparkles,
  Undo2,
} from "lucide-react";

type Tab = "visao" | "recomendacoes" | "aderencia" | "traducao" | "plano";

const TABS: { id: Tab; label: string }[] = [
  { id: "visao", label: "Visão geral" },
  { id: "recomendacoes", label: "Recomendações" },
  { id: "aderencia", label: "Aderência" },
  { id: "traducao", label: "Tradução da experiência" },
  { id: "plano", label: "Plano de evolução" },
];

function impactTone(v: string): "danger" | "warning" | "neutral" | "primary" {
  if (v === "alto" || v === "alta") return "danger";
  if (v === "medio" || v === "media") return "warning";
  return "neutral";
}

export function AnalysisResult({
  analysis,
  recommendations: initialRecs,
  fits,
  translations,
  plan: initialPlan,
  versionCompare,
  existingFeedback,
}: {
  analysis: CareerAnalysis;
  recommendations: Recommendation[];
  fits: FitDiagnostic[];
  translations: ExperienceTranslation[];
  plan: EvolutionPlanAction[];
  versionCompare: (AnalysisVersion & {
    original_score?: number | null;
  }) | null;
  existingFeedback: { rating: string; comment: string | null } | null;
}) {
  const [tab, setTab] = useState<Tab>("visao");
  const [recs, setRecs] = useState(initialRecs);
  const [plan, setPlan] = useState(initialPlan);
  const [recFilter, setRecFilter] = useState("todas");
  const [toast, setToast] = useState<string | null>(null);
  const [exampleId, setExampleId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(Boolean(existingFeedback));
  const [feedbackRating, setFeedbackRating] = useState(existingFeedback?.rating || "");
  const [feedbackComment, setFeedbackComment] = useState(existingFeedback?.comment || "");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function toggleRec(id: string, current: string) {
    const next = current === "concluida" ? "pendente" : "concluida";
    setRecs((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
    const res = await fetch(`/api/recommendations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setRecs((prev) => prev.map((r) => (r.id === id ? { ...r, status: current as Recommendation["status"] } : r)));
      showToast("Não foi possível atualizar a recomendação.");
    } else {
      showToast(next === "concluida" ? "Marcada como feita." : "Reaberta.");
    }
  }

  async function toggleAction(id: string, current: string) {
    const next = current === "concluido" ? "pendente" : "concluido";
    setPlan((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
    const res = await fetch(`/api/actions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setPlan((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: current as EvolutionPlanAction["status"] } : a))
      );
      showToast("Não foi possível atualizar a ação.");
    } else {
      showToast(next === "concluido" ? "Ação concluída." : "Ação reaberta.");
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Sugestão copiada.");
    } catch {
      showToast("Não foi possível copiar.");
    }
  }

  async function sendFeedback() {
    if (!feedbackRating) return;
    setFeedbackLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis_id: analysis.id,
          rating: feedbackRating,
          comment: feedbackComment,
        }),
      });
      if (!res.ok) throw new Error();
      setFeedbackSent(true);
      showToast("Obrigado pelo feedback!");
    } catch {
      showToast("Erro ao enviar feedback.");
    } finally {
      setFeedbackLoading(false);
    }
  }

  const filteredRecs = useMemo(() => {
    return recs
      .filter((r) => {
        if (recFilter === "todas") return true;
        if (recFilter === "alto_impacto") return r.impact === "alto";
        if (recFilter === "baixo_esforco") return r.effort === "baixo";
        return r.category === recFilter;
      })
      .sort((a, b) => a.priority_order - b.priority_order);
  }, [recs, recFilter]);

  const highImpact = recs.filter((r) => r.impact === "alto").length;
  const planDone = plan.filter((a) => a.status === "concluido").length;
  const planProgress = plan.length ? Math.round((planDone / plan.length) * 100) : 0;
  const nextPlan = plan.find((a) => a.status !== "concluido");
  const cargoFit = fits.find((f) => f.fit_type === "cargo_alvo");
  const vagaFit = fits.find((f) => f.fit_type === "vaga_especifica");
  const score = analysis.overall_score ?? cargoFit?.score ?? 0;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-foreground px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl text-foreground">{analysis.title}</h1>
            <Badge tone={analysis.status === "completed" ? "success" : "warning"}>
              {label(STATUS_ANALYSIS, analysis.status)}
            </Badge>
          </div>
          <p className="mt-2 text-muted">
            {analysis.target_role || "Cargo a definir"}
            {analysis.job_company || analysis.job_title
              ? ` · ${[analysis.job_title, analysis.job_company].filter(Boolean).join(" — ")}`
              : ""}
            {" · "}
            {formatDateBR(analysis.created_at)}
            {analysis.overall_score != null && ` · Score ${analysis.overall_score}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/analise/nova">
            <Button variant="outline" size="sm">
              <Sparkles className="h-3.5 w-3.5" />
              Nova análise
            </Button>
          </Link>
          <Link href={`/analise/nova?reanalise=${analysis.id}`}>
            <Button size="sm">
              <RefreshCw className="h-3.5 w-3.5" />
              Fazer reanálise
            </Button>
          </Link>
        </div>
      </div>

      {/* Resumo executivo */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <ScoreRing score={score} label="score" />
          <div>
            <p className="text-sm text-muted">Score geral</p>
            <p className="font-semibold">{cargoFit?.level || "—"}</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted">Principal ponto forte</p>
          <p className="mt-2 text-sm font-medium leading-snug">{analysis.main_strength || "—"}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Principal lacuna</p>
          <p className="mt-2 text-sm font-medium leading-snug">{analysis.main_gap || "—"}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Próxima ação recomendada</p>
          <p className="mt-2 text-sm font-medium leading-snug">
            {analysis.next_best_action || "—"}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-card-border pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-card text-primary border border-b-card border-card-border"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "visao" && (
        <div className="space-y-4 animate-fade-up">
          {versionCompare && (
            <Card className="border-accent/20 bg-accent-soft/40">
              <h3 className="font-semibold text-foreground">Comparativo com análise anterior</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted">Score anterior</p>
                  <p className="text-2xl font-semibold">
                    {versionCompare.original_score ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Score atual</p>
                  <p className="text-2xl font-semibold">{score}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Diferença</p>
                  <p
                    className={`text-2xl font-semibold ${
                      (versionCompare.score_change ?? 0) > 0
                        ? "text-success"
                        : (versionCompare.score_change ?? 0) < 0
                          ? "text-danger"
                          : "text-muted"
                    }`}
                  >
                    {(versionCompare.score_change ?? 0) > 0 ? "+" : ""}
                    {versionCompare.score_change ?? 0}
                  </p>
                </div>
              </div>
              {versionCompare.improvements_summary && (
                <p className="mt-3 text-sm text-muted">{versionCompare.improvements_summary}</p>
              )}
              {versionCompare.remaining_gaps && (
                <p className="mt-2 text-sm">
                  <strong>Lacunas em aberto:</strong> {versionCompare.remaining_gaps}
                </p>
              )}
            </Card>
          )}

          <Card>
            <h3 className="font-semibold">Diagnóstico geral</h3>
            <p className="mt-3 leading-relaxed text-muted">
              {analysis.general_diagnosis || analysis.summary || "Diagnóstico indisponível."}
            </p>
          </Card>

          <Card>
            <h3 className="font-semibold">Nota de confiança</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                tone={
                  analysis.confidence === "alta"
                    ? "success"
                    : analysis.confidence === "media"
                      ? "warning"
                      : "danger"
                }
              >
                {label(CONFIDENCE, analysis.confidence)}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              {analysis.confidence === "alta" &&
                "Esta análise tem alta confiança porque currículo, LinkedIn e cargo-alvo foram informados com bom nível de detalhe."}
              {analysis.confidence === "media" &&
                "Esta análise tem média confiança porque falta um material relevante ou as evidências de resultado ainda são limitadas."}
              {analysis.confidence === "baixa" &&
                "Esta análise tem baixa confiança porque poucos materiais foram enviados. Complete currículo e LinkedIn para um diagnóstico mais preciso."}
              {!analysis.confidence && "Confiança não calculada."}
            </p>
          </Card>

          {analysis.wants_role_suggestions &&
            analysis.suggested_roles &&
            analysis.suggested_roles.length > 0 && (
              <Card className="border-primary/20 bg-primary-soft/30">
                <h3 className="font-semibold text-primary">Cargos sugeridos para você</h3>
                <p className="mt-1 text-sm text-muted">
                  Com base nos materiais enviados — valide se fazem sentido para sua trajetória real.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {analysis.suggested_roles.map((role) => (
                    <li
                      key={role}
                      className="rounded-full bg-card border border-primary/20 px-4 py-2 text-sm font-medium"
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="font-semibold">Principais forças</h3>
              <ul className="mt-3 space-y-2">
                {(cargoFit?.strengths || []).map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-muted">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="font-semibold">Principais lacunas</h3>
              <ul className="mt-3 space-y-2">
                {(cargoFit?.gaps || []).map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <h3 className="font-semibold">Recomendações prioritárias</h3>
            <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-muted">
              {recs
                .slice()
                .sort((a, b) => a.priority_order - b.priority_order)
                .slice(0, 3)
                .map((r) => (
                  <li key={r.id}>
                    <span className="text-foreground font-medium">{r.title}</span>
                  </li>
                ))}
            </ol>
          </Card>

          {vagaFit && (
            <Card>
              <h3 className="font-semibold">Decisão sugerida sobre a vaga</h3>
              <p className="mt-2 font-medium text-primary">{vagaFit.recommendation}</p>
              <p className="mt-2 text-sm text-muted">{vagaFit.reasoning}</p>
            </Card>
          )}

          <Card>
            <h3 className="font-semibold">Próximos passos</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {analysis.next_best_action} Em seguida, avance nas ações do plano de evolução e
              faça uma reanálise quando atualizar seus materiais.
            </p>
          </Card>
        </div>
      )}

      {tab === "recomendacoes" && (
        <div className="space-y-4 animate-fade-up">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-sm text-muted">Total</p>
              <p className="mt-1 text-2xl font-semibold">{recs.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Alto impacto</p>
              <p className="mt-1 text-2xl font-semibold">{highImpact}</p>
            </Card>
            <Card className="sm:col-span-2">
              <p className="text-sm text-muted">Principal ajuste</p>
              <p className="mt-1 text-sm font-medium">
                {recs.sort((a, b) => a.priority_order - b.priority_order)[0]?.title || "—"}
              </p>
            </Card>
          </div>
          <Alert tone="info">
            Comece pelas recomendações de alto impacto e baixo esforço. Cada ajuste deve refletir
            sua experiência real — nunca invente.
          </Alert>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "todas", label: "Todas" },
              { id: "competencia", label: "Competência" },
              { id: "comunicacao", label: "Comunicação" },
              { id: "evidencia", label: "Evidência" },
              { id: "posicionamento", label: "Posicionamento" },
              { id: "alto_impacto", label: "Alto impacto" },
              { id: "baixo_esforco", label: "Baixo esforço" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setRecFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  recFilter === f.id
                    ? "bg-primary text-white"
                    : "bg-muted-bg text-muted hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredRecs.map((r) => (
              <Card key={r.id} className={r.status === "concluida" ? "opacity-75" : ""}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{r.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge tone="primary">{label(CATEGORY, r.category)}</Badge>
                      <Badge tone={impactTone(r.impact)}>Impacto {label(IMPACT, r.impact)}</Badge>
                      <Badge>Esforço {label(EFFORT, r.effort)}</Badge>
                      <Badge tone={impactTone(r.urgency)}>
                        Urgência {label(URGENCY, r.urgency)}
                      </Badge>
                      <Badge tone={r.status === "concluida" ? "success" : "neutral"}>
                        {label(REC_STATUS, r.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <p>
                    <strong className="text-foreground">Problema:</strong>{" "}
                    <span className="text-muted">{r.description}</span>
                  </p>
                  <p>
                    <strong className="text-foreground">Ação sugerida:</strong>{" "}
                    <span className="text-muted">{r.suggested_action}</span>
                  </p>
                  <p>
                    <strong className="text-foreground">Justificativa:</strong>{" "}
                    <span className="text-muted">{r.reasoning}</span>
                  </p>
                  {exampleId === r.id && r.example_text && (
                    <Alert tone="info">
                      <strong>Exemplo:</strong> {r.example_text}
                    </Alert>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toggleRec(r.id, r.status)}>
                    {r.status === "concluida" ? (
                      <>
                        <Undo2 className="h-3.5 w-3.5" /> Desfazer
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" /> Marcar como feita
                      </>
                    )}
                  </Button>
                  {r.example_text && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExampleId(exampleId === r.id ? null : r.id)}
                    >
                      Ver exemplo
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {filteredRecs.length === 0 && (
              <p className="text-sm text-muted">Nenhuma recomendação neste filtro.</p>
            )}
          </div>
        </div>
      )}

      {tab === "aderencia" && (
        <div className="space-y-4 animate-fade-up">
          <Card className="flex flex-col sm:flex-row sm:items-center gap-6">
            <ScoreRing score={cargoFit?.score ?? score} size={100} label="aderência" />
            <div>
              <h3 className="font-display text-xl">{cargoFit?.level || "—"}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed max-w-xl">
                {cargoFit?.reasoning ||
                  "Score calculado com base nos materiais enviados e no cargo-alvo informado."}
              </p>
            </div>
          </Card>

          <Alert tone="info">
            <strong>Tipos de lacuna:</strong> <em>Real</em> — a competência não existe na
            trajetória. <em>Comunicação</em> — existe, mas não está contada. <em>Evidência</em> —
            está contada, mas sem prova de impacto. Tratar cada uma de forma diferente evita
            exageros e omissões.
          </Alert>

          {cargoFit && (
            <Card>
              <h3 className="font-semibold">Diagnóstico por cargo-alvo</h3>
              <p className="mt-1 text-sm text-muted">
                Cargo: {analysis.target_role || "a definir"} · Nível: {cargoFit.level}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ListBlock title="Competências presentes" items={cargoFit.present_skills || cargoFit.strengths} />
                <ListBlock title="Competências ausentes" items={cargoFit.missing_skills || cargoFit.gaps} />
                <ListBlock title="Experiências esperadas" items={cargoFit.expected_experiences || []} />
                <ListBlock title="Sinais de senioridade" items={cargoFit.seniority_signals || []} />
              </div>
              <p className="mt-4 text-sm">
                <strong>Recomendação:</strong> {cargoFit.recommendation}
              </p>
            </Card>
          )}

          {vagaFit && (
            <Card>
              <h3 className="font-semibold">Diagnóstico por vaga específica</h3>
              <p className="mt-1 text-sm text-muted">
                {[vagaFit.job_name || analysis.job_title, vagaFit.company_name || analysis.job_company]
                  .filter(Boolean)
                  .join(" — ") || "Vaga enviada"}
                {" · Score "}
                {vagaFit.score} · {vagaFit.level}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ListBlock title="Requisitos obrigatórios" items={vagaFit.mandatory_requirements || []} />
                <ListBlock title="Requisitos desejáveis" items={vagaFit.desirable_requirements || []} />
                <ListBlock title="Requisitos inflados / pouco críticos" items={vagaFit.inflated_requirements || []} />
                <ListBlock title="Pontos fortes para a vaga" items={vagaFit.strengths} />
                <ListBlock title="Lacunas reais" items={vagaFit.real_gaps || vagaFit.gaps} />
                <ListBlock title="Lacunas de comunicação" items={vagaFit.communication_gaps || []} />
                <ListBlock title="Lacunas de evidência" items={vagaFit.evidence_gaps || []} />
                <ListBlock title="Riscos da candidatura" items={vagaFit.risks} />
              </div>
              <div className="mt-4 rounded-xl bg-primary-soft px-4 py-3">
                <p className="text-sm font-semibold text-primary">Recomendação final</p>
                <p className="mt-1 text-foreground">{vagaFit.recommendation}</p>
                <p className="mt-2 text-sm text-muted">{vagaFit.reasoning}</p>
              </div>
            </Card>
          )}

          {!vagaFit && (
            <Alert tone="warning">
              Nenhuma vaga específica foi enviada nesta análise. Inclua uma na próxima para
              receber recomendação de aplicação.
            </Alert>
          )}
        </div>
      )}

      {tab === "traducao" && (
        <div className="space-y-4 animate-fade-up">
          <Alert tone="info">
            Muitas vezes a experiência existe, mas está mal comunicada. Aqui mostramos como
            traduzir sua trajetória para uma linguagem mais reconhecida pelo mercado, sem inventar
            informações.
          </Alert>
          {translations.map((t) => (
            <Card key={t.id}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Texto original
                  </p>
                  <p className="mt-1 rounded-lg bg-muted-bg px-3 py-2 text-sm italic">
                    “{t.original_text}”
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Versão sugerida
                  </p>
                  <p className="mt-1 rounded-lg bg-primary-soft px-3 py-2 text-sm">
                    {t.suggested_text}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Problema:</strong>{" "}
                  <span className="text-muted">{t.identified_issue}</span>
                </p>
                <p>
                  <strong>Competências implícitas:</strong>{" "}
                  <span className="text-muted">{t.implicit_skills?.join(", ")}</span>
                </p>
                <p>
                  <strong>Termos de mercado:</strong>{" "}
                  <span className="text-muted">{t.market_language_terms?.join(", ")}</span>
                </p>
              </div>
              <Alert tone="warning" className="mt-4">
                {t.authenticity_warning}
              </Alert>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => copyText(t.suggested_text)}>
                  <Copy className="h-3.5 w-3.5" />
                  Copiar sugestão
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setTab("plano");
                    showToast("Use a sugestão ao executar as ações do plano.");
                  }}
                >
                  Usar no plano de ação
                </Button>
              </div>
            </Card>
          ))}
          {translations.length === 0 && (
            <p className="text-sm text-muted">Nenhuma tradução gerada para esta análise.</p>
          )}
        </div>
      )}

      {tab === "plano" && (
        <div className="space-y-4 animate-fade-up">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-sm text-muted">Total de ações</p>
              <p className="mt-1 text-2xl font-semibold">{plan.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Prioritárias</p>
              <p className="mt-1 text-2xl font-semibold">
                {plan.filter((a) => a.priority === "alta").length}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Concluídas</p>
              <p className="mt-1 text-2xl font-semibold">{planDone}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Próxima ação</p>
              <p className="mt-1 text-sm font-medium leading-snug">
                {nextPlan?.action_title || "Todas concluídas 🎉"}
              </p>
            </Card>
          </div>
          <Card>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted">Progresso do plano</span>
              <span className="font-medium">{planProgress}%</span>
            </div>
            <ProgressBar value={planProgress} />
          </Card>

          <div className="space-y-3">
            {plan.map((a) => (
              <Card key={a.id} className={a.status === "concluido" ? "opacity-75" : ""}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{a.action_title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge tone="primary">{a.action_type}</Badge>
                      <Badge tone={impactTone(a.priority)}>
                        Prioridade {label(PRIORITY, a.priority)}
                      </Badge>
                      <Badge>{a.timeframe || "—"}</Badge>
                      <Badge tone={a.status === "concluido" ? "success" : "neutral"}>
                        {label(PLAN_STATUS, a.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted">{a.action_description}</p>
                {a.success_criteria && (
                  <p className="mt-2 text-sm">
                    <strong>Critério de sucesso:</strong>{" "}
                    <span className="text-muted">{a.success_criteria}</span>
                  </p>
                )}
                <div className="mt-4">
                  <Button size="sm" variant="secondary" onClick={() => toggleAction(a.id, a.status)}>
                    {a.status === "concluido" ? (
                      <>
                        <Undo2 className="h-3.5 w-3.5" /> Reabrir
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" /> Marcar como concluída
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="border-primary/15 bg-primary-soft/30 text-center">
            <p className="text-sm text-muted max-w-lg mx-auto">
              Depois de ajustar seus materiais ou concluir ações importantes, faça uma nova
              análise para comparar sua evolução.
            </p>
            <div className="mt-4">
              <Link href={`/analise/nova?reanalise=${analysis.id}`}>
                <Button>
                  <RefreshCw className="h-4 w-4" />
                  Fazer nova análise
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Feedback */}
      <Card>
        <h3 className="font-semibold">Esta análise foi útil?</h3>
        {feedbackSent ? (
          <Alert tone="success" className="mt-3">
            Feedback registrado. Obrigado — isso nos ajuda a validar o MVP.
          </Alert>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex flex-col gap-2">
              {Object.entries(FEEDBACK_RATING).map(([value, lab]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${
                    feedbackRating === value
                      ? "border-primary bg-primary-soft"
                      : "border-card-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="feedback"
                    value={value}
                    checked={feedbackRating === value}
                    onChange={() => setFeedbackRating(value)}
                  />
                  {lab}
                </label>
              ))}
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium">O que poderia melhorar? (opcional)</p>
              <Textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Sua opinião nos ajuda a evoluir o produto…"
              />
            </div>
            <Button onClick={sendFeedback} disabled={!feedbackRating || feedbackLoading}>
              {feedbackLoading ? "Enviando…" : "Enviar feedback"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) {
    return (
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted">—</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
