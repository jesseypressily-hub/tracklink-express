"use client";

import {
  Download,
  Printer,
  Package,
  MapPin,
  User,
  Calendar,
} from "lucide-react";

type ShipmentReceiptProps = {
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  status?: string;
  createdAt?: string;
};

export default function ShipmentReceipt({
  trackingNumber,
  customerName,
  origin,
  destination,
  status = "Shipment Created",
  createdAt,
}: ShipmentReceiptProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : new Date().toLocaleString();

  function handlePrint() {
    window.print();
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Actions */}
      <div className="mb-5 flex flex-wrap justify-end gap-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
        >
          <Printer size={17} />
          Print Receipt
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Download size={17} />
          Save / Download
        </button>
      </div>

      {/* Receipt */}
      <div
        id="shipment-receipt"
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none"
      >
        {/* Header */}
        <div className="bg-[var(--navy)] px-6 py-7 text-white sm:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Package size={23} />
                </div>

                <div>
                  <h1 className="text-xl font-extrabold tracking-tight">
                    TrackLink Express
                  </h1>

                  <p className="text-xs font-medium text-white/70">
                    Global Logistics & Shipment Services
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Shipment Receipt
              </p>

              <p className="mt-1 font-mono text-sm font-bold">
                {trackingNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-5 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Shipment Status
              </p>

              <p className="mt-1 font-bold text-[var(--navy)]">
                {status}
              </p>
            </div>

            <div className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
              {status}
            </div>
          </div>
        </div>

        {/* Shipment details */}
        <div className="px-6 py-7 sm:px-10">
          <h2 className="text-lg font-extrabold text-[var(--navy)]">
            Shipment Details
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Customer */}
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
                <User size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Customer
                </p>

                <p className="mt-1 font-semibold text-[var(--navy)]">
                  {customerName}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--blue)]">
                <Calendar size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Created
                </p>

                <p className="mt-1 font-semibold text-[var(--navy)]">
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Origin */}
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <MapPin size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Origin
                </p>

                <p className="mt-1 font-semibold text-[var(--navy)]">
                  {origin}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <MapPin size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Destination
                </p>

                <p className="mt-1 font-semibold text-[var(--navy)]">
                  {destination}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking number */}
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              Tracking Number
            </p>

            <p className="mt-2 font-mono text-xl font-extrabold tracking-wider text-[var(--navy)]">
              {trackingNumber}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Use this number to track your shipment online.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-6 sm:px-10">
          <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-bold text-[var(--navy)]">
                Thank you for choosing TrackLink Express.
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Reliable. Secure. Connected.
              </p>
            </div>

            <p className="text-xs text-gray-400">
              This receipt was generated electronically.
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          #shipment-receipt,
          #shipment-receipt * {
            visibility: visible;
          }

          #shipment-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}