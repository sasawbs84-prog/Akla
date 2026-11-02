"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button/Button";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.splashScreen}>
      <div className={styles.centerContent}>
        <div className={styles.logoWrapper}>
          <Image
            src="/assets/logo-mark.png"
            alt="شعار أكلة"
            width={180}
            height={180}
            priority
            className={styles.logo}
          />
        </div>

        <h1 className={styles.brandTitle}>أكلة</h1>
        <p className={styles.tagline}>هنطبخ إيه النهاردة؟</p>
        <p className={styles.subtagline}>
          اقتراحات يومية للأكلات والطبخات المناسبة لاختياراتك وتفضيلاتك.
        </p>
      </div>

      <div className={styles.bottomAction}>
        <Link href="/onboarding" style={{ width: "100%" }}>
          <Button variant="primary" size="lg" fullWidth>
            ابدأي الآن
          </Button>
        </Link>
      </div>
    </div>
  );
}
