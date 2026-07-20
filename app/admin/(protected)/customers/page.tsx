"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]));
  }, []);

  const customers = Array.from(
    new Map(
      orders.map((o) => [
        o.customer.phone,
        {
          name: `${o.customer.firstName} ${o.customer.lastName}`,
          phone: o.customer.phone,
          city: o.customer.city,
          wilaya: o.customer.wilaya,
          orders: orders.filter((x) => x.customer.phone === o.customer.phone).length,
        },
      ])
    ).values()
  );

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Clients</h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-ash">
        Construit à partir des commandes reçues
      </p>

      {customers.length === 0 ? (
        <p className="mt-8 border hairline p-4 text-sm text-ash">
          Aucun client pour l&apos;instant — connecte MongoDB pour voir les
          commandes réelles apparaître ici.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto border hairline">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b hairline font-mono text-[11px] uppercase tracking-widest2 text-ash">
                <th className="p-4">Nom</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Ville</th>
                <th className="p-4">Wilaya</th>
                <th className="p-4">Commandes</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone} className="border-b hairline last:border-none">
                  <td className="p-4">{c.name}</td>
                  <td className="p-4">{c.phone}</td>
                  <td className="p-4">{c.city}</td>
                  <td className="p-4">{c.wilaya}</td>
                  <td className="p-4">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
