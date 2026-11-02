"use client";

import { usePreferences } from "@/context/PreferencesContext";
import SectionHeader from "@/components/setup/SectionHeader/SectionHeader";
import PickCard from "@/components/setup/PickCard/PickCard";
import styles from "../Steps.module.css";

export default function StepCarbs() {
  const { prefs, toggleItem, toggleGroup, data } = usePreferences();
  const selectedCarbs = prefs.carbs || {};

  const renderGroup = (key, title, items, phClass) => {
    const itemIds = items.map((i) => i.id);
    const allSelected = itemIds.length > 0 && itemIds.every((id) => !!selectedCarbs[id]);
    const allLabel = items.length > 1 ? (allSelected ? "شيلي الكل" : "اختاري الكل") : null;

    return (
      <div key={key}>
        <SectionHeader
          title={title}
          allLabel={allLabel}
          onToggleAll={allLabel ? () => toggleGroup("carbs", itemIds) : null}
        />
        <div className={styles.pickGrid}>
          {items.map((item) => (
            <PickCard
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              phClass={phClass}
              isSelected={!!selectedCarbs[item.id]}
              onToggle={(id) => toggleItem("carbs", id)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.headingArea}>
        <h1 className={styles.title}>النشويات</h1>
        <p className={styles.subtitle}>إيه اللي بيتقدّم جنب الأكل الرئيسي عندكم؟</p>
      </div>

      {renderGroup("rice", "أرز ومكرونة", data.carbs.rice, "ph3")}
      {renderGroup("bread", "بطاطس وعجين ومخبوزات", data.carbs.bread, "ph6")}
    </div>
  );
}

