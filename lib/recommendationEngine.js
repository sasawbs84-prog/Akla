/**
 * محرك ترشيح الأكلات الذكي لتطبيق أكلة (Akla Recommendation Engine)
 * يرشح الأكلات المصرية بناءً على تفضيلات المستخدم المحددة في معالج الإعداد (Onboarding / Setup).
 */

export function scoreDish(dish, prefs) {
  if (!prefs) {
    return {
      score: 75,
      matchPercentage: 75,
      reasons: ["أكلة مصرية محبوبة في كل بيت"],
      isMatch: true,
    };
  }

  const {
    proteins = {},
    vegetables = {},
    carbs = {},
    heat = "mild",
    allergies = [],
    time = "مش فارقة",
  } = prefs;

  const criteria = dish.matchCriteria || {};
  const dishAllergies = criteria.allergies || [];
  const dishProteins = criteria.proteins || [];
  const dishVegetables = criteria.vegetables || [];
  const dishCarbs = criteria.carbs || [];
  const dishHeat = criteria.heat || "mild";
  const cookTime = dish.cookTimeMinutes || 45;

  // 1. Strict Allergy Check: If user has an allergy to any ingredient in the dish, disqualify
  if (Array.isArray(allergies) && allergies.length > 0) {
    const hasAllergen = allergies.some((allergy) => dishAllergies.includes(allergy));
    if (hasAllergen) {
      return {
        score: -1,
        matchPercentage: 0,
        reasons: ["تحتوي على مسببات حساسية محددة لديك"],
        isMatch: false,
      };
    }
  }

  let rawScore = 30; // base score
  const matchedReasons = [];

  // 2. Protein Matching (Weight: 30 pts)
  const matchedProteins = dishProteins.filter((p) => proteins[p]);
  if (matchedProteins.length > 0) {
    rawScore += 30;
    matchedReasons.push("البروتين المفضل لديك");
  } else if (dishProteins.includes("none")) {
    rawScore += 15; // vegetable/budget dish
  }

  // 3. Vegetable Matching (Weight: 25 pts)
  const matchedVegs = dishVegetables.filter((v) => vegetables[v]);
  if (matchedVegs.length > 0) {
    rawScore += 25;
    matchedReasons.push("الخضار المفضل");
  }

  // 4. Carbs Matching (Weight: 20 pts)
  const matchedCarbs = dishCarbs.filter((c) => carbs[c]);
  if (matchedCarbs.length > 0) {
    rawScore += 20;
    matchedReasons.push("نوع النشويات المحبب");
  }

  // 5. Heat Level Matching (Weight: 10 pts)
  if (heat === "none") {
    if (dishHeat === "none") {
      rawScore += 10;
    } else if (dishHeat === "hot") {
      rawScore -= 20; // severe penalty for very spicy when user dislikes heat
    }
  } else if (heat === "hot") {
    if (dishHeat === "hot") {
      rawScore += 12;
      matchedReasons.push("حار ومتبل كما تفضل");
    } else if (dishHeat === "mild") {
      rawScore += 8;
    }
  } else {
    // mild
    if (dishHeat === "mild" || dishHeat === "none") {
      rawScore += 8;
    }
  }

  // 6. Time Budget Matching (Weight: 10 pts)
  if (time === "أقل من 30 دقيقة") {
    if (cookTime <= 35) {
      rawScore += 12;
      matchedReasons.push("سريعة (أقل من نصف ساعة)");
    } else if (cookTime > 60) {
      rawScore -= 10;
    }
  } else if (time === "حوالي ساعة") {
    if (cookTime >= 35 && cookTime <= 75) {
      rawScore += 10;
    }
  } else {
    rawScore += 8;
  }

  // Calculate percentage (bounded between 60% and 99%)
  const percentage = Math.min(99, Math.max(60, Math.round((rawScore / 105) * 100)));

  // Generate pleasant user-facing reason
  let reasonText = "تناسب تفضيلاتك الغذائية";
  if (matchedReasons.length > 0) {
    reasonText = `تناسب ذوقك: ${matchedReasons.slice(0, 3).join(" · ")}`;
  }

  return {
    score: rawScore,
    matchPercentage: percentage,
    reasons: matchedReasons,
    reasonText,
    isMatch: rawScore >= 50,
  };
}

/**
 * دالة ترشيح الأكلات للمستخدم:
 * ترتب قائمة الأكلات بالكامل تنازلياً حسب نسبة التوافق مع تفضيلات المستخدم
 */
export function getRecommendedDishes(dishes = [], prefs = {}) {
  if (!dishes || dishes.length === 0) return [];

  const scored = dishes
    .map((dish) => {
      const match = scoreDish(dish, prefs);
      return {
        ...dish,
        matchScore: match.score,
        matchPercentage: match.matchPercentage,
        matchReasons: match.reasons,
        matchText: match.reasonText,
        isAllergenFree: match.score >= 0,
      };
    })
    .filter((d) => d.isAllergenFree);

  // Sort by highest match percentage first
  scored.sort((a, b) => b.matchPercentage - a.matchPercentage || b.matchScore - a.matchScore);

  return scored;
}

/**
 * دالة استخراج طبخة اليوم وبدائلها المقترحة
 */
export function getTodayRecommendation(dishes = [], prefs = {}, currentIndex = 0) {
  const recommended = getRecommendedDishes(dishes, prefs);

  if (recommended.length === 0) {
    return {
      todayDish: dishes[0] || null,
      alternatives: dishes.slice(1, 5),
      totalRecommended: dishes.length,
    };
  }

  const safeIndex = currentIndex % recommended.length;
  const todayDish = recommended[safeIndex];

  // Pick 4 diverse alternatives from the top recommendations
  const alternatives = [];
  for (let offset = 1; offset <= 4; offset++) {
    const altIndex = (safeIndex + offset) % recommended.length;
    alternatives.push(recommended[altIndex]);
  }

  return {
    todayDish,
    alternatives,
    totalRecommended: recommended.length,
    allRecommended: recommended,
  };
}

