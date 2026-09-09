"use client";

import { useEffect, useState } from "react";
import { CoreOutput, generateCore } from "@/lib/coreEngine";
import { supabase } from "@/lib/supabaseClient";
import { Zone, ZONE_INFO } from "@/lib/designEngine";

type SavedCore = {
  id: number;
  created_at: string;
  input_text: string;
  title: string;
  zone: string;
  mantra: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

export default function CoreAgent() {
  const [text, setText] = useState("");
  const [core, setCore] = useState<CoreOutput | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [savedList, setSavedList] = useState<SavedCore[]>([]);

  useEffect(() => {
    async function loadSaved() {
      if (!supabase) return;
      const { data } = await supabase
        .from("core_outputs")
        .select("id, created_at, input_text, title, zone, mantra")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setSavedList(data as SavedCore[]);
    }
    loadSaved();
  }, []);

  function handleGenerate(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setCore(generateCore(text));
    setSaveState("idle");
  }

  async function handleSave() {
    if (!core || !supabase) return;
    setSaveState("saving");
    const { data, error } = await supabase
      .from("core_outputs")
      .insert({
        input_text: text,
        title: core.title,
        zone: core.zone,
        principles: core.principles,
        mantra: core.mantra,
      })
      .select("id, created_at, input_text, title, zone, mantra")
      .single();

    if (error || !data) {
      setSaveState("error");
      return;
    }
    setSaveState("saved");
    setSavedList((prev) => [data as SavedCore, ...prev].slice(0, 5));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form
        onSubmit={handleGenerate}
        className="rounded-2xl border border-border bg-surface p-6"
      >
        <h2 className="text-lg font-semibold">Tell us about yourself</h2>
        <p className="mt-1 text-sm text-muted">
          Describe what your day looks like and what you carry. The more
          detail you give, the more precise your design core will be. For
          example: an office routine, a travel routine, a workout routine,
          or a school routine.
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium" htmlFor="core-intake">
            What does your day-to-day look like?
          </label>
          <textarea
            id="core-intake"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="E.g. I work in an office, carry a laptop, and bike to work. On weekends I go out with a camera and water."
            rows={7}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Generate ideal bag
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Your design core</h2>

        {!core && (
          <p className="mt-4 text-sm text-muted">
            Fill out the form and click &ldquo;Generate ideal bag&rdquo; to
            see your design core here.
          </p>
        )}

        {core && (
          <div className="mt-4">
            <p className="text-base font-semibold">{core.title}</p>
            <p className="mt-1 text-sm font-medium text-accent">
              Priority zone — {core.zoneLabel}
            </p>

            <ul className="mt-4 space-y-2">
              {core.principles.map((principle) => (
                <li key={principle} className="flex gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {principle}
                </li>
              ))}
            </ul>

            <p className="mt-4 border-l-2 border-accent pl-3 text-sm italic text-muted">
              &ldquo;{core.mantra}&rdquo;
            </p>

            {core.isFallback && (
              <p className="mt-3 text-xs text-muted">
                We didn&apos;t detect a very specific pattern in your
                description — this is a generic core. Try adding more detail
                about your routine for a more precise one.
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="mt-6 w-full rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-background disabled:opacity-50"
            >
              {saveState === "saving" ? "Saving..." : "Save this core"}
            </button>

            {saveState === "saved" && (
              <p className="mt-3 text-center text-xs text-muted">
                Core saved to your database.
              </p>
            )}
            {saveState === "error" && (
              <p className="mt-3 text-center text-xs text-muted">
                Couldn&apos;t save to the database (check your Supabase
                connection), but your core is still visible above.
              </p>
            )}
          </div>
        )}
      </div>

      {savedList.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Saved cores</h2>
          <p className="mt-1 text-sm text-muted">
            Your most recently generated cores, newest first.
          </p>
          <div className="mt-4 space-y-2">
            {savedList.map((saved) => (
              <div
                key={saved.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-border bg-background px-4 py-3"
              >
                <span className="text-xs text-muted">
                  {formatDate(saved.created_at)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {saved.title}
                  </p>
                  <p className="truncate text-xs text-muted">
                    &ldquo;{saved.input_text}&rdquo;
                  </p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {ZONE_INFO[saved.zone as Zone]?.label ?? saved.zone}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
