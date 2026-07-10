import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-sm disabled:opacity-50",
    secondary:
      "bg-primary-soft text-primary hover:bg-[#d4e8de] disabled:opacity-50",
    ghost: "bg-transparent text-foreground hover:bg-muted-bg disabled:opacity-50",
    outline:
      "border border-card-border bg-card text-foreground hover:bg-muted-bg disabled:opacity-50",
    danger: "bg-danger text-white hover:opacity-90 disabled:opacity-50",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm rounded-lg",
    md: "h-11 px-4 text-sm rounded-xl",
    lg: "h-12 px-6 text-base rounded-xl",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-11 rounded-xl border border-card-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted/80 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[120px] rounded-xl border border-card-border bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted/80 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition resize-y",
        className
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-foreground mb-1.5", className)}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-card-border bg-card p-5 shadow-[var(--shadow)]",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "primary" | "accent" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-muted-bg text-muted",
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent",
    success: "bg-emerald-50 text-success",
    warning: "bg-amber-50 text-warning",
    danger: "bg-red-50 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="text-center py-12 px-6">
      <h3 className="font-display text-xl text-foreground mb-2">{title}</h3>
      <p className="text-muted max-w-md mx-auto mb-6 leading-relaxed">{description}</p>
      {action}
    </Card>
  );
}

export function ScoreRing({
  score,
  size = 88,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const offset = c * (1 - pct);
  const color =
    score >= 85 ? "var(--success)" : score >= 65 ? "var(--primary)" : score >= 40 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted-bg)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold tabular-nums text-foreground">{score}</span>
        {label && (
          <span className="text-[10px] text-muted uppercase tracking-wide">{label}</span>
        )}
      </div>
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full rounded-full bg-muted-bg overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Alert({
  children,
  tone = "info",
  className,
}: {
  children: React.ReactNode;
  tone?: "info" | "warning" | "success" | "danger";
  className?: string;
}) {
  const tones = {
    info: "bg-primary-soft border-primary/20 text-primary",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    danger: "bg-red-50 border-red-200 text-red-900",
  };
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm leading-relaxed", tones[tone], className)}>
      {children}
    </div>
  );
}
