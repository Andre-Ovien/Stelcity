const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getAllRawMaterials() {
  let allProducts = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const res = await fetch(`${BASE_URL}/api/products/categories/?category=raw_material&page=${page}`)
    const data = await res.json()

    const mapped = data.results.map((p) => {
      const prices = p.variants.map((v) => parseFloat(v.price))
      const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0
      const highestPrice = prices.length > 0 ? Math.max(...prices) : 0

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: lowestPrice,
        priceLabel:
          prices.length > 1
            ? `₦${lowestPrice.toLocaleString()} - ₦${highestPrice.toLocaleString()}`
            : `₦${lowestPrice.toLocaleString()}`,
        variants: p.variants,
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