"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Calculator,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function ContactPage() {
  const [quoteSent, setQuoteSent] = useState(false);

  async function handleQuoteSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    const response = await fetch("/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        service: formData.get("service"),
        origin: formData.get("origin"),
        destination: formData.get("destination"),
        packageType: formData.get("packageType"),
        weight: formData.get("weight"),
        message: formData.get("message"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to submit quote request."
      );
    }

    setQuoteSent(true);
    form.reset();
  } catch (error) {
    console.error("Quote submission error:", error);
    alert("Unable to submit your quote request. Please try again.");
  }
}

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
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Contact TrackLink Express
            </p>

            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              We&apos;re here to help
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Have a question about a shipment, our services, or your
              delivery? Get in touch with the TrackLink Express team.
            </p>
          </motion.div>
        </section>

        {/* Contact Introduction */}
        <section className="-mt-8 px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 sm:p-8 lg:p-10">

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

              {/* Information */}
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
                  Get In Touch
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)]">
                  Let&apos;s talk about your shipment
                </h2>

                <p className="mt-5 leading-7 text-gray-600">
                  Our contact team is available to help with shipment
                  questions, tracking assistance, delivery information,
                  and general enquiries.
                </p>

                <div className="mt-8 space-y-6">

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
                      <Phone size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">
                        Phone
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        +1 (800) 555-0147
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
                      <Mail size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">
                        Email
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        support@tracklinkexpress.com
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
                      <MapPin size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">
                        Headquarters
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Los Angeles, California, USA
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick Tracking Card */}
              <div className="rounded-2xl bg-[var(--navy)] p-7 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                  Need an Update?
                </p>

                <h3 className="mt-4 text-2xl font-extrabold text-white">
                  Track your shipment first
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/70">
                  If you already have a TrackLink Express tracking
                  number, you can check your shipment status instantly
                  before contacting our support team.
                </p>

                <Link
                  href="/tracking"
                  className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Track Shipment
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

            </div>
          </div>
        </section>
      
{/* Get a Quote */}
<section className="bg-[var(--light-gray)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-6xl">

    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-[var(--blue)]">
        <Calculator size={28} />
      </div>

      <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        Get a Quote
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl">
        Get a shipping estimate
      </h2>

      <p className="mt-5 text-base leading-7 text-gray-600">
        Tell us about your shipment and our team will review your
        request and provide a shipping estimate.
      </p>
    </div>

    <div className="mt-12 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 sm:p-8 lg:p-10">

     <form
  onSubmit={handleQuoteSubmit}
  className="grid gap-6 md:grid-cols-2"
>

        {/* Full Name */}
        <div>
          <label
            htmlFor="quote-name"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Full Name
          </label>

          <input
            id="quote-name"
            name="name"
            type="text"
            placeholder="John Doe"
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="quote-email"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Email Address
          </label>

          <input
            id="quote-email"
            name="email"
            type="email"
            placeholder="john@example.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="quote-phone"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Phone Number
          </label>

          <input
            id="quote-phone"
            name="phone"
            type="tel"
            placeholder="+1 (800) 555-0147"
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Service */}
        <div>
          <label
            htmlFor="quote-service"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Service Type
          </label>

          <select
            id="quote-service"
            name="service"
            defaultValue=""
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select a service
            </option>
            <option value="express">
              Express Delivery
            </option>
            <option value="standard">
              Standard Delivery
            </option>
            <option value="international">
              International Shipping
            </option>
            <option value="freight">
              Freight & Cargo
            </option>
            <option value="warehousing">
              Warehousing
            </option>
          </select>
        </div>

        {/* Origin */}
        <div>
          <label
            htmlFor="quote-origin"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Pickup Location
          </label>

          <input
            id="quote-origin"
            name="origin"
            type="text"
            placeholder="Los Angeles, CA"
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Destination */}
        <div>
          <label
            htmlFor="quote-destination"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Destination
          </label>

          <input
            id="quote-destination"
            name="destination"
            type="text"
            placeholder="New York, NY"
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Package Type */}
        <div>
          <label
            htmlFor="quote-package"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Package Type
          </label>

          <select
            id="quote-package"
            name="packageType"
            defaultValue=""
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select package type
            </option>
            <option value="documents">Documents</option>
            <option value="parcel">Parcel</option>
            <option value="box">Box</option>
            <option value="pallet">Pallet</option>
            <option value="freight">Freight</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label
            htmlFor="quote-weight"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Estimated Weight
          </label>

          <input
            id="quote-weight"
            name="weight"
            type="number"
            min="0"
            placeholder="e.g. 5 kg"
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Additional Details */}
        <div className="md:col-span-2">
          <label
            htmlFor="quote-message"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Additional Details
          </label>

          <textarea
            id="quote-message"
            rows={5}
            name="message"
            placeholder="Tell us anything else we should know about your shipment..."
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
          >
            Request a Quote
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

      </form>
      {quoteSent && (
  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
    Your quote request has been received. Our team will review your
    shipment details and get back to you shortly.
  </div>
)}
    </div>
  </div>
</section>
        {/* Contact Form */}
<section className="bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-6xl">

    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
        Send Us a Message
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl">
        How can we help?
      </h2>

      <p className="mt-5 text-base leading-7 text-gray-600">
        Send us your question or enquiry and our team will have the
        information needed to assist you.
      </p>
    </div>

    <div className="mt-12 rounded-3xl border border-gray-200 bg-[var(--light-gray)] p-6 shadow-sm sm:p-8 lg:p-10">

      <form className="grid gap-6 md:grid-cols-2">

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Full Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Phone Number
          </label>

          <input
            id="phone"
            type="tel"
            placeholder="+1 (800) 555-0147"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Subject
          </label>

          <select
            id="subject"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
            defaultValue=""
          >
            <option value="" disabled>
              Select an enquiry type
            </option>
            <option value="tracking">
              Shipment Tracking
            </option>
            <option value="delivery">
              Delivery Question
            </option>
            <option value="services">
              Logistics Services
            </option>
            <option value="business">
              Business Enquiry
            </option>
            <option value="other">
              Other
            </option>
          </select>
        </div>

        {/* Tracking Number */}
        <div className="md:col-span-2">
          <label
            htmlFor="tracking"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Tracking Number
            <span className="ml-1 font-normal text-gray-400">
              (Optional)
            </span>
          </label>

          <input
            id="tracking"
            type="text"
            placeholder="Example: TLX-2026-000482"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-bold text-[var(--navy)]"
          >
            Message
          </label>

          <textarea
            id="message"
            rows={6}
            placeholder="Tell us how we can help..."
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
          >
            Send Message
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

      </form>
    </div>
  </div>
</section>

{/* Location */}
<section className="bg-[var(--light-gray)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-6xl">

    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
          Find Us
        </p>

        <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl">
          Our headquarters
        </h2>

        <p className="mt-5 leading-7 text-gray-600">
          TrackLink Express is headquartered in Los Angeles,
          California. Our logistics network is designed to connect
          shipments across cities and borders.
        </p>

        <div className="mt-7 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
              <MapPin size={21} />
            </div>

            <div>
              <p className="font-bold text-[var(--navy)]">
                TrackLink Express Headquarters
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Los Angeles, California, USA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl bg-slate-200 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.12),_transparent_60%)]" />

        <div className="relative text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--blue)] text-white shadow-lg">
            <MapPin size={30} />
          </div>

          <h3 className="mt-5 text-xl font-bold text-[var(--navy)]">
            Los Angeles, California
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            TrackLink Express Headquarters
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

      </main>

      <Footer />
    </>
  );
}