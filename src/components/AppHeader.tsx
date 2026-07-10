"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Compass, LogOut, Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-card-border/80 bg-[rgb(247_244_239_/_0.9)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Compass className="h-5 w-5" />
          </span>
          TwinJobs
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:text-foreground hover:bg-muted-bg"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {fullName && (
            <span className="text-sm text-muted max-w-[140px] truncate">{fullName}</span>
          )}
          <Button variant="ghost" size="sm" onClick={logout} disabled={loading}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted-bg"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-card-border bg-card px-4 py-3 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium",
                pathname.startsWith(item.href)
                  ? "bg-primary-soft text-primary"
                  : "text-foreground hover:bg-muted-bg"
              )}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-red-50"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-card-border/60 bg-[rgb(247_244_239_/_0.88)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Compass className="h-5 w-5" />
          </span>
          TwinJobs
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button size="sm">Começar</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
