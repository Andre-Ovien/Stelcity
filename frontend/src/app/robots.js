export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/auth",
        "/cart",
        "/checkout",
        "/payment/",
        "/profile/",
        "/My-Favourites",
      ],
    },
    sitemap: "https://www.stelcity.com/sitemap.xml",
    host: "https://www.stelcity.com",
  }
}
