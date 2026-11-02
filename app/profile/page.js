"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePreferences } from "@/context/PreferencesContext";
import BottomNav from "@/components/common/BottomNav/BottomNav";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { prefs, data } = usePreferences();

  const [reminderOn, setReminderOn] = useState(true);
  const [reminderTime, setReminderTime] = useState("11:00 الصبح");
  const [toastMessage, setToastMessage] = useState("");

  const userName = user?.displayName || "شيف أكلة";
  const userEmail = user?.email || "حساب ضيف";
  const userInitial = userName.trim().charAt(0) || "أ";

  // Calculate selections count
  const proteinsCount = Object.keys(prefs.proteins || {}).length;
  const vegCount = Object.keys(prefs.vegetables || {}).length;
  const carbsCount = Object.keys(prefs.carbs || {}).length;
  const totalChoices = proteinsCount + vegCount + carbsCount;

  // Selected allergies
  const allergiesList = Object.keys(prefs.allergies || {})
    .filter((k) => prefs.allergies[k])
    .map((k) => data.allergies[k]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.contentWrap}>
        {toastMessage && (
          <div className={styles.toast} role="status">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top App Bar */}
        <header className={styles.appbar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => router.back()}
            aria-label="رجوع"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {/* RTL Back arrow points right */}
              <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className={styles.title}>حسابي</h1>
          <span className={styles.headerSpacer} />
        </header>

        {/* User Card */}
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            <span>{userInitial}</span>
          </div>
          <div className={styles.userMeta}>
            <h2 className={styles.userName}>{userName}</h2>
            <p className={styles.userEmail} dir="ltr">
              {userEmail}
            </p>
          </div>
        </div>

        {/* Preferences Group */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>تفضيلاتي الغذائية</h2>
          <div className={styles.listCard}>
            <Link href="/setup/summary" className={styles.listItem}>
              <span className={`${styles.itemLeadIcon} ${styles.leadTomato}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z" strokeWidth="2" />
                </svg>
              </span>
              <span className={styles.itemGrow}>الأكل اللي بحبه</span>
              <span className={styles.itemVal}>{totalChoices} اختيار</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" className={styles.itemChev}>
                <path d="m15 6-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link href="/setup/household" className={styles.listItem}>
              <span className={styles.itemLeadIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="8" r="3.5" strokeWidth="1.8" />
                  <path d="M2.5 20a6.5 6.5 0 0 1 13 0" strokeWidth="1.8" />
                  <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.itemGrow}>عدد أفراد الأسرة</span>
              <span className={styles.itemVal}>{prefs.people || 4} أفراد</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" className={styles.itemChev}>
                <path d="m15 6-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link href="/setup/household" className={styles.listItem}>
              <span className={styles.itemLeadIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path d="M5.6 5.6l12.8 12.8" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.itemGrow}>حاجات مش بنحبها وحساسية</span>
              <span className={styles.itemVal}>
                {allergiesList.length > 0 ? allergiesList.join("، ") : "مفيش"}
              </span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" className={styles.itemChev}>
                <path d="m15 6-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Notifications Group */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>التنبيهات اليومية</h2>
          <div className={styles.listCard}>
            <label className={styles.listItem} style={{ cursor: "pointer" }}>
              <span className={styles.itemLeadIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 20a2 2 0 0 0 4 0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={styles.itemGrow}>فكّريني باقتراح طبخة اليوم</span>
              <input
                type="checkbox"
                className={styles.switchInput}
                checked={reminderOn}
                onChange={() => {
                  setReminderOn((r) => !r);
                  showToast(!reminderOn ? "تم تفعيل التنبيه اليومي" : "تم إيقاف التنبيه اليومي");
                }}
              />
            </label>

            {reminderOn && (
              <button
                type="button"
                className={styles.listItemBtn}
                onClick={() => {
                  const times = ["10:00 الصبح", "11:00 الصبح", "12:00 الظهر", "1:00 الظهر"];
                  const nextIndex = (times.indexOf(reminderTime) + 1) % times.length;
                  setReminderTime(times[nextIndex]);
                  showToast(`تم ضبط موعد التنبيه الساعة ${times[nextIndex]}`);
                }}
              >
                <span className={styles.itemLeadIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                    <path d="M12 7v5l3 2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.itemGrow}>وقت التنبيه</span>
                <span className={styles.timeTag}>{reminderTime}</span>
              </button>
            )}
          </div>
        </section>

        {/* App Info Group */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>التطبيق</h2>
          <div className={styles.listCard}>
            <div className={styles.listItem}>
              <span className={styles.itemLeadIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.itemGrow}>اللغة</span>
              <span className={styles.itemVal}>العربية (مصر)</span>
            </div>

            <div className={styles.listItem}>
              <span className={styles.itemLeadIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.itemGrow}>المظهر</span>
              <span className={styles.itemVal}>فاتح (دافي)</span>
            </div>

            <div className={styles.listItem}>
              <span className={styles.itemLeadIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path d="M12 11v5M12 8h.01" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.itemGrow}>عن أكلة</span>
              <span className={styles.itemVal}>إصدار 1.0</span>
            </div>
          </div>
        </section>

        {/* Logout Button */}
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
            <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* RTL logout arrow points left */}
            <path d="M14 8l-4 4 4 4M10 12h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>تسجيل الخروج</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

