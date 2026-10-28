export const metadata = {
  title: "Docs — Purse It",
};

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Docs
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        How does Purse It work?
      </h1>
      <p className="mt-4 text-muted">
        Purse It turns a list of items into a bag design with a compartment
        dedicated to everything you carry.
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">1. Tell us what you carry</h2>
          <p className="mt-2 text-sm text-muted">
            Choose the bag size you&apos;re looking for and check off the
            items you carry every day. You can also type in items that
            aren&apos;t on the list.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">2. We generate the design</h2>
          <p className="mt-2 text-sm text-muted">
            Each item gets assigned to a zone of the bag (main compartment,
            front pocket, side pocket, or inner organizer) based on how
            quickly you need to reach it.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">3. We save your design</h2>
          <p className="mt-2 text-sm text-muted">
            If Purse It is connected to a database, every design you
            generate is saved with the bag size and items chosen, so you can
            review it later.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">4. Design core (/core)</h2>
          <p className="mt-2 text-sm text-muted">
            On <code>/core</code> you describe, in your own words, what your
            day looks like and what you carry. <code>src/lib/coreEngine.ts</code>{" "}
            scans that text for keywords (office/laptop, travel/passport,
            exercise/sports, small items like keys or makeup, etc.) and
            builds a &ldquo;design core&rdquo;: a title, the bag zone you
            should prioritize, 3-4 principles, and a one-line summary. It
            doesn&apos;t use a real AI model — it&apos;s rule-based logic,
            so the result stays consistent and explainable. Every generated
            core can be saved to Supabase&apos;s <code>core_outputs</code>{" "}
            table.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">5. Research + Benchmarking (/research)</h2>
          <p className="mt-2 text-sm text-muted">
            <code>/research</code> tracks how Purse It compares to other ways
            people already solve &ldquo;what should I carry this in&rdquo;:
            global examples of similar products, direct competitors, and
            substitutes people might pick instead (from generic backpacks to
            packing organizers). Each entry has a category, a region, and a
            risk level, and the page lets you filter, search, and add new
            entries yourself — everything is saved to Supabase&apos;s{" "}
            <code>research_entries</code> table.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">6. Product + Pricing (/product, /pricing)</h2>
          <p className="mt-2 text-sm text-muted">
            <code>/product</code> maps every feature to the plan that includes
            it (Free, Plus, or Studio) and shows whether it is live or
            planned. <code>/pricing</code> is a revenue simulator: pick a
            Conservative, Base, or Optimistic scenario, or edit visitors,
            conversion, and plan mix for each of the two customer segments
            (Everyday Carriers and Bag Makers). The math lives in{" "}
            <code>src/lib/pricingEngine.ts</code> and the figures are
            simulations, not real sales. Scenarios you name and save go to
            Supabase&apos;s <code>pricing_scenarios</code> table.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">7. Marketing engine (/marketing)</h2>
          <p className="mt-2 text-sm text-muted">
            <code>/marketing</code> is the content system for launching Purse
            It: a brand system, a target persona, landing page copy, 10 social
            posts, 3 video scripts, and a 14-day campaign calendar. All of it
            is template-generated from real product facts (in{" "}
            <code>src/lib/marketingContent.ts</code>), not produced by an AI
            model. Every card can be copied, exported as Markdown, or saved to
            Supabase&apos;s <code>marketing_assets</code> table. The page also
            shows two live A/B tests that run on the home page (headline and
            button label). Each visitor is assigned one variant, and views and
            clicks are stored once per visitor in <code>ab_events</code>. A
            view is only counted after the visitor first scrolls, moves the
            mouse, touches the screen, or presses a key, so automated page
            checks are not counted. Visiting <code>/?ab_test=1</code> marks a browser as a test
            session, which is excluded from the results.
          </p>
        </div>
      </div>
    </div>
  );
}
