"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/context/PreferencesContext";
import Button from "@/components/common/Button/Button";
import styles from "./StepSummary.module.css";

export default function StepSummary({ onEditStep }) {
  const router = useRouter();
  const { prefs, data, savePreferencesToFirestore, saving } = usePreferences();
  const [error, setError] = useState("");

  // Helper to extract selected labels
  const getSelectedLabels = (categoryMap, groupsData) => {
    const labels = [];
    Object.keys(groupsData).forEach((groupKey) => {
      groupsData[groupKey].forEach((item) => {
        if (categoryMap[item.id]) {
          labels.push(item.label);
        }
      });
    });
    return labels;
  };

  const selectedProteins = getSelectedLabels(prefs.proteins || {}, data.proteins);
  const selectedVegetables = getSelectedLabels(prefs.vegetables || {}, data.vegetables);
  const selectedCarbs = getSelectedLabels(prefs.carbs || {}, data.carbs);

  const currentHeatObj = data.heats.find((h) => h.id === prefs.heat) || data.heats[1];
  const selectedAllergiesList = Object.keys(prefs.allergies || {})
    .filter((k) => prefs.allergies[k])
    .map((k) => data.allergies[k]);

  const handleFinish = async () => {
    setError("");
    try {
      await savePreferencesToFirestore();
      // Redirect to home page
      router.push("/home");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء حفظ الاختيارات. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className={styles.summaryContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.checkCircle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.checkIcon}>
            <path d="m5 12.5 4.5 4.5L19 7.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className={styles.title}>كده تمام!</h1>
        <p className={styles.subtitle}>
          ده ملخص اختياراتك. أي حاجة تقدري تعدّليها دلوقتي أو في أي وقت بعدين من حسابك.
        </p>
      </div>

      {error && (
        <div className={styles.errorAlert} role="alert">
          {error}
        </div>
      )}

      {/* Grid of Summary Cards (2 columns on Desktop, 1 on Mobile) */}
      <div className={styles.cardsGrid}>
        {/* 1. Proteins Card */}
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitleWrap}>
              <span className={styles.dotTomato} />
              <h2 className={styles.cardTitle}>البروتين</h2>
              <span className={styles.countBadge}>{selectedProteins.length} أصناف</span>
            </div>
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => onEditStep(1)}
            >
              تعديل
            </button>
          </div>
          <div className={styles.tagsWrap}>
            {selectedProteins.length > 0 ? (
              selectedProteins.map((item, idx) => (
                <span key={idx} className={`${styles.tag} ${styles.tagTomato}`}>
                  {item}
                </span>
              ))
            ) : (
              <span className={styles.emptyNotice}>لم يتم اختيار أصناف محددة</span>
            )}
          </div>
        </section>

        {/* 2. Vegetables & Legumes Card */}
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitleWrap}>
              <span className={styles.dotGreen} />
              <h2 className={styles.cardTitle}>خضار وبقوليات</h2>
              <span className={styles.countBadge}>{selectedVegetables.length} أصناف</span>
            </div>
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => onEditStep(2)}
            >
              تعديل
            </button>
          </div>
          <div className={styles.tagsWrap}>
            {selectedVegetables.length > 0 ? (
              selectedVegetables.map((item, idx) => (
                <span key={idx} className={`${styles.tag} ${styles.tagGreen}`}>
                  {item}
                </span>
              ))
            ) : (
              <span className={styles.emptyNotice}>لم يتم اختيار أصناف محددة</span>
            )}
          </div>
        </section>

        {/* 3. Carbs Card */}
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitleWrap}>
              <span className={styles.dotSaffron} />
              <h2 className={styles.cardTitle}>النشويات</h2>
              <span className={styles.countBadge}>{selectedCarbs.length} أصناف</span>
            </div>
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => onEditStep(3)}
            >
              تعديل
            </button>
          </div>
          <div className={styles.tagsWrap}>
            {selectedCarbs.length > 0 ? (
              selectedCarbs.map((item, idx) => (
                <span key={idx} className={`${styles.tag} ${styles.tagCarb}`}>
                  {item}
                </span>
              ))
            ) : (
              <span className={styles.emptyNotice}>لم يتم اختيار أصناف محددة</span>
            )}
          </div>
        </section>

        {/* 4. Household & Flavors Card */}
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitleWrap}>
              <span className={styles.dotBrown} />
              <h2 className={styles.cardTitle}>الطعم وتفاصيل البيت</h2>
            </div>
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => onEditStep(5)}
            >
              تعديل
            </button>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                <circle cx="9" cy="8" r="3.5" strokeWidth="1.8" />
                <path d="M2.5 20a6.5 6.5 0 0 1 13 0" strokeWidth="1.8" />
                <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {prefs.people || 4} أفراد
            </span>

            <span className={styles.metaItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                <path d="M12 7v5l3 2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {prefs.cookingTime || "حوالي ساعة"}
            </span>

            <span className={styles.metaItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                <path d="M12 21c4 0 7-2.7 7-6.6 0-3.5-2.5-5.9-4-8.4-.6 2-1.6 3-3 3.5C12 6.5 10.5 4.3 9 3c.3 3-3 5.5-3 10.4C5 18.3 8 21 12 21z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {currentHeatObj.label}
            </span>
          </div>

          {selectedAllergiesList.length > 0 && (
            <p className={styles.allergiesText}>
              من غير: <strong>{selectedAllergiesList.join("، ")}</strong>
            </p>
          )}

          {prefs.notes && (
            <p className={styles.notesPreview}>
              ملاحظات: {prefs.notes}
            </p>
          )}
        </section>
      </div>

      {/* Final Action CTA */}
      <div className={styles.footerAction}>
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          loading={saving}
          onClick={handleFinish}
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
              <path d="m15 6-6 6 6 6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          يلا نشوف أكلة النهاردة
        </Button>
      </div>
    </div>
  );
}

