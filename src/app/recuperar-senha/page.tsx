"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Alert, Button, Card, Input, Label } from "@/components/ui";
import { Compass } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase não configurado. Configure .env.local e o SMTP do projeto para envio de e-mails."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/callback?next=/configuracoes`,
      });

      if (resetError) {
        // SMTP ausente ou rate limit — mensagem clara
        setError(
          resetError.message.includes("Error sending") || resetError.message.includes("smtp")
            ? "Não foi possível enviar o e-mail. Verifique se o SMTP está configurado no painel do Supabase (Authentication → Emails)."
            : resetError.message
        );
        return;
      }

      setInfo(
        "Se existir uma conta com este e-mail, enviamos um link de recuperação. Se o e-mail não chegar, confira spam e a configuração de SMTP do Supabase."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Falha ao solicitar recuperação. O envio de e-mail exige SMTP configurado no Supabase."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 font-display text-xl text-primary">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <Compass className="h-5 w-5" />
        </span>
        TwinJobs
      </Link>

      <Card className="w-full max-w-md">
        <h1 className="font-display text-2xl text-foreground">Recuperar senha</h1>
        <p className="mt-1 text-sm text-muted">
          Enviaremos um link para redefinir sua senha. O envio depende do SMTP configurado no
          Supabase.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          {error && <Alert tone="danger">{error}</Alert>}
          {info && <Alert tone="success">{info}</Alert>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando…" : "Enviar link"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </Card>
    </div>
  );
}
