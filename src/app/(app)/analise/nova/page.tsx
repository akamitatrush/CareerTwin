import { Suspense } from "react";
import { AnalysisWizard } from "@/components/AnalysisWizard";
import { PageShell } from "@/components/ui";

export default function NovaAnalisePage() {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-muted">Carregando fluxo…</p>}>
        <AnalysisWizard />
      </Suspense>
    </PageShell>
  );
}
