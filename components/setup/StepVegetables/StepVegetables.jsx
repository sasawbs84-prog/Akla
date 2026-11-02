"use client";

import { usePreferences } from "@/context/PreferencesContext";
import SectionHeader from "@/components/setup/SectionHeader/SectionHeader";
import PickCard from "@/components/setup/PickCard/PickCard";
import styles from "../Steps.module.css";

export default function StepVegetables() {
  const { prefs, toggleItem, toggleGroup, data } = usePreferences();
  const selectedVeg = prefs.vegetables || {};

  const renderGroup = (key, title, items, phClass) => {
    const itemIds = items.map((i) => i.id);
    const allSelected = itemIds.length > 0 && itemIds.every((id) => !!selectedVeg[id]);
    const allLabel = items.length > 1 ? (allSelected ? "شيلي الكل" : "اختاري الكل") : null;

    return (
      <div key={key}>
        <SectionHeader
          title={title}
          allLabel={allLabel}
          onToggleAll={allLabel ? () => toggleGroup("vegetables", itemIds) : null}
        />
        <div className={styles.pickGrid}>
          {items.map((item) => (
            <PickCard
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              phClass={phClass}
              isSelected={!!selectedVeg[item.id]}
              onToggle={(id) => toggleItem("vegetables", id)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.headingArea}>
        <h1 className={styles.title}>خضار وبقوليات</h1>
        <p className={styles.subtitle}>إيه الخضار اللي بتطبخيها في بيتك؟ اختاري براحتك وبدون قيود.</p>
      </div>

      {renderGroup("veg", "خضروات", data.vegetables.veg, "ph2")}
      {renderGroup("leg", "بقوليات", data.vegetables.leg, "ph4")}
    </div>
  );
}

