const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const CATALOG_FETCH_OPTIONS = { next: { revalidate: 600 } }

export async function getAllRawMaterials() {
  let allProducts = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const res = await fetch(
      `${BASE_URL}/api/products/categories/?category=raw_material&page_size=100&page=${page}`,
      CATALOG_FETCH_OPTIONS
    )
    if (!res.ok) throw new Error(`Raw materials request failed with ${res.status}`)
    const data = await res.json()

    const mapped = data.results.map((p) => {
      const variants = Array.isArray(p.variants) ? p.variants : []
      const prices = variants
        .map((variant) => parseFloat(variant.price))
        .filter(Number.isFinite)
      const basePrice = parseFloat(p.price)
      const fallbackPrice = Number.isFinite(basePrice) ? basePrice : 0
      const lowestPrice = prices.length > 0 ? Math.min(...prices) : fallbackPrice
      const highestPrice = prices.length > 0 ? Math.max(...prices) : fallbackPrice

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: lowestPrice,
        priceLabel:
          prices.length > 1
            ? `₦${lowestPrice.toLocaleString()} - ₦${highestPrice.toLocaleString()}`
            : `₦${lowestPrice.toLocaleString()}`,
        variants,
        image: p.image,
        badge: p.stock <= 3 ? "LIMITED" : null,
        rating: 5,
        slug: p.slug,
      }
    })

    allProducts = [...allProducts, ...mapped]


    hasMore = !!data.next
    page++
  }

  return allProducts
}
