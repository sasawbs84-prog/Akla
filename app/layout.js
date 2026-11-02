import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";

export const metadata = {
  title: "أكلة — طبخة كل يوم على مزاجك",
  description: "اقتراحات يومية للأكلات والطبخات المناسبة لتفضيلاتك والمكونات اللي بتحبيها.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <PreferencesProvider>
            <div className="app-shell">{children}</div>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
