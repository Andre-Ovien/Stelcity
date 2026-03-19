const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const cache = {}

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

async function fetchProducts(category) {
  if (cache[category]) return cache[category]

  const res = await fetch(
    `${BASE_URL}/api/products/categories/?category=${category}&page=1`
  )
  if (!res.ok) return []
  const data = await res.json()
  cache[category] = data.results || []
  return cache[category]
}

async function fetchServiceCategories() {
  if (cache["services"]) return cache["services"]

  const res = await fetch(`${BASE_URL}/api/services/add-service/`)
  if (!res.ok) return []
  const data = await res.json()

  const grouped = {}
  data.results.forEach((item) => {
    const cat = item.category_name
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(item)
  })

  const result = Object.entries(grouped).map(([category, items], index) => ({
    id: `service-${index}`,
    name: category,
    description: `${items.length} service${items.length > 1 ? "s" : ""} available`,
    price: Math.min(...items.map((i) => parseFloat(i.price))),
    priceLabel: `From ₦${Math.min(
      ...items.map((i) => parseFloat(i.price))
    ).toLocaleString()}`,
    image: null,
    badge: null,
    rating: 5,
    slug: null,
    type: "service",
  }))

  cache["services"] = result
  return result
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
        ...products.slice(0, 2).map((p) => mapProduct(p, "product")),
        ...raw.slice(0, 2).map((p) => mapProduct(p, "raw")),
        ...services.slice(0, 2),
      ]
    }

    if (category === "products") {
      const items = await fetchProducts("product")
      return items.slice(0, 6).map((p) => mapProduct(p, "product"))
    }

    if (category === "raw") {
      const items = await fetchProducts("raw_material")
      return items.slice(0, 6).map((p) => mapProduct(p, "raw"))
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