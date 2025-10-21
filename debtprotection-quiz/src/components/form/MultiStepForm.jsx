// debtprotection-quiz/src/components/form/MultiStepForm.js
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const componentStyles = `
  .error-shake {
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .success-pulse {
    animation: pulse 0.6s ease-in-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
`;

const steps = [
  {
    key: "debtAmount",
    title: "How much debt do you owe?",
    type: "dropdown",
    options: [
      { label: "$0 - $4,999", value: "0-4999" },
      { label: "$5,000 - $7,499", value: "5000-7499" },
      { label: "$7,500 - $9,999", value: "7500-9999" },
      { label: "$10,000 - $14,999", value: "10000-14999" },
      { label: "$15,000 - $19,999", value: "15000-19999" },
      { label: "$20,000 - $29,999", value: "20000-29999" },
      { label: "$30,000 - $39,999", value: "30000-39999" },
      { label: "$40,000 - $49,999", value: "40000-49999" },
      { label: "$50,000 - $59,999", value: "50000-59999" },
      { label: "$60,000 - $69,999", value: "60000-69999" },
      { label: "$70,000 - $79,999", value: "70000-79999" },
      { label: "$80,000 - $89,999", value: "80000-89999" },
      { label: "$90,000 - $99,999", value: "90000-99999" },
      { label: "$100,000+", value: "100000+" }
    ],
    info: "🛡️ Helping People Like You Since 2007",
  },
  {
    key: "assets",
    title: "What assets do you currently own?",
    subtitle: "(Select all that apply)",
    type: "checkbox",
    options: [
      { label: "House", value: "house" },
      { label: "Car", value: "car" },
      { label: "Land/Property", value: "land-property" },
      {
        label: "Investments (401k, stocks, retirement accounts)",
        value: "investments",
      },
      { label: "None of the above", value: "none" },
    ],
    info: "📌 Home/car owners may qualify for additional debt relief options.",
  },
  {
    key: "debtTypes",
    title: "What kind of debt do you have?",
    subtitle: "(Select all that apply)",
    type: "checkbox",
    options: [
      { label: "Credit cards", value: "credit-cards" },
      { label: "Personal loans", value: "personal-loans" },
      { label: "Student loans", value: "student-loans" },
      { label: "Medical bills", value: "medical-bills" },
      { label: "Auto loans", value: "auto-loans" },
      { label: "Taxes", value: "taxes" },
      { label: "Other", value: "other" },
    ],
    info: "💡 Most people have more than one type of debt. Don't worry, checking multiple boxes won't hurt your chances of qualifying.",
  },
  {
    key: "contact",
    title: "We're almost done!",
    subtitle: "Just need your location and phone number",
    type: "contact",
    info: "📌 Programs vary by location. This helps us check eligibility.",
  },
  {
    key: "personalInfo",
    title: "You're One Click Away!",
    subtitle: "Where should we send your free eligibility summary?",
    type: "personal",
    info: "🔒 100% secure. 🚫 No spam. ✅ No obligations.",
  },
];

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xanjbawz";

const COUNTRY_CODES = [
  {
    code: "+1",
    name: "US/Canada",
    flag: "🇺🇸",
    format: "(XXX) XXX-XXXX",
    length: 10,
  },
  { code: "+91", name: "India", flag: "🇮🇳", format: "XXXXX XXXXX", length: 10 },
  { code: "+44", name: "UK", flag: "🇬🇧", format: "XXXX XXXXXX", length: 10 },
  {
    code: "+61",
    name: "Australia",
    flag: "🇦🇺",
    format: "XXX XXX XXX",
    length: 9,
  },
  {
    code: "+49",
    name: "Germany",
    flag: "🇩🇪",
    format: "XXX XXXXXXX",
    length: 10,
  },
  {
    code: "+33",
    name: "France",
    flag: "🇫🇷",
    format: "X XX XX XX XX",
    length: 10,
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,24}$/;
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "yopmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "tempmailo.com",
  "discard.email",
  "sharklasers.com",
  "trashmail.com",
  "fakeinbox.com",
  "getnada.com",
  "inboxbear.com",
  "mintemail.com",
  "moakt.com",
  "maildrop.cc",
  "throwawaymail.com",
  "mytemp.email",
  "spambog.com",
  "mail7.io",
  "fakemail.com",
]);

function isDisposable(email = "") {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return DISPOSABLE_DOMAINS.has(domain);
}

