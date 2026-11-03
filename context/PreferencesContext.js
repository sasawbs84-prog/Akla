"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// Master data definitions
export const SETUP_DATA = {
  proteins: {
    meat: [
      { id: "beef", label: "لحمة بقري", icon: "🥩" },
      { id: "lamb", label: "لحمة ضاني", icon: "🍖" },
      { id: "kofta", label: "كفتة", icon: "🍢" },
      { id: "minced", label: "لحمة مفرومة", icon: "🥣" },
      { id: "liver", label: "كبدة", icon: "🍳" },
    ],
    poultry: [
      { id: "chicken", label: "فراخ", icon: "🍗" },
      { id: "duck", label: "بط", icon: "🦆" },
      { id: "pigeon", label: "حمام", icon: "🕊️" },
    ],
    fish: [
      { id: "tilapia", label: "سمك بلطي", icon: "🐟" },
      { id: "mullet", label: "سمك بوري", icon: "🐡" },
      { id: "shrimp", label: "جمبري", icon: "🦐" },
    ],
    egg: [
      { id: "egg", label: "بيض", icon: "🥚" },
    ],
  },
  vegetables: {
    veg: [
      { id: "zucchini", label: "كوسة", icon: "🥒" },
      { id: "okra", label: "بامية", icon: "🌿" },
      { id: "eggplant", label: "باذنجان", icon: "🍆" },
      { id: "molokhia", label: "ملوخية", icon: "🍃" },
      { id: "spinach", label: "سبانخ", icon: "🥬" },
      { id: "cabbage", label: "كرنب", icon: "🥗" },
      { id: "vine", label: "ورق عنب", icon: "🍇" },
      { id: "greenbeans", label: "فاصوليا خضرا", icon: "🌱" },
      { id: "peas", label: "بسلة", icon: "🟢" },
      { id: "cauliflower", label: "قرنبيط", icon: "🥦" },
      { id: "pepper", label: "فلفل رومي", icon: "🫑" },
      { id: "carrot", label: "جزر", icon: "🥕" },
    ],
    leg: [
      { id: "fava", label: "فول", icon: "🧆" },
      { id: "lentils", label: "عدس", icon: "🥣" },
      { id: "whitebeans", label: "فاصوليا بيضا", icon: "🫘" },
      { id: "chickpeas", label: "حمص", icon: "🍲" },
      { id: "blackeyed", label: "لوبيا", icon: "⚪" },
    ],
  },
  carbs: {
    rice: [
      { id: "white", label: "أرز أبيض", icon: "🍚" },
      { id: "vermicelli", label: "أرز بالشعرية", icon: "🍜" },
      { id: "moammar", label: "أرز معمر", icon: "🏺" },
      { id: "pasta", label: "مكرونة", icon: "🍝" },
      { id: "bechamel", label: "مكرونة بشاميل", icon: "🧀" },
      { id: "koshari", label: "كشري", icon: "🍛" },
    ],
    bread: [
      { id: "potato", label: "بطاطس", icon: "🥔" },
      { id: "baladi", label: "عيش بلدي", icon: "🫓" },
      { id: "feteer", label: "فطير مشلتت", icon: "🥞" },
      { id: "roqaq", label: "رقاق", icon: "🥧" },
      { id: "sambousek", label: "سمبوسك", icon: "🥟" },
      { id: "fattah", label: "فتة", icon: "🍲" },
    ],
  },
  heats: [
    { id: "none", label: "مش حار خالص", hint: "مناسب للأطفال والجميع", chili: "من غير شطة" },
    { id: "mild", label: "حار شوية", hint: "شطة خفيفة ومظبوطة في التتبيلة", chili: "شطة ×1" },
    { id: "hot", label: "حار جامد", hint: "للي بيحبوا الشطة والأكل المسبك", chili: "شطة ×2" },
  ],
  spices: [
    "كمون", "كزبرة ناشفة", "بهارات مشكلة", "فلفل أسود",
    "حبهان", "ورق لورا", "شطة", "ثوم",
    "كزبرة خضرا", "شبت", "بقدونس", "نعناع"
  ],
  times: [
    "أقل من 30 دقيقة",
    "حوالي ساعة",
    "ساعة ونص أو أكتر",
    "مش فارقة"
  ],
  allergies: [
    "مكسرات",
    "لبن ومنتجاته",
    "جلوتين (قمح)",
    "بيض",
    "سمك وجمبري",
    "بصل"
  ],
};

