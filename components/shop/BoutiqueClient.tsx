"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function BoutiqueClient({
  initialProducts,
  initialCategory,
}: {
  initialProducts: Product[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let list = [...initialProducts];
    if (category) list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest")
      list.sort((a, b) => (a.isNewArrival === b.isNewArrival ? 0 : a.isNewArrival ? -1 : 1));
    return list;
  }, [initialProducts, query, category, sort]);

  return (
    <>
      <ShopFilters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      {filtered.length === 0 ? (
        <p className="py-24 text-center font-mono text-sm uppercase tracking-widest2 text-ash">
          {initialProducts.length === 0
            ? "Aucun produit disponible pour le moment."
            : `Aucun produit trouvé pour "${query}"`}
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <RevealOnScroll key={product._id} delay={(i % 4) * 0.06}>
              <ProductCard product={product} />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </>
  );
}
