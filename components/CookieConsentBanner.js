"use client";

import { useState, useEffect } from "react";
import { CMSClient } from "@yourcompany/global-backend-next";

const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation",
});

export default function CookieConsentBanner({ complianceSettings }) {
  const [showBanner, setShowBanner] = useState(false);

  // Map backend property names to local variables
  const {
    cookieConsentEnabled = false,
    cookieConsentMessage = "This website uses cookies to improve your experience.",
    bannerPosition = "bottom",
    acceptButtonText = "Accept All",
    declineButtonText = "Decline",
    settingsButtonText = "Preferences",
  } = complianceSettings || {};

  useEffect(() => {
    // Only show if enabled in backend AND no choice made yet locally
    if (cookieConsentEnabled) {
      const storedConsent = localStorage.getItem("cookie_consent");
      if (!storedConsent) {
        setTimeout(() => setShowBanner(true), 0);
      }
    }
  }, [cookieConsentEnabled]);

  const saveConsent = async (type, accepted) => {
    const consentData = {
      essential: true,
      analytics: accepted,
      marketing: accepted,
    };

    // 1. Save locally
    localStorage.setItem("cookie_consent", JSON.stringify(consentData));
    setShowBanner(false);

    // 2. Log to backend
    try {
      console.log("Attempting to log consent to backend...");
      await cms.recordConsent({
        visitorId: `visitor_${Math.random().toString(36).substr(2, 9)}`, // Quick unique ID
        consentType: type,
        accepted: accepted,
      });
      console.log("Consent logged successfully.");
    } catch (err) {
      console.error("Failed to log consent to backend:", err);
    }

    // Refresh to trigger analytics scripts with new consent
    window.location.reload();
  };

  if (!showBanner) return null;

  const positionClass = bannerPosition === "top" ? "top-0" : "bottom-0";

  return (
    <div
      className={`fixed left-0 w-full bg-white border-t border-gray-200 shadow-2xl p-6 z-[9999] flex flex-col md:flex-row items-center justify-between gap-4 ${positionClass}`}
    >
      <div className="text-sm text-gray-700 max-w-4xl">
        {cookieConsentMessage}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => saveConsent("decline", false)}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
        >
          {declineButtonText}
        </button>
        <button
          onClick={() => saveConsent("all", true)}
          className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
        >
          {acceptButtonText}
        </button>
      </div>
    </div>
  );
}
