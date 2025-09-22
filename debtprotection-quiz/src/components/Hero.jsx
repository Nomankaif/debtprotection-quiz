// debtprotection-quiz/src/components/Hero.jsx
import React from "react";
import MultiStepForm from "./form/MultiStepForm.jsx";

export default function Hero() {
  return (
    <section className="relative bg-white text-slate-900">
      <div className="container-narrow py-3 md:py-4">
        {/* Headline ABOVE the form */}
        <div className="max-w-xl mx-auto text-center">
          <h1 className="leading-[1.1] tracking-tight font-extrabold text-[clamp(1.5rem,6vw,2.4rem)]">
            Find Out if you Qualify for Debt Relief in under 60 seconds
          </h1>

          <p className="mt-2 text-[clamp(0.9rem,3.2vw,0.2rem)] text-slate-700">
            No upfront fees. 100% confidential. Checking eligibility will not
            affect your credit score.
          </p>
        </div>

        {/* Form (unchanged) */}
        <div id="quiz" className="mt-6 md:mt-6 max-w-[540px] mx-auto">
          <MultiStepForm />
        </div>
      </div>
    </section>
  );
}
