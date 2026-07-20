"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";
import { products as mockProducts } from "@/lib/mock-data";
import { Order, Product } from "@/types";
import { formatDZD } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setUsingMock(true));

    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.products?.length) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  const revenue = orders
    ? orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.total, 0)
    : null;
  const pendingCount = orders ? orders.filter((o) => o.status === "pending").length : null;

  const STATS = [
    {
      label: "Ventes (total)",
      value: revenue !== null ? formatDZD(revenue) : "—",
      icon: TrendingUp,
    },
    {
      label: "Commandes",
      value: orders !== null ? String(orders.length) : "—",
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    { label: "Produits actifs", value: String(products.length), icon: Package, href: "/admin/products" },
    {
      label: "En attente",
      value: pendingCount !== null ? String(pendingCount) : "—",
      icon: Users,
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Dashboard</h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-ash">
        Vue d&apos;ensemble
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          const content = (
            <div className="border hairline p-5 transition-colors hover:border-signal">
              <Icon className="h-5 w-5 text-signal" strokeWidth={1.5} />
              <p className="mt-4 font-display text-2xl">{s.value}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-ash">
                {s.label}
              </p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href}>{content}</Link>
          ) : (
            <div key={s.label}>{content}</div>
          );
        })}
      </div>

      {usingMock && (
        <div className="mt-10 border hairline p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-ash">
            Note de configuration
          </p>
          <p className="mt-3 max-w-2xl text-sm text-ash">
            MongoDB n&apos;est pas encore connecté — les commandes et le
            chiffre d&apos;affaires ne peuvent pas être calculés. Ajoute
            MONGODB_URI dans .env.local pour voir des chiffres réels ici.
          </p>
        </div>
      )}
    </div>
  );
}
