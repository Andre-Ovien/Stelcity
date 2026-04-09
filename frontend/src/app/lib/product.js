const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getAllProducts() {
  let allProducts = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const res = await fetch(`${BASE_URL}/api/products/categories/?category=product&page=${page}`)
    const data = await res.json()

    const mapped = data.results.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      image: p.image,
      badge: p.stock <= 3 ? "LIMITED" : null,
      rating: 5,
      slug: p.slug,
    }))

    allProducts = [...allProducts, ...mapped]
    hasMore = !!data.next
    page++
  }

  return allProducts
}

export async function getCollectionPreview(category = "all") {
  const categoryMap = {
    all: "product",
    products: "product",
    raw: "raw_material",
  }

  const mapped = categoryMap[category] || "product"
  const res = await fetch(`${BASE_URL}/api/products/categories/?category=${mapped}`)
  const data = await res.json()

  return data.results.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    image: p.image,
    badge: p.stock <= 3 ? "LIMITED" : null,
    rating: 5,
    slug: p.id,
    category: category === "raw" ? "raw-materials" : "products",
  }))
}