"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { extractDocumentText } from "@/lib/extractDocumentText";
import { AREA_OPTIONS, SENIORITY_OPTIONS } from "@/lib/labels";
import { Alert, Button, Card, Input, Label, ProgressBar, Textarea } from "@/components/ui";
import {
  ArrowLeft,
  ArrowRight,
  FileUp,
  Loader2,
  SkipForward,
} from "lucide-react";

const STEPS = [
  "Boas-vindas",
  "Currículo",
  "LinkedIn",
  "Cargo-alvo",
  "Vaga",
  "Complementos",
  "Revisão",
  "Processamento",
];

const LOADING_MSGS = [
  "Lendo seus materiais profissionais.",
  "Analisando aderência ao cargo-alvo.",
  "Identificando pontos fortes e lacunas.",
  "Gerando recomendações priorizadas.",
  "Criando seu plano de evolução.",
];

const ACCEPT = ".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

type CompFile = { name: string; type: string; text: string; storagePath?: string };

export function AnalysisWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reanaliseId = searchParams.get("reanalise");

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // form state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeExtractInfo, setResumeExtractInfo] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinFile, setLinkedinFile] = useState<File | null>(null);
  const [linkedinText, setLinkedinText] = useState("");
  const [linkedinExtractInfo, setLinkedinExtractInfo] = useState<string | null>(null);

  const [targetRole, setTargetRole] = useState("");
  const [targetArea, setTargetArea] = useState("administrativo");
  const [targetSeniority, setTargetSeniority] = useState("pleno");
  const [wantsSuggestions, setWantsSuggestions] = useState(false);

  const [includeJob, setIncludeJob] = useState(false);
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");

  const [compFiles, setCompFiles] = useState<CompFile[]>([]);

  // pré-preencher reanálise
  useEffect(() => {
    if (!reanaliseId) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("career_analyses")
          .select("*")
          .eq("id", reanaliseId)
          .maybeSingle();
        if (data) {
          setTargetRole(data.target_role || "");
          setTargetArea(data.target_area || "administrativo");
          setTargetSeniority(data.target_seniority || "pleno");
          setWantsSuggestions(Boolean(data.wants_role_suggestions));
          setJobTitle(data.job_title || "");
          setJobCompany(data.job_company || "");
          setJobUrl(data.job_url || "");
          if (data.job_title || data.job_company) setIncludeJob(true);
        }
      } catch {
        /* ignore */
      }
    })();
  }, [reanaliseId]);

  useEffect(() => {
    if (step !== 7) return;
    const t = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MSGS.length);
    }, 2200);
    return () => clearInterval(t);
  }, [step]);

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  async function readTextFromFile(file: File): Promise<{ text: string; info?: string }> {
    const result = await extractDocumentText(file);
    const parts: string[] = [];
    if (result.method === "pdf" && result.text.length >= 40) {
      parts.push(`Texto extraído do PDF (${result.text.length} caracteres). Revise e complete se faltar algo.`);
    } else if (result.method === "docx" && result.text.length >= 40) {
      parts.push(`Texto extraído do DOCX (${result.text.length} caracteres). Revise se necessário.`);
    } else if (result.method === "txt" && result.text.length >= 40) {
      parts.push(`Texto lido do arquivo (${result.text.length} caracteres).`);
    }
    if (result.warning) parts.push(result.warning);
    return { text: result.text, info: parts.length ? parts.join(" ") : undefined };
  }

  async function uploadFile(
    supabase: ReturnType<typeof createClient>,
    userId: string,
    analysisId: string,
    file: File,
    prefix: string
  ): Promise<string> {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${analysisId}/${prefix}_${Date.now()}_${safe}`;
    const { error: upErr } = await supabase.storage
      .from("career-documents")
      .upload(path, file, { upsert: false });
    if (upErr) throw upErr;
    return path;
  }

  const generate = useCallback(async () => {
    setError(null);
    setLoading(true);
    setStep(7);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?next=/analise/nova");
        return;
      }

      // texto: preferir campo; se vazio, tenta extrair de novo do arquivo (PDF/DOCX/TXT)
      let finalResumeText = resumeText.trim();
      if (finalResumeText.length < 80 && resumeFile) {
        const fromFile = await readTextFromFile(resumeFile);
        if (fromFile.text.length > finalResumeText.length) finalResumeText = fromFile.text;
      }

      let finalLinkedinText = linkedinText.trim();
      if (finalLinkedinText.length < 80 && linkedinFile) {
        const fromFile = await readTextFromFile(linkedinFile);
        if (fromFile.text.length > finalLinkedinText.length) finalLinkedinText = fromFile.text;
      }

      let finalJobText = jobText.trim();
      if (finalJobText.length < 40 && jobFile) {
        const fromFile = await readTextFromFile(jobFile);
        if (fromFile.text.length > finalJobText.length) finalJobText = fromFile.text;
      }

      const compText = (
        await Promise.all(
          compFiles.map(async (f) => {
            let t = f.text;
            // se o complemento foi só nome sem texto, já tentamos no upload
            return t.length > 10 ? `[${f.name}]\n${t}` : "";
          })
        )
      )
        .filter(Boolean)
        .join("\n\n");

      // URL sozinha NÃO basta (não fazemos scraping). Precisa de texto real (colado ou extraído do PDF/DOCX).
      const MIN_TEXT = 80;
      const hasResume = finalResumeText.length >= MIN_TEXT;
      const hasLinkedinBody = finalLinkedinText.length >= MIN_TEXT;
      if (!hasResume && !hasLinkedinBody) {
        throw new Error(
          "Não há texto suficiente do currículo ou LinkedIn. Envie PDF/DOCX com texto selecionável " +
            "(não escaneado) ou cole o conteúdo no campo. Só o link do LinkedIn não é lido."
        );
      }

      if (!wantsSuggestions && !targetRole.trim()) {
        throw new Error("Informe o cargo-alvo ou marque a opção de receber sugestões.");
      }

      // Vaga: se marcou incluir, precisa de descrição em texto (título/empresa sozinhos não bastam)
      if (includeJob) {
        const hasJobBody = finalJobText.length >= 40;
        if (!hasJobBody && !jobTitle.trim()) {
          throw new Error(
            "Na vaga opcional, cole a descrição da vaga ou ao menos o título. Título+empresa sem texto gera aderência fraca."
          );
        }
      }

      const title = wantsSuggestions
        ? "Análise com sugestões de cargo"
        : `Análise: ${targetRole.trim()}`;

      const { data: analysis, error: insertErr } = await supabase
        .from("career_analyses")
        .insert({
          user_id: user.id,
          title: reanaliseId ? `Reanálise: ${targetRole || "posicionamento"}` : title,
          target_role: wantsSuggestions ? null : targetRole.trim() || null,
          target_area: targetArea || null,
          target_seniority: targetSeniority || null,
          wants_role_suggestions: wantsSuggestions,
          job_title: includeJob ? jobTitle || null : null,
          job_company: includeJob ? jobCompany || null : null,
          job_url: includeJob ? jobUrl || null : null,
          status: "processing",
          parent_analysis_id: reanaliseId || null,
        })
        .select("*")
        .single();

      if (insertErr || !analysis) {
        throw new Error(insertErr?.message || "Não foi possível criar a análise.");
      }

      const docs: Array<{
        user_id: string;
        analysis_id: string;
        document_type: string;
        file_url: string | null;
        file_name: string | null;
        raw_text: string | null;
      }> = [];

      if (resumeFile) {
        const path = await uploadFile(supabase, user.id, analysis.id, resumeFile, "resume");
        docs.push({
          user_id: user.id,
          analysis_id: analysis.id,
          document_type: "resume",
          file_url: path,
          file_name: resumeFile.name,
          raw_text: finalResumeText || null,
        });
      } else if (finalResumeText) {
        docs.push({
          user_id: user.id,
          analysis_id: analysis.id,
          document_type: "resume",
          file_url: null,
          file_name: null,
          raw_text: finalResumeText,
        });
      }

      if (linkedinUrl) {
        docs.push({
          user_id: user.id,
          analysis_id: analysis.id,
          document_type: "linkedin_url",
          file_url: linkedinUrl,
          file_name: null,
          raw_text: null,
        });
      }

      if (linkedinFile) {
        const path = await uploadFile(supabase, user.id, analysis.id, linkedinFile, "linkedin");
        docs.push({
          user_id: user.id,
          analysis_id: analysis.id,
          document_type: "linkedin_pdf",
          file_url: path,
          file_name: linkedinFile.name,
          raw_text: finalLinkedinText || null,
        });
      } else if (finalLinkedinText) {
        docs.push({
          user_id: user.id,
          analysis_id: analysis.id,
          document_type: "pasted_text",
          file_url: null,
          file_name: "linkedin_texto",
          raw_text: finalLinkedinText,
        });
      }

      if (includeJob && (finalJobText || jobFile || jobUrl)) {
        let path: string | null = null;
        if (jobFile) {
          path = await uploadFile(supabase, user.id, analysis.id, jobFile, "job");
        }
        docs.push({
          user_id: user.id,
          analysis_id: analysis.id,
          document_type: "job_description",
          file_url: path || jobUrl || null,
          file_name: jobFile?.name || null,
          raw_text: finalJobText || null,
        });
      }

      for (const f of compFiles) {
        docs.push({
          user_id: user.id,
          analysis_id: analysis.id,
          document_type: "complementary_file",
          file_url: f.storagePath || null,
          file_name: f.name,
          raw_text: f.text || null,
        });
      }

      if (docs.length) {
        const { error: docErr } = await supabase.from("user_documents").insert(docs);
        if (docErr) throw new Error(docErr.message);
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis_id: analysis.id,
          resume_text: finalResumeText,
          linkedin_text: finalLinkedinText,
          linkedin_url: linkedinUrl,
          target_role: wantsSuggestions ? "" : targetRole.trim(),
          target_area: targetArea,
          target_seniority: targetSeniority,
          wants_role_suggestions: wantsSuggestions,
          job_description_text: includeJob ? finalJobText : "",
          complementary_files_text: compText,
          parent_analysis_id: reanaliseId,
        }),
      });

      const json = (await res.json()) as {
        error?: string;
        provider?: string;
        usedFallback?: boolean;
        warning?: string;
        overall_score?: number;
        analysis_id?: string;
      };
      if (!res.ok) {
        throw new Error(json.error || "Falha ao gerar análise.");
      }

      // Observabilidade (DevTools → Console): quem gerou a análise
      console.info("[CareerTwin análise]", {
        analysis_id: json.analysis_id ?? analysis.id,
        provider: json.provider,
        usedFallback: json.usedFallback,
        overall_score: json.overall_score,
        warning: json.warning,
      });
      if (json.usedFallback) {
        console.warn(
          "[CareerTwin] Fallback mock ativo — Grok/OpenAI falhou ou JSON inválido.",
          json.warning
        );
      }

      router.push(`/analise/${analysis.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setStep(6);
    } finally {
      setLoading(false);
    }
  }, [
    resumeText,
    resumeFile,
    linkedinText,
    linkedinFile,
    linkedinUrl,
    targetRole,
    targetArea,
    targetSeniority,
    wantsSuggestions,
    includeJob,
    jobText,
    jobFile,
    jobUrl,
    jobTitle,
    jobCompany,
    compFiles,
    reanaliseId,
    router,
  ]);

  async function onResumeFile(file: File | null) {
    setResumeFile(file);
    setResumeExtractInfo(null);
    if (!file) return;
    setExtracting(true);
    try {
      const { text, info } = await readTextFromFile(file);
      if (text) {
        setResumeText((prev) => (prev.trim().length >= text.length ? prev : text));
      }
      setResumeExtractInfo(info || null);
    } finally {
      setExtracting(false);
    }
  }

  async function onLinkedinFile(file: File | null) {
    setLinkedinFile(file);
    setLinkedinExtractInfo(null);
    if (!file) return;
    setExtracting(true);
    try {
      const { text, info } = await readTextFromFile(file);
      if (text) {
        setLinkedinText((prev) => (prev.trim().length >= text.length ? prev : text));
      }
      setLinkedinExtractInfo(info || null);
    } finally {
      setExtracting(false);
    }
  }

  async function onCompFiles(files: FileList | null) {
    if (!files?.length) return;
    setExtracting(true);
    try {
      const next: CompFile[] = [];
      for (const file of Array.from(files)) {
        const { text } = await readTextFromFile(file);
        next.push({ name: file.name, type: file.type, text });
      }
      setCompFiles((prev) => [...prev, ...next]);
    } finally {
      setExtracting(false);
    }
  }

  function canNext(): boolean {
    // Avançar na etapa: arquivo/link ok, mas o envio final exige texto (ver submit)
    if (step === 1) return Boolean(resumeText.trim().length >= 40 || resumeFile);
    if (step === 2)
      return Boolean(
        linkedinText.trim().length >= 40 ||
          linkedinUrl ||
          linkedinFile ||
          resumeText.trim().length >= 80
      );
    if (step === 3) return wantsSuggestions || Boolean(targetRole.trim());
    return true;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-muted">
          <span>
            Etapa {step + 1} de {STEPS.length}: {STEPS[step]}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {error && (
        <Alert tone="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {step === 0 && (
        <Card className="animate-fade-up">
          <h1 className="font-display text-2xl sm:text-3xl text-foreground">
            Vamos analisar seu posicionamento profissional
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Envie seus materiais para receber recomendações personalizadas sobre currículo,
            LinkedIn, aderência a vagas e plano de evolução.
          </p>
          {reanaliseId && (
            <Alert tone="info" className="mt-4">
              Você está em uma reanálise. Os campos de cargo foram pré-preenchidos — atualize
              currículo e LinkedIn se mudou algo.
            </Alert>
          )}
          <div className="mt-8">
            <Button size="lg" onClick={() => setStep(1)}>
              Começar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card className="animate-fade-up space-y-4">
          <h2 className="font-display text-2xl">Currículo</h2>
          <Alert tone="info" className="!mt-0">
            <strong>PDF e DOCX com texto</strong> são lidos automaticamente e preenchem o campo
            abaixo. PDF <em>escaneado</em> (só imagem) ainda precisa colar o texto — não fazemos
            OCR. Link do LinkedIn sozinho continua sem leitura.
          </Alert>
          <p className="text-sm text-muted">
            Formatos: PDF, DOCX, TXT (e .doc antigo: cole o texto). Você pode revisar o texto
            extraído antes de continuar.
          </p>
          {extracting && (
            <p className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Extraindo texto do arquivo…
            </p>
          )}
          <div>
            <Label>Upload do currículo</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-card-border bg-muted-bg/50 px-4 py-8 hover:bg-muted-bg">
              <FileUp className="h-6 w-6 text-primary" />
              <span className="text-sm text-muted">
                {resumeFile ? resumeFile.name : "Clique para selecionar arquivo"}
              </span>
              <input
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => onResumeFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          {resumeExtractInfo && (
            <Alert tone={resumeText.length >= 80 ? "info" : "warning"}>{resumeExtractInfo}</Alert>
          )}
          <div>
            <Label htmlFor="resumeText">Texto do currículo (extraído ou colado)</Label>
            <Textarea
              id="resumeText"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Cole aqui o conteúdo do seu currículo ou envie um PDF/DOCX acima…"
              className="min-h-[180px]"
            />
            {resumeText.trim().length > 0 && (
              <p className="mt-1 text-xs text-muted">{resumeText.trim().length} caracteres</p>
            )}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="animate-fade-up space-y-4">
          <h2 className="font-display text-2xl">LinkedIn</h2>
          <Alert tone="warning" className="!mt-0">
            <strong>Só o link não analisa o perfil.</strong> Envie PDF exportado do perfil (com
            texto) ou cole Sobre + Experiências. Sem scraping automático da URL.
          </Alert>
          <p className="text-sm text-muted">
            O link fica só como referência. O conteúdo da análise vem do texto extraído/colado.
          </p>
          {extracting && (
            <p className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Extraindo texto do arquivo…
            </p>
          )}
          <div>
            <Label htmlFor="liUrl">Link público do LinkedIn</Label>
            <Input
              id="liUrl"
              type="url"
              placeholder="https://www.linkedin.com/in/seu-perfil"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>Upload de PDF/DOCX exportado</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-card-border bg-muted-bg/50 px-4 py-6 hover:bg-muted-bg">
              <FileUp className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted">
                {linkedinFile ? linkedinFile.name : "Selecionar PDF/DOCX/TXT"}
              </span>
              <input
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => onLinkedinFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          {linkedinExtractInfo && (
            <Alert tone={linkedinText.length >= 80 ? "info" : "warning"}>
              {linkedinExtractInfo}
            </Alert>
          )}
          <div>
            <Label htmlFor="liText">Texto do perfil (extraído ou colado)</Label>
            <Textarea
              id="liText"
              value={linkedinText}
              onChange={(e) => setLinkedinText(e.target.value)}
              placeholder="Cole headline, sobre, experiências…"
              className="min-h-[160px]"
            />
            {linkedinText.trim().length > 0 && (
              <p className="mt-1 text-xs text-muted">{linkedinText.trim().length} caracteres</p>
            )}
          </div>
          <Alert tone="info">
            Se o PDF for só imagem (escaneado), a extração falha — aí cole o texto à mão.
          </Alert>
        </Card>
      )}

      {step === 3 && (
        <Card className="animate-fade-up space-y-4">
          <h2 className="font-display text-2xl">Cargo-alvo</h2>
          <label className="flex items-start gap-3 rounded-xl border border-card-border bg-muted-bg/40 p-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={wantsSuggestions}
              onChange={(e) => setWantsSuggestions(e.target.checked)}
            />
            <span className="text-sm">
              <strong className="text-foreground">Não sei qual cargo buscar.</strong>
              <span className="text-muted"> Quero receber sugestões.</span>
            </span>
          </label>
          {!wantsSuggestions && (
            <div>
              <Label htmlFor="role">Cargo-alvo desejado</Label>
              <Input
                id="role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Ex.: Assistente Administrativo"
              />
            </div>
          )}
          <div>
            <Label htmlFor="area">Área de interesse</Label>
            <select
              id="area"
              className="w-full h-11 rounded-xl border border-card-border bg-card px-3.5 text-sm"
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
            >
              {AREA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="seniority">Senioridade desejada</Label>
            <select
              id="seniority"
              className="w-full h-11 rounded-xl border border-card-border bg-card px-3.5 text-sm"
              value={targetSeniority}
              onChange={(e) => setTargetSeniority(e.target.value)}
            >
              {SENIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="animate-fade-up space-y-4">
          <h2 className="font-display text-2xl">Vaga específica (opcional)</h2>
          <p className="text-sm text-muted">
            Se tiver uma vaga em mente, adicione para receber diagnóstico de aderência e
            recomendação de aplicação.
          </p>
          {!includeJob ? (
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIncludeJob(true)}>Adicionar vaga</Button>
              <Button variant="outline" onClick={() => setStep(5)}>
                <SkipForward className="h-4 w-4" />
                Pular por enquanto
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="jobTitle">Nome da vaga</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Ex.: Analista de Operações"
                  />
                </div>
                <div>
                  <Label htmlFor="jobCompany">Empresa</Label>
                  <Input
                    id="jobCompany"
                    value={jobCompany}
                    onChange={(e) => setJobCompany(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="jobUrl">Link da vaga</Label>
                <Input
                  id="jobUrl"
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div>
                <Label>Arquivo da vaga (PDF/DOC/TXT)</Label>
                <input
                  type="file"
                  accept={ACCEPT}
                  className="block w-full text-sm text-muted"
                  onChange={async (e) => {
                    const f = e.target.files?.[0] || null;
                    setJobFile(f);
                    if (f) {
                      setExtracting(true);
                      try {
                        const { text } = await readTextFromFile(f);
                        if (text) setJobText((p) => (p.trim().length >= text.length ? p : text));
                      } finally {
                        setExtracting(false);
                      }
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="jobText">Texto colado da vaga</Label>
                <Textarea
                  id="jobText"
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Cole a descrição da vaga…"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIncludeJob(false)}>
                Remover vaga
              </Button>
            </>
          )}
        </Card>
      )}

      {step === 5 && (
        <Card className="animate-fade-up space-y-4">
          <h2 className="font-display text-2xl">Arquivos complementares (opcional)</h2>
          <p className="text-sm text-muted">
            Certificados, cartas de recomendação, projetos, apresentações, evidências de
            resultado, produções acadêmicas ou outros documentos.
          </p>
          <input
            type="file"
            multiple
            accept={ACCEPT}
            className="block w-full text-sm"
            onChange={(e) => onCompFiles(e.target.files)}
          />
          {compFiles.length > 0 && (
            <ul className="space-y-2 text-sm">
              {compFiles.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-muted-bg px-3 py-2"
                >
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    className="text-danger text-xs"
                    onClick={() => setCompFiles((prev) => prev.filter((_, j) => j !== i))}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Alert tone="info">
            Arquivos não-TXT são armazenados; apenas texto colado ou .txt entra no conteúdo da
            análise.
          </Alert>
        </Card>
      )}

      {step === 6 && (
        <Card className="animate-fade-up space-y-4">
          <h2 className="font-display text-2xl">Revisão</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-card-border pb-2">
              <dt className="text-muted">Currículo</dt>
              <dd className="font-medium text-right">
                {resumeFile?.name || (resumeText ? "Texto colado" : "Não enviado")}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-card-border pb-2">
              <dt className="text-muted">LinkedIn</dt>
              <dd className="font-medium text-right max-w-[60%] truncate">
                {linkedinUrl || linkedinFile?.name || (linkedinText ? "Texto colado" : "Não enviado")}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-card-border pb-2">
              <dt className="text-muted">Cargo-alvo</dt>
              <dd className="font-medium text-right">
                {wantsSuggestions ? "Sugestões solicitadas" : targetRole || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-card-border pb-2">
              <dt className="text-muted">Área / senioridade</dt>
              <dd className="font-medium text-right">
                {targetArea} · {targetSeniority}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-card-border pb-2">
              <dt className="text-muted">Vaga específica</dt>
              <dd className="font-medium text-right">
                {includeJob
                  ? [jobTitle, jobCompany].filter(Boolean).join(" — ") || "Sim"
                  : "Não"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Complementares</dt>
              <dd className="font-medium text-right">
                {compFiles.length ? `${compFiles.length} arquivo(s)` : "Nenhum"}
              </dd>
            </div>
          </dl>
          <Button size="lg" className="w-full" onClick={generate} disabled={loading}>
            {loading ? "Gerando…" : "Gerar análise"}
          </Button>
        </Card>
      )}

      {step === 7 && (
        <Card className="animate-fade-up py-16 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-6 font-display text-xl text-foreground animate-pulse-soft">
            {LOADING_MSGS[loadingMsgIdx]}
          </p>
          <p className="mt-2 text-sm text-muted">Isso pode levar alguns segundos…</p>
        </Card>
      )}

      {step > 0 && step < 7 && (
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          {step < 6 && (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
