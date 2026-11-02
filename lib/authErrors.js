/**
 * تحويل أكواد أخطاء Firebase إلى رسائل واضحة ومفهومة باللهجة المصرية / العربية
 */
export function getFriendlyAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case "auth/invalid-email":
      return "صيغة البريد الإلكتروني غير صحيحة، يرجى التأكد منه.";
    case "auth/user-disabled":
      return "تم تعطيل هذا الحساب. يرجى التواصل مع الدعم الفني.";
    case "auth/user-not-found":
      return "البريد الإلكتروني ده مش مسجل عندنا، يمكنك إنشاء حساب جديد.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "بيانات الدخول غير صحيحة، اتأكدي من الإيميل وكلمة المرور وجرّبي تاني.";
    case "auth/email-already-in-use":
      return "البريد الإلكتروني ده مسجل بالفعل، يمكنك تسجيل الدخول بدلاً من ذلك.";
    case "auth/weak-password":
      return "كلمة المرور ضعيفة، يرجى كتابة كلمة مرور لا تقل عن 6 أحرف.";
    case "auth/popup-closed-by-user":
      return "تم إغلاق نافذة تسجيل الدخول عبر جوجل قبل إتمام العملية.";
    case "auth/popup-blocked":
      return "تم حظر النافذة المنبثقة من قبل المتصفح، يرجى السماح بها والمحاولة مجدداً.";
    case "auth/network-request-failed":
      return "تعذر الاتصال بالإنترنت، يرجى التحقق من اتصالك والمحاولة مرة أخرى.";
    case "auth/too-many-requests":
      return "محاولات كثيرة خاطئة، تم إيقاف تسجيل الدخول مؤقتاً لحمايتك. جرّبي بعد شوية.";
    default:
      return "حدث خطأ غير متوقع أثناء تسجيل الدخول، يرجى المحاولة لاحقاً.";
  }
}

