import styles from "./Divider.module.css";

export default function Divider({ label = "أو" }) {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.line} />
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.line} />
    </div>
  );
}

