// debtprotection-quiz/src/pages/TermsOfUse.jsx
import React from "react";

export default function TermsOfUse() {
  return (
    <main className="py-10">
      <div className="container-narrow">
        <section className="card p-6 sm:p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Terms of Use
          </h1>
          <p>
            <strong>Effective Date: 08/06/2025</strong>
          </p>
          <p className="mt-3">
            Welcome to{" "}
            <a href="https://debtprotection.org" className="underline">
              debtprotection.org
            </a>{" "}
            (referred to as “we,” “our,” or “the Site”). By accessing and using
            this website, you agree to be bound by the following terms and
            conditions. If you do not agree with these terms, please do not use
            our site.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-2">1. Services Provided</h2>
          <p>
            We are a marketing website that connects users with third-party
            service providers who offer debt relief services, student loan
            assistance, and other financial support. We are not a lender, debt
            settlement company, loan servicer, or government agency.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-2">2. Eligibility</h2>
          <p>
            By using this Site, you represent that you are at least 18 years of
            age and legally capable of entering into a binding agreement.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-2">
            3. No Guarantee of Results
          </h2>
          <p>
            We do not guarantee that you will qualify for any debt relief or
            assistance programs. Results and savings vary based on individual
            circumstances.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-2">
            4. Third-Party Websites
          </h2>
          <p>
            This site may contain links to third-party websites. We are not
            responsible for the content, accuracy, or privacy policies of any
            third-party websites.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-2">
            5. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, we disclaim all warranties
            and shall not be held liable for any damages arising from the use or
            inability to use our services or any third-party services you may
            access through our website.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-2">6. Modifications</h2>
          <p>
            We reserve the right to change or modify these terms at any time
            without prior notice. Continued use of the site after changes are
            made constitutes your acceptance of the new terms.
          </p>
        </section>
      </div>
    </main>
  );
}
