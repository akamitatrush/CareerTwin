import type { GenerateAnalysisInput } from "@/lib/types";

/** PEÇA 2 — Prompt de usuário (variável a cada análise). */

export function buildUserPrompt(input: GenerateAnalysisInput): string {
  const marketBlock =
    input.market_terms && input.market_terms.length > 0
      ? `
## TERMOS DE MERCADO DESTA ÁREA — use com precisão e apenas quando a experiência real do usuário sustentar
${input.market_terms.map((t) => `- ${t}`).join("\n")}
`
      : "";

  return `Analise o posicionamento profissional abaixo e retorne o JSON no schema definido.

## OBJETIVO DE CARREIRA
- Cargo-alvo: ${input.target_role || "(não definido — sugerir cargos se solicitado)"}
- Área: ${input.target_area || "(não informada)"}
- Senioridade desejada: ${input.target_seniority || "(não informada)"}
- Quer sugestões de cargo: ${input.wants_role_suggestions ? "sim" : "não"}

## CURRÍCULO (texto real do usuário)
${input.resume_text?.trim() || "(não enviado)"}

## LINKEDIN
- URL (apenas referência, sem scraping): ${input.linkedin_url || "(não informado)"}
- Texto do perfil:
${input.linkedin_text?.trim() || "(não enviado)"}

## VAGA ESPECÍFICA (opcional)
${input.job_description_text?.trim() || "(não enviada)"}

## MATERIAIS COMPLEMENTARES
${input.complementary_files_text?.trim() || "(nenhum)"}
${marketBlock}
## INSTRUÇÕES FINAIS
- Cite trechos reais quando fizer recomendações e traduções.
- Se materiais forem escassos, reflita isso em confidence e no diagnóstico.
- Produza recomendações priorizadas, diagnóstico de aderência, traduções com alerta de autenticidade e plano de evolução acionável.
`;
}
