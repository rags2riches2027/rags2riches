import type { Field } from "@/lib/codebook";
import { Highlight } from "./highlight";

export function CodebookField({ field, query = "" }: { field: Field; query?: string }) {
  return <section id={field.code} className="scroll-mt-4 py-6">
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-xl font-bold"><span className="mr-2 text-muted">{field.code}</span><Highlight text={field.name} query={query} /></h2>
      <span className="rounded border border-line bg-surface-soft px-2 py-1 text-xs text-muted">{field.selection}</span>
    </div>
    {field.description && <p className="mt-3 text-sm leading-relaxed text-ink-soft"><Highlight text={field.description} query={query} /></p>}
    <dl className="mt-5 divide-y divide-line border-t border-line">
      {field.codes.map(item => <div key={item.code} className="grid gap-2 py-4 md:grid-cols-[minmax(140px,0.38fr)_1fr] md:gap-6">
        <dt className="break-words font-mono text-[13px] font-semibold [overflow-wrap:anywhere]"><Highlight text={item.code} query={query} /></dt>
        <dd className="min-w-0 text-sm leading-relaxed"><Highlight text={item.definition} query={query} />{item.note && <p className="mt-2 text-xs text-muted">Note: <Highlight text={item.note} query={query} /></p>}</dd>
      </div>)}
    </dl>
  </section>;
}
