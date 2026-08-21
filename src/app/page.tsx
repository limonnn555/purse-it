import Link from "next/link";
import BagDesigner from "@/components/BagDesigner";

const users = [
  "Estudiantes",
  "Doctores",
  "Atletas",
  "Dueños de negocio",
  "Mamás trabajadoras",
  "Arquitectos",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Purse It
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Diseña la bolsa perfecta para lo que llevas todos los días
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Dinos qué objetos cargas y de qué tamaño quieres tu bolsa. Purse
            It arma al momento un diseño con un compartimento pensado para
            cada uno de ellos.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#disenar"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Diseñar mi bolsa
            </a>
            <Link
              href="/docs"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-background"
            >
              Cómo funciona
            </Link>
          </div>
        </div>
      </section>

      <section id="disenar" className="mx-auto w-full max-w-5xl px-6 py-16">
        <BagDesigner />
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Pensado para
          </h2>
          <p className="mt-2 text-muted">
            Cualquier persona que carga los mismos objetos importantes todos
            los días y quiere una bolsa hecha a su medida.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {users.map((user) => (
              <li
                key={user}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted"
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Principio de diseño
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          La experiencia es intuitiva y usa pocos materiales y colores. La
          meta es que olvides que estás usando una herramienta y te enfoques
          únicamente en la practicidad del diseño que recibes.
        </p>
      </section>
    </div>
  );
}
