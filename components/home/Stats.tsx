"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Globe2,
  PackageCheck,
  Clock3,
  Headphones,
} from "lucide-react";

const stats = [
  {
    value: 50000,
    suffix: "+",
    label: "Shipments Delivered",
    icon: PackageCheck,
  },
  {
    value: 120,
    suffix: "+",
    label: "Countries Served",
    icon: Globe2,
  },
  {
    value: 98,
    suffix: "%",
    label: "On-Time Delivery",
    icon: Clock3,
  },
  {
    value: 24,
    suffix: "/7",
    label: "Customer Support",
    icon: Headphones,
  },
];

function Counter({
  value,
  suffix,
  start,
}: {
  value: number;
  suffix: string;
  start: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!start || hasStarted.current) return;

    hasStarted.current = true;

    const duration = 1800;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Smooth easing
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [start, value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.35,
  });

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--navy)] px-5 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 lg:grid-cols-4">

        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 25 }
              }
              transition={{
                duration: 0.6,
                delay: index * 0.12,
              }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[var(--blue)]">
                <Icon size={23} />
              </div>

              <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  start={isInView}
                />
              </h3>

              <p className="mt-2 text-sm text-white/60 sm:text-base">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}