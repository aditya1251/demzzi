const fs = require("fs");
const fetch = require("node-fetch");

async function generateDynamicUrls() {
  const res = await fetch("https://www.demzzixpert.online/api/services");
  const services = await res.json();

  // Map service slugs -> full paths
  return services.map((service) => `/services/${service.slug}`);
}

generateDynamicUrls().then((urls) => {
  fs.writeFileSync("dynamic-urls.json", JSON.stringify(urls, null, 2));
  console.log("✅ Dynamic service URLs saved in dynamic-urls.json");
});
