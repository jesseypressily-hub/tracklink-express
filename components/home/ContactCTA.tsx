"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="bg-[var(--navy)] px-5 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-7xl"
      >
        <div className="overflow-hidden rounded-3xl bg-white/[0.06] p-7 ring-1 ring-white/10 sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">

            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Need assistance?
              </span>

              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
                Let's get your shipment moving.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
                Whether you need help tracking a package or finding the right
                logistics solution, our team is ready to help.
              </p>

              <div className="mt-7 flex flex-col gap-4 text-sm text-white/70 sm:flex-row sm:gap-7">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-300" />
                  support@tracklinkexpress.com
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-blue-300" />
                  +1 (800) 555-0199
                </div>
              </div>
            </div>

            <a
              href="mailto:support@tracklinkexpress.com"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Contact Us
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}