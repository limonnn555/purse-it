"use client";

import { useState, type ReactNode } from "react";
import { copyText, downloadFile, slugify } from "@/lib/browserTools";
import { toMarkdown } from "@/lib/marketingEngine";
import { supabase } from "@/lib/supabaseClient";

export type SavedAsset = {
  id: number;
  created_at: string;
  asset_type: string;
  title: string;
  content: string;
};

type Props = {
  title: string;
  type: string;
  text: string;
  eyebrow?: string;
  children: ReactNode;
  onSaved: (asset: SavedAsset) => void;
};

const buttonClass =
  "rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-background disabled:opacity-50";

export default function ContentCard({ title, type, text, eyebrow, children, onSaved }: Props) {
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleCopy() {
    const ok = await copyText(text);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  }

  function handleExport() {
    downloadFile(
      `${slugify(title) || "asset"}.md`,
      toMarkdown([{ asset_type: type, title, content: text }], title)
    );
  }

  async function handleSave() {
    if (!supabase) {
      setSaveState("error");
      return;
    }
    setSaveState("saving");
    const { data, error } = await supabase
      .from("marketing_assets")
      .insert({ asset_type: type, title, content: text })
      .select("id, created_at, asset_type, title, content")
      .single();
    if (error || !data) {
      setSaveState("error");
      return;
    }
    onSaved(data as SavedAsset);
    setSaveState("saved");
  }

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-6">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wide text-accent">{eyebrow}</p>
      )}
      <h3 className="mt-1 text-base font-semibold">{title}</h3>
      <div className="mt-3 flex-1 text-sm text-muted">{children}</div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button type="button" onClick={handleCopy} className={buttonClass}>
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" onClick={handleExport} className={buttonClass}>
          Export .md
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === "saving"}
          className={buttonClass}
        >
          {saveState === "saving" ? "Saving..." : "Save"}
        </button>
        {saveState === "saved" && <span className="text-xs text-muted">Saved to your assets.</span>}
        {saveState === "error" && (
          <span role="status" className="text-xs text-muted">
            Couldn&apos;t save: the database didn&apos;t respond.
          </span>
        )}
      </div>
    </article>
  );
}
