// debtprotection-quiz/src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfUse from "./pages/TermsOfUse.jsx";
import Loading from "./pages/Loading.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import StickyNotice from "./components/StickyNotice.jsx";

export default function App() {
  const location = useLocation();
  const isResultsPage = location.pathname.startsWith("/results");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/termsOfUse" element={<TermsOfUse />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
      <Footer />
      {!isResultsPage && <StickyNotice />}
    </div>
  );
}
