"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

const TRACKING_IMAGE = "/images/hero/tracking-cta.jpg";

export default function TrackingCTA() {
    const router = useRouter();

    const [trackingNumber, setTrackingNumber] = useState("");
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-0">
        <Image
          src={TRACKING_IMAGE}
          alt="TrackLink Express shipment tracking"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--navy)]/85" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-4xl text-center"
      >
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
          Track your shipment
        </span>

        <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Know where your shipment is, every step of the way.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          Enter your tracking number to get the latest status and location of
          your shipment.
        </p>

        <div
          id="tracking"
          className="mx-auto mt-9 max-w-2xl rounded-2xl bg-white p-2 shadow-2xl sm:flex"
        >
          <div className="flex flex-1 items-center gap-3 px-4 py-3">
            <Search size={20} className="shrink-0 text-gray-400" />

            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const number = trackingNumber.trim();

              if (!number) return;

              router.push(
                `/tracking?number=${encodeURIComponent(number)}`
              );
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
          >
            Track Now
            <ArrowRight size={17} />
          </button>
        </div>

        <p className="mt-4 text-xs text-white/50">
          Example: TLX-2026-125847
        </p>
      </motion.div>
    </section>
  );
}