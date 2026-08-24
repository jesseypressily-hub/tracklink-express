"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Plane,
  Ship,
  Truck,
  Warehouse,
} from "lucide-react";

const services = [
  {
    title: "Air Freight",
    description:
      "Fast and reliable air cargo solutions for time-sensitive shipments.",
    image: "/images/services/air-freight.jpg",
    icon: Plane,
  },
  {
    title: "Ocean Freight",
    description:
      "Cost-effective international shipping for large and heavy cargo.",
    image: "/images/services/ocean-freight.jpg",
    icon: Ship,
  },
  {
    title: "Road Transport",
    description:
      "Flexible ground transportation connecting businesses and destinations.",
    image: "/images/services/road-transport.jpg",
    icon: Truck,
  },
  {
    title: "Warehousing",
    description:
      "Secure storage and efficient handling of your goods before delivery.",
    image: "/images/services/warehousing.jpg",
    icon: Warehouse,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-[var(--light-gray)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
            Our Services
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl lg:text-5xl">
            Logistics solutions built around your needs.
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            From local deliveries to international freight, we provide
            dependable solutions for every stage of your shipment.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70 transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--blue)] shadow-lg">
                    <Icon size={20} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--navy)]">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <a
                    href="/services"
                    className="group/link mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--blue)]"
                  >
                    Learn more
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}