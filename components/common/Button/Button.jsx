"use client";

import styles from "./Button.module.css";

export default function Button({
  children,
  type = "button",
  variant = "primary", // primary | secondary | tonal | ghost
  size = "md", // sm | md | lg
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  icon,
  className = "",
  ...props
}) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    loading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

