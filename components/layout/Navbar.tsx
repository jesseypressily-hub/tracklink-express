"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Tracking", href: "/tracking" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          aria-label="TrackLink Express home"
          className="group flex items-center"
        >
          <div className="leading-none">
            <div className="flex items-baseline">
              <span
                className="text-[1.65rem] font-black tracking-[-0.06em] text-[var(--navy)] sm:text-[1.9rem]"
                style={{
                  fontFamily:
                    "Arial Black, Arial, Helvetica, sans-serif",
                }}
              >
                TrackLink
              </span>

              <span
                className="ml-1 text-[1.65rem] font-black tracking-[-0.055em] text-[var(--blue)] sm:text-[1.9rem]"
                style={{
                  fontFamily:
                    "Arial Black, Arial, Helvetica, sans-serif",
                }}
              >
                Express
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-[3px] w-8 rounded-full bg-[var(--blue)] transition-all duration-300 group-hover:w-11" />
              <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-gray-400">
                Logistics & Delivery
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-[var(--blue)]"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/tracking"
            className="group flex items-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Track Package
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--navy)] transition-colors hover:bg-gray-100 lg:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 lg:hidden ${
          menuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--blue)]"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/tracking"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3.5 text-sm font-bold text-white"
            >
              Track Package
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}