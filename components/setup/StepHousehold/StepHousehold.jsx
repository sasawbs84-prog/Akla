"use client";

import { usePreferences } from "@/context/PreferencesContext";
import SectionHeader from "@/components/setup/SectionHeader/SectionHeader";
import styles from "../Steps.module.css";

export default function StepHousehold() {
  const { prefs, updateField, toggleItem, data } = usePreferences();
  const people = prefs.people || 4;
  const currentCookingTime = prefs.cookingTime || "حوالي ساعة";
  const selectedAllergies = prefs.allergies || {};
  const notes = prefs.notes || "";

  const handleIncrement = () => {
    updateField("people", Math.min(12, people + 1));
  };

  const handleDecrement = () => {
    updateField("people", Math.max(1, people - 1));
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.headingArea}>
        <h1 className={styles.title}>تفاصيل البيت</h1>
        <p className={styles.subtitle}>عشان المقادير تيجي على قدّكم بالظبط بدون هدر أو نقص.</p>
      </div>

      {/* Household Size Stepper */}
      <div className={styles.householdCard}>
        <span className={styles.householdIconLead}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="9" cy="8" r="3.5" strokeWidth="1.8" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0" strokeWidth="1.8" />
            <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <div className={styles.householdInfo}>
          <p className={styles.householdTitle}>عدد أفراد الأسرة</p>
          <p className={styles.householdSubtitle}>بما فيهم الأطفال</p>
        </div>
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepperBtn}
            onClick={handleDecrement}
            aria-label="تقليل فرد"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
          <output className={styles.stepperOutput} aria-live="polite">
            {people}
          </output>
          <button
            type="button"
            className={styles.stepperBtn}
            onClick={handleIncrement}
            aria-label="زيادة فرد"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cooking Time */}
      <SectionHeader title="وقت الطبخ المتاح في اليوم" />
      <div className={styles.timeGrid} role="radiogroup" aria-label="وقت الطبخ المتاح">
        {data.times.map((timeOption, idx) => {
          const isSelected = currentCookingTime === timeOption;
          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`${styles.chipBtn} ${styles.timeChip} ${
                isSelected ? styles.chipBtnOn : ""
              }`}
              onClick={() => updateField("cookingTime", timeOption)}
            >
              {timeOption}
            </button>
          );
        })}
      </div>

      {/* Allergies & Dislikes */}
      <SectionHeader title="حاجات مش بتحبوها أو حساسية" />
      <p className={styles.subtitle} style={{ marginTop: "-8px", marginBottom: "12px" }}>
        مش هنقترح أي طبخة يدخل فيها أي صنف من دول.
      </p>
      <div className={styles.chipsContainer}>
        {data.allergies.map((allergy, idx) => {
          const isSelected = !!selectedAllergies[idx];
          return (
            <button
              key={idx}
              type="button"
              className={`${styles.chipBtn} ${isSelected ? styles.chipBtnOn : ""}`}
              onClick={() => toggleItem("allergies", idx)}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={styles.chipCheckSvg}
                >
                  <path d="m5 12.5 4.5 4.5L19 7.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span>{allergy}</span>
            </button>
          );
        })}
      </div>

      {/* Notes Textarea */}
      <SectionHeader title="ملاحظات إضافية" />
      <textarea
        id="household-notes"
        className={styles.notesTextarea}
        value={notes}
        onChange={(e) => updateField("notes", e.target.value)}
        placeholder="مثلاً: مش بناكل بصل، الأولاد بيفضلوا الأكل الخفيف، بنحب الأكل المشوي أكثر..."
      />
    </div>
  );
}

