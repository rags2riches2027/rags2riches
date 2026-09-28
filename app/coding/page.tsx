import data from "@/data/coding.json";
import { CodingBrowser } from "../components/coding/coding-browser";
import { PageContainer, SupplementaryHeader } from "../components/ui";

export const metadata = { title: "Paper coding — From Rags to Riches" };

export default function CodingPage() {
  return <PageContainer>
    <SupplementaryHeader title="From Rags to Riches: A Review of the Adoption of Retrieval-Augmented Generation in HCI" />
    <CodingBrowser fields={data.fields} papers={data.papers} />
  </PageContainer>;
}
