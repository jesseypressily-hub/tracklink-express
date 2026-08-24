import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrackLink Express",
  description:
    "Track your shipments with TrackLink Express — reliable logistics and shipment tracking.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}