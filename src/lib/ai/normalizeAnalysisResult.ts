import { fitLevelFromScore } from "@/lib/utils";

/**
 * Normaliza respostas "quase certas" do Grok/OpenAI para o schema Zod.
 * Grok costuma: summary como string, enums com acento, arrays como objeto, campos renomeados.
 */

function asString(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.text === "string") return o.text.trim();
    if (typeof o.message === "string") return o.message.trim();
    if (typeof o.value === "string") return o.value.trim();
    if (typeof o.description === "string") return o.description.trim();
    try {
      return JSON.stringify(v);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function asNumber(v: unknown, fallback = 50): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  if (typeof v === "string") {
    const n = parseInt(v.replace(/[^\d-]/g, ""), 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function asStringArray(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) {
    return v
      .map((item) => asString(item))
      .filter((s) => s.length > 0);
  }
  if (typeof v === "string" && v.trim()) {
    return v
      .split(/[;\n•|-]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof v === "object") {
    return Object.values(v as Record<string, unknown>)
      .map((item) => asString(item))
      .filter(Boolean);
  }
  return [];
}

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

function mapCategory(v: unknown): string {
  const s = stripAccents(asString(v, "comunicacao"));
  if (s.includes("compet")) return "competencia";
  if (s.includes("evid")) return "evidencia";
  if (s.includes("posic") || s.includes("posicion")) return "posicionamento";
  if (s.includes("comun")) return "comunicacao";
  if (["competencia", "comunicacao", "evidencia", "posicionamento"].includes(s)) return s;
  return "comunicacao";
}

function mapLevel3(v: unknown): string {
  const s = stripAccents(asString(v, "medio"));
  if (s.startsWith("alt") || s === "high") return "alto";
  if (s.startsWith("baix") || s === "low") return "baixo";
  return "medio";
}

function mapUrgency(v: unknown): string {
  const s = stripAccents(asString(v, "media"));
  if (s.startsWith("alt") || s === "high") return "alta";
  if (s.startsWith("baix") || s === "low") return "baixa";
  return "media";
}

function mapConfidence(v: unknown): string {
  const s = stripAccents(asString(v, "media"));
  if (s.startsWith("alt") || s === "high") return "alta";
  if (s.startsWith("baix") || s === "low") return "baixa";
  return "media";
}

function mapFitType(v: unknown): string {
  const s = stripAccents(asString(v, "cargo_alvo"));
  if (s.includes("vaga") || s.includes("job")) return "vaga_especifica";
  return "cargo_alvo";
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function normalizeSummary(raw: unknown): Record<string, unknown> {
  if (typeof raw === "string") {
    return {
      overall_score: 55,
      confidence: "media",
      general_diagnosis: raw,
      main_strength: "Experiência real identificada nos materiais enviados.",
      main_gap: "Há oportunidades de clareza na comunicação da trajetória.",
      next_best_action: "Reescrever o título e 2–3 bullets com evidências reais.",
      suggested_roles: [],
    };
  }
  const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const score = clampScore(
    asNumber(s.overall_score ?? s.score ?? s.overallScore, 55)
  );
  return {
    overall_score: score,
    confidence: mapConfidence(s.confidence ?? s.confianca),
    general_diagnosis: asString(
      s.general_diagnosis ?? s.diagnosis ?? s.diagnostico ?? s.summary,
      "Diagnóstico gerado a partir dos materiais enviados."
    ),
    main_strength: asString(
      s.main_strength ?? s.strength ?? s.forca_principal,
      "Base prática presente nos materiais."
    ),
    main_gap: asString(
      s.main_gap ?? s.gap ?? s.principal_lacuna,
      "Comunicação de evidências e posicionamento podem melhorar."
    ),
    next_best_action: asString(
      s.next_best_action ?? s.next_action ?? s.proxima_acao,
      "Priorizar ajustes de comunicação no currículo e LinkedIn."
    ),
    suggested_roles: asStringArray(s.suggested_roles ?? s.suggestedRoles ?? []),
  };
}

function normalizeRecommendation(raw: unknown, index: number): Record<string, unknown> {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    category: mapCategory(r.category ?? r.categoria),
    title: asString(r.title ?? r.titulo, `Recomendação ${index + 1}`),
    description: asString(r.description ?? r.descricao ?? r.details, "Ajuste priorizado."),
    impact: mapLevel3(r.impact ?? r.impacto),
    effort: mapLevel3(r.effort ?? r.esforco),
    urgency: mapUrgency(r.urgency ?? r.urgencia),
    priority_order: Math.max(1, asNumber(r.priority_order ?? r.priority ?? r.ordem, index + 1)),
    suggested_action: asString(
      r.suggested_action ?? r.action ?? r.acao_sugerida ?? r.suggestedAction,
      "Revisar e reescrever o trecho indicado com base na experiência real."
    ),
    reasoning: asString(r.reasoning ?? r.motivo ?? r.justificativa, "Baseado nos materiais enviados."),
    example_text:
      r.example_text != null || r.example != null
        ? asString(r.example_text ?? r.example)
        : undefined,
  };
}

function normalizeFit(raw: unknown, index: number): Record<string, unknown> {
  const f = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const score = clampScore(asNumber(f.score ?? f.overall_score, 55));
  const level = asString(f.level ?? f.nivel, fitLevelFromScore(score));
  return {
    fit_type: mapFitType(f.fit_type ?? f.type ?? f.tipo),
    score,
    level,
    strengths: asStringArray(f.strengths ?? f.forcas ?? f.strong_points),
    gaps: asStringArray(f.gaps ?? f.lacunas),
    risks: asStringArray(f.risks ?? f.riscos),
    present_skills: asStringArray(f.present_skills ?? f.skills_presentes),
    missing_skills: asStringArray(f.missing_skills ?? f.skills_faltantes),
    expected_experiences: asStringArray(f.expected_experiences),
    seniority_signals: asStringArray(f.seniority_signals),
    mandatory_requirements: asStringArray(f.mandatory_requirements),
    desirable_requirements: asStringArray(f.desirable_requirements),
    inflated_requirements: asStringArray(f.inflated_requirements),
    real_gaps: asStringArray(f.real_gaps),
    communication_gaps: asStringArray(f.communication_gaps),
    evidence_gaps: asStringArray(f.evidence_gaps),
    job_name: f.job_name != null ? asString(f.job_name) : undefined,
    company_name: f.company_name != null ? asString(f.company_name) : undefined,
    recommendation: asString(
      f.recommendation ?? f.veredito ?? f.final_recommendation,
      index === 0 ? "Aplicar com ajustes." : "Desenvolver lacunas antes de aplicar."
    ),
    reasoning: asString(f.reasoning ?? f.motivo ?? f.justificativa, "Avaliação com base nos materiais."),
  };
}

function normalizeTranslation(raw: unknown): Record<string, unknown> {
  const t = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    original_text: asString(t.original_text ?? t.original ?? t.antes, "Trecho genérico do material."),
    identified_issue: asString(
      t.identified_issue ?? t.issue ?? t.problema,
      "Linguagem genérica que esconde competências."
    ),
    implicit_skills: asStringArray(t.implicit_skills ?? t.skills),
    suggested_text: asString(t.suggested_text ?? t.suggested ?? t.depois, "Reescrita com contexto real."),
    market_language_terms: asStringArray(t.market_language_terms ?? t.terms),
    authenticity_warning: asString(
      t.authenticity_warning ?? t.warning ?? t.alerta,
      "Use esta sugestão apenas se refletir atividades que você realmente realizou. Não invente métricas."
    ),
  };
}

function normalizePlanItem(raw: unknown, index: number): Record<string, unknown> {
  const p = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    action_title: asString(
      p.action_title ?? p.title ?? p.titulo ?? p.action,
      `Ação ${index + 1}`
    ),
    action_description: asString(
      p.action_description ?? p.description ?? p.descricao,
      "Executar ajuste priorizado nos materiais."
    ),
    action_type: asString(
      p.action_type ?? p.type ?? p.tipo,
      "Ajustar currículo"
    ),
    priority: mapUrgency(p.priority ?? p.prioridade),
    timeframe: asString(p.timeframe ?? p.prazo ?? p.deadline, "7 dias"),
    success_criteria: asString(
      p.success_criteria ?? p.criteria ?? p.criterio_sucesso,
      "Material atualizado e revisado."
    ),
  };
}

function ensureArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") return Object.values(v as Record<string, unknown>);
  if (v == null) return [];
  return [v];
}

