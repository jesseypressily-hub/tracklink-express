"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Truck,
  Clock3,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import AdminNav from "./components/AdminNav";
type Shipment = {
  id: number;
  tracking_number: string;
  customer_name: string;
  origin: string;
  destination: string;
  current_status: string;
  created_at: string;
};

export default function AdminPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("Shipment Created");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/shipments");
      const data = await response.json();

      if (response.ok) {
        setShipments(data);
      } else {
        setError(data.error || "Unable to load shipments.");
      }
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function createShipment() {
    setError("");
    setMessage("");

    if (!customerName.trim()) {
      setError("Please enter the customer name.");
      return;
    }

    if (!origin.trim()) {
      setError("Please enter the shipment origin.");
      return;
    }

    if (!destination.trim()) {
      setError("Please enter the shipment destination.");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(
        "/api/admin/shipments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName,
            origin,
            destination,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create shipment.");
        return;
      }

      setMessage(
        `Shipment created successfully: ${data.trackingNumber}`
      );

      setCustomerName("");
      setOrigin("");
      setDestination("");
      setStatus("Shipment Created");

      await loadShipments();

    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setCreating(false);
    }
  }

  const filteredShipments = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return shipments;
    }

    return shipments.filter(
      (shipment) =>
        shipment.tracking_number
          .toLowerCase()
          .includes(query) ||
        shipment.customer_name
          .toLowerCase()
          .includes(query)
    );
  }, [shipments, search]);

  const totalShipments = shipments.length;

  const inTransit = shipments.filter(
    (shipment) =>
      shipment.current_status.toLowerCase() ===
      "shipment in transit"
  ).length;

  const pending = shipments.filter(
    (shipment) =>
      shipment.current_status.toLowerCase() ===
      "shipment created"
  ).length;

  const delivered = shipments.filter(
    (shipment) =>
      shipment.current_status.toLowerCase() ===
      "delivered"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100">
        <AdminNav />

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--blue)]">
              TrackLink Express
            </p>

            <h1 className="mt-1 text-2xl font-extrabold text-[var(--navy)]">
              Admin Dashboard
            </h1>
          </div>

          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setError("");
              setMessage("");
            }}
            className="flex items-center gap-2 rounded-xl bg-[var(--blue)] px-4 py-3 text-sm font-bold text-white transition hover:shadow-lg"
          >
            {showCreateForm ? (
              <X size={18} />
            ) : (
              <Plus size={18} />
            )}

            {showCreateForm
              ? "Close"
              : "New Shipment"}
          </button>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Package
              className="text-blue-600"
              size={24}
            />

            <p className="mt-4 text-sm text-gray-500">
              Total Shipments
            </p>

            <p className="mt-1 text-3xl font-extrabold text-[var(--navy)]">
              {totalShipments}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Truck
              className="text-orange-500"
              size={24}
            />

            <p className="mt-4 text-sm text-gray-500">
              In Transit
            </p>

            <p className="mt-1 text-3xl font-extrabold text-[var(--navy)]">
              {inTransit}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Clock3
              className="text-yellow-500"
              size={24}
            />

            <p className="mt-4 text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-1 text-3xl font-extrabold text-[var(--navy)]">
              {pending}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <CheckCircle2
              className="text-green-600"
              size={24}
            />

            <p className="mt-4 text-sm text-gray-500">
              Delivered
            </p>

            <p className="mt-1 text-3xl font-extrabold text-[var(--navy)]">
              {delivered}
            </p>
          </div>

        </div>

        {/* Create Shipment */}
        {showCreateForm && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">
                Create New Shipment
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                The system will automatically generate the
                tracking number.
              </p>
            </div>

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

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Customer Name
                </label>

                <input
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[var(--blue)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Origin
                </label>

                <input
                  value={origin}
                  onChange={(event) =>
                    setOrigin(event.target.value)
                  }
                  type="text"
                  placeholder="Los Angeles, CA"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[var(--blue)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Destination
                </label>

                <input
                  value={destination}
                  onChange={(event) =>
                    setDestination(event.target.value)
                  }
                  type="text"
                  placeholder="New York, NY"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[var(--blue)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Initial Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[var(--blue)]"
                >
                  <option>Shipment Created</option>
                  <option>Package Received</option>
                  <option>Departed Facility</option>
                  <option>Shipment in Transit</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </select>
              </div>

            </div>

            <button
              onClick={createShipment}
              disabled={creating}
              className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--blue)] px-6 py-3 font-bold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {creating ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Shipment
                </>
              )}
            </button>

          </div>
        )}

        {/* Shipment List */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">
                Shipments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor shipments.
              </p>
            </div>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search tracking number..."
                className="rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--blue)]"
              />

            </div>

          </div>

          <div className="overflow-x-auto">

            {loading ? (
              <div className="flex items-center justify-center gap-2 p-12 text-sm text-gray-500">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Loading shipments...
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-500">
                No shipments found.
              </div>
            ) : (
              <table className="w-full min-w-[750px] text-left text-sm">

                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">
                      Tracking Number
                    </th>

                    <th className="px-6 py-4">
                      Customer
                    </th>

                    <th className="px-6 py-4">
                      Route
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredShipments.map(
                    (shipment) => (
                      <tr
                        key={shipment.id}
                        className="border-t"
                      >

                        <td className="px-6 py-5 font-mono font-bold text-[var(--navy)]">
                          {shipment.tracking_number}
                        </td>

                        <td className="px-6 py-5">
                          {shipment.customer_name}
                        </td>

                        <td className="px-6 py-5">
                          {shipment.origin} →{" "}
                          {shipment.destination}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            {shipment.current_status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                            <a
                             href={`/admin/shipments/${shipment.id}`}
                             className="font-bold text-[var(--blue)] hover:underline"
                            >
                              Manage
                            </a>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}