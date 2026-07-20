"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="relative overflow-hidden bg-signal px-5 py-24 text-ink md:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <RevealOnScroll>
          <span className="font-mono text-[11px] uppercase tracking-widest2">
            Rejoins le mouvement
          </span>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] md:text-6xl">
            Les drops avant tout le monde.
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full border border-ink bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink/50"
            />
            <button
              type="submit"
              data-cursor-hover
              className="whitespace-nowrap bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-bone hover:bg-bone hover:text-ink"
            >
              {sent ? "Inscrit ✓" : "S'inscrire"}
            </button>
          </form>
        </RevealOnScroll>
      </div>
    </section>
  );
}
