/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.demzzixpert.online",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,

  // 🚫 Exclude non-SEO pages
  exclude: [
    "/api/*",
    "/adminlogin",
    "/administration",
    "/unauthorized",
    "/login",
    "/signup",
    "/requests",
    "/menu"
  ],

  // Optional: add robots.txt policies
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/*", "/adminlogin", "/administration", "/unauthorized", "/login", "/signup", "/requests", "/menu"] }
    ],
  },
};
