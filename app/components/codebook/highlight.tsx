export function Highlight({ text, query = "" }: { text: string; query?: string }) {
  const needle = query.trim().toLowerCase();
  if (!needle) return <>{text}</>;
  const parts = [];
  let start = 0;
  let match = text.toLowerCase().indexOf(needle);
  while (match !== -1) {
    parts.push(text.slice(start, match));
    parts.push(<mark key={match} className="rounded bg-amber-100 text-ink">{text.slice(match, match + needle.length)}</mark>);
    start = match + needle.length;
    match = text.toLowerCase().indexOf(needle, start);
  }
  parts.push(text.slice(start));
  return <>{parts}</>;
}
