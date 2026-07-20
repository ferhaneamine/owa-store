"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-ink pt-20">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center lg:grid-cols-2">
        <div className="flex flex-col px-5 py-16 md:px-10 md:py-24">
          <span className="mb-5 font-mono text-[11px] uppercase tracking-widest2 text-signal">
            Nouvelle collection
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[15vw] leading-[0.85] tracking-tightest lg:text-[6.5vw]"
          >
            O.W.A
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-sm text-lg text-bone/70"
          >
            Streetwear premium. Coupes affirmées, finitions haut de gamme.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/boutique"
              data-cursor-hover
              className="flex items-center gap-2 bg-signal px-8 py-4 font-mono text-xs uppercase tracking-widest2 text-ink transition-colors hover:bg-bone hover:text-ink"
            >
              Voir la boutique <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/collections"
              data-cursor-hover
              className="border hairline px-8 py-4 font-mono text-xs uppercase tracking-widest2 text-bone transition-colors hover:border-signal hover:text-signal"
            >
              Collections
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-[50vh] w-full lg:h-[85vh]"
        >
          <ImagePlaceholder label="O.W.A" seed="hero-drop" className="h-full w-full" />
        </motion.div>
      </div>
    </section>
  );
}
