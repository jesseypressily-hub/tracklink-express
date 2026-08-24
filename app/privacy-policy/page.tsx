import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">

        <Link
          href="/"
          className="text-sm font-bold text-[var(--blue)] hover:underline"
        >
          ← Back to TrackLink Express
        </Link>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-[var(--navy)] sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: August 19, 2026
          </p>
        </div>

        <div className="mt-12 space-y-10 text-gray-600">

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              1. Introduction
            </h2>

            <p className="mt-3 leading-7">
              TrackLink Express respects your privacy and is committed to
              protecting the personal information you provide when using our
              website and logistics services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              2. Information We Collect
            </h2>

            <p className="mt-3 leading-7">
              Depending on how you use our services, we may collect information
              such as your name, contact information, shipment details,
              tracking information and information you provide when contacting
              our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              3. How We Use Your Information
            </h2>

            <p className="mt-3 leading-7">
              We may use collected information to provide and manage logistics
              services, process shipments, provide tracking updates, respond
              to customer requests, improve our services and maintain website
              security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              4. Shipment Information
            </h2>

            <p className="mt-3 leading-7">
              Information associated with a shipment may be used to identify,
              process and track that shipment. Tracking information displayed
              publicly through our tracking system will be limited to
              information necessary to provide shipment status updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              5. Cookies
            </h2>

            <p className="mt-3 leading-7">
              Our website may use cookies or similar technologies to maintain
              functionality, improve user experience and understand how our
              website is used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              6. Data Security
            </h2>

            <p className="mt-3 leading-7">
              We take reasonable measures to protect information against
              unauthorized access, alteration, disclosure or destruction.
              However, no internet-based system can be guaranteed to be
              completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              7. Third-Party Services
            </h2>

            <p className="mt-3 leading-7">
              Our website may use third-party services for hosting, analytics,
              maps, payment processing or other functionality. These services
              may process information according to their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              8. Your Rights
            </h2>

            <p className="mt-3 leading-7">
              Depending on applicable law, you may have rights relating to your
              personal information, including requesting access, correction or
              deletion of certain information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              9. Contact Us
            </h2>

            <p className="mt-3 leading-7">
              If you have questions about this Privacy Policy or how your
              information is handled, contact TrackLink Express through the
              contact information provided on our website.
            </p>
          </section>

        </div>

        <div className="mt-14 border-t border-gray-200 pt-8">
          <Link
            href="/"
            className="font-bold text-[var(--blue)] hover:underline"
          >
            Return to homepage →
          </Link>
        </div>
      </div>
    </main>
  );
}