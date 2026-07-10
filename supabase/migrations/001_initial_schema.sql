-- TwinJobs — schema inicial com RLS
-- Execute no SQL Editor do Supabase (ou via CLI)

-- Extensões
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- user_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  "current_role" TEXT,
  target_role TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- career_analyses
-- ============================================================
CREATE TABLE IF NOT EXISTS public.career_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_role TEXT,
  target_area TEXT,
  target_seniority TEXT,
  wants_role_suggestions BOOLEAN NOT NULL DEFAULT false,
  job_title TEXT,
  job_company TEXT,
  job_url TEXT,
  status TEXT NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'completed', 'reanalyzed')),
  overall_score INTEGER CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)),
  confidence TEXT CHECK (confidence IS NULL OR confidence IN ('alta', 'media', 'baixa')),
  summary TEXT,
  main_strength TEXT,
  main_gap TEXT,
  next_best_action TEXT,
  suggested_roles TEXT[] DEFAULT '{}',
  general_diagnosis TEXT,
  parent_analysis_id UUID REFERENCES public.career_analyses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_career_analyses_user_id ON public.career_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_career_analyses_created_at ON public.career_analyses(created_at DESC);

-- ============================================================
-- user_documents
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL
    CHECK (document_type IN (
      'resume', 'linkedin_url', 'linkedin_pdf',
      'job_description', 'complementary_file', 'pasted_text'
    )),
  file_url TEXT,
  file_name TEXT,
  raw_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_documents_analysis_id ON public.user_documents(analysis_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON public.user_documents(user_id);

-- ============================================================
-- recommendations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  category TEXT NOT NULL
    CHECK (category IN ('competencia', 'comunicacao', 'evidencia', 'posicionamento')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT NOT NULL CHECK (impact IN ('alto', 'medio', 'baixo')),
  effort TEXT NOT NULL CHECK (effort IN ('alto', 'medio', 'baixo')),
  urgency TEXT NOT NULL CHECK (urgency IN ('alta', 'media', 'baixa')),
  priority_order INTEGER NOT NULL DEFAULT 1,
  suggested_action TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  example_text TEXT,
  status TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_analysis_id ON public.recommendations(analysis_id);

-- ============================================================
-- fit_diagnostics
-- ============================================================
CREATE TABLE IF NOT EXISTS public.fit_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  fit_type TEXT NOT NULL CHECK (fit_type IN ('cargo_alvo', 'vaga_especifica')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  level TEXT NOT NULL,
  strengths TEXT[] DEFAULT '{}',
  gaps TEXT[] DEFAULT '{}',
  risks TEXT[] DEFAULT '{}',
  present_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  expected_experiences TEXT[] DEFAULT '{}',
  seniority_signals TEXT[] DEFAULT '{}',
  mandatory_requirements TEXT[] DEFAULT '{}',
  desirable_requirements TEXT[] DEFAULT '{}',
  inflated_requirements TEXT[] DEFAULT '{}',
  real_gaps TEXT[] DEFAULT '{}',
  communication_gaps TEXT[] DEFAULT '{}',
  evidence_gaps TEXT[] DEFAULT '{}',
  job_name TEXT,
  company_name TEXT,
  recommendation TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fit_diagnostics_analysis_id ON public.fit_diagnostics(analysis_id);

-- ============================================================
-- experience_translations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.experience_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  identified_issue TEXT NOT NULL,
  implicit_skills TEXT[] DEFAULT '{}',
  suggested_text TEXT NOT NULL,
  market_language_terms TEXT[] DEFAULT '{}',
  authenticity_warning TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_experience_translations_analysis_id ON public.experience_translations(analysis_id);

-- ============================================================
-- evolution_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS public.evolution_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  action_title TEXT NOT NULL,
  action_description TEXT NOT NULL,
  action_type TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('alta', 'media', 'baixa')),
  timeframe TEXT,
  success_criteria TEXT,
  status TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'em_andamento', 'concluido')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evolution_plans_analysis_id ON public.evolution_plans(analysis_id);

-- ============================================================
-- analysis_versions (reanálise)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analysis_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  new_analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  improvements_summary TEXT,
  remaining_gaps TEXT,
  score_change INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_versions_user_id ON public.analysis_versions(user_id);

-- ============================================================
-- analysis_feedback
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analysis_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('util', 'parcial', 'nao_util')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (analysis_id, user_id)
);

