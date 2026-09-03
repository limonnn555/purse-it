import CoreAgent from "@/components/CoreAgent";

export const metadata = {
  title: "Núcleo — Purse It",
};

export default function CorePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Núcleo de diseño
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
        Convierte tu rutina en principios de diseño para tu bolsa
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Cuéntanos cómo es tu día y qué cargas. Purse It extrae el núcleo de
        diseño detrás de la bolsa ideal para ti — y lo guarda para que lo
        consultes cuando quieras.
      </p>

      <div className="mt-10">
        <CoreAgent />
      </div>
    </div>
  );
}
