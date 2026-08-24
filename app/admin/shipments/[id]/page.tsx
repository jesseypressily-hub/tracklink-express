"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Package } from "lucide-react";

type Shipment = {
  id: number;
  tracking_number: string;
  customer_name: string;
  origin: string;
  destination: string;
  current_status: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  "Shipment Created",
  "Package Received",
  "Departed Facility",
  "Shipment in Transit",
  "Out for Delivery",
  "Delivered",
];

export default function ShipmentManagementPage() {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadShipment();
  }, []);

  async function loadShipment() {
    try {
      setLoading(true);

      const pathParts = window.location.pathname.split("/");
      const id = pathParts[pathParts.length - 1];

      const response = await fetch(
        `/api/admin/shipments/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to load shipment.");
        return;
      }

      setShipment(data.shipment);
      setStatus(data.shipment.current_status);
      setLocation(data.shipment.origin);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function updateShipment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!status) {
      setError("Please select a status.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter the shipment location.");
      return;
    }

    try {
      setSaving(true);

      const pathParts = window.location.pathname.split("/");
      const id = pathParts[pathParts.length - 1];

      const response = await fetch(
        `/api/admin/shipments/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            location,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to update shipment."
        );
        return;
      }

      setMessage("Shipment updated successfully.");
      setDescription("");

      await loadShipment();
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          Loading shipment...
        </div>
      </main>
    );
  }

  if (error && !shipment) {
    return (
      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-red-600">
            {error}
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex font-bold text-[var(--blue)] hover:underline"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!shipment) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--blue)] hover:underline"
          >
            <ArrowLeft size={17} />
            Back to Admin Dashboard
          </Link>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--blue)]">
              TrackLink Express
            </p>

            <h1 className="mt-1 text-3xl font-extrabold text-[var(--navy)]">
              Manage Shipment
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Package
                  size={24}
                  className="text-[var(--blue)]"
                />

                <h2 className="text-xl font-bold text-[var(--navy)]">
                  Shipment Information
                </h2>
              </div>

              <p className="mt-3 font-mono text-sm font-bold text-[var(--blue)]">
                {shipment.tracking_number}
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
              {shipment.current_status}
            </span>
          </div>

          <div className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Customer
              </p>

              <p className="mt-1 font-semibold text-[var(--navy)]">
                {shipment.customer_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Created
              </p>

              <p className="mt-1 font-semibold text-[var(--navy)]">
                {new Date(
                  shipment.created_at
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Origin
              </p>

              <p className="mt-1 font-semibold text-[var(--navy)]">
                {shipment.origin}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Destination
              </p>

              <p className="mt-1 font-semibold text-[var(--navy)]">
                {shipment.destination}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[var(--navy)]">
            Update Shipment
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the shipment status and add a tracking event.
          </p>

          {message && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={updateShipment}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Shipment Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Current Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Los Angeles, CA"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Update Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
                placeholder="Shipment has departed the facility and is moving toward the destination."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[var(--blue)] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Shipment Update
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}