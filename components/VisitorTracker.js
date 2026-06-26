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

    let startTime = Date.now();
    let accumulatedTime = 0; // seconds
    let lastUnloadPinged = false;

    const getActiveDuration = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        return accumulatedTime + elapsed;
      }
      return accumulatedTime;
    };

    const ping = () => {
      const duration = getActiveDuration();
      cms.pingVisitor({
        visitorId,
        pageViewed: window.location.pathname,
        deviceInfo: navigator.userAgent,
        trafficSource: document.referrer || "Direct",
        duration,
      }).catch((err) => console.error("Traffic ping failed", err));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        accumulatedTime += Math.round((Date.now() - startTime) / 1000);
      } else {
        startTime = Date.now();
      }
      ping();
    };

    const handleBeforeUnload = () => {
      if (!lastUnloadPinged) {
        lastUnloadPinged = true;
        ping();
      }
    };

    // Ping immediately on load, and then every 30 seconds to keep live status active
    ping();
    const interval = setInterval(ping, 30000);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}
