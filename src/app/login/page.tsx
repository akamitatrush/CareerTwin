"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Alert, Button, Card, Input, Label } from "@/components/ui";
import { Compass } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase não configurado. Copie .env.example para .env.local e preencha as chaves do projeto."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(
          signError.message.includes("Invalid login")
            ? "E-mail ou senha incorretos."
            : signError.message
        );
        return;
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
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
        <h1 className="font-display text-2xl text-foreground">Entrar</h1>
        <p className="mt-1 text-sm text-muted">Acesse seu dashboard e suas análises.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <Alert tone="danger">{error}</Alert>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-center text-sm text-muted">
          <Link href="/recuperar-senha" className="text-primary hover:underline">
            Esqueci minha senha
          </Link>
          <p>
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-medium text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Carregando…</div>}>
      <LoginForm />
    </Suspense>
  );
}
