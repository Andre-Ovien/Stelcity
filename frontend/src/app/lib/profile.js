const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getShippingAddress(token) {
  const res = await fetch(`${BASE_URL}/api/auth/shipping-address/`, {
    headers: { "Authorization": `Bearer ${token}` },
  })
  if (res.status === 401) return null
  if (!res.ok) return null
  const data = await res.json()
  return data
}

export async function saveShippingAddress(addressData, token) {
  const res = await fetch(`${BASE_URL}/api/auth/shipping-address/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  })
  const data = await res.json()
  if (res.status === 401) throw new Error("Your session has expired. Please log in again.")
  if (!res.ok) throw new Error(data.detail || "Failed to save address")
  return data
}

export async function updateShippingAddress(addressData, token) {
  const res = await fetch(`${BASE_URL}/api/auth/shipping-address/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  })
  const data = await res.json()
  if (res.status === 401) throw new Error("Your session has expired. Please log in again.")
  if (!res.ok) throw new Error(data.detail || "Failed to update address")
  return data
}

export async function getProfile(token) {
  const res = await fetch(`${BASE_URL}/api/auth/profile/`, {
    headers: { "Authorization": `Bearer ${token}` },
  })
  if (res.status === 401) return null
  if (!res.ok) return null
  return await res.json()
}

export async function updateProfile(profileData, token) {
  const res = await fetch(`${BASE_URL}/api/auth/profile/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  })
  const data = await res.json()
  if (res.status === 401) throw new Error("Your session has expired. Please log in again.")
  if (!res.ok) throw new Error(data.detail || "Failed to update profile")
  return data
}

export async function getOrders(token) {
  const res = await fetch(`${BASE_URL}/api/products/orders/`, {
    headers: { "Authorization": `Bearer ${token}` },
  })
  if (res.status === 401) return []
  if (!res.ok) return []
  const data = await res.json()
  if (Array.isArray(data)) return data
  if (data.results && Array.isArray(data.results)) return data.results
  return []
}