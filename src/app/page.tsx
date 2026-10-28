import Link from "next/link";
import AbHero from "@/components/AbHero";
import BagDesigner from "@/components/BagDesigner";
import HeroPreview from "@/components/HeroPreview";
import { LANDING } from "@/lib/marketingContent";
import { TIERS } from "@/lib/pricingEngine";
import { SEED_ENTRIES } from "@/lib/researchSeed";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const explore = [
  {
    href: "/core",
    title: "Design core",
    body: "Describe your day and get design principles and a priority zone for your bag.",
  },
  {
    href: "/product",
    title: "Product map",
    body: "Every feature, what is live today, and which plan will include it.",
  },
  {
    href: "/research",
    title: "Market research",
    body: `We compared Purse It against ${SEED_ENTRIES.length} existing products and alternatives.`,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <AbHero />
          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {LANDING.steps.map((step, index) => (
            <li key={step} className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm font-medium text-accent">Step {index + 1}</p>
              <p className="mt-2 text-sm">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="disenar"
        className="mx-auto w-full max-w-5xl scroll-mt-6 px-6 pb-16"
      >
        <BagDesigner />
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">More than a layout</h2>
          <p className="mt-2 max-w-xl text-muted">
            The designer is the start. Here is what else is built, in the open.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {explore.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-2xl border border-border bg-background p-6 transition-colors hover:border-accent"
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.body}</p>
                  <p className="mt-4 text-sm font-medium text-accent">Open</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Plans</h2>
        <p className="mt-2 max-w-xl text-muted">
          Designing a bag is free today. Plus and Studio are planned, and the
          prices below are a simulation we are testing.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <li key={tier.id} className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm font-medium text-muted">
                {tier.name}
                {tier.id === "free" ? " · live today" : " · planned"}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {tier.monthlyPrice === 0 ? "$0" : money.format(tier.monthlyPrice)}
                <span className="text-sm font-normal text-muted"> / month</span>
              </p>
              <p className="mt-3 text-sm text-muted">{tier.tagline}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/pricing" className="font-medium text-accent hover:underline">
            See the pricing simulator
          </Link>
        </p>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
          <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-background">
            {LANDING.faq.map((item) => (
              <details key={item.q} className="group p-5">
                <summary className="cursor-pointer list-none text-sm font-medium">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
        <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight">
          {LANDING.closing}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          The experience is intuitive and uses few materials and colors, so you
          can focus on how practical the design really is.
        </p>
        <a
          href="#disenar"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Design my bag
        </a>
      </section>
    </div>
  );
}
