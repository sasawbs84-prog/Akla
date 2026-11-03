"use client";

import { useState } from "react";
import BottomNav from "@/components/common/BottomNav/BottomNav";
import { useShopping } from "@/context/ShoppingContext";
import styles from "./shopping.module.css";

export default function ShoppingListPage() {
  const { groups, totalCount, leftCount, loading, addItem, toggleItem, clearDone } = useShopping();
  const [draftInput, setDraftInput] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!draftInput.trim()) return;

    const nameToAdd = draftInput.trim();
    setDraftInput("");
    await addItem({ name: nameToAdd });
    showToast(`تمت إضافة "${nameToAdd}" للقائمة`);
  };

  const handleClearDone = async () => {
    await clearDone();
    showToast("تم مسح الطلبات المشتراة بنجاح!");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleShareWhatsApp = () => {
    const lines = ["📋 *قائمة طلبات أكلة:*"];
    groups.forEach((g) => {
      const activeItems = g.items.filter((i) => !i.done);
      if (activeItems.length > 0) {
        lines.push(`\n*${g.title}:*`);
        activeItems.forEach((it) => {
          lines.push(`• ${it.name} (${it.qty})`);
        });
      }
    });

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/?text=${text}`, "_blank");
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
            <h1 className={styles.title}>المشتريات</h1>
            <p className={styles.subtitle}>
              {totalCount > 0
                ? `فاضل ${leftCount} من ${totalCount} طلب`
                : "القائمة خالية تماماً"}
            </p>
          </div>

          {totalCount > 0 && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleClearDone}
              aria-label="امسحي الطلبات المشتراة"
              title="امسحي اللي اتشترى"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </header>

        {/* Quick Add Bar */}
        <form onSubmit={handleAddItem} className={styles.addBar}>
          <div className={styles.inputWrap}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" className={styles.plusIcon}>
              <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="ضيفي طلب… مثلاً: كيس عيش بلدي"
              className={styles.addInput}
              value={draftInput}
              onChange={(e) => setDraftInput(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.addBtn}>
            ضيفي
          </button>
        </form>

        {/* Groups List */}
        {totalCount > 0 ? (
          <div className={styles.groupsContainer}>
            {groups.map((group) => {
              if (group.items.length === 0) return null;
              const pendingItemsCount = group.items.filter((i) => !i.done).length;

              return (
                <section key={group.id} className={styles.groupSection}>
                  <div className={styles.groupHeader}>
                    <span className={`${styles.dot} ${styles[group.dotClass]}`} />
                    <h2 className={styles.groupTitle}>{group.title}</h2>
                    <span className={styles.groupCount}>({pendingItemsCount})</span>
                  </div>

                  <div className={styles.itemsCard}>
                    {group.items.map((item) => (
                      <label
                        key={item.id}
                        className={`${styles.itemRow} ${item.done ? styles.itemDone : ""}`}
                      >
                        <input
                          type="checkbox"
                          className={styles.itemCheckbox}
                          checked={item.done}
                          onChange={() => toggleItem(item.id)}
                        />
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQty}>{item.qty}</span>
                      </label>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className={styles.emptyState}>
            <div className={styles.emptyIllu}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor">
                <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z" strokeWidth="1.8" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeWidth="1.8" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>قائمة المشتريات فاضية!</h3>
            <p className={styles.emptySub}>
              اشتريتي كل الطلبات أو لسه مفيش أكلات أضفتيها للمشتريات.
            </p>
          </div>
        )}

        {/* WhatsApp Share Button */}
        {totalCount > 0 && (
          <div className={styles.shareActionWrap}>
            <button
              type="button"
              className={styles.whatsappBtn}
              onClick={handleShareWhatsApp}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
                <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>ابعتي القائمة على واتساب</span>
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
