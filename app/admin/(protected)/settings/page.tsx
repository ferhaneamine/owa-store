"use client";

import { useEffect, useState } from "react";
import { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setSettings(data.settings))
      .catch(() => setError("MongoDB n'est pas encore configuré — voir README.md"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingDomicile: Number(settings.shippingDomicile),
          shippingBureau: Number(settings.shippingBureau),
          freeShippingThreshold: Number(settings.freeShippingThreshold),
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSettings(data.settings);
      setMessage("Enregistré");
    } catch {
      setError("Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Paramètres</h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-ash">
        Frais de livraison
      </p>

      {error && <p className="mt-8 border hairline p-4 text-sm text-ash">{error}</p>}

      {settings && (
        <form onSubmit={handleSubmit} className="mt-8 flex max-w-md flex-col gap-6">
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
              Livraison à domicile (DZD)
            </label>
            <input
              type="number"
              min={0}
              value={settings.shippingDomicile}
              onChange={(e) =>
                setSettings({ ...settings, shippingDomicile: Number(e.target.value) })
              }
              className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
              Retrait au bureau (DZD)
            </label>
            <input
              type="number"
              min={0}
              value={settings.shippingBureau}
              onChange={(e) =>
                setSettings({ ...settings, shippingBureau: Number(e.target.value) })
              }
              className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ash">
              Livraison gratuite à partir de (DZD, 0 = désactivé)
            </label>
            <input
              type="number"
              min={0}
              value={settings.freeShippingThreshold}
              onChange={(e) =>
                setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
              }
              className="w-full border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />
          </div>

          {message && <p className="text-sm text-signal">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-signal py-4 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      )}
    </div>
  );
}
