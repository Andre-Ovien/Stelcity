import { cachedFetch } from './apiCache'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getBestSellers() {
  try {
    const data = await cachedFetch(
      `${BASE_URL}/api/products/categories/?category=product&page=1`,
      {},
      60000 
    )

    const results = (data.results || []).slice(0, 8).map((p) => {
      const prices = p.variants?.map((v) => parseFloat(v.price)) || []
      const lowestPrice = prices.length > 0 ? Math.min(...prices) : parseFloat(p.price)
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: lowestPrice,
        rating: 5,
        image: p.image,
        slug: p.id,
        variants: p.variants || [],
      }
    })

    return results
  } catch {
    return []
  }
}