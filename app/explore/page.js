"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/common/BottomNav/BottomNav";
import { MOCK_DISHES } from "@/lib/dishesData";
import styles from "./explore.module.css";

const CATEGORIES = ["الكل", "دواجن", "لحوم", "أسماك", "طواجن", "محاشي", "شعبي"];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [quickFilter, setQuickFilter] = useState(false); // <= 60 mins
  const [easyFilter, setEasyFilter] = useState(false); // level === 'سهلة'

  // Filtered dishes
  const filteredDishes = MOCK_DISHES.filter((dish) => {
    // Search query matches name, category, or tags
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchTag = dish.tags.some((t) => t.toLowerCase().includes(q));
      const matchDesc = dish.description.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchDesc) return false;
    }

    // Category filter
    if (selectedCategory !== "الكل") {
      const matchCat = dish.category === selectedCategory || dish.tags.includes(selectedCategory);
      if (!matchCat) return false;
    }

    // Quick filter (less than or equal to 60 mins)
    if (quickFilter && dish.cookTimeMinutes > 60) {
      return false;
    }

    // Easy level filter
    if (easyFilter && dish.level !== "سهلة") {
      return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("الكل");
    setQuickFilter(false);
    setEasyFilter(false);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.contentWrap}>
        {/* Header */}
        <header className={styles.appbar}>
          <h1 className={styles.title}>استكشفي الأكلات</h1>
        </header>

        {/* Search bar */}
        <div className={styles.searchBar}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="دوّري على أكلة، مكوّن، أو نوع وصفة…"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery("")}
              aria-label="مسح البحث"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className={styles.chipsRow} role="radiogroup" aria-label="فئات الأكل">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`${styles.chip} ${isSelected ? styles.chipActive : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Quick Attribute Chips */}
        <div className={styles.chipsRow}>
          <button
            type="button"
            className={`${styles.chip} ${quickFilter ? styles.chipActive : ""}`}
            onClick={() => setQuickFilter((q) => !q)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path d="M12 7v5l3 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>أقل من ساعة</span>
          </button>

          <button
            type="button"
            className={`${styles.chip} ${easyFilter ? styles.chipActive : ""}`}
            onClick={() => setEasyFilter((e) => !e)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <path d="M5 20v-5M12 20V10M19 20V4" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>سهلة بس</span>
          </button>
        </div>

        {/* Results Count Meta */}
        <div className={styles.resultsMeta}>
          <span>{filteredDishes.length} أكلات متوفرة</span>
          {(selectedCategory !== "الكل" || quickFilter || easyFilter || searchQuery) && (
            <button type="button" className={styles.resetLink} onClick={resetFilters}>
              مسح الفلاتر
            </button>
          )}
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length > 0 ? (
          <div className={styles.dishGrid}>
            {filteredDishes.map((dish) => (
              <Link key={dish.id} href={`/dish/${dish.id}`} className={styles.dishCard}>
                <div className={`${styles.dishCardPhoto} ${styles[dish.ph]}`}>
                  <span className={styles.cardEmoji}>{dish.emoji}</span>
                  <span className={styles.levelBadge}>{dish.level}</span>
                </div>
                <div className={styles.dishCardBody}>
                  <h3 className={styles.dishCardName}>{dish.name}</h3>
                  <div className={styles.cardMeta}>
                    <span>{dish.time}</span>
                    <span>·</span>
                    <span>{dish.calories} سعرة</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className={styles.noResults}>
            <div className={styles.emptyIconCircle}>
              <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                <path d="m20 20-3.5-3.5" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="8" y1="11" x2="14" y2="11" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={styles.noResultsTitle}>مفيش أكلة بالاسم ده</h3>
            <p className={styles.noResultsSub}>
              جربي كلمة تانية في البحث أو شيلي بعض الفلاتر عشان تشوفي وصفات أكتر.
            </p>
            <button type="button" className={styles.resetBtn} onClick={resetFilters}>
              عرض كل الأكلات
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

