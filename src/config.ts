export const brandConfig = {
  NAME: import.meta.env.PUBLIC_SITE_NAME || "Sến",
  DESCRIPTION:
    import.meta.env.PUBLIC_SITE_DESCRIPTION ||
    "Phụ kiện thời trang mang tinh thần Việt Nam đương đại.",
  VERSION: "0.1.0",
  AUTHOR: "Sến Studio",
  AUTHOR_EMAIL: "",
  AUTHOR_URL: "",
};

export const SITE_TITLE = brandConfig.NAME;
export const SITE_DESCRIPTION = brandConfig.DESCRIPTION;
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || "http://localhost:4321";
export const SITE_AUTHOR = brandConfig.AUTHOR;
export const SITE_LOCALE = "vi_VN";
export const SITE_THEME_COLOR = "#182ba0";

/** Default social preview image (Open Graph / Twitter). */
export const SITE_OG_IMAGE = {
  path: "/og-image.png",
  width: 1672,
  height: 941,
  alt: `${SITE_TITLE} — phụ kiện mang hồn Việt`,
  type: "image/png",
} as const;
