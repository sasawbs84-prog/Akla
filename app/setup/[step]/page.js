"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePreferences } from "@/context/PreferencesContext";
import ProgressBar from "@/components/setup/ProgressBar/ProgressBar";
import StickyFooter from "@/components/setup/StickyFooter/StickyFooter";
import StepProteins from "@/components/setup/StepProteins/StepProteins";
import StepVegetables from "@/components/setup/StepVegetables/StepVegetables";
import StepCarbs from "@/components/setup/StepCarbs/StepCarbs";
import StepFlavors from "@/components/setup/StepFlavors/StepFlavors";
import StepHousehold from "@/components/setup/StepHousehold/StepHousehold";
import StepSummary from "@/components/setup/StepSummary/StepSummary";
import styles from "./setup.module.css";

const STEPS_CONFIG = {
  proteins: { number: 1, next: "vegetables", prev: "/login", isSummary: false },
  vegetables: { number: 2, next: "carbs", prev: "proteins", isSummary: false },
  carbs: { number: 3, next: "flavors", prev: "vegetables", isSummary: false },
  flavors: { number: 4, next: "household", prev: "carbs", isSummary: false },
  household: { number: 5, next: "summary", prev: "flavors", isSummary: false },
  summary: { number: 6, next: "/home", prev: "household", isSummary: true },
};

const STEP_NUMBERS = {
  1: "proteins",
  2: "vegetables",
  3: "carbs",
  4: "flavors",
  5: "household",
};

function SetupStepContent() {
  const params = useParams();
  const router = useRouter();
  const stepKey = params?.step || "proteins";
  const stepConfig = STEPS_CONFIG[stepKey] || STEPS_CONFIG.proteins;

  const { prefs, savePreferencesToFirestore } = usePreferences();

  const handleNext = () => {
    // Save progress to Firestore seamlessly
    savePreferencesToFirestore(null, false).catch(() => {});

    if (stepConfig.next.startsWith("/")) {
      router.push(stepConfig.next);
    } else {
      router.push(`/setup/${stepConfig.next}`);
    }
  };

  const handleBack = () => {
    if (stepConfig.prev.startsWith("/")) {
      router.push(stepConfig.prev);
    } else {
      router.push(`/setup/${stepConfig.prev}`);
    }
  };

  const handleStepClick = (num) => {
    const targetKey = STEP_NUMBERS[num];
    if (targetKey) {
      router.push(`/setup/${targetKey}`);
    }
  };

  const handleEditStep = (stepNumber) => {
    handleStepClick(stepNumber);
  };

  // Determine CTA text based on current selections
  let ctaText = "التالي";
  if (stepKey === "proteins") {
    const n = Object.keys(prefs.proteins || {}).length;
    ctaText = n > 0 ? `التالي · ${n} مختارين` : "التالي";
  } else if (stepKey === "vegetables") {
    const n = Object.keys(prefs.vegetables || {}).length;
    ctaText = n > 0 ? `التالي · ${n} مختارين` : "التالي";
  } else if (stepKey === "carbs") {
    const n = Object.keys(prefs.carbs || {}).length;
    ctaText = n > 0 ? `التالي · ${n} مختارين` : "التالي";
  } else if (stepKey === "flavors") {
    ctaText = "التالي";
  } else if (stepKey === "household") {
    ctaText = "شوفي الملخص";
  }

  return (
    <div className={styles.screen}>
      <div className={styles.setupShell}>
        {/* Top App Bar */}
        <header className={styles.appbar}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleBack}
            aria-label="رجوع"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.backIcon}>
              <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {!stepConfig.isSummary ? (
            <p className={styles.stepTitleBar}>الخطوة {stepConfig.number} من 5</p>
          ) : (
            <p className={styles.stepTitleBar}>ملخص التفضيلات</p>
          )}

          {!stepConfig.isSummary ? (
            <Link href={`/setup/${stepConfig.next}`} className={styles.skipBtn}>
              تخطّي
            </Link>
          ) : (
            <span className={styles.headerSpacer} />
          )}
        </header>

        {/* Progress Bar (Hidden on Summary) */}
        {!stepConfig.isSummary && (
          <div className={styles.progressContainer}>
            <ProgressBar
              currentStep={stepConfig.number}
              totalSteps={5}
              onStepClick={handleStepClick}
            />
          </div>
        )}

        {/* Main Step Content */}
        <main className={styles.mainContent}>
          {stepKey === "proteins" && <StepProteins />}
          {stepKey === "vegetables" && <StepVegetables />}
          {stepKey === "carbs" && <StepCarbs />}
          {stepKey === "flavors" && <StepFlavors />}
          {stepKey === "household" && <StepHousehold />}
          {stepKey === "summary" && <StepSummary onEditStep={handleEditStep} />}
        </main>

        {/* Sticky CTA (Hidden on Summary) */}
        {!stepConfig.isSummary && (
          <StickyFooter
            onNext={handleNext}
            onBack={handleBack}
            canGoBack={stepConfig.number > 1}
            ctaText={ctaText}
          />
        )}
      </div>
    </div>
  );
}

function SetupLoadingFallback() {
  return (
    <div className={styles.screen}>
      <div className={styles.setupShell}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
        </div>
      </div>
    </div>
  );
}

export default function SetupStepPage() {
  return (
    <Suspense fallback={<SetupLoadingFallback />}>
      <SetupStepContent />
    </Suspense>
  );
}
