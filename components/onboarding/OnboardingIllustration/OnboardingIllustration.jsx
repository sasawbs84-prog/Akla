"use client";

import styles from "./OnboardingIllustration.module.css";

export default function OnboardingIllustration({ step = 0 }) {
  if (step === 0) {
    // Step 1: Dish plate illustration with fresh herbs & ingredients
    return (
      <div className={`${styles.illuWrapper} ${styles.illuStep1}`} aria-hidden="true">
        <div className={styles.circleBg}>
          {/* Main Dish Plate */}
          <div className={styles.dishPlate}>
            <div className={styles.dishInner}>
              <svg className={styles.dishIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="5" strokeWidth="1.8" />
                <path d="M12 9v1.5M12 13.5V15M9.5 12H11M13 12h1.5" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Floating Herb Leaf - Top Right */}
          <div className={`${styles.floatingElement} ${styles.leafTop}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.leafIcon}>
              <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 19 13 11" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Floating Sparkle / Spice - Bottom Left */}
          <div className={`${styles.floatingElement} ${styles.spiceBottom}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.spiceIcon}>
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>

          {/* Floating preference tags for visual depth */}
          <div className={`${styles.floatingTag} ${styles.tagRight}`}>
            <span>🥩 دجاج ولحوم</span>
          </div>
          <div className={`${styles.floatingTag} ${styles.tagLeft}`}>
            <span>🥗 خضار طازة</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    // Step 2: Recipe ingredients card with portions
    return (
      <div className={`${styles.illuWrapper} ${styles.illuStep2}`} aria-hidden="true">
        <div className={styles.circleBg}>
          {/* Recipe Card */}
          <div className={styles.recipeCard}>
            <div className={styles.cardHeader}>
              <span className={styles.portionTag}>4 أفراد</span>
              <span className={styles.cardSubtitle}>المقادير</span>
            </div>

            <div className={styles.ingredientList}>
              <div className={styles.ingredientItem}>
                <span className={styles.checkDone}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.ingredientName}>ملوخية خضرا</span>
                <span className={styles.ingredientQty}>500 جم</span>
              </div>

              <div className={styles.ingredientItem}>
                <span className={styles.checkDone}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.ingredientName}>ثوم مفروم</span>
                <span className={styles.ingredientQty}>8 فصوص</span>
              </div>

              <div className={styles.ingredientItem}>
                <span className={styles.checkPending} />
                <span className={styles.ingredientName}>سمنة بلدي</span>
                <span className={styles.ingredientQty}>2 معلقة</span>
              </div>
            </div>
          </div>

          {/* Floating Fresh Herb */}
          <div className={`${styles.floatingElement} ${styles.leafGreen}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.leafIcon}>
              <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 19 13 11" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className={`${styles.floatingTag} ${styles.tagStepTimer}`}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>تحضير 25 دقيقة</span>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 (3rd slide): Weekly meal planner & shopping list
  return (
    <div className={`${styles.illuWrapper} ${styles.illuStep3}`} aria-hidden="true">
      <div className={styles.circleBg}>
        {/* Weekly Grid */}
        <div className={styles.weekGrid}>
          <div className={styles.dayTile}>
            <span className={styles.dayLabel}>سبت</span>
            <div className={`${styles.dayPhoto} ${styles.ph1}`}>
              <span>🍲</span>
            </div>
          </div>

          <div className={`${styles.dayTile} ${styles.todayTile}`}>
            <span className={styles.dayTodayLabel}>حد</span>
            <div className={`${styles.dayPhoto} ${styles.ph2}`}>
              <span>🍗</span>
            </div>
          </div>

          <div className={styles.dayTile}>
            <span className={styles.dayLabel}>اتنين</span>
            <div className={`${styles.dayPhoto} ${styles.ph3}`}>
              <span>🐟</span>
            </div>
          </div>

          <div className={styles.dayTile}>
            <span className={styles.dayLabel}>تلات</span>
            <div className={`${styles.dayPhoto} ${styles.ph4}`}>
              <span>🍝</span>
            </div>
          </div>

          <div className={styles.dayTile}>
            <span className={styles.dayLabel}>أربع</span>
            <div className={`${styles.dayPhoto} ${styles.ph5}`}>
              <span>🥘</span>
            </div>
          </div>

          <div className={styles.shoppingTile}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.cartIcon}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
              <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.cartLabel}>المشتريات</span>
          </div>
        </div>

        {/* WhatsApp Pill */}
        <div className={`${styles.floatingTag} ${styles.whatsappPill}`}>
          <span>💬 قائمة واتساب جاهزة</span>
        </div>
      </div>
    </div>
  );
}

