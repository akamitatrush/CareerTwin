import type { AnalysisResultPayload, GenerateAnalysisInput } from "@/lib/types";
import { buildMockAnalysis } from "./mockAnalysis";
import { normalizeAnalysisResult } from "./normalizeAnalysisResult";
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
      const normalized = normalizeAnalysisResult(raw);
      let parsed = analysisResultSchema.safeParse(normalized);

      // 1 retry: pede ao modelo para reformatar se ainda falhar
      if (!parsed.success) {
        console.warn(
          `[generateCareerAnalysis] schema fail after normalize (${llm.name}), retrying repair…`,
          parsed.error.flatten()
        );
        const repaired = await callRepairJson(llm, raw, parsed.error.message);
        const normalized2 = normalizeAnalysisResult(repaired);
        parsed = analysisResultSchema.safeParse(normalized2);
      }

      if (!parsed.success) {
        console.error(
          `[generateCareerAnalysis] schema validation failed (${llm.name})`,
          parsed.error.flatten()
        );
        return {
          result: buildMockAnalysis(input),
          provider: llm.name,
          usedFallback: true,
          error: "Resposta da IA inválida após normalização; usando análise simulada.",
        };
      }

      console.info(
        `[generateCareerAnalysis] ok provider=${llm.name} score=${parsed.data.summary.overall_score}`
      );
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

function extractJsonContent(content: string): unknown {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    // tenta extrair o maior bloco { ... }
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Resposta da IA não é JSON válido");
  }
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
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `${userPrompt}

## FORMATO DE SAÍDA (crítico)
Retorne APENAS um objeto JSON com EXATAMENTE estas chaves de topo:
summary (OBJETO), recommendations (ARRAY), fit_diagnostics (ARRAY), experience_translations (ARRAY), evolution_plan (ARRAY).
Nunca coloque summary como string. Nunca omita action_title, action_description, action_type, priority, timeframe, success_criteria no plano.
Nunca use acentos nos enums (use comunicacao, medio, alta — não comunicação/médio).
priority_order deve ser número inteiro começando em 1.`,
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

  return extractJsonContent(content);
}

/** Segunda chance: pede só reformatar o JSON sem reinventar o conteúdo. */
async function callRepairJson(
  llm: LlmConfig,
  broken: unknown,
  zodError: string
): Promise<unknown> {
  const res = await fetch(`${llm.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${llm.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: llm.model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Você corrige JSON de análise de carreira para um schema fixo. Não invente experiências. Só reestruture campos.",
        },
        {
          role: "user",
          content: `O JSON abaixo falhou na validação. Reescreva-o no schema correto.

Erros Zod (resumo):
${zodError.slice(0, 1500)}

Schema obrigatório:
{
  "summary": {
    "overall_score": number 0-100,
    "confidence": "alta"|"media"|"baixa",
    "general_diagnosis": string,
    "main_strength": string,
    "main_gap": string,
    "next_best_action": string,
    "suggested_roles": string[]
  },
  "recommendations": [{
    "category": "competencia"|"comunicacao"|"evidencia"|"posicionamento",
    "title": string, "description": string,
    "impact": "alto"|"medio"|"baixo",
    "effort": "alto"|"medio"|"baixo",
    "urgency": "alta"|"media"|"baixa",
    "priority_order": number,
    "suggested_action": string, "reasoning": string,
    "example_text": string opcional
  }],
  "fit_diagnostics": [{
    "fit_type": "cargo_alvo"|"vaga_especifica",
    "score": number, "level": string,
    "strengths": string[], "gaps": string[], "risks": string[],
    "recommendation": string, "reasoning": string
  }],
  "experience_translations": [{
    "original_text": string, "identified_issue": string,
    "implicit_skills": string[], "suggested_text": string,
    "market_language_terms": string[], "authenticity_warning": string
  }],
  "evolution_plan": [{
    "action_title": string, "action_description": string,
    "action_type": string, "priority": "alta"|"media"|"baixa",
    "timeframe": string, "success_criteria": string
  }]
}

JSON a corrigir:
${JSON.stringify(broken).slice(0, 12000)}

Responda só o JSON corrigido.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${llm.name} repair HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Repair vazio");
  return extractJsonContent(content);
}

export { SYSTEM_PROMPT, buildUserPrompt };
