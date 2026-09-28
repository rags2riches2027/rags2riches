import type { FieldDistribution } from "@/lib/analysis";
import { transparencyControlRows } from "@/lib/paper-analysis";
import { SectionHeading } from "@/app/components/ui";

export function TransparencyControlTable({ fields }: { fields: FieldDistribution[] }) {
  return <section className="grid gap-4" aria-label="Transparency and control">
    <SectionHeading title="Transparency and control" />
    <div className="overflow-x-auto rounded-lg border border-line bg-surface p-5">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Paper counts for visibility and control of corresponding objects.</caption>
        <thead><tr className="border-b border-line">{["Object", "Visible", "Control", "Both", "Visible only"].map(label => <th key={label} scope="col" className="px-3 py-3 first:pl-0 whitespace-nowrap">{label}</th>)}</tr></thead>
        <tbody>{transparencyControlRows(fields).map(row => <tr key={row.label} className="border-b border-line last:border-0">
          <th scope="row" className="py-3 pr-3 font-medium whitespace-nowrap">{row.label}</th>
          {[row.visible, row.control, row.both, row.visibleOnly].map((value, index) => <td key={index} className="px-3 py-3 tabular-nums">{value}</td>)}
        </tr>)}</tbody>
      </table>
      <p className="mt-4 text-xs leading-relaxed text-muted">Retrieval process visibility combines retrieval-disclosure and retrieval-metadata-visible (deduplicated).</p>
    </div>
  </section>;
}
