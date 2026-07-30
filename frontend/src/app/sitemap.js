import { blogPosts } from "./lib/blogPosts"
import { getAllProducts } from "./lib/product"
import { getAllRawMaterials } from "./lib/rawMaterials"
import { getServices } from "./lib/services"
import { SITE_URL } from "./lib/site"

export const revalidate = 3600

export default async function sitemap() {
  const staticPages = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/products", changeFrequency: "daily", priority: 0.9 },
    { path: "/raw-materials", changeFrequency: "daily", priority: 0.9 },
    { path: "/our-services", changeFrequency: "weekly", priority: 0.8 },
    { path: "/training-programs", changeFrequency: "monthly", priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/skincare-in-lagos", changeFrequency: "monthly", priority: 0.8 },
  ].map(({ path, ...entry }) => ({
    url: `${SITE_URL}${path}`,
    ...entry,
  }))

  // A failed catalogue request must fail sitemap regeneration. Returning a
  // successful but incomplete sitemap can make healthy URLs disappear from
  // the next cached sitemap during a temporary API outage.
  const [products, rawMaterials, services] = await Promise.all([
    getAllProducts(),
    getAllRawMaterials(),
    getServices(),
  ])

  const productPages = products
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

  const rawMaterialPages = rawMaterials
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${SITE_URL}/raw-materials/${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

  const servicePages = services
    .filter((service) => service.slug)
    .map((service) => ({
      url: `${SITE_URL}/our-services/${service.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

  const blogPages = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...productPages,
    ...rawMaterialPages,
    ...servicePages,
    ...blogPages,
  ]
}
