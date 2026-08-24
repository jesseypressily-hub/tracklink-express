"use client";

import Link from "next/link";
import { LayoutDashboard, Package, ArrowLeft } from "lucide-react";

export default function AdminNav() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link
          href="/admin"
          className="flex items-center gap-2"
        >
          <Package
            size={22}
            className="text-[var(--blue)]"
          />

          <span className="font-extrabold text-[var(--navy)]">
            TrackLink Express
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2">

          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-blue-50 hover:text-[var(--blue)]"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-[var(--navy)]"
          >
            <ArrowLeft size={17} />
            Main Website
          </Link>

        </div>

      </div>
    </nav>
  );
}