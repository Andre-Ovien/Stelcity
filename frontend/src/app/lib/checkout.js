const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function createCheckout(items, token) {
  const res = await fetch(`${BASE_URL}/api/products/cart/checkout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  })

  const data = await res.json()

  if (data.authorization_url) {
    return data
  }

  throw new Error(data.detail || data.message || "Checkout failed")
}