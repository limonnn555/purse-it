import PricingSimulator from "@/components/PricingSimulator";

export const metadata = {
  title: "Pricing — Purse It",
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Pricing simulator
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
        Three plans, two customer segments, and what they could earn
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Revenue figures are simulations built from the assumptions you see
        below, not real sales. Change them and save the scenarios you want to
        compare.
      </p>

      <div className="mt-10">
        <PricingSimulator />
      </div>
    </div>
  );
}
