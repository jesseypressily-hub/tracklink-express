"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--navy)] px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              About TrackLink Express
            </p>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Moving what matters,
              <span className="block text-blue-300">
                with confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              TrackLink Express is a modern logistics and shipment
              tracking company focused on making transportation simpler,
              more transparent, and easier to manage.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
    
      <div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        Our Story
      </p>

      <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--navy)] sm:text-4xl">
        Built to make logistics easier to understand.
      </h2>

      <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
        TrackLink Express was created around a simple belief: shipping
        should not feel complicated. Customers deserve clear information
        about where their packages are, what is happening to them, and
        when they can expect the next stage of their journey.
      </p>

      <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
        Our platform brings shipment tracking, delivery updates, and
        logistics information together in one professional experience.
        Whether a shipment is moving across a city or travelling between
        countries, TrackLink Express is designed to keep everyone informed.
      </p>

      <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
        As the company grows, our focus remains the same: dependable
        logistics, transparent communication, and technology that makes
        shipment management simpler for customers and businesses.
      </p>
    </div>

    <div className="rounded-3xl bg-[var(--navy)] p-8 shadow-xl sm:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
        Our Commitment
      </p>

      <h3 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
        Keeping every shipment connected from origin to destination.
      </h3>

      <p className="mt-5 leading-7 text-white/70">
        We believe good logistics is more than simply moving packages.
        It is about creating confidence through accurate information,
        consistent updates, and a smooth customer experience.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-lg font-bold text-white">
            Reliable
          </p>

          <p className="mt-2 text-sm leading-6 text-white/60">
            Dependable shipment information throughout the journey.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-lg font-bold text-white">
            Transparent
          </p>

             <p className="mt-2 text-sm leading-6 text-white/60">
            Clear updates that help customers stay informed.
             </p>
            </div>
          </div>
        </div>

         </div>
      </section>

      <section className="bg-[var(--light-gray)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-7xl">

    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        What Drives Us
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl">
        Our mission and vision
      </h2>

      <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
        Everything we build at TrackLink Express is guided by the goal of
        making logistics more connected, transparent, and dependable.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2">

      {/* Mission */}
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <span className="text-xl font-extrabold">01</span>
        </div>

        <h3 className="mt-6 text-2xl font-extrabold text-[var(--navy)]">
          Our Mission
        </h3>

        <p className="mt-4 leading-7 text-gray-600">
          To provide a simple and dependable logistics experience that
          keeps customers and businesses informed throughout every stage
          of a shipment's journey.
        </p>

        <p className="mt-4 leading-7 text-gray-600">
          Through technology, clear communication, and reliable shipment
          information, we aim to make tracking and delivery management
          easier for everyone.
        </p>
      </div>

      {/* Vision */}
      <div className="rounded-3xl bg-[var(--navy)] p-8 shadow-sm sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-blue-300">
          <span className="text-xl font-extrabold">02</span>
        </div>

        <h3 className="mt-6 text-2xl font-extrabold text-white">
          Our Vision
        </h3>

        <p className="mt-4 leading-7 text-white/70">
          To build a modern logistics platform where shipment information
          is accessible, understandable, and connected from the moment a
          package is created until it reaches its destination.
        </p>

        <p className="mt-4 leading-7 text-white/70">
          We envision a future where technology helps businesses manage
          deliveries more efficiently while giving customers greater
          confidence in every shipment.
        </p>
      </div>

    </div>
  </div>
</section>

<section className="bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-7xl">

    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        Our Values
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl">
        Principles that guide our work
      </h2>

      <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
        Our approach to logistics is built on the principles that matter
        most to our customers, partners, and the businesses we serve.
      </p>
    </div>

    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {/* Reliability */}
      <div className="rounded-2xl border border-gray-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <span className="text-lg font-extrabold">01</span>
        </div>

        <h3 className="mt-6 text-lg font-bold text-[var(--navy)]">
          Reliability
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          We focus on dependable services and accurate shipment
          information customers can trust.
        </p>
      </div>

      {/* Transparency */}
      <div className="rounded-2xl border border-gray-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <span className="text-lg font-extrabold">02</span>
        </div>

        <h3 className="mt-6 text-lg font-bold text-[var(--navy)]">
          Transparency
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Clear tracking information helps customers understand where
          their shipments are and what happens next.
        </p>
      </div>

      {/* Innovation */}
      <div className="rounded-2xl border border-gray-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <span className="text-lg font-extrabold">03</span>
        </div>

        <h3 className="mt-6 text-lg font-bold text-[var(--navy)]">
          Innovation
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          We use technology to create smarter, simpler, and more efficient
          logistics experiences.
        </p>
      </div>

      {/* Customer Focus */}
      <div className="rounded-2xl border border-gray-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <span className="text-lg font-extrabold">04</span>
        </div>

        <h3 className="mt-6 text-lg font-bold text-[var(--navy)]">
          Customer Focus
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Every part of our platform is designed with the needs of
          customers and businesses in mind.
        </p>
      </div>

    </div>
  </div>
</section>

<section className="bg-[var(--light-gray)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-7xl">

    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        What We Do
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl">
        Logistics solutions built around your needs
      </h2>

      <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
        TrackLink Express combines shipment visibility with practical
        logistics solutions to help individuals and businesses manage
        deliveries with greater confidence.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <h3 className="text-xl font-bold text-[var(--navy)]">
          Shipment Tracking
        </h3>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Track shipments from origin to destination and stay informed
          about important updates throughout the delivery journey.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <h3 className="text-xl font-bold text-[var(--navy)]">
          Freight & Cargo
        </h3>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Support for larger shipments and cargo movements with clear
          shipment information and progress visibility.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <h3 className="text-xl font-bold text-[var(--navy)]">
          Warehousing
        </h3>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Organized storage solutions designed to help businesses manage
          goods before they continue to their final destination.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <h3 className="text-xl font-bold text-[var(--navy)]">
          Delivery Solutions
        </h3>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Flexible delivery support designed around different shipment
          requirements and destinations.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <h3 className="text-xl font-bold text-[var(--navy)]">
          Business Logistics
        </h3>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Logistics support that helps businesses keep their shipments
          organized and their customers informed.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">
        <h3 className="text-xl font-bold text-[var(--navy)]">
          Shipment Visibility
        </h3>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Centralized shipment information gives customers a clearer view
          of delivery progress and important tracking events.
        </p>
      </div>

    </div>
  </div>
</section>

<section className="bg-[var(--navy)] px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
  <div className="mx-auto max-w-5xl text-center">

    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
      Move Forward With TrackLink Express
    </p>

    <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
      Keep your shipments moving with confidence.
    </h2>

    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
      Whether you are tracking a single package or managing shipments
      for your business, TrackLink Express helps you stay informed
      throughout the journey.
    </p>

    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

      <a
        href="/tracking"
        className="inline-flex items-center justify-center rounded-xl bg-[var(--blue)] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Track a Shipment
      </a>

      <a
        href="/contact"
        className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
      >
        Contact Us
          </a>

                </div>
               </div>
             </section>


      <Footer />

    </main>
  );
}