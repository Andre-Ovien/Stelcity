export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
      ],
    },
    sitemap: "https://www.stelcity.com/sitemap.xml",
    host: "https://www.stelcity.com",
  }
}
