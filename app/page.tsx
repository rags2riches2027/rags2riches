import Link from "next/link";

export default function HomePage() {
  const destination = `${process.env.PAGES_BASE_PATH || ""}/analysis/`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      <p className="mx-auto max-w-[1440px] px-7 py-6 text-sm">
        <Link href="/analysis/" className="text-accent">Continue to Analysis</Link>
      </p>
    </>
  );
}
