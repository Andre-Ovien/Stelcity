const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getShippingAddress(token) {
  const res = await fetch(`${BASE_URL}/api/auth/shipping-address/`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  if (res.status === 401) throw new Error("SESSION_EXPIRED")
  if (!res.ok) return null
  return await res.json()
}

export async function saveShippingAddress(addressData, token) {
  const res = await fetch(`${BASE_URL}/api/auth/shipping-address/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  })
  if (res.status === 401) throw new Error("SESSION_EXPIRED")
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "Failed to save address")
  
  
  try {
    localStorage.removeItem("stelcity_shipping_address")
  } catch {}
  
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
  if (res.status === 401) throw new Error("SESSION_EXPIRED")
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "Failed to update address")
  

  try {
    localStorage.removeItem("stelcity_shipping_address")
  } catch {}
  
  return data
}

export async function getProfile(token) {
  const res = await fetch(`${BASE_URL}/api/auth/profile/`, {
    headers: { "Authorization": `Bearer ${token}` },
  })
  if (res.status === 401) throw new Error("SESSION_EXPIRED")
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
  if (res.status === 401) throw new Error("SESSION_EXPIRED")
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "Failed to update profile")
  return data
}

export async function getOrders(token) {
  const res = await fetch(`${BASE_URL}/api/products/orders/`, {
    headers: { "Authorization": `Bearer ${token}` },
  })
  if (res.status === 401) throw new Error("SESSION_EXPIRED")
  if (!res.ok) return []
  const data = await res.json()
  if (Array.isArray(data)) return data
  if (data.results && Array.isArray(data.results)) return data.results
  return []
}