-- ============================================================
-- market_jargons
-- ============================================================
CREATE TABLE IF NOT EXISTS public.market_jargons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL UNIQUE,
  terms TEXT[] NOT NULL DEFAULT '{}',
  usage_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- plans (freemium)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- user_credits
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  available_analyses INTEGER NOT NULL DEFAULT 1,
  used_analyses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Trigger: criar perfil + créditos no cadastro
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );

  SELECT id INTO free_plan_id FROM public.plans WHERE slug = 'gratuito' LIMIT 1;

  INSERT INTO public.user_credits (user_id, plan_id, available_analyses, used_analyses)
  VALUES (NEW.id, free_plan_id, 1, 0);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- updated_at helper
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_career_analyses_updated_at ON public.career_analyses;
CREATE TRIGGER set_career_analyses_updated_at
  BEFORE UPDATE ON public.career_analyses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_recommendations_updated_at ON public.recommendations;
CREATE TRIGGER set_recommendations_updated_at
  BEFORE UPDATE ON public.recommendations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_evolution_plans_updated_at ON public.evolution_plans;
CREATE TRIGGER set_evolution_plans_updated_at
  BEFORE UPDATE ON public.evolution_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_user_credits_updated_at ON public.user_credits;
CREATE TRIGGER set_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fit_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evolution_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_jargons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- user_profiles
CREATE POLICY "profiles_select_own" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- career_analyses
CREATE POLICY "analyses_select_own" ON public.career_analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "analyses_insert_own" ON public.career_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analyses_update_own" ON public.career_analyses
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analyses_delete_own" ON public.career_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- user_documents
CREATE POLICY "documents_select_own" ON public.user_documents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON public.user_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_update_own" ON public.user_documents
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_delete_own" ON public.user_documents
  FOR DELETE USING (auth.uid() = user_id);

-- recommendations (via análise)
CREATE POLICY "recommendations_select_own" ON public.recommendations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = recommendations.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "recommendations_insert_own" ON public.recommendations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = recommendations.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "recommendations_update_own" ON public.recommendations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = recommendations.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "recommendations_delete_own" ON public.recommendations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = recommendations.analysis_id AND a.user_id = auth.uid()
    )
  );

-- fit_diagnostics
CREATE POLICY "fit_select_own" ON public.fit_diagnostics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = fit_diagnostics.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "fit_insert_own" ON public.fit_diagnostics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = fit_diagnostics.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "fit_update_own" ON public.fit_diagnostics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = fit_diagnostics.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "fit_delete_own" ON public.fit_diagnostics
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = fit_diagnostics.analysis_id AND a.user_id = auth.uid()
    )
  );

-- experience_translations
CREATE POLICY "translations_select_own" ON public.experience_translations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = experience_translations.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "translations_insert_own" ON public.experience_translations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = experience_translations.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "translations_delete_own" ON public.experience_translations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = experience_translations.analysis_id AND a.user_id = auth.uid()
    )
  );

-- evolution_plans
CREATE POLICY "plans_actions_select_own" ON public.evolution_plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = evolution_plans.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "plans_actions_insert_own" ON public.evolution_plans
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = evolution_plans.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "plans_actions_update_own" ON public.evolution_plans
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = evolution_plans.analysis_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "plans_actions_delete_own" ON public.evolution_plans
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.career_analyses a
      WHERE a.id = evolution_plans.analysis_id AND a.user_id = auth.uid()
    )
  );

-- analysis_versions
CREATE POLICY "versions_select_own" ON public.analysis_versions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "versions_insert_own" ON public.analysis_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- analysis_feedback
CREATE POLICY "feedback_select_own" ON public.analysis_feedback
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "feedback_insert_own" ON public.analysis_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feedback_update_own" ON public.analysis_feedback
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- market_jargons: leitura autenticada
CREATE POLICY "jargons_select_auth" ON public.market_jargons
  FOR SELECT TO authenticated USING (true);

