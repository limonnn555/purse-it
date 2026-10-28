import MarketingEngine from "@/components/MarketingEngine";

export const metadata = {
  title: "Marketing — Purse It",
  description:
    "The Purse It marketing engine: brand system, persona, landing copy, social posts, video scripts, a 14-day calendar, and live A/B tests.",
};

export default function MarketingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Marketing engine
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
        One content system for launching Purse It
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Brand rules, a target persona, landing copy, 10 social posts, 3 video
        scripts, and a 14-day plan. Copy, export, or save any piece, and watch
        the live A/B tests on the home page.
      </p>

      <div className="mt-10">
        <MarketingEngine />
      </div>
    </div>
  );
}
