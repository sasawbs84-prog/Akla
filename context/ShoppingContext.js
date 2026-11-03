"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const ShoppingContext = createContext(null);

const CATEGORY_MAP = {
  veg: { id: "veg", title: "خضار وفاكهة", dotClass: "dotGreen" },
  meat: { id: "meat", title: "لحوم ودواجن وأسماك", dotClass: "dotTomato" },
  spices: { id: "spices", title: "عطارة وبقوليات ونشويات", dotClass: "dotSaffron" },
  other: { id: "other", title: "طلبات ومستلزمات أخرى", dotClass: "dotSaffron" },
};

function categorizeIngredient(name) {
  const n = (name || "").toLowerCase();

  // Meat / Poultry / Fish
  if (/فرخة|فراخ|لحم|كفتة|سمك|جمبري|بانيه|سجق|كبد|بط|حمام|أرانب|عكاوي|كوارع|مخ|مفروم/.test(n)) {
    return "meat";
  }

  // Veg & Fruits
  if (/طماطم|بصل|ثوم|توم|خضار|بامية|ملوخية|كوسة|بطاطس|ليمون|جزر|بسلة|فلفل|باذنجان|شبت|بقدونس|كزبرة خضرا|سبانخ|كرنب|سلق|خبيزة|قلقاس|قرنبيط/.test(n)) {
    return "veg";
  }

  // Spices & Staples & Carbs
  if (/أرز|رز|مكرونة|عدس|فول|حمص|فريك|دقيق|سمنة|زيت|كمون|بهارات|كزبرة|شعرية|فلفل أسود|لبن|حليب|قشطة|زبادي|جبن|جبنة|عيش|جلاش|رقاق|سكر|ملح|نشا|بيكنج/.test(n)) {
    return "spices";
  }

  return "other";
}

const DEFAULT_SHOPPING_ITEMS = [
  { id: "s-1", name: "ملوخية خضرا بلدي", qty: "500 جرام", category: "veg", done: false },
  { id: "s-2", name: "بامية فلاحي صغيرة", qty: "1 كيلو", category: "veg", done: false },
  { id: "s-3", name: "طماطم بلدي للسلطة والطبخ", qty: "2 كيلو", category: "veg", done: true },
  { id: "s-4", name: "بصل أحمر خزين", qty: "1 كيلو", category: "veg", done: false },
  { id: "s-5", name: "ثوم بلدي", qty: "2 رأس", category: "veg", done: false },
  { id: "s-6", name: "فرخة بلدي متوسطة", qty: "1.5 كيلو", category: "meat", done: false },
  { id: "s-7", name: "لحمة كندوز مكعبات", qty: "1 كيلو", category: "meat", done: true },
  { id: "s-8", name: "سمك بلطي طازة", qty: "4 سمكات", category: "meat", done: false },
  { id: "s-9", name: "أرز مصري حبة رفيعة", qty: "2 كيلو", category: "spices", done: false },
  { id: "s-10", name: "شعرية مكرونة", qty: "1 كيس", category: "spices", done: true },
  { id: "s-11", name: "كزبرة جافة مطحونة", qty: "100 جرام", category: "spices", done: false },
  { id: "s-12", name: "سمنة بلدي بقري", qty: "برطمان", category: "spices", done: false },
];

function getInitialShoppingItems() {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("akla_shopping");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
  }
  return DEFAULT_SHOPPING_ITEMS;
}

