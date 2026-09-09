import Link from "next/link";
import BagDesigner from "@/components/BagDesigner";

const users = [
  "Students",
  "Doctors",
  "Athletes",
  "Business owners",
  "Working moms",
  "Architects",
  "Freelancers",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Purse It
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Design the perfect bag for what you carry every day
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Tell us what you carry and what size bag you want. Purse It
            instantly builds a design with a compartment made for each item.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#disenar"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Design my bag
            </a>
            <Link
              href="/docs"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-background"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section id="disenar" className="mx-auto w-full max-w-5xl px-6 py-16">
        <BagDesigner />
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Made for
          </h2>
          <p className="mt-2 text-muted">
            Anyone who carries the same important items every day and wants
            a bag made to fit their life.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {users.map((user) => (
              <li
                key={user}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted"
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Design principle
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          The experience is intuitive and uses few materials and colors. The
          goal is for you to forget you&apos;re using a tool and focus only
          on how practical the design you get really is.
        </p>
      </section>
    </div>
  );
}
