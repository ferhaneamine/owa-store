import BoutiqueClient from "@/components/shop/BoutiqueClient";
import { getProducts } from "@/lib/data";

export const metadata = { title: "Boutique" };
export const dynamic = "force-dynamic";
export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { products } = await getProducts();

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10">
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-signal">
            Tous les produits
          </span>
          <h1 className="mt-2 font-display text-5xl uppercase md:text-7xl">
            Boutique
          </h1>
        </div>

        <BoutiqueClient initialProducts={products} initialCategory={category} />
      </div>
    </div>
  );
}
