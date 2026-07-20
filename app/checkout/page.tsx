"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";
import { formatDZD, cn } from "@/lib/utils";
import { DeliveryMethod, Wilaya } from "@/types";
import ProductImage from "@/components/ui/ProductImage";

const WILAYAS: Wilaya[] = [
  "Oran", "Alger", "Constantine", "Annaba", "Blida", "Sétif", "Tlemcen",
  "Béjaïa", "Mostaganem", "Sidi Bel Abbès", "Autre",
];

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();
  const settings = useSiteSettings();

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", address: "", city: "",
    commune: "", wilaya: "" as Wilaya | "", postalCode: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("domicile");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const rawShipping =
    deliveryMethod === "domicile" ? settings.shippingDomicile : settings.shippingBureau;
  const freeShipping =
    settings.freeShippingThreshold > 0 && subtotal() >= settings.freeShippingThreshold;
  const shippingEstimate = freeShipping ? 0 : rawShipping;

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { ...form, wilaya: form.wilaya || "Oran" },
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            price: l.price,
            size: l.size,
            color: l.color,
            quantity: l.quantity,
            image: l.image,
          })),
          deliveryMethod,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la commande");
      setOrderNumber(data.order.orderNumber);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-20 text-center">
        <CheckCircle2 className="h-12 w-12 text-signal" strokeWidth={1.2} />
        <h1 className="mt-6 font-display text-4xl uppercase md:text-5xl">
          Commande confirmée
        </h1>
        <p className="mt-3 font-mono text-sm text-ash">N° {orderNumber}</p>
        <p className="mt-4 max-w-sm text-ash">
          On te contacte très vite par téléphone pour confirmer la livraison.
          Paiement à la livraison.
        </p>
        <Link
          href="/boutique"
          data-cursor-hover
          className="mt-8 bg-signal px-8 py-4 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink"
        >
          Continuer mes achats
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 pt-20 text-center">
        <p className="font-mono text-sm uppercase tracking-widest2 text-ash">
          Ton panier est vide
        </p>
        <Link
          href="/boutique"
          className="mt-4 font-display text-3xl uppercase text-signal"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="mb-10 font-display text-4xl uppercase md:text-5xl">
            Finaliser la commande
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prénom" required value={form.firstName} onChange={update("firstName")} />
              <Field label="Nom" required value={form.lastName} onChange={update("lastName")} />
            </div>
            <Field label="Numéro de téléphone" required type="tel" value={form.phone} onChange={update("phone")} />
            <Field label="Adresse" required value={form.address} onChange={update("address")} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ville" required value={form.city} onChange={update("city")} />
              <Field label="Commune" required value={form.commune} onChange={update("commune")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
                  Wilaya *
                </label>
                <select
                  required
                  value={form.wilaya}
                  onChange={update("wilaya")}
                  className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none"
                >
                  <option value="" disabled>Sélectionner</option>
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <Field label="Code postal (optionnel)" value={form.postalCode} onChange={update("postalCode")} />
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
                Mode de livraison
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    { value: "domicile", label: "Livraison à domicile", price: freeShipping ? 0 : settings.shippingDomicile },
                    { value: "bureau", label: "Retrait au bureau", price: freeShipping ? 0 : settings.shippingBureau },
                  ] as const
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setDeliveryMethod(opt.value)}
                    data-cursor-hover
                    className={cn(
                      "flex items-center justify-between border px-4 py-4 text-left",
                      deliveryMethod === opt.value
                        ? "border-signal text-signal"
                        : "hairline text-bone/80 hover:border-bone"
                    )}
                  >
                    <span className="font-mono text-xs uppercase tracking-widest2">
                      {opt.label}
                    </span>
                    <span className="font-mono text-xs">{formatDZD(opt.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
                Notes de commande (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Instructions de livraison, préférences..."
                className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ash"
              />
            </div>

            {error && (
              <p className="border border-signal px-4 py-3 text-sm text-signal">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              data-cursor-hover
              className="mt-2 bg-signal py-4 font-mono text-xs uppercase tracking-widest2 text-ink transition-colors hover:bg-bone hover:text-ink disabled:opacity-50"
            >
              {submitting ? "Traitement..." : "Passer la commande"}
            </button>
            <p className="text-center font-mono text-[11px] uppercase tracking-widest2 text-ash">
              Paiement à la livraison uniquement
            </p>
          </form>
        </div>

        <div className="h-fit border hairline p-6">
          <h2 className="mb-6 font-mono text-[11px] uppercase tracking-widest2 text-ash">
            Ta commande
          </h2>
          <ul className="flex flex-col gap-4">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex gap-3">
                <ProductImage url={l.image} alt={l.name} label={l.name} seed={l.slug} className="h-16 w-14 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{l.name}</p>
                  <p className="font-mono text-[11px] text-ash">
                    {l.size} × {l.quantity}
                  </p>
                </div>
                <p className="font-mono text-xs">{formatDZD(l.price * l.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2 border-t hairline pt-4 text-sm">
            <div className="flex justify-between text-ash">
              <span>Sous-total</span>
              <span>{formatDZD(subtotal())}</span>
            </div>
            <div className="flex justify-between text-ash">
              <span>Livraison</span>
              <span>{formatDZD(shippingEstimate)}</span>
            </div>
            <div className="flex justify-between border-t hairline pt-3 font-display text-xl uppercase">
              <span>Total</span>
              <span>{formatDZD(subtotal() + shippingEstimate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, required, type = "text", value, onChange,
}: {
  label: string; required?: boolean; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
        {label} {required && "*"}
      </label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
      />
    </div>
  );
}
