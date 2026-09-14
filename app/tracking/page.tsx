"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PackageSearch,
  ShieldCheck,
  Loader2,
  MapPin,
  CalendarDays,
  Clock3,
  AlertTriangle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const ShipmentMap = dynamic(
  () => import("@/components/Map/ShipmentMap"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 flex h-[350px] items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">
        Loading map...
      </div>
    ),
  }
);

type Shipment = {
  id: string;
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  currentStatus: string;
  createdAt: string;

  originLat: number | null;
  originLng: number | null;
  destinationLat: number | null;
  destinationLng: number | null;
  currentLat: number | null;
  currentLng: number | null;

  estimatedDelivery?: string | null;
  latestUpdateDescription?: string | null;
  exceptionReason?: string | null;
  customerInstruction?: string | null;
  lastUpdatedAt?: string | null;
};

type TrackingEvent = {
  id: string;
  status: string;
  location: string;
  description: string;
  createdAt: string;

  estimatedDelivery?: string;
  exceptionReason?: string;
  customerInstruction?: string;

  currentLat?: number | null;
  currentLng?: number | null;
};

const STATUS_ORDER = [
  "Shipment Created",
  "Package Received",
  "Departed Facility",
  "Shipment in Transit",
  "Arrived at Facility",
  "Out for Delivery",
  "Delivered",
  "Delayed",
  "Delivery Exception",
  "Available for Pickup",
  "Returned to Sender",
];

