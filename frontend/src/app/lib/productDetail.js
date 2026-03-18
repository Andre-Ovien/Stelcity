const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProductDetail(id) {
  const res = await fetch(`${BASE_URL}/api/products/details/${id}/`)
  const data = await res.json()

  const isRawMaterial = data.category === "raw_material"
  const prices = data.variants.map((v) => parseFloat(v.price))
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : parseFloat(data.price)
  const highestPrice = prices.length > 0 ? Math.max(...prices) : parseFloat(data.price)

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: lowestPrice,
    priceLabel: isRawMaterial && prices.length > 1
      ? `₦${lowestPrice.toLocaleString()} - ₦${highestPrice.toLocaleString()}`
      : `₦${lowestPrice.toLocaleString()}`,
    image: data.image,
    variants: data.variants,
    stock: data.stock,
    category: data.category,
    isRawMaterial,
    badge: data.stock <= 3 ? "LIMITED" : null,
  }
}