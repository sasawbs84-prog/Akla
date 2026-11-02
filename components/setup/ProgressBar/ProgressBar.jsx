"use client";

import styles from "./ProgressBar.module.css";

const STEP_LABELS = [
  "البروتين",
  "خضار وبقوليات",
  "النشويات",
  "الطعم والتوابل",
  "تفاصيل البيت",
];

export default function ProgressBar({ currentStep = 1, totalSteps = 5, onStepClick }) {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className={styles.wrapper}>
      {/* Desktop Step Nav Pills */}
      <div className={styles.desktopSteps} role="tablist">
        {STEP_LABELS.map((label, index) => {
          const stepNum = index + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <button
              key={stepNum}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              className={`${styles.stepPill} ${isCurrent ? styles.currentPill : ""} ${
                isDone ? styles.donePill : ""
              }`}
              onClick={() => onStepClick && onStepClick(stepNum)}
            >
              <span className={styles.pillNum}>
                {isDone ? (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  stepNum
                )}
              </span>
              <span className={styles.pillLabel}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Step Info */}
      <div className={styles.mobileInfo}>
        <span className={styles.mobileStepText}>الخطوة {currentStep} من {totalSteps}</span>
        <span className={styles.percentageText}>{percentage}%</span>
      </div>

      {/* Progress Bar Line */}
      <div
        className={styles.progressBar}
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-label="التقدم"
      >
        <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

