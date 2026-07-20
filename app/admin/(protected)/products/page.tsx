"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Product } from "@/types";
import { products as mockProducts } from "@/lib/mock-data";
import { formatDZD } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (!data.products || data.products.length === 0) throw new Error();
        setProducts(data.products);
      })
      .catch(() => {
        setProducts(mockProducts);
        setUsingMock(true);
      });
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    setProducts((p) => p.filter((prod) => prod.slug !== slug));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase">Produits</h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-ash">
            {products.length} produit(s) {usingMock && "· données de démo"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-signal px-5 py-3 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink"
        >
          <Plus className="h-4 w-4" /> Nouveau
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border hairline">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b hairline font-mono text-[11px] uppercase tracking-widest2 text-ash">
              <th className="p-4">Produit</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Prix</th>
              <th className="p-4">Stock total</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const totalStock = p.sizes.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p._id} className="border-b hairline last:border-none">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4 capitalize text-ash">{p.category}</td>
                  <td className="p-4">{formatDZD(p.price)}</td>
                  <td className="p-4">
                    <span className={totalStock === 0 ? "text-signal" : ""}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/products/${p.slug}`} aria-label="Modifier">
                        <Pencil className="h-4 w-4 text-ash hover:text-bone" />
                      </Link>
                      <button onClick={() => handleDelete(p.slug)} aria-label="Supprimer">
                        <Trash2 className="h-4 w-4 text-ash hover:text-signal" />
                      </button>
                    </div>
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
