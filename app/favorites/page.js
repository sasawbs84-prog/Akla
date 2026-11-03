"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/common/BottomNav/BottomNav";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./favorites.module.css";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [toastMessage, setToastMessage] = useState("");

  const handleRemove = async (dishId, dishName) => {
    await removeFavorite(dishId);
    setToastMessage(`تمت إزالة "${dishName}" من المفضلة`);
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

        {/* Top Header */}
        <header className={styles.appbar}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>المفضلة</h1>
            <p className={styles.subtitle}>
              {favorites.length > 0
                ? `${favorites.length} أكلات محفوظة في حسابك`
                : "قائمتك خالية"}
            </p>
          </div>
        </header>

        {/* Favorites List or Empty State */}
        {favorites.length > 0 ? (
          <div className={styles.favoritesList}>
            {favorites.map(({ dish, lastCooked }) => (
              <article key={dish.id} className={styles.dishRow}>
                {/* Thumbnail */}
                <Link
                  href={`/dish/${dish.id}`}
                  className={`${styles.dishThumb} ${styles[dish.ph] || styles.ph1}`}
                  aria-label={dish.name}
                >
                  <span className={styles.thumbEmoji}>{dish.emoji}</span>
                </Link>

                {/* Body info */}
                <Link href={`/dish/${dish.id}`} className={styles.dishInfo}>
                  <h2 className={styles.dishName}>{dish.name}</h2>
                  <div className={styles.metaRow}>
                    <span>{dish.time}</span>
                    <span>·</span>
                    <span>{dish.level}</span>
                  </div>
                  <span className={styles.historyTag}>{lastCooked}</span>
                </Link>

                {/* Remove heart button */}
                <button
                  type="button"
                  className={styles.removeFavBtn}
                  onClick={() => handleRemove(dish.id, dish.name)}
                  aria-label={`شيلي ${dish.name} من المفضلة`}
                  title="إزالة من المفضلة"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor">
                    <path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className={styles.emptyState}>
            <div className={styles.emptyIconCircle}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor">
                <path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z" strokeWidth="1.8" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>لسه مفيش أكلات في المفضلة</h3>
            <p className={styles.emptySub}>
              اضغطي على علامة القلب في أي أكلة بتعجبك عشان تحفظيها هنا وترجعيلها بسهولة.
            </p>
            <Link href="/explore" className={styles.exploreBtn}>
              استكشفي أكلات جديدة
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

