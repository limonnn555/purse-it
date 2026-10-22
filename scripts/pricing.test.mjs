import test from "node:test";
import assert from "node:assert/strict";
import { calculateRevenue, SCENARIOS } from "../src/lib/pricingEngine.ts";

test("Base scenario produces the expected monthly and annual revenue", () => {
  const result = calculateRevenue(SCENARIOS.Base);

  // Everyday Carriers: 5000 visitors x 2% = 100 paying; 80 Plus x 99 + 20 Studio x 299 = 13,900
  assert.equal(Math.round(result.segments.carriers.monthlyRevenue), 13900);
  // Bag Makers: 300 x 6% = 18 paying; 2.7 Plus x 99 + 15.3 Studio x 299 = 4,842
  assert.equal(Math.round(result.segments.makers.monthlyRevenue), 4842);
  assert.equal(Math.round(result.monthlyTotal), 18742);
  assert.equal(Math.round(result.annualTotal), 224904);
});

test("Annual revenue is 12x monthly, zero conversion earns nothing, and scenarios are ordered", () => {
  const base = calculateRevenue(SCENARIOS.Base);
  assert.equal(base.annualTotal, base.monthlyTotal * 12);

  const noConversion = calculateRevenue({
    carriers: { monthlyVisitors: 5000, conversionRate: 0, plusShare: 80 },
    makers: { monthlyVisitors: 300, conversionRate: 0, plusShare: 15 },
  });
  assert.equal(noConversion.monthlyTotal, 0);

  const conservative = calculateRevenue(SCENARIOS.Conservative).monthlyTotal;
  const optimistic = calculateRevenue(SCENARIOS.Optimistic).monthlyTotal;
  assert.ok(conservative < base.monthlyTotal && base.monthlyTotal < optimistic);
});
