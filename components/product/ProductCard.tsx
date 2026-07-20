"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatDZD, cn } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import Stamp from "@/components/ui/Stamp";
import { useCart } from "@/lib/store/cart";

export default function ProductCard({ product }: { product: Product }) {
  const [favorited, setFavorited] = useState(false);
  const addLine = useCart((s) => s.addLine);
  const totalStock = product.sizes.reduce((s, v) => s + v.stock, 0);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultSize = product.sizes.find((s) => s.stock > 0);
    if (!defaultSize) return;
    addLine({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: defaultSize.size,
      color: product.colors[0] ?? "Noir",
      quantity: 1,
      image: product.images[0]?.url ?? "",
    });
  };

  return (
    <motion.div
      className="group relative"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <Link href={`/produit/${product.slug}`} data-cursor-hover className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-concrete">
          {product.isNewArrival && (
            <Stamp className="absolute left-3 top-3 z-10" filled>
              Nouveau
            </Stamp>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setFavorited((v) => !v);
            }}
            data-cursor-hover
            aria-label="Ajouter aux favoris"
            className="absolute right-3 top-3 z-10 rounded-full bg-bone/40 p-2 backdrop-blur-sm transition-colors hover:bg-bone/70"
          >
            <Heart
              className={cn(
                "h-4 w-4 text-ink",
                favorited && "fill-signal text-signal"
              )}
              strokeWidth={1.5}
            />
          </button>

          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full"
          >
            <ProductImage
              url={product.images[0]?.url}
              alt={product.images[0]?.alt || product.name}
              label={product.name}
              seed={product.slug}
              className="h-full w-full"
            />
          </motion.div>

          {totalStock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-bone/70">
              <span className="font-mono text-xs uppercase tracking-widest2 text-ink">
                Épuisé
              </span>
            </div>
          )}

          <motion.button
            onClick={quickAdd}
            data-cursor-hover
            variants={{
              rest: { y: 12, opacity: 0 },
              hover: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-2 bg-bone py-3 font-mono text-[11px] uppercase tracking-widest2 text-ink hover:bg-signal hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" /> Ajout rapide
          </motion.button>
        </div>

        <div className="mt-4 flex items-start justify-between">
          <div>
            <h3 className="font-body text-sm text-bone">{product.name}</h3>
            <p className="mt-1 font-mono text-xs text-ash">
              {formatDZD(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
