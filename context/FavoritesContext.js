"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { MOCK_DISHES } from "@/lib/dishesData";

const FavoritesContext = createContext(null);

const DEFAULT_LOCAL_FAVORITES = [
  { dishId: "molokhia-chicken", lastCooked: "اتطبخت آخر مرة من 3 أيام", timesCooked: 4 },
  { dishId: "potato-meat-tray", lastCooked: "اتطبخت آخر مرة من 10 أيام", timesCooked: 2 },
  { dishId: "bechamel-pasta", lastCooked: "لسه متطبختش", timesCooked: 0 },
  { dishId: "koshari-masry-original", lastCooked: "اتطبخت الأسبوع اللي فات", timesCooked: 5 },
];

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favoritesList, setFavoritesList] = useState([]);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore favorites in real-time or fallback to localStorage
  useEffect(() => {
    let unsubscribe = () => {};

    if (user?.uid) {
      const favColRef = collection(db, "users", user.uid, "favorites");

      unsubscribe = onSnapshot(
        favColRef,
        (snapshot) => {
          const items = [];
          const map = {};

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const dish = MOCK_DISHES.find((d) => d.id === docSnap.id) || {
              id: docSnap.id,
              name: data.dishName || docSnap.id,
              ph: "ph1",
              emoji: "🍲",
              time: "45 دقيقة",
              level: "متوسطة",
            };

            let lastCookedLabel = "لسه متطبختش";
            if (data.lastCooked) {
              lastCookedLabel = "اتطبخت مؤخراً";
            }

            items.push({
              dishId: docSnap.id,
              dish,
              lastCooked: lastCookedLabel,
              timesCooked: data.timesCooked || 0,
              addedAt: data.addedAt,
            });
            map[docSnap.id] = true;
          });

          setFavoritesList(items);
          setFavoritesMap(map);
          setLoading(false);

          // Cache in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("akla_favorites", JSON.stringify(map));
          }
        },
        (err) => {
          console.warn("Favorites Firestore listener error, using local fallback:", err);
          loadLocalFallback();
        }
      );
    } else {
      loadLocalFallback();
    }

    function loadLocalFallback() {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("akla_favorites");
        if (cached) {
          try {
            const map = JSON.parse(cached);
            setFavoritesMap(map);
            const items = Object.keys(map)
              .filter((id) => map[id])
              .map((id) => {
                const dish = MOCK_DISHES.find((d) => d.id === id) || MOCK_DISHES[0];
                return {
                  dishId: id,
                  dish,
                  lastCooked: "محفوظة محلياً",
                  timesCooked: 0,
                };
              });
            setFavoritesList(items);
          } catch {
            setFavoritesList(DEFAULT_LOCAL_FAVORITES);
          }
        } else {
          // Initialize with default suggestions
          const initialItems = DEFAULT_LOCAL_FAVORITES.map((f) => ({
            ...f,
            dish: MOCK_DISHES.find((d) => d.id === f.dishId) || MOCK_DISHES[0],
          }));
          const initialMap = {};
          initialItems.forEach((it) => (initialMap[it.dishId] = true));
          setFavoritesList(initialItems);
          setFavoritesMap(initialMap);
        }
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, [user]);

  const isFavorite = (dishId) => {
    return !!favoritesMap[dishId];
  };

  const toggleFavorite = async (dish) => {
    if (!dish || !dish.id) return false;
    const currentlyFav = !!favoritesMap[dish.id];
    const newStatus = !currentlyFav;

    // Optimistic UI update
    setFavoritesMap((prev) => {
      const copy = { ...prev };
      if (newStatus) {
        copy[dish.id] = true;
      } else {
        delete copy[dish.id];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("akla_favorites", JSON.stringify(copy));
      }
      return copy;
    });

    setFavoritesList((prev) => {
      if (newStatus) {
        return [
          {
            dishId: dish.id,
            dish,
            lastCooked: "لسه متطبختش",
            timesCooked: 0,
          },
          ...prev,
        ];
      } else {
        return prev.filter((it) => it.dishId !== dish.id);
      }
    });

    // Sync to Firestore
    if (user?.uid) {
      try {
        const favDocRef = doc(db, "users", user.uid, "favorites", dish.id);
        if (newStatus) {
          await setDoc(favDocRef, {
            dishId: dish.id,
            dishName: dish.name,
            addedAt: serverTimestamp(),
            timesCooked: 0,
            lastCooked: null,
          });
        } else {
          await deleteDoc(favDocRef);
        }
      } catch (err) {
        console.error("Error updating favorite in Firestore:", err);
      }
    }

    return newStatus;
  };

  const removeFavorite = async (dishId) => {
    const dish = MOCK_DISHES.find((d) => d.id === dishId) || { id: dishId };
    return toggleFavorite(dish);
  };

  const recordDishCooked = async (dishId) => {
    if (!dishId) return;

    // If user signed in, record in Firestore
    if (user?.uid) {
      try {
        const favDocRef = doc(db, "users", user.uid, "favorites", dishId);
        await setDoc(
          favDocRef,
          {
            dishId,
            lastCooked: serverTimestamp(),
            timesCooked: increment(1),
          },
          { merge: true }
        );

        // Also record in user's cooking history collection
        const histColRef = doc(collection(db, "users", user.uid, "history"));
        await setDoc(histColRef, {
          dishId,
          cookedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Error recording dish cooked in Firestore:", err);
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: favoritesList,
        favoritesMap,
        loading,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        recordDishCooked,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
