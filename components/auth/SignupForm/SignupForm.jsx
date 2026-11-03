"use client";

import { useState } from "react";
import Input from "@/components/common/Input/Input";
import Button from "@/components/common/Button/Button";
import { useAuth } from "@/context/AuthContext";
import { getFriendlyAuthErrorMessage } from "@/lib/authErrors";
import styles from "./SignupForm.module.css";

export default function SignupForm({ onSuccess }) {
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "يرجى كتابة اسمك أو اسم الشهرة";
    }

    if (!formData.email.trim()) {
      newErrors.email = "يرجى إدخال البريد الإلكتروني";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!formData.password) {
      newErrors.password = "يرجى إدخال كلمة المرور";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError("");

    try {
      const authResult = await signup(formData.email.trim(), formData.password, formData.name.trim());
      if (onSuccess) onSuccess(authResult);
    } catch (err) {
      const friendlyMsg = getFriendlyAuthErrorMessage(err.code);
      setGeneralError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {generalError && (
        <div className={styles.alertBox} role="alert">
          <svg className={styles.alertIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>{generalError}</span>
        </div>
      )}

      <Input
        id="signup-name"
        type="text"
        label="اسمك أو لقبك"
        placeholder="مثلاً: أم يوسف أو سارة"
        value={formData.name}
        onChange={handleChange("name")}
        error={errors.name}
        disabled={loading}
        required
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="7" r="4" strokeWidth="1.8" />
          </svg>
        }
      />

      <Input
        id="signup-email"
        type="email"
        label="البريد الإلكتروني"
        placeholder="cook@example.com"
        dir="ltr"
        value={formData.email}
        onChange={handleChange("email")}
        error={errors.email}
        disabled={loading}
        required
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
            <rect x="3" y="5" width="18" height="14" rx="3" strokeWidth="1.8" />
            <path d="m4 7 8 6 8-6" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />

      <Input
        id="signup-password"
        type="password"
        label="كلمة المرور"
        placeholder="•••••••• (6 خانات أو أكثر)"
        dir="ltr"
        value={formData.password}
        onChange={handleChange("password")}
        error={errors.password}
        disabled={loading}
        required
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
            <rect x="4" y="11" width="16" height="10" rx="3" strokeWidth="1.8" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />

      <Input
        id="signup-confirm-password"
        type="password"
        label="تأكيد كلمة المرور"
        placeholder="••••••••"
        dir="ltr"
        value={formData.confirmPassword}
        onChange={handleChange("confirmPassword")}
        error={errors.confirmPassword}
        disabled={loading}
        required
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      <Button type="submit" variant="primary" fullWidth size="md" loading={loading}>
        إنشاء الحساب
      </Button>
    </form>
  );
}

