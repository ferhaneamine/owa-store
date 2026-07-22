"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Crown,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#090909] text-white">

      {/* Glow */}
      <div className="absolute right-[-250px] top-[-150px] h-[700px] w-[700px] rounded-full bg-red-600/20 blur-[180px]" />

      {/* Huge background text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">

        <h1 className="select-none font-[var(--font-hero)] text-[22vw] leading-none tracking-wider text-white/[0.04]">
          O.W.A
        </h1>

      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1700px] items-center px-6 pt-24 lg:px-16">

        {/* LEFT */}

        <div className="relative z-20 max-w-xl">

          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs uppercase tracking-[0.35em] text-red-500"
          >
            Nouvelle Collection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8 }}
            className="mt-5 font-[var(--font-hero)] text-7xl leading-none md:text-8xl xl:text-[8rem]"
          >
            O.W.A
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .25 }}
            className="mt-2 text-3xl font-black uppercase tracking-wide text-red-500"
          >
            Oranais With Attitude
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .35 }}
            className="mt-8 max-w-md text-lg leading-8 text-zinc-300"
          >
            Streetwear premium conçu pour ceux qui
            veulent représenter Oran avec attitude.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .5 }}
            className="mt-10 flex flex-wrap gap-5"
          >

            <Link
              href="/boutique"
              className="flex items-center gap-2 bg-red-600 px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-white transition hover:bg-white hover:text-black"
            >
              Voir la boutique
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/boutique"
              className="border border-zinc-700 px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-white transition hover:border-red-500 hover:text-red-500"
            >
              Explorer
            </Link>

          </motion.div>

        </div>


        {/* CAR */}

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 right-[-6%] h-[92%] w-[65%]"
        >

          <Image
            src="/images/hero-car.png"
            alt="OWA"
            fill
            priority
            className="object-contain object-bottom"
          />

        </motion.div>

      </div>


      {/* Bottom info */}

      <div className="relative border-t border-white/10 bg-black/70 backdrop-blur">

        <div className="mx-auto grid max-w-[1700px] grid-cols-1 gap-8 px-6 py-6 md:grid-cols-3">

          <div className="flex items-center gap-4">

            <Crown className="text-red-500" />

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em]">
                Premium Quality
              </p>

              <p className="text-sm text-zinc-400">
                Matières sélectionnées
              </p>
            </div>

          </div>


          <div className="flex items-center gap-4">

            <Truck className="text-red-500" />

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em]">
                Livraison
              </p>

              <p className="text-sm text-zinc-400">
                Partout en Algérie
              </p>
            </div>

          </div>


          <div className="flex items-center gap-4">

            <ShieldCheck className="text-red-500" />

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em]">
                Paiement
              </p>

              <p className="text-sm text-zinc-400">
                À la livraison
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}