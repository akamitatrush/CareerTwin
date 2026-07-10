/**
 * Extrai texto de arquivos no navegador (wizard).
 * - TXT: leitura direta
 * - PDF: unpdf (texto embutido; PDF escaneado/imagem não tem OCR)
 * - DOCX: mammoth
 * - DOC antigo (.doc binário): não suportado de forma confiável
 */

function isPdf(file: File): boolean {
  const n = file.name.toLowerCase();
  return file.type === "application/pdf" || n.endsWith(".pdf");
}

function isDocx(file: File): boolean {
  const n = file.name.toLowerCase();
  return (
    n.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

function isTxt(file: File): boolean {
  const n = file.name.toLowerCase();
  return file.type === "text/plain" || n.endsWith(".txt");
}

function isLegacyDoc(file: File): boolean {
  const n = file.name.toLowerCase();
  return n.endsWith(".doc") && !n.endsWith(".docx");
}

function cleanExtracted(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPdf(file: File): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocumentProxy(data);
  const result = await extractText(pdf, { mergePages: true });
  // unpdf pode retornar string ou string[]
  const raw = result.text;
  const text = Array.isArray(raw) ? raw.join("\n\n") : String(raw || "");
  return cleanExtracted(text);
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return cleanExtracted(value || "");
}

export type ExtractResult = {
  text: string;
  method: "txt" | "pdf" | "docx" | "none";
  warning?: string;
};

export async function extractDocumentText(file: File): Promise<ExtractResult> {
  try {
    if (isTxt(file)) {
      const text = cleanExtracted(await file.text());
      return {
        text,
        method: "txt",
        warning: text.length < 40 ? "Arquivo de texto muito curto ou vazio." : undefined,
      };
    }

    if (isPdf(file)) {
      const text = await extractPdf(file);
      if (text.length < 40) {
        return {
          text,
          method: "pdf",
          warning:
            "Pouco texto extraído do PDF. Se for PDF escaneado (imagem), cole o texto manualmente — ainda não fazemos OCR.",
        };
      }
      return { text, method: "pdf" };
    }

    if (isDocx(file)) {
      const text = await extractDocx(file);
      if (text.length < 40) {
        return {
          text,
          method: "docx",
          warning: "Pouco texto extraído do DOCX. Tente colar o conteúdo manualmente.",
        };
      }
      return { text, method: "docx" };
    }

    if (isLegacyDoc(file)) {
      return {
        text: "",
        method: "none",
        warning:
          "Arquivo .doc (Word antigo) não é lido automaticamente. Salve como PDF/DOCX ou cole o texto.",
      };
    }

    return {
      text: "",
      method: "none",
      warning: "Formato não suportado para extração automática. Cole o texto no campo.",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "erro desconhecido";
    return {
      text: "",
      method: "none",
      warning: `Não foi possível ler o arquivo (${msg}). Cole o texto manualmente.`,
    };
  }
}
