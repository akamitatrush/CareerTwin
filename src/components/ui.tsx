import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
} from "lucide-react";

/* ─────────────────────────────────────────────
   BUTTON
───────────────────────────────────────────── */

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold tracking-[-0.01em]",
    "transition-all duration-200 ease-out",
    "cursor-pointer select-none",
    "disabled:opacity-45 disabled:pointer-events-none disabled:shadow-none",
    "active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-b from-[#ff6b38] to-primary text-white",
          "shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_4px_14px_rgba(255,89,34,0.35)]",
          "hover:from-[#ff7a4d] hover:to-primary-hover hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_6px_20px_rgba(255,89,34,0.4)]",
        ].join(" "),
        secondary: [
          "bg-primary-soft text-[color:var(--brand-hover)]",
          "border border-orange-200/80",
          "hover:bg-[#ffd9cc] hover:border-orange-300",
        ].join(" "),
        ghost: "bg-transparent text-foreground hover:bg-muted-bg text-neutral-700",
        outline: [
          "border border-card-border bg-card text-foreground",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
          "hover:bg-muted-bg hover:border-neutral-300 dark:hover:border-white/20",
        ].join(" "),
        danger: [
          "bg-danger text-white",
          "shadow-[0_4px_12px_rgba(220,38,38,0.25)]",
          "hover:opacity-90",
        ].join(" "),
        dark: [
          "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
          "shadow-[0_4px_14px_rgba(0,0,0,0.2)]",
          "hover:bg-neutral-800 dark:hover:bg-neutral-100",
        ].join(" "),
        white: [
          "bg-white text-neutral-900 dark:bg-card dark:text-foreground",
          "shadow-[0_4px_16px_rgba(0,0,0,0.1)]",
          "hover:bg-neutral-50 dark:hover:bg-muted-bg",
        ].join(" "),
        "on-dark": [
          "border border-white/25 bg-white/5 text-white backdrop-blur-sm",
          "hover:bg-white hover:text-neutral-900 hover:border-white",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-3.5 text-[13px] rounded-lg gap-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5",
        md: "h-11 px-5 text-sm rounded-xl [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-12 px-7 text-[15px] rounded-xl [&_svg]:h-4.5 [&_svg]:w-4.5",
        icon: "h-10 w-10 rounded-xl p-0 [&_svg]:h-4 [&_svg]:w-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({
  className,
  variant,
  size,
  loading,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   FIELD / INPUT / TEXTAREA / LABEL
───────────────────────────────────────────── */

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[13px] font-semibold tracking-[-0.01em] text-foreground/80",
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
        "w-full h-11 rounded-xl border border-card-border bg-card px-3.5 text-sm text-foreground",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
        "transition-[border-color,box-shadow,background] duration-200",
        "hover:border-neutral-300 dark:hover:border-white/20",
        "focus:border-primary focus:bg-card focus:outline-none focus:ring-[3px] focus:ring-primary/15",
        "disabled:cursor-not-allowed disabled:bg-muted-bg disabled:opacity-70",
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
        "w-full min-h-[120px] rounded-xl border border-card-border bg-card px-3.5 py-3 text-sm text-foreground resize-y",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
        "transition-[border-color,box-shadow,background] duration-200",
        "hover:border-neutral-300 dark:hover:border-white/20",
        "focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15",
        "disabled:cursor-not-allowed disabled:bg-muted-bg disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="text-xs font-medium text-danger flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CARD
───────────────────────────────────────────── */

const cardVariants = cva(
  "rounded-2xl border bg-card text-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-card-border shadow-[var(--shadow)]",
        elevated:
          "border-card-border shadow-[0_8px_30px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]",
        soft: "border-transparent bg-muted-bg/80 shadow-none",
        outline: "border-card-border shadow-none",
        interactive: [
          "border-card-border shadow-[var(--shadow)] cursor-pointer",
          "hover:border-orange-200 hover:shadow-[0_12px_32px_rgba(255,89,34,0.08),0_0_0_1px_rgba(255,89,34,0.08)]",
          "hover:-translate-y-0.5",
        ].join(" "),
        brand:
          "border-orange-100 bg-gradient-to-br from-white to-primary-soft/50 shadow-[var(--shadow)] dark:border-orange-500/20 dark:from-card dark:to-primary-soft/40",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-5 sm:p-6",
        lg: "p-6 sm:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export function Card({
  className,
  variant,
  padding,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
  );
}

export function CardHeader({
  className,
  title,
  description,
  action,
}: {
  className?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BADGE
───────────────────────────────────────────── */

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "primary" | "accent" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral:
      "bg-muted-bg text-foreground/80 border-card-border",
    primary:
      "bg-primary-soft text-[color:var(--brand-hover)] border-orange-200/90 dark:border-orange-500/30 dark:text-[#ffb39a]",
    accent: "bg-foreground text-background border-foreground",
    success:
      "bg-emerald-50 text-emerald-800 border-emerald-200/90 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    warning:
      "bg-amber-50 text-amber-900 border-amber-200/90 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/30",
    danger:
      "bg-red-50 text-red-800 border-red-200/90 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5",
        "text-[11px] font-semibold tracking-[-0.01em] leading-5",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────
   ALERT
───────────────────────────────────────────── */

export function Alert({
  children,
  tone = "info",
  className,
  title,
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "success" | "danger";
  className?: string;
  title?: string;
}) {
  const config = {
    info: {
      wrap: "bg-primary-soft border-orange-200 text-[color:var(--brand-hover)] dark:border-orange-500/30 dark:text-[#ffc4b0]",
      icon: Info,
    },
    warning: {
      wrap: "bg-amber-50 border-amber-200 text-amber-950 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-100",
      icon: AlertTriangle,
    },
    success: {
      wrap: "bg-emerald-50 border-emerald-200 text-emerald-950 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-100",
      icon: CheckCircle2,
    },
    danger: {
      wrap: "bg-red-50 border-red-200 text-red-950 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-100",
      icon: AlertCircle,
    },
  }[tone];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed",
        config.wrap,
        className
      )}
      role="alert"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-90" />
      <div className="min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="opacity-95">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS / SCORE
───────────────────────────────────────────── */

export function ProgressBar({
  value,
  className,
  showLabel,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-muted">
          <span>Progresso</span>
          <span className="tabular-nums text-foreground">{v}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted-bg">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-[#ff8f66] transition-all duration-500 ease-out"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
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
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const offset = c * (1 - pct);
  const color =
    score >= 85
      ? "var(--success)"
      : score >= 65
        ? "var(--brand)"
        : score >= 40
          ? "var(--warning)"
          : "var(--danger)";

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
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums tracking-tight text-foreground">
          {score}
        </span>
        {label && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT / EMPTY / SKELETON / SEPARATOR
───────────────────────────────────────────── */

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-[2rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Card
      variant="outline"
      padding="lg"
      className="border-dashed text-center py-14 sm:py-16"
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-inner">
        {icon ?? <span className="text-xl font-bold opacity-60">∅</span>}
      </div>
      <h3 className="font-display text-2xl text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted">
        {description}
      </p>
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </Card>
  );
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-card-border", className)} />;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-muted-bg via-neutral-200/60 to-muted-bg bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/[0.06]" />
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}

export { buttonVariants, cardVariants };
