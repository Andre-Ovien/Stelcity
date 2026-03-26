const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const cache = {}
const pendingRequests = {}

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
    type,
  }
}

async function fetchWithDedup(key, fetchFn) {
  if (cache[key]) return cache[key]
  if (pendingRequests[key]) return pendingRequests[key]

  pendingRequests[key] = fetchFn().then((result) => {
    cache[key] = result
    delete pendingRequests[key]
    return result
  }).catch((err) => {
    delete pendingRequests[key]
    throw err
  })

  return pendingRequests[key]
}

async function fetchProducts(category) {
  return fetchWithDedup(category, async () => {
    const res = await fetch(
      `${BASE_URL}/api/products/categories/?category=${category}&page=1`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  })
}

async function fetchServiceCategories() {
  return fetchWithDedup("services", async () => {
    const res = await fetch(`${BASE_URL}/api/services/service-category/`)
    if (!res.ok) return []
    const data = await res.json()
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
  })
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
        ...products.slice(0, 4).map((p) => mapProduct(p, "product")),
        ...raw.slice(0, 4).map((p) => mapProduct(p, "raw")),
        ...services.slice(0, 4),
      ]
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

    if (category === "all") {
      const [products, raw, services] = await Promise.all([
        fetchProducts("product"),
        fetchProducts("raw_material"),
        fetchServiceCategories(),
      ])
      return [
        ...products.slice(0, 4).map((p) => mapProduct(p, "product")),
        ...raw.slice(0, 4).map((p) => mapProduct(p, "raw")),
        ...services.slice(0, 4),
      ]
    }
  } catch (err) {
    console.error("getCollectionPreview error:", err)
    return []
  }
}