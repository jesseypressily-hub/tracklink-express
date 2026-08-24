"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const faqs = [
  {
    question: "How do I track my shipment?",
    answer:
      "Enter your TrackLink Express tracking number on the Tracking page and select Track Shipment. You will see the current status, shipment progress, and available tracking updates.",
  },
  {
    question: "Where can I find my tracking number?",
    answer:
      "Your tracking number is provided when your shipment is created. It should be included in your shipment confirmation or receipt.",
  },
  {
    question: "How often is shipment information updated?",
    answer:
      "Shipment information is updated as your package moves through different stages of its journey and new tracking events are recorded.",
  },
  {
    question: "What do the different shipment statuses mean?",
    answer:
      "Statuses show the current stage of your shipment, such as Shipment Created, Package Received, Departed Facility, Shipment in Transit, Out for Delivery, and Delivered.",
  },
  {
    question: "Can I track a shipment without an account?",
    answer:
      "Yes. You can track a shipment using its tracking number without creating an account.",
  },
  {
    question: "What should I do if my tracking number is not working?",
    answer:
      "First, make sure the tracking number has been entered correctly. If the problem continues, contact TrackLink Express support for assistance.",
  },
  {
    question: "Does TrackLink Express provide international shipping?",
    answer:
      "TrackLink Express is designed to support logistics and transportation services for shipments moving between different locations. Available services may vary depending on the shipment.",
  },
  {
    question: "How can I contact TrackLink Express?",
    answer:
      "You can contact TrackLink Express through the contact information provided on our website. Our support team can assist with shipment-related questions and other inquiries.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[var(--light-gray)]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--navy)] px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
            TrackLink Express
          </p>

          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            Find answers to common questions about shipment tracking,
            deliveries, and TrackLink Express services.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="font-bold text-[var(--navy)]">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-[var(--blue)] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-6 pb-6 pt-4">
                      <p className="leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-3xl bg-[var(--navy)] p-8 text-center sm:p-10">
            <h2 className="text-2xl font-extrabold text-white">
              Still have questions?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65">
              Our team is available to help with shipment tracking and
              other logistics-related questions.
            </p>

            <a
              href="/contact"
              className="mt-6 inline-flex rounded-xl bg-[var(--blue)] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
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