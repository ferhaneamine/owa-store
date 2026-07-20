"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/collections", label: "Collections" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lines, open } = useCart();
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b hairline bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex flex-col leading-none" data-cursor-hover>
          <span className="font-display text-2xl tracking-tight">O.W.A</span>
          <span className="font-mono text-[8px] uppercase tracking-widest2 text-signal">
            Oranais With Attitude
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor-hover
              className="font-mono text-[11px] uppercase tracking-widest2 text-bone/80 transition-colors hover:text-signal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button aria-label="Rechercher" data-cursor-hover className="hidden md:block">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <Link href="/favoris" aria-label="Favoris" data-cursor-hover className="hidden md:block">
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <button
            aria-label="Panier"
            data-cursor-hover
            onClick={open}
            className="relative"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-signal font-mono text-[9px] text-ink">
                {itemCount}
              </span>
            )}
          </button>
          <button
            aria-label="Menu"
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t hairline bg-ink px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl uppercase"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
