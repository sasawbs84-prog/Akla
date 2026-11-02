import Image from "next/image";
import styles from "./AuthHeader.module.css";

export default function AuthHeader({ mode = "login" }) {
  const isLogin = mode === "login";

  return (
    <div className={styles.header}>
      <div className={styles.logoWrapper}>
        <Image
          src="/assets/logo-mark.png"
          alt="شعار أكلة"
          width={96}
          height={96}
          priority
          className={styles.logo}
        />
      </div>
      <h1 className={styles.title}>أهلاً بيكي في أكلة</h1>
      <p className={styles.subtitle}>
        {isLogin
          ? "سجّلي دخولك عشان تتابعي أكلاتك اليومية واختياراتك المحفوظة."
          : "أنشئي حساب جديد وابدأي رحلة اقتراحات أكلات تناسب ذوقك كل يوم."}
      </p>
    </div>
  );
}

