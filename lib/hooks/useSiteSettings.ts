"use client";

import { useEffect, useState } from "react";
import { SiteSettings } from "@/types";

const DEFAULTS: SiteSettings = {
  shippingDomicile: 600,
  shippingBureau: 400,
  freeShippingThreshold: 0,
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => {
        // MongoDB not configured yet — keep defaults, checkout still works.
      });
  }, []);

  return settings;
}
