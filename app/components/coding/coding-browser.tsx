"use client";
import { BrowserLayout, BrowserSidebar } from "../ui";
import { PaperDetail } from "./paper-detail";
import { codes, type Field, type Paper } from "@/lib/coding";
import { useState } from "react";

const control = "mt-1 w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink";

export function CodingBrowser({ fields, papers }: { fields: Field[]; papers: Paper[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [field, setField] = useState("");
  const [selectedId, setSelectedId] = useState(papers[0]?.paper_id);
  const shownFields = fields.filter(item => !field || item.code === field);
  const search = query.trim().toLowerCase();
  const visible = papers.filter(paper => (!year || paper.year === year) && (!search || [paper.title, paper.authors, paper.doi, paper.bibtex_key, paper.venue, ...shownFields.flatMap(item => codes(paper, item))].some(value => String(value).toLowerCase().includes(search))));
  const selected = visible.find(paper => paper.paper_id === selectedId) ?? visible[0];
  return <BrowserLayout sidebar={
    <BrowserSidebar label="Paper browser">
      <div className="grid gap-3 text-xs font-semibold text-muted">
        <label>Search papers and coding<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Title, author, or code…" className={control} /></label>
        <label>Publication year<select value={year} onChange={event => setYear(event.target.value)} className={control}><option value="">All years</option>{[...new Set(papers.map(paper => paper.year))].sort().map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Coding field<select value={field} onChange={event => setField(event.target.value)} className={control}><option value="">All coding and categories</option>{fields.map(item => <option key={item.code} value={item.code}>{item.code} · {item.name}</option>)}</select></label>
      </div>
      <p role="status" className="my-3 text-xs text-muted">{visible.length} of {papers.length} papers</p>
      <nav aria-label="Included papers" className="max-h-[260px] overflow-y-auto min-[801px]:max-h-[calc(100vh-350px)]">{visible.map(paper => <button key={paper.paper_id} type="button" aria-current={selected?.paper_id === paper.paper_id ? "true" : undefined} onClick={() => setSelectedId(paper.paper_id)} className="block w-full border-b border-line px-3 py-3 text-left text-sm hover:bg-surface-soft aria-[current=true]:bg-accent-soft aria-[current=true]:text-accent"><span>{paper.title}</span><span className="mt-1 block text-xs text-muted">{paper.year} · {paper.venue}</span></button>)}</nav>
    </BrowserSidebar>
    }>
    <PaperDetail selected={selected} shownFields={shownFields} />
  </BrowserLayout>;
}
