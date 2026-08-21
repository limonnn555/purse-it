export const metadata = {
  title: "Roadmap — Purse It",
};

const roadmap = [
  {
    phase: "Hoy",
    status: "Disponible",
    items: [
      "Elegir tamaño de bolsa y objetos diarios",
      "Generar un diseño con compartimentos asignados",
      "Guardar cada diseño generado",
    ],
  },
  {
    phase: "Próximamente",
    status: "En desarrollo",
    items: [
      "Vista previa más realista del diseño (colores, materiales)",
      "Guardar y comparar varios diseños por usuario",
      "Compartir el diseño generado como imagen",
    ],
  },
  {
    phase: "Más adelante",
    status: "Explorando",
    items: [
      "Cotización estimada de fabricación por diseño",
      "Recomendaciones según el estilo de vida del usuario",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Roadmap
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Hacia dónde va Purse It
      </h1>
      <p className="mt-4 text-muted">
        Así es como planeamos seguir mejorando la forma en que se diseñan
        bolsas a la medida.
      </p>

      <ol className="mt-10 space-y-6">
        {roadmap.map((phase) => (
          <li
            key={phase.phase}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{phase.phase}</h2>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                {phase.status}
              </span>
            </div>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
