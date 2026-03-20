const BASE_URL = process.env.NEXT_PUBLIC_API_URL

let servicesCache = null

async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/api/services/service-category/`)
  if (!res.ok) return []
  const data = await res.json()
  return data.results || []
}

async function fetchItemsByCategory(categoryName) {
  const res = await fetch(
    `${BASE_URL}/api/services/add-service/?category=${encodeURIComponent(categoryName)}`
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.results || []
}

export async function getServices() {
  if (servicesCache) return servicesCache

  try {
    const categories = await fetchCategories()

    const result = await Promise.all(
      categories.map(async (cat, index) => {
        const items = await fetchItemsByCategory(cat.name)
        return {
          id: index + 1,
          category: cat.name,
          image: cat.image || null,
          items: items.map((item) => ({
            id: `${cat.name}-${item.name}`,
            name: item.name,
            price: parseFloat(item.price),
            description: item.description || null,
          })),
        }
      })
    )

    servicesCache = result
    return result
  } catch (err) {
    console.error("getServices error:", err)
    return []
  }
}