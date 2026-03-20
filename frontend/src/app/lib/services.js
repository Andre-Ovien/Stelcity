
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

let servicesCache = null

const categoryDescriptions = {
  "Body wash": "Refreshing full-body cleansing treatments designed to remove impurities and leave your skin smooth.",
  "Dental Care": "Professional oral care services focused on maintaining healthy teeth and gums.",
  "Removal": "Hair and unwanted growth removal services using safe and effective methods.",
  "Facial treatment": "Specialized skincare treatments designed to cleanse, hydrate, and rejuvenate the face.",
  "Massage": "Relaxing and therapeutic massage services aimed at relieving muscle tension.",
  "Advanced aesthetics": "High-level cosmetic treatments that use modern techniques to enhance skin quality.",
}

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
          description: cat.description || categoryDescriptions[cat.name] || `Professional ${cat.name.toLowerCase()} services.`,
          image: cat.image || null,
          items: items.map((item) => ({
            id: `${cat.name}-${item.name}`,
            name: item.name,
            price: parseFloat(item.price),
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