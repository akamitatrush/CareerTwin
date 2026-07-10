import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnalysisResultPayload } from "@/lib/types";

export async function persistAnalysisResult(
  supabase: SupabaseClient,
  analysisId: string,
  result: AnalysisResultPayload
) {
  const { error: updateError } = await supabase
    .from("career_analyses")
    .update({
      status: "completed",
      overall_score: result.summary.overall_score,
      confidence: result.summary.confidence,
      summary: result.summary.general_diagnosis,
      general_diagnosis: result.summary.general_diagnosis,
      main_strength: result.summary.main_strength,
      main_gap: result.summary.main_gap,
      next_best_action: result.summary.next_best_action,
      suggested_roles: result.summary.suggested_roles,
      updated_at: new Date().toISOString(),
    })
    .eq("id", analysisId);

  if (updateError) throw updateError;

  // limpar filhos anteriores (reprocessamento)
  await Promise.all([
    supabase.from("recommendations").delete().eq("analysis_id", analysisId),
    supabase.from("fit_diagnostics").delete().eq("analysis_id", analysisId),
    supabase.from("experience_translations").delete().eq("analysis_id", analysisId),
    supabase.from("evolution_plans").delete().eq("analysis_id", analysisId),
  ]);

  const recs = result.recommendations.map((r) => ({
    analysis_id: analysisId,
    category: r.category,
    title: r.title,
    description: r.description,
    impact: r.impact,
    effort: r.effort,
    urgency: r.urgency,
    priority_order: r.priority_order,
    suggested_action: r.suggested_action,
    reasoning: r.reasoning,
    example_text: r.example_text ?? null,
    status: "pendente",
  }));

  const fits = result.fit_diagnostics.map((f) => ({
    analysis_id: analysisId,
    fit_type: f.fit_type,
    score: f.score,
    level: f.level,
    strengths: f.strengths,
    gaps: f.gaps,
    risks: f.risks,
    present_skills: f.present_skills ?? [],
    missing_skills: f.missing_skills ?? [],
    expected_experiences: f.expected_experiences ?? [],
    seniority_signals: f.seniority_signals ?? [],
    mandatory_requirements: f.mandatory_requirements ?? [],
    desirable_requirements: f.desirable_requirements ?? [],
    inflated_requirements: f.inflated_requirements ?? [],
    real_gaps: f.real_gaps ?? [],
    communication_gaps: f.communication_gaps ?? [],
    evidence_gaps: f.evidence_gaps ?? [],
    job_name: f.job_name ?? null,
    company_name: f.company_name ?? null,
    recommendation: f.recommendation,
    reasoning: f.reasoning,
  }));

  const translations = result.experience_translations.map((t) => ({
    analysis_id: analysisId,
    original_text: t.original_text,
    identified_issue: t.identified_issue,
    implicit_skills: t.implicit_skills,
    suggested_text: t.suggested_text,
    market_language_terms: t.market_language_terms,
    authenticity_warning: t.authenticity_warning,
  }));

  const plan = result.evolution_plan.map((a) => ({
    analysis_id: analysisId,
    action_title: a.action_title,
    action_description: a.action_description,
    action_type: a.action_type,
    priority: a.priority,
    timeframe: a.timeframe,
    success_criteria: a.success_criteria,
    status: "pendente",
  }));

  const [r1, r2, r3, r4] = await Promise.all([
    supabase.from("recommendations").insert(recs),
    supabase.from("fit_diagnostics").insert(fits),
    translations.length
      ? supabase.from("experience_translations").insert(translations)
      : Promise.resolve({ error: null }),
    supabase.from("evolution_plans").insert(plan),
  ]);

  if (r1.error) throw r1.error;
  if (r2.error) throw r2.error;
  if (r3.error) throw r3.error;
  if (r4.error) throw r4.error;
}
