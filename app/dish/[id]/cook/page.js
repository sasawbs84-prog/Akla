"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_DISHES } from "@/lib/dishesData";
import { usePreferences } from "@/context/PreferencesContext";
import styles from "./cook.module.css";

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function CookingModeContent() {
  const params = useParams();
  const router = useRouter();
  const dishId = params?.id;
  const { prefs } = usePreferences();

  const dish = MOCK_DISHES.find((d) => d.id === dishId) || MOCK_DISHES[0];
  const steps = dish.steps;
  const totalSteps = steps.length;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  // Timer state
  const initialSeconds = (currentStep.timerMinutes || 0) * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [timerRunning, setTimerRunning] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const goToStep = (newIndex) => {
    setCurrentStepIndex(newIndex);
    const targetStep = steps[newIndex];
    setTimeLeft((targetStep?.timerMinutes || 0) * 60);
    setTimerRunning(false);
  };

  const handleNext = () => {
    if (!isLast) {
      goToStep(currentStepIndex + 1);
    } else {
      router.push("/home");
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      goToStep(currentStepIndex - 1);
    }
  };

  const servings = prefs.people || dish.defaultServings || 4;

  return (
    <div className={styles.screen}>
      <div className={styles.cookContainer}>
        {/* Header */}
        <header className={styles.appbar}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => router.push(`/dish/${dish.id}`)}
            aria-label="إغلاق وضع الطبخ"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <p className={styles.stepTitle}>
            الخطوة {currentStepIndex + 1} من {totalSteps}
          </p>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setSheetOpen(true)}
            aria-label="عرض المقادير"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 6h11M9 12h11M9 18h11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* Segmented Progress Bar */}
        <div className={styles.progressSegBar} aria-hidden="true">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.segBarItem} ${idx <= currentStepIndex ? styles.segOn : ""}`}
            />
          ))}
        </div>

        {/* Main Step Instruction */}
        <main className={styles.mainStepArea}>
          {wakeLockActive && (
            <span className={styles.wakeLockTag}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="4" strokeWidth="2" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2" strokeWidth="2" strokeLinecap="round" />
              </svg>
              الشاشة هتفضل منورة
            </span>
          )}

          <p className={styles.instructionText} aria-live="polite">
            {currentStep.text}
          </p>

          {/* Interactive Countdown Timer */}
          {currentStep.timerMinutes && (
            <div className={styles.timerCard}>
              <div className={styles.timerClockWrap}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" className={styles.timerIcon}>
                  <circle cx="12" cy="13" r="8" strokeWidth="2" />
                  <path d="M12 9v4l2.5 1.5M9 2h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.timerClock} dir="ltr">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              <div className={styles.timerActions}>
                <button
                  type="button"
                  className={styles.resetTimerBtn}
                  onClick={() => {
                    setTimeLeft(initialSeconds);
                    setTimerRunning(false);
                  }}
                  aria-label="إعادة ضبط التايمر"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 3v5h5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={styles.toggleTimerBtn}
                  onClick={() => setTimerRunning((r) => !r)}
                >
                  {timerRunning ? "إيقاف مؤقت" : timeLeft === 0 ? "ابدأ من جديد" : "ابدأ التايمر"}
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer Navigation */}
        <footer className={styles.footerBar}>
          <button
            type="button"
            className={styles.prevBtn}
            onClick={handlePrev}
            disabled={isFirst}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
              {/* RTL previous points right */}
              <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>السابقة</span>
          </button>

          <button
            type="button"
            className={`${styles.nextBtn} ${isLast ? styles.finishBtn : ""}`}
            onClick={handleNext}
          >
            <span>{isLast ? "خلّصت! بالهنا والشفا" : "الخطوة الجاية"}</span>
            {!isLast && (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
                {/* RTL next points left */}
                <path d="m15 6-6 6 6 6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </footer>
      </div>

      {/* Bottom Sheet for Ingredients Preview */}
      {sheetOpen && (
        <>
          <div
            className={styles.scrim}
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <section className={styles.sheetModal} role="dialog" aria-label="المقادير">
            <div className={styles.grabber} />
            <div className={styles.sheetHeader}>
              <h2 className={styles.sheetTitle}>المقادير · {servings} أفراد</h2>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setSheetOpen(false)}
                aria-label="إغلاق المقادير"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className={styles.sheetList}>
              {dish.ingredients.map((ing) => (
                <div key={ing.id} className={styles.sheetRow}>
                  <span className={styles.sheetIngName}>{ing.name}</span>
                  <span className={styles.sheetIngQty}>
                    {ing.baseQty ? `${(ing.baseQty * (servings / (dish.defaultServings || 4))).toFixed(0)} ${ing.unit}` : ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function CookingModeFallback() {
  return (
    <div className={styles.screen}>
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    </div>
  );
}

export default function CookingModePage() {
  return (
    <Suspense fallback={<CookingModeFallback />}>
      <CookingModeContent />
    </Suspense>
  );
}

