"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "", label: "Tout" },
  { value: "hoodie", label: "Hoodies" },
  { value: "tshirt", label: "T-Shirts" },
  { value: "pants", label: "Pantalons" },
  { value: "accessory", label: "Accessoires" },
];

const SORTS = [
  { value: "newest", label: "Nouveautés" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

export default function ShopFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 border-b hairline pb-8">
      <div className="flex items-center gap-3 border hairline px-4 py-3">
        <Search className="h-4 w-4 text-ash" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-ash"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => onCategoryChange(c.value)}
              data-cursor-hover
              className={cn(
                "font-mono text-[11px] uppercase tracking-widest2 px-4 py-2 border hairline",
                category === c.value
                  ? "border-signal text-signal"
                  : "text-ash hover:text-bone"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-ash" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="border hairline bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
