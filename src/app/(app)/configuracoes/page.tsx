"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Alert, Button, Card, Input, Label, PageShell } from "@/components/ui";

export default function ConfiguracoesPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        setEmail(user.email || "");
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (profile) {
          setFullName(profile.full_name || "");
          setCurrentRole(profile.current_role || "");
          setTargetRole(profile.target_role || "");
        } else {
          setFullName((user.user_metadata?.full_name as string) || "");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado.");

      const { error: upErr } = await supabase.from("user_profiles").upsert(
        {
          user_id: user.id,
          full_name: fullName,
          email: user.email,
          current_role: currentRole || null,
          target_role: targetRole || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (upErr) throw upErr;

      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      setMessage("Perfil atualizado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageShell>
        <p className="text-muted">Carregando configurações…</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-xl">
        <h1 className="font-display text-3xl text-foreground">Configurações</h1>
        <p className="mt-2 text-muted">Dados simples do seu perfil profissional.</p>

        <Card className="mt-8">
          <form onSubmit={onSave} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={email} disabled className="opacity-70" />
              <p className="mt-1 text-xs text-muted">
                O e-mail é gerenciado pela autenticação e não pode ser alterado aqui.
              </p>
            </div>
            <div>
              <Label htmlFor="currentRole">Cargo atual (opcional)</Label>
              <Input
                id="currentRole"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="Ex.: Assistente administrativo"
              />
            </div>
            <div>
              <Label htmlFor="targetRole">Cargo-alvo (opcional)</Label>
              <Input
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Ex.: Analista de operações"
              />
            </div>

            {message && <Alert tone="success">{message}</Alert>}
            {error && <Alert tone="danger">{error}</Alert>}

            <Button type="submit" disabled={saving}>
              {saving ? "Salvando…" : "Salvar alterações"}
            </Button>
          </form>
        </Card>

        <Card className="mt-6">
          <h2 className="font-semibold">Privacidade</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Suas análises e arquivos são protegidos por Row Level Security: apenas você acessa
            seus registros. Arquivos ficam em bucket privado, na pasta do seu usuário. Não
            compartilhamos seus materiais com terceiros no MVP.
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
