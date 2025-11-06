// debtprotection-quiz/src/pages/PrivacyPolicy.jsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="py-10">
      <div className="container-narrow">
        <section className="card p-6 sm:p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Privacy Policy
          </h1>
          <p>
            <strong>Effective Date: 08/06/2025</strong>
          </p>
          <p className="mt-3">
            Your privacy is important to us. This Privacy Policy explains how{" "}
            <a href="https://debtprotection.org" className="underline">
              debtprotection.org
            </a>{" "}
            collects, uses, and protects your personal information.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              Personal information you provide through forms or quizzes (name, email, phone number, ZIP code, etc.).
            </li>
            <li>
              Automatically collected data such as IP address, browser type, and
              device information.
            </li>
          </ul>
          <h2 className="text-xl font-bold mt-6 mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>To connect you with appropriate service providers and partners who can assist with debt relief or related financial services.</li>
            <li>To communicate with you about your inquiry or matching results.</li>
            <li>To send relevant updates, offers, or resources that may help you reduce or manage debt.</li>
            <li>To improve our website experience and services.</li>
            <li>To comply with legal requirements.</li>
          </ul>
          <h2 className="text-xl font-bold mt-6 mb-2">
            3. Consent and Communication
          </h2>
          <p>
            By submitting your information on this site, you:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Consent to being contacted by DebtProtection.org and its trusted marketing partners via phone, text, or email, even if your number is listed on a national or state Do-Not-Call registry.</li>
            <li>Understand that such contact may include marketing messages about debt relief or related services.</li>
            <li>Acknowledge that consent is not required to make a purchase and that you may opt out of communications at any time by following the unsubscribe instructions in our messages or by contacting us directly.</li>
    
          </ul>
          <h2 className="text-xl font-bold mt-6 mb-2">4. Sharing Your Information</h2>
          <p>
            We may share your information with carefully selected partners and service providers assisting with our operations or who can help fulfill your inquiry. We do not sell your personal information to third parties.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-2">5. Data Security</h2>
          <p>
            We take appropriate technical and organizational measures to secure your personal data and protect it from unauthorized access or misuse.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-2">6. Your Rights</h2>
          <p>
           You may:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Request access to or correction of your personal data.</li>
            <li>Request deletion of your personal data.</li>
            <li>Opt out of certain communications at any time.</li>
          </ul>
          <h2 className="text-xl font-bold mt-6 mb-2">
            7. Cookies
          </h2>
          <p>
           We use cookies and similar tracking tools to enhance your browsing experience. You can modify your browser settings to decline cookies if you prefer.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-2">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Updates will appear on this page with a revised effective date.</p>
        </section>
      </div>
    </main>
  );
}
