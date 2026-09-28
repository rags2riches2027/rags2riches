"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CodebookSection } from "@/lib/codebook";
import { CodebookField } from "./codebook-field";
import { Highlight } from "./highlight";
import { BrowserLayout, BrowserSidebar } from "../ui";

const control = "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink";
const button = "rounded-md border border-line px-3 py-2 text-sm hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40";

export function CodebookView({ conventions, pipeline, sections }: {
  conventions: string[]; pipeline: string[]; sections: CodebookSection[];
}) {
  const fields = sections.flatMap(section => section.fields);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(fields[0]?.code ?? "conventions");
  const [mode, setMode] = useState<"browse" | "all">("browse");
  const content = useRef<HTMLElement>(null);
  const readingAnchor = useRef<{ id: string; top: number } | null>(null);
  const search = query.trim().toLowerCase();
  const matches = (text: string) => text.toLowerCase().includes(search);
  const filtered = sections.map(section => ({ ...section, fields: section.fields.filter(field =>
    matches(`${field.code} ${field.name} ${field.description ?? ""}`) || field.codes.some(item => matches(`${item.code} ${item.definition} ${item.note ?? ""}`))
  ) })).filter(section => section.fields.length);
  const shown = filtered.flatMap(section => section.fields);
  const index = fields.findIndex(field => field.code === selected);
  const active = fields[index];
  const activeSection = sections.find(section => section.fields.some(field => field.code === selected));

  useEffect(() => {
    function readHash() {
      const id = window.location.hash.slice(1) || sections[0]?.fields[0]?.code;
      if (id === "conventions" || sections.some(section => section.fields.some(field => field.code === id))) {
        setSelected(id); setQuery("");
      }
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    window.addEventListener("popstate", readHash);
    return () => { window.removeEventListener("hashchange", readHash); window.removeEventListener("popstate", readHash); };
  }, [sections]);

  useLayoutEffect(() => {
    const anchor = readingAnchor.current;
    if (!anchor) return;
    readingAnchor.current = null;
    const target = document.getElementById(anchor.id);
    if (target) window.scrollBy({ top: target.getBoundingClientRect().top - anchor.top, behavior: "instant" });
  }, [mode, query, selected]);

  function changeView(nextMode: "browse" | "all") {
    if (nextMode === mode && !search) return;
    const isReadingAll = mode === "all" && !search;
    let id = selected;
    if (isReadingAll) {
      const candidates = ["conventions", ...fields.map(field => field.code)]
        .map(code => document.getElementById(code))
        .filter((element): element is HTMLElement => Boolean(element));
      const current = document.getElementById(selected);
      const rect = current?.getBoundingClientRect();
      const visible = rect && rect.bottom > 80 && rect.top < window.innerHeight
        ? current
        : candidates.find(element => element.getBoundingClientRect().bottom > 80);
      if (visible) id = visible.id;
    }
    const target = document.getElementById(id);
    readingAnchor.current = { id, top: target?.getBoundingClientRect().top ?? 80 };
    setSelected(id);
    setMode(nextMode);
    setQuery("");
    window.history.replaceState(null, "", `#${id}`);
  }

  function select(id: string) {
    if (mode === "all") {
      const target = document.getElementById(id);
      if (!search && target) {
        window.scrollBy({ top: target.getBoundingClientRect().top - 80, behavior: "instant" });
      } else {
        readingAnchor.current = { id, top: 80 };
      }
    }
    setSelected(id); setQuery("");
    window.history.pushState(null, "", `#${id}`);
  }
  const conventionsView = <section id="conventions" className="py-6">
    <h2 className="text-xl font-bold">Coding conventions</h2>
    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">{conventions.map(item => <li key={item}>{item}</li>)}</ul>
    <h3 className="mt-7 text-base font-bold">Per-pipeline coding</h3>
    {pipeline.map(item => <p key={item} className="mt-3 text-sm leading-relaxed">{item}</p>)}
  </section>;

  return <BrowserLayout sidebar={<BrowserSidebar label="Codebook contents">
    <label className="grid gap-2 text-xs font-semibold text-muted">Search codes and definitions
      <input type="search" value={query} onChange={event => { setQuery(event.target.value); }} placeholder="Try agent, evidence, or B4…" className={control} />
    </label>
    <p role="status" className="my-3 text-xs text-muted">{search ? `${shown.length} matching fields` : `${fields.length} fields · select one to explore`}</p>
    {query && <button className={`${button} mb-3 w-full`} onClick={() => setQuery("")}>Clear search</button>}
    <div className="min-[801px]:hidden">
      <label className="grid gap-2 text-xs font-semibold text-muted">Jump to field
        <select value={search ? "" : selected} onChange={event => select(event.target.value)} className={control}>
          {search && <option value="" disabled>Select a matching field</option>}
          <option value="conventions">Coding conventions</option>
          {filtered.map(section => <optgroup key={section.letter} label={`${section.letter}. ${section.name}`}>
            {section.fields.map(field => <option key={field.code} value={field.code}>{field.code} · {field.name}</option>)}
          </optgroup>)}
        </select>
      </label>
    </div>
    <nav aria-label="Codebook fields" className="hidden max-h-[calc(100vh-240px)] overflow-y-auto min-[801px]:block">
      <button onClick={() => select("conventions")} aria-current={!search && selected === "conventions" ? "true" : undefined} className="mb-2 w-full rounded px-3 py-2 text-left text-sm font-semibold aria-[current=true]:bg-accent-soft aria-[current=true]:text-accent">Coding conventions</button>
      {filtered.map(section => <details key={`${section.letter}-${Boolean(search)}-${activeSection?.letter}`} open={Boolean(search) || section.letter === activeSection?.letter} className="border-t border-line py-2">
        <summary className="cursor-pointer py-2 text-xs font-bold text-muted">{section.letter}. {section.name} <span className="font-normal">({section.fields.length})</span></summary>
        {section.fields.map(field => <button key={field.code} onClick={() => select(field.code)} aria-current={!search && selected === field.code ? "true" : undefined} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-surface-soft aria-[current=true]:bg-accent-soft aria-[current=true]:text-accent aria-[current=true]:font-semibold"><span className="mr-2 text-muted">{field.code}</span><Highlight text={field.name} query={query} /></button>)}
      </details>)}
    </nav>
  </BrowserSidebar>}>
    <article ref={content} tabIndex={-1} aria-label="Codebook" className="min-w-0 scroll-mt-4 rounded-lg border border-line bg-surface p-5 focus-visible:outline-2 focus-visible:outline-accent sm:p-7">
      <header className="sticky top-0 z-10 flex items-center border-b border-line bg-surface py-3">
        <div role="group" aria-label="Reading mode" className="flex gap-1 rounded-md border border-line bg-surface-soft p-1">
          {([ ["browse", "Field View"], ["all", "Full View"] ] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={mode === value} onClick={() => changeView(value)}
              className="rounded px-3 py-2 text-sm font-semibold text-muted hover:text-ink aria-pressed:bg-surface aria-pressed:text-accent aria-pressed:shadow-xs focus-visible:outline-2 focus-visible:outline-accent">
              {label}
            </button>
          ))}
        </div>
      </header>
      {search ? <section className="py-5">
        <h2 className="text-lg font-bold">Search results for “{query.trim()}”</h2>
        <p className="mt-2 text-sm text-muted">Select a field to read its complete definitions.</p>
        {!shown.length && <p className="mt-6 text-sm">No matching fields or codes. Try another term or clear your search.</p>}
        {shown.map(field => <div key={field.code} className="border-b border-line py-5">
          <button onClick={() => select(field.code)} className="text-left font-semibold text-accent hover:underline">{field.code} · <Highlight text={field.name} query={query} /> <span aria-hidden="true">→</span></button>
          {field.description && matches(field.description) && <p className="mt-2 text-sm leading-relaxed"><Highlight text={field.description} query={query} /></p>}
          {field.codes.filter(item => matches(`${item.code} ${item.definition} ${item.note ?? ""}`)).map(item => <div key={item.code} className="mt-3 border-l-2 border-line pl-3 text-sm leading-relaxed">
            <p className="break-words font-mono text-xs font-semibold"><Highlight text={item.code} query={query} /></p>
            <p className="mt-1"><Highlight text={item.definition} query={query} /></p>
            {item.note && <p className="mt-1 text-xs text-muted">Note: <Highlight text={item.note} query={query} /></p>}
          </div>)}
        </div>)}
      </section> : mode === "all" ? <>{conventionsView}{sections.map(section => <section key={section.letter}>
        <h2 className="mt-8 border-b-2 border-line pb-3 text-lg font-bold">{section.letter}. {section.name}</h2>
        {section.fields.map(field => <CodebookField key={field.code} field={field} />)}
      </section>)}</> : <>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">{activeSection ? `${activeSection.letter}. ${activeSection.name} · ${index + 1} / ${fields.length}` : "About this codebook"}</p>
        {active ? <CodebookField field={active} /> : conventionsView}
        <footer className="flex justify-between gap-3 border-t border-line pt-4">
          <button disabled={index < 0} onClick={() => select(index === 0 ? "conventions" : fields[index - 1].code)} className={button}>← {index === 0 ? "Conventions" : index > 0 ? fields[index - 1].code : "Previous"}</button>
          <button disabled={index === fields.length - 1} onClick={() => select(fields[index + 1].code)} className={button}>{index < fields.length - 1 ? `${fields[index + 1].code} · ${fields[index + 1].name}` : "Next"} →</button>
        </footer>
      </>}
    </article>
  </BrowserLayout>;
}
