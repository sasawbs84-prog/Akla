export default function manifest() {
  return {
    name: "أكلة — طبخة كل يوم على مزاجك",
    short_name: "أكلة",
    description: "اقتراحات يومية للأكلات المصرية، تنظيم خطة الأسبوع وقائمة المشتريات",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF7F2",
    theme_color: "#C2461B",
    dir: "rtl",
    lang: "ar",
    categories: ["food", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "طبخة النهاردة",
        short_name: "الرئيسية",
        description: "شوفي اقتراح أكلة النهاردة",
        url: "/home",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "خطة الأسبوع",
        short_name: "الأسبوع",
        description: "جدول وجبات الأسبوع",
        url: "/week",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "قائمة المشتريات",
        short_name: "المشتريات",
        description: "مستلزمات ومقادير الأكلات",
        url: "/shopping",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "المفضلة",
        short_name: "المفضلة",
        description: "أكلاتك المفضلة المحفوظة",
        url: "/favorites",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}

