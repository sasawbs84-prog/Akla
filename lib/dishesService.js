import { collection, doc, getDocs, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ALL_EGYPTIAN_DISHES, MOCK_DISHES } from "@/lib/dishesData";

const COLLECTION_NAME = "dishes";

/**
 * جلب جميع الأكلات من Firestore مع وجود Fallback تلقائي للبيانات المحلية
 */
export async function fetchDishes() {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      const dishes = [];
      snapshot.forEach((d) => {
        dishes.push({ id: d.id, ...d.data() });
      });
      return dishes;
    }
  } catch (err) {
    console.warn("Firestore dishes fetch failed, falling back to local dataset:", err);
  }

  // Graceful fallback to local rich master dataset
  return ALL_EGYPTIAN_DISHES;
}

/**
 * جلب تفاصيل أكلة واحدة بالـ ID
 */
export async function fetchDishById(dishId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, dishId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn(`Firestore dish fetch failed for ${dishId}:`, err);
  }

  // Fallback to local
  return MOCK_DISHES.find((d) => d.id === dishId) || MOCK_DISHES[0];
}

/**
 * دالة رفع ومزامنة جميع الـ 110 أكلة إلى Firestore في دفعة واحدة (Batch Write)
 */
export async function seedDishesToFirestore(onProgress) {
  const dishes = ALL_EGYPTIAN_DISHES;
  const batchSize = 100; // Firestore supports up to 500 ops per batch
  let totalUploaded = 0;

  for (let i = 0; i < dishes.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = dishes.slice(i, i + batchSize);

    chunk.forEach((dish) => {
      const docRef = doc(db, COLLECTION_NAME, dish.id);
      batch.set(docRef, dish, { merge: true });
    });

    await batch.commit();
    totalUploaded += chunk.length;

    if (typeof onProgress === "function") {
      onProgress({
        uploaded: totalUploaded,
        total: dishes.length,
        percentage: Math.round((totalUploaded / dishes.length) * 100),
      });
    }
  }

  return { success: true, count: totalUploaded };
}

