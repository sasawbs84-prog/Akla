"use client";

import styles from "./SectionHeader.module.css";

export default function SectionHeader({ title, allLabel, onToggleAll }) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.title}>{title}</h2>
      {allLabel && onToggleAll && (
        <button type="button" className={styles.toggleAllBtn} onClick={onToggleAll}>
          {allLabel}
        </button>
      )}
    </div>
  );
}

