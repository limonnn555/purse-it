import AgentMap from "@/components/AgentMap";
import DemoWalkthrough from "@/components/DemoWalkthrough";

export const metadata = {
  title: "Demo — Purse It",
  description: "A guided 5-minute walkthrough of everything Purse It does, with an agent map.",
};

export default function DemoPage() {
  return (
    <div className="bg-gradient-to-b from-accent/10 to-transparent">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Demo</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
          See everything Purse It does in 5 minutes
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Follow six steps through the product, from designing a bag to the records it saves, then
          rate the walkthrough. The agents behind it use simple rules, not AI, and the map below
          shows how they fit together.
        </p>

        <div className="mt-10 space-y-6">
          <DemoWalkthrough />
          <AgentMap />
        </div>
      </div>
    </div>
  );
}
