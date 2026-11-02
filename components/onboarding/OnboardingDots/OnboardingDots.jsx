"use client";

import styles from "./OnboardingDots.module.css";

export default function OnboardingDots({ total = 3, current = 0, onSelect }) {
  return (
    <div
      className={styles.dotsContainer}
      role="tablist"
      aria-label={`شريحة ${current + 1} من ${total}`}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = current === index;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
            className={`${styles.dot} ${isActive ? styles.activeDot : ""}`}
            onClick={() => onSelect && onSelect(index)}
          />
        );
      })}
    </div>
  );
}

