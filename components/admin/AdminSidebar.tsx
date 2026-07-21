"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Boxes,
  Layers, LogOut, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: Layers },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/inventory", label: "Stock", icon: Boxes },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar({
  adminName,
  adminEmail,
}: {
  adminName?: string;
  adminEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <aside className="hidden w-64 flex-col border-r hairline bg-concrete px-6 py-8 md:flex">
      <Link href="/" className="mb-10 flex flex-col leading-none">
        <span className="font-display text-xl">O.W.A</span>
        <span className="font-mono text-[8px] uppercase tracking-widest2 text-signal">
          Admin
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-widest2",
                active ? "bg-signal text-ink" : "text-ash hover:text-bone"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {(adminName || adminEmail) && (
        <div className="mb-3 border-t hairline pt-4">
          <p className="text-xs">{adminName}</p>
          <p className="font-mono text-[10px] text-ash">{adminEmail}</p>
        </div>
      )}

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-widest2 text-ash hover:text-signal"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        Déconnexion
      </button>
    </aside>
  );
}
