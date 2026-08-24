import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Stats from "@/components/home/Stats";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import TrackingCTA from "@/components/home/TrackingCTA";
import FAQ from "@/components/home/FAQ";
import ContactCTA from "@/components/home/ContactCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Stats />
        <About />
        <Testimonials />
        <TrackingCTA />
        <FAQ />
        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}