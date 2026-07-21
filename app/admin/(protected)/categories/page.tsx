"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types";
import { categories as mockCategories } from "@/lib/mock-data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [usingMock, setUsingMock] = useState(false);

  const load = () => {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data.categories || data.categories.length === 0) {
          throw new Error();
        }

        setCategories(data.categories);
        setUsingMock(false);
      })
      .catch(() => {
        setCategories(mockCategories);
        setUsingMock(true);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;

    const res = await fetch(`/api/categories/${slug}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Impossible de supprimer");
      return;
    }

    setCategories((prev) => prev.filter((c) => c.slug !== slug));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase">
            Catégories
          </h1>

          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-ash">
            {categories.length} catégorie(s){" "}
            {usingMock && "· données de démo"}
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-signal px-5 py-3 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink"
        >
          <Plus className="h-4 w-4" />
          Nouvelle
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((c) => (
          <div
            key={c.slug}
            className="border hairline p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-xl uppercase">
                  {c.name}
                </p>

                <p className="mt-1 font-mono text-[11px] text-signal">
                  {c.tagline}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/categories/${c.slug}`}
                  aria-label="Modifier"
                >
                  <Pencil className="h-4 w-4 text-ash hover:text-bone" />
                </Link>

                <button
                  onClick={() => handleDelete(c.slug)}
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4 text-ash hover:text-signal" />
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm text-ash">
              {c.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}