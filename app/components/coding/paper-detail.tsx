import Link from "next/link";
import { codes, type Field, type Paper } from "@/lib/coding";

export function PaperDetail({ selected, shownFields }: { selected?: Paper; shownFields: Field[] }) {
  const sections = [...new Set(shownFields.map(item => item.section))];
  return (
    <article aria-label="Paper coding" className="min-w-0 rounded-lg border border-line bg-surface p-5 sm:p-7">{selected ? <>
      <h2 className="text-xl font-bold leading-snug">{selected.title}</h2><p className="mt-3 break-words text-sm leading-relaxed text-muted">{selected.authors}<br />{selected.venue} · {selected.year}<br />{selected.doi && <a href={`https://doi.org/${selected.doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "")}`} target="_blank" rel="noopener noreferrer" className="break-all text-accent">{selected.doi}</a>}</p>
      <p className="mt-4 text-xs text-muted">Text in parentheses provides specific details or notes.</p>
      {sections.map(section => <section key={section}><h3 className="mt-7 border-b border-line pb-2 text-sm font-bold text-accent">{section}</h3>{shownFields.filter(item => item.section === section).map(item => <section key={item.code} className="border-b border-line py-4"><h4 className="mb-2 text-sm font-semibold"><Link href={`/codebook/#${item.code}`} title="View definitions in the codebook" className="text-ink hover:text-accent"><span className="mr-2 text-muted">{item.code}</span>{item.name}</Link></h4><div className="flex flex-wrap gap-2">{codes(selected, item).map(value => <span key={value} className="max-w-full break-words rounded border border-line bg-surface-soft px-2 py-1 text-xs">{value}</span>)}</div>{!codes(selected, item).length && <p className="text-sm text-muted">{item.categories ? "No recorded limitation categories." : "No recorded entry."}</p>}</section>)}</section>)}
    </> : <p className="text-sm text-muted">No matching papers. Try another search or year.</p>}</article>
  );
}
