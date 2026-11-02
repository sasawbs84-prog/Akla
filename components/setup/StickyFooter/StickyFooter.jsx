"use client";

import Button from "@/components/common/Button/Button";
import styles from "./StickyFooter.module.css";

export default function StickyFooter({
  onNext,
  onBack,
  canGoBack = false,
  ctaText = "التالي",
  loading = false,
}) {
  return (
    <div className={styles.stickyCta}>
      {canGoBack && (
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onBack}
          disabled={loading}
          className={styles.backBtn}
        >
          السابق
        </Button>
      )}

      <Button
        type="button"
        variant="primary"
        size="md"
        fullWidth
        onClick={onNext}
        loading={loading}
        className={styles.nextBtn}
        icon={
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
            {/* Next chevron pointing left in RTL */}
            <path d="m15 6-6 6 6 6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        {ctaText}
      </Button>
    </div>
  );
}

