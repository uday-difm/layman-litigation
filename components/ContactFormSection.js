// components/ContactFormSection.js
"use client";

import { useState, useEffect } from "react";

export default function ContactFormSection({ siteId = "", content = {}, recaptchaSiteKey = "" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // Honeypot
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (recaptchaSiteKey) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [recaptchaSiteKey]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    let recaptchaToken = undefined;
    if (recaptchaSiteKey && typeof window !== "undefined" && window.grecaptcha) {
      try {
        recaptchaToken = window.grecaptcha.getResponse();
      } catch (err) {
        console.error("reCAPTCHA getResponse error:", err);
      }
      if (!recaptchaToken) {
        setAlert({ type: "error", text: "Please complete the reCAPTCHA security verification." });
        setLoading(false);
        return;
      }
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/forms/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, name, email, phone, message, recaptchaToken, _hp: hp }),
      });

      const json = await res.json();
      if (!res.ok) {
        setAlert({ type: "error", text: json.error || "Failed to submit message." });
        setLoading(false);
        return;
      }

      setAlert({ type: "success", text: "Thank you! Your message has been sent successfully." });
      setName(""); setEmail(""); setPhone(""); setMessage("");
      if (recaptchaSiteKey && typeof window !== "undefined" && window.grecaptcha) {
        window.grecaptcha.reset();
      }
    } catch (err) {
      setAlert({ type: "error", text: "A network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ll-section bg-[var(--ll-mist)] text-[var(--ll-slate-text)] border-t border-[var(--ll-stone)]">
      <div className="max-w-2xl mx-auto px-[var(--ll-content-x)]">
        <div className="text-center mb-10">
          <span className="ll-eyebrow block mb-3">Free Consultation</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-[var(--ll-ink)] mb-4">
            {content?.title || "Get In Touch"}
          </h2>
          {content?.description && (
            <p className="text-[var(--ll-slate-text)] text-sm leading-relaxed mt-2">
              {content.description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--ll-cream)] rounded-[var(--ll-radius-lg)] shadow-[var(--ll-shadow-card)] border border-[var(--ll-stone)] p-8 space-y-5" noValidate>
          <div style={{ display: "none" }} aria-hidden="true">
            <input type="text" name="honeypot" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ll-light-text)] mb-2">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="w-full rounded-[var(--ll-radius-sm)] border border-[var(--ll-stone)] bg-[var(--ll-mist)] px-4 py-3 text-sm text-[var(--ll-ink)] outline-none placeholder:text-[var(--ll-light-text)] hover:border-[var(--ll-gold)]/40 focus:border-[var(--ll-gold)] focus:ring-4 focus:ring-[var(--ll-gold)]/10 transition-all duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ll-light-text)] mb-2">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" className="w-full rounded-[var(--ll-radius-sm)] border border-[var(--ll-stone)] bg-[var(--ll-mist)] px-4 py-3 text-sm text-[var(--ll-ink)] outline-none placeholder:text-[var(--ll-light-text)] hover:border-[var(--ll-gold)]/40 focus:border-[var(--ll-gold)] focus:ring-4 focus:ring-[var(--ll-gold)]/10 transition-all duration-200" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ll-light-text)] mb-2">Phone Number (Optional)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full rounded-[var(--ll-radius-sm)] border border-[var(--ll-stone)] bg-[var(--ll-mist)] px-4 py-3 text-sm text-[var(--ll-ink)] outline-none placeholder:text-[var(--ll-light-text)] hover:border-[var(--ll-gold)]/40 focus:border-[var(--ll-gold)] focus:ring-4 focus:ring-[var(--ll-gold)]/10 transition-all duration-200" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ll-light-text)] mb-2">Your Message</label>
            <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your project or inquiry..." className="w-full rounded-[var(--ll-radius-sm)] border border-[var(--ll-stone)] bg-[var(--ll-mist)] px-4 py-3 text-sm text-[var(--ll-ink)] outline-none placeholder:text-[var(--ll-light-text)] hover:border-[var(--ll-gold)]/40 focus:border-[var(--ll-gold)] focus:ring-4 focus:ring-[var(--ll-gold)]/10 transition-all duration-200 resize-none" />
          </div>

          {recaptchaSiteKey && (
            <div className="flex justify-start my-4">
              <div className="g-recaptcha" data-sitekey={recaptchaSiteKey}></div>
            </div>
          )}

          {alert && (
            <div className={`p-4 border text-xs flex items-center gap-2 rounded-[var(--ll-radius-sm)] ${alert.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800 border-l-4 border-l-emerald-500" : "bg-rose-50 border-rose-100 text-rose-800 border-l-4 border-l-rose-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${alert.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
              {alert.text}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-[var(--ll-radius-sm)] bg-[var(--ll-gold)] hover:bg-[var(--ll-gold-dark)] text-[var(--ll-ink)] font-bold px-4 py-4 text-sm shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0 cursor-pointer">
            {loading ? "Sending Message..." : content?.buttonText || "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
