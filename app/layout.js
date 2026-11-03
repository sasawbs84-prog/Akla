import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ShoppingProvider } from "@/context/ShoppingContext";
import { WeeklyPlanProvider } from "@/context/WeeklyPlanContext";
import PwaRegistration from "@/components/common/PwaRegistration/PwaRegistration";

export const viewport = {
  themeColor: "#C2461B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata = {
  title: "أكلة — طبخة كل يوم على مزاجك",
  description: "اقتراحات يومية للأكلات والطبخات المناسبة لتفضيلاتك والمكونات اللي بتحبيها.",
  applicationName: "أكلة",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "أكلة",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <PreferencesProvider>
            <FavoritesProvider>
              <ShoppingProvider>
                <WeeklyPlanProvider>
                  <div className="app-shell">{children}</div>
                  <PwaRegistration />
                </WeeklyPlanProvider>
              </ShoppingProvider>
            </FavoritesProvider>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
