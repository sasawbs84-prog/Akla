"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_DISHES } from "@/lib/dishesData";
import { usePreferences } from "@/context/PreferencesContext";
import Button from "@/components/common/Button/Button";
import styles from "./dish.module.css";

function DishDetailContent() {
  const params = useParams();
  const router = useRouter();
  const dishId = params?.id;
  const { prefs } = usePreferences();

  // Find dish or fallback to first dish
  const dish = MOCK_DISHES.find((d) => d.id === dishId) || MOCK_DISHES[0];

  const [activeTab, setActiveTab] = useState("ingredients"); // 'ingredients' | 'steps'
  const [servings, setServings] = useState(prefs.people || dish.defaultServings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isFav, setIsFav] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const defaultServings = dish.defaultServings || 4;

  // Toggle ingredient checked state
  const toggleIngredient = (id) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate missing ingredients count
  const missingCount = dish.ingredients.filter((ing) => !checkedIngredients[ing.id]).length;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: dish.name,
        text: `تعالي شوفي طريقة ومقادير ${dish.name} على تطبيق أكلة!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast("تم نسخ رابط الأكلة للمشاركة!");
      if (typeof navigator !== "undefined") {
        navigator.clipboard?.writeText(window.location.href);
      }
    }
  };

  const handleAddMissingToShopping = () => {
    showToast(`تمت إضافة ${missingCount} مقادير ناقصة لقائمة المشتريات!`);
  };

  // Helper to scale quantities nicely
  const getScaledQuantity = (baseQty, unit) => {
    if (!baseQty || isNaN(baseQty)) return unit;
    const ratio = servings / defaultServings;
    const scaled = baseQty * ratio;
    // Format nicely
    const formatted = scaled % 1 === 0 ? scaled : scaled.toFixed(1);
    return `${formatted} ${unit}`;
  };

  return (
    <div className={styles.screen}>
      {toastMessage && (
        <div className={styles.toast} role="status">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Photo Header */}
      <div className={`${styles.heroPhoto} ${styles[dish.ph]}`}>
        <div className={styles.photoActions}>
          <button
            type="button"
            className={styles.iconBtnPhoto}
            onClick={() => router.back()}
            aria-label="رجوع"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {/* RTL Back arrow points right */}
              <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={styles.photoRightActions}>
            <button
              type="button"
              className={styles.iconBtnPhoto}
              onClick={handleShare}
              aria-label="مشاركة الأكلة"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="18" cy="5" r="2.5" strokeWidth="1.8" />
                <circle cx="6" cy="12" r="2.5" strokeWidth="1.8" />
                <circle cx="18" cy="19" r="2.5" strokeWidth="1.8" />
                <path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" strokeWidth="1.8" />
              </svg>
            </button>

            <button
              type="button"
              className={`${styles.iconBtnPhoto} ${isFav ? styles.isFav : ""}`}
              onClick={() => {
                setIsFav((prev) => !prev);
                showToast(!isFav ? "تمت الإضافة للمفضلة" : "تم الحذف من المفضلة");
              }}
              aria-label={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              <svg viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor">
                <path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.heroCenterEmoji}>
          <span>{dish.emoji}</span>
          <span className={styles.photoDishLabel}>{dish.name}</span>
        </div>
      </div>

      {/* Sheet Content Container */}
      <div className={styles.sheetContainer}>
        {/* Title & Tags */}
        <div className={styles.titleSection}>
          <div className={styles.tagsRow}>
            {dish.tags.map((t, idx) => (
              <span key={idx} className={styles.tagBadge}>
                {t}
              </span>
            ))}
          </div>
          <h1 className={styles.dishTitle}>{dish.name}</h1>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
              <path d="M12 7v5l3 2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.statVal}>{dish.time}</span>
            <span className={styles.statLabel}>الوقت</span>
          </div>

          <div className={styles.statCard}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <circle cx="9" cy="8" r="3.5" strokeWidth="1.8" />
              <path d="M2.5 20a6.5 6.5 0 0 1 13 0" strokeWidth="1.8" />
              <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className={styles.statVal}>{servings} أفراد</span>
            <span className={styles.statLabel}>الكمية</span>
          </div>

          <div className={styles.statCard}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path d="M5 20v-5M12 20V10M19 20V4" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className={styles.statVal}>{dish.level}</span>
            <span className={styles.statLabel}>الصعوبة</span>
          </div>

          <div className={styles.statCard}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path d="M12 21c4 0 7-2.7 7-6.6 0-3.5-2.5-5.9-4-8.4-.6 2-1.6 3-3 3.5C12 6.5 10.5 4.3 9 3c.3 3-3 5.5-3 10.4C5 18.3 8 21 12 21z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.statVal}>{dish.calories}</span>
            <span className={styles.statLabel}>سعرة/فرد</span>
          </div>
        </div>

        {/* Segmented Tabs */}
        <div className={styles.segTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "ingredients"}
            className={`${styles.segTab} ${activeTab === "ingredients" ? styles.segActive : ""}`}
            onClick={() => setActiveTab("ingredients")}
          >
            المقادير
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "steps"}
            className={`${styles.segTab} ${activeTab === "steps" ? styles.segActive : ""}`}
            onClick={() => setActiveTab("steps")}
          >
            طريقة التحضير
          </button>
        </div>

        {/* Tab 1: Ingredients Content */}
        {activeTab === "ingredients" && (
          <div className={styles.tabContent}>
            {/* Servings Stepper */}
            <div className={styles.stepperRow}>
              <div>
                <p className={styles.stepperTitle}>المقادير لـ {servings} أفراد</p>
                <p className={styles.stepperSub}>الكميات بتتغير وتتحسب لوحدها</p>
              </div>

              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.stepperBtn}
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  aria-label="تقليل فرد"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
                <output className={styles.stepperNum} aria-live="polite">
                  {servings}
                </output>
                <button
                  type="button"
                  className={styles.stepperBtn}
                  onClick={() => setServings((s) => Math.min(16, s + 1))}
                  aria-label="زيادة فرد"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Ingredients Check List */}
            <div className={styles.cardList}>
              {dish.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing.id];
                return (
                  <label
                    key={ing.id}
                    className={`${styles.checkRow} ${isChecked ? styles.rowChecked : ""}`}
                  >
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={isChecked}
                      onChange={() => toggleIngredient(ing.id)}
                    />
                    <span className={styles.ingName}>{ing.name}</span>
                    <span className={styles.ingQty}>
                      {getScaledQuantity(ing.baseQty, ing.unit)}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Add missing to shopping button */}
            <button
              type="button"
              className={styles.addMissingBtn}
              onClick={handleAddMissingToShopping}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 11v6M9 14h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>أضف الناقص للمشتريات ({missingCount})</span>
            </button>
          </div>
        )}

        {/* Tab 2: Steps Content */}
        {activeTab === "steps" && (
          <div className={styles.tabContent}>
            <p className={styles.stepsCountMeta}>
              {dish.steps.length} خطوات · حوالي {dish.time}
            </p>

            <ol className={styles.stepsList}>
              {dish.steps.map((st) => (
                <li key={st.stepNumber} className={styles.stepItem}>
                  <span className={styles.stepIndexNum}>{st.stepNumber}</span>
                  <div className={styles.stepContent}>
                    <p className={styles.stepText}>{st.text}</p>
                    {st.timerMinutes && (
                      <span className={styles.stepTimerTag}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                          <circle cx="12" cy="13" r="8" strokeWidth="2" />
                          <path d="M12 9v4l2.5 1.5M9 2h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>تايمر {st.timerMinutes} دقيقة</span>
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Chef Tip Banner */}
        {dish.chefTip && (
          <aside className={styles.chefTipBanner}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" className={styles.bulbIcon}>
              <path d="M9 18h6M10 21h4" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className={styles.tipTitle}>نصيحة الشيف</p>
              <p className={styles.tipText}>{dish.chefTip}</p>
            </div>
          </aside>
        )}
      </div>

      {/* Sticky Bottom CTA: Start Cooking */}
      <div className={styles.stickyBar}>
        <Link href={`/dish/${dish.id}/cook`} className={styles.cookLink}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            }
          >
            ابدأ الطبخ الآن
          </Button>
        </Link>
      </div>
    </div>
  );
}

function DishDetailFallback() {
  return (
    <div className={styles.screen}>
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    </div>
  );
}

export default function DishDetailPage() {
  return (
    <Suspense fallback={<DishDetailFallback />}>
      <DishDetailContent />
    </Suspense>
  );
}

