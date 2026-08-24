"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Truck,
  PackageSearch,
  Warehouse,
  MapPin,
  Building2,
  Globe2,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[var(--light-gray)]">

        {/* Hero */}
        <section className="bg-[var(--navy)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <Truck
              className="mx-auto text-blue-300"
              size={42}
            />

            <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              TrackLink Express Services
            </p>

            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Logistics solutions that keep you moving
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              From shipment tracking to freight and delivery solutions,
              TrackLink Express helps individuals and businesses manage
              their shipments with confidence.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/tracking"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Track a Shipment
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </section>
        <section className="bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-7xl">

    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        Our Services
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl">
        Complete logistics solutions for every shipment
      </h2>

      <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
        Whether you are sending a package, managing business shipments,
        or moving larger cargo, TrackLink Express provides solutions
        designed to keep your goods moving efficiently.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {/* Shipment Tracking */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <PackageSearch size={22} />
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          Shipment Tracking
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Follow your shipment from origin to destination with clear
          tracking information and updates at every important stage.
        </p>
      </div>

      {/* Freight & Cargo */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <Truck size={22} />
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          Freight & Cargo
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Manage larger shipments and cargo movements with dependable
          logistics support and shipment visibility.
        </p>
      </div>

      {/* Warehousing */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <Warehouse size={22} />
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          Warehousing
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Secure and organized storage solutions for goods before they
          continue to their final destination.
        </p>
      </div>

      {/* Delivery */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <MapPin size={22} />
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          Delivery Solutions
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Flexible delivery solutions designed to help shipments reach
          their destinations safely and efficiently.
        </p>
      </div>

      {/* Business Logistics */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <Building2 size={22} />
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          Business Logistics
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Practical logistics support that helps businesses organize
          shipments and keep customers informed.
        </p>
      </div>

      {/* International Shipping */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <Globe2 size={22} />
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          International Shipping
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Shipment visibility and logistics support for deliveries
          moving between different locations around the world.
        </p>
      </div>

    </div>
  </div>
</section>
<section className="bg-[var(--light-gray)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-7xl">

    <div className="text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        How It Works
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl">
        Simple from shipment to delivery
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
        We make the shipment process straightforward, giving you
        visibility and useful updates throughout the journey.
      </p>
    </div>

    <div className="relative mt-14 grid gap-8 md:grid-cols-3">

      {/* Step 1 */}
      <div className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blue)] text-lg font-extrabold text-white">
          01
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          Create Your Shipment
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Shipment information is recorded and assigned a unique
          TrackLink Express tracking number.
        </p>
      </div>

      {/* Step 2 */}
      <div className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blue)] text-lg font-extrabold text-white">
          02
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          Follow Its Journey
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Use your tracking number to view shipment progress and
          important tracking events as your package moves.
        </p>
      </div>

      {/* Step 3 */}
      <div className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blue)] text-lg font-extrabold text-white">
          03
        </div>

        <h3 className="mt-6 text-xl font-bold text-[var(--navy)]">
          Receive Your Delivery
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Stay informed until your shipment reaches its destination
          and the delivery process is completed.
        </p>
      </div>

    </div>
  </div>
</section>

<section className="bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

    {/* Text */}
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        Why Choose Us
      </p>

      <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--navy)] sm:text-4xl">
        More visibility. More confidence. Better logistics.
      </h2>

      <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
        TrackLink Express is designed to make logistics easier to
        understand and easier to manage. We focus on giving customers
        clear information while keeping the shipment experience simple.
      </p>

      <div className="mt-8 space-y-6">

        <div className="flex gap-4">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
            ✓
          </div>

          <div>
            <h3 className="font-bold text-[var(--navy)]">
              Clear Shipment Visibility
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Know where your shipment is and understand the latest
              progress without unnecessary complexity.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
            ✓
          </div>

          <div>
            <h3 className="font-bold text-[var(--navy)]">
              Reliable Tracking Updates
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Important shipment events are organized into an easy-to-
              follow tracking history.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
            ✓
          </div>

          <div>
            <h3 className="font-bold text-[var(--navy)]">
              Designed for Customers and Businesses
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Our platform can support individual shipments as well as
              the logistics needs of growing businesses.
            </p>
          </div>
        </div>

      </div>
    </div>

    {/* Highlight Card */}
    <div className="rounded-3xl bg-[var(--navy)] p-8 shadow-xl sm:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
        The TrackLink Difference
      </p>

      <h3 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
        Logistics built around transparency.
      </h3>

      <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
        From the first shipment update to the final delivery milestone,
        TrackLink Express keeps the information you need within reach.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="text-2xl font-extrabold text-white">
            24/7
          </p>

          <p className="mt-1 text-xs text-white/60">
            Tracking access
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="text-2xl font-extrabold text-white">
            Global
          </p>

          <p className="mt-1 text-xs text-white/60">
            Shipment visibility
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="text-2xl font-extrabold text-white">
            Secure
          </p>

          <p className="mt-1 text-xs text-white/60">
            Shipment information
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-5">
          <p className="text-2xl font-extrabold text-white">
            Simple
          </p>

          <p className="mt-1 text-xs text-white/60">
            Customer experience
          </p>
        </div>

      </div>
    </div>

  </div>
</section>

<section className="bg-[var(--light-gray)] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
  <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[var(--navy)] px-6 py-12 text-center shadow-xl sm:px-10 lg:px-16">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
      Ready to Get Started?
    </p>

    <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
      Keep your shipment journey within reach.
    </h2>

    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">
      Whether you are checking an existing shipment or looking for
      logistics support, TrackLink Express is here to help.
    </p>

    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
      <Link
        href="/tracking"
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Track Your Shipment
        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>

      <Link
        href="/#contact"
        className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
      >
        Contact Us
      </Link>
    </div>
  </div>
</section>

      </main>

      <Footer />
    </>
  );
}