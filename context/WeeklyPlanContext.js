"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { usePreferences } from "@/context/PreferencesContext";
import { MOCK_DISHES } from "@/lib/dishesData";
import { getRecommendedDishes } from "@/lib/recommendationEngine";

const WeeklyPlanContext = createContext(null);

const DEFAULT_DAYS_TEMPLATE = [
  { day: "السبت", date: "31", dishId: "molokhia-chicken", done: true, today: false },
  { day: "الحد", date: "1", dishId: "potato-meat-tray", done: true, today: false },
  { day: "الإتنين", date: "2", dishId: "tilapia-fried-sayadieh", done: false, today: true },
  { day: "التلات", date: "3", dishId: "koshari-masry-original", done: false, today: false },
  { day: "الأربع", date: "4", dishId: "bechamel-pasta", done: false, today: false },
  { day: "الخميس", date: "5", dishId: "mahshi-cabbage-baladi", done: false, today: false },
  { day: "الجمعة", date: "6", dishId: "grilled-chicken-hati", done: false, today: false },
];

function getInitialWeeklyDays(weekOffset = 0) {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(`akla_week_${weekOffset}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
  }
  return DEFAULT_DAYS_TEMPLATE;
}

export function WeeklyPlanProvider({ children }) {
  const { user } = useAuth();
  const { prefs } = usePreferences();
  const [days, setDays] = useState(() => getInitialWeeklyDays(0));
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  // Recommendations pool
  const recommendedDishes = useMemo(() => getRecommendedDishes(MOCK_DISHES, prefs), [prefs]);
  const dishPool = useMemo(
    () => (recommendedDishes.length >= 7 ? recommendedDishes : MOCK_DISHES),
    [recommendedDishes]
  );

  // Subscribe to Firestore weeklyPlan
  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    const planDocRef = doc(db, "users", user.uid, "weeklyPlan", `offset_${weekOffset}`);

    const unsubscribe = onSnapshot(
      planDocRef,
      (docSnap) => {
        if (docSnap.exists() && Array.isArray(docSnap.data().days)) {
          setDays(docSnap.data().days);
          if (typeof window !== "undefined") {
            localStorage.setItem(`akla_week_${weekOffset}`, JSON.stringify(docSnap.data().days));
          }
        } else {
          // Document does not exist yet: initialize with smart recommendations and save to Firestore
          initAndSavePlan();
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Weekly plan Firestore listener error:", err);
        setLoading(false);
      }
    );

    async function initAndSavePlan() {
      // Pick 7 balanced dishes from recommendations
      const initialDays = DEFAULT_DAYS_TEMPLATE.map((templateDay, idx) => {
        const dish = dishPool[idx % dishPool.length];
        return {
          ...templateDay,
          dishId: dish?.id || templateDay.dishId,
          done: false,
        };
      });

      setDays(initialDays);

      if (user?.uid) {
        try {
          const ref = doc(db, "users", user.uid, "weeklyPlan", `offset_${weekOffset}`);
          await setDoc(ref, {
            weekOffset,
            days: initialDays,
            updatedAt: serverTimestamp(),
          });
        } catch (e) {
          console.error("Error saving initial weekly plan to Firestore:", e);
        }
      }
    }

    return () => unsubscribe();
  }, [user, weekOffset, dishPool]);

  const cookedCount = days.filter((d) => d.done).length;
  const percentage = Math.round((cookedCount / Math.max(1, days.length)) * 100);

  // Toggle done status for a day
  const toggleDayCooked = async (index) => {
    const updatedDays = days.map((day, idx) => {
      if (idx !== index) return day;
      return { ...day, done: !day.done };
    });

    setDays(updatedDays);

    if (typeof window !== "undefined") {
      localStorage.setItem(`akla_week_${weekOffset}`, JSON.stringify(updatedDays));
    }

    if (user?.uid) {
      try {
        const planDocRef = doc(db, "users", user.uid, "weeklyPlan", `offset_${weekOffset}`);
        await setDoc(
          planDocRef,
          {
            days: updatedDays,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error saving day cooked state to Firestore:", err);
      }
    }
  };

  // Swap dish for a day
  const swapDayDish = async (index) => {
    const currentDay = days[index];
    const currentIndex = dishPool.findIndex((d) => d.id === currentDay.dishId);
    const nextIndex = (currentIndex + 1) % dishPool.length;
    const nextDish = dishPool[nextIndex];

    const updatedDays = days.map((day, idx) => {
      if (idx !== index) return day;
      return {
        ...day,
        dishId: nextDish.id,
      };
    });

    setDays(updatedDays);

    if (typeof window !== "undefined") {
      localStorage.setItem(`akla_week_${weekOffset}`, JSON.stringify(updatedDays));
    }

    if (user?.uid) {
      try {
        const planDocRef = doc(db, "users", user.uid, "weeklyPlan", `offset_${weekOffset}`);
        await setDoc(
          planDocRef,
          {
            days: updatedDays,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error saving swapped dish to Firestore:", err);
      }
    }
  };

  return (
    <WeeklyPlanContext.Provider
      value={{
        days,
        weekOffset,
        setWeekOffset,
        cookedCount,
        percentage,
        loading,
        toggleDayCooked,
        swapDayDish,
        dishPool,
      }}
    >
      {children}
    </WeeklyPlanContext.Provider>
  );
}

export const useWeeklyPlan = () => {
  const context = useContext(WeeklyPlanContext);
  if (!context) {
    throw new Error("useWeeklyPlan must be used within a WeeklyPlanProvider");
  }
  return context;
};
