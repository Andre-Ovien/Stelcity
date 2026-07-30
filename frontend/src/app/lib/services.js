const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const SERVICES_FETCH_OPTIONS = { next: { revalidate: 600 } }

export async function getServices() {
  const res = await fetch(
    `${BASE_URL}/api/services/all-services/`,
    SERVICES_FETCH_OPTIONS
  )
  if (!res.ok) {
    throw new Error(`Services request failed with ${res.status}`)
  }

  const data = await res.json()
  const categories = Array.isArray(data) ? data : data.results || []

  return categories.map((category) => {
    const slug = category.name.toLowerCase().trim().replace(/\s+/g, "-")
    const items = Array.isArray(category.services) ? category.services : []

    return {
      slug,
      category: category.name,
      description: category.description || null,
      image: category.image || null,
      items: items.map((item, index) => ({
        id: `${slug}-${index}`,
        name: item.name,
        price: Number.parseFloat(item.price),
        description: item.description || null,
      })),
    }
  })
}
