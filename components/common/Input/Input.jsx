"use client";

import { useState } from "react";
import styles from "./Input.module.css";

export default function Input({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon,
  dir,
  disabled = false,
  required = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const computedType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={`${styles.inputContainer} ${error ? styles.hasError : ""} ${
          disabled ? styles.disabled : ""
        }`}
      >
        {icon && <span className={styles.leadingIcon}>{icon}</span>}

        <input
          id={id}
          type={computedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          dir={dir}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            className={styles.togglePasswordBtn}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            tabIndex={-1}
          >
            {showPassword ? (
              // Eye off icon
              <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              // Eye icon
              <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className={styles.errorMessage}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={styles.hintMessage}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

