export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Purse It.</p>
        <p>Diseños hechos a la medida de lo que cargas todos los días.</p>
      </div>
    </footer>
  );
}
