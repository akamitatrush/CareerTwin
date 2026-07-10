import { generateCareerAnalysis } from "@/lib/ai/generateCareerAnalysis";
import { persistAnalysisResult } from "@/lib/ai/persistAnalysis";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = (await request.json()) as {
      analysis_id: string;
      resume_text?: string;
      linkedin_text?: string;
      linkedin_url?: string;
      target_role?: string;
      target_area?: string;
      target_seniority?: string;
      wants_role_suggestions?: boolean;
      job_description_text?: string;
      complementary_files_text?: string;
      parent_analysis_id?: string | null;
    };

    if (!body.analysis_id) {
      return NextResponse.json({ error: "analysis_id é obrigatório." }, { status: 400 });
    }

    // garante ownership
    const { data: analysis, error: analysisError } = await supabase
      .from("career_analyses")
      .select("*")
      .eq("id", body.analysis_id)
      .eq("user_id", user.id)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
    }

    // PEÇA 3 — consultar market_jargons pela área
    let market_terms: string[] = [];
    if (body.target_area) {
      const { data: jargon } = await supabase
        .from("market_jargons")
        .select("terms")
        .eq("area", body.target_area)
        .maybeSingle();
      if (jargon?.terms) market_terms = jargon.terms;
    }

    await supabase
      .from("career_analyses")
      .update({ status: "processing" })
      .eq("id", body.analysis_id);

    const { result, provider, usedFallback, error: aiError } = await generateCareerAnalysis({
      user_id: user.id,
      analysis_id: body.analysis_id,
      resume_text: body.resume_text || "",
      linkedin_text: body.linkedin_text || "",
      linkedin_url: body.linkedin_url || "",
      target_role: body.target_role || analysis.target_role || "",
      target_area: body.target_area || analysis.target_area || "",
      target_seniority: body.target_seniority || analysis.target_seniority || "",
      wants_role_suggestions: Boolean(body.wants_role_suggestions ?? analysis.wants_role_suggestions),
      job_description_text: body.job_description_text || "",
      complementary_files_text: body.complementary_files_text || "",
      market_terms,
    });

    await persistAnalysisResult(supabase, body.analysis_id, result);

    // créditos
    const { data: credits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (credits) {
      await supabase
        .from("user_credits")
        .update({
          used_analyses: (credits.used_analyses || 0) + 1,
          available_analyses: Math.max(0, (credits.available_analyses || 0) - 1),
        })
        .eq("user_id", user.id);
    }

    // reanálise: marcar original + criar version
    if (body.parent_analysis_id) {
      const { data: parent } = await supabase
        .from("career_analyses")
        .select("overall_score")
        .eq("id", body.parent_analysis_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (parent) {
        const scoreChange =
          result.summary.overall_score - (parent.overall_score ?? result.summary.overall_score);

        await supabase
          .from("career_analyses")
          .update({ status: "reanalyzed" })
          .eq("id", body.parent_analysis_id)
          .eq("user_id", user.id);

        await supabase.from("analysis_versions").insert({
          original_analysis_id: body.parent_analysis_id,
          new_analysis_id: body.analysis_id,
          user_id: user.id,
          improvements_summary:
            scoreChange >= 0
              ? "Há sinais de evolução no posicionamento em relação à análise anterior."
              : "O score caiu ou manteve-se — revise lacunas de comunicação e evidência ainda abertas.",
          remaining_gaps: result.summary.main_gap,
          score_change: scoreChange,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      analysis_id: body.analysis_id,
      provider,
      usedFallback,
      warning: aiError,
      overall_score: result.summary.overall_score,
    });
  } catch (err) {
    console.error("[api/analyze]", err);
    const message = err instanceof Error ? err.message : "Erro ao gerar análise.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