-- plans: leitura pública autenticada
CREATE POLICY "plans_select_auth" ON public.plans
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "plans_select_anon" ON public.plans
  FOR SELECT TO anon USING (true);

-- user_credits
CREATE POLICY "credits_select_own" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "credits_update_own" ON public.user_credits
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "credits_insert_own" ON public.user_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Storage bucket (privado) + policies
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'career-documents',
  'career-documents',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/png',
    'image/jpeg'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Pasta = user_id/...
CREATE POLICY "storage_select_own_folder"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'career-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_insert_own_folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'career-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_update_own_folder"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'career-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_delete_own_folder"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'career-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- Seeds
-- ============================================================
INSERT INTO public.plans (name, description, price, slug, features)
VALUES
  (
    'Gratuito',
    'Uma análise básica para conhecer o produto.',
    0,
    'gratuito',
    '["Uma análise básica","Recomendações limitadas","Diagnóstico geral","Plano de evolução resumido"]'::jsonb
  ),
  (
    'Análise completa',
    'Diagnóstico detalhado de currículo e LinkedIn.',
    49.90,
    'completa',
    '["Recomendações detalhadas","Diagnóstico completo de currículo e LinkedIn","Tradução contextual da experiência","Plano de evolução completo"]'::jsonb
  ),
  (
    'Análise de vaga',
    'Aderência e decisão sobre uma vaga específica.',
    29.90,
    'vaga',
    '["Diagnóstico da vaga","Score de aderência","Requisitos obrigatórios e desejáveis","Riscos da candidatura","Recomendação de aplicação"]'::jsonb
  ),
  (
    'Pacote múltiplas análises',
    'Várias análises e comparação entre versões.',
    99.90,
    'pacote',
    '["Análises para diferentes cargos-alvo","Análises para diferentes vagas","Comparação entre versões","Suporte prioritário (futuro)"]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.market_jargons (area, terms, usage_note) VALUES
  (
    'administrativo',
    ARRAY['gestão de rotinas','controle de documentos','atendimento a stakeholders','organização de processos','suporte operacional','KPI operacional','fluxo de trabalho','prestação de contas'],
    'Use termos que descrevam processos e resultados, sem transformar tarefas operacionais em liderança.'
  ),
  (
    'atendimento',
    ARRAY['experiência do cliente','resolução de demandas','SLA','satisfação do cliente','omnichannel','base de conhecimento','tratamento de reclamações','retenção'],
    'Destaque volume, canais e impacto no cliente quando houver evidência real.'
  ),
  (
    'dados',
    ARRAY['análise exploratória','dashboard','ETL','qualidade de dados','SQL','visualização','storytelling com dados','métricas de negócio'],
    'Cite ferramentas e volumes apenas se mencionados nos materiais do usuário.'
  ),
  (
    'desenvolvimento',
    ARRAY['código limpo','code review','CI/CD','API REST','testes automatizados','refatoração','debito técnico','deploy'],
    'Não afirme domínio de stack não mencionada no currículo ou LinkedIn.'
  ),
  (
    'design',
    ARRAY['pesquisa com usuários','wireframe','protótipo','design system','usabilidade','acessibilidade','handoff','jornada do usuário'],
    'Conecte decisões de design a problemas reais de negócio quando possível.'
  ),
  (
    'comercial',
    ARRAY['pipeline de vendas','prospecção','fechamento','ticket médio','CRM','follow-up','negociação','meta comercial'],
    'Evite inventar números de meta ou conversão não informados.'
  ),
  (
    'rh',
    ARRAY['atracção de talentos','onboarding','people analytics','clima organizacional','avaliação de desempenho','employee experience','recrutamento e seleção'],
    'Preserve autenticidade: não eleve escopo operacional a gestão de pessoas sem evidência.'
  ),
  (
    'marketing',
    ARRAY['funil de conversão','conteúdo orgânico','SEO','mídia paga','persona','engajamento','branding','growth'],
    'Use métricas (CTR, CAC, ROAS) só se constarem nos materiais enviados.'
  )
ON CONFLICT (area) DO NOTHING;
