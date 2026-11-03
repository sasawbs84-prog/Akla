"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthHeader from "@/components/auth/AuthHeader/AuthHeader";
import AuthTabs from "@/components/auth/AuthTabs/AuthTabs";
import LoginForm from "@/components/auth/LoginForm/LoginForm";
import SignupForm from "@/components/auth/SignupForm/SignupForm";
import SocialAuth from "@/components/auth/SocialAuth/SocialAuth";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, checkOnboardingStatus } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // If user is already authenticated and has completed onboarding, go to home
  useEffect(() => {
    if (!loading && user) {
      checkOnboardingStatus(user.uid).then((hasCompleted) => {
        if (hasCompleted) {
          router.replace("/home");
        }
      });
    }
  }, [user, loading, router, checkOnboardingStatus]);

  const handleAuthSuccess = async (authResult) => {
    // 1. If auth response indicates onboarding is already completed, go to home
    if (authResult?.hasCompletedOnboarding) {
      router.push("/home");
      return;
    }

    // 2. Double check Firestore document for existing preferences
    const uid = authResult?.user?.uid || user?.uid;
    if (uid) {
      const isComplete = await checkOnboardingStatus(uid);
      if (isComplete) {
        router.push("/home");
        return;
      }
    }

    // 3. Otherwise, for new users without preferences, go to setup wizard
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

