export type AnalysisStatus = "processing" | "completed" | "reanalyzed";
export type Confidence = "alta" | "media" | "baixa";
export type Category = "competencia" | "comunicacao" | "evidencia" | "posicionamento";
export type Level3 = "alto" | "medio" | "baixo";
export type Urgency = "alta" | "media" | "baixa";
export type RecStatus = "pendente" | "em_andamento" | "concluida";
export type PlanStatus = "pendente" | "em_andamento" | "concluido";
export type FitType = "cargo_alvo" | "vaga_especifica";
export type FeedbackRating = "util" | "parcial" | "nao_util";
export type DocumentType =
  | "resume"
  | "linkedin_url"
  | "linkedin_pdf"
  | "job_description"
  | "complementary_file"
  | "pasted_text";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  current_role: string | null;
  target_role: string | null;
  created_at: string;
  updated_at: string;
}

export interface CareerAnalysis {
  id: string;
  user_id: string;
  title: string;
  target_role: string | null;
  target_area: string | null;
  target_seniority: string | null;
  wants_role_suggestions: boolean;
  job_title: string | null;
  job_company: string | null;
  job_url: string | null;
  status: AnalysisStatus;
  overall_score: number | null;
  confidence: Confidence | null;
  summary: string | null;
  main_strength: string | null;
  main_gap: string | null;
  next_best_action: string | null;
  suggested_roles: string[] | null;
  general_diagnosis: string | null;
  parent_analysis_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  analysis_id: string;
  category: Category;
  title: string;
  description: string;
  impact: Level3;
  effort: Level3;
  urgency: Urgency;
  priority_order: number;
  suggested_action: string;
  reasoning: string;
  example_text: string | null;
  status: RecStatus;
  created_at: string;
  updated_at: string;
}

export interface FitDiagnostic {
  id: string;
  analysis_id: string;
  fit_type: FitType;
  score: number;
  level: string;
  strengths: string[];
  gaps: string[];
  risks: string[];
  present_skills: string[] | null;
  missing_skills: string[] | null;
  expected_experiences: string[] | null;
  seniority_signals: string[] | null;
  mandatory_requirements: string[] | null;
  desirable_requirements: string[] | null;
  inflated_requirements: string[] | null;
  real_gaps: string[] | null;
  communication_gaps: string[] | null;
  evidence_gaps: string[] | null;
  job_name: string | null;
  company_name: string | null;
  recommendation: string;
  reasoning: string;
  created_at: string;
}

export interface ExperienceTranslation {
  id: string;
  analysis_id: string;
  original_text: string;
  identified_issue: string;
  implicit_skills: string[];
  suggested_text: string;
  market_language_terms: string[];
  authenticity_warning: string;
  created_at: string;
}

export interface EvolutionPlanAction {
  id: string;
  analysis_id: string;
  action_title: string;
  action_description: string;
  action_type: string;
  priority: Urgency;
  timeframe: string | null;
  success_criteria: string | null;
  status: PlanStatus;
  created_at: string;
  updated_at: string;
}

export interface AnalysisVersion {
  id: string;
  original_analysis_id: string;
  new_analysis_id: string;
  user_id: string;
  improvements_summary: string | null;
  remaining_gaps: string | null;
  score_change: number | null;
  created_at: string;
}

export interface AnalysisResultPayload {
  summary: {
    overall_score: number;
    confidence: Confidence;
    general_diagnosis: string;
    main_strength: string;
    main_gap: string;
    next_best_action: string;
    suggested_roles: string[];
  };
  recommendations: Array<{
    category: Category;
    title: string;
    description: string;
    impact: Level3;
    effort: Level3;
    urgency: Urgency;
    priority_order: number;
    suggested_action: string;
    reasoning: string;
    example_text?: string;
  }>;
  fit_diagnostics: Array<{
    fit_type: FitType;
    score: number;
    level: string;
    strengths: string[];
    gaps: string[];
    risks: string[];
    present_skills?: string[];
    missing_skills?: string[];
    expected_experiences?: string[];
    seniority_signals?: string[];
    mandatory_requirements?: string[];
    desirable_requirements?: string[];
    inflated_requirements?: string[];
    real_gaps?: string[];
    communication_gaps?: string[];
    evidence_gaps?: string[];
    job_name?: string;
    company_name?: string;
    recommendation: string;
    reasoning: string;
  }>;
  experience_translations: Array<{
    original_text: string;
    identified_issue: string;
    implicit_skills: string[];
    suggested_text: string;
    market_language_terms: string[];
    authenticity_warning: string;
  }>;
  evolution_plan: Array<{
    action_title: string;
    action_description: string;
    action_type: string;
    priority: Urgency;
    timeframe: string;
    success_criteria: string;
  }>;
}

export interface GenerateAnalysisInput {
  user_id: string;
  analysis_id: string;
  resume_text: string;
  linkedin_text: string;
  linkedin_url: string;
  target_role: string;
  target_area: string;
  target_seniority: string;
  wants_role_suggestions: boolean;
  job_description_text: string;
  complementary_files_text: string;
  market_terms?: string[];
}
