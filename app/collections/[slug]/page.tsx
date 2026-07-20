import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductImage from "@/components/ui/ProductImage";
import ProductCard from "@/components/product/ProductCard";
import { getCollectionBySlug, getProducts } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { collection } = await getCollectionBySlug(slug);
  return { title: collection?.name ?? "Collection" };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { collection } = await getCollectionBySlug(slug);
  if (!collection) notFound();
  const { products: items } = await getProducts({ collectionSlug: slug });

  return (
    <div className="pb-24 pt-20">
      <div className="relative flex h-[70vh] items-end overflow-hidden">
        <ProductImage
          url={collection.coverImage?.url}
          alt={collection.coverImage?.alt || collection.name}
          label={collection.name}
          seed={collection.slug}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bone via-bone/50 to-transparent" />
        <div className="relative z-10 px-5 pb-14 text-ink md:px-10">
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-signal">
            {collection.tagline}
          </span>
          <h1 className="mt-2 font-display text-6xl uppercase md:text-8xl">
            {collection.name}
          </h1>
          <p className="mt-4 max-w-lg text-ink/80">{collection.description}</p>
        </div>
      </div>

      <div className="px-5 pt-16 md:px-10">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center font-mono text-sm uppercase tracking-widest2 text-ash">
            Nouveaux produits bientôt disponibles dans cette collection
          </p>
        )}
      </div>
    </div>
  );
}
