"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePreferences } from "@/context/PreferencesContext";
import { MOCK_DISHES } from "@/lib/dishesData";
import BottomNav from "@/components/common/BottomNav/BottomNav";
import Button from "@/components/common/Button/Button";
import styles from "./home.module.css";

// Client-safe formatted date subscription (avoids prerendering and hydration mismatch in Next.js)
const noopSubscribe = () => () => {};
const getClientDate = () => {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
  } catch {
    return "اليوم";
  }
};
const getServerDate = () => "طبخة اليوم";

export default function HomePage() {
  const { user } = useAuth();
  const { prefs } = usePreferences();

  const [dishIndex, setDishIndex] = useState(0);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  const currentDish = MOCK_DISHES[dishIndex % MOCK_DISHES.length];
  const isFav = !!favoritesMap[currentDish.id];

  // 4 alternative suggestions
  const alternatives = [1, 2, 3, 4].map(
    (offset) => MOCK_DISHES[(dishIndex + offset) % MOCK_DISHES.length]
  );

  const toggleFavorite = (id, dishName) => {
    setFavoritesMap((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const statusText = updated[id] ? "اتحفظت في المفضلة" : "اتشالت من المفضلة";
      showToast(`${dishName}: ${statusText}`);
      return updated;
    });
  };

  const handleSwapDish = () => {
    setDishIndex((prev) => prev + 1);
    showToast("اقترحنا لك طبخة تانية تناسب تفضيلاتك!");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const userName = user?.displayName || "شيف أكلة";
  const userInitial = userName.trim().charAt(0) || "أ";
  const peopleCount = prefs.people || currentDish.defaultServings || 4;

  const todayDateStr = useSyncExternalStore(noopSubscribe, getClientDate, getServerDate);

  return (
    <div className={styles.screen}>
      <div className={styles.contentWrap}>
        {/* Toast notification */}
        {toastMessage && (
          <div className={styles.toast} role="status">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top App Bar */}
        <header className={styles.appbar}>
          <Link href="/profile" className={styles.avatarBtn} aria-label="حسابي">
            <span>{userInitial}</span>
          </Link>

          <div className={styles.headerInfo}>
            <p className={styles.dateLabel}>{todayDateStr}</p>
            <h1 className={styles.greeting}>صباح الخير يا {userName}</h1>
          </div>

          <button
            type="button"
            className={styles.notificationBtn}
            aria-label="التنبيهات"
            onClick={() => showToast("أكلة النهاردة جاهزة للاقتراح!")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 20a2 2 0 0 0 4 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        {/* Section Heading */}
        <div className={styles.headingRow}>
          <h2 className={styles.mainHeading}>هنطبخ إيه النهاردة؟</h2>
        </div>

        {/* Hero Card for Today's Dish */}
        <article className={styles.heroCard}>
          {/* Photo banner */}
          <div className={`${styles.photoArea} ${styles[currentDish.ph]}`}>
            <span className={styles.dishEmojiBig}>{currentDish.emoji}</span>
            <span className={styles.photoCaption}>صورة: {currentDish.name}</span>

            {/* Badges & Actions over photo */}
            <span className={styles.todayTag}>أكلة النهاردة</span>

            <button
              type="button"
              className={`${styles.photoFavBtn} ${isFav ? styles.isFav : ""}`}
              onClick={() => toggleFavorite(currentDish.id, currentDish.name)}
              aria-label={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              <svg viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor">
                <path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className={styles.heroBody}>
            <div className={styles.tagsRow}>
              {currentDish.tags.map((t, i) => (
                <span key={i} className={styles.dishTag}>{t}</span>
              ))}
            </div>

            <h3 className={styles.dishName}>{currentDish.name}</h3>
            <p className={styles.dishDesc}>{currentDish.description}</p>

            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path d="M12 7v5l3 2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {currentDish.time}
              </span>

              <span className={styles.metaItem}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <circle cx="9" cy="8" r="3.5" strokeWidth="1.8" />
                  <path d="M2.5 20a6.5 6.5 0 0 1 13 0" strokeWidth="1.8" />
                  <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {peopleCount} أفراد
              </span>

              <span className={styles.metaItem}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <path d="M5 20v-5M12 20V10M19 20V4" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {currentDish.level}
              </span>
            </div>

            {/* Buttons */}
            <div className={styles.actionButtons}>
              <Link href={`/dish/${currentDish.id}`} className={styles.primaryLink}>
                <Button variant="primary" size="md" fullWidth>
                  شوف الأكلة
                </Button>
              </Link>

              <button
                type="button"
                className={styles.swapBtn}
                onClick={handleSwapDish}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                  <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 4v4h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 20v-4h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>غيّر الأكلة</span>
              </button>
            </div>
          </div>
        </article>

        {/* Section: Other suggestions */}
        <section className={styles.sectionArea}>
          <div className={styles.secHead}>
            <h3 className={styles.secTitle}>اقتراحات تانية ليكي</h3>
            <Link href="/explore" className={styles.viewAllBtn}>
              الكل
            </Link>
          </div>

          <div className={styles.miniCarousel}>
            {alternatives.map((altDish) => (
              <Link
                key={altDish.id}
                href={`/dish/${altDish.id}`}
                className={styles.miniCard}
              >
                <div className={`${styles.miniPhoto} ${styles[altDish.ph]}`}>
                  <span className={styles.miniEmoji}>{altDish.emoji}</span>
                </div>
                <div className={styles.miniBody}>
                  <h4 className={styles.miniName}>{altDish.name}</h4>
                  <span className={styles.miniMeta}>
                    {altDish.time} · {altDish.level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Weekly banner */}
        <Link href="/week" className={styles.weekBanner}>
          <span className={styles.weekIconBox}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor">
              <rect x="3" y="5" width="18" height="16" rx="3" strokeWidth="2" />
              <path d="M3 10h18M8 3v4M16 3v4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <div className={styles.weekText}>
            <p className={styles.weekTitle}>تحبي تطبخي إيه بكرة؟</p>
            <p className={styles.weekSubtitle}>مقترح: بامية باللحمة · خطّطي أسبوعك بالكامل</p>
          </div>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" className={styles.weekChev}>
            {/* RTL next points left */}
            <path d="m15 6-6 6 6 6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Bottom Tab Navigation */}
      <BottomNav />
    </div>
  );
}
