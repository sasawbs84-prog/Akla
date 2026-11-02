"use client";

import { usePreferences } from "@/context/PreferencesContext";
import SectionHeader from "@/components/setup/SectionHeader/SectionHeader";
import PickCard from "@/components/setup/PickCard/PickCard";
import styles from "../Steps.module.css";

export default function StepProteins() {
  const { prefs, toggleItem, toggleGroup, data } = usePreferences();
  const selectedProteins = prefs.proteins || {};

  const renderGroup = (key, title, items, phClass) => {
    const itemIds = items.map((i) => i.id);
    const allSelected = itemIds.length > 0 && itemIds.every((id) => !!selectedProteins[id]);
    const allLabel = items.length > 1 ? (allSelected ? "شيلي الكل" : "اختاري الكل") : null;

    return (
      <div key={key}>
        <SectionHeader
          title={title}
          allLabel={allLabel}
          onToggleAll={allLabel ? () => toggleGroup("proteins", itemIds) : null}
        />
        <div className={styles.pickGrid}>
          {items.map((item) => (
            <PickCard
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              phClass={phClass}
              isSelected={!!selectedProteins[item.id]}
              onToggle={(id) => toggleItem("proteins", id)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.headingArea}>
        <h1 className={styles.title}>بتحبي إيه من البروتين؟</h1>
        <p className={styles.subtitle}>اختاري كل اللي بيتطبخ في بيتك. وتقدري تغيّري ده في أي وقت.</p>
      </div>

      {renderGroup("meat", "لحوم", data.proteins.meat, "ph1")}
      {renderGroup("poultry", "دواجن", data.proteins.poultry, "ph3")}
      {renderGroup("fish", "أسماك وجمبري", data.proteins.fish, "ph5")}
      {renderGroup("egg", "بيض", data.proteins.egg, "ph3")}
    </div>
  );
}

