"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  Megaphone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function CtaWidgets({ ctaConfig }) {
  if (!ctaConfig) return null;

  const { floatingButtons = [], popups = [] } = ctaConfig;

  return (
    <>
      <FloatingActions buttons={floatingButtons} />
      <PopupModal popups={popups} />
    </>
  );
}

// ─── FLOATING ACTIONS COMPONENT ────────────────────────────────────────────────
function FloatingActions({ buttons }) {
  if (!buttons || buttons.length === 0) return null;

  // Map position values to Tailwind classes
  const positionClasses = {
    "bottom-right": "bottom-16 right-4 items-end",
    "bottom-left": "bottom-16 left-4 items-start",
    "top-right": "top-16 right-4 items-end",
    "top-left": "top-16 left-4 items-start",
  };

  // Use the first button's position, default to bottom-right
  const position = buttons[0]?.position || "bottom-right";
  const posClass = positionClasses[position] || positionClasses["bottom-right"];

  return (
    <div
      className={`fixed z-40 flex flex-col gap-2.5 max-w-[200px] ${posClass}`}
    >
      {buttons.map((btn) => (
        <a
          key={btn.id}
          href={btn.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-[var(--ll-ink)] border border-[var(--ll-gold)]/25 text-[var(--ll-gold)] rounded-full px-4 py-2.5 text-xs font-bold shadow-[var(--ll-shadow-lift)] hover:scale-105 hover:border-[var(--ll-gold)]/60 backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer max-w-[180px] truncate"
          style={{ backgroundColor: btn.color || "#1e293b" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d9b04f] shrink-0 animate-pulse group-hover:rotate-12 transition-transform" />
          <span className="truncate text-white font-medium group-hover:text-[#d9b04f] transition-colors">
            {btn.label}
          </span>
        </a>
      ))}
    </div>
  );
}

// ─── POPUP MODAL COMPONENT ─────────────────────────────────────────────────────
function PopupModal({ popups }) {
  const [activePopup, setActivePopup] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!popups || popups.length === 0) return;

    // Find the first popup that hasn't been dismissed in this or previous sessions
    const eligiblePopup = popups.find(
      (pop) => !localStorage.getItem(`popup-dismissed-${pop.id}`),
    );

    if (!eligiblePopup) return;

    let triggerTimeout;

    const triggerPopup = () => {
      setActivePopup(eligiblePopup);
      // Clean up event listeners once triggered
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleExitIntent);
    };

    // Trigger 1: Delay (e.g. 5 seconds)
    triggerTimeout = setTimeout(triggerPopup, 5000);

    // Trigger 2: Scroll (e.g. 30% page height)
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0 && scrollPos / totalHeight > 0.3) {
        triggerPopup();
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Trigger 3: Exit Intent (mouse leaving viewport top)
    const handleExitIntent = (e) => {
      if (e.clientY < 20) {
        triggerPopup();
      }
    };
    document.addEventListener("mouseleave", handleExitIntent);

    return () => {
      clearTimeout(triggerTimeout);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, [popups]);

  if (!activePopup) return null;

  const handleClose = () => {
    localStorage.setItem(`popup-dismissed-${activePopup.id}`, "true");
    setActivePopup(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
      const siteId = process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation";

      const res = await fetch(`${baseUrl}/api/forms/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          name: "Popup Subscriber",
          email,
          message: `Subscribed to newsletter from popup: "${activePopup.title}" (ID: ${activePopup.id})`,
          _hp: "",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Subscription failed");
      }

      setStatus("success");
      setEmail("");
      // Automatically close modal after 2 seconds on success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--ll-ink)]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div className="bg-[var(--ll-cream)] text-[var(--ll-ink)] rounded-[var(--ll-radius-lg)] max-w-md w-full shadow-[var(--ll-shadow-lift)] border border-[var(--ll-stone)] border-t-2 border-t-[var(--ll-gold)] relative transform transition-all scale-100 animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--ll-stone)] hover:bg-[var(--ll-ink)] hover:text-white text-[var(--ll-slate-text)] flex items-center justify-center transition-all cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-8 pt-10 text-center space-y-5">
          <div className="w-14 h-14 bg-[var(--ll-gold-light)] text-[var(--ll-gold)] rounded-full border border-[var(--ll-gold)]/20 mx-auto flex items-center justify-center">
            <Megaphone className="w-6 h-6 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-[var(--ll-ink)] tracking-tight leading-snug">
              {activePopup.title}
            </h3>
            {activePopup.body && (
              <p className="text-sm text-[var(--ll-slate-text)] leading-relaxed">
                {activePopup.body}
              </p>
            )}
          </div>

          {/* Form */}
          {status === "success" ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2 text-green-400 animate-in fade-in duration-300">
              <CheckCircle2 className="w-10 h-10" />
              <span className="text-sm font-bold">
                Successfully Subscribed!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-2 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full px-4 py-3 bg-[var(--ll-mist)] border border-[var(--ll-stone)] rounded-[var(--ll-radius-sm)] text-sm text-[var(--ll-ink)] placeholder:text-[var(--ll-light-text)] focus:outline-none focus:border-[var(--ll-gold)] focus:ring-4 focus:ring-[var(--ll-gold)]/10"
                disabled={status === "submitting"}
              />

              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-7 py-3.5 rounded-[var(--ll-radius-sm)] bg-[var(--ll-gold)] hover:bg-[var(--ll-gold-dark)] text-[var(--ll-ink)] font-bold text-sm tracking-wide shadow-sm transition-all duration-200 hover:-translate-y-px active:translate-y-0 w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === "submitting" ? "Subscribing..." : "Join Newsletter"}
              </button>

              {status === "error" && (
                <div className="flex items-center gap-1.5 text-red-400 text-2xs font-semibold justify-center pt-1">
                  <AlertCircle size={12} /> {errorMessage}
                </div>
              )}
            </form>
          )}

          <div className="block text-center text-[10px] text-[var(--ll-light-text)] mt-3 italic">
            We value your privacy. Unsubscribe at any time.
          </div>
        </div>
      </div>
    </div>
  );
}
