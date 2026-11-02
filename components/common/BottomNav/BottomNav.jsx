"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

const NAV_ITEMS = [
  {
    href: "/home",
    label: "الرئيسية",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/explore",
    label: "استكشفي",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="7" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/week",
    label: "الأسبوع",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="5" width="18" height="16" rx="3" strokeWidth="2" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/shopping",
    label: "المشتريات",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/favorites",
    label: "المفضلة",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.tabbar} aria-label="التنقل الرئيسي">
      <div className={styles.navInner}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.pill} aria-hidden="true">
                <span className={styles.iconWrapper}>{item.icon}</span>
              </span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

