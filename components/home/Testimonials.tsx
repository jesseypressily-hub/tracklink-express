"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Michael Carter",
    role: "Business Owner",
    image: "/images/testimonials/customer-1.jpg",
    text: "TrackLink Express has made managing our shipments much easier. The tracking system gives us confidence at every stage.",
  },
  {
    name: "Sophia Williams",
    role: "Operations Manager",
    image: "/images/testimonials/customer-2.jpg",
    text: "Reliable service, clear communication and excellent delivery times. Their team has become an important part of our logistics process.",
  },
  {
    name: "Daniel Johnson",
    role: "E-commerce Manager",
    image: "/images/testimonials/customer-3.jpg",
    text: "Our customers love being able to follow their packages. TrackLink Express has made our delivery experience much more professional.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[var(--light-gray)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
            Client feedback
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-[var(--navy)] sm:text-4xl lg:text-5xl">
            Trusted by businesses that keep moving
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            See why businesses and individuals choose TrackLink Express for
            their shipping needs.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
              }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200/70 transition-shadow duration-300 hover:shadow-xl"
            >
              <Quote
                size={36}
                className="absolute right-6 top-6 text-blue-100"
              />

              {/* Stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="mt-6 text-sm leading-7 text-gray-600">
                “{testimonial.text}”
              </p>

              <div className="mt-7 flex items-center gap-3 border-t border-gray-100 pt-5">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--navy)]">
                    {testimonial.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}