import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ALL_EGYPTIAN_DISHES } from "../lib/data/dishes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

// Parse .env.local
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        env[key] = val;
      }
    }
  });
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("🚀 جاري بدء رفع الأكلات المصرية إلى Firestore...");
console.log(`📌 مشروع فايربيس: ${firebaseConfig.projectId}`);
console.log(`🍲 إجمالي الأكلات المراد رفعها: ${ALL_EGYPTIAN_DISHES.length} أكلة مصرية`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  const batchSize = 100;
  let totalUploaded = 0;

  for (let i = 0; i < ALL_EGYPTIAN_DISHES.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = ALL_EGYPTIAN_DISHES.slice(i, i + batchSize);

    chunk.forEach((dish) => {
      const docRef = doc(db, "dishes", dish.id);
      batch.set(docRef, dish, { merge: true });
    });

    console.log(`⏳ جاري رفع الدفعة ${i / batchSize + 1} (${chunk.length} أكلة)...`);
    await batch.commit();
    totalUploaded += chunk.length;
    console.log(`✅ تم رفع ${totalUploaded} من أصل ${ALL_EGYPTIAN_DISHES.length} أكلة.`);
  }

  console.log("🎉 تم رفع جميع الـ 110 أكلة مصرية بنجاح إلى Firestore داخل مجموعة 'dishes'!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ حدث خطأ أثناء الرفع:", err);
  process.exit(1);
});

