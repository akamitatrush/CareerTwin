import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fitLevelFromScore(score: number): string {
  if (score >= 85) return "Alta aderência";
  if (score >= 65) return "Boa aderência";
  if (score >= 40) return "Aderência parcial";
  return "Baixa aderência";
}

export function confidenceFromMaterials(input: {
  hasResume: boolean;
  hasLinkedin: boolean;
  hasTargetRole: boolean;
  hasJob: boolean;
}): "alta" | "media" | "baixa" {
  const core = [input.hasResume, input.hasLinkedin, input.hasTargetRole].filter(Boolean).length;
  if (core >= 3) return "alta";
  if (core === 2) return "media";
  return "baixa";
}

export function formatDateBR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
