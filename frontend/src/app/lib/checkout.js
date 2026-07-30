import { authenticatedFetch } from "./authenticatedFetch"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const CALLBACK_URL = process.env.NEXT_PUBLIC_SQUAD_CALLBACK_URL

export async function createCheckout(items, token, fulfillmentType, state, city) {
  const body = {
    items,
    fulfillment_type: fulfillmentType,
    callback_url: CALLBACK_URL,
  }

  
  if (fulfillmentType === "delivery") {
    body.state = state
    body.city = city
  }

  const res = await authenticatedFetch(`${BASE_URL}/api/products/cart/checkout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }, token)

  if (res.status === 502 || res.status === 503) throw new Error("Server is unavailable, please try again in a moment")

  const data = await res.json().catch(() => ({}))

  if (data.authorization_url) return data

  if (data.items && Array.isArray(data.items)) {
    throw new Error(data.items[0])
  }

  throw new Error(data.detail || data.message || "Checkout failed")
}
