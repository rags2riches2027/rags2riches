import type { AnalysisPaper, CompletedPaperAnalysis, FieldDistribution } from "./analysis";
import type { UpSetView } from "./analysis-upset";

export const NO_PRACTICE = "No specific practice identified";
const absence = new Set(["none", "not_reported"]);

/** Apply the manuscript's paper-level synthesis without changing raw coding. */
export function paperAnalysis(
  source: CompletedPaperAnalysis,
  metadata: { code: string; name: string }[],
  paperIds: string[],
): CompletedPaperAnalysis {
  const names = new Map(metadata.map(field => [field.code, `${field.code} ${field.name}`]));
  const papers = new Map<string, AnalysisPaper>();
  for (const category of source.distributionsByCategory) for (const field of category.fields)
    for (const group of field.counts) for (const paper of group.papers) papers.set(paper.id, paper);
  const changed = new Set<string>();
  const distributionsByCategory = source.distributionsByCategory.map(category => ({
    ...category,
    fields: category.fields.map(field => {
      const code = field.label.split(" ")[0];
      let counts = field.counts.map(group => ({ ...group, subtypes: [] }));
      if (code.startsWith("B") && counts.some(group => absence.has(group.label))) {
        changed.add(field.key);
        counts = counts.filter(group => !absence.has(group.label));
        const specific = new Set(counts.flatMap(group => group.papers.map(paper => paper.id)));
        const missing = paperIds.filter(id => !specific.has(id)).map(id => {
          const paper = papers.get(id);
          if (!paper) throw new Error(`Missing analysis metadata for ${id}`);
          return paper;
        });
        counts.push({ label: NO_PRACTICE, value: missing.length,
          percent: missing.length / Math.max(1, paperIds.length) * 100, papers: missing, subtypes: [] });
      }
      return { ...field, label: names.get(code) ?? field.label, counts };
    }),
  }));
  const fields = distributionsByCategory.flatMap(category => category.fields);
  const upsetViews = source.upsetViews.map(view => {
    const field = fields.find(field => field.key === view.id);
    if (!field) throw new Error(`Missing UpSet field ${view.label}`);
    return changed.has(field.key) ? combinations(field, paperIds) : { ...view, label: field.label };
  });
  return { ...source, distributionsByCategory, upsetViews };
}

function combinations(field: FieldDistribution, paperIds: string[]): UpSetView {
  const sets = field.counts.map(group => ({ label: group.label, count: group.value }));
  const memberships = field.counts.map(group => new Set(group.papers.map(paper => paper.id)));
  const groups = new Map<string, { key: string; members: number[]; count: number }>();
  let unassignedPapers = 0;
  for (const id of paperIds) {
    const members = memberships.flatMap((set, index) => set.has(id) ? [index] : []);
    if (!members.length) { unassignedPapers++; continue; }
    const key = JSON.stringify(members);
    const group = groups.get(key) ?? { key, members, count: 0 };
    group.count++;
    groups.set(key, group);
  }
  return { id: field.key, label: field.label, sets,
    intersections: [...groups.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key)),
    totalPapers: paperIds.length, assignedPapers: paperIds.length - unassignedPapers, unassignedPapers };
}

export function transparencyControlRows(fields: FieldDistribution[]) {
  const transparency = fields.find(field => field.label.startsWith("C1 "))!;
  const control = fields.find(field => field.label.startsWith("D1 "))!;
  const ids = (field: FieldDistribution, labels: string[]) => new Set(
    field.counts.filter(group => labels.includes(group.label)).flatMap(group => group.papers.map(paper => paper.id)));
  return [
    { label: "Knowledge base", visible: ["knowledge-base-visible"], control: "knowledge-control" },
    { label: "Evidence", visible: ["evidence-visible"], control: "evidence-control" },
    { label: "Grounding", visible: ["answer-grounding-visible"], control: "grounding-control" },
    { label: "Retrieval process", visible: ["retrieval-disclosure", "retrieval-metadata-visible"], control: "retrieval-control" },
  ].map(row => {
    const visible = ids(transparency, row.visible);
    const controlled = ids(control, [row.control]);
    const both = [...visible].filter(id => controlled.has(id)).length;
    return { label: row.label, visible: visible.size, control: controlled.size, both, visibleOnly: visible.size - both };
  });
}
