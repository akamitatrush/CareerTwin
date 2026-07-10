"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analise/nova", label: "Nova análise" },
  { href: "/planos", label: "Planos" },
  { href: "/configuracoes", label: "Configurações" },
];

export function AppHeader({ fullName }: { fullName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-card-border/90 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href="/dashboard" size="sm" priority />

        <nav className="hidden md:flex items-center gap-0.5 rounded-full bg-muted-bg p-1 ring-1 ring-card-border">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all",
                pathname.startsWith(item.href)
                  ? "bg-white text-foreground shadow-sm ring-1 ring-card-border"
                  : "text-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {fullName && (
            <span className="text-sm text-muted max-w-[140px] truncate font-medium">
              {fullName}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={logout} disabled={loading}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-xl hover:bg-muted-bg"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-card-border bg-white px-4 py-3 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-xl px-3 py-2.5 text-sm font-medium",
                pathname.startsWith(item.href)
                  ? "bg-primary-soft text-[color:var(--brand-hover)]"
                  : "text-foreground hover:bg-muted-bg"
              )}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium text-danger hover:bg-red-50"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}

/** Header marketing: só ações (logo fica grande no hero) */
export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-card-border/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-end gap-2 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="font-semibold">
            Entrar
          </Button>
        </Link>
        <Link href="/cadastro">
          <Button size="sm">Começar grátis</Button>
        </Link>
      </div>
    </header>
  );
}
