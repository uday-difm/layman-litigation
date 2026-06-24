"use client";

import { useEffect } from "react";
import { cms } from "@/lib/cms";

export default function VisitorTracker() {
  useEffect(() => {
    // Generate or fetch a visitor token from localStorage
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = `vis_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("visitor_id", visitorId);
    }

    const ping = () => {
      cms.pingVisitor({
        visitorId,
        pageViewed: window.location.pathname,
        deviceInfo: navigator.userAgent,
        trafficSource: document.referrer || "Direct",
      }).catch((err) => console.error("Traffic ping failed", err));
    };

    // Ping immediately on load, and then every 30 seconds to keep live status active
    ping();
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