export function normalizeAnalysisResult(raw: unknown): unknown {
  if (raw == null || typeof raw !== "object") {
    return raw;
  }

  // às vezes a IA envelopa em { result: {...} } ou { data: {...} }
  let root = raw as Record<string, unknown>;
  if (root.result && typeof root.result === "object" && !root.summary && !root.recommendations) {
    root = root.result as Record<string, unknown>;
  }
  if (root.data && typeof root.data === "object" && !root.summary && !root.recommendations) {
    root = root.data as Record<string, unknown>;
  }
  if (root.analysis && typeof root.analysis === "object" && !root.summary) {
    root = root.analysis as Record<string, unknown>;
  }

  const summary = normalizeSummary(root.summary ?? root.visao_geral ?? root.overview);
  const score = clampScore(asNumber(summary.overall_score, 55));

  let recommendations = ensureArray(
    root.recommendations ?? root.recomendacoes ?? root.recs
  ).map(normalizeRecommendation);

  if (recommendations.length === 0) {
    recommendations = [
      normalizeRecommendation(
        {
          category: "comunicacao",
          title: "Clarear evidências no currículo e LinkedIn",
          description: "Os materiais precisam comunicar melhor o que já foi feito.",
          impact: "alto",
          effort: "medio",
          urgency: "alta",
          suggested_action: "Reescrever 3 bullets com contexto e resultado real.",
          reasoning: "Fallback mínimo após normalização — materiais geraram poucas recs estruturadas.",
        },
        0
      ),
    ];
  }

  let fit_diagnostics = ensureArray(
    root.fit_diagnostics ?? root.fitDiagnostics ?? root.aderencia ?? root.fit
  ).map(normalizeFit);

  if (fit_diagnostics.length === 0) {
    fit_diagnostics = [
      normalizeFit(
        {
          fit_type: "cargo_alvo",
          score,
          level: fitLevelFromScore(score),
          strengths: ["Base prática mencionada nos materiais"],
          gaps: ["Comunicação de competências pode melhorar"],
          risks: ["Posicionamento genérico em triagens"],
          recommendation: "Aplicar com ajustes.",
          reasoning: "Diagnóstico mínimo a partir do score consolidado.",
        },
        0
      ),
    ];
  }

  // garante ao menos um cargo_alvo
  if (!fit_diagnostics.some((f) => f.fit_type === "cargo_alvo")) {
    fit_diagnostics.unshift(
      normalizeFit(
        {
          fit_type: "cargo_alvo",
          score,
          strengths: asStringArray((fit_diagnostics[0] as { strengths?: unknown }).strengths),
          gaps: asStringArray((fit_diagnostics[0] as { gaps?: unknown }).gaps),
          risks: [],
          recommendation: "Aplicar com ajustes.",
          reasoning: "Fit de cargo-alvo inferido.",
        },
        0
      )
    );
  }

  let experience_translations = ensureArray(
    root.experience_translations ?? root.translations ?? root.traducoes
  ).map(normalizeTranslation);

  // traduções opcionais no schema (array sem min), ok vazio
  let evolution_plan = ensureArray(
    root.evolution_plan ?? root.evolutionPlan ?? root.plano ?? root.plan
  ).map(normalizePlanItem);

  if (evolution_plan.length === 0) {
    evolution_plan = [
      normalizePlanItem(
        {
          action_title: "Atualizar título e sumário",
          action_description: "Alinhar headline e sobre ao cargo-alvo com linguagem real.",
          action_type: "Atualizar LinkedIn",
          priority: "alta",
          timeframe: "3 dias",
          success_criteria: "Headline e sobre revisados e publicados.",
        },
        0
      ),
    ];
  }

  return {
    summary: { ...summary, overall_score: score },
    recommendations,
    fit_diagnostics,
    experience_translations,
    evolution_plan,
  };
}
