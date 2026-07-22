"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/types";
import { formatDZD, cn } from "@/lib/utils";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-ash",
  confirmed: "text-signal",
  shipped: "text-bone",
  delivered: "text-signal",
  cancelled: "text-ash line-through",
};

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: "confirmed", label: "Confirmer" },
  confirmed: { status: "shipped", label: "Marquer expédiée" },
  shipped: { status: "delivered", label: "Marquer livrée" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const loadOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("DB non connectée");
        return res.json();
      })
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setError("MongoDB n'est pas encore configuré — voir README.md"))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? data.order : o)));
    } catch {
      alert("Impossible de mettre à jour le statut");
    } finally {
      setUpdating(null);
    }
  };

  const visibleOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase">Commandes</h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-ash">
            {orders.length} commande(s)
            {pendingCount > 0 && (
              <span className="ml-2 text-signal">· {pendingCount} en attente</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "border px-4 py-2 font-mono text-[11px] uppercase tracking-widest2",
              filter === s ? "border-signal text-signal" : "hairline text-ash hover:text-bone"
            )}
          >
            {s === "all" ? "Toutes" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-sm text-ash">Chargement...</p>}
      {error && <p className="mt-8 border hairline p-4 text-sm text-ash">{error}</p>}

      {!loading && !error && visibleOrders.length === 0 && (
        <p className="mt-8 text-sm text-ash">Aucune commande dans cette catégorie.</p>
      )}

      {visibleOrders.length > 0 && (
        <div className="mt-8 overflow-x-auto border hairline">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b hairline font-mono text-[11px] uppercase tracking-widest2 text-ash">
                <th className="p-4">N° Commande</th>
                <th className="p-4">Client</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Articles</th>
                <th className="p-4">Livraison</th>
                <th className="p-4">Total</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((o) => {
                const next = NEXT_STATUS[o.status];
                return (
                  <tr key={o._id} className="border-b hairline last:border-none align-top">
                    <td className="p-4 font-mono text-xs">{o.orderNumber}</td>
                    <td className="p-4">
                      {o.customer.firstName} {o.customer.lastName}
                      <p className="mt-1 text-xs text-ash">
                        {o.customer.commune}, {o.customer.wilaya}
                      </p>
                    </td>
                    <td className="p-4">{o.customer.phone}</td>
                    <td className="p-4 text-xs text-ash">
                      {o.items.map((it) => (
                        <div key={`${it.productId}-${it.size}`}>
                          {it.quantity}× {it.name} ({it.size})
                        </div>
                      ))}
                    </td>
                    <td className="p-4 capitalize">{o.deliveryMethod}</td>
                    <td className="p-4">{formatDZD(o.total)}</td>
                    <td className={cn("p-4 font-mono text-xs uppercase", STATUS_COLORS[o.status])}>
                      {STATUS_LABELS[o.status]}
                    </td>
                    <td className="p-4 text-ash">
                      {new Date(o.createdAt).toLocaleDateString("fr-DZ")}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {next && (
                          <button
                            onClick={() => updateStatus(o._id, next.status)}
                            disabled={updating === o._id}
                            className="whitespace-nowrap bg-signal px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink disabled:opacity-50"
                          >
                            {next.label}
                          </button>
                        )}
                        {o.status !== "cancelled" && o.status !== "delivered" && (
                          <button
                            onClick={() => {
                              if (confirm("Annuler cette commande ? Le stock sera restauré."))
                                updateStatus(o._id, "cancelled");
                            }}
                            disabled={updating === o._id}
                            className="whitespace-nowrap border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ash hover:text-signal disabled:opacity-50"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
