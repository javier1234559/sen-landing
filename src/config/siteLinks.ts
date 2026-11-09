export const SITE_LINKS = {
  home: "/",
  about: "/about",
  story: "/#story",
  collection: "/#collection",
  contact: "/#footer",
  policies: {
    privacy: "/chinh-sach/bao-mat",
    payment: "/chinh-sach/thanh-toan",
    shipping: "/chinh-sach/van-chuyen",
    terms: "/chinh-sach/dieu-khoan-giao-dich",
  },
} as const;

export const CONTACT_LINKS = {
  phone: "tel:0818839999",
  phoneLabel: "081 883 9999",
  email: "mailto:sencogu@gmail.com",
  emailLabel: "sencogu@gmail.com",
} as const;

export const SOCIAL_LINKS = {
  instagram: {
    label: "Instagram sencoguu",
    href: "https://www.instagram.com/sencoguu/",
  },
  facebook: {
    label: "Facebook Sến",
    href: "https://www.facebook.com/profile.php?id=61594666451238",
  },
  tiktok: {
    label: "TikTok sencoguu",
    href: "https://www.tiktok.com/@sencoguu",
  },
} as const;
