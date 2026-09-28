import ResearchDashboard from "@/components/ResearchDashboard";

export const metadata = {
  title: "Research — Purse It",
};

export default function ResearchPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Research + Benchmarking
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
        Who else is solving &ldquo;what should I carry this in&rdquo;?
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        A running log of global examples, competitors, and substitutes for
        Purse It, so decisions about pricing and positioning are based on
        research, not guesses.
      </p>

      <div className="mt-10">
        <ResearchDashboard />
      </div>
    </div>
  );
}
