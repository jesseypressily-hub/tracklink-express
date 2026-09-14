"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Package,
  Save,
  Trash2,
  Truck,
  AlertTriangle,
  User,
  Mail,
  Phone,
} from "lucide-react";

import LocationSearch from "@/components/LocationSearch";

const STATUS_OPTIONS = [
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

const EXCEPTION_OPTIONS = [
  "Weather delay",
  "Address issue",
  "Customs clearance",
  "Delivery attempt failed",
  "Recipient unavailable",
  "Transportation delay",
  "Facility delay",
  "Other",
];

type LocationValue = {
  name: string;
  latitude: number;
  longitude: number;
};

type Shipment = {
  id: string;
  trackingNumber: string;
  currentStatus: string;
  estimatedDelivery?: string | null;

  senderName: string;
  senderEmail?: string;
  senderPhone: string;
  senderAddress: string;

  recipientName: string;
  recipientEmail?: string;
  recipientPhone: string;
  recipientAddress: string;

  createdAt: string;

  origin: string;
  destination: string;

  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;

  currentLat?: number | null;
  currentLng?: number | null;

  serviceType: string;
  packageType: string;
  weight: number;
  numberOfPackages: number;

  shippingCost?: number | null;
  otherFees?: number | null;
  totalAmount?: number | null;

  latestUpdateDescription?: string | null;
  exceptionReason?: string | null;
  customerInstruction?: string | null;
  lastUpdatedAt?: string | null;
};

export default function ManageShipmentPage() {
  const params = useParams();
  const router = useRouter();

  const shipmentId = params.id as string;

  const [shipment, setShipment] =
    useState<Shipment | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [status, setStatus] = useState(
    "Shipment Created"
  );

  const [location, setLocation] =
    useState<LocationValue | null>(null);

  const [description, setDescription] =
    useState("");

  const [estimatedDeliveryDate, setEstimatedDeliveryDate] =
    useState("");

  const [estimatedDeliveryTime, setEstimatedDeliveryTime] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [eventTime, setEventTime] =
    useState("");

  const [exceptionReason, setExceptionReason] =
    useState("");

  const [customerInstruction, setCustomerInstruction] =
    useState("");

  useEffect(() => {
    if (!shipmentId) return;

    loadShipment();
  }, [shipmentId]);

  async function loadShipment() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/shipments/${shipmentId}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load shipment."
        );
      }

      const loadedShipment: Shipment =
        data.shipment;

      setShipment(loadedShipment);

      setStatus(
        loadedShipment.currentStatus ||
          "Shipment Created"
      );

      setDescription(
        loadedShipment.latestUpdateDescription ||
          ""
      );

      setExceptionReason(
        loadedShipment.exceptionReason || ""
      );

      setCustomerInstruction(
        loadedShipment.customerInstruction || ""
      );

      /*
       * Existing shipment location.
       *
       * The shipment model stores the coordinates,
       * while the location name is normally obtained
       * from the update event.
       *
       * We intentionally do not overwrite the user's
       * location selection here.
       */

      // Estimated delivery
      if (loadedShipment.estimatedDelivery) {
        const estimatedDate = new Date(
          loadedShipment.estimatedDelivery
        );

        if (!Number.isNaN(estimatedDate.getTime())) {
          const year =
            estimatedDate.getFullYear();

          const month = String(
            estimatedDate.getMonth() + 1
          ).padStart(2, "0");

          const day = String(
            estimatedDate.getDate()
          ).padStart(2, "0");

          const hours = String(
            estimatedDate.getHours()
          ).padStart(2, "0");

          const minutes = String(
            estimatedDate.getMinutes()
          ).padStart(2, "0");

          setEstimatedDeliveryDate(
            `${year}-${month}-${day}`
          );

          setEstimatedDeliveryTime(
            `${hours}:${minutes}`
          );
        }
      }

      /*
       * New tracking events default to the current
       * shipment time when the page is opened.
       */
      const now = new Date();

      const year = now.getFullYear();

      const month = String(
        now.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        now.getDate()
      ).padStart(2, "0");

      const hours = String(
        now.getHours()
      ).padStart(2, "0");

      const minutes = String(
        now.getMinutes()
      ).padStart(2, "0");

      setEventDate(
        `${year}-${month}-${day}`
      );

      setEventTime(
        `${hours}:${minutes}`
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load shipment."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateShipment() {
    if (!shipment) return;

    setError("");
    setSuccess("");

    if (!status.trim()) {
      setError("Please select a shipment status.");
      return;
    }

    if (!location) {
      setError(
        "Please select the shipment's current location."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Please enter a customer-facing update description."
      );
      return;
    }

    if (!eventDate || !eventTime) {
      setError(
        "Please select when this tracking event occurred."
      );
      return;
    }

    if (
      exceptionReason &&
      !EXCEPTION_OPTIONS.includes(exceptionReason)
    ) {
      setError(
        "Please select a valid exception reason."
      );
      return;
    }

    let eventDateTime: string;

    try {
      const eventDateObject = new Date(
        `${eventDate}T${eventTime}:00`
      );

      if (
        Number.isNaN(
          eventDateObject.getTime()
        )
      ) {
        throw new Error();
      }

      eventDateTime =
        eventDateObject.toISOString();
    } catch {
      setError(
        "The tracking event date or time is invalid."
      );
      return;
    }

    let estimatedDelivery:
      | string
      | null = null;

    if (
      estimatedDeliveryDate ||
      estimatedDeliveryTime
    ) {
      if (
        !estimatedDeliveryDate ||
        !estimatedDeliveryTime
      ) {
        setError(
          "Please provide both the estimated delivery date and time."
        );
        return;
      }

      const estimatedDateObject = new Date(
        `${estimatedDeliveryDate}T${estimatedDeliveryTime}:00`
      );

      if (
        Number.isNaN(
          estimatedDateObject.getTime()
        )
      ) {
        setError(
          "The estimated delivery date or time is invalid."
        );
        return;
      }

      estimatedDelivery =
        estimatedDateObject.toISOString();
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/shipments/${shipmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,

            location: location.name,

            description:
              description.trim(),

            currentLat:
              location.latitude,

            currentLng:
              location.longitude,

            estimatedDelivery,

            eventDateTime,

            exceptionReason:
              exceptionReason || "",

            customerInstruction:
              customerInstruction.trim(),

          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update shipment."
        );
      }

      setSuccess(
        "Shipment update saved successfully."
      );

      /*
       * Refresh the shipment so the admin page
       * immediately reflects the saved state.
       */
      await loadShipment();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update shipment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCurrentShipment() {
    if (!shipment) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete shipment ${shipment.trackingNumber}? This will also remove its tracking history.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/shipments/${shipmentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete shipment."
        );
      }

      router.push("/admin");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete shipment."
      );
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(
    value?: string | null
  ) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-5">
              <div className="h-8 w-64 rounded bg-slate-200" />
              <div className="h-24 rounded bg-slate-200" />
              <div className="h-40 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!shipment) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
            {error || "Shipment not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={18} />
              Back to Shipments
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Manage Shipment
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update the shipment's current tracking
              information and customer-facing status.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Package
              size={18}
              className="text-blue-600"
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Tracking Number
              </p>

              <p className="font-bold text-slate-900">
                {shipment.trackingNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* Main update form */}
          <section className="space-y-6">

            {/* Current shipment status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Truck size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Shipment Update
                  </h2>

                  <p className="text-sm text-slate-500">
                    Update what customers see on the
                    tracking page.
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Shipment Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {STATUS_OPTIONS.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Current Shipment Location
                  </label>

                  <LocationSearch
  label="Current Shipment Location"
  value={location}
  onChange={setLocation}
/>

                  {location && (
                    <div className="mt-3 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <div>
                        <p className="text-sm font-bold text-blue-900">
                          {location.name}
                        </p>

                        <p className="mt-1 text-xs text-blue-700">
                          Coordinates:{" "}
                          {location.latitude.toFixed(
                            5
                          )}
                          ,{" "}
                          {location.longitude.toFixed(
                            5
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Event date/time */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tracking Event Date & Time
                  </label>

                  <p className="mb-3 text-xs text-slate-500">
                    When this shipment event actually
                    happened.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <Calendar
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) =>
                          setEventDate(
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="relative">
                      <Clock
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="time"
                        value={eventTime}
                        onChange={(e) =>
                          setEventTime(
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Estimated delivery */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Estimated Delivery
                  </label>

                  <p className="mb-3 text-xs text-slate-500">
                    The expected delivery date and time
                    shown to the customer.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <Calendar
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="date"
                        value={
                          estimatedDeliveryDate
                        }
                        onChange={(e) =>
                          setEstimatedDeliveryDate(
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="relative">
                      <Clock
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="time"
                        value={
                          estimatedDeliveryTime
                        }
                        onChange={(e) =>
                          setEstimatedDeliveryTime(
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Customer update */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Customer-Facing Update
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    rows={5}
                    placeholder="Example: Your shipment has arrived at our Paris distribution facility and is scheduled for delivery tomorrow."
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    This message will be displayed
                    prominently on the customer's
                    tracking page.
                  </p>
                </div>

                {/* Exception */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <AlertTriangle
                      size={16}
                      className="text-amber-500"
                    />
                    Exception / Delay Reason
                  </label>

                  <select
                    value={exceptionReason}
                    onChange={(e) =>
                      setExceptionReason(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      No exception
                    </option>

                    {EXCEPTION_OPTIONS.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Customer instruction */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Customer Instruction / Next Action
                  </label>

                  <textarea
                    value={customerInstruction}
                    onChange={(e) =>
                      setCustomerInstruction(
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Example: Please ensure someone is available to receive the shipment."
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Save */}
                <button
                  type="button"
                  onClick={updateShipment}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />

                  {saving
                    ? "Saving Shipment Update..."
                    : "Save Shipment Update"}
                </button>
              </div>
            </div>

            {/* Delete */}
            <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-red-700">
                    Delete Shipment
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Permanently removes this shipment
                    and its tracking history.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    deleteCurrentShipment
                  }
                  disabled={deleting}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={17} />

                  {deleting
                    ? "Deleting..."
                    : "Delete Shipment"}
                </button>
              </div>
            </div>
          </section>

          {/* Shipment information */}
          <aside className="space-y-6">

            {/* Current state */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-slate-900">
                Current Shipment
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Current Status
                  </p>

                  <p className="mt-1 font-bold text-blue-600">
                    {shipment.currentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(
                      shipment.createdAt
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Estimated Delivery
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(
                      shipment.estimatedDelivery
                    )}
                  </p>
                </div>

                {shipment.lastUpdatedAt && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Internal Last Updated
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(
                        shipment.lastUpdatedAt
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sender */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <User
                  size={18}
                  className="text-blue-600"
                />
                Sender
              </h2>

              <div className="space-y-3 text-sm">
                <p className="font-semibold text-slate-900">
                  {shipment.senderName}
                </p>

                <p className="flex items-start gap-2 text-slate-600">
                  <Mail
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                  {shipment.senderEmail ||
                    "No email"}
                </p>

                <p className="flex items-start gap-2 text-slate-600">
                  <Phone
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                  {shipment.senderPhone}
                </p>

                <p className="text-slate-600">
                  {shipment.senderAddress}
                </p>
              </div>
            </div>

            {/* Recipient */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <User
                  size={18}
                  className="text-blue-600"
                />
                Recipient
              </h2>

              <div className="space-y-3 text-sm">
                <p className="font-semibold text-slate-900">
                  {shipment.recipientName}
                </p>

                <p className="flex items-start gap-2 text-slate-600">
                  <Mail
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                  {shipment.recipientEmail ||
                    "No email"}
                </p>

                <p className="flex items-start gap-2 text-slate-600">
                  <Phone
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                  {shipment.recipientPhone}
                </p>

                <p className="text-slate-600">
                  {shipment.recipientAddress}
                </p>
              </div>
            </div>

            {/* Route */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <MapPin
                  size={18}
                  className="text-blue-600"
                />
                Shipment Route
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Origin
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {shipment.origin}
                  </p>
                </div>

                <div className="h-px bg-slate-100" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Destination
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {shipment.destination}
                  </p>
                </div>
              </div>
            </div>

            {/* Package */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <Package
                  size={18}
                  className="text-blue-600"
                />
                Package
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400">
                    Type
                  </p>

                  <p className="mt-1 font-semibold text-slate-700">
                    {shipment.packageType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Service
                  </p>

                  <p className="mt-1 font-semibold text-slate-700">
                    {shipment.serviceType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Weight
                  </p>

                  <p className="mt-1 font-semibold text-slate-700">
                    {shipment.weight} kg
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Packages
                  </p>

                  <p className="mt-1 font-semibold text-slate-700">
                    {shipment.numberOfPackages}
                  </p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}