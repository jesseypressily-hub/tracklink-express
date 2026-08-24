"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
// @ts-ignore

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Track Shipment", href: "/tracking" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const services = [
  "Air Freight",
  "Ocean Freight",
  "Road Transport",
  "Warehousing",
];

const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: FaLinkedinIn,
  },
  {
    label: "X",
    href: "#",
    icon: FaXTwitter,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">

          {/* Brand */}
          <div>
            <Link href="#" className="inline-block">
              <div className="text-2xl font-extrabold tracking-tight">
                TrackLink
                <span className="text-[var(--blue)]"> Express</span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              Reliable logistics solutions designed to keep your shipments
              moving and your business connected to the world.
            </p>

            {/* Social Media */}
            <div className="mt-7 flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {link.name}

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Services
            </h3>

            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="/services"
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Contact
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex gap-3 text-sm text-white/55">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[var(--blue)]"
                />

                <span>
                  100 Logistics Avenue
                  <br />
                  New York, NY 10001
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-white/55">
                <Phone
                  size={18}
                  className="text-[var(--blue)]"
                />

                +1 (800) 555-0199
              </div>

              <div className="flex items-center gap-3 text-sm text-white/55">
                <Mail
                  size={18}
                  className="text-[var(--blue)]"
                />

                support@tracklinkexpress.com
              </div>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} TrackLink Express. All rights
            reserved.
          </p>

          <div className="flex gap-6">
            <Link
             href="/privacy-policy"
             className="transition-colors hover:text-white">
              Privacy Policy
            </Link>

            <Link href="/terms"
                className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}