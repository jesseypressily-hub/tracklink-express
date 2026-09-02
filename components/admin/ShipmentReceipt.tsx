"use client";

import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import {
  Printer,
  X,
  Package,
  MapPin,
  User,
  Calendar,
  Truck,
  Scale,
  Boxes,
  CreditCard,
  Clock,
  ArrowDown,
} from "lucide-react";

type ShipmentReceiptProps = {
  trackingNumber: string;

  senderName: string;
  senderPhone: string;
  senderAddress: string;

  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;

  origin: string;
  destination: string;

  serviceType: string;
  packageType: string;
  weight: number;
  numberOfPackages: number;

  estimatedDelivery?: string;

  shippingCost?: number;
  otherFees?: number;
  totalAmount?: number;

  status: string;
  createdAt: string;

  onClose: () => void;
};

export default function ShipmentReceipt({
  trackingNumber,

  senderName,
  senderPhone,
  senderAddress,

  recipientName,
  recipientPhone,
  recipientAddress,

  origin,
  destination,

  serviceType,
  packageType,
  weight,
  numberOfPackages,

  estimatedDelivery,

  shippingCost,
  otherFees,
  totalAmount,

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

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : new Date().toLocaleString();

  function printReceipt() {
    window.print();
  }

 function downloadPDF() {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 350],
    });

    let y = 8;

    // Helper functions
    const line = () => {
      pdf.setDrawColor(210, 210, 210);
      pdf.setLineWidth(0.3);
      pdf.line(6, y, 74, y);
      y += 5;
    };

    const sectionTitle = (title: string) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text(title.toUpperCase(), 7, y);
      y += 5;
    };

    const row = (label: string, value: string) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);

      pdf.text(label, 7, y);
      pdf.text(value, 73, y, { align: "right" });

      y += 4.5;
    };

    // Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("TRACKLINK EXPRESS", 40, y, {
      align: "center",
    });

    y += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.text("GLOBAL LOGISTICS & SHIPMENT SERVICES", 40, y, {
      align: "center",
    });

    y += 5;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.text("SHIPMENT RECEIPT", 40, y, {
      align: "center",
    });

    y += 7;

    // Tracking number
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6.5);
    pdf.text("TRACKING NUMBER", 40, y, {
      align: "center",
    });

    y += 5;

    pdf.setFont("courier", "bold");
    pdf.setFontSize(11);
    pdf.text(trackingNumber, 40, y, {
      align: "center",
    });

    y += 5;

    // QR code
    const qrCanvas = document.querySelector(
      "#shipment-receipt canvas"
    ) as HTMLCanvasElement | null;

    if (qrCanvas) {
      const qrImage = qrCanvas.toDataURL("image/png");

      pdf.addImage(
        qrImage,
        "PNG",
        25,
        y,
        30,
        30
      );

      y += 34;
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.text("Scan to track this shipment online", 40, y, {
      align: "center",
    });

    y += 7;

    line();

    // Status
    sectionTitle("Shipment Status");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text(status, 7, y);

    y += 7;

    line();

    // Route
    sectionTitle("Shipment Route");

    row("Origin", origin);
    row("Destination", destination);

    y += 2;
    line();

    // Sender
    sectionTitle("Sender");

    row("Name", senderName);
    row("Phone", senderPhone);
    row("Address", senderAddress);

    y += 2;
    line();

    // Recipient
    sectionTitle("Recipient");

    row("Name", recipientName);
    row("Phone", recipientPhone);
    row("Address", recipientAddress);

    y += 2;
    line();

    // Package
    sectionTitle("Package Information");

    row("Service", serviceType);
    row("Package Type", packageType);
    row("Weight", `${weight} kg`);
    row("Packages", `${numberOfPackages}`);

    y += 2;
    line();

    // Delivery
    sectionTitle("Delivery Information");

    row("Shipment Date", formattedDate);

    if (estimatedDelivery) {
      row("Estimated Delivery", estimatedDelivery);
    }

    y += 2;
    line();

    // Charges
    sectionTitle("Charges");

    if (shippingCost !== undefined) {
      row("Shipping Cost", formatMoney(shippingCost));
    }

    if (otherFees !== undefined && otherFees > 0) {
      row("Other Fees", formatMoney(otherFees));
    }

    y += 2;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("TOTAL", 7, y);
    pdf.text(formatMoney(totalAmount), 73, y, {
      align: "right",
    });

    y += 8;

    line();

    // Footer
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text("TRACKLINK EXPRESS", 40, y, {
      align: "center",
    });

    y += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.text("Reliable. Secure. Connected.", 40, y, {
      align: "center",
    });

    y += 5;

    pdf.text(
      "Thank you for choosing TrackLink Express.",
      40,
      y,
      { align: "center" }
    );

    y += 4;

    pdf.text(
      "Use your tracking number to monitor your shipment online.",
      40,
      y,
      { align: "center" }
    );

    y += 7;

    pdf.setFont("courier", "normal");
    pdf.setFontSize(6.5);
    pdf.text(trackingNumber, 40, y, {
      align: "center",
    });

    y += 4;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(5.5);
    pdf.text("ELECTRONICALLY GENERATED RECEIPT", 40, y, {
      align: "center",
    });

    // Create a correctly sized final PDF page
    const finalHeight = y + 8;

    // jsPDF cannot resize the existing page after creation,
    // so create a new correctly-sized document.
    const finalPdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, finalHeight],
    });

    const pageData = pdf.output("datauristring");

    // Instead of copying the page as an image, regenerate is safer.
    // Save the original generated document for now.
    pdf.save(`${trackingNumber}-receipt.pdf`);

    console.log("PDF downloaded successfully.");
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("PDF generation failed. Check the browser console.");
  }
}
function formatMoney(amount?: number) {
    if (amount === undefined || amount === null) {
      return "—";
    }

    return `£${amount.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <div
      id="receipt-overlay"
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 p-4"
    >
      <div className="flex min-h-full items-center justify-center py-8">
        <div
          id="shipment-receipt"
          className="w-full max-w-[480px] overflow-hidden bg-white text-gray-800 shadow-2xl"
        >
          {/* Top accent */}
          <div className="h-2 bg-[var(--blue)]" />

          {/* Actions */}
          <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3 print:hidden">
            <h2 className="text-sm font-black text-[var(--navy)]">
              Shipment Receipt
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadPDF}
                className="flex items-center gap-2 rounded-lg bg-[var(--navy)] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
              >
                <Package size={15} />
                Download PDF
              </button>

              <button
                type="button"
                onClick={printReceipt}
                className="flex items-center gap-2 rounded-lg bg-[var(--blue)] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
              >
                <Printer size={15} />
                Print
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200"
                aria-label="Close receipt"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Receipt Header */}
          <div className="border-b-2 border-dashed border-gray-300 px-6 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--navy)] text-white">
              <Package size={27} />
            </div>

            <h1 className="mt-3 text-xl font-black tracking-tight text-[var(--navy)]">
              TRACKLINK EXPRESS
            </h1>

            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Global Logistics & Shipment Services
            </p>

            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
              Shipment Receipt
            </p>
          </div>

          {/* Tracking */}
          <div className="border-b-2 border-dashed border-gray-300 px-6 py-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
              Tracking Number
            </p>

            <p className="mt-2 break-all font-mono text-xl font-black tracking-wider text-[var(--navy)]">
              {trackingNumber}
            </p>

            <div className="mt-5 flex justify-center">
              <div
                style={{
                  width: 135,
                  height: 135,
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QRCodeCanvas
                  value={trackingUrl}
                  size={125}
                  level="M"
                  includeMargin
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
            </div>

            <p className="mt-3 text-[9px] font-semibold text-gray-500">
              Scan to track this shipment online
            </p>
          </div>

          {/* Status */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-gray-400">
                  Shipment Status
                </p>

                <p className="mt-1 text-sm font-extrabold text-[var(--navy)]">
                  {status}
                </p>
              </div>

              <div className="rounded-full bg-blue-100 px-3 py-1.5 text-[9px] font-black uppercase text-blue-700">
                {status}
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="border-b border-gray-200 px-6 py-6">
            <div className="mb-4 flex items-center gap-2">
              <Truck size={16} className="text-[var(--blue)]" />

              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
                Shipment Route
              </h2>
            </div>

            <div className="relative">
              <div className="absolute bottom-3 left-[7px] top-3 border-l-2 border-dashed border-gray-300" />

              <div className="relative flex gap-4">
                <div className="z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 ring-4 ring-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                <div className="pb-6">
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                    Origin
                  </p>

                  <p className="mt-1 text-sm font-bold text-[var(--navy)]">
                    {origin}
                  </p>
                </div>
              </div>

              <ArrowDown
                size={14}
                className="absolute left-0 top-[48px] text-gray-400"
              />

              <div className="relative flex gap-4">
                <div className="z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 ring-4 ring-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                    Destination
                  </p>

                  <p className="mt-1 text-sm font-bold text-[var(--navy)]">
                    {destination}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sender */}
          <div className="border-b border-gray-200 px-6 py-6">
            <div className="mb-4 flex items-center gap-2">
              <User size={16} className="text-[var(--blue)]" />

              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
                Sender
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-gray-400">
                  Name
                </span>

                <span className="max-w-[240px] text-right font-bold text-gray-800">
                  {senderName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="font-semibold text-gray-400">
                  Phone
                </span>

                <span className="text-right font-semibold text-gray-800">
                  {senderPhone}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="font-semibold text-gray-400">
                  Address
                </span>

                <span className="max-w-[240px] text-right font-semibold text-gray-800">
                  {senderAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="border-b border-gray-200 px-6 py-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-red-500" />

              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
                Recipient
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-gray-400">
                  Name
                </span>

                <span className="max-w-[240px] text-right font-bold text-gray-800">
                  {recipientName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="font-semibold text-gray-400">
                  Phone
                </span>

                <span className="text-right font-semibold text-gray-800">
                  {recipientPhone}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="font-semibold text-gray-400">
                  Address
                </span>

                <span className="max-w-[240px] text-right font-semibold text-gray-800">
                  {recipientAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="border-b border-gray-200 px-6 py-6">
            <div className="mb-4 flex items-center gap-2">
              <Boxes size={16} className="text-[var(--blue)]" />

              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
                Package Information
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Service
                </p>

                <p className="mt-1 text-xs font-bold text-gray-800">
                  {serviceType}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Package Type
                </p>

                <p className="mt-1 text-xs font-bold text-gray-800">
                  {packageType}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Scale size={14} className="mt-0.5 text-gray-400" />

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Weight
                  </p>

                  <p className="mt-1 text-xs font-bold text-gray-800">
                    {weight} kg
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Boxes size={14} className="mt-0.5 text-gray-400" />

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Packages
                  </p>

                  <p className="mt-1 text-xs font-bold text-gray-800">
                    {numberOfPackages}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="border-b border-gray-200 px-6 py-6">
            <div className="mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-[var(--blue)]" />

              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
                Delivery Information
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-gray-400">
                  Shipment Date
                </span>

                <span className="max-w-[240px] text-right font-bold text-gray-800">
                  {formattedDate}
                </span>
              </div>

              {estimatedDelivery && (
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 font-semibold text-gray-400">
                    <Clock size={13} />
                    Estimated Delivery
                  </span>

                  <span className="text-right font-bold text-gray-800">
                    {estimatedDelivery}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Charges */}
          {(shippingCost !== undefined ||
            otherFees !== undefined ||
            totalAmount !== undefined) && (
            <div className="border-b-2 border-dashed border-gray-300 px-6 py-6">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-[var(--blue)]" />

                <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
                  Charges
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                {shippingCost !== undefined && (
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-gray-500">
                      Shipping Cost
                    </span>

                    <span className="font-bold text-gray-800">
                      {formatMoney(shippingCost)}
                    </span>
                  </div>
                )}

                {otherFees !== undefined && otherFees > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-gray-500">
                      Other Fees
                    </span>

                    <span className="font-bold text-gray-800">
                      {formatMoney(otherFees)}
                    </span>
                  </div>
                )}

                {totalAmount !== undefined && (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                    <span className="text-sm font-black uppercase text-[var(--navy)]">
                      Total
                    </span>

                    <span className="text-lg font-black text-[var(--blue)]">
                      {formatMoney(totalAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-7 text-center">
            <div className="flex items-center justify-center gap-2">
              <Package size={15} className="text-[var(--blue)]" />

              <p className="text-xs font-black text-[var(--navy)]">
                TRACKLINK EXPRESS
              </p>
            </div>

            <p className="mt-2 text-[10px] font-semibold text-gray-500">
              Reliable. Secure. Connected.
            </p>

            <p className="mt-3 text-[9px] leading-relaxed text-gray-400">
              Thank you for choosing TrackLink Express.
              <br />
              Use your tracking number to monitor your shipment online.
            </p>

            <div className="mt-5 border-t border-dashed border-gray-300 pt-4">
              <p className="font-mono text-[9px] text-gray-400">
                {trackingNumber}
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-400">
                Electronically generated receipt
              </p>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-2 bg-[var(--navy)]" />
        </div>
      </div>

      {/* Print styling */}
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          #shipment-receipt,
          #shipment-receipt * {
            visibility: visible;
          }

          #receipt-overlay {
            position: absolute !important;
            inset: 0 !important;
            width: 80mm !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            background: white !important;
          }

          #receipt-overlay > div {
            display: block !important;
            min-height: 0 !important;
            padding: 0 !important;
          }

          #shipment-receipt {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}