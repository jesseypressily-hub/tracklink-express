import Link from "next/link";

export default function Terms() {
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
            Terms of Service
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: August 19, 2026
          </p>
        </div>

        <div className="mt-12 space-y-10 text-gray-600">

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              1. Acceptance of Terms
            </h2>
            <p className="mt-3 leading-7">
              By accessing or using the TrackLink Express website or services,
              you agree to comply with these Terms of Service. If you do not
              agree with these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              2. Our Services
            </h2>
            <p className="mt-3 leading-7">
              TrackLink Express provides logistics, transportation, shipment
              tracking and related services. Specific services, pricing and
              delivery conditions may vary depending on the shipment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              3. Shipment Information
            </h2>
            <p className="mt-3 leading-7">
              Customers are responsible for providing accurate shipment,
              sender and recipient information. Incorrect or incomplete
              information may affect delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              4. Prohibited Items
            </h2>
            <p className="mt-3 leading-7">
              Customers must not use our services to transport goods that are
              prohibited by applicable laws, regulations or TrackLink Express
              shipping policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              5. Tracking Information
            </h2>
            <p className="mt-3 leading-7">
              Tracking information is provided to help customers monitor
              shipments. Status information may change as shipments move
              through different stages of the delivery process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              6. Delivery Times
            </h2>
            <p className="mt-3 leading-7">
              Estimated delivery dates are provided for guidance and may be
              affected by circumstances such as weather, customs procedures,
              transportation disruptions or other events outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              7. Payments and Charges
            </h2>
            <p className="mt-3 leading-7">
              Applicable shipping charges and payment conditions will be
              communicated before or during the shipment process. Additional
              charges may apply where permitted by the applicable service
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              8. Limitation of Liability
            </h2>
            <p className="mt-3 leading-7">
              To the extent permitted by applicable law, TrackLink Express
              shall not be responsible for delays or losses caused by events
              outside its reasonable control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              9. Changes to These Terms
            </h2>
            <p className="mt-3 leading-7">
              We may update these Terms of Service from time to time. Updated
              terms will be published on this page with a revised effective
              date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              10. Contact
            </h2>
            <p className="mt-3 leading-7">
              For questions regarding these terms, contact TrackLink Express
              using the contact information provided on our website.
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