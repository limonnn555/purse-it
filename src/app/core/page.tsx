import CoreAgent from "@/components/CoreAgent";

export const metadata = {
  title: "Core — Purse It",
};

export default function CorePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Design core
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
        Turn your routine into design principles for your bag
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Tell us what your day looks like and what you carry. Purse It
        extracts the design core behind your ideal bag — and saves it so you
        can look it up anytime.
      </p>

      <div className="mt-10">
        <CoreAgent />
      </div>
    </div>
  );
}
