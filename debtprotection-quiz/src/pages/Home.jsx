import React from "react";
import Hero from "../components/Hero.jsx";
import Testimonials from "../components/Testimonials.jsx";
import LimitedOffer from "../components/LimitedOffer.jsx";
import PartnerLogos from "../components/PartnerLogos.jsx";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <PartnerLogos />
      <Testimonials />
      <LimitedOffer />
    </main>
  );
}
