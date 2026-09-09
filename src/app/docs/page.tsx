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
      </div>
    </div>
  );
}
