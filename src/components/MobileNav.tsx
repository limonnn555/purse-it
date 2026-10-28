"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

export default function MobileNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  // Keying on the path remounts the menu, so it closes after navigating.
  return (
    <details key={pathname} className="relative md:hidden">
      <summary className="cursor-pointer list-none rounded-full border border-border px-4 py-2 text-sm font-medium">
        Menu
      </summary>
      <ul className="absolute right-0 z-10 mt-2 w-48 rounded-2xl border border-border bg-surface p-2 shadow-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-background"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
