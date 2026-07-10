import { z } from "zod";

const level3 = z.enum(["alto", "medio", "baixo"]);
const urgency = z.enum(["alta", "media", "baixa"]);
const category = z.enum(["competencia", "comunicacao", "evidencia", "posicionamento"]);
const confidence = z.enum(["alta", "media", "baixa"]);
const fitType = z.enum(["cargo_alvo", "vaga_especifica"]);

export const analysisResultSchema = z.object({
  summary: z.object({
    overall_score: z.number().int().min(0).max(100),
    confidence,
    general_diagnosis: z.string().min(1),
    main_strength: z.string().min(1),
    main_gap: z.string().min(1),
    next_best_action: z.string().min(1),
    suggested_roles: z.array(z.string()),
  }),
  recommendations: z
    .array(
      z.object({
        category,
        title: z.string().min(1),
        description: z.string().min(1),
        impact: level3,
        effort: level3,
        urgency,
        priority_order: z.number().int().min(1),
        suggested_action: z.string().min(1),
        reasoning: z.string().min(1),
        example_text: z.string().optional(),
      })
    )
    .min(1),
  fit_diagnostics: z
    .array(
      z.object({
        fit_type: fitType,
        score: z.number().int().min(0).max(100),
        level: z.string().min(1),
        strengths: z.array(z.string()),
        gaps: z.array(z.string()),
        risks: z.array(z.string()),
        present_skills: z.array(z.string()).optional(),
        missing_skills: z.array(z.string()).optional(),
        expected_experiences: z.array(z.string()).optional(),
        seniority_signals: z.array(z.string()).optional(),
        mandatory_requirements: z.array(z.string()).optional(),
        desirable_requirements: z.array(z.string()).optional(),
        inflated_requirements: z.array(z.string()).optional(),
        real_gaps: z.array(z.string()).optional(),
        communication_gaps: z.array(z.string()).optional(),
        evidence_gaps: z.array(z.string()).optional(),
        job_name: z.string().optional(),
        company_name: z.string().optional(),
        recommendation: z.string().min(1),
        reasoning: z.string().min(1),
      })
    )
    .min(1),
  experience_translations: z.array(
    z.object({
      original_text: z.string().min(1),
      identified_issue: z.string().min(1),
      implicit_skills: z.array(z.string()),
      suggested_text: z.string().min(1),
      market_language_terms: z.array(z.string()),
      authenticity_warning: z.string().min(1),
    })
  ),
  evolution_plan: z
    .array(
      z.object({
        action_title: z.string().min(1),
        action_description: z.string().min(1),
        action_type: z.string().min(1),
        priority: urgency,
        timeframe: z.string().min(1),
        success_criteria: z.string().min(1),
      })
    )
    .min(1),
});

export type ValidatedAnalysisResult = z.infer<typeof analysisResultSchema>;
