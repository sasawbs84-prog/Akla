"use client";

import { useState } from "react";
import Button from "@/components/common/Button/Button";
import Divider from "@/components/common/Divider/Divider";
import { useAuth } from "@/context/AuthContext";
import { getFriendlyAuthErrorMessage } from "@/lib/authErrors";
import styles from "./SocialAuth.module.css";

export default function SocialAuth({ onSuccess }) {
  const { loginWithGoogle, loginAsGuest } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(getFriendlyAuthErrorMessage(err.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setError("");
    setGuestLoading(true);
    try {
      await loginAsGuest();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(getFriendlyAuthErrorMessage(err.code));
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className={styles.socialContainer}>
      {error && (
        <div className={styles.errorBanner} role="alert">
          <span>{error}</span>
        </div>
      )}

      <Divider label="أو" />

      {/* Google Login Button */}
      <Button
        type="button"
        variant="secondary"
        fullWidth
        size="md"
        loading={googleLoading}
        disabled={guestLoading}
        onClick={handleGoogleSignIn}
        icon={
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27a7.2 7.2 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        }
      >
        المتابعة بحساب جوجل
      </Button>

      {/* Guest Mode Button */}
      <Button
        type="button"
        variant="ghost"
        fullWidth
        size="md"
        loading={guestLoading}
        disabled={googleLoading}
        onClick={handleGuestSignIn}
        className={styles.guestBtn}
      >
        كمّلي كضيفة من غير تسجيل
      </Button>
    </div>
  );
}

