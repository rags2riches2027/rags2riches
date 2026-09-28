"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldDistribution } from "@/lib/analysis";

export function CrossFieldAnalysis({ fields }: { fields: FieldDistribution[] }) {
  const [rowId, setRowId] = useState(fields.find(field => field.label.startsWith("B1 "))?.key ?? fields[0].key);
  const [columnId, setColumnId] = useState(fields.find(field => field.label.startsWith("B12 "))?.key ?? fields[1].key);
  const [selected, setSelected] = useState<{ row: string; column: string } | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!selected) return;
    resultsRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }, [selected]);
  const rowField = fields.find(field => field.key === rowId)!;
  const columnField = fields.find(field => field.key === columnId)!;
  const columns = columnField.counts.map(group => ({ ...group, ids: new Set(group.papers.map(paper => paper.id)) }));
  const cells = rowField.counts.map(row => columns.map(column => row.papers.filter(paper => column.ids.has(paper.id))));
  const rowIndex = rowField.counts.findIndex(row => row.label === selected?.row);
  const columnIndex = columns.findIndex(column => column.label === selected?.column);
  const papers = rowIndex >= 0 && columnIndex >= 0 ? cells[rowIndex][columnIndex] : [];
  const selectClass = "mt-2 w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-sm font-medium text-ink";

  return <div className="min-w-0 rounded-lg border border-line bg-surface p-4 sm:p-6">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="min-w-0 text-xs font-semibold text-muted">Rows
        <select className={selectClass} value={rowId} onChange={event => { setRowId(event.target.value); setSelected(null); }}>
          {fields.map(field => <option key={field.key} value={field.key} disabled={field.key === columnId}>{field.label}</option>)}
        </select>
      </label>
      <label className="min-w-0 text-xs font-semibold text-muted">Columns
        <select className={selectClass} value={columnId} onChange={event => { setColumnId(event.target.value); setSelected(null); }}>
          {fields.map(field => <option key={field.key} value={field.key} disabled={field.key === rowId}>{field.label}</option>)}
        </select>
      </label>
    </div>
    <div className="my-5 flex items-center justify-end gap-2 text-xs tabular-nums text-muted" aria-label="Cell color: 0 to 100 percent within each row">
      <span>Papers · color: row %</span><span>0%</span><span className="h-2 w-24 rounded-sm" style={{ background: "linear-gradient(to right, #f1f5f9, #2563eb)" }} /><span>100%</span>
    </div>
    <div className="overflow-x-auto" role="region" aria-label="Cross-field matrix" tabIndex={0}>
      <table className="w-full border-separate border-spacing-1 text-xs">
        <caption className="sr-only">{rowField.label} × {columnField.label}. Cell labels are paper counts; color shows the percentage within each row.</caption>
        <thead><tr><th scope="col" className="sticky left-0 z-10 min-w-[150px] bg-surface" aria-label={rowField.label} />{columns.map(column => <th key={column.label} scope="col" className="min-w-[110px] max-w-[150px] px-2 pb-3 align-bottom font-medium leading-relaxed text-ink-soft [overflow-wrap:anywhere]">{column.label}</th>)}</tr></thead>
        <tbody>{rowField.counts.map((row, i) => <tr key={row.label}>
          <th scope="row" className="sticky left-0 z-10 max-w-[200px] bg-surface py-2 pr-4 text-left font-medium leading-relaxed text-ink-soft [overflow-wrap:anywhere]">{row.label}<span className="block text-muted font-normal">n = {row.value}</span></th>
          {columns.map((column, j) => {
            const count = cells[i][j].length;
            const fraction = count / Math.max(1, row.value);
            const active = selected?.row === row.label && selected?.column === column.label;
            return <td key={column.label} className="p-0"><button type="button" aria-label={`${row.label} × ${column.label}: ${count} papers`} aria-pressed={active} onClick={() => setSelected({ row: row.label, column: column.label })}
              className="h-11 w-full rounded-sm text-sm font-semibold tabular-nums transition-shadow hover:ring-2 hover:ring-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              title={`${count} of ${row.value} papers (${(fraction * 100).toFixed(1)}%)`}
              style={{ background: `color-mix(in srgb, #2563eb ${fraction * 100}%, #f1f5f9)`, color: fraction > 0.6 ? "white" : count ? "#1e3a8a" : "#64748b", boxShadow: active ? "inset 0 0 0 2px #0f172a" : undefined }}>{count}</button></td>;
          })}
        </tr>)}</tbody>
      </table>
    </div>
    {selected && <section ref={resultsRef} className="mt-6 scroll-mt-6 border-t border-line pt-4" aria-label="Matching papers">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3"><h3 className="text-sm font-semibold text-ink">{selected.row} <span className="mx-1 font-normal text-muted">×</span> {selected.column}</h3><div className="flex items-center gap-4"><span role="status" className="text-xs tabular-nums text-muted">{papers.length} papers</span><button type="button" onClick={() => setSelected(null)} aria-label="Close paper list" className="text-xs text-muted hover:text-accent">Close</button></div></div>
      {papers.length ? <ul className="divide-y divide-line">{papers.map(paper => <li key={paper.id} className="flex items-baseline gap-4 py-3 text-sm"><span className="shrink-0 text-xs tabular-nums text-muted">{paper.year}</span>{paper.doi ? <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="min-w-0 text-ink hover:text-accent">{paper.title}</a> : <span>{paper.title}</span>}</li>)}</ul> : <p className="text-sm text-muted">No papers in this combination.</p>}
    </section>}
  </div>;
}
