"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";

const HERO_IMAGE = "/images/hero/hero-logistics.jpg";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden bg-[var(--navy)]">
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={HERO_IMAGE}
          alt="TrackLink Express logistics operations"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-[var(--navy)]/80" />

      {/* Decorative glow */}
      <div className="absolute -right-32 top-20 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-40 left-0 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Content */}
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-sm sm:text-sm"
            >
              <ShieldCheck size={16} className="text-blue-300" />
              Reliable logistics. Complete visibility.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Moving your world.
              <span className="block text-blue-400">
                Connecting every destination.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8"
            >
              Fast, secure and transparent logistics solutions designed to
              keep your shipments moving and your business connected.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/tracking"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Track Your Shipment
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
               />
              </Link>

              <Link
  href="/contact#quote"
  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
>
  Get a Quote
  <ArrowRight size={17} />
</Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-xs text-white/55 sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-blue-300" />
                Secure shipping
              </div>

              <div className="flex items-center gap-2">
                <Truck size={17} className="text-blue-300" />
                Global delivery
              </div>
            </motion.div>
          </div>

          {/* Floating tracking card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="ml-auto max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  Shipment Tracking
                </span>

                <span className="rounded-full bg-green-400/15 px-3 py-1 text-xs font-bold text-green-300">
                  In Transit
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-black/20 p-4">
                <p className="text-xs text-white/45">
                  Tracking number
                </p>

                <p className="mt-1 font-mono text-sm font-bold tracking-wide text-white">
                  TLX-2026-000482
                </p>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-400 ring-4 ring-blue-400/15" />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Shipment in transit
                    </p>
                    <p className="mt-1 text-xs text-white/45">
                      Your package is moving toward its destination.
                    </p>
                  </div>
                </div>

                <div className="ml-1.5 h-8 border-l border-dashed border-white/20" />

                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full border border-white/30" />

                  <div>
                    <p className="text-sm font-semibold text-white/50">
                      Estimated delivery
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      Updates will appear as the shipment progresses.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}