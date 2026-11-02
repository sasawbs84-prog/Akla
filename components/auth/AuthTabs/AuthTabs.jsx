"use client";

import styles from "./AuthTabs.module.css";

export default function AuthTabs({ activeTab, onChange }) {
  return (
    <div className={styles.segmentedContainer} role="tablist" aria-label="نوع تسجيل الدخول">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "login"}
        className={`${styles.tabButton} ${activeTab === "login" ? styles.active : ""}`}
        onClick={() => onChange("login")}
      >
        تسجيل الدخول
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "signup"}
        className={`${styles.tabButton} ${activeTab === "signup" ? styles.active : ""}`}
        onClick={() => onChange("signup")}
      >
        حساب جديد
      </button>
    </div>
  );
}

