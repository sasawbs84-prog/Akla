import { CASSEROLES_DISHES } from "./casseroles.js";
import { STEWS_DISHES } from "./stews.js";
import { POULTRY_DISHES } from "./poultry.js";
import { MEAT_DISHES } from "./meat.js";
import { SEAFOOD_DISHES } from "./seafood.js";
import { MAHSHI_PASTRY_DISHES } from "./mahshiPastry.js";
import { POPULAR_BUDGET_DISHES } from "./popularBudget.js";

/**
 * قاعدة البيانات الشاملة: 110 أكلة مصرية أصيلة بالكامل
 */
export const ALL_EGYPTIAN_DISHES = [
  ...CASSEROLES_DISHES,
  ...STEWS_DISHES,
  ...POULTRY_DISHES,
  ...MEAT_DISHES,
  ...SEAFOOD_DISHES,
  ...MAHSHI_PASTRY_DISHES,
  ...POPULAR_BUDGET_DISHES,
];

export const DISH_CATEGORIES = [
  { id: "all", label: "كل الأكلات" },
  { id: "طواجن وصواني", label: "طواجن وصواني" },
  { id: "طبيخ وشوربات", label: "طبيخ وشوربة" },
  { id: "دواجن وطيور", label: "فراخ وطيور" },
  { id: "لحوم حمراء ومفروم", label: "لحوم ومفروم" },
  { id: "أسماك ومأكولات بحرية", label: "أسماك وبحريات" },
  { id: "محاشي ومعجنات", label: "محاشي ومعجنات" },
  { id: "شعبي واقتصادي", label: "شعبي واقتصادي" },
];

export {
  CASSEROLES_DISHES,
  STEWS_DISHES,
  POULTRY_DISHES,
  MEAT_DISHES,
  SEAFOOD_DISHES,
  MAHSHI_PASTRY_DISHES,
  POPULAR_BUDGET_DISHES,
};
