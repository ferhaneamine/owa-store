import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function LatestDrop({ products }: { products: Product[] }) {
  const latest = products.filter((p) => p.isNewArrival).slice(0, 4);
  if (latest.length === 0) return null;
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <RevealOnScroll className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-signal">
              Nouvelle Collection
            </span>
            <h2 className="mt-2 font-display text-4xl uppercase md:text-6xl">
              Dernier Drop
            </h2>
          </div>
          <Link
            href="/boutique"
            data-cursor-hover
            className="hidden font-mono text-xs uppercase tracking-widest2 text-signal md:block"
          >
            Voir tout →
          </Link>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {latest.map((product, i) => (
            <RevealOnScroll key={product._id} delay={i * 0.08}>
              <ProductCard product={product} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
