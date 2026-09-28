import type { FieldCodeCount, FieldDistribution } from "@/lib/analysis";
import { NO_PRACTICE } from "@/lib/paper-analysis";
import type { CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { CopyCitations } from "./copy-citations";
import { citationClipboard } from "@/lib/analysis-citations";
import distributionStyles from "./distribution-charts.module.css";

const CATEGORY_ACCENT_VARS: Record<string, string> = {
  "A User & Context": "var(--color-cat-a)",
  "B RAG Mechanism & Knowledge Representation": "var(--color-cat-b)",
  "C Transparency Design": "var(--color-cat-c)",
  "D User Control Design": "var(--color-cat-d)",
  "E Paper Metadata": "var(--color-cat-e)",
  "F Evaluation": "var(--color-cat-f)",
};

export function CategoryDistribution({
  category,
  fields,
  paperCount,
}: {
  category: string;
  fields: FieldDistribution[];
  paperCount: number;
}) {
  const accentColor = CATEGORY_ACCENT_VARS[category] ?? "var(--color-accent)";
  return (
    <section className="rounded-lg border border-line bg-surface shadow-xs overflow-hidden">
      <header className="flex items-center justify-between gap-4 px-5 py-3 border-b border-line bg-surface-soft">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-8 rounded-full" style={{ background: accentColor }} />
          <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">{category}</h2>
        </div>
        <span className="text-[11.5px] font-semibold text-muted">{fields.length} fields</span>
      </header>
      <div className="divide-y divide-line">
        {fields.map((field) => (
          <DistributionRow key={field.key} field={field} paperCount={paperCount} accent={accentColor} />
        ))}
      </div>
    </section>
  );
}

function DistributionRow({
  field,
  paperCount,
  accent,
}: {
  field: FieldDistribution;
  paperCount: number;
  accent: string;
}) {
  const counts = field.counts;
  return (
    <div className={distributionStyles.field} style={{ "--distribution-accent": accent } as CSSProperties}>
      <header className={distributionStyles.fieldHeader}>
        <h3 className="text-[14px] font-bold leading-snug text-ink">{field.label}</h3>
      </header>
      <figure className="m-0" aria-label={`${field.label}: share of ${paperCount} completed papers`}>
        <figcaption className="sr-only">Category bars share a zero-to-100% scale across all {paperCount} completed papers. Select a row to expand its details.</figcaption>
        <div className={`${distributionStyles.row} ${distributionStyles.axisRow}`} aria-hidden="true">
          <span>Category</span>
          <div className={distributionStyles.axis}>
            {[0, 25, 50, 75, 100].map((tick) => <span key={tick} style={{ left: `${tick}%` }}>{tick}%</span>)}
          </div>
          <span className={distributionStyles.count}>Papers</span>
          <span className={distributionStyles.percent} title={`Share of all ${paperCount} included papers`}>Share</span>
          <span />
        </div>
        {counts.length ? counts.map((item) => (
          <details key={item.label} className={`group/parent ${distributionStyles.parent}`}>
            <summary className={distributionStyles.row}>
              <span className={distributionStyles.label}>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted group-open/parent:rotate-90" aria-hidden="true" />
                <span title={item.label === NO_PRACTICE ? "Explicit non-use or unreported information, excluding papers with any specific practice in this field." : item.label}>{item.label}</span>
                <span className="sr-only">Paper details</span>
              </span>
              <DistributionBar value={item.value} paperCount={paperCount} />
              <span className={distributionStyles.count}>{item.value}<span className="sr-only"> papers</span></span>
              <span className={distributionStyles.percent}>{item.percent}%</span>
              <CopyCitations label={item.label} {...citationClipboard(item.papers.map((paper) => paper.citation))} />
            </summary>
            <AnalysisPaperList papers={item.papers} />
          </details>
        )) : (
          <p className="text-sm text-muted">No coded values.</p>
        )}
      </figure>
    </div>
  );
}

function DistributionBar({ value, paperCount }: { value: number; paperCount: number }) {
  return (
    <span className={distributionStyles.plot} aria-hidden="true">
      <span className={distributionStyles.bar} style={{ width: `${value / Math.max(1, paperCount) * 100}%` }} />
    </span>
  );
}

function AnalysisPaperList({ papers }: { papers: FieldCodeCount["papers"] }) {
  return (
    <div className="mx-2 mb-3 overflow-hidden rounded-md border border-line bg-surface">
      <div className="grid grid-cols-[minmax(0,1fr)_64px] gap-3 border-b border-line bg-surface-soft px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted">
        <span>Papers</span><span className="text-right">Year</span>
      </div>
      {papers.map((paper) => (
        <div key={paper.id} className="grid grid-cols-[minmax(0,1fr)_64px] gap-3 border-b border-line/70 px-3 py-2 last:border-b-0">
          <div className="min-w-0">
            <p className="truncate text-[11.5px] font-semibold text-ink" title={paper.title}>{paper.title}</p>
            <p className="mt-0.5 truncate font-mono text-[9.5px] text-muted-soft" title={paper.doi ?? paper.id}>{paper.doi ? `DOI ${paper.doi}` : paper.id}</p>
            <p className="mt-0.5 break-all font-mono text-[9.5px] text-muted">{paper.citation.key}{paper.citation.provisional ? " · provisional" : ""}</p>
          </div>
          <span className="text-right font-mono text-[10.5px] font-semibold text-muted">{paper.year}</span>
        </div>
      ))}
    </div>
  );
}
