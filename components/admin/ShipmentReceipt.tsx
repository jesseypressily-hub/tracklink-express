"use client";

import { QRCodeSVG } from "qrcode.react";
import { Printer, X } from "lucide-react";

type ShipmentReceiptProps = {
trackingNumber: string;
customerName: string;
origin: string;
destination: string;
status: string;
createdAt: string;
onClose: () => void;
};

export default function ShipmentReceipt({
trackingNumber,
customerName,
origin,
destination,
status,
createdAt,
onClose,
}: ShipmentReceiptProps) {
const trackingUrl =
typeof window !== "undefined"
? `${window.location.origin}/tracking?tracking=${encodeURIComponent(
          trackingNumber
        )}`
: trackingNumber;

function printReceipt() {
window.print();
}

return ( <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 p-4"> <div className="flex min-h-full items-center justify-center py-8"> <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

```
      {/* Actions */}
      <div className="flex items-center justify-between border-b bg-slate-50 px-5 py-4 print:hidden">
        <h2 className="font-bold text-[var(--navy)]">
          Shipment Receipt
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={printReceipt}
            className="flex items-center gap-2 rounded-lg bg-[var(--blue)] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            <Printer size={17} />
            Print
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Receipt */}
      <div className="p-7 sm:p-10">

        {/* Company */}
        <div className="border-b-2 border-[var(--navy)] pb-6 text-center">
          <p className="text-2xl font-black tracking-tight text-[var(--navy)]">
            TRACKLINK EXPRESS
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            Shipment Receipt
          </p>
        </div>

        {/* Tracking Number */}
        <div className="mt-7 rounded-xl bg-slate-50 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Tracking Number
          </p>

          <p className="mt-2 font-mono text-2xl font-black tracking-wide text-[var(--blue)]">
            {trackingNumber}
          </p>
        </div>

        {/* Shipment Details */}
        <div className="mt-7 grid gap-5 sm:grid-cols-2">

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Customer
            </p>

            <p className="mt-1 font-bold text-[var(--navy)]">
              {customerName}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Date Created
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Origin
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {origin}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Destination
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {destination}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Status
            </p>

            <p className="mt-1 font-semibold text-[var(--navy)]">
              {status}
            </p>
          </div>

        </div>

        {/* QR Code */}
        <div className="mt-8 flex flex-col items-center border-t pt-8">
          <QRCodeSVG
            value={trackingUrl}
            size={150}
            level="M"
            includeMargin
          />

          <p className="mt-4 text-center text-xs font-semibold text-gray-500">
            Scan this QR code to track this shipment
          </p>

          <p className="mt-1 font-mono text-[10px] text-gray-400">
            {trackingNumber}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t pt-5 text-center">
          <p className="text-xs font-semibold text-gray-500">
            Thank you for choosing TrackLink Express.
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            This receipt was automatically generated when the shipment
            was created.
          </p>
        </div>

      </div>
    </div>
  </div>

  {/* Print styling */}
  <style jsx global>{`
    @media print {
      body {
        background: white !important;
      }

      body * {
        visibility: hidden;
      }

      .fixed,
      .fixed * {
        visibility: visible;
      }

      .fixed {
        position: absolute !important;
        inset: 0 !important;
        background: white !important;
        padding: 0 !important;
      }

      .fixed > div {
        min-height: auto !important;
        padding: 0 !important;
      }

      .fixed > div > div {
        max-width: none !important;
        width: 100% !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }
  `}</style>
</div>
);
}