export default function MultiStepForm() {
  const [data, setData] = React.useState({ countryCode: "+1" });
  const [step, setStep] = React.useState(0);
  const [touchedError, setTouchedError] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");
  const [interactions, setInteractions] = React.useState(0);
  const [errorShake, setErrorShake] = React.useState(false);
  const [successPulse, setSuccessPulse] = React.useState(false);
  const [completedSteps, setCompletedSteps] = React.useState(new Set());
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const loadTimeRef = React.useRef(Date.now());
  const navigate = useNavigate();

  const total = steps.length;
  const current = steps[step];

  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = componentStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Global Enter key handler
  React.useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        // Don't trigger if user is typing in text input fields
        const isTextInput =
          e.target.tagName === "INPUT" &&
          (e.target.type === "text" ||
            e.target.type === "email" ||
            e.target.type === "tel");

        // For text inputs in contact/personal steps, allow Enter to proceed
        if (isTextInput) {
          if (step < total - 1) {
            guardedNext();
          } else {
            handleSubmit();
          }
          return;
        }

        // For all other cases (radio, checkbox, slider, or pressing Enter anywhere)
        if (step < total - 1) {
          guardedNext();
        } else {
          handleSubmit();
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [step, total, data, touchedError, submitting]);

  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (["tel", "email", "contact", "personal"].includes(current.type)) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange?.(999, 999);
      }, 200);
    }
  }, [step]);

  const bumpInteractions = () => setInteractions((n) => n + 1);
  const update = (key, value) => {
    bumpInteractions();
    setData((d) => ({ ...d, [key]: value }));
    if (touchedError) {
      setTouchedError(false);
    }
  };

  const handleDropdownSelect = (key, value) => {
    bumpInteractions();
    setData((d) => ({ ...d, [key]: value }));
    setDropdownOpen(false);
    setTouchedError(false);
    setTimeout(() => guardedNext(), 100);
  };

  const dropdownRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  function validate(s) {
    if (!s) return false;

    if (s.type === "radio") {
      return Boolean(data[s.key]);
    }

    if (s.type === "checkbox") {
      return Boolean(data[s.key]?.length);
    }

    if (s.type === "dropdown") {
      return Boolean(data[s.key]);
    }

    if (s.type === "contact") {
      const zipOk = /^[0-9]{5}$/.test(data.zipcode || "");
      const selectedCountry = COUNTRY_CODES.find(
        (c) => c.code === data.countryCode
      );
      const phoneOk = new RegExp(
        `^[0-9]{${selectedCountry?.length || 10}}$`
      ).test(data.phone || "");
      return zipOk && phoneOk;
    }

    if (s.type === "personal") {
      const firstNameOk = Boolean(data.firstName?.trim());
      const lastNameOk = Boolean(data.lastName?.trim());
      const email = data.email || "";
      const emailOk = EMAIL_REGEX.test(email);
      const saneDomain = !isDisposable(email);
      const optionOk = data.option === true;
      return firstNameOk && lastNameOk && emailOk && saneDomain && optionOk;
    }

    return false;
  }
  const hasError = !validate(current);

  function validateStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= steps.length) return false;
    const stepToValidate = steps[stepIndex];
    return validate(stepToValidate);
  }

  function getErrorMessage() {
    if (!current) return "";

    if (current.type === "radio") return "Please choose an option to continue.";
    if (current.type === "checkbox") return "Pick at least one option.";
    if (current.type === "dropdown")
      return "Please select a debt amount to continue.";

    if (current.type === "contact") {
      const zipOk = /^[0-9]{5}$/.test(data.zipcode || "");
      const selectedCountry = COUNTRY_CODES.find(
        (c) => c.code === data.countryCode
      );
      const phoneOk = new RegExp(
        `^[0-9]{${selectedCountry?.length || 10}}$`
      ).test(data.phone || "");

      if (!zipOk && !phoneOk)
        return "Please enter both zip code and phone number.";
      if (!zipOk) return "Enter a valid 5-digit zip.";
      if (!phoneOk) return "Enter a valid phone number.";
    }

    if (current.type === "personal") {
      if (!data.firstName?.trim()) return "Please enter your first name.";
      if (!data.lastName?.trim()) return "Please enter your last name.";
      if (!data.email?.trim()) return "Please enter your email address.";
      if (data.email && isDisposable(data.email))
        return "Please use a real email (no disposable providers).";
      if (data.email && !EMAIL_REGEX.test(data.email))
        return "Enter a valid email address.";
      if (!data.option)
        return "Please agree to receive marketing communications.";
    }

    return "Please complete this field to continue.";
  }

  function guardedNext() {
    if (!validate(current)) {
      setTouchedError(true);
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    setCompletedSteps((prev) => new Set([...prev, step]));
    setTouchedError(false);
    setDropdownOpen(false);
    setSuccessPulse(true);
    setTimeout(() => setSuccessPulse(false), 600);

    setTimeout(() => {
      setStep((s) => Math.min(s + 1, total - 1));
    }, 200);
  }

  function prev() {
    setTouchedError(false);
    setDropdownOpen(false);
    setStep((s) => Math.max(s - 1, 0));
  }

  function jumpTo(targetIndex) {
    if (targetIndex < step) {
      setTouchedError(false);
      setDropdownOpen(false);
      setStep(targetIndex);
      return;
    }

    if (targetIndex === step) {
      return;
    }

    if (targetIndex === step + 1) {
      if (!validate(current)) {
        setTouchedError(true);
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 500);
        return;
      }

      setCompletedSteps((prev) => new Set([...prev, step]));
      setTouchedError(false);
      setDropdownOpen(false);
      setStep(targetIndex);
      return;
    }

    setTouchedError(true);
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  }

  const labelFor = (stepKey, value) => {
    const st = steps.find((s) => s.key === stepKey);
    if (!st?.options) return value ?? "";
    const found = st.options.find((o) => o.value === value);
    return found?.label ?? value ?? "";
  };

  const labelsForArray = (stepKey, values) =>
    (values || []).map((v) => labelFor(stepKey, v));

  async function handleSubmit(e) {
    e?.preventDefault?.();

    const dwell = Date.now() - loadTimeRef.current;
    const last = Number(localStorage.getItem("lastSubmitTs") || "0");
    const cooldownOk = Date.now() - last > 60_000;

    if (!validate(current)) {
      setTouchedError(true);
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    if (honeypot.trim() !== "") {
      setSubmitError("Submission flagged as automated.");
      return;
    }
    if (dwell < 2500 || interactions < 2) {
      setSubmitError("Submission looked automated. Please try again.");
      return;
    }
    if (!cooldownOk) {
      setSubmitError("Please wait a moment before trying again.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    
    // Store form data in localStorage for potential future use
    const payload = {
      debtAmount: data.debtAmount || "",
      assets: Array.isArray(data.assets) && data.assets.length > 0 ? data.assets : ["none"],
      debtTypes: Array.isArray(data.debtTypes) ? data.debtTypes : [],
      zipcode: data.zipcode || "",
      countryCode: data.countryCode || "",
      phone: data.phone || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      option: !!data.option,
    };
    
    localStorage.setItem("formData", JSON.stringify(payload));
    localStorage.setItem("lastSubmitTs", String(Date.now()));
    
    // Navigate to loading page
    navigate("/loading", { replace: true });
  }

  function onRadioChange(k, v) {
    bumpInteractions();
    setData((d) => ({ ...d, [k]: v }));
    setTouchedError(false);
  }

  function onCheckboxToggle(k, v, checked) {
    bumpInteractions();
    const opts = steps.find((s) => s.key === k)?.options || [];
    const allValues = opts.map((o) => o.value);
    const indivValues = allValues.filter((x) => x !== "all");
    let set = new Set(data[k] || []);
    if (v === "all") {
      set = checked ? new Set(indivValues.concat("all")) : new Set();
    } else {
      checked ? set.add(v) : set.delete(v);
      if (indivValues.every((x) => set.has(x))) set.add("all");
      else set.delete("all");
    }
    update(k, Array.from(set));
  }

  function onAssetsCheckboxToggle(k, v, checked) {
    bumpInteractions();
    let set = new Set(data[k] || []);
    if (v === "none") {
      set = checked ? new Set(["none"]) : new Set();
    } else {
      if (checked) {
        set.delete("none");
        set.add(v);
      } else {
        set.delete(v);
      }
    }
    update(k, Array.from(set));
  }

  const pct = total > 1 ? Math.round((step / (total - 1)) * 100) : 0;

  const stepVariants = {
    initial: { opacity: 0, x: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -30,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="card p-3 sm:p-5 md:p-7" aria-live="polite">
      {/* PROGRESS */}
      <div className="mb-6">
        <div className="relative mb-6">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-gray-200" />
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-blue-500"
            style={{ width: `${pct}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "tween", duration: 0.3 }}
          />
          <div className="relative z-10 flex justify-between">
            {Array.from({ length: total }).map((_, i) => {
              const isComplete = i < step;
              const isActive = i === step;
              const classes = isComplete
                ? "bg-emerald-500 border-emerald-500 text-white"
                : isActive
                ? "border-blue-500 text-blue-600 bg-white"
                : "border-gray-300 text-gray-400 bg-white";
              return (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full grid place-items-center border-2 text-sm font-bold shadow ${classes}`}
                >
                  {isComplete ? "✔" : i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEPS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`min-h-[300px] ${errorShake ? "error-shake" : ""} ${
            successPulse ? "success-pulse" : ""
          }`}
        >
          {/* Hidden anti-bot field */}
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
                {current.title}
              </h3>
              {current.subtitle && (
                <p className="text-slate-600 text-sm mb-4 text-center">
                  {current.subtitle}
                </p>
              )}

              {touchedError && hasError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4"
                >
                  <p className="text-red-500 text-sm font-medium">
                    {getErrorMessage()}
                  </p>
                </motion.div>
              )}

              {/* Dropdown */}
              {current.type === "dropdown" && (
                <div className="space-y-6">
                  <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
                    <motion.button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`w-full px-4 py-4 text-left bg-white border-2 rounded-xl font-medium text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                        dropdownOpen
                          ? "border-blue-500 bg-blue-50"
                          : touchedError && hasError
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`${data[current.key] ? "text-slate-800" : "text-slate-400"}`}>
                          {data[current.key] 
                            ? current.options.find(opt => opt.value === data[current.key])?.label 
                            : "Select your debt amount"}
                        </span>
                        <motion.div
                          animate={{ rotate: dropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-slate-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-auto"
                        >
                          <div className="py-2">
                            {current.options.map((option, index) => (
                              <motion.button
                                key={option.value}
                                type="button"
                                onClick={() => handleDropdownSelect(current.key, option.value)}
                                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 ${
                                  data[current.key] === option.value
                                    ? "bg-blue-100 text-blue-800 font-medium"
                                    : "text-slate-700 hover:text-blue-700"
                                }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ backgroundColor: "#eff6ff" }}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{option.label}</span>
                                  {data[current.key] === option.value && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="text-blue-600"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Radio */}
              {current.type === "radio" && (
                <div
                  className={`grid gap-2.5 sm:gap-3 mt-6 sm:mt-8 ${
                    current.options.length > 4
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {current.options.map((op) => {
                    const checked = data[current.key] === op.value;
                    return (
                      <motion.label
                        key={op.value}
                        onClick={() => {
                          onRadioChange(current.key, op.value);
                          // Auto-advance only after state is updated
                          setTimeout(() => guardedNext(), 100);
                        }}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 h-full ${
                          checked
                            ? "border-blue-500 bg-blue-50"
                            : touchedError && hasError
                            ? "border-red-300"
                            : "border-slate-200"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          className="absolute opacity-0"
                          name={current.key}
                          value={op.value}
                          checked={checked}
                          readOnly
                        />
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                checked
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-slate-300"
                              }`}
                            >
                              {checked && (
                                <motion.div
                                  className="w-2 h-2 bg-white rounded-full"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                />
                              )}
                            </div>
                            <span className="font-medium text-slate-700">
                              {op.label}
                            </span>
                          </div>
                          <span className="text-blue-500 font-medium">➜</span>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              )}

              {/* Checkbox */}
              {current.type === "checkbox" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {current.options.map((op) => {
                    const set = new Set(data[current.key] || []);
                    const checked = set.has(op.value);
                    const isAssetsQuestion = current.key === "assets";

                    return (
                      <motion.label
                        key={op.value}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 w-full h-full ${
                          checked
                            ? "border-blue-500 bg-blue-50"
                            : touchedError && hasError
                            ? "border-red-300"
                            : "border-slate-200"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          value={op.value}
                          onChange={(e) =>
                            isAssetsQuestion
                              ? onAssetsCheckboxToggle(
                                  current.key,
                                  op.value,
                                  e.target.checked
                                )
                              : onCheckboxToggle(
                                  current.key,
                                  op.value,
                                  e.target.checked
                                )
                          }
                          checked={checked}
                          className="sr-only"
                        />

                        <div className="flex items-center space-x-3 w-full">
                          {/* Checkbox Square */}
                          {/* Checkbox Square */}
                          <div
                            className={`w-6 h-6 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                              checked
                                ? "border-blue-500 bg-blue-500"
                                : "border-slate-300"
                            }`}
                          >
                            {checked && (
                              <motion.svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </motion.svg>
                            )}
                          </div>
                          {/* Label */}
                          <span className="font-medium text-slate-700">
                            {op.label}
                          </span>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              )}

              {/* Contact */}
              {current.type === "contact" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Zip Code
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Enter 5-digit zip code"
                      value={data.zipcode || ""}
                      onChange={(e) => {
                        bumpInteractions();
                        const digits = e.target.value
                          .replace(/\D+/g, "")
                          .slice(0, 5);
                        update("zipcode", digits);
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 ${
                        touchedError && !/^[0-9]{5}$/.test(data.zipcode || "")
                          ? "border-red-500 bg-red-50"
                          : "border-slate-200"
                      }`}
                      autoComplete="postal-code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={data.countryCode || "+1"}
                        onChange={(e) => {
                          bumpInteractions();
                          update("countryCode", e.target.value);
                          update("phone", "");
                        }}
                        className="px-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 bg-white min-w-[120px]"
                      >
                        {COUNTRY_CODES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder={
                          COUNTRY_CODES.find(
                            (c) => c.code === (data.countryCode || "+1")
                          )?.format || "Enter phone number"
                        }
                        value={data.phone || ""}
                        onChange={(e) => {
                          bumpInteractions();
                          const selectedCountry = COUNTRY_CODES.find(
                            (c) => c.code === (data.countryCode || "+1")
                          );
                          const maxLength = selectedCountry?.length || 10;
                          const numbers = e.target.value
                            .replace(/\D+/g, "")
                            .slice(0, maxLength);
                          update("phone", numbers);
                        }}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 ${
                          touchedError && hasError
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200"
                        }`}
                        autoComplete="tel"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {
                        COUNTRY_CODES.find(
                          (c) => c.code === (data.countryCode || "+1")
                        )?.name
                      }{" "}
                      format:{" "}
                      {
                        COUNTRY_CODES.find(
                          (c) => c.code === (data.countryCode || "+1")
                        )?.format
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Info */}
              {current.type === "personal" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        First Name
                      </label>
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="First Name"
                        value={data.firstName || ""}
                        onChange={(e) => {
                          bumpInteractions();
                          update("firstName", e.target.value);
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 ${
                          touchedError && !data.firstName?.trim()
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200"
                        }`}
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={data.lastName || ""}
                        onChange={(e) => {
                          bumpInteractions();
                          update("lastName", e.target.value);
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 ${
                          touchedError && !data.lastName?.trim()
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200"
                        }`}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={data.email || ""}
                      onChange={(e) => {
                        bumpInteractions();
                        update("email", e.target.value);
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 ${
                        touchedError &&
                        (!data.email?.trim() ||
                          !EMAIL_REGEX.test(data.email || "") ||
                          isDisposable(data.email || ""))
                          ? "border-red-500 bg-red-50"
                          : "border-slate-200"
                      }`}
                      autoComplete="email"
                    />
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="option"
                      checked={data.option || false}
                      onChange={(e) => {
                        bumpInteractions();
                        update("option", e.target.checked);
                      }}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="option" className="text-sm text-slate-600">
                      I agree to receive marketing communications.
                    </label>
                  </div>
                </div>
              )}

              {current.info && (
                <motion.div
                  className="mt-3.5 sm:mt-4 rounded-xl border bg-[linear-gradient(180deg,var(--primary-color-light),#fff)] text-slate-700 p-2.5 sm:p-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  {current.info}
                </motion.div>
              )}
            </div>
          </div>

          {submitError && (
            <motion.div
              className="text-red-500 text-sm mt-4 p-3 bg-red-50 border border-red-200 rounded text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {submitError}
            </motion.div>
          )}
          {/* NAV BUTTONS */}
          <div className="mt-6">
            {step === 0 ? (
              <div className="flex justify-center">
                <motion.button
                  type="button"
                  onClick={() => {
                    if (step < total - 1) {
                      guardedNext();
                    } else {
                      submit();
                    }
                  }}
                  disabled={submitting}
                  className="btn btn-primary px-8 py-2 sm:py-2.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                {step > 0 && (
                  <motion.button
                    type="button"
                    onClick={prev}
                    disabled={submitting}
                    className="btn btn-ghost px-4 py-2 sm:py-2.5 sm:min-w-[150px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Previous Step
                  </motion.button>
                )}

                {step < total - 1 ? (
                  <motion.button
                    type="button"
                    onClick={() => guardedNext()}
                    disabled={submitting}
                    className="btn btn-primary px-6 py-2 sm:py-2.5 sm:min-w-[200px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next Step
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={submitting}
                    className={`btn btn-primary px-6 py-2 sm:py-2.5 sm:min-w-[220px] ${
                      submitting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    whileHover={submitting ? {} : { scale: 1.05 }}
                    whileTap={submitting ? {} : { scale: 0.95 }}
                  >
                    {submitting ? "Submitting..." : "Check My Eligibility"}
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
