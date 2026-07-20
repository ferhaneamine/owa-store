import Link from "next/link";
import { Instagram, Music2, Facebook } from "lucide-react";

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { label: "Tous les produits", href: "/boutique" },
      { label: "Hoodies", href: "/boutique?category=hoodie" },
      { label: "T-Shirts", href: "/boutique?category=tshirt" },
      { label: "Accessoires", href: "/boutique?category=accessory" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Livraison & Retours", href: "/livraison" },
      { label: "Guide des tailles", href: "/guide-tailles" },
      { label: "Paiement", href: "/paiement" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Toutes les collections", href: "/collections" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t hairline bg-ink px-5 pb-8 pt-16 md:px-10">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-10 md:grid-cols-5">
        <div className="col-span-2 md:col-span-2">
          <span className="stamp inline-flex h-16 w-28 items-center justify-center font-display text-xl">
            O.W.A
          </span>
          <p className="mt-4 max-w-xs text-sm text-ash">
            Streetwear premium. Nouvelles pièces chaque mois.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="#" aria-label="Instagram" data-cursor-hover>
              <Instagram className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="TikTok" data-cursor-hover>
              <Music2 className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="Facebook" data-cursor-hover>
              <Facebook className="h-5 w-5" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-[11px] uppercase tracking-widest2 text-bone/50">
              {col.title}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-bone/80 transition-colors hover:text-signal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <h4 className="font-mono text-[11px] uppercase tracking-widest2 text-bone/50">
            Newsletter
          </h4>
          <p className="mt-4 text-sm text-ash">Les drops avant tout le monde.</p>
          <form className="mt-4 flex border-b hairline pb-2">
            <input
              type="email"
              placeholder="Ton email"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ash"
            />
            <button type="submit" className="font-mono text-xs text-signal" data-cursor-hover>
              →
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1600px] flex-col items-start justify-between gap-4 border-t hairline pt-6 text-xs text-ash md:flex-row md:items-center">
        <p>© 2026 O.W.A — Oranais With Attitude. Tous droits réservés.</p>
        <div className="flex gap-6">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
