const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const CALLBACK_URL = process.env.NEXT_PUBLIC_SQUAD_CALLBACK_URL

export async function createCheckout(items, token, state, city) {
  const res = await fetch(`${BASE_URL}/api/products/cart/checkout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ items, state, city, callback_url: CALLBACK_URL }),
  })

  if (res.status === 401) throw new Error("SESSION_EXPIRED")
  if (res.status === 502 || res.status === 503) throw new Error("Server is unavailable, please try again in a moment")

  const data = await res.json()

  if (data.authorization_url) return data

  if (data.items && Array.isArray(data.items)) {
    throw new Error(data.items[0])
  }

  throw new Error(data.detail || data.message || "Checkout failed")
}