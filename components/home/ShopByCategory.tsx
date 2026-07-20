import Link from "next/link";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const CATEGORIES = [
  { label: "Hoodies", value: "hoodie" },
  { label: "T-Shirts", value: "tshirt" },
  { label: "Pantalons", value: "pants" },
  { label: "Accessoires", value: "accessory" },
];

export default function ShopByCategory() {
  return (
    <section className="border-t hairline bg-concrete px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <RevealOnScroll className="mb-10">
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-signal">
            Catégories
          </span>
          <h2 className="mt-2 font-display text-4xl uppercase md:text-6xl">
            Shop by Category
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <RevealOnScroll key={c.value} delay={i * 0.06}>
              <Link
                href={`/boutique?category=${c.value}`}
                data-cursor-hover
                className="group block"
              >
                <ImagePlaceholder
                  label={c.label}
                  seed={c.value}
                  className="aspect-[3/4] transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <p className="mt-3 font-mono text-xs uppercase tracking-widest2">
                  {c.label}
                </p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
