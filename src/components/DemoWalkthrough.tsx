"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MAX_COMMENT_LENGTH, containsPii, sanitizeTester } from "@/lib/chatLogic";
import { readDone, readTester, writeDone, writeTester } from "@/lib/demoSession";
import { DEMO_STEPS, demoHref } from "@/lib/siteMap";
import { supabase } from "@/lib/supabaseClient";

type FeedbackState = "idle" | "sending" | "sent" | "error" | "pii";

async function withTimeout<T>(request: PromiseLike<T>, ms = 6000): Promise<T | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));
  return Promise.race([request, timeout]);
}

export default function DemoWalkthrough() {
  const [done, setDone] = useState<boolean[]>(() => DEMO_STEPS.map(() => false));
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<FeedbackState>("idle");
  const [tester, setTester] = useState<string | null>(null);

  useEffect(() => {
    const saved = readDone(DEMO_STEPS.length);
    const tag = testerTag();
    if (tag) writeTester(tag);
    Promise.resolve().then(() => {
      setDone(saved);
      setTester(tag);
    });
  }, []);

  const finished = done.filter(Boolean).length;

  function toggle(index: number) {
    setDone((prev) => {
      const updated = prev.map((value, i) => (i === index ? !value : value));
      writeDone(updated);
      return updated;
    });
  }

  function testerTag(): string | null {
    try {
      return sanitizeTester(new URLSearchParams(window.location.search).get("t")) ?? readTester();
    } catch {
      return null;
    }
  }

  async function send() {
    if (rating === 0) return;
    if (comment.trim() && containsPii(comment)) {
      setState("pii");
      return;
    }
    if (!supabase) {
      setState("error");
      return;
    }
    setState("sending");
    const result = await withTimeout(
      supabase.from("demo_feedback").insert({
        tester: testerTag(),
        rating,
        comment: comment.trim() ? comment.trim().slice(0, MAX_COMMENT_LENGTH) : null,
      })
    );
    setState(result && !result.error ? "sent" : "error");
  }

  return (
    <div className="space-y-6">
      <section aria-label="Guided walkthrough" className="rounded-2xl border border-border border-t-4 border-t-accent bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Guided walkthrough</h2>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            {finished} of {DEMO_STEPS.length} steps done
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">
          Six short steps, about 5 minutes. Steps 1 to 3 are for you to try. Steps 4 to 6 are behind the
          scenes: just look, there is nothing to fill in. Press Open to go to a step; a bar at the bottom
          of that page brings you back here and moves you to the next one.
        </p>
        <ol className="mt-5 space-y-3">
          {DEMO_STEPS.map((step, index) => (
            <li
              key={step.title}
              className={`rounded-xl border p-4 ${done[index] ? "border-accent/40 bg-accent/5" : "border-border bg-background"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-xl">
                  <p className="text-xs font-medium uppercase tracking-wide text-accent">
                    Step {index + 1}
                    <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-[10px] normal-case tracking-normal text-muted">
                      {step.kind === "try" ? "Try it" : "Behind the scenes · just look"}
                    </span>
                  </p>
                  <p className="mt-1 font-medium">{step.title}</p>
                  <p className="mt-2 text-sm text-muted">
                    <span className="font-medium text-foreground">Do:</span> {step.action}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    <span className="font-medium text-foreground">Look for:</span> {step.look}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={demoHref(step.href, index + 1, tester)}
                    className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                  >
                    {done[index] ? "Open again" : "Open"}
                  </Link>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={done[index]}
                      onChange={() => toggle(index)}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    Done
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Rate the demo" className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">How was it?</h2>
        <p className="mt-1 text-sm text-muted">
          Rate the walkthrough from 1 to 5. Please don&apos;t include personal details; nothing is saved
          with your name.
        </p>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={rating === value}
              onClick={() => setRating(value)}
              className={`h-10 w-10 rounded-full border text-sm transition-colors ${
                rating === value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-accent/40 bg-accent/5 hover:border-accent"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <label htmlFor="demo-comment" className="mt-4 block text-sm font-medium">
          Anything unclear or missing? (optional)
        </label>
        <textarea
          id="demo-comment"
          value={comment}
          maxLength={MAX_COMMENT_LENGTH}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <p className="mt-1 text-xs text-muted">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </p>
        <button
          type="button"
          onClick={send}
          disabled={rating === 0 || state === "sending" || state === "sent"}
          className="mt-3 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send rating"}
        </button>
        <p role="status" className="mt-3 text-sm text-muted">
          {state === "sent" && "Thanks! Your rating was saved."}
          {state === "pii" && "Please remove personal details like emails or phone numbers from your comment."}
          {state === "error" && "Your rating couldn't be saved because the database didn't respond. Please try again in a minute."}
        </p>
      </section>
    </div>
  );
}