const DEFAULT_PREFERENCES = {
  // Step 1: Default selected proteins
  proteins: { beef: true, kofta: true, minced: true, chicken: true, pigeon: true, tilapia: true, egg: true },
  // Step 2: Default selected vegetables & legumes
  vegetables: { zucchini: true, okra: true, molokhia: true, cabbage: true, vine: true, peas: true, eggplant: true, fava: true, lentils: true },
  // Step 3: Default carbs
  carbs: { white: true, vermicelli: true, pasta: true, bechamel: true, potato: true, baladi: true, fattah: true },
  // Step 4: Flavors & spices
  heat: "mild",
  spices: { 0: true, 1: true, 2: true, 3: true, 5: true, 7: true, 8: true, 10: true }, // indices in SETUP_DATA.spices
  // Step 5: Household details
  people: 4,
  cookingTime: "حوالي ساعة",
  allergies: { 0: true }, // 'مكسرات' by default as in design
  notes: "",
};

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load saved preferences on start (from LocalStorage or Firestore)
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Try local storage first
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("akla_preferences");
          if (cached) {
            setPrefs(JSON.parse(cached));
          }
        }

        // If user is authenticated, sync with Firestore
        if (user?.uid) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().preferences) {
            const firestorePrefs = userDoc.data().preferences;
            setPrefs((prev) => ({ ...prev, ...firestorePrefs }));
          }
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Toggle single item in a map field (proteins, vegetables, carbs, spices, allergies)
  const toggleItem = (category, id) => {
    setPrefs((prev) => {
      const currentMap = { ...(prev[category] || {}) };
      if (currentMap[id]) {
        delete currentMap[id];
      } else {
        currentMap[id] = true;
      }
      const updated = { ...prev, [category]: currentMap };
      if (typeof window !== "undefined") {
        localStorage.setItem("akla_preferences", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Toggle all items in a group (e.g. meat, poultry, veg, leg, spices)
  const toggleGroup = (category, itemIds) => {
    setPrefs((prev) => {
      const currentMap = { ...(prev[category] || {}) };
      const allSelected = itemIds.every((id) => !!currentMap[id]);

      if (allSelected) {
        // Deselect all in this group
        itemIds.forEach((id) => delete currentMap[id]);
      } else {
        // Select all in this group
        itemIds.forEach((id) => {
          currentMap[id] = true;
        });
      }

      const updated = { ...prev, [category]: currentMap };
      if (typeof window !== "undefined") {
        localStorage.setItem("akla_preferences", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Set primitive field (heat, people, cookingTime, notes)
  const updateField = (field, value) => {
    setPrefs((prev) => {
      const updated = { ...prev, [field]: value };
      if (typeof window !== "undefined") {
        localStorage.setItem("akla_preferences", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Save all preferences to Firestore Backend
  const savePreferencesToFirestore = async (customPrefs = null, markCompleted = true) => {
    setSaving(true);
    const prefsToSave = customPrefs || prefs;
    try {
      // Always cache in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("akla_preferences", JSON.stringify(prefsToSave));
        if (markCompleted) {
          localStorage.setItem("akla_hasCompletedOnboarding", "true");
        }
      }

      // Save to Firestore if user is signed in
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const payload = {
          preferences: prefsToSave,
          updatedAt: serverTimestamp(),
        };
        if (markCompleted) {
          payload.hasCompletedOnboarding = true;
        }
        await setDoc(userRef, payload, { merge: true });
      }
      return true;
    } catch (err) {
      console.error("Error saving preferences to Firestore:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        prefs,
        loading,
        saving,
        toggleItem,
        toggleGroup,
        updateField,
        savePreferencesToFirestore,
        data: SETUP_DATA,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};

