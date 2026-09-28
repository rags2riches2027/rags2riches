export type AnalysisCitation = { key: string; provisional: boolean };

export function citationClipboard(citations: readonly AnalysisCitation[]) {
  const unique = [...new Map(citations.map((citation) => [citation.key, citation])).values()];
  return { text: unique.map((citation) => citation.key).join(","), count: unique.length, provisional: unique.filter((citation) => citation.provisional).length };
}
