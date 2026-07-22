"use client";

import { useState } from "react";
import { Instagram, Music2, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 lg:grid-cols-2">

        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-signal">
            On t&apos;écoute
          </span>

          <h1 className="mt-2 font-display text-5xl uppercase md:text-6xl">
            Contact
          </h1>

          <p className="mt-6 max-w-sm text-ash">
            Une question sur une commande, une collab, ou juste envie de dire
            salut — écris-nous.
          </p>

          <div className="mt-10 flex flex-col gap-4 text-sm">

            <a
              href="mailto:owaoran@gmail.com"
              className="flex items-center gap-3 hover:text-signal"
            >
              <Mail className="h-4 w-4 text-signal" strokeWidth={1.5} />
              owaoran@gmail.com
            </a>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-signal" strokeWidth={1.5} />
              Oran, Algérie
            </div>

          </div>

          <div className="mt-8 flex gap-4">

            <a
              href="https://www.instagram.com/o_w_a.dz/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              data-cursor-hover
            >
              <Instagram className="h-5 w-5" strokeWidth={1.5} />
            </a>

            <a
              href="https://www.tiktok.com/@o.w.a.dz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              data-cursor-hover
            >
              <Music2 className="h-5 w-5" strokeWidth={1.5} />
            </a>

          </div>
        </div>


        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-6"
        >

          <div className="grid grid-cols-2 gap-4">

            <input
              required
              placeholder="Prénom"
              className="border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />

            <input
              required
              placeholder="Nom"
              className="border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />

          </div>


          <input
            required
            type="email"
            placeholder="Email"
            className="border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
          />


          <textarea
            required
            rows={5}
            placeholder="Message"
            className="border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
          />


          <button
            type="submit"
            data-cursor-hover
            className="bg-signal py-4 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink"
          >
            {sent ? "Message envoyé ✓" : "Envoyer"}
          </button>

        </form>

      </div>
    </div>
  );
}