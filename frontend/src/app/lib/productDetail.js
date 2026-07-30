const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const PRODUCT_FETCH_OPTIONS = { next: { revalidate: 300 } }

export async function getProductDetail(id) {
  const res = await fetch(
    `${BASE_URL}/api/products/details/${id}/`,
    PRODUCT_FETCH_OPTIONS
  )
  if (!res.ok) {
    const error = new Error(`Product detail request failed with ${res.status}`)
    error.status = res.status
    throw error
  }

  const data = await res.json()
  const variants = Array.isArray(data?.variants)
    ? data.variants.map((variant) => ({
        id: variant?.id,
        weight: variant?.weight || "",
        price: variant?.price,
      })).filter((variant) => variant.id !== null && variant.id !== undefined)
    : []

  const isRawMaterial = data.category === "raw_material"
  const variantPrices = variants
    .map((variant) => Number.parseFloat(variant.price))
    .filter(Number.isFinite)
  const basePrice = Number.parseFloat(data?.price)
  const prices = variantPrices.length > 0
    ? variantPrices
    : Number.isFinite(basePrice) ? [basePrice] : []
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null
  const highestPrice = prices.length > 0 ? Math.max(...prices) : null
  const priceLabel = lowestPrice === null
    ? "Price unavailable"
    : isRawMaterial && prices.length > 1
      ? `₦${lowestPrice.toLocaleString()} - ₦${highestPrice.toLocaleString()}`
      : `₦${lowestPrice.toLocaleString()}`

  return {
    id: data.id,
    slug: data.slug || String(id),
    name: data.name,
    description: data.description || "",
    price: lowestPrice,
    priceLabel,
    image: typeof data.image === "string" && data.image ? data.image : null,
    variants,
    stock: Number.isFinite(Number(data.stock)) ? Number(data.stock) : null,
    category: data.category,
    isRawMaterial,
  }
}
