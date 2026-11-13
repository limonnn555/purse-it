import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { NAV_LINKS as links } from "@/lib/siteMap";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Purse It
        </Link>
        <nav className="hidden xl:block" aria-label="Main">
          <ul className="flex items-center gap-5 text-sm text-muted">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav links={links} />
      </div>
    </header>
  );
}
