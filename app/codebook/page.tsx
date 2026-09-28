import codebook from "@/data/codebook.json";
import { CodebookView } from "../components/codebook/codebook-view";
import type { CodebookSection } from "@/lib/codebook";
import { PageContainer, SupplementaryHeader } from "../components/ui";

export const metadata = { title: "Codebook — From Rags to Riches" };

export default function CodebookPage() {
  return <PageContainer>
    <SupplementaryHeader title={codebook.title} />
    <CodebookView conventions={codebook.conventions} pipeline={codebook.pipeline} sections={codebook.sections as CodebookSection[]} />
  </PageContainer>;
}
