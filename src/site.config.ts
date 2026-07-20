interface SiteConfig {
  author: string;
  title: string;
  description: string;
  lang: string;
  ogLocale: string;
  themeColorLight: string;
  themeColorDark: string;
  date: {
    locale: string | string[] | undefined;
    options: Intl.DateTimeFormatOptions;
  };
}

export const siteConfig: SiteConfig = {
  author: "Sunil Pai",
  title: "Solving the decision problem",
  description: "From the desk of Sunil Pai",
  lang: "en-GB",
  ogLocale: "en_GB",
  themeColorLight: "#f8f6f0",
  themeColorDark: "#1c1d1c",
  date: {
    locale: "en-GB",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
};
