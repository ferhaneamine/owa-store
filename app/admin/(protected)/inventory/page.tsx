"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Product } from "@/types";
import { products as mockProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data.products || data.products.length === 0) throw new Error();
        setProducts(data.products);
      })
      .catch(() => {
        setProducts(mockProducts);
        setUsingMock(true);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Stock</h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-ash">
        Niveaux de stock par taille {usingMock && "· données de démo"}
      </p>

      <div className="mt-8 overflow-x-auto border hairline">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b hairline font-mono text-[11px] uppercase tracking-widest2 text-ash">
              <th className="p-4">Produit</th>
              <th className="p-4">Tailles &amp; Stock</th>
              <th className="p-4">Total</th>
              <th className="p-4">Modifier</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const total = p.sizes.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p._id} className="border-b hairline last:border-none">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {p.sizes.map((s) => (
                        <span
                          key={s.size}
                          className={cn(
                            "border px-2 py-1 font-mono text-[10px]",
                            s.stock === 0
                              ? "border-signal text-signal"
                              : s.stock <= 5
                              ? "border-ash text-ash"
                              : "hairline text-bone/70"
                          )}
                        >
                          {s.size}: {s.stock}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={cn("p-4", total === 0 && "text-signal")}>{total}</td>
                  <td className="p-4">
                    <Link href={`/admin/products/${p.slug}`} aria-label="Modifier le stock">
                      <Pencil className="h-4 w-4 text-ash hover:text-bone" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
