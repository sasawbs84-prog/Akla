"use client";

import { usePreferences } from "@/context/PreferencesContext";
import SectionHeader from "@/components/setup/SectionHeader/SectionHeader";
import styles from "../Steps.module.css";

export default function StepFlavors() {
  const { prefs, updateField, toggleItem, data } = usePreferences();
  const currentHeat = prefs.heat || "mild";
  const selectedSpices = prefs.spices || {};

  const spiceIndices = data.spices.map((_, i) => i);
  const allSpicesSelected = spiceIndices.every((i) => !!selectedSpices[i]);

  const handleToggleAllSpices = () => {
    if (allSpicesSelected) {
      updateField("spices", {});
    } else {
      const allMap = {};
      spiceIndices.forEach((i) => {
        allMap[i] = true;
      });
      updateField("spices", allMap);
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.headingArea}>
        <h1 className={styles.title}>الطعم اللي بتحبوه</h1>
        <p className={styles.subtitle}>عشان نظبط لك التتبيلة ومستوى الحرارة على مزاجكم بالظبط.</p>
      </div>

      {/* Heat Level Radios */}
      <SectionHeader title="بتحبوا الأكل الحار؟" />
      <div className={styles.radioList} role="radiogroup" aria-label="مستوى الحرارة">
        {data.heats.map((h) => {
          const isSelected = currentHeat === h.id;
          return (
            <button
              key={h.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`${styles.heatCard} ${isSelected ? styles.heatCardSelected : ""}`}
              onClick={() => updateField("heat", h.id)}
            >
              <span
                className={`${styles.radioCircle} ${isSelected ? styles.radioCircleOn : ""}`}
                aria-hidden="true"
              />
              <div className={styles.heatInfo}>
                <span className={styles.heatLabel}>{h.label}</span>
                <span className={styles.heatHint}>{h.hint}</span>
              </div>
              <span className={styles.heatChiliTag}>{h.chili}</span>
            </button>
          );
        })}
      </div>

      {/* Spices Multi-Select Chips */}
      <SectionHeader
        title="توابل وأعشاب بتستخدميها"
        allLabel={allSpicesSelected ? "شيلي الكل" : "اختاري الكل"}
        onToggleAll={handleToggleAllSpices}
      />
      <div className={styles.chipsContainer}>
        {data.spices.map((spiceName, index) => {
          const isSelected = !!selectedSpices[index];
          return (
            <button
              key={index}
              type="button"
              className={`${styles.chipBtn} ${isSelected ? styles.chipBtnOn : ""}`}
              onClick={() => toggleItem("spices", index)}
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
              <span>{spiceName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

