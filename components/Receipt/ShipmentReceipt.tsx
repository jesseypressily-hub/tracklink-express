"use client";

import {
  Download,
  Printer,
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
import jsPDF from "jspdf";

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

  status?: string;
  createdAt?: string;

  onClose?: () => void;
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
  status = "Shipment Created",
  createdAt,
  onClose,
}: ShipmentReceiptProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-GB")
    : new Date().toLocaleString("en-GB");

  const formatMoney = (amount?: number) => {
    if (amount === undefined || amount === null) {
      return "—";
    }

    return `£${amount.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  function handlePrint() {
    window.print();
  }

  function drawBarcode(pdf: jsPDF, x: number, y: number) {
    let currentX = x;

    for (let i = 0; i < 65; i++) {
      const width = i % 5 === 0 ? 0.9 : 0.45;
      const height = i % 7 === 0 ? 12 : i % 3 === 0 ? 10 : 8;

      pdf.setFillColor(0, 0, 0);
      pdf.rect(currentX, y + (12 - height), width, height, "F");

      currentX += width + 0.7;
    }
  }

  function drawLine(
    pdf: jsPDF,
    y: number,
    dashed = false
  ) {
    pdf.setDrawColor(190, 190, 190);
    pdf.setLineWidth(0.25);

    if (dashed) {
      pdf.setLineDashPattern([1.5, 1.5], 0);
    } else {
      pdf.setLineDashPattern([], 0);
    }

    pdf.line(7, y, 73, y);
    pdf.setLineDashPattern([], 0);
  }

  function text(
    pdf: jsPDF,
    value: string,
    x: number,
    y: number,
    size = 8,
    bold = false,
    align: "left" | "center" | "right" = "left"
  ) {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(35, 35, 35);
    pdf.text(value, x, y, { align });
  }

  function sectionTitle(
    pdf: jsPDF,
    title: string,
    y: number
  ) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(7, 17, 31);
    pdf.text(title.toUpperCase(), 12, y);
  }

  async function handleDownload() {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 250],
      });

      const pageWidth = 80;

      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, 250, "F");

      // Top accent
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, pageWidth, 3, "F");

      let y = 12;

      // Header
      pdf.setFillColor(7, 17, 31);
      pdf.roundedRect(30, y, 20, 20, 4, 4, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("T", 40, y + 14, { align: "center" });

      y += 27;

      text(pdf, "TrackLink Express", 40, y, 14, true, "center");
      y += 5;

      pdf.setTextColor(110, 110, 110);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(5.5);
      pdf.text("GLOBAL LOGISTICS & SHIPMENT SERVICES", 40, y, {
        align: "center",
      });

      y += 6;

      pdf.setTextColor(145, 145, 145);
      pdf.setFontSize(5.5);
      pdf.text("SHIPMENT RECEIPT", 40, y, {
        align: "center",
      });

      y += 5;
      drawLine(pdf, y, true);
      y += 8;

      // Tracking number
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6);
      pdf.setTextColor(145, 145, 145);
      pdf.text("TRACKING NUMBER", 40, y, {
        align: "center",
      });

      y += 6;

      pdf.setFont("courier", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(7, 17, 31);
      pdf.text(trackingNumber, 40, y, {
        align: "center",
      });

      y += 5;

      drawBarcode(pdf, 16, y);

      y += 17;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(5.5);
      pdf.setTextColor(145, 145, 145);
      pdf.text(
        "Keep this receipt for shipment tracking.",
        40,
        y,
        { align: "center" }
      );

      y += 7;
      drawLine(pdf, y);
      y += 7;

      // Status
      sectionTitle(pdf, "Shipment Status", y);

      y += 5;

      text(pdf, status, 12, y, 8.5, true);

      pdf.setFillColor(219, 234, 254);
      pdf.roundedRect(53, y - 4, 20, 6, 3, 3, "F");

      pdf.setTextColor(29, 78, 216);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(4.5);
      pdf.text(status.toUpperCase(), 63, y, {
        align: "center",
        maxWidth: 18,
      });

      y += 9;
      drawLine(pdf, y);
      y += 7;

      // Route
      sectionTitle(pdf, "Shipment Route", y);
      y += 6;

      pdf.setFillColor(34, 197, 94);
      pdf.circle(10, y - 1.5, 2, "F");

      text(pdf, "ORIGIN", 15, y - 2, 5.5, true);
      text(pdf, origin, 15, y + 3, 8, true);

      y += 13;

      pdf.setFillColor(239, 68, 68);
      pdf.circle(10, y - 1.5, 2, "F");

      text(pdf, "DESTINATION", 15, y - 2, 5.5, true);
      text(pdf, destination, 15, y + 3, 8, true);

      y += 11;
      drawLine(pdf, y);
      y += 7;

      // Sender
      sectionTitle(pdf, "Sender", y);
      y += 6;

      text(pdf, "Name", 12, y, 6, false);
      text(pdf, senderName, 72, y, 6.5, true, "right");

      y += 5;
      text(pdf, "Phone", 12, y, 6, false);
      text(pdf, senderPhone, 72, y, 6.5, true, "right");

      y += 5;
      text(pdf, "Address", 12, y, 6, false);
      text(pdf, senderAddress, 72, y, 6, true, "right");

      y += 9;
      drawLine(pdf, y);
      y += 7;

      // Recipient
      sectionTitle(pdf, "Recipient", y);
      y += 6;

      text(pdf, "Name", 12, y, 6, false);
      text(pdf, recipientName, 72, y, 6.5, true, "right");

      y += 5;
      text(pdf, "Phone", 12, y, 6, false);
      text(pdf, recipientPhone, 72, y, 6.5, true, "right");

      y += 5;
      text(pdf, "Address", 12, y, 6, false);
      text(pdf, recipientAddress, 72, y, 6, true, "right");

      y += 9;
      drawLine(pdf, y);
      y += 7;

      // Package information
      sectionTitle(pdf, "Package Information", y);
      y += 6;

      text(pdf, "Service", 12, y, 6, false);
      text(pdf, serviceType, 42, y, 6.5, true);

      text(pdf, "Package Type", 12, y + 6, 6, false);
      text(pdf, packageType, 42, y + 6, 6.5, true);

      text(pdf, "Weight", 12, y + 12, 6, false);
      text(pdf, `${weight} kg`, 42, y + 12, 6.5, true);

      text(pdf, "Packages", 12, y + 18, 6, false);
      text(pdf, `${numberOfPackages}`, 42, y + 18, 6.5, true);

      y += 27;
      drawLine(pdf, y);
      y += 7;

      // Delivery information
      sectionTitle(pdf, "Delivery Information", y);
      y += 6;

      text(pdf, "Shipment Date", 12, y, 6, false);
      text(pdf, formattedDate, 72, y, 5.8, true, "right");

      if (estimatedDelivery) {
        y += 6;
        text(pdf, "Estimated Delivery", 12, y, 6, false);
        text(pdf, estimatedDelivery, 72, y, 5.8, true, "right");
      }

      y += 9;
      drawLine(pdf, y);
      y += 7;

      // Charges
      if (
        shippingCost !== undefined ||
        otherFees !== undefined ||
        totalAmount !== undefined
      ) {
        sectionTitle(pdf, "Charges", y);
        y += 6;

        if (shippingCost !== undefined) {
          text(pdf, "Shipping Cost", 12, y, 6.5);
          text(pdf, formatMoney(shippingCost), 72, y, 6.5, true, "right");
          y += 6;
        }

        if (otherFees !== undefined && otherFees > 0) {
          text(pdf, "Other Fees", 12, y, 6.5);
          text(pdf, formatMoney(otherFees), 72, y, 6.5, true, "right");
          y += 6;
        }

        if (totalAmount !== undefined) {
          drawLine(pdf, y);
          y += 6;

          text(pdf, "TOTAL", 12, y, 8, true);

          pdf.setTextColor(37, 99, 235);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.text(formatMoney(totalAmount), 72, y, {
            align: "right",
          });

          y += 8;
        }
      }

      drawLine(pdf, y, true);
      y += 8;

      // Footer
      text(pdf, "TrackLink Express", 40, y, 8, true, "center");

      y += 5;

      pdf.setTextColor(100, 100, 100);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6);
      pdf.text("Reliable. Secure. Connected.", 40, y, {
        align: "center",
      });

      y += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(5.5);
      pdf.setTextColor(140, 140, 140);

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

      y += 8;

      pdf.setFont("courier", "normal");
      pdf.setFontSize(5.5);
      pdf.text(trackingNumber, 40, y, {
        align: "center",
      });

      y += 4;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(4.5);
      pdf.text(
        "ELECTRONICALLY GENERATED RECEIPT",
        40,
        y,
        { align: "center" }
      );

      y += 5;

      // Bottom accent
      pdf.setFillColor(7, 17, 31);
      pdf.rect(0, y, pageWidth, 3, "F");

      // Resize page to actual receipt height
      pdf.internal.pageSize.height = y + 3;

      pdf.save(`${trackingNumber}-receipt.pdf`);

      console.log("PDF downloaded successfully.");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Unable to generate the PDF. Please try again.");
    }
  }

  return (
    <div className="mx-auto w-full">
      {/* Actions */}
      <div className="mb-5 flex flex-wrap items-center justify-end gap-3 print:hidden">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mr-auto rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
          >
            Close
          </button>
        )}

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
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Download size={17} />
          Save / Download
        </button>
      </div>

      {/* Receipt */}
      <div
        id="shipment-receipt"
        className="mx-auto w-full max-w-[480px] overflow-hidden bg-white text-gray-800 shadow-xl print:max-w-none print:shadow-none"
      >
        <div className="h-2 bg-[var(--blue)]" />

        <div className="border-b-2 border-dashed border-gray-300 px-6 py-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--navy)] text-white">
              <Package size={27} />
            </div>

            <h1 className="mt-3 text-xl font-black tracking-tight text-[var(--navy)]">
              TrackLink Express
            </h1>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
              Global Logistics & Shipment Services
            </p>

            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Shipment Receipt
            </p>
          </div>
        </div>

        <div className="border-b-2 border-dashed border-gray-300 px-6 py-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Tracking Number
          </p>

          <p className="mt-2 break-all font-mono text-xl font-black tracking-wider text-[var(--navy)]">
            {trackingNumber}
          </p>

          <div className="mx-auto mt-5 flex h-12 max-w-[290px] items-end justify-center gap-[2px] overflow-hidden">
            {Array.from({ length: 65 }).map((_, index) => {
              const height =
                index % 7 === 0
                  ? "h-12"
                  : index % 5 === 0
                    ? "h-9"
                    : index % 3 === 0
                      ? "h-10"
                      : "h-7";

              return (
                <span
                  key={index}
                  className={`w-[2px] bg-black ${height}`}
                />
              );
            })}
          </div>

          <p className="mt-2 text-[9px] text-gray-400">
            Keep this receipt for shipment tracking.
          </p>
        </div>

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

        <div className="border-b border-gray-200 px-6 py-6">
          <div className="mb-4 flex items-center gap-2">
            <Truck size={16} className="text-[var(--blue)]" />
            <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
              Shipment Route
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-[7px] top-3 bottom-3 border-l-2 border-dashed border-gray-300" />

            <div className="relative flex gap-4">
              <div className="z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 ring-4 ring-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>

              <div className="pb-5">
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
              className="absolute left-0 top-[52px] text-gray-400"
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

        <div className="border-b border-gray-200 px-6 py-6">
          <div className="mb-4 flex items-center gap-2">
            <User size={16} className="text-[var(--blue)]" />
            <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
              Sender
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-4">
              <span className="font-semibold text-gray-400">Name</span>
              <span className="text-right font-bold text-gray-800">
                {senderName}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-semibold text-gray-400">Phone</span>
              <span className="text-right font-semibold text-gray-800">
                {senderPhone}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-semibold text-gray-400">Address</span>
              <span className="max-w-[250px] text-right font-semibold text-gray-800">
                {senderAddress}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 px-6 py-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-red-500" />

            <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--navy)]">
              Recipient
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-4">
              <span className="font-semibold text-gray-400">Name</span>
              <span className="text-right font-bold text-gray-800">
                {recipientName}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-semibold text-gray-400">Phone</span>
              <span className="text-right font-semibold text-gray-800">
                {recipientPhone}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-semibold text-gray-400">Address</span>
              <span className="max-w-[250px] text-right font-semibold text-gray-800">
                {recipientAddress}
              </span>
            </div>
          </div>
        </div>

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

              <span className="text-right font-bold text-gray-800">
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

        <div className="bg-gray-50 px-6 py-7 text-center">
          <div className="flex items-center justify-center gap-2">
            <Package size={15} className="text-[var(--blue)]" />

            <p className="text-xs font-black text-[var(--navy)]">
              TrackLink Express
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

        <div className="h-2 bg-[var(--navy)]" />
      </div>

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

          #shipment-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: 0 !important;
          }

          #shipment-receipt > div {
            break-inside: avoid;
          }

          .print\\:hidden {
            display: none !important;
          }
        }

        @media screen {
          #shipment-receipt {
            border-radius: 18px;
          }
        }
      `}</style>
    </div>
  );
}