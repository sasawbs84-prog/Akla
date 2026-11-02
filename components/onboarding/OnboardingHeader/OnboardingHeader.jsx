"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./OnboardingHeader.module.css";

export default function OnboardingHeader({ canGoBack, onBack, onSkip }) {
  return (
    <header className={styles.appbar}>
      <div className={styles.startSide}>
        {canGoBack ? (
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBack}
            aria-label="رجوع للشريحة السابقة"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.backIcon}>
              <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <div className={styles.brandBadge}>
            <Image
              src="/assets/logo-mark.png"
              alt="أكلة"
              width={34}
              height={34}
              className={styles.brandLogo}
            />
            <span className={styles.brandName}>أكلة</span>
          </div>
        )}
      </div>

      <div className={styles.endSide}>
        <button
          type="button"
          className={styles.skipBtn}
          onClick={onSkip}
        >
          تخطّي
        </button>
      </div>
    </header>
  );
}

