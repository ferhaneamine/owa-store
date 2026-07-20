import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="stamp flex h-20 w-36 items-center justify-center font-display text-2xl text-signal">
        404
      </span>
      <h1 className="mt-8 font-display text-5xl uppercase md:text-7xl">
        Page introuvable
      </h1>
      <p className="mt-4 max-w-sm text-ash">
        Cette page n&apos;existe pas — ou elle a été retirée du drop.
      </p>
      <Link
        href="/"
        data-cursor-hover
        className="mt-8 bg-signal px-8 py-4 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
