"use client";

import styles from "./PickCard.module.css";

export default function PickCard({
  id,
  label,
  icon,
  phClass = "ph1", // ph1 (terracotta) | ph2 (green) | ph3 (saffron) | ph4 (soft) | ph5 (fish) | ph6 (bread)
  isSelected = false,
  onToggle,
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      className={`${styles.pickCard} ${isSelected ? styles.selected : ""}`}
      onClick={() => onToggle(id)}
    >
      {/* Checkmark Badge */}
      <span className={styles.badge} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.checkIcon}>
          <path d="m5 12.5 4.5 4.5L19 7.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Circle Icon / Illustration */}
      <span className={`${styles.iconCircle} ${styles[phClass]}`} aria-hidden="true">
        <span className={styles.emojiIcon}>{icon}</span>
      </span>

      {/* Label */}
      <span className={styles.label}>{label}</span>
    </button>
  );
}

