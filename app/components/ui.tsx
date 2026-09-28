import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-6 pb-5 border-b border-line flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-3">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="m-0 mb-1.5 text-[10.5px] font-bold text-accent uppercase tracking-[0.12em]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[clamp(26px,3.2vw,36px)] font-bold tracking-[-0.022em] leading-[1.1] mt-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted leading-relaxed mt-2 max-w-[640px]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 flex-wrap items-center">{actions}</div>}
    </header>
  );
}

export function Card({
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-surface border border-line rounded-lg p-5 shadow-xs", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-line">
          <div>
            {title && (
              <h3 className="text-[15px] font-[680] tracking-[-0.008em] text-ink">{title}</h3>
            )}
            {subtitle && (
              <p className="text-[13px] text-muted mt-1 leading-relaxed">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex gap-2 flex-wrap shrink-0">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyStage({ title, description }: { title: string; description: string }) {
  return <section className="py-16 text-center"><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 text-muted">{description}</p></section>;
}

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-[1440px] px-4 py-6 sm:px-7", className)}>{children}</div>;
}

export function SupplementaryHeader({ title }: { title: string }) {
  return <header className="mb-6 border-b border-line pb-5">
    <p className="text-xs font-semibold uppercase tracking-widest text-accent">Supplementary material</p>
    <h1 className="mt-2 text-2xl font-bold">{title}</h1>
  </header>;
}

export function SectionHeading({ title }: { title: string }) {
  return <header className="border-b border-line pb-3">
    <h2 className="text-[18px] font-bold tracking-[-0.015em] text-ink">{title}</h2>
  </header>;
}

export function BrowserLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return <div className="grid items-start gap-6 min-[801px]:grid-cols-[320px_minmax(0,1fr)]">{sidebar}{children}</div>;
}

export function BrowserSidebar({ label, children }: { label: string; children: ReactNode }) {
  return <aside aria-label={label} className="min-w-0 rounded-lg border border-line bg-surface p-4 min-[801px]:sticky min-[801px]:top-4">{children}</aside>;
}
