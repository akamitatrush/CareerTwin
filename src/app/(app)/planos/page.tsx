import { createClient } from "@/lib/supabase/server";
import { Badge, Button, Card, PageShell } from "@/components/ui";
import { Check } from "lucide-react";

const FALLBACK_PLANS = [
  {
    name: "Gratuito",
    description: "Uma análise básica para conhecer o produto.",
    price: 0,
    slug: "gratuito",
    features: [
      "Uma análise básica",
      "Recomendações limitadas",
      "Diagnóstico geral",
      "Plano de evolução resumido",
    ],
  },
  {
    name: "Análise completa",
    description: "Diagnóstico detalhado de currículo e LinkedIn.",
    price: 49.9,
    slug: "completa",
    features: [
      "Recomendações detalhadas",
      "Diagnóstico completo de currículo e LinkedIn",
      "Tradução contextual da experiência",
      "Plano de evolução completo",
    ],
  },
  {
    name: "Análise de vaga",
    description: "Aderência e decisão sobre uma vaga específica.",
    price: 29.9,
    slug: "vaga",
    features: [
      "Diagnóstico da vaga",
      "Score de aderência",
      "Requisitos obrigatórios e desejáveis",
      "Riscos da candidatura",
      "Recomendação de aplicação",
    ],
  },
  {
    name: "Pacote múltiplas análises",
    description: "Várias análises e comparação entre versões.",
    price: 99.9,
    slug: "pacote",
    features: [
      "Análises para diferentes cargos-alvo",
      "Análises para diferentes vagas",
      "Comparação entre versões",
      "Suporte prioritário (futuro)",
    ],
  },
];

export default async function PlanosPage() {
  let plans = FALLBACK_PLANS;
  let credits: { available_analyses: number; used_analyses: number } | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase.from("plans").select("*").order("price", { ascending: true });
    if (data?.length) {
      plans = data.map((p) => ({
        name: p.name,
        description: p.description || "",
        price: Number(p.price),
        slug: p.slug || p.name,
        features: Array.isArray(p.features)
          ? (p.features as string[])
          : typeof p.features === "string"
            ? JSON.parse(p.features)
            : [],
      }));
    }

    if (user) {
      const { data: c } = await supabase
        .from("user_credits")
        .select("available_analyses, used_analyses")
        .eq("user_id", user.id)
        .maybeSingle();
      credits = c;
    }
  } catch {
    /* usa fallback */
  }

  return (
    <PageShell>
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl text-foreground">Planos e upgrade</h1>
        <p className="mt-2 text-muted leading-relaxed">
          Estrutura freemium preparada para monetização futura. No MVP não há checkout real —
          use o plano gratuito para validar o produto.
        </p>
      </div>

      {credits && (
        <Card className="mt-6 max-w-md">
          <p className="text-sm text-muted">Seus créditos (plano atual)</p>
          <p className="mt-2 text-lg font-semibold">
            {credits.available_analyses} análise(s) disponível(is) · {credits.used_analyses}{" "}
            usada(s)
          </p>
        </Card>
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {plans.map((plan) => {
          const featured = plan.slug === "completa";
          return (
            <Card
              key={plan.slug}
              className={`relative flex flex-col ${
                featured ? "border-primary/30 ring-2 ring-primary/15" : ""
              }`}
            >
              {featured && (
                <Badge tone="primary" className="absolute right-4 top-4">
                  Mais completo
                </Badge>
              )}
              <h2 className="font-display text-xl">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>
              <p className="mt-4 font-display text-3xl text-foreground">
                {plan.price === 0 ? (
                  "Grátis"
                ) : (
                  <>
                    R$ {plan.price.toFixed(2).replace(".", ",")}
                    <span className="text-sm font-sans font-normal text-muted"> / análise</span>
                  </>
                )}
              </p>
              <ul className="mt-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={plan.price === 0 ? "secondary" : "primary"}
                disabled
                title="Checkout em breve"
              >
                {plan.price === 0 ? "Plano atual (MVP)" : "Em breve"}
              </Button>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Pagamento real será integrado em versão futura. Nenhuma cobrança é feita neste MVP.
      </p>
    </PageShell>
  );
}
