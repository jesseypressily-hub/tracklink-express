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
import LocationSearch, {
  SelectedLocation,
} from "@/components/LocationSearch";
import ShipmentReceipt from "@/components/admin/ShipmentReceipt";
import AdminChat from "@/components/admin/AdminChat";
type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  origin: string;
  destination: string;
  packageType: string;
  weight: string;
  message: string;
  status: string;
  createdAt: string;
};
type Shipment = {
  id: string;
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  currentStatus: string;
  createdAt: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  currentLat: number;
  currentLng: number;
};
export default function AdminPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] =
  useState<QuoteRequest | null>(null);
  const [updatingQuote, setUpdatingQuote] =
  useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [customerName, setCustomerName] = useState("");
 const [origin, setOrigin] =
  useState<SelectedLocation | null>(null);

const [destination, setDestination] =
  useState<SelectedLocation | null>(null);
  const [status, setStatus] = useState("Shipment Created");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  status: string;
  createdAt: string;
} | null>(null);

  useEffect(() => {
  loadShipments();
  loadQuoteRequests();
  async function updateQuoteStatus(
  newStatus: string
) {
  if (!selectedQuote) {
    return;
  }

  try {
    setUpdatingQuote(true);
    setError("");

    const response = await fetch(
      `/api/admin/quotes/${selectedQuote.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.error ||
          "Unable to update quote status."
      );
      return;
    }

    const updatedQuote = {
      ...selectedQuote,
      status: newStatus,
    };

    setSelectedQuote(updatedQuote);

    setQuoteRequests((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === updatedQuote.id
          ? updatedQuote
          : quote
      )
    );
  } catch {
    setError(
      "Unable to connect to the server."
    );
  } finally {
    setUpdatingQuote(false);
  }
}
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
  async function loadQuoteRequests() {
  try {
    const response = await fetch("/api/admin/quotes");
    const data = await response.json();

    if (response.ok) {
      setQuoteRequests(data);
    } else {
      setError(
        data.error || "Unable to load quote requests."
      );
    }
  } catch {
    setError("Unable to load quote requests.");
  }
}
async function updateQuoteStatus(newStatus: string) {
  if (!selectedQuote) {
    return;
  }

  try {
    setUpdatingQuote(true);
    setError("");

    const response = await fetch(
      `/api/admin/quotes/${selectedQuote.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.error || "Unable to update quote status."
      );
      return;
    }

    const updatedQuote = {
      ...selectedQuote,
      status: newStatus,
    };

    setSelectedQuote(updatedQuote);

    setQuoteRequests((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === updatedQuote.id
          ? updatedQuote
          : quote
      )
    );
  } catch {
    setError("Unable to connect to the server.");
  } finally {
    setUpdatingQuote(false);
  }
}

async function deleteQuote() {
  if (!selectedQuote) {
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete the quote request from ${selectedQuote.name}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setUpdatingQuote(true);
    setError("");

    const response = await fetch(
      `/api/admin/quotes/${selectedQuote.id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.error ||
          "Unable to delete quote request."
      );
      return;
    }

    setQuoteRequests((currentQuotes) =>
      currentQuotes.filter(
        (quote) => quote.id !== selectedQuote.id
      )
    );

    setSelectedQuote(null);
  } catch {
    setError(
      "Unable to connect to the server."
    );
  } finally {
    setUpdatingQuote(false);
  }
}

  async function createShipment() {
    setError("");
    setMessage("");

    if (!customerName.trim()) {
      setError("Please enter the customer name.");
      return;
    }

    if (!origin) {
  setError("Please select the shipment origin.");
  return;
}

if (!destination) {
  setError("Please select the shipment destination.");
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
  origin: origin.name,
  destination: destination.name,
  originLat: origin.latitude,
  originLng: origin.longitude,
  destinationLat: destination.latitude,
  destinationLng: destination.longitude,
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

setReceipt({
  trackingNumber: data.trackingNumber,
  customerName,
  origin: origin.name,
  destination: destination.name,
  status,
  createdAt: new Date().toISOString(),
});

setCustomerName("");
setOrigin(null);
setDestination(null);
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
        shipment.trackingNumber
          .toLowerCase()
          .includes(query) ||
        shipment.customerName
          .toLowerCase()
          .includes(query)
    );
  }, [shipments, search]);

  const totalShipments = shipments.length;

  const inTransit = shipments.filter(
    (shipment) =>
      shipment.currentStatus.toLowerCase() ===
      "shipment in transit"
  ).length;

  const pending = shipments.filter(
    (shipment) =>
      shipment.currentStatus.toLowerCase() ===
      "shipment created"
  ).length;

  const delivered = shipments.filter(
    (shipment) =>
      shipment.currentStatus.toLowerCase() ===
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
                <LocationSearch
  label="Origin"
  value={origin}
  onChange={setOrigin}
  placeholder="Search for origin city..."
/>
              </div>

              <div>
               <LocationSearch
  label="Destination"
  value={destination}
  onChange={setDestination}
  placeholder="Search for destination city..."
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
                          {shipment.trackingNumber}
                        </td>

                        <td className="px-6 py-5">
                          {shipment.customerName}
                        </td>

                        <td className="px-6 py-5">
                          {shipment.origin} →{" "}
                          {shipment.destination}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            {shipment.currentStatus}
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

      {/* Quote Requests */}
      <div className="mt-8 rounded-2xl bg-white shadow-sm">

        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-[var(--navy)]">
            Quote Requests
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Customer requests for shipping quotes.
          </p>
        </div>

        {quoteRequests.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No quote requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Service
                  </th>

                  <th className="px-6 py-4">
                    Route
                  </th>

                  <th className="px-6 py-4">
                    Package
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
  Date
</th>

<th className="px-6 py-4">
  Action
</th>
                </tr>
              </thead>

              <tbody>
                {quoteRequests.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-t"
                  >

                    <td className="px-6 py-5">
                      <p className="font-bold text-[var(--navy)]">
                        {quote.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {quote.email}
                      </p>

                      {quote.phone && (
                        <p className="mt-1 text-xs text-gray-500">
                          {quote.phone}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold">
                        {quote.service}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p>
                        {quote.origin} →{" "}
                        {quote.destination}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold">
                        {quote.packageType || "—"}
                      </p>

                      {quote.weight && (
                        <p className="mt-1 text-xs text-gray-500">
                          {quote.weight}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span
  className={`rounded-full px-3 py-1 text-xs font-bold ${
    quote.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : quote.status === "contacted"
      ? "bg-blue-100 text-blue-700"
      : quote.status === "completed"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700"
  }`}
>
  {quote.status.charAt(0).toUpperCase() +
    quote.status.slice(1)}
</span>
                    </td>

                    <td className="px-6 py-5">
  <button
  type="button"
  onClick={() => setSelectedQuote(quote)}
  className="font-bold text-[var(--blue)] hover:underline"
>
  View
</button>
</td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

            </div>

      <AdminChat />

      {receipt && (
  <ShipmentReceipt
    trackingNumber={receipt.trackingNumber}
    customerName={receipt.customerName}
    origin={receipt.origin}
    destination={receipt.destination}
    status={receipt.status}
    createdAt={receipt.createdAt}
    onClose={() => setReceipt(null)}
  />
)}
{selectedQuote && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

      {/* Modal Header */}
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--blue)]">
            TrackLink Express
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-[var(--navy)]">
            Quote Request
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setSelectedQuote(null)}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="max-h-[70vh] overflow-y-auto p-6">

        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Customer
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {selectedQuote.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Service
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {selectedQuote.service}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Email
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {selectedQuote.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Phone
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {selectedQuote.phone || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Origin
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {selectedQuote.origin}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Destination
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {selectedQuote.destination}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Package Type
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {selectedQuote.packageType || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Weight
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {selectedQuote.weight || "Not provided"}
            </p>
          </div>

        </div>

        {/* Message */}
        <div className="mt-6 border-t pt-6">

          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Customer Message
          </p>

          <div className="mt-2 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
            {selectedQuote.message || "No message provided."}
          </div>

        </div>

        {/* Status + Date */}
        <div className="mt-6 grid gap-5 border-t pt-6 sm:grid-cols-2">

          <div>
  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
    Quote Status
  </p>

  <div className="mt-2 flex flex-wrap items-center gap-3">

    <select
      value={selectedQuote.status}
      onChange={(event) =>
        updateQuoteStatus(event.target.value)
      }
      disabled={updatingQuote}
      className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-[var(--navy)] outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <option value="pending">
        Pending
      </option>

      <option value="contacted">
        Contacted
      </option>

      <option value="completed">
        Completed
      </option>
    </select>

    {selectedQuote.status === "pending" && (
      <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">
        Pending
      </span>
    )}

    {selectedQuote.status === "contacted" && (
      <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
        Contacted
      </span>
    )}

    {selectedQuote.status === "completed" && (
      <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
        Completed
      </span>
    )}

  </div>

  {updatingQuote && (
    <p className="mt-2 text-xs font-semibold text-gray-500">
      Updating status...
    </p>
  )}
</div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Submitted
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {new Date(
                selectedQuote.createdAt
              ).toLocaleString()}
            </p>
          </div>

        </div>

      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-between border-t bg-gray-50 p-5">

  <button
    type="button"
    onClick={deleteQuote}
    disabled={updatingQuote}
    className="rounded-xl bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
  >
    Delete Request
  </button>

  <button
    type="button"
    onClick={() => setSelectedQuote(null)}
    disabled={updatingQuote}
    className="rounded-xl bg-[var(--blue)] px-5 py-3 text-sm font-bold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
  >
    Close
  </button>

</div>

    </div>
  </div>
)}

    </main>
  );
}