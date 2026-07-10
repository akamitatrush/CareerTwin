import Link from "next/link";
import { notFound } from "next/navigation";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Alert, Button, Card, PageShell } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import type {
  AnalysisVersion,
  CareerAnalysis,
  EvolutionPlanAction,
  ExperienceTranslation,
  FitDiagnostic,
  Recommendation,
} from "@/lib/types";
import { Loader2 } from "lucide-react";

export default async function AnalisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: analysis } = await supabase
    .from("career_analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!analysis) notFound();

  if (analysis.status === "processing") {
    return (
      <PageShell>
        <Card className="py-16 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <h1 className="mt-6 font-display text-2xl">Análise em andamento</h1>
          <p className="mt-2 text-muted">
            Estamos processando seus materiais. Atualize a página em instantes.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href={`/analise/${id}`}>
              <Button variant="outline">Atualizar</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Voltar ao dashboard</Button>
            </Link>
          </div>
        </Card>
      </PageShell>
    );
  }

  const [
    { data: recommendations },
    { data: fits },
    { data: translations },
    { data: plan },
    { data: versionRow },
    { data: feedback },
  ] = await Promise.all([
    supabase
      .from("recommendations")
      .select("*")
      .eq("analysis_id", id)
      .order("priority_order", { ascending: true }),
    supabase.from("fit_diagnostics").select("*").eq("analysis_id", id),
    supabase.from("experience_translations").select("*").eq("analysis_id", id),
    supabase.from("evolution_plans").select("*").eq("analysis_id", id),
    supabase
      .from("analysis_versions")
      .select("*")
      .eq("new_analysis_id", id)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("analysis_feedback")
      .select("rating, comment")
      .eq("analysis_id", id)
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  let versionCompare: (AnalysisVersion & { original_score?: number | null }) | null = null;
  if (versionRow) {
    const { data: original } = await supabase
      .from("career_analyses")
      .select("overall_score")
      .eq("id", versionRow.original_analysis_id)
      .maybeSingle();
    versionCompare = {
      ...(versionRow as AnalysisVersion),
      original_score: original?.overall_score ?? null,
    };
  }

  return (
    <PageShell>
      {!recommendations?.length && (
        <Alert tone="warning" className="mb-4">
          Esta análise não tem recomendações salvas. Tente gerar novamente.
        </Alert>
      )}
      <AnalysisResult
        analysis={analysis as CareerAnalysis}
        recommendations={(recommendations || []) as Recommendation[]}
        fits={(fits || []) as FitDiagnostic[]}
        translations={(translations || []) as ExperienceTranslation[]}
        plan={(plan || []) as EvolutionPlanAction[]}
        versionCompare={versionCompare}
        existingFeedback={feedback}
      />
    </PageShell>
  );
}
