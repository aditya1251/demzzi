const fs = require("fs");

async function generateDynamicUrls() {
  // use built-in fetch (no node-fetch required)
  const res = await fetch("https://www.demzzixpert.online/api/services");
  const services = await res.json();

  return services.map((service) => `/services/${service.slug}`);
}

generateDynamicUrls()
  .then((urls) => {
    fs.writeFileSync("dynamic-urls.json", JSON.stringify(urls, null, 2));
    console.log("✅ Dynamic service URLs saved in dynamic-urls.json");
  })
  .catch((err) => {
    console.error("❌ Failed to generate dynamic URLs", err);
    process.exit(0); // don’t break the Vercel build
  });
