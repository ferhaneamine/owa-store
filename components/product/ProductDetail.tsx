"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import { Product } from "@/types";
import { formatDZD, cn } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import ProductCard from "@/components/product/ProductCard";
import Stamp from "@/components/ui/Stamp";
import { useCart } from "@/lib/store/cart";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [size, setSize] = useState(
    product.sizes.find((s) => s.stock > 0)?.size ?? product.sizes[0]?.size
  );
  const [quantity, setQuantity] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const addLine = useCart((s) => s.addLine);
  const openCart = useCart((s) => s.open);

  const selectedVariant = product.sizes.find((s) => s.size === size);

  const hasRealImages = product.images.length > 0 && !!product.images[0]?.url;
  const gallery = hasRealImages
    ? product.images
    : [0, 1, 2, 3].map((i) => ({ url: "", alt: product.name, publicId: String(i) }));

  const handleAddToCart = () => {
    if (!size || !selectedVariant || selectedVariant.stock < 1) return;
    addLine({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size,
      color: product.colors[0] ?? "Noir",
      quantity,
      image: product.images[0]?.url ?? "",
    });
    openCart();
  };

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-widest2 text-ash">
          <Link href="/boutique" className="hover:text-signal">
            Boutique
          </Link>{" "}
          / {product.name}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-concrete">
              {product.isNewArrival && (
                <Stamp className="absolute left-4 top-4 z-10" filled>
                  Nouveau
                </Stamp>
              )}
              <ProductImage
                url={gallery[activeImage]?.url}
                alt={gallery[activeImage]?.alt || `${product.name} — vue ${activeImage + 1}`}
                label={`${product.name} — vue ${activeImage + 1}`}
                seed={`${product.slug}-${activeImage}`}
                className="h-full w-full"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  data-cursor-hover
                  className={cn(
                    "aspect-square overflow-hidden border",
                    activeImage === i ? "border-signal" : "border-transparent"
                  )}
                >
                  <ProductImage
                    url={img.url}
                    alt={img.alt || `${product.name} ${i + 1}`}
                    label={`${i + 1}`}
                    seed={`${product.slug}-thumb-${i}`}
                    className="h-full w-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="font-display text-4xl uppercase leading-none md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 font-mono text-lg">{formatDZD(product.price)}</p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ash">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest2">
                  Taille
                </span>
                <Link
                  href="/guide-tailles"
                  className="font-mono text-[11px] uppercase tracking-widest2 text-ash underline hover:text-signal"
                >
                  Guide des tailles
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSize(s.size)}
                    disabled={s.stock === 0}
                    data-cursor-hover
                    className={cn(
                      "min-w-[52px] border px-4 py-2 font-mono text-xs uppercase",
                      s.stock === 0 && "cursor-not-allowed opacity-30 line-through",
                      size === s.size
                        ? "border-signal text-signal"
                        : "hairline hover:border-bone"
                    )}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                <p className="mt-2 font-mono text-[11px] text-signal">
                  Plus que {selectedVariant.stock} en stock
                </p>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-4 border hairline px-4 py-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuer"
                  data-cursor-hover
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Augmenter"
                  data-cursor-hover
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock < 1}
                data-cursor-hover
                className="flex-1 bg-signal py-4 font-mono text-xs uppercase tracking-widest2 text-ink transition-colors hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                {selectedVariant && selectedVariant.stock > 0
                  ? "Ajouter au panier"
                  : "Épuisé"}
              </button>
              <button
                onClick={() => setFavorited((v) => !v)}
                aria-label="Favoris"
                data-cursor-hover
                className="border hairline p-4 hover:border-signal"
              >
                <Heart
                  className={cn("h-4 w-4", favorited && "fill-signal text-signal")}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t hairline pt-6 text-xs text-ash">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" strokeWidth={1.5} />
                Livraison à domicile ou retrait au bureau — toutes wilayas
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                Retours sous 7 jours si l&apos;étiquette est intacte
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="mb-8 font-display text-3xl uppercase md:text-4xl">
              Complète le look
            </h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
