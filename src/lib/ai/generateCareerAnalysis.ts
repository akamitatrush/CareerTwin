import type { AnalysisResultPayload, GenerateAnalysisInput } from "@/lib/types";
import { buildMockAnalysis } from "./mockAnalysis";
import { analysisResultSchema } from "./schema";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { buildUserPrompt } from "./userPrompt";

type LlmConfig = {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
};

/**
 * generateCareerAnalysis — arquitetura de 3 peças:
 * 1. systemPrompt (fixo)
 * 2. userPrompt (variável)
 * 3. market_jargons (injetados em input.market_terms antes da chamada)
 *
 * AI_PROVIDER:
 * - mock (padrão) — simulado, determinístico, sem custo
 * - xai | grok — API xAI (Grok), chave XAI_API_KEY
 * - openai — API OpenAI, chave OPENAI_API_KEY
 */
export async function generateCareerAnalysis(
  input: GenerateAnalysisInput
): Promise<{ result: AnalysisResultPayload; provider: string; usedFallback: boolean; error?: string }> {
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
  const llm = resolveLlmConfig(provider);

  if (llm) {
    try {
      const raw = await callChatCompletions(llm, input);
      const parsed = analysisResultSchema.safeParse(raw);
      if (!parsed.success) {
        console.error(
          `[generateCareerAnalysis] schema validation failed (${llm.name})`,
          parsed.error.flatten()
        );
        return {
          result: buildMockAnalysis(input),
          provider: llm.name,
          usedFallback: true,
          error: "Resposta da IA inválida; usando análise simulada.",
        };
      }
      console.info(`[generateCareerAnalysis] ok provider=${llm.name} score=${parsed.data.summary.overall_score}`);
      return { result: parsed.data, provider: llm.name, usedFallback: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro na API de IA";
      console.error(`[generateCareerAnalysis] ${llm.name}:`, message);
      return {
        result: buildMockAnalysis(input),
        provider: llm.name,
        usedFallback: true,
        error: message,
      };
    }
  }

  // mock determinístico (ou provider sem chave)
  if (provider !== "mock") {
    console.warn(
      `[generateCareerAnalysis] AI_PROVIDER=${provider} sem chave configurada; usando mock.`
    );
  }
  const mock = buildMockAnalysis(input);
  const parsed = analysisResultSchema.parse(mock);
  return { result: parsed, provider: "mock", usedFallback: provider !== "mock" };
}

function resolveLlmConfig(provider: string): LlmConfig | null {
  if (provider === "xai" || provider === "grok") {
    const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;
    if (!apiKey) return null;
    return {
      name: "xai",
      apiKey,
      baseUrl: (process.env.XAI_BASE_URL || "https://api.x.ai/v1").replace(/\/$/, ""),
      model: process.env.XAI_MODEL || process.env.GROK_MODEL || "grok-3-mini",
    };
  }

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return {
      name: "openai",
      apiKey,
      baseUrl: (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, ""),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }

  return null;
}

async function callChatCompletions(
  llm: LlmConfig,
  input: GenerateAnalysisInput
): Promise<unknown> {
  const userPrompt = buildUserPrompt(input);

  const res = await fetch(`${llm.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${llm.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: llm.model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `${userPrompt}

## FORMATO DE SAÍDA
Responda APENAS com um único objeto JSON válido (sem markdown, sem texto fora do JSON), seguindo o schema definido no prompt de sistema (summary, recommendations, fit_diagnostics, experience_translations, evolution_plan).`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${llm.name} HTTP ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Resposta vazia de ${llm.name}`);

  // remove eventual fence ```json ... ```
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  return JSON.parse(cleaned);
}

export { SYSTEM_PROMPT, buildUserPrompt };
