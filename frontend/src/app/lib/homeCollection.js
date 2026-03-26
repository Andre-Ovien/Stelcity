import { cachedFetch } from './apiCache'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

function mapProduct(p, type) {
  const prices = p.variants?.map((v) => parseFloat(v.price)) || []
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : parseFloat(p.price)
  const highestPrice = prices.length > 0 ? Math.max(...prices) : parseFloat(p.price)

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: lowestPrice,
    priceLabel:
      prices.length > 1
        ? `₦${lowestPrice.toLocaleString()} - ₦${highestPrice.toLocaleString()}`
        : `₦${lowestPrice.toLocaleString()}`,
    image: p.image,
    badge: p.stock <= 3 ? "LIMITED" : null,
    rating: 5,
    slug: p.id,
    variants: p.variants || [],
    type,
  }
}

async function fetchProducts(category) {
  const data = await cachedFetch(
    `${BASE_URL}/api/products/categories/?category=${category}&page=1`,
    {},
    30000
  )
  return data.results || []
}

async function fetchServiceCategories() {
  const data = await cachedFetch(
    `${BASE_URL}/api/services/service-category/`,
    {},
    60000
  )
  const categories = data.results || []

  return categories.map((cat, index) => ({
    id: `service-${index}`,
    name: cat.name,
    description: null,
    price: 0,
    priceLabel: "View services",
    image: cat.image || null,
    badge: null,
    rating: 5,
    slug: null,
    type: "service",
  }))
}

export async function getCollectionPreview(category = "all") {
  try {
    if (category === "all") {
      const [products, raw, services] = await Promise.all([
        fetchProducts("product"),
        fetchProducts("raw_material"),
        fetchServiceCategories(),
      ])

      
      return [
        products[0] && mapProduct(products[0], "product"),
        products[1] && mapProduct(products[1], "product"),
        raw[0] && mapProduct(raw[0], "raw"),
        raw[1] && mapProduct(raw[1], "raw"),
        services[0],
        services[1],
        products[2] && mapProduct(products[2], "product"),
        products[3] && mapProduct(products[3], "product"),
        raw[2] && mapProduct(raw[2], "raw"),
        raw[3] && mapProduct(raw[3], "raw"),
        services[2],
        services[3],
      ].filter(Boolean)
    }

    if (category === "products") {
      const items = await fetchProducts("product")
      return items.slice(0, 12).map((p) => mapProduct(p, "product"))
    }

    if (category === "raw") {
      const items = await fetchProducts("raw_material")
      return items.slice(0, 12).map((p) => mapProduct(p, "raw"))
    }

    if (category === "services") {
      return await fetchServiceCategories()
    }

    return []
  } catch (err) {
    console.error("getCollectionPreview error:", err)
    return []
  }
}