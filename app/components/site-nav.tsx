"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const path = usePathname();
  return (
    <nav aria-label="Site navigation" className="border-b border-line bg-surface">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-7">
        <span className="text-sm font-bold tracking-tight text-ink sm:text-base">From Rags to Riches<span className="text-accent">.</span></span>
        <div className="flex gap-1 rounded-lg border border-line bg-surface-sunken/60 p-1">
          {[["/analysis/", "Analysis"], ["/coding/", "Paper coding"], ["/codebook/", "Codebook"]].map(([href, label]) => (
            <Link key={href} href={href}
              aria-current={path.replace(/\/$/, "") === href.replace(/\/$/, "") ? "page" : undefined}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[current=page]:bg-surface aria-[current=page]:text-accent aria-[current=page]:shadow-xs sm:px-5">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
