import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge, Button, Card, EmptyState, PageShell } from "@/components/ui";
import { STATUS_ANALYSIS, label } from "@/lib/labels";
import { formatDateBR } from "@/lib/utils";
import type { CareerAnalysis } from "@/lib/types";
import { ArrowRight, ClipboardList, RefreshCw, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: analyses } = await supabase
    .from("career_analyses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (analyses || []) as CareerAnalysis[];
  const analysisIds = list.map((a) => a.id);

  let pendingRecs = 0;
  let completedActions = 0;

  if (analysisIds.length > 0) {
    const [{ count: recCount }, { count: actionCount }] = await Promise.all([
      supabase
        .from("recommendations")
        .select("id", { count: "exact", head: true })
        .in("analysis_id", analysisIds)
        .neq("status", "concluida"),
      supabase
        .from("evolution_plans")
        .select("id", { count: "exact", head: true })
        .in("analysis_id", analysisIds)
        .eq("status", "concluido"),
    ]);
    pendingRecs = recCount || 0;
    completedActions = actionCount || 0;
  }

  const firstName =
    (profile?.full_name || user.user_metadata?.full_name || "profissional")
      .toString()
      .split(" ")[0];

  const lastAnalysis = list[0];

  function statusTone(status: string): "primary" | "success" | "warning" | "neutral" {
    if (status === "completed") return "success";
    if (status === "reanalyzed") return "warning";
    if (status === "processing") return "primary";
    return "neutral";
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Olá, {firstName}</h1>
          <p className="mt-1 text-muted">
            Acompanhe suas análises e o progresso do seu posicionamento profissional.
          </p>
        </div>
        <Link href="/analise/nova">
          <Button size="lg">
            <Sparkles className="h-4 w-4" />
            Nova análise
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Total de análises</p>
          <p className="mt-2 font-display text-3xl text-foreground">{list.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Última análise</p>
          <p className="mt-2 font-display text-xl text-foreground">
            {lastAnalysis ? formatDateBR(lastAnalysis.created_at) : "—"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Recomendações pendentes</p>
          <p className="mt-2 font-display text-3xl text-foreground">{pendingRecs}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Ações concluídas</p>
          <p className="mt-2 font-display text-3xl text-foreground">{completedActions}</p>
        </Card>
      </div>

      {/* Checklist qualidade */}
      <Card className="mt-6">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Checklist do perfil
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {[
            { ok: list.length > 0, label: "Análise criada" },
            {
              ok: list.some((a) => a.status === "completed" || a.status === "reanalyzed"),
              label: "Análise concluída",
            },
            { ok: Boolean(profile?.target_role) || list.some((a) => a.target_role), label: "Cargo-alvo definido" },
            { ok: list.some((a) => a.job_title || a.job_company), label: "Vaga analisada" },
            { ok: pendingRecs === 0 && list.length > 0, label: "Recomendações revisadas" },
            { ok: completedActions > 0, label: "Plano iniciado" },
          ].map((item) => (
            <li
              key={item.label}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                item.ok ? "bg-primary-soft text-primary" : "bg-muted-bg text-muted"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${item.ok ? "bg-success" : "bg-muted/40"}`}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-10">
        <h2 className="font-display text-2xl text-foreground">Análises anteriores</h2>

        {list.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Nenhuma análise ainda"
              description="Você ainda não criou nenhuma análise. Comece enviando seu currículo, LinkedIn e cargo-alvo para receber seu primeiro diagnóstico."
              action={
                <Link href="/analise/nova">
                  <Button>
                    Criar primeira análise
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {list.map((a) => (
              <Card key={a.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
                    <Badge tone={statusTone(a.status)}>
                      {label(STATUS_ANALYSIS, a.status)}
                    </Badge>
                    {a.overall_score != null && (
                      <Badge tone="primary">Score {a.overall_score}</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {a.target_role || "Cargo a definir"}
                    {a.job_company || a.job_title
                      ? ` · ${[a.job_title, a.job_company].filter(Boolean).join(" — ")}`
                      : ""}
                    {" · "}
                    {formatDateBR(a.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {(a.status === "completed" || a.status === "reanalyzed") && (
                    <Link href={`/analise/${a.id}`}>
                      <Button variant="outline" size="sm">
                        Ver resultado
                      </Button>
                    </Link>
                  )}
                  {a.status === "processing" && (
                    <Link href={`/analise/${a.id}`}>
                      <Button variant="outline" size="sm">
                        Acompanhar
                      </Button>
                    </Link>
                  )}
                  <Link href={`/analise/nova?reanalise=${a.id}`}>
                    <Button size="sm" variant="secondary">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Fazer reanálise
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
