import type { AnalysisResultPayload, GenerateAnalysisInput } from "@/lib/types";
import { confidenceFromMaterials, fitLevelFromScore, simpleHash } from "@/lib/utils";

function extractSnippet(text: string, fallback: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return fallback;
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  if (sentences.length > 0) return sentences[0].slice(0, 180);
  return cleaned.slice(0, 180);
}

function pickLines(text: string, count: number): string[] {
  const lines = text
    .split(/\n|[•\-\u2022]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && l.length < 200);
  if (lines.length === 0) return [];
  return lines.slice(0, count);
}

function scoreFor(input: GenerateAnalysisInput): number {
  const seed = simpleHash(
    `${input.target_role}|${input.resume_text.slice(0, 200)}|${input.linkedin_text.slice(0, 100)}|${input.job_description_text.slice(0, 100)}`
  );
  let base = 48 + (seed % 28); // 48-75

  if (input.resume_text.length > 200) base += 6;
  if (input.linkedin_text.length > 100) base += 4;
  if (input.job_description_text.length > 50) base += 3;
  if (input.wants_role_suggestions && !input.target_role) base -= 4;

  return Math.max(28, Math.min(92, base));
}

type SeniorityBand = "junior" | "pleno" | "senior" | "lideranca";

/** Inferência simples de área a partir do texto (mock — não substitui IA real). */
function inferAreaFromText(text: string, declaredArea: string): string {
  const t = text.toLowerCase();
  const scores: Record<string, number> = {
    desenvolvimento: 0,
    dados: 0,
    design: 0,
    comercial: 0,
    marketing: 0,
    rh: 0,
    atendimento: 0,
    administrativo: 0,
  };

  const bump = (area: string, n: number) => {
    scores[area] = (scores[area] || 0) + n;
  };

  if (
    /\b(desenvolv|developer|software|backend|front[- ]?end|full[- ]?stack|devops|sre|arquitet(o|a) de software|engenharia de software| tit\b|ti\b|tecnologia da informação|python|java|typescript|react|node\.?js|kubernetes|aws|azure|gcp|api rest|microservi[cç]os|infraestrutura|cloud|cyber|seguran[cç]a da informa)/i.test(
      t
    )
  ) {
    bump("desenvolvimento", 5);
  }
  if (/\b(sql|data engineer|cientista de dados|analytics|power bi|etl|machine learning|big data)\b/i.test(t)) {
    bump("dados", 4);
  }
  if (/\b(ui\/ux|figma|design system|product designer|interface)\b/i.test(t)) {
    bump("design", 4);
  }
  if (/\b(vendas|comercial|account executive|sdr|bdr|pipeline)\b/i.test(t)) {
    bump("comercial", 3);
  }
  if (/\b(marketing|seo|growth|m[ií]dias sociais|conte[uú]do)\b/i.test(t)) {
    bump("marketing", 3);
  }
  if (/\b(recursos humanos|recrutamento|people|rh\b|talent)\b/i.test(t)) {
    bump("rh", 3);
  }
  if (/\b(atendimento|customer success|suporte ao cliente|sac)\b/i.test(t)) {
    bump("atendimento", 3);
  }
  if (/\b(administrativ|assistente administrativo|secretaria|rotinas de escrit[oó]rio)\b/i.test(t)) {
    bump("administrativo", 2);
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = ranked[0];

  // Se o usuário declarou área específica e o texto não contradiz forte, respeita
  if (
    declaredArea &&
    declaredArea !== "outra" &&
    declaredArea !== "administrativo" &&
    scores[declaredArea] >= 0
  ) {
    // texto claramente de TI e área declarada não-TI → prioriza inferência
    if (best[1] >= 4 && best[0] !== declaredArea && declaredArea !== best[0]) {
      return best[0];
    }
    if (scores[declaredArea] > 0 || best[1] < 3) return declaredArea;
  }

  if (best[1] >= 3) return best[0];
  if (declaredArea && declaredArea !== "outra") return declaredArea;
  return best[1] > 0 ? best[0] : "desenvolvimento";
}

function normalizeSeniority(
  declared: string,
  text: string
): SeniorityBand {
  const d = (declared || "").toLowerCase();
  const t = text.toLowerCase();

  if (
    d.includes("coorden") ||
    d.includes("lider") ||
    d.includes("gerente") ||
    d.includes("head") ||
    /\b(coordenad|gerent|head de|diretor|tech lead|engineering manager|cto)\b/i.test(t)
  ) {
    return "lideranca";
  }
  if (
    d.includes("senior") ||
    d.includes("sênior") ||
    d.includes("especialista") ||
    /\b(s[eê]nior|senior|especialista|staff engineer|principal engineer)\b/i.test(t)
  ) {
    return "senior";
  }
  if (d.includes("pleno") || /\bpleno\b/i.test(t)) return "pleno";
  if (d.includes("junior") || d.includes("júnior") || d.includes("estagio") || d.includes("estágio")) {
    return "junior";
  }
  // heurística: muitos anos / senior no texto
  if (/\b([8-9]|1[0-9]|2[0-9])\s*\+?\s*anos\b/i.test(t) || /\b(s[eê]nior|senior)\b/i.test(t)) {
    return "senior";
  }
  if (/\b([4-7])\s*\+?\s*anos\b/i.test(t)) return "pleno";
  return "pleno";
}

function suggestedRoles(area: string, seniority: SeniorityBand, seed: number): string[] {
  const byArea: Record<string, Record<SeniorityBand, string[]>> = {
    desenvolvimento: {
      junior: [
        "Desenvolvedor(a) Júnior",
        "Analista de Sistemas Júnior",
        "Desenvolvedor(a) Full Stack Júnior",
      ],
      pleno: [
        "Desenvolvedor(a) Pleno",
        "Analista de Sistemas Pleno",
        "Engenheiro(a) de Software",
      ],
      senior: [
        "Desenvolvedor(a) Sênior",
        "Engenheiro(a) de Software Sênior",
        "Especialista em Engenharia de Software",
      ],
      lideranca: [
        "Tech Lead",
        "Engenheiro(a) de Software Sênior / Staff",
        "Coordenador(a) de Engenharia",
      ],
    },
    dados: {
      junior: ["Analista de Dados Júnior", "Analista de BI Júnior", "Analista de Relatórios"],
      pleno: ["Analista de Dados Pleno", "Analista de Business Intelligence", "Data Analyst"],
      senior: [
        "Analista de Dados Sênior",
        "Engenheiro(a) de Dados Sênior",
        "Especialista em Analytics",
      ],
      lideranca: ["Tech Lead de Dados", "Coordenador(a) de Analytics", "Head de Dados (em transição)"],
    },
    design: {
      junior: ["Designer de Produto Júnior", "UI Designer Júnior", "Designer de Experiência Júnior"],
      pleno: ["Product Designer", "UI/UX Designer Pleno", "Designer de Produto"],
      senior: ["Product Designer Sênior", "UX Designer Sênior", "Design Specialist"],
      lideranca: ["Lead Product Designer", "Design Lead", "Coordenador(a) de Design"],
    },
    administrativo: {
      junior: [
        "Assistente Administrativo",
        "Analista Administrativo Júnior",
        "Assistente de Operações",
      ],
      pleno: [
        "Analista Administrativo",
        "Analista de Operações",
        "Analista de Processos",
      ],
      senior: [
        "Analista Administrativo Sênior",
        "Analista de Operações Sênior",
        "Especialista em Processos",
      ],
      lideranca: [
        "Coordenador(a) Administrativo(a)",
        "Coordenador(a) de Operações",
        "Supervisor(a) de Processos",
      ],
    },
    atendimento: {
      junior: [
        "Analista de Atendimento Júnior",
        "Assistente de Customer Success",
        "Analista de Suporte",
      ],
      pleno: ["Analista de Customer Success", "Analista de Suporte Pleno", "Analista de Atendimento"],
      senior: [
        "Analista de CS Sênior",
        "Especialista em Experiência do Cliente",
        "Analista de Suporte Sênior",
      ],
      lideranca: ["Coordenador(a) de Atendimento", "Team Lead de CS", "Supervisor(a) de Suporte"],
    },
    comercial: {
      junior: ["Assistente Comercial", "SDR", "Analista de Vendas Internas Júnior"],
      pleno: ["Analista Comercial", "Executivo(a) de Contas", "Analista de Vendas"],
      senior: ["Executivo(a) de Contas Sênior", "Key Account Manager", "Especialista Comercial"],
      lideranca: ["Coordenador(a) Comercial", "Team Lead de Vendas", "Gerente Comercial (em transição)"],
    },
    rh: {
      junior: ["Assistente de RH", "Analista de Recrutamento Júnior", "Assistente de People Ops"],
      pleno: ["Analista de RH", "Analista de Recrutamento e Seleção", "People Operations Analyst"],
      senior: ["Analista de RH Sênior", "Business Partner de RH", "Especialista em Talent Acquisition"],
      lideranca: ["Coordenador(a) de RH", "HRBP Sênior", "Lead de People"],
    },
    marketing: {
      junior: [
        "Assistente de Marketing",
        "Analista de Marketing Júnior",
        "Analista de Mídias Sociais",
      ],
      pleno: ["Analista de Marketing", "Analista de Growth", "Analista de Conteúdo"],
      senior: ["Analista de Marketing Sênior", "Especialista em Growth", "Marketing Specialist"],
      lideranca: ["Coordenador(a) de Marketing", "Growth Lead", "Head de Marketing (em transição)"],
    },
  };

  const areaMap = byArea[area] || byArea.desenvolvimento;
  const list = areaMap[seniority] || areaMap.pleno;
  const offset = seed % list.length;
  return [list[offset], list[(offset + 1) % list.length], list[(offset + 2) % list.length]].slice(
    0,
    3
  );
}

export function buildMockAnalysis(input: GenerateAnalysisInput): AnalysisResultPayload {
  const materialsText = `${input.resume_text}\n${input.linkedin_text}\n${input.complementary_files_text}`;
  const area = inferAreaFromText(materialsText, input.target_area || "");
  const seniorityBand = normalizeSeniority(input.target_seniority || "", materialsText);
  const role =
    input.target_role ||
    (input.wants_role_suggestions
      ? `perfil ${area} (${seniorityBand})`
      : "cargo-alvo a definir");
  const seed = simpleHash(
    `${role}|${area}|${seniorityBand}|${input.resume_text.length}|${input.linkedin_text.length}`
  );
  const overall = scoreFor(input);
  const hasResume = input.resume_text.trim().length > 40;
  const hasLinkedin = input.linkedin_text.trim().length > 20 || Boolean(input.linkedin_url);
  const hasTarget = Boolean(input.target_role) || input.wants_role_suggestions;
  const hasJob = input.job_description_text.trim().length > 40;

  const confidence = confidenceFromMaterials({
    hasResume,
    hasLinkedin,
    hasTargetRole: hasTarget,
    hasJob,
  });

  const originalSnippet = extractSnippet(
    input.resume_text || input.linkedin_text,
    "Ajudava a equipe no dia a dia."
  );
  const extraSnippets = pickLines(input.resume_text || input.linkedin_text, 2);

  const jobRec =
    overall >= 85
      ? "Aplicar agora."
      : overall >= 65
        ? "Aplicar com ajustes."
        : overall >= 40
          ? "Desenvolver lacunas antes de aplicar."
          : "Não priorizar esta vaga.";

  const defaultTermsByArea: Record<string, string[]> = {
    desenvolvimento: ["código limpo", "arquitetura de software", "CI/CD", "cloud", "API REST"],
    dados: ["SQL", "dashboard", "ETL", "métricas de negócio"],
    design: ["design system", "pesquisa com usuários", "protótipo", "usabilidade"],
    administrativo: [
      "organização de processos",
      "suporte operacional",
      "gestão de rotinas",
      "atendimento a stakeholders",
    ],
  };
  const terms =
    input.market_terms && input.market_terms.length > 0
      ? input.market_terms.slice(0, 4)
      : defaultTermsByArea[area] || defaultTermsByArea.desenvolvimento;

  const payload: AnalysisResultPayload = {
    summary: {
      overall_score: overall,
      confidence,
      general_diagnosis: `Seu perfil apresenta ${fitLevelFromScore(overall).toLowerCase()} em relação a ${
        input.target_role || "os caminhos profissionais avaliados"
      }, com sinais de atuação em ${area} e nível próximo de ${seniorityBand === "senior" ? "sênior" : seniorityBand === "lideranca" ? "liderança / coordenação" : seniorityBand}. As principais oportunidades de melhoria estão na comunicação das experiências, inclusão de evidências práticas e alinhamento explícito entre trajetória e cargo-alvo. ${
        confidence === "baixa"
          ? "A confiança desta análise é baixa porque faltam materiais relevantes — complemente currículo e LinkedIn para um diagnóstico mais preciso."
          : confidence === "media"
            ? "A confiança desta análise é média: um material relevante ainda está incompleto ou pouco detalhado."
            : "A confiança desta análise é alta, com base na completude dos materiais enviados."
      } Esta versão do MVP usa motor simulado (mock): cargos sugeridos consideram área/senioridade e palavras-chave do texto, mas ainda não substituem uma leitura humana profunda.`,
      main_strength:
        hasResume || hasLinkedin
          ? `Base prática alinhada a ${area} (${seniorityBand === "senior" ? "sênior" : seniorityBand}), com potencial de posicionamento mais claro no mercado.`
          : "Disponibilidade para recolocação e abertura a feedback estruturado.",
      main_gap:
        "Comunicação genérica das experiências e poucas evidências de resultado que o mercado reconhece com facilidade.",
      next_best_action:
        "Atualizar o título e o resumo do LinkedIn com área (ex.: TI/engenharia), senioridade real e competências-chave — sem inventar experiências.",
      suggested_roles: input.wants_role_suggestions
        ? suggestedRoles(area, seniorityBand, seed)
        : [],
    },
    recommendations: [
      {
        category: "posicionamento",
        title: "Ajustar título profissional do LinkedIn",
        description:
          "Seu LinkedIn (ou materiais) comunicam busca de oportunidade, mas ainda deixam pouco claro área de atuação, competências centrais ou cargo desejado.",
        impact: "alto",
        effort: "baixo",
        urgency: "alta",
        priority_order: 1,
        suggested_action: `Atualizar o título para algo específico, como: ${role} | ${area} | competências-chave reais do seu histórico.`,
        reasoning:
          "Um título específico ajuda recrutadores e sistemas de busca a entenderem rapidamente seu posicionamento.",
        example_text: `${role} | Organização de Processos | Atendimento e Rotinas`,
      },
      {
        category: "comunicacao",
        title: "Reescrever descrições genéricas de experiência",
        description: `Trechos como "${originalSnippet.slice(0, 80)}${originalSnippet.length > 80 ? "…" : ""}" não mostram demandas, ferramentas ou impacto.`,
        impact: "alto",
        effort: "medio",
        urgency: "alta",
        priority_order: 2,
        suggested_action:
          "Reescrever 2 a 3 bullets principais com contexto, ação e resultado (sem inventar números).",
        reasoning:
          "Descrições específicas aumentam a leitura de aderência sem alterar a verdade da trajetória.",
      },
      {
        category: "evidencia",
        title: "Incluir evidências práticas de resultado",
        description:
          "O material atual descreve atividades, mas pouco comprova impacto, volume ou melhoria de processo.",
        impact: "alto",
        effort: "medio",
        urgency: "media",
        priority_order: 3,
        suggested_action:
          "Adicionar evidências reais: volume de demandas, melhorias de rotina, sistemas usados ou feedbacks — somente o que de fato existiu.",
        reasoning:
          "Evidências diferenciam candidatos com experiências semelhantes e reduzem lacunas de prova.",
      },
      {
        category: "competencia",
        title: `Tornar explícitas competências técnicas de ${area}`,
        description: `Para ${role}, o mercado espera ver competências da área de ${area} de forma explícita no currículo e LinkedIn.`,
        impact: "medio",
        effort: "medio",
        urgency: "media",
        priority_order: 4,
        suggested_action: `Listar ferramentas, processos e entregas reais ligadas a ${role}, usando termos de mercado com honestidade.`,
        reasoning:
          "Competências implícitas não contam em triagens; explicitá-las é diferente de inventá-las.",
      },
      {
        category: "posicionamento",
        title: "Alinhar resumo profissional ao cargo-alvo",
        description:
          "O resumo ainda não conecta claramente sua trajetória ao objetivo de recolocação.",
        impact: "medio",
        effort: "baixo",
        urgency: "media",
        priority_order: 5,
        suggested_action: `Escrever um resumo de 4–6 linhas ligando experiência real → valor entregue → interesse em ${role}.`,
        reasoning:
          "O resumo é a narrativa de posicionamento: orienta a leitura do restante do perfil.",
      },
    ],
    fit_diagnostics: [
      {
        fit_type: "cargo_alvo",
        score: overall,
        level: fitLevelFromScore(overall),
        strengths: [
          `Sinais de experiência prática compatíveis com ${area}`,
          "Disposição para recolocação com materiais estruturados",
          hasResume ? "Currículo disponível para refinamento" : "Base mínima de informações para diagnóstico inicial",
        ],
        gaps: [
          "Narrativa pouco específica para o cargo-alvo",
          "Poucas evidências de resultado",
          "Competências técnicas ainda pouco explícitas",
        ],
        risks: [
          "Triagens automáticas podem subestimar o perfil por falta de palavras-chave honestas",
          "Comparação desfavorável com candidatos que comunicam melhor experiências similares",
        ],
        present_skills: terms.slice(0, 3),
        missing_skills: [
          `Evidências explícitas de ${role}`,
          "Indicadores de resultado comunicados",
          "Palavras-chave de senioridade alinhadas",
        ],
        expected_experiences: [
          `Rotinas e entregas típicas de ${role}`,
          "Colaboração com equipe e stakeholders",
          "Uso de ferramentas ou processos da área",
        ],
        seniority_signals: [
          input.target_seniority
            ? `Senioridade desejada: ${input.target_seniority} — valide se o histórico sustenta esse nível sem exagero`
            : "Senioridade ainda não definida com clareza",
        ],
        recommendation: jobRec,
        reasoning: `O score ${overall} reflete ${fitLevelFromScore(overall).toLowerCase()} ao cargo ${role}, com base nos materiais enviados — sem inventar experiências ausentes.`,
      },
    ],
    experience_translations: [
      {
        original_text: originalSnippet,
        identified_issue:
          "A descrição está genérica e não mostra quais demandas eram apoiadas, quais ferramentas eram usadas ou qual era o impacto da atuação.",
        implicit_skills: [
          "Apoio operacional",
          "Organização de demandas",
          "Colaboração com equipe",
          "Gestão de rotina",
        ],
        suggested_text:
          "Apoio às rotinas operacionais da equipe, contribuindo para a organização de demandas, controle de informações e execução de atividades do dia a dia.",
        market_language_terms: terms.slice(0, 3),
        authenticity_warning:
          "Use esta versão apenas se essas atividades realmente fizeram parte da sua experiência.",
      },
      ...(extraSnippets[0]
        ? [
            {
              original_text: extraSnippets[0],
              identified_issue:
                "O trecho comunica atividade, mas deixa implícitas competências e contexto que o mercado valoriza.",
              implicit_skills: ["Organização", "Execução de processos", "Atenção a detalhes"],
              suggested_text: `Atuação em ${extraSnippets[0]
                .toLowerCase()
                .replace(/\.$/, "")}, com foco em organização, qualidade da entrega e apoio às rotinas da área.`,
              market_language_terms: terms.slice(0, 2),
              authenticity_warning:
                "Revise e ajuste para refletir exatamente o que você fez — não adicione responsabilidades que não existiram.",
            },
          ]
        : [
            {
              original_text: "Responsável por diversas demandas da área.",
              identified_issue:
                "“Diversas demandas” é vago e não diferencia o perfil em processos seletivos.",
              implicit_skills: ["Priorização", "Multitarefa", "Suporte a processos"],
              suggested_text:
                "Condução de demandas prioritárias da área, com organização de prazos, acompanhamento de pendências e suporte a processos internos.",
              market_language_terms: ["priorização", "acompanhamento de pendências"],
              authenticity_warning:
                "Use esta versão apenas se essas atividades realmente fizeram parte da sua experiência.",
            },
          ]),
    ],
    evolution_plan: [
      {
        action_title: "Atualizar título e headline do LinkedIn",
        action_description: `Definir um título claro para ${role}, com área e 1–2 competências reais.`,
        action_type: "Atualizar LinkedIn",
        priority: "alta",
        timeframe: "2 dias",
        success_criteria: "Título específico, sem linguagem vaga de “em busca de oportunidades” apenas.",
      },
      {
        action_title: "Reescrever 3 bullets do currículo",
        action_description:
          "Escolher as experiências mais relevantes e reescrevê-las com contexto, ação e resultado real.",
        action_type: "Ajustar currículo",
        priority: "alta",
        timeframe: "5 dias",
        success_criteria: "Três bullets específicos, sem métricas inventadas.",
      },
      {
        action_title: "Organizar evidências de resultado",
        action_description:
          "Listar evidências reais (volumes, melhorias, sistemas, feedbacks) para incluir no currículo ou LinkedIn.",
        action_type: "Organizar evidência",
        priority: "media",
        timeframe: "1 semana",
        success_criteria: "Lista com ao menos 5 evidências verificáveis da sua trajetória.",
      },
      {
        action_title: "Revisar posicionamento para o cargo-alvo",
        action_description: `Alinhar resumo profissional, competências e ordem das experiências para ${role}.`,
        action_type: "Revisar posicionamento",
        priority: "media",
        timeframe: "1 semana",
        success_criteria: "Leitor entende em 10 segundos qual cargo você busca e por quê.",
      },
      {
        action_title: hasJob
          ? "Ajustar materiais para a vaga analisada"
          : "Selecionar uma vaga real para analisar",
        action_description: hasJob
          ? "Aplicar os ajustes de comunicação e evidência antes de candidatar-se."
          : "Escolher uma vaga concreta e rodar uma nova análise de aderência.",
        action_type: hasJob ? "Analisar nova vaga" : "Analisar nova vaga",
        priority: "baixa",
        timeframe: "10 dias",
        success_criteria: hasJob
          ? "Decisão consciente de aplicar ou desenvolver lacunas antes."
          : "Vaga selecionada e materiais alinhados ao anúncio.",
      },
    ],
  };

  if (hasJob) {
    payload.fit_diagnostics.push({
      fit_type: "vaga_especifica",
      score: Math.max(20, Math.min(95, overall + ((seed % 9) - 4))),
      level: fitLevelFromScore(Math.max(20, Math.min(95, overall + ((seed % 9) - 4)))),
      strengths: [
        "Elementos do histórico conversam com parte dos requisitos",
        "Materiais permitem ajustes de comunicação sem inventar experiência",
      ],
      gaps: [
        "Alguns requisitos podem estar pouco evidenciados nos materiais",
        "Narrativa ainda não está otimizada para esta vaga",
      ],
      risks: [
        "Candidatura sem ajustes pode parecer genérica",
        "Lacunas de evidência podem ser interpretadas como lacunas reais",
      ],
      mandatory_requirements: pickLines(input.job_description_text, 3).length
        ? pickLines(input.job_description_text, 3)
        : ["Requisitos principais descritos na vaga", "Experiência na área", "Comunicação clara"],
      desirable_requirements: ["Diferenciais mencionados no anúncio", "Ferramentas específicas da vaga"],
      inflated_requirements: [
        "Alguns requisitos listados podem ser desejáveis e não bloqueadores absolutos",
      ],
      real_gaps: ["Competências ou experiências não mencionadas nos materiais enviados"],
      communication_gaps: ["Experiências presentes, mas mal comunicadas em relação à vaga"],
      evidence_gaps: ["Atividades descritas sem prova de impacto ou volume"],
      job_name: role,
      company_name: undefined,
      recommendation: jobRec,
      reasoning:
        "A recomendação considera aderência comunicada nos materiais — não é previsão de contratação.",
    });
  }

  return payload;
}
