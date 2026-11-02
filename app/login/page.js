"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader/AuthHeader";
import AuthTabs from "@/components/auth/AuthTabs/AuthTabs";
import LoginForm from "@/components/auth/LoginForm/LoginForm";
import SignupForm from "@/components/auth/SignupForm/SignupForm";
import SocialAuth from "@/components/auth/SocialAuth/SocialAuth";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");

  const handleAuthSuccess = () => {
    // Navigate to preferences setup or home
    router.push("/setup/proteins");
  };

  return (
    <div className={styles.screen}>
      {/* Top App Bar */}
      <header className={styles.appbar}>
        <Link href="/" className={styles.backBtn} aria-label="رجوع">
          <svg className={styles.backIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {/* RTL back arrow points to the right */}
            <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </header>

      {/* Main Content Area */}
      <div className={styles.scrollArea}>
        <AuthHeader mode={activeTab} />

        <AuthTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className={styles.formContainer}>
          {activeTab === "login" ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} />
          )}
        </div>

        <SocialAuth onSuccess={handleAuthSuccess} />

        {/* Footer Terms */}
        <p className={styles.termsText}>
          بالمتابعة إنتي موافقة على{" "}
          <Link href="#terms" className={styles.termsLink}>
            الشروط وسياسة الخصوصية
          </Link>
        </p>
      </div>
    </div>
  );
}

