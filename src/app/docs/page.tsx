export const metadata = {
  title: "Docs — Purse It",
};

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Docs
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        ¿Cómo funciona Purse It?
      </h1>
      <p className="mt-4 text-muted">
        Purse It convierte una lista de objetos en un diseño de bolsa con un
        compartimento dedicado a cada cosa que cargas.
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">1. Cuéntanos qué cargas</h2>
          <p className="mt-2 text-sm text-muted">
            Elige el tamaño de bolsa que buscas y marca los objetos que
            llevas contigo todos los días. También puedes escribir objetos
            que no estén en la lista.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">2. Generamos el diseño</h2>
          <p className="mt-2 text-sm text-muted">
            Cada objeto se asigna a una zona de la bolsa (compartimento
            principal, bolsillo frontal, bolsillo lateral u organizador
            interior) según qué tan rápido necesitas acceder a él.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">3. Guardamos tu diseño</h2>
          <p className="mt-2 text-sm text-muted">
            Si Purse It está conectado a una base de datos, cada diseño que
            generas se guarda con el tamaño de bolsa y los objetos elegidos,
            para poder revisarlo más adelante.
          </p>
        </div>
      </div>
    </div>
  );
}
