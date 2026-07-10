/** Mapas de tradução: valores do banco (sem acento) → rótulos da UI (com acento). */

export const STATUS_ANALYSIS: Record<string, string> = {
  processing: "Em andamento",
  completed: "Concluída",
  reanalyzed: "Reanálise disponível",
};

export const CONFIDENCE: Record<string, string> = {
  alta: "Alta confiança",
  media: "Média confiança",
  baixa: "Baixa confiança",
};

export const CATEGORY: Record<string, string> = {
  competencia: "Competência",
  comunicacao: "Comunicação",
  evidencia: "Evidência",
  posicionamento: "Posicionamento",
};

export const IMPACT: Record<string, string> = {
  alto: "Alto",
  medio: "Médio",
  baixo: "Baixo",
};

export const EFFORT: Record<string, string> = {
  alto: "Alto",
  medio: "Médio",
  baixo: "Baixo",
};

export const URGENCY: Record<string, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

export const REC_STATUS: Record<string, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

export const PLAN_STATUS: Record<string, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};

export const PRIORITY: Record<string, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

export const FEEDBACK_RATING: Record<string, string> = {
  util: "Sim, foi específica e útil.",
  parcial: "Parcialmente útil.",
  nao_util: "Não foi útil.",
};

export const DOCUMENT_TYPE: Record<string, string> = {
  resume: "Currículo",
  linkedin_url: "Link do LinkedIn",
  linkedin_pdf: "PDF do LinkedIn",
  job_description: "Descrição da vaga",
  complementary_file: "Arquivo complementar",
  pasted_text: "Texto colado",
};

export const SENIORITY_OPTIONS = [
  { value: "estagio", label: "Estágio" },
  { value: "junior", label: "Júnior" },
  { value: "pleno", label: "Pleno" },
  { value: "senior", label: "Sênior" },
  { value: "especialista", label: "Especialista" },
  { value: "coordenacao", label: "Coordenação / Liderança" },
];

export const AREA_OPTIONS = [
  { value: "administrativo", label: "Administrativo" },
  { value: "atendimento", label: "Atendimento" },
  { value: "dados", label: "Dados" },
  { value: "desenvolvimento", label: "Desenvolvimento" },
  { value: "design", label: "Design" },
  { value: "comercial", label: "Comercial" },
  { value: "rh", label: "RH / People" },
  { value: "marketing", label: "Marketing" },
  { value: "outra", label: "Outra" },
];

export const FINAL_RECOMMENDATIONS = [
  "Aplicar agora.",
  "Aplicar com ajustes.",
  "Desenvolver lacunas antes de aplicar.",
  "Não priorizar esta vaga.",
] as const;

export function label(map: Record<string, string>, key: string | null | undefined, fallback = "—") {
  if (!key) return fallback;
  return map[key] ?? key;
}
