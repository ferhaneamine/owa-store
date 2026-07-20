import Link from "next/link";
import ProductImage from "@/components/ui/ProductImage";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { getCollections } from "@/lib/data";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const { collections } = await getCollections();

  return (
    <div className="pb-24 pt-32">
      <div className="mb-16 px-5 md:px-10">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-signal">
          Par collection
        </span>
        <h1 className="mt-2 font-display text-5xl uppercase md:text-7xl">
          Collections
        </h1>
      </div>

      {collections.length === 0 ? (
        <p className="px-5 font-mono text-sm uppercase tracking-widest2 text-ash md:px-10">
          Aucune catégorie pour le moment.
        </p>
      ) : (
        <div className="flex flex-col">
          {collections.map((c, i) => (
            <RevealOnScroll key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                data-cursor-hover
                className="group relative flex h-[60vh] items-end overflow-hidden border-t hairline px-5 py-10 md:px-10"
              >
                <ProductImage
                  url={c.coverImage?.url}
                  alt={c.coverImage?.alt || c.name}
                  label={c.name}
                  seed={c.slug}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bone via-bone/40 to-transparent" />
                <div className="relative z-10 text-ink">
                  <span className="font-mono text-[11px] uppercase tracking-widest2 text-signal">
                    {String(i + 1).padStart(2, "0")} — {c.tagline}
                  </span>
                  <h2 className="mt-2 font-display text-5xl uppercase md:text-7xl">
                    {c.name}
                  </h2>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      )}
    </div>
  );
}