function TrackingPageContent() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [history, setHistory] = useState<TrackingEvent[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTracking(
    event?: FormEvent<HTMLFormElement>,
    numberFromUrl?: string
  ) {
    event?.preventDefault();

    const number = (
      numberFromUrl ?? trackingNumber
    ).trim();

    if (!number) {
      setError("Please enter a tracking number.");
      return;
    }

    setLoading(true);
    setError("");
    setShipment(null);
    setHistory([]);

    try {
      const response = await fetch(
        `/api/tracking?number=${encodeURIComponent(number)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Shipment not found.");
        return;
      }

      setTrackingNumber(number);
      setShipment(data.shipment);
      setHistory(data.history || []);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const searchParams = useSearchParams();

  useEffect(() => {
    const numberFromUrl = searchParams.get("tracking");

    if (numberFromUrl) {
      setTrackingNumber(numberFromUrl);
      handleTracking(undefined, numberFromUrl);
    }
  }, [searchParams]);

  const currentStatusIndex = shipment
    ? STATUS_ORDER.findIndex(
        (status) =>
          status.toLowerCase() ===
          shipment.currentStatus.toLowerCase()
      )
    : -1;

  /*
   * IMPORTANT:
   * Get the newest tracking event for each status.
   *
   * We intentionally do NOT delete old history.
   * If an administrator updates "Shipment in Transit"
   * multiple times, the newest event is what the
   * customer should see for that milestone.
   */
  function getLatestEventForStatus(
    status: string
  ): TrackingEvent | undefined {
    const matchingEvents = history.filter(
      (item) =>
        item.status.toLowerCase() ===
        status.toLowerCase()
    );

    if (matchingEvents.length === 0) {
      return undefined;
    }

    return matchingEvents.reduce(
      (latest, current) => {
        const latestTime = new Date(
          latest.createdAt
        ).getTime();

        const currentTime = new Date(
          current.createdAt
        ).getTime();

        return currentTime > latestTime
          ? current
          : latest;
      }
    );
  }

  const latestHistoryEvent =
    history.length > 0
      ? history.reduce((latest, current) => {
          const latestTime = new Date(
            latest.createdAt
          ).getTime();

          const currentTime = new Date(
            current.createdAt
          ).getTime();

          return currentTime > latestTime
            ? current
            : latest;
        })
      : undefined;

  const latestDescription =
    shipment?.latestUpdateDescription ||
    latestHistoryEvent?.description ||
    "";

  const latestLocation =
    latestHistoryEvent?.location ||
    "";

  const latestEstimatedDelivery =
    shipment?.estimatedDelivery ||
    latestHistoryEvent?.estimatedDelivery ||
    null;

  const latestExceptionReason =
    shipment?.exceptionReason ||
    latestHistoryEvent?.exceptionReason ||
    "";

  const latestCustomerInstruction =
    shipment?.customerInstruction ||
    latestHistoryEvent?.customerInstruction ||
    "";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[var(--light-gray)]">
        {/* Header */}
        <section className="bg-[var(--navy)] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <PackageSearch
              className="mx-auto text-blue-300"
              size={42}
            />

            <h1 className="mt-5 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Track Your Shipment
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              Enter your TrackLink Express tracking number
              to see the latest status and progress of your
              shipment.
            </p>
          </motion.div>
        </section>

        {/* Tracking Section */}
        <section className="-mt-8 px-5 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 sm:p-8 lg:p-10"
          >
            {/* Search Form */}
            <form
              onSubmit={handleTracking}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="trackingNumber"
                  className="mb-2 block text-sm font-bold text-[var(--navy)]"
                >
                  Tracking Number
                </label>

                <input
                  id="trackingNumber"
                  type="text"
                  value={trackingNumber}
                  onChange={(event) =>
                    setTrackingNumber(
                      event.target.value
                    )
                  }
                  placeholder="Example: TLX-2026-11232487"
                  className="w-full rounded-xl border border-gray-300 px-4 py-4 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Tracking...
                  </>
                ) : (
                  <>
                    Track Shipment
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Shipment Result */}
            {shipment && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6"
              >
                {/* Tracking Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Tracking Number
                    </p>

                    <p className="mt-1 font-mono font-bold text-[var(--navy)]">
                      {shipment.trackingNumber}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    {shipment.currentStatus}
                  </span>
                </div>

                {/* Shipment Details */}
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Origin
                    </p>

                    <p className="mt-1 font-semibold text-[var(--navy)]">
                      {shipment.origin}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Destination
                    </p>

                    <p className="mt-1 font-semibold text-[var(--navy)]">
                      {shipment.destination}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-[var(--navy)]">
                      {shipment.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Created
                    </p>

                    <p className="mt-1 font-semibold text-[var(--navy)]">
                      {new Date(
                        shipment.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Latest Shipment Update */}
                {(latestDescription ||
                  latestLocation ||
                  latestEstimatedDelivery ||
                  latestExceptionReason ||
                  latestCustomerInstruction) && (
                  <div className="mt-8 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
                    <div className="bg-[var(--navy)] px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Info
                          size={18}
                          className="text-blue-300"
                        />

                        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                          Latest Shipment Update
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-5 p-5">
                      {latestDescription && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Update
                          </p>

                          <p className="mt-2 text-base font-extrabold leading-7 text-[var(--navy)] sm:text-lg">
                            {latestDescription}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {latestLocation && (
                          <div className="flex gap-3">
                            <MapPin
                              size={19}
                              className="mt-0.5 shrink-0 text-[var(--blue)]"
                            />

                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Current Location
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-700">
                                {latestLocation}
                              </p>
                            </div>
                          </div>
                        )}

                        {latestEstimatedDelivery && (
                          <div className="flex gap-3">
                            <CalendarDays
                              size={19}
                              className="mt-0.5 shrink-0 text-[var(--blue)]"
                            />

                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Estimated Delivery
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-700">
                                {new Date(
                                  latestEstimatedDelivery
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {latestHistoryEvent && (
                        <div className="flex gap-3 border-t border-gray-100 pt-4">
                          <Clock3
                            size={18}
                            className="mt-0.5 shrink-0 text-gray-400"
                          />

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                              Update Time
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-600">
                              {new Date(
                                latestHistoryEvent.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {latestExceptionReason && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <div className="flex gap-3">
                            <AlertTriangle
                              size={19}
                              className="mt-0.5 shrink-0 text-amber-600"
                            />

                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                                Shipment Notice
                              </p>

                              <p className="mt-1 text-sm font-semibold text-amber-900">
                                {latestExceptionReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {latestCustomerInstruction && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                          <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                            Customer Instruction
                          </p>

                          <p className="mt-1 text-sm font-semibold leading-6 text-blue-950">
                            {latestCustomerInstruction}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipment Progress */}
                <div className="mt-10 border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-bold text-[var(--navy)]">
                    Shipment Progress
                  </h2>

                  <div className="relative mt-8">
                    {/* Gray Background Line */}
                    <div className="absolute bottom-2 left-[7px] top-2 w-[3px] rounded-full bg-gray-200" />

                    {/* Animated Blue Progress Line */}
                    {currentStatusIndex >= 0 && (
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{
                          height: `${
                            (currentStatusIndex /
                              (STATUS_ORDER.length - 1)) *
                            100
                          }%`,
                        }}
                        viewport={{
                          once: true,
                          amount: 0.6,
                        }}
                        transition={{
                          duration: 1.8,
                          ease: "easeInOut",
                        }}
                        className="absolute left-[7px] top-2 w-[3px] rounded-full bg-[var(--blue)]"
                      />
                    )}

                    <div className="relative space-y-7">
                      {STATUS_ORDER.map(
                        (status, index) => {
                          const completed =
                            index <=
                            currentStatusIndex;

                          const current =
                            index ===
                            currentStatusIndex;

                          /*
                           * FIX:
                           * We now retrieve the NEWEST event
                           * for this status instead of using
                           * history.find(), which returned the
                           * oldest matching event.
                           */
                          const event =
                            getLatestEventForStatus(
                              status
                            );

                          return (
                            <div
                              key={status}
                              className="relative flex gap-5"
                            >
                              {/* Dot */}
                              <motion.div
                                initial={{
                                  scale: 0.7,
                                }}
                                animate={{
                                  scale: completed
                                    ? 1
                                    : 0.9,
                                }}
                                transition={{
                                  duration: 0.4,
                                  delay: completed
                                    ? index * 0.15
                                    : 0,
                                }}
                                className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                                  completed
                                    ? "border-[var(--blue)] bg-[var(--blue)]"
                                    : "border-gray-300 bg-white"
                                } ${
                                  current
                                    ? "ring-4 ring-blue-100"
                                    : ""
                                }`}
                              />

                              {/* Content */}
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3
                                    className={`font-bold ${
                                      completed
                                        ? "text-[var(--navy)]"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {status}
                                  </h3>

                                  {current && (
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                                      Current
                                    </span>
                                  )}
                                </div>

                                {event &&
                                completed ? (
                                  <>
                                    {/* Location */}
                                    <p className="mt-1 flex items-start gap-1.5 text-sm font-bold text-gray-700">
                                      <MapPin
                                        size={15}
                                        className="mt-0.5 shrink-0 text-[var(--blue)]"
                                      />
                                      <span>
                                        {event.location}
                                      </span>
                                    </p>

                                    {/* Customer-facing update */}
                                    <p className="mt-2 text-sm font-extrabold leading-6 text-[var(--navy)]">
                                      {event.description}
                                    </p>

                                    {/* Estimated delivery */}
                                    {event.estimatedDelivery && (
                                      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                        <CalendarDays
                                          size={14}
                                          className="text-[var(--blue)]"
                                        />
                                        Estimated delivery:{" "}
                                        {new Date(
                                          event.estimatedDelivery
                                        ).toLocaleString()}
                                      </p>
                                    )}

                                    {/* Exception */}
                                    {event.exceptionReason && (
                                      <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                        <p className="text-xs font-bold text-amber-800">
                                          Notice:{" "}
                                          {
                                            event.exceptionReason
                                          }
                                        </p>
                                      </div>
                                    )}

                                    {/* Customer instruction */}
                                    {event.customerInstruction && (
                                      <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
                                        <p className="text-xs font-semibold leading-5 text-blue-900">
                                          {
                                            event.customerInstruction
                                          }
                                        </p>
                                      </div>
                                    )}

                                    {/* Event time */}
                                    <p className="mt-2 text-xs text-gray-400">
                                      {new Date(
                                        event.createdAt
                                      ).toLocaleString()}
                                    </p>
                                  </>
                                ) : (
                                  <p
                                    className={`mt-1 text-sm ${
                                      completed
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {completed
                                      ? "Shipment milestone completed."
                                      : "Pending"}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipment Map */}
                <ShipmentMap
                  origin={shipment.origin}
                  destination={shipment.destination}
                  originLat={shipment.originLat}
                  originLng={shipment.originLng}
                  destinationLat={
                    shipment.destinationLat
                  }
                  destinationLng={
                    shipment.destinationLng
                  }
                  currentLat={shipment.currentLat}
                  currentLng={shipment.currentLng}
                />
              </motion.div>
            )}

            {/* Security */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck
                size={16}
                className="text-green-600"
              />
              Your shipment information is handled
              securely.
            </div>
          </motion.div>

          {/* Back Link */}
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <Link
              href="/"
              className="text-sm font-bold text-[var(--blue)] hover:underline"
            >
              ← Back to TrackLink Express
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--light-gray)]">
          <p className="text-sm font-semibold text-gray-500">
            Loading tracking...
          </p>
        </main>
      }
    >
      <TrackingPageContent />
    </Suspense>
  );
}