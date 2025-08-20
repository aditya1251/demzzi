const fs = require("fs");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.demzzixpert.online",
  generateRobotsTxt: true,
  sitemapSize: 5000,

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

  additionalPaths: async (config) => {
    // Read dynamic urls from file
    const dynamicUrls = JSON.parse(fs.readFileSync("./dynamic-urls.json"));

    return dynamicUrls.map((url) => ({
      loc: url,
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    }));
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: "*",
        disallow: [
          "/api/*",
          "/adminlogin",
          "/administration",
          "/unauthorized",
          "/login",
          "/signup",
          "/requests",
          "/menu"
        ],
      },
    ],
    additionalSitemaps: [
      "https://www.demzzixpert.online/sitemap.xml",
    ],
  },
};