export function ShoppingProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(getInitialShoppingItems);
  const [loading, setLoading] = useState(false);

  // Subscribe to Firestore shoppingList in real-time
  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    const colRef = collection(db, "users", user.uid, "shoppingList");

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          setItems(list);
          if (typeof window !== "undefined") {
            localStorage.setItem("akla_shopping", JSON.stringify(list));
          }
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Shopping list Firestore listener error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Group items by category for the UI
  const groups = [
    {
      ...CATEGORY_MAP.veg,
      items: items.filter((it) => it.category === "veg"),
    },
    {
      ...CATEGORY_MAP.meat,
      items: items.filter((it) => it.category === "meat"),
    },
    {
      ...CATEGORY_MAP.spices,
      items: items.filter((it) => it.category === "spices"),
    },
    {
      ...CATEGORY_MAP.other,
      items: items.filter((it) => it.category === "other" || !it.category),
    },
  ].filter((g) => g.items.length > 0);

  const totalCount = items.length;
  const leftCount = items.filter((it) => !it.done).length;

  // Add single item
  const addItem = async ({ name, qty = "1", category = null, dishName = null }) => {
    if (!name || !name.trim()) return;
    const cat = category || categorizeIngredient(name);
    const tempId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem = {
      id: tempId,
      name: name.trim(),
      qty: qty || "1",
      category: cat,
      done: false,
      dishName: dishName || null,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI
    setItems((prev) => [newItem, ...prev]);

    // Sync to Firestore
    if (user?.uid) {
      try {
        const colRef = collection(db, "users", user.uid, "shoppingList");
        const docRef = await addDoc(colRef, {
          name: newItem.name,
          qty: newItem.qty,
          category: newItem.category,
          done: false,
          dishName: newItem.dishName,
          createdAt: serverTimestamp(),
        });
        // Replace tempId with real Firestore ID
        setItems((prev) =>
          prev.map((it) => (it.id === tempId ? { ...it, id: docRef.id } : it))
        );
      } catch (err) {
        console.error("Error adding shopping item to Firestore:", err);
      }
    }
  };

  // Toggle item done status
  const toggleItem = async (itemId) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const newDone = !target.done;

    // Optimistic update
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, done: newDone } : it))
    );

    // Sync to Firestore
    if (user?.uid && !itemId.startsWith("local-") && !itemId.startsWith("s-")) {
      try {
        const docRef = doc(db, "users", user.uid, "shoppingList", itemId);
        await updateDoc(docRef, { done: newDone });
      } catch (err) {
        console.error("Error toggling item in Firestore:", err);
      }
    }
  };

  // Remove single item
  const removeItem = async (itemId) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));

    if (user?.uid && !itemId.startsWith("local-") && !itemId.startsWith("s-")) {
      try {
        const docRef = doc(db, "users", user.uid, "shoppingList", itemId);
        await deleteDoc(docRef);
      } catch (err) {
        console.error("Error deleting shopping item from Firestore:", err);
      }
    }
  };

  // Clear all done items
  const clearDone = async () => {
    const doneItems = items.filter((it) => it.done);
    setItems((prev) => prev.filter((it) => !it.done));

    if (user?.uid) {
      try {
        const batch = writeBatch(db);
        doneItems.forEach((it) => {
          if (!it.id.startsWith("local-") && !it.id.startsWith("s-")) {
            const docRef = doc(db, "users", user.uid, "shoppingList", it.id);
            batch.delete(docRef);
          }
        });
        await batch.commit();
      } catch (err) {
        console.error("Error clearing done items from Firestore:", err);
      }
    }
  };

  // Add missing ingredients from recipe detail page
  const addMissingIngredients = async (ingredients = [], dishName = "") => {
    if (!ingredients || ingredients.length === 0) return 0;

    const newItems = ingredients.map((ing) => ({
      id: `local-${Date.now()}-${ing.id || Math.random()}`,
      name: ing.name,
      qty: ing.unit ? `${ing.baseQty || ""} ${ing.unit}`.trim() : "1",
      category: categorizeIngredient(ing.name),
      done: false,
      dishName: dishName || null,
      createdAt: new Date().toISOString(),
    }));

    // Optimistic update
    setItems((prev) => [...newItems, ...prev]);

    // Batch add to Firestore
    if (user?.uid) {
      try {
        const batch = writeBatch(db);
        const colRef = collection(db, "users", user.uid, "shoppingList");

        newItems.forEach((it) => {
          const newDocRef = doc(colRef);
          batch.set(newDocRef, {
            name: it.name,
            qty: it.qty,
            category: it.category,
            done: false,
            dishName: dishName || null,
            createdAt: serverTimestamp(),
          });
        });

        await batch.commit();
      } catch (err) {
        console.error("Error batch adding missing ingredients to Firestore:", err);
      }
    }

    return newItems.length;
  };

  return (
    <ShoppingContext.Provider
      value={{
        items,
        groups,
        totalCount,
        leftCount,
        loading,
        addItem,
        toggleItem,
        removeItem,
        clearDone,
        addMissingIngredients,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error("useShopping must be used within a ShoppingProvider");
  }
  return context;
};
