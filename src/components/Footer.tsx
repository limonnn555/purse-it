import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Bag designer" },
      { href: "/core", label: "Design core" },
      { href: "/product", label: "Product map" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Learn more",
    links: [
      { href: "/docs", label: "How it works" },
      { href: "/research", label: "Market research" },
      { href: "/marketing", label: "Marketing" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 text-sm sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-base font-semibold tracking-tight">Purse It</p>
          <p className="mt-2 max-w-xs text-muted">
            Your bag, designed around what you carry.
          </p>
          <p className="mt-3 inline-block rounded-full border border-border px-3 py-1 text-xs text-muted">
            Early access
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="font-medium">{column.title}</p>
            <ul className="mt-3 space-y-2 text-muted">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-5xl px-6 py-4 text-xs text-muted">
          © {new Date().getFullYear()} Purse It. Designs made to fit what you carry every day.
        </p>
      </div>
    </footer>
  );
}
