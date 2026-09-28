import { CategoryDistribution } from "@/app/components/analysis/category-distribution";
import { Card, EmptyStage, PageHero, PageContainer, SectionHeading } from "@/app/components/ui";
import snapshot from "@/data/analysis.json";
import type { CompletedPaperAnalysis } from "@/lib/analysis";
import coding from "@/data/coding.json";
import { VenueChart, venueCounts } from "@/app/components/analysis/venue-chart";
import { PublicationYearChart } from "@/app/components/analysis/publication-year-chart";
import { CrossFieldAnalysis } from "@/app/components/analysis/cross-field-analysis";
import { UpSetAnalysis } from "@/app/components/analysis/upset-analysis";

import { paperAnalysis } from "@/lib/paper-analysis";
import { TransparencyControlTable } from "@/app/components/analysis/transparency-control-table";

export default function AnalysisPage() {
  // Exported by the original analysis loader; JSON imports widen literal types.
  const analysis = paperAnalysis(snapshot.analysis as unknown as CompletedPaperAnalysis, coding.fields, coding.papers.map(paper => paper.paper_id));
  const fields = analysis.distributionsByCategory.flatMap(category => category.fields);
  const { summary } = analysis;
  const counts = new Map<string, number>();
  for (const paper of coding.papers) counts.set(paper.year, (counts.get(paper.year) ?? 0) + 1);
  const years = [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([label, value]) => ({ label, value }));
  const venues = venueCounts(coding.papers);

  return (
    <PageContainer className="sm:py-7 flex flex-col gap-7">
      <PageHero
        title={<>Review <span className="text-accent">analysis</span></>}
      />

      {summary.completedPapers === 0 ? (
        <EmptyStage
          title="No completed papers to analyze"
          description="No included papers are available in this dataset."
        />
      ) : (
        <>
          <section className="grid items-stretch gap-5 lg:grid-cols-2">
            <Card title="Publication years" className="min-w-0">
              <PublicationYearChart data={years} />
            </Card>
            <Card title="Publication venues" className="min-w-0">
              <VenueChart data={venues} />
            </Card>
          </section>

          <UpSetAnalysis views={analysis.upsetViews} />

          <TransparencyControlTable fields={fields} />

          <section className="grid gap-5">
            <SectionHeading
              title="Single-field distributions"
            />
            {analysis.distributionsByCategory.map((category) => (
              <CategoryDistribution
                key={category.category}
                category={category.category}
                fields={category.fields}
                paperCount={summary.completedPapers}
              />
            ))}
          </section>

          <section className="grid gap-5">
            <SectionHeading
              title="Cross-field patterns"
            />
            <CrossFieldAnalysis fields={fields.filter(field => !field.label.startsWith("G1 "))} />
          </section>
        </>
      )}
    </PageContainer>
  );
}

