"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";
import { formatDZD, cn } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";

export default function CartDrawer() {
  const { lines, isOpen, close, removeLine, setQuantity, subtotal, applyCoupon, couponCode } =
    useCart();
  const [coupon, setCoupon] = useState("");
  const settings = useSiteSettings();
  const freeShipping =
    settings.freeShippingThreshold > 0 && subtotal() >= settings.freeShippingThreshold;
  const shippingEstimate = lines.length === 0 ? 0 : freeShipping ? 0 : settings.shippingDomicile;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-bone/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-ink border-l hairline"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b hairline p-5">
              <h2 className="font-display text-xl uppercase">
                Panier ({lines.reduce((s, l) => s + l.quantity, 0)})
              </h2>
              <button onClick={close} aria-label="Fermer" data-cursor-hover>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-mono text-xs uppercase tracking-widest2 text-ash">
                    Ton panier est vide
                  </p>
                  <Link
                    href="/boutique"
                    onClick={close}
                    className="mt-4 font-display text-2xl uppercase text-signal"
                  >
                    Voir la boutique
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {lines.map((line) => (
                    <li key={`${line.productId}-${line.size}`} className="flex gap-4">
                      <ProductImage
                        url={line.image}
                        alt={line.name}
                        label={line.name}
                        seed={line.slug}
                        className="h-24 w-20 flex-shrink-0"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm">{line.name}</p>
                            <p className="mt-1 font-mono text-[11px] text-ash">
                              Taille {line.size} · {line.color}
                            </p>
                          </div>
                          <button
                            onClick={() => removeLine(line.productId, line.size)}
                            aria-label="Retirer"
                            data-cursor-hover
                          >
                            <Trash2 className="h-4 w-4 text-ash hover:text-signal" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 border hairline px-2 py-1">
                            <button
                              onClick={() =>
                                setQuantity(line.productId, line.size, line.quantity - 1)
                              }
                              aria-label="Diminuer"
                              data-cursor-hover
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono text-xs">{line.quantity}</span>
                            <button
                              onClick={() =>
                                setQuantity(line.productId, line.size, line.quantity + 1)
                              }
                              aria-label="Augmenter"
                              data-cursor-hover
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-mono text-xs">
                            {formatDZD(line.price * line.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t hairline p-5">
                <div className="mb-4 flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Code promo"
                    className="w-full border hairline bg-transparent px-3 py-2 text-sm outline-none placeholder:text-ash"
                  />
                  <button
                    onClick={() => applyCoupon(coupon)}
                    data-cursor-hover
                    className="border hairline px-4 font-mono text-xs uppercase tracking-widest2 hover:border-signal hover:text-signal"
                  >
                    Appliquer
                  </button>
                </div>
                {couponCode && (
                  <p className="mb-3 font-mono text-[11px] text-signal">
                    Code &ldquo;{couponCode}&rdquo; enregistré
                  </p>
                )}
                <div className="flex justify-between text-sm text-ash">
                  <span>Sous-total</span>
                  <span>{formatDZD(subtotal())}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-ash">
                  <span>Livraison estimée</span>
                  <span>{formatDZD(shippingEstimate)}</span>
                </div>
                <div className="mt-3 flex justify-between border-t hairline pt-3 font-display text-xl uppercase">
                  <span>Total</span>
                  <span>{formatDZD(subtotal() + shippingEstimate)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  data-cursor-hover
                  className={cn(
                    "mt-5 block w-full bg-signal py-4 text-center font-mono text-xs uppercase tracking-widest2 text-ink transition-colors hover:bg-bone hover:text-ink"
                  )}
                >
                  Passer la commande
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
