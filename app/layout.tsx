import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "./components/site-nav";

export const metadata: Metadata = {
  title: "Analysis — From Rags to Riches",
  icons: { icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 rx=%226%22 fill=%22%230065ef%22/><path d=%22M8 23V15h4v8m2 0V9h4v14m2 0V5h4v18%22 fill=%22white%22/></svg>" },
  description: "Interactive descriptive analysis of 100 papers on RAG in interactive systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-bg text-ink antialiased"><SiteNav /><main>{children}</main></body></html>;
}
