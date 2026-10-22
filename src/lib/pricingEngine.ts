export type TierId = "free" | "plus" | "studio";
export type SegmentId = "carriers" | "makers";
export type ScenarioId = "Conservative" | "Base" | "Optimistic";

export type Tier = {
  id: TierId;
  name: string;
  monthlyPrice: number;
  tagline: string;
};

export const TIERS: Tier[] = [
  { id: "free", name: "Free", monthlyPrice: 0, tagline: "Design a bag and try the design core." },
  { id: "plus", name: "Plus", monthlyPrice: 99, tagline: "Save, compare, and share every design." },
  { id: "studio", name: "Studio", monthlyPrice: 299, tagline: "Maker-ready specs and quotes for production." },
];

export type Segment = {
  id: SegmentId;
  name: string;
  description: string;
};

export const SEGMENTS: Segment[] = [
  {
    id: "carriers",
    name: "Everyday Carriers",
    description: "People who carry the same items daily and want a bag made for them.",
  },
  {
    id: "makers",
    name: "Bag Makers",
    description: "Mexican talabarterías and small manufacturers who turn designs into real bags.",
  },
];

export type SegmentAssumptions = {
  monthlyVisitors: number;
  conversionRate: number; // % of visitors who pay
  plusShare: number; // % of paying customers on Plus; the rest are on Studio
};

export type Assumptions = Record<SegmentId, SegmentAssumptions>;

export const SCENARIOS: Record<ScenarioId, Assumptions> = {
  Conservative: {
    carriers: { monthlyVisitors: 2000, conversionRate: 1, plusShare: 85 },
    makers: { monthlyVisitors: 100, conversionRate: 3, plusShare: 20 },
  },
  Base: {
    carriers: { monthlyVisitors: 5000, conversionRate: 2, plusShare: 80 },
    makers: { monthlyVisitors: 300, conversionRate: 6, plusShare: 15 },
  },
  Optimistic: {
    carriers: { monthlyVisitors: 12000, conversionRate: 4, plusShare: 70 },
    makers: { monthlyVisitors: 800, conversionRate: 10, plusShare: 10 },
  },
};

export type SegmentResult = {
  payingCustomers: number;
  plusCustomers: number;
  studioCustomers: number;
  monthlyRevenue: number;
};

export type RevenueResult = {
  segments: Record<SegmentId, SegmentResult>;
  monthlyTotal: number;
  annualTotal: number;
};

const PLUS_PRICE = TIERS.find((tier) => tier.id === "plus")!.monthlyPrice;
const STUDIO_PRICE = TIERS.find((tier) => tier.id === "studio")!.monthlyPrice;

export function calculateSegment(input: SegmentAssumptions): SegmentResult {
  const payingCustomers = input.monthlyVisitors * (input.conversionRate / 100);
  const plusCustomers = payingCustomers * (input.plusShare / 100);
  const studioCustomers = payingCustomers - plusCustomers;
  const monthlyRevenue = plusCustomers * PLUS_PRICE + studioCustomers * STUDIO_PRICE;
  return { payingCustomers, plusCustomers, studioCustomers, monthlyRevenue };
}

export function calculateRevenue(assumptions: Assumptions): RevenueResult {
  const carriers = calculateSegment(assumptions.carriers);
  const makers = calculateSegment(assumptions.makers);
  const monthlyTotal = carriers.monthlyRevenue + makers.monthlyRevenue;
  return {
    segments: { carriers, makers },
    monthlyTotal,
    annualTotal: monthlyTotal * 12,
  };
}
