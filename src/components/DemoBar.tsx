"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readDone, readStep, readTester, writeDone, writeStep } from "@/lib/demoSession";
import { DEMO_STEPS, demoHref } from "@/lib/siteMap";

// Shown at the bottom of every page a visitor opens from the guided demo,
// so there is always one obvious way back.
export default function DemoBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    if (pathname === "/demo") {
      writeStep(null);
      Promise.resolve().then(() => setStep(null));
      return;
    }
    let fromUrl: number | null = null;
    try {
      const value = Number(new URLSearchParams(window.location.search).get("demo"));
      if (Number.isInteger(value) && value >= 1 && value <= DEMO_STEPS.length) fromUrl = value;
    } catch {
      fromUrl = null;
    }
    if (fromUrl !== null) {
      writeStep(fromUrl);
      // The page can jump to its #anchor before the layout has settled; re-scroll once it has.
      const anchor = window.location.hash.slice(1);
      if (anchor) {
        window.setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ block: "start" }), 600);
      }
    }
    const current = fromUrl ?? readStep();
    const valid = current !== null && current <= DEMO_STEPS.length ? current : null;
    Promise.resolve().then(() => setStep(valid));
  }, [pathname]);

  if (step === null) return null;

  const info = DEMO_STEPS[step - 1];
  const last = step === DEMO_STEPS.length;

  function markDone() {
    const done = readDone(DEMO_STEPS.length);
    done[step! - 1] = true;
    writeDone(done);
  }

  function next() {
    markDone();
    if (last) {
      router.push("/demo");
    } else {
      router.push(demoHref(DEMO_STEPS[step!].href, step! + 1, readTester()));
    }
  }

  return (
    <>
      <div aria-hidden className="h-40 sm:h-24" />
      <div
        role="navigation"
        aria-label="Guided demo"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] backdrop-blur"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="max-w-xl text-sm">
            <p>
              <span className="font-medium text-accent">Guided demo</span>
              <span className="text-muted">
                {" "}
                · Step {step} of {DEMO_STEPS.length}: {info.title}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted">
              <span className="font-medium text-foreground">What to do:</span> {info.action}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-background"
            >
              ← Back to the demo
            </Link>
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              {last ? "Done, finish and rate" : "Done, next step →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
