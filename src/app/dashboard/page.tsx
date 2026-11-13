import Dashboard from "@/components/Dashboard";
import { IMPACT_CHECK } from "@/lib/siteMap";

export const metadata = {
  title: "Dashboard — Purse It",
  description: "Live records, testing results, and the practical impact check for Purse It.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">Dashboard</p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
        What Purse It has recorded, tested, and checked
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Everything every page of the product has saved so far, how it was tested, and what could go
        wrong.
      </p>

      <div className="mt-10">
        <Dashboard />
      </div>

      <section aria-label="Practical impact check" className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold tracking-tight">Practical impact check</h2>
        <p className="mt-1 text-sm text-muted">
          Who could be hurt, how Purse It prevents it, and what is still a limit.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {IMPACT_CHECK.map((item) => (
            <div key={item.risk} className="rounded-xl border border-border bg-background p-5">
              <h3 className="font-medium">{item.risk}</h3>
              <p className="mt-2 text-sm text-muted">{item.handling}</p>
              <p className="mt-3 text-xs text-muted">
                <span className="font-medium text-foreground">Still a limit:</span> {item.limit}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
