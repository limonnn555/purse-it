"use client";

import { useState } from "react";
import {
  BAG_SIZES,
  BagSizeId,
  GeneratedDesign,
  ITEM_OPTIONS,
  ZONE_INFO,
  Zone,
  generateDesign,
} from "@/lib/designEngine";
import { supabase } from "@/lib/supabaseClient";

const ZONE_ORDER: Zone[] = ["main", "front", "side", "inner"];

function BagDiagram({ design }: { design: GeneratedDesign }) {
  const isActive = (zone: Zone) => design.zones[zone].length > 0;

  const zoneStyle = (zone: Zone) => ({
    fill: isActive(zone) ? "var(--accent)" : "#ffffff",
    fillOpacity: isActive(zone) ? 0.18 : 1,
    stroke: isActive(zone) ? "var(--accent)" : "var(--border)",
    strokeWidth: isActive(zone) ? 2 : 1.5,
  });

  return (
    <svg
      viewBox="0 0 240 260"
      role="img"
      aria-label="Diagrama de la bolsa generada"
      className="mx-auto w-full max-w-[260px]"
    >
      {/* asas */}
      <path
        d="M85 60 C85 25, 155 25, 155 60"
        fill="none"
        stroke="var(--border)"
        strokeWidth={4}
      />
      {/* cuerpo principal */}
      <rect
        x={40}
        y={60}
        width={160}
        height={170}
        rx={20}
        style={zoneStyle("main")}
      />
      {/* organizador interior (punteado) */}
      <rect
        x={60}
        y={75}
        width={120}
        height={35}
        rx={8}
        style={zoneStyle("inner")}
        strokeDasharray="5 4"
      />
      {/* bolsillo frontal */}
      <rect
        x={60}
        y={165}
        width={120}
        height={50}
        rx={10}
        style={zoneStyle("front")}
      />
      {/* bolsillo lateral */}
      <rect
        x={188}
        y={95}
        width={26}
        height={100}
        rx={10}
        style={zoneStyle("side")}
      />
    </svg>
  );
}

export default function BagDesigner() {
  const [size, setSize] = useState<BagSizeId>("mediana");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customText, setCustomText] = useState("");
  const [design, setDesign] = useState<GeneratedDesign | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  function toggleItem(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleGenerate(event: React.FormEvent) {
    event.preventDefault();
    const result = generateDesign(size, Array.from(selected), customText);
    setDesign(result);

    if (!supabase) {
      setSaveState("idle");
      return;
    }

    setSaveState("saving");
    const { error } = await supabase.from("designs").insert({
      bag_size: result.size,
      items: Array.from(selected),
      custom_items: result.custom,
    });
    setSaveState(error ? "error" : "saved");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form
        onSubmit={handleGenerate}
        className="rounded-2xl border border-border bg-surface p-6"
      >
        <h2 className="text-lg font-semibold">¿Qué llevas todos los días?</h2>
        <p className="mt-1 text-sm text-muted">
          Selecciona tus objetos, elige un tamaño, y Purse It arma el diseño.
        </p>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium">Tamaño de bolsa</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {BAG_SIZES.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setSize(option.id)}
                className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                  size === option.id
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-background"
                }`}
              >
                <span className="block font-medium">{option.label}</span>
                <span className="block text-xs text-muted">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium">Tus objetos</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ITEM_OPTIONS.map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                  selected.has(item.id)
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-background"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-[var(--accent)]"
                  checked={selected.has(item.id)}
                  onChange={() => toggleItem(item.id)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <label className="text-sm font-medium" htmlFor="custom-items">
            ¿Algo más que quieras agregar?
          </label>
          <input
            id="custom-items"
            type="text"
            value={customText}
            onChange={(event) => setCustomText(event.target.value)}
            placeholder="Ej. red organizadora, cargador, lentes de sol"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <p className="mt-1 text-xs text-muted">
            Sepáralos con comas si quieres agregar más de uno.
          </p>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Generar diseño
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Tu diseño</h2>

        {!design && (
          <p className="mt-4 text-sm text-muted">
            Llena el formulario y dale clic a &ldquo;Generar diseño&rdquo;
            para ver la distribución de tu bolsa aquí.
          </p>
        )}

        {design && (
          <div className="mt-4">
            <BagDiagram design={design} />

            <p className="mt-4 text-center text-sm font-medium">
              Bolsa {BAG_SIZES.find((s) => s.id === design.size)?.label}
            </p>

            <div className="mt-6 space-y-4">
              {ZONE_ORDER.filter((zone) => design.zones[zone].length > 0).map(
                (zone) => (
                  <div key={zone}>
                    <p className="text-sm font-medium">
                      {ZONE_INFO[zone].label}
                    </p>
                    <p className="text-xs text-muted">{ZONE_INFO[zone].hint}</p>
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {design.zones[zone].map((label) => (
                        <li
                          key={label}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs"
                        >
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              {design.custom.length > 0 && (
                <div>
                  <p className="text-sm font-medium">
                    Compartimentos personalizados
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {design.custom.map((label) => (
                      <li
                        key={label}
                        className="rounded-full border border-dashed border-accent px-3 py-1 text-xs"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {saveState === "saved" && (
              <p className="mt-4 text-xs text-muted">
                Diseño guardado en tu base de datos.
              </p>
            )}
            {saveState === "error" && (
              <p className="mt-4 text-xs text-muted">
                No se pudo guardar en la base de datos (revisa la conexión a
                Supabase), pero tu diseño sigue visible arriba.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
