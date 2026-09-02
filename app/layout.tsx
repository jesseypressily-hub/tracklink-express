import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "TrackLink Express | Global Logistics & Shipment Tracking",
  description:
    "TrackLink Express provides reliable global logistics, shipment tracking, and delivery services.",

  icons: {
    icon: "/tracklink%20express%20logo.png",
    shortcut: "/tracklink%20express%20logo.png",
    apple: "/tracklink%20express%20logo.png",
  },

  openGraph: {
    title: "TrackLink Express | Global Logistics & Shipment Tracking",
    description:
      "Track and manage your shipments with TrackLink Express.",
    url: "https://tracklinkexpress.com",
    siteName: "TrackLink Express",
    type: "website",
    images: [
      {
        url: "https://tracklinkexpress.com/tracklink%20express%20logo.png",
        width: 1200,
        height: 630,
        alt: "TrackLink Express",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TrackLink Express | Global Logistics & Shipment Tracking",
    description:
      "Track and manage your shipments with TrackLink Express.",
    images: [
      "https://tracklinkexpress.com/tracklink%20express%20logo.png",
    ],
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}

        <ChatWidget />
      </body>
    </html>
  );
}

