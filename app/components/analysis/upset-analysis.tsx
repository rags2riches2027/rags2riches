"use client";

import { Fragment, useState } from "react";
import type { CSSProperties } from "react";
import type { UpSetView } from "@/lib/analysis-upset";
import styles from "./upset-analysis.module.css";

export function UpSetAnalysis({ views }: { views: UpSetView[] }) {
  const [fieldId, setFieldId] = useState(views.find((view) => /^B4\s/.test(view.label))?.id ?? views[0]?.id ?? "");
  const view = views.find((item) => item.id === fieldId) ?? views[0];
  if (!view) return null;

  return (
    <section className="grid min-w-0 gap-4" aria-labelledby="upset-heading">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-3">
        <div>
          <h2 id="upset-heading" className="text-[18px] font-bold tracking-[-0.015em] text-ink">Parent combinations · UpSet</h2>
        </div>
        <label className="grid min-w-0 max-w-full gap-1.5 text-xs font-medium text-muted">
          UpSet field
          <select className="w-full max-w-[420px] rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink" value={view.id} onChange={(event) => setFieldId(event.target.value)}>
            {views.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
      </header>
      <UpSetChart key={view.id} view={view} />
    </section>
  );
}

function UpSetChart({ view }: { view: UpSetView }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const visible = showAll ? view.intersections : view.intersections.slice(0, 20);
  const selected = visible.find((item) => item.key === selectedKey) ?? visible[0];
  const max = Math.max(1, ...view.intersections.map((item) => item.count));
  const step = Math.max(1, Math.ceil(max / 4));
  const ceiling = step * 4;
  const covered = visible.reduce((sum, item) => sum + item.count, 0);
  const combinationLabel = (members: number[]) => members.map((index) => view.sets[index].label).join(" + ");

  return (
    <article className="min-w-0 rounded-lg border border-line bg-surface p-5 shadow-xs max-sm:p-3">
      <header className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-ink">{view.label}</h3>
      </header>
      {visible.length ? (
        <>
          <div className={styles.scroll} role="region" aria-label={`${view.label} UpSet matrix`} tabIndex={0}>
            <div className={styles.chart} style={{ "--columns": visible.length } as CSSProperties}>
              <div className={styles.corner}>
                <p className="font-semibold text-ink">Parent set sizes</p>
                <p className="mt-1 text-muted">n = {view.totalPapers}</p>
                {[0, 1, 2, 3, 4].map((index) => <span key={index} className={styles.yTick} style={{ bottom: 12 + index * 35 }} aria-hidden="true">{index * step}</span>)}
              </div>
              <div className={styles.topPlot}>
                <span className={styles.plotTitle}>Exact combination size · papers</span>
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className={styles.gridline} style={{ bottom: index * 35 }} aria-hidden="true" />
                ))}
                <div className={styles.intersectionColumns}>
                  {visible.map((item) => (
                    <button key={item.key} type="button" className={styles.intersection} aria-pressed={item.key === selected.key} aria-label={`Only ${combinationLabel(item.members)}: ${item.count} papers`} onClick={() => setSelectedKey(item.key)}>
                      <span className={styles.intersectionBar} style={{ height: `${item.count / ceiling * 100}%` }}>
                        <span>{item.count}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {view.sets.map((set, row) => (
                <Fragment key={set.label}>
                  <div className={styles.setLabel}>
                    <div><span>{set.label}</span><strong>{set.count}</strong></div>
                    <div className={styles.setTrack} aria-hidden="true"><span style={{ width: `${set.count / Math.max(1, view.totalPapers) * 100}%` }} /></div>
                  </div>
                  <div className={styles.membershipRow} aria-hidden="true">
                    {visible.map((item) => {
                      const member = item.members.includes(row);
                      const first = item.members[0];
                      const last = item.members[item.members.length - 1];
                      return (
                        <div key={item.key} className={styles.membershipCell} data-selected={item.key === selected.key}>
                          {row >= first && row <= last && first !== last && <span className={styles.connector} style={{ top: row === first ? "50%" : 0, bottom: row === last ? "50%" : 0 }} />}
                          <svg width="14" height="14" viewBox="0 0 14 14" className={styles.dot}>
                            <circle cx="7" cy="7" r="4.5" fill={member ? "var(--color-ink-soft)" : "var(--color-line)"} />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-md border border-line bg-surface-soft px-4 py-3.5" role="status">
            <div className="min-w-0">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">Exact combination</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Parents in this combination">
                {selected.members.map((member) => (
                  <li key={member} className="inline-flex items-center gap-1.5 rounded-sm border border-line-strong bg-surface px-2 py-1 text-[13px] text-ink">
                    <span className="size-2 shrink-0 rounded-full bg-ink-soft" aria-hidden="true" />
                    {view.sets[member].label}
                  </li>
                ))}
              </ul>
            </div>
            <p className="shrink-0 text-right max-sm:text-left">
              <span className="text-2xl font-bold tabular-nums leading-none text-accent">{selected.count}</span>
              <span className="ml-1.5 text-sm text-ink-soft">papers</span>
              <span className="mt-1 block text-xs text-muted">{Math.round(selected.count / Math.max(1, view.assignedPapers) * 100)}% of assigned</span>
            </p>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">
              {visible.length < view.intersections.length ? `Top ${visible.length} of ${view.intersections.length} combinations` : `${visible.length} combinations`}
              {" · "}
              {covered === view.assignedPapers ? `all ${view.assignedPapers} assigned papers` : `${covered} of ${view.assignedPapers} assigned papers`}
            </p>
            {view.intersections.length > 20 && <button type="button" className="rounded-md border border-line bg-surface px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={() => setShowAll(!showAll)}>{showAll ? "Show top 20" : `Show all ${view.intersections.length} combinations`}</button>}
          </div>
          <details className="mt-3 text-xs text-muted">
            <summary className="cursor-pointer py-2 font-medium">Exact combination data</summary>
            <table className="w-full text-left">
              <thead><tr className="border-b border-line"><th scope="col" className="py-2">Only these parents</th><th scope="col" className="text-right">Papers</th></tr></thead>
              <tbody>{view.intersections.map((item) => <tr key={item.key} className="border-b border-line"><td className="py-2 pr-3">{combinationLabel(item.members)}</td><td className="text-right tabular-nums">{item.count}</td></tr>)}</tbody>
            </table>
          </details>
        </>
      ) : <p className="py-8 text-sm text-muted">No parent-coded papers in this field.</p>}
    </article>
  );
}
