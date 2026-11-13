import Link from "next/link";
import { AGENTS } from "@/lib/siteMap";

export default function AgentMap() {
  return (
    <section aria-label="Agent map" className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Agent map</h2>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
          All agents are rule-based, not AI
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        Six small agents share one database. Each one takes an input, applies fixed rules, returns an
        output, and saves it. A person stays in control at every step.
      </p>

      <div className="mt-5 rounded-xl border border-accent/40 bg-accent/5 p-3 text-center text-sm font-medium">
        Visitor
      </div>
      <div aria-hidden className="py-1 text-center text-muted">↓</div>

      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((agent) => (
          <li key={agent.name} className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{agent.name}</p>
              <Link href={agent.page} className="text-xs font-medium text-accent hover:underline">
                {agent.page === "/" ? "Home" : agent.page}
              </Link>
            </div>
            <dl className="mt-3 space-y-2 text-xs">
              <div>
                <dt className="font-medium">In</dt>
                <dd className="text-muted">{agent.input}</dd>
              </div>
              <div>
                <dt className="font-medium">Out</dt>
                <dd className="text-muted">{agent.output}</dd>
              </div>
              <div>
                <dt className="font-medium">Human checkpoint</dt>
                <dd className="text-muted">{agent.checkpoint}</dd>
              </div>
              <div>
                <dt className="font-medium">Saves to</dt>
                <dd className="text-muted">
                  <code>{agent.saves}</code> · logic in <code>{agent.logic}</code>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <div aria-hidden className="py-1 text-center text-muted">↓</div>
      <div className="rounded-xl border border-accent/40 bg-accent/5 p-3 text-center text-sm">
        <span className="font-medium">Supabase database</span> · public visitors can add records; chat,
        feedback, and ratings are write-only
      </div>
    </section>
  );
}
