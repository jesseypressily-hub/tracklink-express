"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How can I track my shipment?",
    answer:
      "Enter your TrackLink Express tracking number in any tracking field on our website. You will be able to view the latest status and shipment progress.",
  },
  {
    question: "What does my tracking number look like?",
    answer:
      "TrackLink Express tracking numbers follow the format TLX-YYYY-XXXXXX. For example: TLX-2026-000482.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on the destination, service selected and shipment type. Your tracking information will provide the latest estimated delivery details.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes. TrackLink Express provides logistics solutions for both domestic and international shipments.",
  },
  {
    question: "Can I change my delivery information?",
    answer:
      "Some shipment details can be updated depending on the shipment's current status. Contact our support team for assistance.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our support team through the contact options provided on the TrackLink Express website.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
            Frequently asked questions
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl lg:text-5xl">
            Everything you need to know
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
            Find quick answers to some of the most common questions about our
            logistics and delivery services.
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-semibold text-[var(--navy)]">
                    {faq.question}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-[var(--blue)]"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-sm leading-7 text-gray-600 sm:px-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
