// debtprotection-quiz/src/components/Footer.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-brand-600"
    >
      <path
        d="M17 10V8a5 5 0 1 0-10 0v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1Zm-8 0V8a3 3 0 1 1 6 0v2H9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-0 text-slate-600">
      {/* disclaimer */}
      <div className="bg-gradient-to-b from-white to-slate-50">
        {/* ↓ reduce bottom padding here */}
        <div className="container-narrow pt-6 pb-3 sm:pb-4">
          <div className="rounded-xl border bg-white/90 p-4 sm:p-5 shadow-sm">
            <p className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-extrabold text-slate-900">
                Disclaimer:
              </strong>
              <span className="mx-1" />
              <a
                href="https://debtprotection.org"
                className="underline decoration-brand-500 underline-offset-2 hover:text-brand-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                debtprotection.org
              </a>{" "}
              is a privately owned marketing website and is not affiliated with
              or endorsed by any government agency, lender, or loan servicer. We
              are not a debt settlement company, lender, or loan servicer. Our
              role is to connect individuals with trusted partners who may
              provide options for debt relief or consolidation based on
              individual qualifications.{" "}
              <strong className="font-semibold text-slate-900">
                Results may vary
              </strong>{" "}
              and are not guaranteed. Program availability and eligibility may
              vary by state.
            </p>
          </div>
        </div>
      </div>

      {/* main footer */}
      <div className="bg-slate-50">
        {/* ↓ reduce top padding here */}
        <div className="container-narrow pt-4 sm:pt-5 pb-8">
          <div className="grid gap-6 md:gap-4 md:grid-cols-[auto_1fr_auto] items-center">
            {/* brand */}
            <div className="justify-self-center md:justify-self-start">
              <Link
                to="/"
                title="debtprotection.org"
                className="inline-flex items-center gap-2"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/debt_protection.png`}
                  alt="Debt Protection"
                  className="w-[160px] md:w-[170px] h-auto"
                />
              </Link>
            </div>

            {/* nav */}
            <nav className="justify-self-center">
              <ul className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-semibold">
                <li>
                  <li>
                    <ul className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
                      <li>
                        <NavLink
                          to="/privacyPolicy"
                          className="hover:text-brand-700 hover:underline underline-offset-4"
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        >
                          Privacy Policy
                        </NavLink>
                      </li>

                      <li className="text-slate-300">•</li>

                      <li>
                        <NavLink
                          to="/termsOfUse"
                          className="hover:text-brand-700 hover:underline underline-offset-4"
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        >
                          Terms of Use
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </li>
              </ul>
            </nav>

            {/* copyright */}
            <div className="justify-self-center md:justify-self-end text-center">
              <p className="text-xs sm:text-sm">
                &copy; {year}{" "}
                <span className="font-semibold">debtprotection.org</span> · All
                Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
