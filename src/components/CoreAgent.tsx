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
  return new Date(iso).toLocaleDateString("es-MX", {
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
        <h2 className="text-lg font-semibold">Cuéntanos de ti</h2>
        <p className="mt-1 text-sm text-muted">
          Describe cómo es tu día y qué cargas. Entre más detalle des, más
          preciso será tu núcleo de diseño. Por ejemplo: rutina de oficina,
          de viaje, de ejercicio o de escuela.
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium" htmlFor="core-intake">
            ¿Cómo es tu día a día?
          </label>
          <textarea
            id="core-intake"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ej. Trabajo en oficina, cargo laptop y llego en bici. Los fines de semana salgo con cámara y agua."
            rows={7}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Generar bolsa ideal
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Tu núcleo de diseño</h2>

        {!core && (
          <p className="mt-4 text-sm text-muted">
            Llena el formulario y dale clic a &ldquo;Generar bolsa
            ideal&rdquo; para ver tu núcleo de diseño aquí.
          </p>
        )}

        {core && (
          <div className="mt-4">
            <p className="text-base font-semibold">{core.title}</p>
            <p className="mt-1 text-sm font-medium text-accent">
              Zona prioritaria — {core.zoneLabel}
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

            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="mt-6 w-full rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-background disabled:opacity-50"
            >
              {saveState === "saving" ? "Guardando..." : "Guardar este núcleo"}
            </button>

            {saveState === "saved" && (
              <p className="mt-3 text-center text-xs text-muted">
                Núcleo guardado en tu base de datos.
              </p>
            )}
            {saveState === "error" && (
              <p className="mt-3 text-center text-xs text-muted">
                No se pudo guardar en la base de datos (revisa la conexión a
                Supabase), pero tu núcleo sigue visible arriba.
              </p>
            )}
          </div>
        )}
      </div>

      {savedList.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Núcleos guardados</h2>
          <p className="mt-1 text-sm text-muted">
            Los últimos núcleos generados, más reciente primero.
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
