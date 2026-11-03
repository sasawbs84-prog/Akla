"use client";

import { useEffect, useState } from "react";
import styles from "./PwaRegistration.module.css";

export default function PwaRegistration() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      setIsStandalone(isStandaloneMode);
      return isStandaloneMode;
    };

    const standalone = checkStandalone();

    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // Service worker registered successfully
            if (process.env.NODE_ENV === "development") {
              console.log("PWA Service Worker registered with scope:", registration.scope);
            }
          })
          .catch((err) => {
            console.warn("PWA Service Worker registration failed:", err);
          });
      });
    }

    // Capture install prompt for PWA
    const handleBeforeInstallPrompt = (e) => {
      // Prevent mini-infobar on mobile
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user previously dismissed banner
      const dismissed = sessionStorage.getItem("akla_pwa_dismissed");
      if (!dismissed && !standalone) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("akla_pwa_dismissed", "true");
    }
  };

  if (!showBanner || isStandalone) {
    return null;
  }

  return (
    <div className={styles.installBanner} role="alert">
      <div className={styles.bannerContent}>
        <div className={styles.appIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.appIcon}>
            <path d="M12 2a8 8 0 0 0-8 8v12h16V10a8 8 0 0 0-8-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 14h8M9 18h6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className={styles.textWrap}>
          <h4 className={styles.bannerTitle}>ثبّتي تطبيق أكلة على موبايلك</h4>
          <p className={styles.bannerSub}>لتجربة سريعة وخفيفة زي تطبيقات الموبايل</p>
        </div>
      </div>

      <div className={styles.actionsWrap}>
        <button
          type="button"
          className={styles.installBtn}
          onClick={handleInstallClick}
        >
          تثبيت
        </button>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleDismiss}
          aria-label="إغلاق التنبيه"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.closeIcon}>
            <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

