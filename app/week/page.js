"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/common/BottomNav/BottomNav";
import { MOCK_DISHES } from "@/lib/dishesData";
import styles from "./week.module.css";

const DAYS_TEMPLATE = [
  { day: "السبت", date: "31", dishIndex: 0, done: true, today: false },
  { day: "الحد", date: "1", dishIndex: 1, done: true, today: false },
  { day: "الإتنين", date: "2", dishIndex: 2, done: false, today: true },
  { day: "التلات", date: "3", dishIndex: 3, done: false, today: false },
  { day: "الأربع", date: "4", dishIndex: 4, done: false, today: false },
  { day: "الخميس", date: "5", dishIndex: 5, done: false, today: false },
  { day: "الجمعة", date: "6", dishIndex: 6, done: false, today: false },
];

export default function WeeklyPlanPage() {
  const [days, setDays] = useState(DAYS_TEMPLATE);
  const [weekOffset, setWeekOffset] = useState(0);

  const cookedCount = days.filter((d) => d.done).length;
  const percentage = Math.round((cookedCount / days.length) * 100);

  const toggleDone = (index) => {
    setDays((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], done: !copy[index].done };
      return copy;
    });
  };

  const swapDayDish = (index) => {
    setDays((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        dishIndex: (copy[index].dishIndex + 1) % MOCK_DISHES.length,
      };
      return copy;
    });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.contentWrap}>
        {/* Header */}
        <header className={styles.appbar}>
          <div className={styles.titleWrap}>
            <h1 className={styles.title}>خطة الأسبوع</h1>
            <p className={styles.subtitle}>
              {weekOffset === 0
                ? "الأسبوع الحالي · 31 أكتوبر – 6 نوفمبر"
                : weekOffset > 0
                ? `الأسبوع القادم (+${weekOffset})`
                : `الأسبوع السابق (${weekOffset})`}
            </p>
          </div>

          <div className={styles.weekNav}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setWeekOffset((w) => w - 1)}
              aria-label="الأسبوع اللي فات"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {/* RTL prev week points right */}
                <path d="m9 6 6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setWeekOffset((w) => w + 1)}
              aria-label="الأسبوع الجاي"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {/* RTL next week points left */}
                <path d="m15 6-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </header>

        {/* Progress Card */}
        <div className={styles.progressCard}>
          <div className={styles.progressTextRow}>
            <span className={styles.progressText}>
              طبختي <strong>{cookedCount}</strong> من 7 أكلات الأسبوع ده
            </span>
            <span className={styles.progressPct}>{percentage}%</span>
          </div>
          <div className={styles.progressBar} role="progressbar" aria-valuenow={percentage}>
            <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {/* Days List */}
        <div className={styles.daysList}>
          {days.map((d, index) => {
            const dish = MOCK_DISHES[d.dishIndex % MOCK_DISHES.length];
            return (
              <article
                key={index}
                className={`${styles.dayCard} ${d.today ? styles.todayCard : ""} ${
                  d.done ? styles.dayDone : ""
                }`}
              >
                {/* Date block */}
                <div className={styles.dateBlock}>
                  <span className={styles.dayName}>{d.day}</span>
                  <span className={styles.dateNum}>{d.date}</span>
                </div>

                {/* Dish thumbnail */}
                <Link
                  href={`/dish/${dish.id}`}
                  className={`${styles.dishThumb} ${styles[dish.ph]}`}
                  aria-label={dish.name}
                >
                  <span className={styles.thumbEmoji}>{dish.emoji}</span>
                </Link>

                {/* Dish info */}
                <div className={styles.dishInfo}>
                  {d.today && <span className={styles.todayPill}>النهاردة</span>}
                  <Link href={`/dish/${dish.id}`} className={styles.dishTitleLink}>
                    <h3 className={styles.dishTitle}>{dish.name}</h3>
                  </Link>
                  <span className={styles.dishMeta}>{dish.time}</span>
                </div>

                {/* Swap button */}
                <button
                  type="button"
                  className={styles.swapBtn}
                  onClick={() => swapDayDish(index)}
                  aria-label={`تغيير أكلة ${d.day}`}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 4v4h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 20v-4h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Cooked Checkbox */}
                <label className={styles.checkWrap} aria-label={`تم طبخها يوم ${d.day}`}>
                  <input
                    type="checkbox"
                    className={styles.dayCheckbox}
                    checked={d.done}
                    onChange={() => toggleDone(index)}
                  />
                </label>
              </article>
            );
          })}
        </div>

        {/* CTA Button to Shopping */}
        <Link href="/shopping" className={styles.shoppingLink}>
          <button type="button" className={styles.shoppingCtaBtn}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
              <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>جهّزي مشتريات الأسبوع</span>
          </button>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}

