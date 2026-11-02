"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";
import OnboardingIllustration from "@/components/onboarding/OnboardingIllustration/OnboardingIllustration";
import OnboardingDots from "@/components/onboarding/OnboardingDots/OnboardingDots";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader/OnboardingHeader";
import styles from "./onboarding.module.css";

const ONBOARDING_SLIDES = [
  {
    id: 1,
    tagline: "ودّعي حيرة كل يوم",
    title: "كل يوم أكلة جديدة",
    description: "قوليلنا بتحبي إيه، وأكلة هتقترح عليكي كل يوم طبخة من الحاجات اللي بتحبيها بس بدون تكرار.",
    bulletPoints: [
      "اقتراحات يومية مخصصة 100% لتفضيلاتك والمكونات اللي بتفضليها",
      "استبعاد تام لأي أصناف أو أكلات مش على مزاجك أو بتسبب لك حساسية",
      "زر بديل ذكي لتغيير الطبخة بضغطة واحدة لو مش على مزاجك النهاردة",
    ],
    ctaText: "التالي",
  },
  {
    id: 2,
    tagline: "على قد بيتك وميزانيتك",
    title: "المقادير بالظبط",
    description: "كل أكلة بمقاديرها على قد عدد أفراد بيتك بالجرام والمعلقة، وطريقة التحضير خطوة بخطوة بالصور.",
    bulletPoints: [
      "تعديل تلقائي وفوري للكميات والمقادير حسب عدد الأفراد",
      "خطوات تحضير مبسطة وواضحة تناسب المبتدئات والمحترفات",
      "مؤقت ذكي لكل خطوة طهي عشان الأكلة تطلع مظبوطة بالدقيقة",
    ],
    ctaText: "التالي",
  },
  {
    id: 3,
    tagline: "وفري وقتك ومجهودك",
    title: "خطّطي أسبوعك واشتري مرة واحدة",
    description: "جدول أكل متوازن للأسبوع كله، وقائمة مشتريات جاهزة بضغطة واحدة تبعتيها على واتساب.",
    bulletPoints: [
      "جدول وجبات أسبوعي ذكي يغنيكِ عن التفكير كل صباح",
      "تجميع مقادير الأسبوع بالكامل في قائمة مشتروات مقسمة ومنظمة",
      "مشاركة فورية لقائمة النواقص عبر WhatsApp مع أسرتك",
    ],
    ctaText: "يلا نبدأ",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const totalSteps = ONBOARDING_SLIDES.length;
  const currentSlide = ONBOARDING_SLIDES[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    router.push("/login");
  };

  // Keyboard navigation for desktop users (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        // Next in RTL
        setCurrentStep((prev) => {
          if (prev < totalSteps - 1) return prev + 1;
          router.push("/login");
          return prev;
        });
      } else if (e.key === "ArrowRight") {
        // Previous in RTL
        setCurrentStep((prev) => (prev > 0 ? prev - 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, totalSteps]);

  // Touch Swipe navigation for mobile users
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // In RTL: Swipe left (diff > 50) means NEXT, Swipe right (diff < -50) means BACK
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handleBack();
    }
  };

  return (
    <div
      className={styles.pageContainer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.responsiveShell}>
        {/* App Bar / Header */}
        <OnboardingHeader
          canGoBack={currentStep > 0}
          onBack={handleBack}
          onSkip={handleComplete}
        />

        {/* Main Content Layout (Split 2-columns on Desktop, Single-column on Mobile) */}
        <div className={styles.contentLayout}>
          {/* Visual Column / Illustration */}
          <div className={styles.visualColumn}>
            <OnboardingIllustration step={currentStep} />
          </div>

          {/* Text & Action Column */}
          <div className={styles.textColumn}>
            {/* Step pill badge (Desktop only) */}
            <div className={styles.stepBadge}>
              <span>خطوة {currentStep + 1} من {totalSteps}</span>
            </div>

            <div className={styles.typography}>
              <span className={styles.tagline}>{currentSlide.tagline}</span>
              <h1 className={styles.title}>{currentSlide.title}</h1>
              <p className={styles.description}>{currentSlide.description}</p>
            </div>

            {/* Feature Bullets (Shown primarily on Desktop & Tablets) */}
            <ul className={styles.featureList}>
              {currentSlide.bulletPoints.map((point, index) => (
                <li key={index} className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Stepper Dots */}
            <div className={styles.dotsWrapper}>
              <OnboardingDots
                total={totalSteps}
                current={currentStep}
                onSelect={setCurrentStep}
              />
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleNext}
                className={styles.nextBtn}
                icon={
                  currentStep < totalSteps - 1 ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      className={styles.nextChevron}
                    >
                      {/* RTL Next Arrow points left */}
                      <path d="m15 6-6 6 6 6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null
                }
              >
                {currentSlide.ctaText}
              </Button>

              {currentStep > 0 && (
                <button
                  type="button"
                  className={styles.desktopPrevBtn}
                  onClick={handleBack}
                >
                  السابق
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
