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
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-medium">4. Núcleo de diseño (/core)</h2>
          <p className="mt-2 text-sm text-muted">
            En <code>/core</code> describes con tus propias palabras cómo es
            tu día y qué cargas. <code>src/lib/coreEngine.ts</code> busca
            palabras clave en ese texto (oficina/laptop, viaje/pasaporte,
            ejercicio/deporte, objetos chicos como llaves o maquillaje, etc.)
            y arma un &ldquo;núcleo de diseño&rdquo;: un título, la zona de
            la bolsa que deberías priorizar, 3-4 principios y una frase
            resumen. No usa un modelo de IA real — es lógica basada en
            reglas, para que el resultado sea consistente y explicable. Cada
            núcleo generado se puede guardar en la tabla{" "}
            <code>core_outputs</code> de Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}
