import type { UpSetView } from "./analysis-upset";
import type { AnalysisCitation } from "./analysis-citations";

export type AnalysisCount = {
  label: string;
  value: number;
  percent: number;
};

export type AnalysisPaper = {
  id: string;
  title: string;
  year: string;
  doi: string | null;
  citation: AnalysisCitation;
};

export type FieldCodeCount = AnalysisCount & {
  papers: AnalysisPaper[];
};

export type FieldCodeGroup = FieldCodeCount & {
  subtypes: FieldCodeCount[];
};

export type FieldDistribution = {
  key: string;
  label: string;
  category: string;
  codedPapers: number;
  counts: FieldCodeGroup[];
};

export type CompletedPaperAnalysis = {
  summary: { completedPapers: number };
  distributionsByCategory: Array<{
    category: string;
    fields: FieldDistribution[];
  }>;
  upsetViews: UpSetView[];
};

