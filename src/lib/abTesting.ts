export type TestId = "hero_headline" | "hero_cta";
export type Variant = "A" | "B";

export const AB_TESTS: Record<
  TestId,
  { name: string; question: string; variants: Record<Variant, string> }
> = {
  hero_headline: {
    name: "Hero headline",
    question: "Which headline gets more visitors to click the main button?",
    variants: {
      A: "Design the perfect bag for what you carry every day",
      B: "Stop throwing your stuff in a bag. Give each thing a place.",
    },
  },
  hero_cta: {
    name: "Main button",
    question: "Which button label gets more clicks?",
    variants: {
      A: "Design my bag",
      B: "Design my bag, it's free",
    },
  },
};

export type AbEvent = {
  test_id: string;
  variant: string;
  event: string;
  visitor_id: string;
  is_test: boolean;
};

export type VariantStats = { views: number; clicks: number; rate: number };

export function pickVariant(random: number): Variant {
  return random < 0.5 ? "A" : "B";
}

// Counts unique visitors, so one person reloading or clicking twice counts once.
export function summarize(
  events: AbEvent[],
  testId: TestId,
  options: { includeTestSessions?: boolean } = {}
): Record<Variant, VariantStats> {
  const seen: Record<Variant, { view: Set<string>; click: Set<string> }> = {
    A: { view: new Set(), click: new Set() },
    B: { view: new Set(), click: new Set() },
  };

  for (const event of events) {
    if (event.test_id !== testId) continue;
    if (event.is_test && !options.includeTestSessions) continue;
    if (event.variant !== "A" && event.variant !== "B") continue;
    if (event.event === "view") seen[event.variant].view.add(event.visitor_id);
    if (event.event === "click") seen[event.variant].click.add(event.visitor_id);
  }

  const build = (variant: Variant): VariantStats => {
    const views = seen[variant].view.size;
    const clicks = seen[variant].click.size;
    return { views, clicks, rate: views === 0 ? 0 : clicks / views };
  };
  return { A: build("A"), B: build("B") };
}

export type Leader = Variant | "tie" | "not-enough-data";

export function leader(
  stats: Record<Variant, VariantStats>,
  minViewsPerVariant = 20
): Leader {
  if (stats.A.views < minViewsPerVariant || stats.B.views < minViewsPerVariant) {
    return "not-enough-data";
  }
  if (stats.A.rate === stats.B.rate) return "tie";
  return stats.A.rate > stats.B.rate ? "A" : "B";
}
