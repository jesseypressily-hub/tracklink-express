"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";

const ABOUT_IMAGE = "/images/about/about-logistics.jpg";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Reliable & Secure",
    text: "Your shipments are handled with care and tracked throughout their journey.",
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    text: "Smart logistics solutions designed to keep your deliveries moving.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    text: "Dedicated support whenever you need assistance with your shipment.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="overflow-hidden bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={ABOUT_IMAGE}
              alt="TrackLink Express logistics operations"
              width={900}
              height={700}
              className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-6 right-4 rounded-2xl bg-white p-5 shadow-2xl sm:right-8"
          >
            <p className="text-xs font-medium text-gray-500">
              Trusted logistics
            </p>

            <p className="mt-1 text-2xl font-extrabold text-[var(--navy)]">
              10+ Years
            </p>

            <p className="text-xs text-gray-500">
              Moving businesses forward
            </p>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
            About TrackLink Express
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--navy)] sm:text-4xl lg:text-5xl">
            Logistics made simpler, faster and more transparent.
          </h2>

          <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
            TrackLink Express provides dependable transportation and logistics
            solutions for individuals and businesses. From the moment your
            shipment leaves its origin until it reaches its destination, we
            keep you informed every step of the way.
          </p>

          <div className="mt-8 space-y-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-[var(--navy)]">
                      {benefit.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <a
            href="#contact"
            className="group mt-9 inline-flex items-center gap-2 font-bold text-[var(--blue)]">
            Learn more about us
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}