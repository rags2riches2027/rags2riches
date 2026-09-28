import { publicationYearScale } from "@/lib/publication-year-scale";

export function PublicationYearChart({ data }: { data: { label: string; value: number }[] }) {
  if (!data.length) return <p className="text-sm text-muted">No publication year data.</p>;

  const { ceiling, ticks } = publicationYearScale(Math.max(...data.map((item) => item.value)));
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const columns = { gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` };

  return (
    <figure aria-label="Completed papers by publication year" className="m-0">
      <div aria-hidden="true">
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>Papers</span>
          <span className="tabular-nums">n = {total.toLocaleString()}</span>
        </div>
        <div className="mt-1 grid grid-cols-[32px_minmax(0,1fr)]">
          <div className="relative mt-7 h-40 text-[11px] tabular-nums text-muted">
            {ticks.map((tick) => (
              <span key={tick} className="absolute right-2 translate-y-1/2" style={{ bottom: `${tick / ceiling * 100}%` }}>
                {tick.toLocaleString()}
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <div className="pt-7" style={{ minWidth: `${data.length * 56}px` }}>
              <div className="relative h-40">
                {ticks.map((tick) => (
                  <div
                    key={tick}
                    className={tick === 0 ? "absolute inset-x-0 border-t border-line-strong" : "absolute inset-x-0 border-t border-dashed border-line"}
                    style={{ bottom: `${tick / ceiling * 100}%` }}
                  />
                ))}
                <div className="absolute inset-0 grid items-end" style={columns}>
                  {data.map((item) => (
                    <div
                      key={item.label}
                      className="relative mx-auto w-[52%] max-w-[72px] rounded-t-[2px] bg-chart-accent"
                      style={{ height: `${item.value / ceiling * 100}%` }}
                    >
                      <span className="absolute inset-x-0 bottom-full pb-1.5 text-center text-[13px] font-semibold tabular-nums text-ink">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid pt-2.5 text-center text-[12px] font-medium tabular-nums text-ink-soft" style={columns}>
                {data.map((item) => <span key={item.label}>{item.label}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <table className="sr-only block">
        <caption>Completed papers by publication year; total {total} papers.</caption>
        <thead><tr><th scope="col">Publication year</th><th scope="col">Papers</th></tr></thead>
        <tbody>
          {data.map((item) => <tr key={item.label}><th scope="row">{item.label}</th><td>{item.value}</td></tr>)}
        </tbody>
      </table>
    </figure>
  );
}
