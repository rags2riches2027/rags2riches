const VENUES: [string, string][] = [
  ["CHI", "CHI Conference on Human Factors in Computing Systems"],
  ["UIST", "ACM Symposium on User Interface Software and Technology"],
  ["IUI", "International Conference on Intelligent User Interfaces"],
  ["IMWUT", "Proc. ACM Interact. Mob. Wearable Ubiquitous Technol."],
  ["DIS", "ACM Designing Interactive Systems Conference"],
  ["PACM HCI", "Proc. ACM Hum.-Comput. Interact."],
  ["TOCHI", "ACM Trans. Comput.-Hum. Interact."],
];

export function venueCounts(papers: { venue: string }[]) {
  const counts = new Map<string, { label: string; title: string; value: number }>();
  for (const paper of papers) {
    const match = VENUES.find(([, title]) => paper.venue.includes(title));
    const label = match?.[0] ?? (paper.venue || "Not reported");
    const current = counts.get(label) ?? { label, title: match?.[1] ?? label, value: 0 };
    current.value += 1;
    counts.set(label, current);
  }
  return [...counts.values()].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

export function VenueChart({ data }: { data: { label: string; title: string; value: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const ceiling = Math.max(10, Math.ceil(Math.max(...data.map(item => item.value)) / 10) * 10);
  return <figure className="m-0" aria-label="Included papers by publication venue">
    <figcaption className="mb-4 flex justify-between text-[11px] text-muted"><span>Papers</span><span>n = {total}</span></figcaption>
    <div className="grid gap-3">{data.map(item => <div key={item.label} className="grid grid-cols-[76px_minmax(0,1fr)_28px] items-center gap-3 text-xs">
      <span title={item.title} className="font-medium text-ink-soft">{item.label}</span>
      <div className="h-5 border-l border-line-strong" aria-hidden="true"><div className="h-full rounded-r-[2px] bg-chart-accent" style={{ width: `${item.value / ceiling * 100}%` }} /></div>
      <span className="text-right font-semibold tabular-nums">{item.value}</span>
    </div>)}</div>
    <div className="mt-3 grid grid-cols-[76px_minmax(0,1fr)_28px] gap-3 text-[11px] tabular-nums text-muted" aria-hidden="true"><span /><div className="relative h-4 border-t border-line-strong">{[0, ceiling / 2, ceiling].map(tick => <span key={tick} className="absolute top-1 -translate-x-1/2" style={{ left: `${tick / ceiling * 100}%` }}>{tick}</span>)}</div></div>
  </figure>;
}
